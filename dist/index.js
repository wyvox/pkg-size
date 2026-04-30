import assert from 'assert';
import { startGroup, info, endGroup, setOutput, warning, debug, getInput, setFailed } from '@actions/core';
import { getOctokit, context } from '@actions/github';
import byteSize from 'byte-size';
import { markdownTable } from 'markdown-table';
import outdent from 'outdent';
import { partition, round } from 'lodash-es';
import globToRegExp from 'glob-to-regexp';
import { exec as exec$1 } from '@actions/exec';
import fs from 'fs';
import path from 'path';
import { rmRF } from '@actions/io';

const c = (string) => `\`${string}\``;
const link = (text, href) => `[${text}](${href})`;
const sub = (string) => `<sub>${string}</sub>`;
const sup = (string) => `<sup>${string}</sup>`;
const strong = (string) => `**${string}**`;

async function upsertComment({
  token,
  commentSignature,
  repo,
  prNumber,
  body
}) {
  startGroup("Comment on PR");
  body += `

${commentSignature}`;
  const octokit = getOctokit(token);
  info("Getting list of comments");
  const { data: comments } = await octokit.rest.issues.listComments({
    ...repo,
    issue_number: prNumber
  });
  const hasPreviousComment = comments.find((comment) => comment.body.endsWith(commentSignature));
  if (hasPreviousComment) {
    info(`Updating previous comment ID ${hasPreviousComment.id}`);
    await octokit.rest.issues.updateComment({
      ...repo,
      comment_id: hasPreviousComment.id,
      body
    });
  } else {
    info("Posting new comment");
    await octokit.rest.issues.createComment({
      ...repo,
      issue_number: prNumber,
      body
    });
  }
  endGroup();
}

function partionHidden(hideFilesGlob, files) {
  if (!hideFilesGlob) {
    return [[], files];
  }
  const hideFilesPtrn = globToRegExp(hideFilesGlob, { extended: true });
  return partition(files, (file) => hideFilesPtrn.test(file.path));
}
function createStripHash(regex) {
  if (!regex) {
    return void 0;
  }
  const pattern = new RegExp(regex);
  return function(filePath) {
    return filePath.replace(pattern, (str, ...hashes) => {
      hashes = hashes.slice(0, -2).filter((c) => c != null);
      if (hashes.length) {
        for (let i = 0; i < hashes.length; i++) {
          const hash = hashes[i] || "";
          str = str.replace(hash, "*".repeat(hash.length));
        }
        return str;
      }
      return "";
    });
  };
}
function getSizeLabels(displaySizes) {
  if (displaySizes.length === 1 && displaySizes[0].property === "size") {
    return "";
  }
  return ` (${displaySizes.map((s) => s.label).join(" / ")})`;
}
const supportedSizes = {
  uncompressed: {
    label: "Size",
    property: "size"
  },
  gzip: {
    label: "Gzip",
    property: "sizeGzip"
  },
  brotli: {
    label: "Brotli",
    property: "sizeBrotli"
  }
};
function parseDisplaySize(displaySize) {
  return displaySize.split(",").map((s) => s.trim()).filter((s) => supportedSizes.hasOwnProperty(s)).map((s) => supportedSizes[s]);
}
const listSizes = (displaySizes, callback) => displaySizes.map(({ property }) => callback(property)).join(" / ");
function sortFiles(files, sortBy, sortOrder) {
  files.sort((a, b) => b[sortBy] - a[sortBy] || a.path.localeCompare(b.path));
  if (sortOrder === "asc") {
    files.reverse();
  }
}

