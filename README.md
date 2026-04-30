<p align="center"> 
  <img src="/.github/logo.svg" width="112px">
</p>

<h1 align="center">pkg-size action</h1>

[pkg-size-action](https://github.com/pkg-size/action) is a [GitHub Action](https://github.com/features/actions) for getting automated size reports on your pull-requests.

<p align="center">
  <img src="/.github/screenshot.png" width="80%">
</p>

<sub>If you like this project, please star it & [follow me](https://github.com/privatenumber) to see what other cool projects I'm working on! ❤️</sub>


## ⭐️ Features
- 📦 **Auto-detects npm distribution assets** using [pkg-size](https://github.com/pkg-size/pkg-size)
- 🔥 **Node.js package installer agnostic** Supports auto lock-file installs from npm, yarn, pnpm
- 🗜 **See compression sizes** Option to show uncompressed, Gzip, and Brotli size
- ⚙️ **Configurable** Change the build command. Customize reports formats. Filter out unwanted files. 

## 🚦 3-step setup

1. Create the following file in your repo: `.github/workflows/package-size-report.yml`:

    ```yaml
    name: Package Size Report

    on:
      pull_request:
        branches: [ master, develop ] # ⬅ Add other branches you want size checks on

    jobs:
      pkg-size-report:
        name: Package Size Report
        runs-on: ubuntu-latest

        steps:
          - name: Checkout
            uses: actions/checkout@v2

          - name: Setup Node.js
            uses: actions/setup-node@v2
            with:
              node-version: '14' # ⬅ Specify a version of Node.js to build your app

          - name: Package size report
            uses: pkg-size/action@v1
            env:
              GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    ```

2. Try making a PR against one of the designated branches.

3. 📊 Get the pkg-size report as a comment on the PR!

	You'll see a comment on your PR reporting the package size regression. This comment will be automatically updated as you push changes to your PR.


## 👨🏻‍🏫 Examples

<details>
  <summary><strong>Set a custom command to build</strong></summary>
  <br>

The default behavior detects whether `npm run build` exists. If not, it assumes your repo doesn't have a build step and won't try to install dependencies.

If your repo has a different build script, specify one with `build-command`. Disable building by passing in `false`.

```yaml
name: Package Size Report

on:
  pull_request:
    branches: [ master, develop ]

jobs:
  pkg-size-report:
    name: Package Size Report
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Package size report
        uses: pkg-size/action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          build-command: npm run prod-build # ⬅ Set a different build script here
```
</details>

<details>
  <summary><strong>Specify node version</strong></summary>
  <br>

By default, `ubuntu-latest` has the latest version of node available. If your
repo needs to specify an exact version of node, you can use the `actions/setup-node` action.

```yaml
name: Package Size Report

on:
  pull_request:
    branches: [ master, develop ]

jobs:
  pkg-size-report:
    name: Package Size Report
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14.4.0'

      - name: Package size report
        uses: pkg-size/action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
</details>

<details>
  <summary><strong>Hiding source-map changes from report</strong></summary>
  <br>
  
Source-maps might add unnecessary noise to your report. Hide them using a glob.

```yaml
name: Package Size Report

on:
  pull_request:
    branches: [ master, develop ]

jobs:
  pkg-size-report:
    name: Package Size Report
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Package size report
        uses: pkg-size/action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          hide-files: '*.{js,css}.map' # Set a glob to filter out irrelevant files
```
</details>

<details>
  <summary><strong>Show unchanged & changed files in the same table</strong></summary>
  <br>

The default behavior hides unchanged files in a collapsible. To include unchanged files in the visible table, set `unchanged-files` to `show`.

```yaml
name: Package Size Report

on:
  pull_request:
    branches: [ master, develop ]

jobs:
  pkg-size-report:
    name: Package Size Report
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Package size report
        uses: pkg-size/action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          unchanged-files: show # ⬅ Make unchanged files appear in the same table
```
</details>

<details>
  <summary><strong>Use Brotli size</strong></summary>
  <br>

  Use `display-size: brotli` to only show [Brotli compression size](https://en.wikipedia.org/wiki/Brotli). Use a comma separated list to show multiple sizes.

```yaml
name: Package Size Report

on:
  pull_request:
    branches: [ master, develop ]

jobs:
  pkg-size-report:
    name: Package Size Report
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Package size report
        uses: pkg-size/action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          display-size: uncompressed, brotli # ⬅ Comma separated list of sizes to show
```
</details>

<details>
  <summary><strong>Report multiple build outputs separately (e.g. <code>dist/dev</code> &amp; <code>dist/prod</code>)</strong></summary>
  <br>

If your build produces multiple distribution folders and you want a separate size table for each, use the `paths` option. Each section's heading is the prefix itself, so the heading always reflects exactly what was matched.

```yaml
name: Package Size Report

on:
  pull_request:
    branches: [ master, develop ]

jobs:
  pkg-size-report:
    name: Package Size Report
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'

      - name: Package size report
        uses: pkg-size/action@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          paths: |
            dist/dev
            dist/prod
```
</details>

## ⚙️ Options

### build-command
Default: `npm run build` if it exists in `package.json`, otherwise `false`.

Command to build the package and produce distribution files with. Pass in `false` to disable attempting to produce a build.

### comment-report
Default: `true`

Possible values: `true`, `false`

Whether to comment the build size report on the PR or not.

### mode
Default: `regression`

Possible values: `regression`, `head-only`

Sets the size report mode:
- `regression`: Builds both `head` and `base` branch and compares difference.
- `head-only`: Only builds and reports on `head` branch.

### display-size
Default: `uncompressed`

Possible values: `uncompressed`, `gzip`, `brotli`

Which size to show. Pass in a comma-separated list for multiple.

### unchanged-files
Default: `collapse`

Possible values: `show`, `collapse`, `hide`

Whether to show unchanged files.

### sort-by
Default: `delta`

Possible values: `delta`, `headSize`, `baseSize`, `path`

Which property to sort the files list by. `delta` is the size difference.

### sort-order
Default: `desc`

Possible values: `desc`, `asc`

Files list sort order.

### hide-files
Glob pattern to hide files. For example, if you want to hide source-maps:

```yml
hide-files: '*.{js,css}.map'
```

### ignore-threshold
Default: `100`

Minimum byte difference to consider a file as changed.

### strip-hash
Default: `[.-]([0-9a-zA-Z_-]{8,})[.-]`

Regular expression pattern used to normalize file names for comparison by stripping content hashes. This allows files that only differ by a hash in their name (e.g. `app-BcaWxUPr.js` vs `app-xyz12345.js`) to be compared as the same file rather than shown as an added/removed file pair.

By default, characters matched without a capture group are removed from the normalized name. Using a capture group marks the hash portion and replaces it with asterisks in the normalized key (preserving the file name structure).

To disable hash stripping, set this to `false`:

```yml
strip-hash: false
```

To use a custom pattern for a specific build tool:

```yml
strip-hash: '\.([0-9a-f]{8})\.'
```

### auto-collapse
Default: `true`

Possible values: `true`, `false`

When `true`, file rows are automatically collapsed into a `<details>` section when there are more than 20 files. The **Total** and **Tarball size** rows are always shown outside the collapsible section.

To disable auto-collapsing:

```yml
auto-collapse: false
```

### paths
Default: not set (single combined report)

Optional newline-separated list of path prefixes. When provided, the action emits one report section per entry instead of a single combined table. Each section's heading is derived directly from the prefix so the heading always reflects exactly what was matched.

Lines that are blank or start with `#` are ignored. Trailing slashes on prefixes are stripped.

Files are matched by prefix: a file is included when its path is exactly equal to the prefix or starts with `prefix + "/"`. Files that don't fall under any of the listed prefixes are excluded from the report. Because per-path subsets cannot meaningfully share a single tarball size, the per-path tables omit the **Tarball size** row and a single tarball summary line is appended after all sections.

For example, to produce separate tables for `dist/dev` and `dist/prod`:

```yml
paths: |
  dist/dev
  dist/prod
```

When this option is set, an additional `pathsReports` action output is emitted containing the per-path sliced package data.

## 💁‍♀️ FAQ

### Can I use this for non-published projects?
Yes. All you need to do is specify distribution files in the `files` array in `package.json`.

### How is this different from [size-limit-action](https://github.com/marketplace/actions/size-limit-action)?

[size-limit-action](https://github.com/marketplace/actions/size-limit-action) approaches size monitoring from a budgeting standpoint, and has features such as rejecting PRs if the proposed changes are too large. It requires specifying each distribution file and doesn't show compression sizes.

**pkg-size-action** accepts that size increases can be often warranted if the feature/bug-fix is important, and approaches monitoring from a purely informational standpoint. It encourages being size conscious without blocking your changes. pkg-size-action can also automatically detect distribution files based on your `package.json` configuration.

## 💼 License
MIT © Hiroki Osame

Logo made by <a href="https://www.flaticon.com/free-icon/report_1055644" title="Freepik">Freepik</a>