const percent = (fraction) => {
  if (fraction < 1e-3) {
    fraction = round(fraction, 4);
  } else if (fraction < 0.01) {
    fraction = round(fraction, 3);
  } else {
    fraction = round(fraction, 2);
  }
  return fraction.toLocaleString(void 0, {
    style: "percent",
    maximumSignificantDigits: 3
  });
};
function calculateDiffBy(head, base, property) {
  const delta = head[property] - base[property];
  return {
    delta,
    percent: percent(delta / base[property])
  };
}
function calculateDiff(head, base) {
  return {
    size: calculateDiffBy(head, base, "size"),
    sizeGzip: calculateDiffBy(head, base, "sizeGzip"),
    sizeBrotli: calculateDiffBy(head, base, "sizeBrotli")
  };
}
function processPkgFiles(fileMap, type, pkgData, normalizeFilePath) {
  for (const file of pkgData.files) {
    const key = normalizeFilePath ? normalizeFilePath(file.path) : file.path;
    if (!fileMap[key]) {
      fileMap[key] = {
        path: file.path,
        label: file.label
      };
    }
    const entry = fileMap[key];
    entry[type] = file;
    if (entry.head && entry.base) {
      entry.diff = calculateDiff(entry.head, entry.base);
    }
  }
}
function comparePackages(head, base, {
  sortBy,
  sortOrder,
  hideFiles,
  ignoreThreshold = 100,
  stripHash
} = {}) {
  const fileMap = {};
  const normalizeFilePath = createStripHash(stripHash);
  processPkgFiles(fileMap, "head", head, normalizeFilePath);
  processPkgFiles(fileMap, "base", base, normalizeFilePath);
  const allFiles = Object.values(fileMap);
  sortFiles(allFiles, sortBy, sortOrder);
  const [hidden, files] = partionHidden(hideFiles, allFiles);
  const [unchanged, changed] = partition(
    files,
    (file) => file.diff && file.diff.size && Math.abs(file.diff.size.delta) < ignoreThreshold
  );
  return {
    head,
    base,
    diff: {
      ...calculateDiff(head, base),
      tarballSize: calculateDiffBy(head, base, "tarballSize")
    },
    files: {
      changed,
      unchanged,
      hidden
    }
  };
}

const directionSymbol = (value) => {
  if (value < 0) {
    return "\u2193";
  }
  if (value > 0) {
    return "\u2191";
  }
  return "";
};
const formatDelta = ({ delta, percent }) => delta ? percent + directionSymbol(delta) : "";
const AUTO_COLLAPSE_THRESHOLD$1 = 20;
function generateComment({
  headPkgData,
  basePkgData,
  sortBy,
  sortOrder,
  hideFiles,
  unchangedFiles,
  displaySize,
  ignoreThreshold,
  autoCollapse,
  stripHash,
  title,
  includeTarball = true
}) {
  const regressionData = comparePackages(headPkgData, basePkgData, {
    sortBy,
    sortOrder,
    hideFiles,
    ignoreThreshold,
    stripHash
  });
  setOutput("regressionData", regressionData);
  const { changed, unchanged, hidden } = regressionData.files;
  const displaySizes = parseDisplaySize(displaySize);
  const sizeHeadingLabel = getSizeLabels(displaySizes);
  const fileRows = [
    ...changed,
    ...unchangedFiles === "show" ? unchanged : []
  ];
  const mapFileRow = (file) => [
    file.label,
    file.base && file.base.size ? listSizes(displaySizes, (p) => c(byteSize(file.base[p]))) : "\u2014",
    file.head && file.head.size ? listSizes(
      displaySizes,
      (p) => (file.base && file.base[p] ? sup(formatDelta(file.diff[p])) : "") + c(byteSize(file.head[p]))
    ) : "\u2014"
  ];
  const totalRows = [
    [
      `${strong("Total")} ${unchangedFiles === "show" ? "" : sub("_(Includes all files)_")}`,
      listSizes(displaySizes, (p) => c(byteSize(regressionData.base[p]))),
      listSizes(displaySizes, (p) => sup(formatDelta(regressionData.diff[p])) + c(byteSize(regressionData.head[p])))
    ],
    ...includeTarball ? [[
      strong("Tarball size"),
      c(byteSize(regressionData.base.tarballSize)),
      sup(formatDelta(regressionData.diff.tarballSize)) + c(byteSize(regressionData.head.tarballSize))
    ]] : []
  ];
  const shouldAutoCollapse = autoCollapse && fileRows.length > AUTO_COLLAPSE_THRESHOLD$1;
  let table;
  let autoCollapseSection = "";
  if (shouldAutoCollapse) {
    table = markdownTable([
      ["File", `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
      ...totalRows
    ], {
      align: ["", "r", "r"]
    });
    const filesTable = markdownTable([
      ["File", `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
      ...fileRows.map(mapFileRow)
    ], {
      align: ["", "r", "r"]
    });
    autoCollapseSection = `<details><summary>Show files (${fileRows.length} files)</summary>

${filesTable}
</details>`;
  } else {
    table = markdownTable([
      ["File", `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
      ...fileRows.map(mapFileRow),
      ...totalRows
    ], {
      align: ["", "r", "r"]
    });
  }
  let unchangedTable = "";
  if (unchangedFiles === "collapse" && unchanged.length > 0) {
    unchangedTable = markdownTable([
      ["File", `Size${sizeHeadingLabel}`],
      ...unchanged.map((file) => [
        file.label,
        listSizes(displaySizes, (p) => c(byteSize(file.base[p])))
      ])
    ], {
      align: ["", "r"]
    });
    unchangedTable = `<details><summary>Unchanged files</summary>

${unchangedTable}
</details>`;
  }
  let hiddenTable = "";
  if (hidden.length > 0) {
    hiddenTable = markdownTable([
      ["File", `Before${sizeHeadingLabel}`, `After${sizeHeadingLabel}`],
      ...hidden.map((file) => [
        file.label,
        file.base && file.base.size ? listSizes(displaySizes, (p) => c(byteSize(file.base[p]))) : "\u2014",
        file.head && file.head.size ? listSizes(
          displaySizes,
          (p) => (file.base && file.base[p] ? sup(formatDelta(file.diff[p])) : "") + c(byteSize(file.head[p]))
        ) : "\u2014"
      ])
    ], {
      align: ["", "r", "r"]
    });
    hiddenTable = `<details><summary>Hidden files</summary>

${hiddenTable}
</details>`;
  }
  const heading = title || "\u{1F4CA} Package size report";
  return outdent`
	### ${heading}&nbsp;&nbsp;&nbsp;<kbd>${formatDelta(regressionData.diff.size) || "No changes"}</kbd>

	${table}

	${autoCollapseSection}

	${unchangedTable}

	${hiddenTable}
	`;
}

const AUTO_COLLAPSE_THRESHOLD = 20;
function headOnly({
  headPkgData,
  hideFiles,
  displaySize,
  sortBy,
  sortOrder,
  autoCollapse,
  title,
  includeTarball = true
}) {
  const displaySizes = parseDisplaySize(displaySize);
  const sizeHeadingLabel = getSizeLabels(displaySizes);
  sortFiles(headPkgData.files, sortBy, sortOrder);
  const [hidden, files] = partionHidden(hideFiles, headPkgData.files);
  const mapFileRow = (file) => [
    file.label,
    listSizes(displaySizes, (p) => c(byteSize(file[p])))
  ];
  const totalRows = [
    [
      strong("Total"),
      listSizes(displaySizes, (p) => c(byteSize(headPkgData[p])))
    ],
    ...includeTarball ? [[
      strong("Tarball size"),
      c(byteSize(headPkgData.tarballSize))
    ]] : []
  ];
  const shouldAutoCollapse = autoCollapse && files.length > AUTO_COLLAPSE_THRESHOLD;
  let table;
  let autoCollapseSection = "";
  if (shouldAutoCollapse) {
    table = markdownTable([
      ["File", `Size${sizeHeadingLabel}`],
      ...totalRows
    ], {
      align: ["", "r"]
    });
    const filesTable = markdownTable([
      ["File", `Size${sizeHeadingLabel}`],
      ...files.map(mapFileRow)
    ], {
      align: ["", "r"]
    });
    autoCollapseSection = `<details><summary>Show files (${files.length} files)</summary>

${filesTable}
</details>`;
  } else {
    table = markdownTable([
      ["File", `Size${sizeHeadingLabel}`],
      ...files.map(mapFileRow),
      ...totalRows
    ], {
      align: ["", "r"]
    });
  }
  let hiddenTable = "";
  if (hidden.length > 0) {
    hiddenTable = markdownTable([
      ["File", `Size${sizeHeadingLabel}`],
      ...hidden.map((file) => [
        file.label,
        listSizes(displaySizes, (p) => c(byteSize(file[p])))
      ])
    ], {
      align: ["", "r"]
    });
    hiddenTable = `<details><summary>Hidden files</summary>

${hiddenTable}
</details>`;
  }
  return outdent`
	### ${title || "\u{1F4CA} Package size report"}

	${table}

	${autoCollapseSection}

	${hiddenTable}
	`;
}

async function exec(command, options) {
  let stdout = "";
  let stderr = "";
  const startTime = Date.now();
  const exitCode = await exec$1(command, null, {
    ...options,
    silent: true,
    listeners: {
      stdout(data) {
        stdout += data.toString();
      },
      stderr(data) {
        stderr += data.toString();
      }
    }
  });
  const duration = Date.now() - startTime;
  return {
    exitCode,
    duration,
    stdout,
    stderr
  };
}

async function isBaseDiffFromHead(baseRef) {
  try {
    await exec(`git fetch origin ${baseRef} --depth=1`);
  } catch (error) {
    throw new Error(`Failed to git fetch ${baseRef} ${error.message}`);
  }
  const { exitCode } = await exec(`git diff --quiet origin/${baseRef}`, { ignoreReturnCode: true });
  return exitCode !== 0;
}

async function npmCi({ cwd } = {}) {
  if (fs.existsSync("node_modules")) {
    info("Cleaning node_modules");
    await rmRF(path.join(cwd, "node_modules"));
  }
  const options = {
    cwd,
    ignoreReturnCode: true
  };
  let installCommand = "";
  if (fs.existsSync("package-lock.json")) {
    info("Installing dependencies with npm");
    installCommand = "npm ci";
  } else if (fs.existsSync("yarn.lock")) {
    info("Installing dependencies with yarn");
    installCommand = "yarn install --frozen-lockfile";
  } else if (fs.existsSync("pnpm-lock.yaml")) {
    info("Installing dependencies with pnpm");
    installCommand = "npx pnpm i --frozen-lockfile";
  } else {
    info("No lock file detected. Installing dependencies with npm");
    installCommand = "npm i";
  }
  const { exitCode, stdout, stderr } = await exec(installCommand, options);
  if (exitCode > 0) {
    throw new Error(`${stderr}
${stdout}`);
  }
}

async function isFileTracked(filePath) {
  const { exitCode } = await exec(`git ls-files --error-unmatch ${filePath}`, { ignoreReturnCode: true });
  return exitCode === 0;
}

let pkgSizeInstalled = false;
async function buildRef({
  checkoutRef,
  refData,
  buildCommand
}) {
  const cwd = process.cwd();
  info(`Current working directory: ${cwd}`);
  if (checkoutRef) {
    info(`Checking out ref '${checkoutRef}'`);
    await exec(`git checkout -f ${checkoutRef}`);
  }
  if (buildCommand !== "false") {
    if (!buildCommand) {
      let pkgJson;
      try {
        pkgJson = JSON.parse(fs.readFileSync("./package.json"));
      } catch (error) {
        warning("Error reading package.json", error);
      }
      if (pkgJson && pkgJson.scripts && pkgJson.scripts.build) {
        info("Build script found in package.json");
        buildCommand = "npm run build";
      }
    }
    if (buildCommand) {
      await npmCi({ cwd }).catch((error) => {
        throw new Error(`Failed to install dependencies:
${error.message}`);
      });
      info(`Running build command: ${buildCommand}`);
      const buildStart = Date.now();
      await exec(buildCommand, { cwd }).catch((error) => {
        throw new Error(`Failed to run build command: ${buildCommand}
${error.message}`);
      });
      info(`Build completed in ${(Date.now() - buildStart) / 1e3}s`);
    }
  }
  if (!pkgSizeInstalled) {
    info("Installing pkg-size globally");
    await exec("npm i -g pkg-size");
    pkgSizeInstalled = true;
  }
  info("Getting package size");
  const result = await exec("pkg-size --json", { cwd }).catch((error) => {
    throw new Error(`Failed to determine package size: ${error.message}`);
  });
  debug(JSON.stringify(result, null, 4));
  const pkgData = {
    ...JSON.parse(result.stdout),
    ref: refData,
    size: 0,
    sizeGzip: 0,
    sizeBrotli: 0
  };
  await Promise.all(pkgData.files.map(async (file) => {
    pkgData.size += file.size;
    pkgData.sizeGzip += file.sizeGzip;
    pkgData.sizeBrotli += file.sizeBrotli;
    const isTracked = await isFileTracked(file.path);
    file.isTracked = isTracked;
    file.label = isTracked ? link(c(file.path), `${refData.repo.html_url}/blob/${refData.ref}/${file.path}`) : c(file.path);
  }));
  info("Cleaning up");
  await exec("git reset --hard");
  const { stdout: cleanList } = await exec("git clean -dfx");
  debug(cleanList);
  return pkgData;
}

function parsePathsInput(input) {
  if (!input) {
    return [];
  }
  const entries = [];
  for (const rawLine of String(input).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }
    const prefix = line.replace(/\/+$/, "");
    if (!prefix) {
      continue;
    }
    entries.push({ label: prefix, prefix });
  }
  return entries;
}
function matchesPrefix(filePath, prefix) {
  if (!prefix) {
    return false;
  }
  if (filePath === prefix) {
    return true;
  }
  return filePath.startsWith(`${prefix}/`);
}
function slicePkgData(pkgData, prefix) {
  const files = pkgData.files.filter((file) => matchesPrefix(file.path, prefix));
  let size = 0;
  let sizeGzip = 0;
  let sizeBrotli = 0;
  for (const file of files) {
    size += file.size || 0;
    sizeGzip += file.sizeGzip || 0;
    sizeBrotli += file.sizeBrotli || 0;
  }
  return {
    ...pkgData,
    files,
    size,
    sizeGzip,
    sizeBrotli
  };
}

function renderHeadOnly(headPkgData, opts, paths) {
  const {
    displaySize,
    sortBy,
    sortOrder,
    hideFiles,
    autoCollapse
  } = opts;
  if (!paths || paths.length === 0) {
    return headOnly({
      headPkgData,
      displaySize,
      sortBy,
      sortOrder,
      hideFiles,
      autoCollapse
    });
  }
  const sections = paths.map(({ label, prefix }) => headOnly({
    headPkgData: slicePkgData(headPkgData, prefix),
    displaySize,
    sortBy,
    sortOrder,
    hideFiles,
    autoCollapse,
    title: `\u{1F4CA} Package size report \u2014 ${label}`,
    includeTarball: false
  }));
  sections.push(`**Tarball size:** ${byteSize(headPkgData.tarballSize)}`);
  return sections.join("\n\n---\n\n");
}
function renderRegression(headPkgData, basePkgData, opts, paths) {
  const {
    displaySize,
    sortBy,
    sortOrder,
    hideFiles,
    unchangedFiles,
    ignoreThreshold,
    autoCollapse,
    stripHash
  } = opts;
  if (!paths || paths.length === 0) {
    return generateComment({
      headPkgData,
      basePkgData,
      displaySize,
      sortBy,
      sortOrder,
      hideFiles,
      unchangedFiles,
      ignoreThreshold,
      autoCollapse,
      stripHash
    });
  }
  const sections = paths.map(({ label, prefix }) => generateComment({
    headPkgData: slicePkgData(headPkgData, prefix),
    basePkgData: slicePkgData(basePkgData, prefix),
    displaySize,
    sortBy,
    sortOrder,
    hideFiles,
    unchangedFiles,
    ignoreThreshold,
    autoCollapse,
    stripHash,
    title: `\u{1F4CA} Package size report \u2014 ${label}`,
    includeTarball: false
  }));
  const headTarball = headPkgData.tarballSize;
  const baseTarball = basePkgData.tarballSize;
  const tarballDelta = headTarball - baseTarball;
  const tarballNote = tarballDelta === 0 ? `**Tarball size:** ${byteSize(headTarball)} (no change)` : `**Tarball size:** ${byteSize(headTarball)} (was ${byteSize(baseTarball)}, ${tarballDelta > 0 ? "+" : "-"}${byteSize(Math.abs(tarballDelta))})`;
  sections.push(tarballNote);
  return sections.join("\n\n---\n\n");
}
async function generateSizeReport({
  pr,
  buildCommand,
  commentReport,
  mode,
  unchangedFiles,
  hideFiles,
  sortBy,
  sortOrder,
  displaySize,
  ignoreThreshold,
  autoCollapse,
  stripHash,
  paths
}) {
  startGroup("Build HEAD");
  const headPkgData = await buildRef({
    refData: pr.head,
    buildCommand
  });
  setOutput("headPkgData", headPkgData);
  endGroup();
  const opts = {
    unchangedFiles,
    hideFiles,
    sortBy,
    sortOrder,
    displaySize,
    ignoreThreshold,
    autoCollapse,
    stripHash
  };
  if (mode === "head-only") {
    if (paths && paths.length > 0) {
      setOutput("pathsReports", paths.map(({ label, prefix }) => ({
        label,
        prefix,
        head: slicePkgData(headPkgData, prefix)
      })));
    }
    if (commentReport !== "false") {
      return renderHeadOnly(headPkgData, opts, paths);
    }
    return false;
  }
  const { ref: baseRef } = pr.base;
  let basePkgData;
  if (await isBaseDiffFromHead(baseRef)) {
    info("HEAD is different from BASE. Triggering build.");
    startGroup("Build BASE");
    basePkgData = await buildRef({
      checkoutRef: baseRef,
      refData: pr.base,
      buildCommand
    });
    endGroup();
  } else {
    info("HEAD is identical to BASE. Skipping base build.");
    basePkgData = {
      ...headPkgData,
      ref: pr.base
    };
  }
  setOutput("basePkgData", basePkgData);
  if (paths && paths.length > 0) {
    setOutput("pathsReports", paths.map(({ label, prefix }) => ({
      label,
      prefix,
      head: slicePkgData(headPkgData, prefix),
      base: slicePkgData(basePkgData, prefix)
    })));
  }
  if (commentReport !== "false") {
    return renderRegression(headPkgData, basePkgData, opts, paths);
  }
  return false;
}

const COMMENT_SIGNATURE = sub("\u{1F916} This report was automatically generated by [pkg-size-action](https://github.com/pkg-size/action/)");
(async () => {
  const { GITHUB_TOKEN } = process.env;
  assert(GITHUB_TOKEN, 'Environment variable "GITHUB_TOKEN" not set. Required for accessing and reporting on the PR.');
  const { pull_request: pr } = context.payload;
  const sizeReport = await generateSizeReport({
    pr,
    buildCommand: getInput("build-command"),
    commentReport: getInput("comment-report"),
    mode: getInput("mode") || "regression",
    unchangedFiles: getInput("unchanged-files") || "collapse",
    hideFiles: getInput("hide-files"),
    sortBy: getInput("sort-by") || "delta",
    sortOrder: getInput("sort-order") || "desc",
    displaySize: getInput("display-size") || "uncompressed",
    ignoreThreshold: Number(getInput("ignore-threshold") || 100),
    autoCollapse: getInput("auto-collapse") !== "false",
    stripHash: (() => {
      const input = getInput("strip-hash");
      if (input === "false") {
        return "";
      }
      return input || "[.-]([0-9a-zA-Z_-]{8,})[.-]";
    })(),
    paths: parsePathsInput(getInput("paths"))
  });
  await exec(`git checkout -f ${context.sha}`);
  if (sizeReport) {
    const isFork = pr.head.repo && pr.head.repo.full_name !== pr.base.repo.full_name;
    if (isFork) {
      startGroup("\u{1F4CB} Size Report (fork PR \u2014 copy to post as a comment)");
      info(`${sizeReport}

${COMMENT_SIGNATURE}`);
      endGroup();
      warning(
        'This PR is from a fork. GitHub Actions restricts write access for fork PRs, so the size report could not be posted as a comment automatically.\nTo share the report, copy the content from the "Size Report" group above and post it as a comment on the PR.'
      );
    } else {
      await upsertComment({
        token: GITHUB_TOKEN,
        commentSignature: COMMENT_SIGNATURE,
        repo: context.repo,
        prNumber: pr.number,
        body: sizeReport
      });
    }
  }
})().catch((error) => {
  setFailed(error.message);
  warning(error.stack);
});
