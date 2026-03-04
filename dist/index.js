"use strict";
var Pc = require("assert"), IA = require("os"), _c = require("crypto"), dt = require("fs"), kn = require("path"), Fn = require("http"), Tn = require("https");
require("net");
var xc = require("tls"), Sn = require("events"), Vc = require("util"), He = require("node:assert"), dA = require("node:net"), fA = require("node:http"), ot = require("node:stream"), at = require("node:buffer"), rt = require("node:util"), Wc = require("node:querystring"), Wt = require("node:events"), qc = require("node:diagnostics_channel"), zc = require("node:tls"), jA = require("node:zlib"), Zc = require("node:perf_hooks"), Un = require("node:util/types"), Nn = require("node:worker_threads"), Kc = require("node:url"), qt = require("node:async_hooks"), jc = require("node:console"), Xc = require("node:dns"), $c = require("string_decoder"), eg = require("child_process"), tg = require("timers");
function vt(e) {
  var t = /* @__PURE__ */ Object.create(null);
  return e && Object.keys(e).forEach(function(A) {
    if (A !== "default") {
      var s = Object.getOwnPropertyDescriptor(e, A);
      Object.defineProperty(t, A, s.get ? s : {
        enumerable: !0,
        get: function() {
          return e[A];
        }
      });
    }
  }), t.default = e, Object.freeze(t);
}
var Et = /* @__PURE__ */ vt(IA), Ag = /* @__PURE__ */ vt(_c), pA = /* @__PURE__ */ vt(dt), ft = /* @__PURE__ */ vt(kn), Mn = /* @__PURE__ */ vt(Sn), rg = /* @__PURE__ */ vt(eg);
function zt(e) {
  return e == null ? "" : typeof e == "string" || e instanceof String ? e : JSON.stringify(e);
}
function Ln(e) {
  return Object.keys(e).length ? {
    title: e.title,
    file: e.file,
    line: e.startLine,
    endLine: e.endLine,
    col: e.startColumn,
    endColumn: e.endColumn
  } : {};
}
function Zt(e, t, A) {
  const s = new sg(e, t, A);
  process.stdout.write(s.toString() + Et.EOL);
}
function Gn(e, t = "") {
  Zt(e, {}, t);
}
const vn = "::";
class sg {
  constructor(t, A, s) {
    t || (t = "missing.command"), this.command = t, this.properties = A, this.message = s;
  }
  toString() {
    let t = vn + this.command;
    if (this.properties && Object.keys(this.properties).length > 0) {
      t += " ";
      let A = !0;
      for (const s in this.properties)
        if (this.properties.hasOwnProperty(s)) {
          const r = this.properties[s];
          r && (A ? A = !1 : t += ",", t += `${s}=${og(r)}`);
        }
    }
    return t += `${vn}${ng(this.message)}`, t;
  }
}
function ng(e) {
  return zt(e).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
function og(e) {
  return zt(e).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
}
function ig(e, t) {
  const A = process.env[`GITHUB_${e}`];
  if (!A)
    throw new Error(`Unable to find environment variable for file command ${e}`);
  if (!pA.existsSync(A))
    throw new Error(`Missing file at path: ${A}`);
  pA.appendFileSync(A, `${zt(t)}${Et.EOL}`, {
    encoding: "utf8"
  });
}
function ag(e, t) {
  const A = `ghadelimiter_${Ag.randomUUID()}`, s = zt(t);
  if (e.includes(A))
    throw new Error(`Unexpected input: name should not contain the delimiter "${A}"`);
  if (s.includes(A))
    throw new Error(`Unexpected input: value should not contain the delimiter "${A}"`);
  return `${e}<<${A}${Et.EOL}${s}${Et.EOL}${A}`;
}
var Yn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function cg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ft = {}, Jn;
function gg() {
  if (Jn) return Ft;
  Jn = 1;
  var e = xc, t = Fn, A = Tn, s = Sn, r = Vc;
  Ft.httpOverHttp = n, Ft.httpsOverHttp = o, Ft.httpOverHttps = a, Ft.httpsOverHttps = u;
  function n(B) {
    var d = new l(B);
    return d.request = t.request, d;
  }
  function o(B) {
    var d = new l(B);
    return d.request = t.request, d.createSocket = i, d.defaultPort = 443, d;
  }
  function a(B) {
    var d = new l(B);
    return d.request = A.request, d;
  }
  function u(B) {
    var d = new l(B);
    return d.request = A.request, d.createSocket = i, d.defaultPort = 443, d;
  }
  function l(B) {
    var d = this;
    d.options = B || {}, d.proxyOptions = d.options.proxy || {}, d.maxSockets = d.options.maxSockets || t.Agent.defaultMaxSockets, d.requests = [], d.sockets = [], d.on("free", function(b, F, M, L) {
      for (var N = c(F, M, L), f = 0, E = d.requests.length; f < E; ++f) {
        var p = d.requests[f];
        if (p.host === N.host && p.port === N.port) {
          d.requests.splice(f, 1), p.request.onSocket(b);
          return;
        }
      }
      b.destroy(), d.removeSocket(b);
    });
  }
  r.inherits(l, s.EventEmitter), l.prototype.addRequest = function(d, y, b, F) {
    var M = this, L = Q({ request: d }, M.options, c(y, b, F));
    if (M.sockets.length >= this.maxSockets) {
      M.requests.push(L);
      return;
    }
    M.createSocket(L, function(N) {
      N.on("free", f), N.on("close", E), N.on("agentRemove", E), d.onSocket(N);
      function f() {
        M.emit("free", N, L);
      }
      function E(p) {
        M.removeSocket(N), N.removeListener("free", f), N.removeListener("close", E), N.removeListener("agentRemove", E);
      }
    });
  }, l.prototype.createSocket = function(d, y) {
    var b = this, F = {};
    b.sockets.push(F);
    var M = Q({}, b.proxyOptions, {
      method: "CONNECT",
      path: d.host + ":" + d.port,
      agent: !1,
      headers: {
        host: d.host + ":" + d.port
      }
    });
    d.localAddress && (M.localAddress = d.localAddress), M.proxyAuth && (M.headers = M.headers || {}, M.headers["Proxy-Authorization"] = "Basic " + new Buffer(M.proxyAuth).toString("base64")), h("making CONNECT request");
    var L = b.request(M);
    L.useChunkedEncodingByDefault = !1, L.once("response", N), L.once("upgrade", f), L.once("connect", E), L.once("error", p), L.end();
    function N(g) {
      g.upgrade = !0;
    }
    function f(g, C, w) {
      process.nextTick(function() {
        E(g, C, w);
      });
    }
    function E(g, C, w) {
      if (L.removeAllListeners(), C.removeAllListeners(), g.statusCode !== 200) {
        h(
          "tunneling socket could not be established, statusCode=%d",
          g.statusCode
        ), C.destroy();
        var I = new Error("tunneling socket could not be established, statusCode=" + g.statusCode);
        I.code = "ECONNRESET", d.request.emit("error", I), b.removeSocket(F);
        return;
      }
      if (w.length > 0) {
        h("got illegal response body from proxy"), C.destroy();
        var I = new Error("got illegal response body from proxy");
        I.code = "ECONNRESET", d.request.emit("error", I), b.removeSocket(F);
        return;
      }
      return h("tunneling connection has established"), b.sockets[b.sockets.indexOf(F)] = C, y(C);
    }
    function p(g) {
      L.removeAllListeners(), h(
        `tunneling socket could not be established, cause=%s
`,
        g.message,
        g.stack
      );
      var C = new Error("tunneling socket could not be established, cause=" + g.message);
      C.code = "ECONNRESET", d.request.emit("error", C), b.removeSocket(F);
    }
  }, l.prototype.removeSocket = function(d) {
    var y = this.sockets.indexOf(d);
    if (y !== -1) {
      this.sockets.splice(y, 1);
      var b = this.requests.shift();
      b && this.createSocket(b, function(F) {
        b.request.onSocket(F);
      });
    }
  };
  function i(B, d) {
    var y = this;
    l.prototype.createSocket.call(y, B, function(b) {
      var F = B.request.getHeader("host"), M = Q({}, y.options, {
        socket: b,
        servername: F ? F.replace(/:.*$/, "") : B.host
      }), L = e.connect(0, M);
      y.sockets[y.sockets.indexOf(b)] = L, d(L);
    });
  }
  function c(B, d, y) {
    return typeof B == "string" ? {
      host: B,
      port: d,
      localAddress: y
    } : B;
  }
  function Q(B) {
    for (var d = 1, y = arguments.length; d < y; ++d) {
      var b = arguments[d];
      if (typeof b == "object")
        for (var F = Object.keys(b), M = 0, L = F.length; M < L; ++M) {
          var N = F[M];
          b[N] !== void 0 && (B[N] = b[N]);
        }
    }
    return B;
  }
  var h;
  return process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG) ? h = function() {
    var B = Array.prototype.slice.call(arguments);
    typeof B[0] == "string" ? B[0] = "TUNNEL: " + B[0] : B.unshift("TUNNEL:"), console.error.apply(console, B);
  } : h = function() {
  }, Ft.debug = h, Ft;
}
var XA, Hn;
function On() {
  return Hn || (Hn = 1, XA = gg()), XA;
}
On();
var me = {}, $A, Pn;
function Ve() {
  return Pn || (Pn = 1, $A = {
    kClose: /* @__PURE__ */ Symbol("close"),
    kDestroy: /* @__PURE__ */ Symbol("destroy"),
    kDispatch: /* @__PURE__ */ Symbol("dispatch"),
    kUrl: /* @__PURE__ */ Symbol("url"),
    kWriting: /* @__PURE__ */ Symbol("writing"),
    kResuming: /* @__PURE__ */ Symbol("resuming"),
    kQueue: /* @__PURE__ */ Symbol("queue"),
    kConnect: /* @__PURE__ */ Symbol("connect"),
    kConnecting: /* @__PURE__ */ Symbol("connecting"),
    kKeepAliveDefaultTimeout: /* @__PURE__ */ Symbol("default keep alive timeout"),
    kKeepAliveMaxTimeout: /* @__PURE__ */ Symbol("max keep alive timeout"),
    kKeepAliveTimeoutThreshold: /* @__PURE__ */ Symbol("keep alive timeout threshold"),
    kKeepAliveTimeoutValue: /* @__PURE__ */ Symbol("keep alive timeout"),
    kKeepAlive: /* @__PURE__ */ Symbol("keep alive"),
    kHeadersTimeout: /* @__PURE__ */ Symbol("headers timeout"),
    kBodyTimeout: /* @__PURE__ */ Symbol("body timeout"),
    kServerName: /* @__PURE__ */ Symbol("server name"),
    kLocalAddress: /* @__PURE__ */ Symbol("local address"),
    kHost: /* @__PURE__ */ Symbol("host"),
    kNoRef: /* @__PURE__ */ Symbol("no ref"),
    kBodyUsed: /* @__PURE__ */ Symbol("used"),
    kBody: /* @__PURE__ */ Symbol("abstracted request body"),
    kRunning: /* @__PURE__ */ Symbol("running"),
    kBlocking: /* @__PURE__ */ Symbol("blocking"),
    kPending: /* @__PURE__ */ Symbol("pending"),
    kSize: /* @__PURE__ */ Symbol("size"),
    kBusy: /* @__PURE__ */ Symbol("busy"),
    kQueued: /* @__PURE__ */ Symbol("queued"),
    kFree: /* @__PURE__ */ Symbol("free"),
    kConnected: /* @__PURE__ */ Symbol("connected"),
    kClosed: /* @__PURE__ */ Symbol("closed"),
    kNeedDrain: /* @__PURE__ */ Symbol("need drain"),
    kReset: /* @__PURE__ */ Symbol("reset"),
    kDestroyed: /* @__PURE__ */ Symbol.for("nodejs.stream.destroyed"),
    kResume: /* @__PURE__ */ Symbol("resume"),
    kOnError: /* @__PURE__ */ Symbol("on error"),
    kMaxHeadersSize: /* @__PURE__ */ Symbol("max headers size"),
    kRunningIdx: /* @__PURE__ */ Symbol("running index"),
    kPendingIdx: /* @__PURE__ */ Symbol("pending index"),
    kError: /* @__PURE__ */ Symbol("error"),
    kClients: /* @__PURE__ */ Symbol("clients"),
    kClient: /* @__PURE__ */ Symbol("client"),
    kParser: /* @__PURE__ */ Symbol("parser"),
    kOnDestroyed: /* @__PURE__ */ Symbol("destroy callbacks"),
    kPipelining: /* @__PURE__ */ Symbol("pipelining"),
    kSocket: /* @__PURE__ */ Symbol("socket"),
    kHostHeader: /* @__PURE__ */ Symbol("host header"),
    kConnector: /* @__PURE__ */ Symbol("connector"),
    kStrictContentLength: /* @__PURE__ */ Symbol("strict content length"),
    kMaxRedirections: /* @__PURE__ */ Symbol("maxRedirections"),
    kMaxRequests: /* @__PURE__ */ Symbol("maxRequestsPerClient"),
    kProxy: /* @__PURE__ */ Symbol("proxy agent options"),
    kCounter: /* @__PURE__ */ Symbol("socket request counter"),
    kInterceptors: /* @__PURE__ */ Symbol("dispatch interceptors"),
    kMaxResponseSize: /* @__PURE__ */ Symbol("max response size"),
    kHTTP2Session: /* @__PURE__ */ Symbol("http2Session"),
    kHTTP2SessionState: /* @__PURE__ */ Symbol("http2Session state"),
    kRetryHandlerDefaultRetry: /* @__PURE__ */ Symbol("retry agent default retry"),
    kConstruct: /* @__PURE__ */ Symbol("constructable"),
    kListeners: /* @__PURE__ */ Symbol("listeners"),
    kHTTPContext: /* @__PURE__ */ Symbol("http context"),
    kMaxConcurrentStreams: /* @__PURE__ */ Symbol("max concurrent streams"),
    kNoProxyAgent: /* @__PURE__ */ Symbol("no proxy agent"),
    kHttpProxyAgent: /* @__PURE__ */ Symbol("http proxy agent"),
    kHttpsProxyAgent: /* @__PURE__ */ Symbol("https proxy agent")
  }), $A;
}
var er, _n;
function Ye() {
  if (_n) return er;
  _n = 1;
  const e = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR");
  class t extends Error {
    constructor(J) {
      super(J), this.name = "UndiciError", this.code = "UND_ERR";
    }
    static [Symbol.hasInstance](J) {
      return J && J[e] === !0;
    }
    [e] = !0;
  }
  const A = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_CONNECT_TIMEOUT");
  class s extends t {
    constructor(J) {
      super(J), this.name = "ConnectTimeoutError", this.message = J || "Connect Timeout Error", this.code = "UND_ERR_CONNECT_TIMEOUT";
    }
    static [Symbol.hasInstance](J) {
      return J && J[A] === !0;
    }
    [A] = !0;
  }
  const r = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_HEADERS_TIMEOUT");
  class n extends t {
    constructor(J) {
      super(J), this.name = "HeadersTimeoutError", this.message = J || "Headers Timeout Error", this.code = "UND_ERR_HEADERS_TIMEOUT";
    }
    static [Symbol.hasInstance](J) {
      return J && J[r] === !0;
    }
    [r] = !0;
  }
  const o = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_HEADERS_OVERFLOW");
  class a extends t {
    constructor(J) {
      super(J), this.name = "HeadersOverflowError", this.message = J || "Headers Overflow Error", this.code = "UND_ERR_HEADERS_OVERFLOW";
    }
    static [Symbol.hasInstance](J) {
      return J && J[o] === !0;
    }
    [o] = !0;
  }
  const u = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_BODY_TIMEOUT");
  class l extends t {
    constructor(J) {
      super(J), this.name = "BodyTimeoutError", this.message = J || "Body Timeout Error", this.code = "UND_ERR_BODY_TIMEOUT";
    }
    static [Symbol.hasInstance](J) {
      return J && J[u] === !0;
    }
    [u] = !0;
  }
  const i = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RESPONSE_STATUS_CODE");
  class c extends t {
    constructor(J, V, P, Z) {
      super(J), this.name = "ResponseStatusCodeError", this.message = J || "Response Status Code Error", this.code = "UND_ERR_RESPONSE_STATUS_CODE", this.body = Z, this.status = V, this.statusCode = V, this.headers = P;
    }
    static [Symbol.hasInstance](J) {
      return J && J[i] === !0;
    }
    [i] = !0;
  }
  const Q = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INVALID_ARG");
  class h extends t {
    constructor(J) {
      super(J), this.name = "InvalidArgumentError", this.message = J || "Invalid Argument Error", this.code = "UND_ERR_INVALID_ARG";
    }
    static [Symbol.hasInstance](J) {
      return J && J[Q] === !0;
    }
    [Q] = !0;
  }
  const B = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INVALID_RETURN_VALUE");
  class d extends t {
    constructor(J) {
      super(J), this.name = "InvalidReturnValueError", this.message = J || "Invalid Return Value Error", this.code = "UND_ERR_INVALID_RETURN_VALUE";
    }
    static [Symbol.hasInstance](J) {
      return J && J[B] === !0;
    }
    [B] = !0;
  }
  const y = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_ABORT");
  class b extends t {
    constructor(J) {
      super(J), this.name = "AbortError", this.message = J || "The operation was aborted", this.code = "UND_ERR_ABORT";
    }
    static [Symbol.hasInstance](J) {
      return J && J[y] === !0;
    }
    [y] = !0;
  }
  const F = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_ABORTED");
  class M extends b {
    constructor(J) {
      super(J), this.name = "AbortError", this.message = J || "Request aborted", this.code = "UND_ERR_ABORTED";
    }
    static [Symbol.hasInstance](J) {
      return J && J[F] === !0;
    }
    [F] = !0;
  }
  const L = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INFO");
  class N extends t {
    constructor(J) {
      super(J), this.name = "InformationalError", this.message = J || "Request information", this.code = "UND_ERR_INFO";
    }
    static [Symbol.hasInstance](J) {
      return J && J[L] === !0;
    }
    [L] = !0;
  }
  const f = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_REQ_CONTENT_LENGTH_MISMATCH");
  class E extends t {
    constructor(J) {
      super(J), this.name = "RequestContentLengthMismatchError", this.message = J || "Request body length does not match content-length header", this.code = "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH";
    }
    static [Symbol.hasInstance](J) {
      return J && J[f] === !0;
    }
    [f] = !0;
  }
  const p = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RES_CONTENT_LENGTH_MISMATCH");
  class g extends t {
    constructor(J) {
      super(J), this.name = "ResponseContentLengthMismatchError", this.message = J || "Response body length does not match content-length header", this.code = "UND_ERR_RES_CONTENT_LENGTH_MISMATCH";
    }
    static [Symbol.hasInstance](J) {
      return J && J[p] === !0;
    }
    [p] = !0;
  }
  const C = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_DESTROYED");
  class w extends t {
    constructor(J) {
      super(J), this.name = "ClientDestroyedError", this.message = J || "The client is destroyed", this.code = "UND_ERR_DESTROYED";
    }
    static [Symbol.hasInstance](J) {
      return J && J[C] === !0;
    }
    [C] = !0;
  }
  const I = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_CLOSED");
  class m extends t {
    constructor(J) {
      super(J), this.name = "ClientClosedError", this.message = J || "The client is closed", this.code = "UND_ERR_CLOSED";
    }
    static [Symbol.hasInstance](J) {
      return J && J[I] === !0;
    }
    [I] = !0;
  }
  const D = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_SOCKET");
  class U extends t {
    constructor(J, V) {
      super(J), this.name = "SocketError", this.message = J || "Socket error", this.code = "UND_ERR_SOCKET", this.socket = V;
    }
    static [Symbol.hasInstance](J) {
      return J && J[D] === !0;
    }
    [D] = !0;
  }
  const S = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_NOT_SUPPORTED");
  class G extends t {
    constructor(J) {
      super(J), this.name = "NotSupportedError", this.message = J || "Not supported error", this.code = "UND_ERR_NOT_SUPPORTED";
    }
    static [Symbol.hasInstance](J) {
      return J && J[S] === !0;
    }
    [S] = !0;
  }
  const v = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_BPL_MISSING_UPSTREAM");
  class $ extends t {
    constructor(J) {
      super(J), this.name = "MissingUpstreamError", this.message = J || "No upstream has been added to the BalancedPool", this.code = "UND_ERR_BPL_MISSING_UPSTREAM";
    }
    static [Symbol.hasInstance](J) {
      return J && J[v] === !0;
    }
    [v] = !0;
  }
  const ne = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_HTTP_PARSER");
  class ge extends Error {
    constructor(J, V, P) {
      super(J), this.name = "HTTPParserError", this.code = V ? `HPE_${V}` : void 0, this.data = P ? P.toString() : void 0;
    }
    static [Symbol.hasInstance](J) {
      return J && J[ne] === !0;
    }
    [ne] = !0;
  }
  const ae = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RES_EXCEEDED_MAX_SIZE");
  class Be extends t {
    constructor(J) {
      super(J), this.name = "ResponseExceededMaxSizeError", this.message = J || "Response content exceeded max size", this.code = "UND_ERR_RES_EXCEEDED_MAX_SIZE";
    }
    static [Symbol.hasInstance](J) {
      return J && J[ae] === !0;
    }
    [ae] = !0;
  }
  const he = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_REQ_RETRY");
  class Qe extends t {
    constructor(J, V, { headers: P, data: Z }) {
      super(J), this.name = "RequestRetryError", this.message = J || "Request retry error", this.code = "UND_ERR_REQ_RETRY", this.statusCode = V, this.data = Z, this.headers = P;
    }
    static [Symbol.hasInstance](J) {
      return J && J[he] === !0;
    }
    [he] = !0;
  }
  const ye = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RESPONSE");
  class we extends t {
    constructor(J, V, { headers: P, data: Z }) {
      super(J), this.name = "ResponseError", this.message = J || "Response error", this.code = "UND_ERR_RESPONSE", this.statusCode = V, this.data = Z, this.headers = P;
    }
    static [Symbol.hasInstance](J) {
      return J && J[ye] === !0;
    }
    [ye] = !0;
  }
  const X = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_PRX_TLS");
  class W extends t {
    constructor(J, V, P) {
      super(V, { cause: J, ...P ?? {} }), this.name = "SecureProxyConnectionError", this.message = V || "Secure Proxy Connection failed", this.code = "UND_ERR_PRX_TLS", this.cause = J;
    }
    static [Symbol.hasInstance](J) {
      return J && J[X] === !0;
    }
    [X] = !0;
  }
  return er = {
    AbortError: b,
    HTTPParserError: ge,
    UndiciError: t,
    HeadersTimeoutError: n,
    HeadersOverflowError: a,
    BodyTimeoutError: l,
    RequestContentLengthMismatchError: E,
    ConnectTimeoutError: s,
    ResponseStatusCodeError: c,
    InvalidArgumentError: h,
    InvalidReturnValueError: d,
    RequestAbortedError: M,
    ClientDestroyedError: w,
    ClientClosedError: m,
    InformationalError: N,
    SocketError: U,
    NotSupportedError: G,
    ResponseContentLengthMismatchError: g,
    BalancedPoolMissingUpstreamError: $,
    ResponseExceededMaxSizeError: Be,
    RequestRetryError: Qe,
    ResponseError: we,
    SecureProxyConnectionError: W
  }, er;
}
var tr, xn;
function Ar() {
  if (xn) return tr;
  xn = 1;
  const e = {}, t = [
    "Accept",
    "Accept-Encoding",
    "Accept-Language",
    "Accept-Ranges",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Origin",
    "Access-Control-Expose-Headers",
    "Access-Control-Max-Age",
    "Access-Control-Request-Headers",
    "Access-Control-Request-Method",
    "Age",
    "Allow",
    "Alt-Svc",
    "Alt-Used",
    "Authorization",
    "Cache-Control",
    "Clear-Site-Data",
    "Connection",
    "Content-Disposition",
    "Content-Encoding",
    "Content-Language",
    "Content-Length",
    "Content-Location",
    "Content-Range",
    "Content-Security-Policy",
    "Content-Security-Policy-Report-Only",
    "Content-Type",
    "Cookie",
    "Cross-Origin-Embedder-Policy",
    "Cross-Origin-Opener-Policy",
    "Cross-Origin-Resource-Policy",
    "Date",
    "Device-Memory",
    "Downlink",
    "ECT",
    "ETag",
    "Expect",
    "Expect-CT",
    "Expires",
    "Forwarded",
    "From",
    "Host",
    "If-Match",
    "If-Modified-Since",
    "If-None-Match",
    "If-Range",
    "If-Unmodified-Since",
    "Keep-Alive",
    "Last-Modified",
    "Link",
    "Location",
    "Max-Forwards",
    "Origin",
    "Permissions-Policy",
    "Pragma",
    "Proxy-Authenticate",
    "Proxy-Authorization",
    "RTT",
    "Range",
    "Referer",
    "Referrer-Policy",
    "Refresh",
    "Retry-After",
    "Sec-WebSocket-Accept",
    "Sec-WebSocket-Extensions",
    "Sec-WebSocket-Key",
    "Sec-WebSocket-Protocol",
    "Sec-WebSocket-Version",
    "Server",
    "Server-Timing",
    "Service-Worker-Allowed",
    "Service-Worker-Navigation-Preload",
    "Set-Cookie",
    "SourceMap",
    "Strict-Transport-Security",
    "Supports-Loading-Mode",
    "TE",
    "Timing-Allow-Origin",
    "Trailer",
    "Transfer-Encoding",
    "Upgrade",
    "Upgrade-Insecure-Requests",
    "User-Agent",
    "Vary",
    "Via",
    "WWW-Authenticate",
    "X-Content-Type-Options",
    "X-DNS-Prefetch-Control",
    "X-Frame-Options",
    "X-Permitted-Cross-Domain-Policies",
    "X-Powered-By",
    "X-Requested-With",
    "X-XSS-Protection"
  ];
  for (let A = 0; A < t.length; ++A) {
    const s = t[A], r = s.toLowerCase();
    e[s] = e[r] = r;
  }
  return Object.setPrototypeOf(e, null), tr = {
    wellknownHeaderNames: t,
    headerNameLowerCasedRecord: e
  }, tr;
}
var rr, Vn;
function lg() {
  if (Vn) return rr;
  Vn = 1;
  const {
    wellknownHeaderNames: e,
    headerNameLowerCasedRecord: t
  } = Ar();
  class A {
    /** @type {any} */
    value = null;
    /** @type {null | TstNode} */
    left = null;
    /** @type {null | TstNode} */
    middle = null;
    /** @type {null | TstNode} */
    right = null;
    /** @type {number} */
    code;
    /**
     * @param {string} key
     * @param {any} value
     * @param {number} index
     */
    constructor(o, a, u) {
      if (u === void 0 || u >= o.length)
        throw new TypeError("Unreachable");
      if ((this.code = o.charCodeAt(u)) > 127)
        throw new TypeError("key must be ascii string");
      o.length !== ++u ? this.middle = new A(o, a, u) : this.value = a;
    }
    /**
     * @param {string} key
     * @param {any} value
     */
    add(o, a) {
      const u = o.length;
      if (u === 0)
        throw new TypeError("Unreachable");
      let l = 0, i = this;
      for (; ; ) {
        const c = o.charCodeAt(l);
        if (c > 127)
          throw new TypeError("key must be ascii string");
        if (i.code === c)
          if (u === ++l) {
            i.value = a;
            break;
          } else if (i.middle !== null)
            i = i.middle;
          else {
            i.middle = new A(o, a, l);
            break;
          }
        else if (i.code < c)
          if (i.left !== null)
            i = i.left;
          else {
            i.left = new A(o, a, l);
            break;
          }
        else if (i.right !== null)
          i = i.right;
        else {
          i.right = new A(o, a, l);
          break;
        }
      }
    }
    /**
     * @param {Uint8Array} key
     * @return {TstNode | null}
     */
    search(o) {
      const a = o.length;
      let u = 0, l = this;
      for (; l !== null && u < a; ) {
        let i = o[u];
        for (i <= 90 && i >= 65 && (i |= 32); l !== null; ) {
          if (i === l.code) {
            if (a === ++u)
              return l;
            l = l.middle;
            break;
          }
          l = l.code < i ? l.left : l.right;
        }
      }
      return null;
    }
  }
  class s {
    /** @type {TstNode | null} */
    node = null;
    /**
     * @param {string} key
     * @param {any} value
     * */
    insert(o, a) {
      this.node === null ? this.node = new A(o, a, 0) : this.node.add(o, a);
    }
    /**
     * @param {Uint8Array} key
     * @return {any}
     */
    lookup(o) {
      return this.node?.search(o)?.value ?? null;
    }
  }
  const r = new s();
  for (let n = 0; n < e.length; ++n) {
    const o = t[e[n]];
    r.insert(o, o);
  }
  return rr = {
    TernarySearchTree: s,
    tree: r
  }, rr;
}
var sr, Wn;
function Ue() {
  if (Wn) return sr;
  Wn = 1;
  const e = He, { kDestroyed: t, kBodyUsed: A, kListeners: s, kBody: r } = Ve(), { IncomingMessage: n } = fA, o = ot, a = dA, { Blob: u } = at, l = rt, { stringify: i } = Wc, { EventEmitter: c } = Wt, { InvalidArgumentError: Q } = Ye(), { headerNameLowerCasedRecord: h } = Ar(), { tree: B } = lg(), [d, y] = process.versions.node.split(".").map((R) => Number(R));
  class b {
    constructor(q) {
      this[r] = q, this[A] = !1;
    }
    async *[Symbol.asyncIterator]() {
      e(!this[A], "disturbed"), this[A] = !0, yield* this[r];
    }
  }
  function F(R) {
    return L(R) ? (S(R) === 0 && R.on("data", function() {
      e(!1);
    }), typeof R.readableDidRead != "boolean" && (R[A] = !1, c.prototype.on.call(R, "data", function() {
      this[A] = !0;
    })), R) : R && typeof R.pipeTo == "function" ? new b(R) : R && typeof R != "string" && !ArrayBuffer.isView(R) && U(R) ? new b(R) : R;
  }
  function M() {
  }
  function L(R) {
    return R && typeof R == "object" && typeof R.pipe == "function" && typeof R.on == "function";
  }
  function N(R) {
    if (R === null)
      return !1;
    if (R instanceof u)
      return !0;
    if (typeof R != "object")
      return !1;
    {
      const q = R[Symbol.toStringTag];
      return (q === "Blob" || q === "File") && ("stream" in R && typeof R.stream == "function" || "arrayBuffer" in R && typeof R.arrayBuffer == "function");
    }
  }
  function f(R, q) {
    if (R.includes("?") || R.includes("#"))
      throw new Error('Query params cannot be passed when url already contains "?" or "#".');
    const ie = i(q);
    return ie && (R += "?" + ie), R;
  }
  function E(R) {
    const q = parseInt(R, 10);
    return q === Number(R) && q >= 0 && q <= 65535;
  }
  function p(R) {
    return R != null && R[0] === "h" && R[1] === "t" && R[2] === "t" && R[3] === "p" && (R[4] === ":" || R[4] === "s" && R[5] === ":");
  }
  function g(R) {
    if (typeof R == "string") {
      if (R = new URL(R), !p(R.origin || R.protocol))
        throw new Q("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      return R;
    }
    if (!R || typeof R != "object")
      throw new Q("Invalid URL: The URL argument must be a non-null object.");
    if (!(R instanceof URL)) {
      if (R.port != null && R.port !== "" && E(R.port) === !1)
        throw new Q("Invalid URL: port must be a valid integer or a string representation of an integer.");
      if (R.path != null && typeof R.path != "string")
        throw new Q("Invalid URL path: the path must be a string or null/undefined.");
      if (R.pathname != null && typeof R.pathname != "string")
        throw new Q("Invalid URL pathname: the pathname must be a string or null/undefined.");
      if (R.hostname != null && typeof R.hostname != "string")
        throw new Q("Invalid URL hostname: the hostname must be a string or null/undefined.");
      if (R.origin != null && typeof R.origin != "string")
        throw new Q("Invalid URL origin: the origin must be a string or null/undefined.");
      if (!p(R.origin || R.protocol))
        throw new Q("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      const q = R.port != null ? R.port : R.protocol === "https:" ? 443 : 80;
      let ie = R.origin != null ? R.origin : `${R.protocol || ""}//${R.hostname || ""}:${q}`, ue = R.path != null ? R.path : `${R.pathname || ""}${R.search || ""}`;
      return ie[ie.length - 1] === "/" && (ie = ie.slice(0, ie.length - 1)), ue && ue[0] !== "/" && (ue = `/${ue}`), new URL(`${ie}${ue}`);
    }
    if (!p(R.origin || R.protocol))
      throw new Q("Invalid URL protocol: the URL must start with `http:` or `https:`.");
    return R;
  }
  function C(R) {
    if (R = g(R), R.pathname !== "/" || R.search || R.hash)
      throw new Q("invalid url");
    return R;
  }
  function w(R) {
    if (R[0] === "[") {
      const ie = R.indexOf("]");
      return e(ie !== -1), R.substring(1, ie);
    }
    const q = R.indexOf(":");
    return q === -1 ? R : R.substring(0, q);
  }
  function I(R) {
    if (!R)
      return null;
    e(typeof R == "string");
    const q = w(R);
    return a.isIP(q) ? "" : q;
  }
  function m(R) {
    return JSON.parse(JSON.stringify(R));
  }
  function D(R) {
    return R != null && typeof R[Symbol.asyncIterator] == "function";
  }
  function U(R) {
    return R != null && (typeof R[Symbol.iterator] == "function" || typeof R[Symbol.asyncIterator] == "function");
  }
  function S(R) {
    if (R == null)
      return 0;
    if (L(R)) {
      const q = R._readableState;
      return q && q.objectMode === !1 && q.ended === !0 && Number.isFinite(q.length) ? q.length : null;
    } else {
      if (N(R))
        return R.size != null ? R.size : null;
      if (Qe(R))
        return R.byteLength;
    }
    return null;
  }
  function G(R) {
    return R && !!(R.destroyed || R[t] || o.isDestroyed?.(R));
  }
  function v(R, q) {
    R == null || !L(R) || G(R) || (typeof R.destroy == "function" ? (Object.getPrototypeOf(R).constructor === n && (R.socket = null), R.destroy(q)) : q && queueMicrotask(() => {
      R.emit("error", q);
    }), R.destroyed !== !0 && (R[t] = !0));
  }
  const $ = /timeout=(\d+)/;
  function ne(R) {
    const q = R.toString().match($);
    return q ? parseInt(q[1], 10) * 1e3 : null;
  }
  function ge(R) {
    return typeof R == "string" ? h[R] ?? R.toLowerCase() : B.lookup(R) ?? R.toString("latin1").toLowerCase();
  }
  function ae(R) {
    return B.lookup(R) ?? R.toString("latin1").toLowerCase();
  }
  function Be(R, q) {
    q === void 0 && (q = {});
    for (let ie = 0; ie < R.length; ie += 2) {
      const ue = ge(R[ie]);
      let Ce = q[ue];
      if (Ce)
        typeof Ce == "string" && (Ce = [Ce], q[ue] = Ce), Ce.push(R[ie + 1].toString("utf8"));
      else {
        const De = R[ie + 1];
        typeof De == "string" ? q[ue] = De : q[ue] = Array.isArray(De) ? De.map((ve) => ve.toString("utf8")) : De.toString("utf8");
      }
    }
    return "content-length" in q && "content-disposition" in q && (q["content-disposition"] = Buffer.from(q["content-disposition"]).toString("latin1")), q;
  }
  function he(R) {
    const q = R.length, ie = new Array(q);
    let ue = !1, Ce = -1, De, ve, ze = 0;
    for (let Ke = 0; Ke < R.length; Ke += 2)
      De = R[Ke], ve = R[Ke + 1], typeof De != "string" && (De = De.toString()), typeof ve != "string" && (ve = ve.toString("utf8")), ze = De.length, ze === 14 && De[7] === "-" && (De === "content-length" || De.toLowerCase() === "content-length") ? ue = !0 : ze === 19 && De[7] === "-" && (De === "content-disposition" || De.toLowerCase() === "content-disposition") && (Ce = Ke + 1), ie[Ke] = De, ie[Ke + 1] = ve;
    return ue && Ce !== -1 && (ie[Ce] = Buffer.from(ie[Ce]).toString("latin1")), ie;
  }
  function Qe(R) {
    return R instanceof Uint8Array || Buffer.isBuffer(R);
  }
  function ye(R, q, ie) {
    if (!R || typeof R != "object")
      throw new Q("handler must be an object");
    if (typeof R.onConnect != "function")
      throw new Q("invalid onConnect method");
    if (typeof R.onError != "function")
      throw new Q("invalid onError method");
    if (typeof R.onBodySent != "function" && R.onBodySent !== void 0)
      throw new Q("invalid onBodySent method");
    if (ie || q === "CONNECT") {
      if (typeof R.onUpgrade != "function")
        throw new Q("invalid onUpgrade method");
    } else {
      if (typeof R.onHeaders != "function")
        throw new Q("invalid onHeaders method");
      if (typeof R.onData != "function")
        throw new Q("invalid onData method");
      if (typeof R.onComplete != "function")
        throw new Q("invalid onComplete method");
    }
  }
  function we(R) {
    return !!(R && (o.isDisturbed(R) || R[A]));
  }
  function X(R) {
    return !!(R && o.isErrored(R));
  }
  function W(R) {
    return !!(R && o.isReadable(R));
  }
  function re(R) {
    return {
      localAddress: R.localAddress,
      localPort: R.localPort,
      remoteAddress: R.remoteAddress,
      remotePort: R.remotePort,
      remoteFamily: R.remoteFamily,
      timeout: R.timeout,
      bytesWritten: R.bytesWritten,
      bytesRead: R.bytesRead
    };
  }
  function J(R) {
    let q;
    return new ReadableStream(
      {
        async start() {
          q = R[Symbol.asyncIterator]();
        },
        async pull(ie) {
          const { done: ue, value: Ce } = await q.next();
          if (ue)
            queueMicrotask(() => {
              ie.close(), ie.byobRequest?.respond(0);
            });
          else {
            const De = Buffer.isBuffer(Ce) ? Ce : Buffer.from(Ce);
            De.byteLength && ie.enqueue(new Uint8Array(De));
          }
          return ie.desiredSize > 0;
        },
        async cancel(ie) {
          await q.return();
        },
        type: "bytes"
      }
    );
  }
  function V(R) {
    return R && typeof R == "object" && typeof R.append == "function" && typeof R.delete == "function" && typeof R.get == "function" && typeof R.getAll == "function" && typeof R.has == "function" && typeof R.set == "function" && R[Symbol.toStringTag] === "FormData";
  }
  function P(R, q) {
    return "addEventListener" in R ? (R.addEventListener("abort", q, { once: !0 }), () => R.removeEventListener("abort", q)) : (R.addListener("abort", q), () => R.removeListener("abort", q));
  }
  const Z = typeof String.prototype.toWellFormed == "function", se = typeof String.prototype.isWellFormed == "function";
  function le(R) {
    return Z ? `${R}`.toWellFormed() : l.toUSVString(R);
  }
  function oe(R) {
    return se ? `${R}`.isWellFormed() : le(R) === `${R}`;
  }
  function fe(R) {
    switch (R) {
      case 34:
      case 40:
      case 41:
      case 44:
      case 47:
      case 58:
      case 59:
      case 60:
      case 61:
      case 62:
      case 63:
      case 64:
      case 91:
      case 92:
      case 93:
      case 123:
      case 125:
        return !1;
      default:
        return R >= 33 && R <= 126;
    }
  }
  function Me(R) {
    if (R.length === 0)
      return !1;
    for (let q = 0; q < R.length; ++q)
      if (!fe(R.charCodeAt(q)))
        return !1;
    return !0;
  }
  const pe = /[^\t\x20-\x7e\x80-\xff]/;
  function Le(R) {
    return !pe.test(R);
  }
  function Re(R) {
    if (R == null || R === "") return { start: 0, end: null, size: null };
    const q = R ? R.match(/^bytes (\d+)-(\d+)\/(\d+)?$/) : null;
    return q ? {
      start: parseInt(q[1]),
      end: q[2] ? parseInt(q[2]) : null,
      size: q[3] ? parseInt(q[3]) : null
    } : null;
  }
  function ke(R, q, ie) {
    return (R[s] ??= []).push([q, ie]), R.on(q, ie), R;
  }
  function de(R) {
    for (const [q, ie] of R[s] ?? [])
      R.removeListener(q, ie);
    R[s] = null;
  }
  function We(R, q, ie) {
    try {
      q.onError(ie), e(q.aborted);
    } catch (ue) {
      R.emit("error", ue);
    }
  }
  const _e = /* @__PURE__ */ Object.create(null);
  _e.enumerable = !0;
  const Je = {
    delete: "DELETE",
    DELETE: "DELETE",
    get: "GET",
    GET: "GET",
    head: "HEAD",
    HEAD: "HEAD",
    options: "OPTIONS",
    OPTIONS: "OPTIONS",
    post: "POST",
    POST: "POST",
    put: "PUT",
    PUT: "PUT"
  }, j = {
    ...Je,
    patch: "patch",
    PATCH: "PATCH"
  };
  return Object.setPrototypeOf(Je, null), Object.setPrototypeOf(j, null), sr = {
    kEnumerableProperty: _e,
    nop: M,
    isDisturbed: we,
    isErrored: X,
    isReadable: W,
    toUSVString: le,
    isUSVString: oe,
    isBlobLike: N,
    parseOrigin: C,
    parseURL: g,
    getServerName: I,
    isStream: L,
    isIterable: U,
    isAsyncIterable: D,
    isDestroyed: G,
    headerNameToString: ge,
    bufferToLowerCasedHeaderName: ae,
    addListener: ke,
    removeAllListeners: de,
    errorRequest: We,
    parseRawHeaders: he,
    parseHeaders: Be,
    parseKeepAliveTimeout: ne,
    destroy: v,
    bodyLength: S,
    deepClone: m,
    ReadableStreamFrom: J,
    isBuffer: Qe,
    validateHandler: ye,
    getSocketInfo: re,
    isFormDataLike: V,
    buildURL: f,
    addAbortListener: P,
    isValidHTTPToken: Me,
    isValidHeaderValue: Le,
    isTokenCharCode: fe,
    parseRangeHeader: Re,
    normalizedMethodRecordsBase: Je,
    normalizedMethodRecords: j,
    isValidPort: E,
    isHttpOrHttpsPrefixed: p,
    nodeMajor: d,
    nodeMinor: y,
    safeHTTPMethods: ["GET", "HEAD", "OPTIONS", "TRACE"],
    wrapRequestBody: F
  }, sr;
}
var nr, qn;
function Kt() {
  if (qn) return nr;
  qn = 1;
  const e = qc, t = rt, A = t.debuglog("undici"), s = t.debuglog("fetch"), r = t.debuglog("websocket");
  let n = !1;
  const o = {
    // Client
    beforeConnect: e.channel("undici:client:beforeConnect"),
    connected: e.channel("undici:client:connected"),
    connectError: e.channel("undici:client:connectError"),
    sendHeaders: e.channel("undici:client:sendHeaders"),
    // Request
    create: e.channel("undici:request:create"),
    bodySent: e.channel("undici:request:bodySent"),
    headers: e.channel("undici:request:headers"),
    trailers: e.channel("undici:request:trailers"),
    error: e.channel("undici:request:error"),
    // WebSocket
    open: e.channel("undici:websocket:open"),
    close: e.channel("undici:websocket:close"),
    socketError: e.channel("undici:websocket:socket_error"),
    ping: e.channel("undici:websocket:ping"),
    pong: e.channel("undici:websocket:pong")
  };
  if (A.enabled || s.enabled) {
    const a = s.enabled ? s : A;
    e.channel("undici:client:beforeConnect").subscribe((u) => {
      const {
        connectParams: { version: l, protocol: i, port: c, host: Q }
      } = u;
      a(
        "connecting to %s using %s%s",
        `${Q}${c ? `:${c}` : ""}`,
        i,
        l
      );
    }), e.channel("undici:client:connected").subscribe((u) => {
      const {
        connectParams: { version: l, protocol: i, port: c, host: Q }
      } = u;
      a(
        "connected to %s using %s%s",
        `${Q}${c ? `:${c}` : ""}`,
        i,
        l
      );
    }), e.channel("undici:client:connectError").subscribe((u) => {
      const {
        connectParams: { version: l, protocol: i, port: c, host: Q },
        error: h
      } = u;
      a(
        "connection to %s using %s%s errored - %s",
        `${Q}${c ? `:${c}` : ""}`,
        i,
        l,
        h.message
      );
    }), e.channel("undici:client:sendHeaders").subscribe((u) => {
      const {
        request: { method: l, path: i, origin: c }
      } = u;
      a("sending request to %s %s/%s", l, c, i);
    }), e.channel("undici:request:headers").subscribe((u) => {
      const {
        request: { method: l, path: i, origin: c },
        response: { statusCode: Q }
      } = u;
      a(
        "received response to %s %s/%s - HTTP %d",
        l,
        c,
        i,
        Q
      );
    }), e.channel("undici:request:trailers").subscribe((u) => {
      const {
        request: { method: l, path: i, origin: c }
      } = u;
      a("trailers received from %s %s/%s", l, c, i);
    }), e.channel("undici:request:error").subscribe((u) => {
      const {
        request: { method: l, path: i, origin: c },
        error: Q
      } = u;
      a(
        "request to %s %s/%s errored - %s",
        l,
        c,
        i,
        Q.message
      );
    }), n = !0;
  }
  if (r.enabled) {
    if (!n) {
      const a = A.enabled ? A : r;
      e.channel("undici:client:beforeConnect").subscribe((u) => {
        const {
          connectParams: { version: l, protocol: i, port: c, host: Q }
        } = u;
        a(
          "connecting to %s%s using %s%s",
          Q,
          c ? `:${c}` : "",
          i,
          l
        );
      }), e.channel("undici:client:connected").subscribe((u) => {
        const {
          connectParams: { version: l, protocol: i, port: c, host: Q }
        } = u;
        a(
          "connected to %s%s using %s%s",
          Q,
          c ? `:${c}` : "",
          i,
          l
        );
      }), e.channel("undici:client:connectError").subscribe((u) => {
        const {
          connectParams: { version: l, protocol: i, port: c, host: Q },
          error: h
        } = u;
        a(
          "connection to %s%s using %s%s errored - %s",
          Q,
          c ? `:${c}` : "",
          i,
          l,
          h.message
        );
      }), e.channel("undici:client:sendHeaders").subscribe((u) => {
        const {
          request: { method: l, path: i, origin: c }
        } = u;
        a("sending request to %s %s/%s", l, c, i);
      });
    }
    e.channel("undici:websocket:open").subscribe((a) => {
      const {
        address: { address: u, port: l }
      } = a;
      r("connection opened %s%s", u, l ? `:${l}` : "");
    }), e.channel("undici:websocket:close").subscribe((a) => {
      const { websocket: u, code: l, reason: i } = a;
      r(
        "closed connection to %s - %s %s",
        u.url,
        l,
        i
      );
    }), e.channel("undici:websocket:socket_error").subscribe((a) => {
      r("connection errored - %s", a.message);
    }), e.channel("undici:websocket:ping").subscribe((a) => {
      r("ping received");
    }), e.channel("undici:websocket:pong").subscribe((a) => {
      r("pong received");
    });
  }
  return nr = {
    channels: o
  }, nr;
}
var or, zn;
function ug() {
  if (zn) return or;
  zn = 1;
  const {
    InvalidArgumentError: e,
    NotSupportedError: t
  } = Ye(), A = He, {
    isValidHTTPToken: s,
    isValidHeaderValue: r,
    isStream: n,
    destroy: o,
    isBuffer: a,
    isFormDataLike: u,
    isIterable: l,
    isBlobLike: i,
    buildURL: c,
    validateHandler: Q,
    getServerName: h,
    normalizedMethodRecords: B
  } = Ue(), { channels: d } = Kt(), { headerNameLowerCasedRecord: y } = Ar(), b = /[^\u0021-\u00ff]/, F = /* @__PURE__ */ Symbol("handler");
  class M {
    constructor(f, {
      path: E,
      method: p,
      body: g,
      headers: C,
      query: w,
      idempotent: I,
      blocking: m,
      upgrade: D,
      headersTimeout: U,
      bodyTimeout: S,
      reset: G,
      throwOnError: v,
      expectContinue: $,
      servername: ne
    }, ge) {
      if (typeof E != "string")
        throw new e("path must be a string");
      if (E[0] !== "/" && !(E.startsWith("http://") || E.startsWith("https://")) && p !== "CONNECT")
        throw new e("path must be an absolute URL or start with a slash");
      if (b.test(E))
        throw new e("invalid request path");
      if (typeof p != "string")
        throw new e("method must be a string");
      if (B[p] === void 0 && !s(p))
        throw new e("invalid request method");
      if (D && typeof D != "string")
        throw new e("upgrade must be a string");
      if (U != null && (!Number.isFinite(U) || U < 0))
        throw new e("invalid headersTimeout");
      if (S != null && (!Number.isFinite(S) || S < 0))
        throw new e("invalid bodyTimeout");
      if (G != null && typeof G != "boolean")
        throw new e("invalid reset");
      if ($ != null && typeof $ != "boolean")
        throw new e("invalid expectContinue");
      if (this.headersTimeout = U, this.bodyTimeout = S, this.throwOnError = v === !0, this.method = p, this.abort = null, g == null)
        this.body = null;
      else if (n(g)) {
        this.body = g;
        const ae = this.body._readableState;
        (!ae || !ae.autoDestroy) && (this.endHandler = function() {
          o(this);
        }, this.body.on("end", this.endHandler)), this.errorHandler = (Be) => {
          this.abort ? this.abort(Be) : this.error = Be;
        }, this.body.on("error", this.errorHandler);
      } else if (a(g))
        this.body = g.byteLength ? g : null;
      else if (ArrayBuffer.isView(g))
        this.body = g.buffer.byteLength ? Buffer.from(g.buffer, g.byteOffset, g.byteLength) : null;
      else if (g instanceof ArrayBuffer)
        this.body = g.byteLength ? Buffer.from(g) : null;
      else if (typeof g == "string")
        this.body = g.length ? Buffer.from(g) : null;
      else if (u(g) || l(g) || i(g))
        this.body = g;
      else
        throw new e("body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable");
      if (this.completed = !1, this.aborted = !1, this.upgrade = D || null, this.path = w ? c(E, w) : E, this.origin = f, this.idempotent = I ?? (p === "HEAD" || p === "GET"), this.blocking = m ?? !1, this.reset = G ?? null, this.host = null, this.contentLength = null, this.contentType = null, this.headers = [], this.expectContinue = $ ?? !1, Array.isArray(C)) {
        if (C.length % 2 !== 0)
          throw new e("headers array must be even");
        for (let ae = 0; ae < C.length; ae += 2)
          L(this, C[ae], C[ae + 1]);
      } else if (C && typeof C == "object")
        if (C[Symbol.iterator])
          for (const ae of C) {
            if (!Array.isArray(ae) || ae.length !== 2)
              throw new e("headers must be in key-value pair format");
            L(this, ae[0], ae[1]);
          }
        else {
          const ae = Object.keys(C);
          for (let Be = 0; Be < ae.length; ++Be)
            L(this, ae[Be], C[ae[Be]]);
        }
      else if (C != null)
        throw new e("headers must be an object or an array");
      Q(ge, p, D), this.servername = ne || h(this.host), this[F] = ge, d.create.hasSubscribers && d.create.publish({ request: this });
    }
    onBodySent(f) {
      if (this[F].onBodySent)
        try {
          return this[F].onBodySent(f);
        } catch (E) {
          this.abort(E);
        }
    }
    onRequestSent() {
      if (d.bodySent.hasSubscribers && d.bodySent.publish({ request: this }), this[F].onRequestSent)
        try {
          return this[F].onRequestSent();
        } catch (f) {
          this.abort(f);
        }
    }
    onConnect(f) {
      if (A(!this.aborted), A(!this.completed), this.error)
        f(this.error);
      else
        return this.abort = f, this[F].onConnect(f);
    }
    onResponseStarted() {
      return this[F].onResponseStarted?.();
    }
    onHeaders(f, E, p, g) {
      A(!this.aborted), A(!this.completed), d.headers.hasSubscribers && d.headers.publish({ request: this, response: { statusCode: f, headers: E, statusText: g } });
      try {
        return this[F].onHeaders(f, E, p, g);
      } catch (C) {
        this.abort(C);
      }
    }
    onData(f) {
      A(!this.aborted), A(!this.completed);
      try {
        return this[F].onData(f);
      } catch (E) {
        return this.abort(E), !1;
      }
    }
    onUpgrade(f, E, p) {
      return A(!this.aborted), A(!this.completed), this[F].onUpgrade(f, E, p);
    }
    onComplete(f) {
      this.onFinally(), A(!this.aborted), this.completed = !0, d.trailers.hasSubscribers && d.trailers.publish({ request: this, trailers: f });
      try {
        return this[F].onComplete(f);
      } catch (E) {
        this.onError(E);
      }
    }
    onError(f) {
      if (this.onFinally(), d.error.hasSubscribers && d.error.publish({ request: this, error: f }), !this.aborted)
        return this.aborted = !0, this[F].onError(f);
    }
    onFinally() {
      this.errorHandler && (this.body.off("error", this.errorHandler), this.errorHandler = null), this.endHandler && (this.body.off("end", this.endHandler), this.endHandler = null);
    }
    addHeader(f, E) {
      return L(this, f, E), this;
    }
  }
  function L(N, f, E) {
    if (E && typeof E == "object" && !Array.isArray(E))
      throw new e(`invalid ${f} header`);
    if (E === void 0)
      return;
    let p = y[f];
    if (p === void 0 && (p = f.toLowerCase(), y[p] === void 0 && !s(p)))
      throw new e("invalid header key");
    if (Array.isArray(E)) {
      const g = [];
      for (let C = 0; C < E.length; C++)
        if (typeof E[C] == "string") {
          if (!r(E[C]))
            throw new e(`invalid ${f} header`);
          g.push(E[C]);
        } else if (E[C] === null)
          g.push("");
        else {
          if (typeof E[C] == "object")
            throw new e(`invalid ${f} header`);
          g.push(`${E[C]}`);
        }
      E = g;
    } else if (typeof E == "string") {
      if (!r(E))
        throw new e(`invalid ${f} header`);
    } else E === null ? E = "" : E = `${E}`;
    if (N.host === null && p === "host") {
      if (typeof E != "string")
        throw new e("invalid host header");
      N.host = E;
    } else if (N.contentLength === null && p === "content-length") {
      if (N.contentLength = parseInt(E, 10), !Number.isFinite(N.contentLength))
        throw new e("invalid content-length header");
    } else if (N.contentType === null && p === "content-type")
      N.contentType = E, N.headers.push(f, E);
    else {
      if (p === "transfer-encoding" || p === "keep-alive" || p === "upgrade")
        throw new e(`invalid ${p} header`);
      if (p === "connection") {
        const g = typeof E == "string" ? E.toLowerCase() : null;
        if (g !== "close" && g !== "keep-alive")
          throw new e("invalid connection header");
        g === "close" && (N.reset = !0);
      } else {
        if (p === "expect")
          throw new t("expect header not supported");
        N.headers.push(f, E);
      }
    }
  }
  return or = M, or;
}
var ir, Zn;
function wA() {
  if (Zn) return ir;
  Zn = 1;
  const e = Wt;
  class t extends e {
    dispatch() {
      throw new Error("not implemented");
    }
    close() {
      throw new Error("not implemented");
    }
    destroy() {
      throw new Error("not implemented");
    }
    compose(...r) {
      const n = Array.isArray(r[0]) ? r[0] : r;
      let o = this.dispatch.bind(this);
      for (const a of n)
        if (a != null) {
          if (typeof a != "function")
            throw new TypeError(`invalid interceptor, expected function received ${typeof a}`);
          if (o = a(o), o == null || typeof o != "function" || o.length !== 2)
            throw new TypeError("invalid interceptor");
        }
      return new A(this, o);
    }
  }
  class A extends t {
    #e = null;
    #t = null;
    constructor(r, n) {
      super(), this.#e = r, this.#t = n;
    }
    dispatch(...r) {
      this.#t(...r);
    }
    close(...r) {
      return this.#e.close(...r);
    }
    destroy(...r) {
      return this.#e.destroy(...r);
    }
  }
  return ir = t, ir;
}
var ar, Kn;
function jt() {
  if (Kn) return ar;
  Kn = 1;
  const e = wA(), {
    ClientDestroyedError: t,
    ClientClosedError: A,
    InvalidArgumentError: s
  } = Ye(), { kDestroy: r, kClose: n, kClosed: o, kDestroyed: a, kDispatch: u, kInterceptors: l } = Ve(), i = /* @__PURE__ */ Symbol("onDestroyed"), c = /* @__PURE__ */ Symbol("onClosed"), Q = /* @__PURE__ */ Symbol("Intercepted Dispatch");
  class h extends e {
    constructor() {
      super(), this[a] = !1, this[i] = null, this[o] = !1, this[c] = [];
    }
    get destroyed() {
      return this[a];
    }
    get closed() {
      return this[o];
    }
    get interceptors() {
      return this[l];
    }
    set interceptors(d) {
      if (d) {
        for (let y = d.length - 1; y >= 0; y--)
          if (typeof this[l][y] != "function")
            throw new s("interceptor must be an function");
      }
      this[l] = d;
    }
    close(d) {
      if (d === void 0)
        return new Promise((b, F) => {
          this.close((M, L) => M ? F(M) : b(L));
        });
      if (typeof d != "function")
        throw new s("invalid callback");
      if (this[a]) {
        queueMicrotask(() => d(new t(), null));
        return;
      }
      if (this[o]) {
        this[c] ? this[c].push(d) : queueMicrotask(() => d(null, null));
        return;
      }
      this[o] = !0, this[c].push(d);
      const y = () => {
        const b = this[c];
        this[c] = null;
        for (let F = 0; F < b.length; F++)
          b[F](null, null);
      };
      this[n]().then(() => this.destroy()).then(() => {
        queueMicrotask(y);
      });
    }
    destroy(d, y) {
      if (typeof d == "function" && (y = d, d = null), y === void 0)
        return new Promise((F, M) => {
          this.destroy(d, (L, N) => L ? (
            /* istanbul ignore next: should never error */
            M(L)
          ) : F(N));
        });
      if (typeof y != "function")
        throw new s("invalid callback");
      if (this[a]) {
        this[i] ? this[i].push(y) : queueMicrotask(() => y(null, null));
        return;
      }
      d || (d = new t()), this[a] = !0, this[i] = this[i] || [], this[i].push(y);
      const b = () => {
        const F = this[i];
        this[i] = null;
        for (let M = 0; M < F.length; M++)
          F[M](null, null);
      };
      this[r](d).then(() => {
        queueMicrotask(b);
      });
    }
    [Q](d, y) {
      if (!this[l] || this[l].length === 0)
        return this[Q] = this[u], this[u](d, y);
      let b = this[u].bind(this);
      for (let F = this[l].length - 1; F >= 0; F--)
        b = this[l][F](b);
      return this[Q] = b, b(d, y);
    }
    dispatch(d, y) {
      if (!y || typeof y != "object")
        throw new s("handler must be an object");
      try {
        if (!d || typeof d != "object")
          throw new s("opts must be an object.");
        if (this[a] || this[i])
          throw new t();
        if (this[o])
          throw new A();
        return this[Q](d, y);
      } catch (b) {
        if (typeof y.onError != "function")
          throw new s("invalid onError method");
        return y.onError(b), !1;
      }
    }
  }
  return ar = h, ar;
}
var cr, jn;
function Xn() {
  if (jn) return cr;
  jn = 1;
  let e = 0;
  const t = 1e3, A = (t >> 1) - 1;
  let s;
  const r = /* @__PURE__ */ Symbol("kFastTimer"), n = [], o = -2, a = -1, u = 0, l = 1;
  function i() {
    e += A;
    let h = 0, B = n.length;
    for (; h < B; ) {
      const d = n[h];
      d._state === u ? (d._idleStart = e - A, d._state = l) : d._state === l && e >= d._idleStart + d._idleTimeout && (d._state = a, d._idleStart = -1, d._onTimeout(d._timerArg)), d._state === a ? (d._state = o, --B !== 0 && (n[h] = n[B])) : ++h;
    }
    n.length = B, n.length !== 0 && c();
  }
  function c() {
    s ? s.refresh() : (clearTimeout(s), s = setTimeout(i, A), s.unref && s.unref());
  }
  class Q {
    [r] = !0;
    /**
     * The state of the timer, which can be one of the following:
     * - NOT_IN_LIST (-2)
     * - TO_BE_CLEARED (-1)
     * - PENDING (0)
     * - ACTIVE (1)
     *
     * @type {-2|-1|0|1}
     * @private
     */
    _state = o;
    /**
     * The number of milliseconds to wait before calling the callback.
     *
     * @type {number}
     * @private
     */
    _idleTimeout = -1;
    /**
     * The time in milliseconds when the timer was started. This value is used to
     * calculate when the timer should expire.
     *
     * @type {number}
     * @default -1
     * @private
     */
    _idleStart = -1;
    /**
     * The function to be executed when the timer expires.
     * @type {Function}
     * @private
     */
    _onTimeout;
    /**
     * The argument to be passed to the callback when the timer expires.
     *
     * @type {*}
     * @private
     */
    _timerArg;
    /**
     * @constructor
     * @param {Function} callback A function to be executed after the timer
     * expires.
     * @param {number} delay The time, in milliseconds that the timer should wait
     * before the specified function or code is executed.
     * @param {*} arg
     */
    constructor(B, d, y) {
      this._onTimeout = B, this._idleTimeout = d, this._timerArg = y, this.refresh();
    }
    /**
     * Sets the timer's start time to the current time, and reschedules the timer
     * to call its callback at the previously specified duration adjusted to the
     * current time.
     * Using this on a timer that has already called its callback will reactivate
     * the timer.
     *
     * @returns {void}
     */
    refresh() {
      this._state === o && n.push(this), (!s || n.length === 1) && c(), this._state = u;
    }
    /**
     * The `clear` method cancels the timer, preventing it from executing.
     *
     * @returns {void}
     * @private
     */
    clear() {
      this._state = a, this._idleStart = -1;
    }
  }
  return cr = {
    /**
     * The setTimeout() method sets a timer which executes a function once the
     * timer expires.
     * @param {Function} callback A function to be executed after the timer
     * expires.
     * @param {number} delay The time, in milliseconds that the timer should
     * wait before the specified function or code is executed.
     * @param {*} [arg] An optional argument to be passed to the callback function
     * when the timer expires.
     * @returns {NodeJS.Timeout|FastTimer}
     */
    setTimeout(h, B, d) {
      return B <= t ? setTimeout(h, B, d) : new Q(h, B, d);
    },
    /**
     * The clearTimeout method cancels an instantiated Timer previously created
     * by calling setTimeout.
     *
     * @param {NodeJS.Timeout|FastTimer} timeout
     */
    clearTimeout(h) {
      h[r] ? h.clear() : clearTimeout(h);
    },
    /**
     * The setFastTimeout() method sets a fastTimer which executes a function once
     * the timer expires.
     * @param {Function} callback A function to be executed after the timer
     * expires.
     * @param {number} delay The time, in milliseconds that the timer should
     * wait before the specified function or code is executed.
     * @param {*} [arg] An optional argument to be passed to the callback function
     * when the timer expires.
     * @returns {FastTimer}
     */
    setFastTimeout(h, B, d) {
      return new Q(h, B, d);
    },
    /**
     * The clearTimeout method cancels an instantiated FastTimer previously
     * created by calling setFastTimeout.
     *
     * @param {FastTimer} timeout
     */
    clearFastTimeout(h) {
      h.clear();
    },
    /**
     * The now method returns the value of the internal fast timer clock.
     *
     * @returns {number}
     */
    now() {
      return e;
    },
    /**
     * Trigger the onTick function to process the fastTimers array.
     * Exported for testing purposes only.
     * Marking as deprecated to discourage any use outside of testing.
     * @deprecated
     * @param {number} [delay=0] The delay in milliseconds to add to the now value.
     */
    tick(h = 0) {
      e += h - t + 1, i(), i();
    },
    /**
     * Reset FastTimers.
     * Exported for testing purposes only.
     * Marking as deprecated to discourage any use outside of testing.
     * @deprecated
     */
    reset() {
      e = 0, n.length = 0, clearTimeout(s), s = null;
    },
    /**
     * Exporting for testing purposes only.
     * Marking as deprecated to discourage any use outside of testing.
     * @deprecated
     */
    kFastTimer: r
  }, cr;
}
var gr, $n;
function mA() {
  if ($n) return gr;
  $n = 1;
  const e = dA, t = He, A = Ue(), { InvalidArgumentError: s, ConnectTimeoutError: r } = Ye(), n = Xn();
  function o() {
  }
  let a, u;
  Yn.FinalizationRegistry && !(process.env.NODE_V8_COVERAGE || process.env.UNDICI_NO_FG) ? u = class {
    constructor(h) {
      this._maxCachedSessions = h, this._sessionCache = /* @__PURE__ */ new Map(), this._sessionRegistry = new Yn.FinalizationRegistry((B) => {
        if (this._sessionCache.size < this._maxCachedSessions)
          return;
        const d = this._sessionCache.get(B);
        d !== void 0 && d.deref() === void 0 && this._sessionCache.delete(B);
      });
    }
    get(h) {
      const B = this._sessionCache.get(h);
      return B ? B.deref() : null;
    }
    set(h, B) {
      this._maxCachedSessions !== 0 && (this._sessionCache.set(h, new WeakRef(B)), this._sessionRegistry.register(B, h));
    }
  } : u = class {
    constructor(h) {
      this._maxCachedSessions = h, this._sessionCache = /* @__PURE__ */ new Map();
    }
    get(h) {
      return this._sessionCache.get(h);
    }
    set(h, B) {
      if (this._maxCachedSessions !== 0) {
        if (this._sessionCache.size >= this._maxCachedSessions) {
          const { value: d } = this._sessionCache.keys().next();
          this._sessionCache.delete(d);
        }
        this._sessionCache.set(h, B);
      }
    }
  };
  function l({ allowH2: Q, maxCachedSessions: h, socketPath: B, timeout: d, session: y, ...b }) {
    if (h != null && (!Number.isInteger(h) || h < 0))
      throw new s("maxCachedSessions must be a positive integer or zero");
    const F = { path: B, ...b }, M = new u(h ?? 100);
    return d = d ?? 1e4, Q = Q ?? !1, function({ hostname: N, host: f, protocol: E, port: p, servername: g, localAddress: C, httpSocket: w }, I) {
      let m;
      if (E === "https:") {
        a || (a = zc), g = g || F.servername || A.getServerName(f) || null;
        const U = g || N;
        t(U);
        const S = y || M.get(U) || null;
        p = p || 443, m = a.connect({
          highWaterMark: 16384,
          // TLS in node can't have bigger HWM anyway...
          ...F,
          servername: g,
          session: S,
          localAddress: C,
          // TODO(HTTP/2): Add support for h2c
          ALPNProtocols: Q ? ["http/1.1", "h2"] : ["http/1.1"],
          socket: w,
          // upgrade socket connection
          port: p,
          host: N
        }), m.on("session", function(G) {
          M.set(U, G);
        });
      } else
        t(!w, "httpSocket can only be sent on TLS update"), p = p || 80, m = e.connect({
          highWaterMark: 64 * 1024,
          // Same as nodejs fs streams.
          ...F,
          localAddress: C,
          port: p,
          host: N
        });
      if (F.keepAlive == null || F.keepAlive) {
        const U = F.keepAliveInitialDelay === void 0 ? 6e4 : F.keepAliveInitialDelay;
        m.setKeepAlive(!0, U);
      }
      const D = i(new WeakRef(m), { timeout: d, hostname: N, port: p });
      return m.setNoDelay(!0).once(E === "https:" ? "secureConnect" : "connect", function() {
        if (queueMicrotask(D), I) {
          const U = I;
          I = null, U(null, this);
        }
      }).on("error", function(U) {
        if (queueMicrotask(D), I) {
          const S = I;
          I = null, S(U);
        }
      }), m;
    };
  }
  const i = process.platform === "win32" ? (Q, h) => {
    if (!h.timeout)
      return o;
    let B = null, d = null;
    const y = n.setFastTimeout(() => {
      B = setImmediate(() => {
        d = setImmediate(() => c(Q.deref(), h));
      });
    }, h.timeout);
    return () => {
      n.clearFastTimeout(y), clearImmediate(B), clearImmediate(d);
    };
  } : (Q, h) => {
    if (!h.timeout)
      return o;
    let B = null;
    const d = n.setFastTimeout(() => {
      B = setImmediate(() => {
        c(Q.deref(), h);
      });
    }, h.timeout);
    return () => {
      n.clearFastTimeout(d), clearImmediate(B);
    };
  };
  function c(Q, h) {
    if (Q == null)
      return;
    let B = "Connect Timeout Error";
    Array.isArray(Q.autoSelectFamilyAttemptedAddresses) ? B += ` (attempted addresses: ${Q.autoSelectFamilyAttemptedAddresses.join(", ")},` : B += ` (attempted address: ${h.hostname}:${h.port},`, B += ` timeout: ${h.timeout}ms)`, A.destroy(Q, new r(B));
  }
  return gr = l, gr;
}
var lr = {}, Xt = {}, eo;
function Eg() {
  if (eo) return Xt;
  eo = 1, Object.defineProperty(Xt, "__esModule", { value: !0 }), Xt.enumToMap = void 0;
  function e(t) {
    const A = {};
    return Object.keys(t).forEach((s) => {
      const r = t[s];
      typeof r == "number" && (A[s] = r);
    }), A;
  }
  return Xt.enumToMap = e, Xt;
}
var to;
function Qg() {
  return to || (to = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.SPECIAL_HEADERS = e.HEADER_STATE = e.MINOR = e.MAJOR = e.CONNECTION_TOKEN_CHARS = e.HEADER_CHARS = e.TOKEN = e.STRICT_TOKEN = e.HEX = e.URL_CHAR = e.STRICT_URL_CHAR = e.USERINFO_CHARS = e.MARK = e.ALPHANUM = e.NUM = e.HEX_MAP = e.NUM_MAP = e.ALPHA = e.FINISH = e.H_METHOD_MAP = e.METHOD_MAP = e.METHODS_RTSP = e.METHODS_ICE = e.METHODS_HTTP = e.METHODS = e.LENIENT_FLAGS = e.FLAGS = e.TYPE = e.ERROR = void 0;
    const t = Eg();
    (function(r) {
      r[r.OK = 0] = "OK", r[r.INTERNAL = 1] = "INTERNAL", r[r.STRICT = 2] = "STRICT", r[r.LF_EXPECTED = 3] = "LF_EXPECTED", r[r.UNEXPECTED_CONTENT_LENGTH = 4] = "UNEXPECTED_CONTENT_LENGTH", r[r.CLOSED_CONNECTION = 5] = "CLOSED_CONNECTION", r[r.INVALID_METHOD = 6] = "INVALID_METHOD", r[r.INVALID_URL = 7] = "INVALID_URL", r[r.INVALID_CONSTANT = 8] = "INVALID_CONSTANT", r[r.INVALID_VERSION = 9] = "INVALID_VERSION", r[r.INVALID_HEADER_TOKEN = 10] = "INVALID_HEADER_TOKEN", r[r.INVALID_CONTENT_LENGTH = 11] = "INVALID_CONTENT_LENGTH", r[r.INVALID_CHUNK_SIZE = 12] = "INVALID_CHUNK_SIZE", r[r.INVALID_STATUS = 13] = "INVALID_STATUS", r[r.INVALID_EOF_STATE = 14] = "INVALID_EOF_STATE", r[r.INVALID_TRANSFER_ENCODING = 15] = "INVALID_TRANSFER_ENCODING", r[r.CB_MESSAGE_BEGIN = 16] = "CB_MESSAGE_BEGIN", r[r.CB_HEADERS_COMPLETE = 17] = "CB_HEADERS_COMPLETE", r[r.CB_MESSAGE_COMPLETE = 18] = "CB_MESSAGE_COMPLETE", r[r.CB_CHUNK_HEADER = 19] = "CB_CHUNK_HEADER", r[r.CB_CHUNK_COMPLETE = 20] = "CB_CHUNK_COMPLETE", r[r.PAUSED = 21] = "PAUSED", r[r.PAUSED_UPGRADE = 22] = "PAUSED_UPGRADE", r[r.PAUSED_H2_UPGRADE = 23] = "PAUSED_H2_UPGRADE", r[r.USER = 24] = "USER";
    })(e.ERROR || (e.ERROR = {})), (function(r) {
      r[r.BOTH = 0] = "BOTH", r[r.REQUEST = 1] = "REQUEST", r[r.RESPONSE = 2] = "RESPONSE";
    })(e.TYPE || (e.TYPE = {})), (function(r) {
      r[r.CONNECTION_KEEP_ALIVE = 1] = "CONNECTION_KEEP_ALIVE", r[r.CONNECTION_CLOSE = 2] = "CONNECTION_CLOSE", r[r.CONNECTION_UPGRADE = 4] = "CONNECTION_UPGRADE", r[r.CHUNKED = 8] = "CHUNKED", r[r.UPGRADE = 16] = "UPGRADE", r[r.CONTENT_LENGTH = 32] = "CONTENT_LENGTH", r[r.SKIPBODY = 64] = "SKIPBODY", r[r.TRAILING = 128] = "TRAILING", r[r.TRANSFER_ENCODING = 512] = "TRANSFER_ENCODING";
    })(e.FLAGS || (e.FLAGS = {})), (function(r) {
      r[r.HEADERS = 1] = "HEADERS", r[r.CHUNKED_LENGTH = 2] = "CHUNKED_LENGTH", r[r.KEEP_ALIVE = 4] = "KEEP_ALIVE";
    })(e.LENIENT_FLAGS || (e.LENIENT_FLAGS = {}));
    var A;
    (function(r) {
      r[r.DELETE = 0] = "DELETE", r[r.GET = 1] = "GET", r[r.HEAD = 2] = "HEAD", r[r.POST = 3] = "POST", r[r.PUT = 4] = "PUT", r[r.CONNECT = 5] = "CONNECT", r[r.OPTIONS = 6] = "OPTIONS", r[r.TRACE = 7] = "TRACE", r[r.COPY = 8] = "COPY", r[r.LOCK = 9] = "LOCK", r[r.MKCOL = 10] = "MKCOL", r[r.MOVE = 11] = "MOVE", r[r.PROPFIND = 12] = "PROPFIND", r[r.PROPPATCH = 13] = "PROPPATCH", r[r.SEARCH = 14] = "SEARCH", r[r.UNLOCK = 15] = "UNLOCK", r[r.BIND = 16] = "BIND", r[r.REBIND = 17] = "REBIND", r[r.UNBIND = 18] = "UNBIND", r[r.ACL = 19] = "ACL", r[r.REPORT = 20] = "REPORT", r[r.MKACTIVITY = 21] = "MKACTIVITY", r[r.CHECKOUT = 22] = "CHECKOUT", r[r.MERGE = 23] = "MERGE", r[r["M-SEARCH"] = 24] = "M-SEARCH", r[r.NOTIFY = 25] = "NOTIFY", r[r.SUBSCRIBE = 26] = "SUBSCRIBE", r[r.UNSUBSCRIBE = 27] = "UNSUBSCRIBE", r[r.PATCH = 28] = "PATCH", r[r.PURGE = 29] = "PURGE", r[r.MKCALENDAR = 30] = "MKCALENDAR", r[r.LINK = 31] = "LINK", r[r.UNLINK = 32] = "UNLINK", r[r.SOURCE = 33] = "SOURCE", r[r.PRI = 34] = "PRI", r[r.DESCRIBE = 35] = "DESCRIBE", r[r.ANNOUNCE = 36] = "ANNOUNCE", r[r.SETUP = 37] = "SETUP", r[r.PLAY = 38] = "PLAY", r[r.PAUSE = 39] = "PAUSE", r[r.TEARDOWN = 40] = "TEARDOWN", r[r.GET_PARAMETER = 41] = "GET_PARAMETER", r[r.SET_PARAMETER = 42] = "SET_PARAMETER", r[r.REDIRECT = 43] = "REDIRECT", r[r.RECORD = 44] = "RECORD", r[r.FLUSH = 45] = "FLUSH";
    })(A = e.METHODS || (e.METHODS = {})), e.METHODS_HTTP = [
      A.DELETE,
      A.GET,
      A.HEAD,
      A.POST,
      A.PUT,
      A.CONNECT,
      A.OPTIONS,
      A.TRACE,
      A.COPY,
      A.LOCK,
      A.MKCOL,
      A.MOVE,
      A.PROPFIND,
      A.PROPPATCH,
      A.SEARCH,
      A.UNLOCK,
      A.BIND,
      A.REBIND,
      A.UNBIND,
      A.ACL,
      A.REPORT,
      A.MKACTIVITY,
      A.CHECKOUT,
      A.MERGE,
      A["M-SEARCH"],
      A.NOTIFY,
      A.SUBSCRIBE,
      A.UNSUBSCRIBE,
      A.PATCH,
      A.PURGE,
      A.MKCALENDAR,
      A.LINK,
      A.UNLINK,
      A.PRI,
      // TODO(indutny): should we allow it with HTTP?
      A.SOURCE
    ], e.METHODS_ICE = [
      A.SOURCE
    ], e.METHODS_RTSP = [
      A.OPTIONS,
      A.DESCRIBE,
      A.ANNOUNCE,
      A.SETUP,
      A.PLAY,
      A.PAUSE,
      A.TEARDOWN,
      A.GET_PARAMETER,
      A.SET_PARAMETER,
      A.REDIRECT,
      A.RECORD,
      A.FLUSH,
      // For AirPlay
      A.GET,
      A.POST
    ], e.METHOD_MAP = t.enumToMap(A), e.H_METHOD_MAP = {}, Object.keys(e.METHOD_MAP).forEach((r) => {
      /^H/.test(r) && (e.H_METHOD_MAP[r] = e.METHOD_MAP[r]);
    }), (function(r) {
      r[r.SAFE = 0] = "SAFE", r[r.SAFE_WITH_CB = 1] = "SAFE_WITH_CB", r[r.UNSAFE = 2] = "UNSAFE";
    })(e.FINISH || (e.FINISH = {})), e.ALPHA = [];
    for (let r = 65; r <= 90; r++)
      e.ALPHA.push(String.fromCharCode(r)), e.ALPHA.push(String.fromCharCode(r + 32));
    e.NUM_MAP = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9
    }, e.HEX_MAP = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
      a: 10,
      b: 11,
      c: 12,
      d: 13,
      e: 14,
      f: 15
    }, e.NUM = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9"
    ], e.ALPHANUM = e.ALPHA.concat(e.NUM), e.MARK = ["-", "_", ".", "!", "~", "*", "'", "(", ")"], e.USERINFO_CHARS = e.ALPHANUM.concat(e.MARK).concat(["%", ";", ":", "&", "=", "+", "$", ","]), e.STRICT_URL_CHAR = [
      "!",
      '"',
      "$",
      "%",
      "&",
      "'",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      ":",
      ";",
      "<",
      "=",
      ">",
      "@",
      "[",
      "\\",
      "]",
      "^",
      "_",
      "`",
      "{",
      "|",
      "}",
      "~"
    ].concat(e.ALPHANUM), e.URL_CHAR = e.STRICT_URL_CHAR.concat(["	", "\f"]);
    for (let r = 128; r <= 255; r++)
      e.URL_CHAR.push(r);
    e.HEX = e.NUM.concat(["a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"]), e.STRICT_TOKEN = [
      "!",
      "#",
      "$",
      "%",
      "&",
      "'",
      "*",
      "+",
      "-",
      ".",
      "^",
      "_",
      "`",
      "|",
      "~"
    ].concat(e.ALPHANUM), e.TOKEN = e.STRICT_TOKEN.concat([" "]), e.HEADER_CHARS = ["	"];
    for (let r = 32; r <= 255; r++)
      r !== 127 && e.HEADER_CHARS.push(r);
    e.CONNECTION_TOKEN_CHARS = e.HEADER_CHARS.filter((r) => r !== 44), e.MAJOR = e.NUM_MAP, e.MINOR = e.MAJOR;
    var s;
    (function(r) {
      r[r.GENERAL = 0] = "GENERAL", r[r.CONNECTION = 1] = "CONNECTION", r[r.CONTENT_LENGTH = 2] = "CONTENT_LENGTH", r[r.TRANSFER_ENCODING = 3] = "TRANSFER_ENCODING", r[r.UPGRADE = 4] = "UPGRADE", r[r.CONNECTION_KEEP_ALIVE = 5] = "CONNECTION_KEEP_ALIVE", r[r.CONNECTION_CLOSE = 6] = "CONNECTION_CLOSE", r[r.CONNECTION_UPGRADE = 7] = "CONNECTION_UPGRADE", r[r.TRANSFER_ENCODING_CHUNKED = 8] = "TRANSFER_ENCODING_CHUNKED";
    })(s = e.HEADER_STATE || (e.HEADER_STATE = {})), e.SPECIAL_HEADERS = {
      connection: s.CONNECTION,
      "content-length": s.CONTENT_LENGTH,
      "proxy-connection": s.CONNECTION,
      "transfer-encoding": s.TRANSFER_ENCODING,
      upgrade: s.UPGRADE
    };
  })(lr)), lr;
}
var ur, Ao;
function ro() {
  if (Ao) return ur;
  Ao = 1;
  const { Buffer: e } = at;
  return ur = e.from("AGFzbQEAAAABJwdgAX8Bf2ADf39/AX9gAX8AYAJ/fwBgBH9/f38Bf2AAAGADf39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQAEA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAAy0sBQYAAAIAAAAAAAACAQIAAgICAAADAAAAAAMDAwMBAQEBAQEBAQEAAAIAAAAEBQFwARISBQMBAAIGCAF/AUGA1AQLB9EFIgZtZW1vcnkCAAtfaW5pdGlhbGl6ZQAIGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAtsbGh0dHBfaW5pdAAJGGxsaHR0cF9zaG91bGRfa2VlcF9hbGl2ZQAvDGxsaHR0cF9hbGxvYwALBm1hbGxvYwAxC2xsaHR0cF9mcmVlAAwEZnJlZQAMD2xsaHR0cF9nZXRfdHlwZQANFWxsaHR0cF9nZXRfaHR0cF9tYWpvcgAOFWxsaHR0cF9nZXRfaHR0cF9taW5vcgAPEWxsaHR0cF9nZXRfbWV0aG9kABAWbGxodHRwX2dldF9zdGF0dXNfY29kZQAREmxsaHR0cF9nZXRfdXBncmFkZQASDGxsaHR0cF9yZXNldAATDmxsaHR0cF9leGVjdXRlABQUbGxodHRwX3NldHRpbmdzX2luaXQAFQ1sbGh0dHBfZmluaXNoABYMbGxodHRwX3BhdXNlABcNbGxodHRwX3Jlc3VtZQAYG2xsaHR0cF9yZXN1bWVfYWZ0ZXJfdXBncmFkZQAZEGxsaHR0cF9nZXRfZXJybm8AGhdsbGh0dHBfZ2V0X2Vycm9yX3JlYXNvbgAbF2xsaHR0cF9zZXRfZXJyb3JfcmVhc29uABwUbGxodHRwX2dldF9lcnJvcl9wb3MAHRFsbGh0dHBfZXJybm9fbmFtZQAeEmxsaHR0cF9tZXRob2RfbmFtZQAfEmxsaHR0cF9zdGF0dXNfbmFtZQAgGmxsaHR0cF9zZXRfbGVu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PgtBhwEMPQtBiAEMPAtBiQEMOwtBigEMOgtBiwEMOQtBjAEMOAtBjQEMNwtBjgEMNgtBjwEMNQtBkAEMNAtBkQEMMwtBkgEMMgtBkwEMMQtBlAEMMAtBlQEMLwtBlgEMLgtBlwEMLQtBmAEMLAtBmQEMKwtBmgEMKgtBmwEMKQtBnAEMKAtBnQEMJwtBngEMJgtBnwEMJQtBoAEMJAtBoQEMIwtBogEMIgtBowEMIQtBpAEMIAtBpQEMHwtBpgEMHgtBpwEMHQtBqAEMHAtBqQEMGwtBqgEMGgtBqwEMGQtBrAEMGAtBrQEMFwtBrgEMFgtBAQwVC0GvAQwUC0GwAQwTC0GxAQwSC0GzAQwRC0GyAQwQC0G0AQwPC0G1AQwOC0G2AQwNC0G3AQwMC0G4AQwLC0G5AQwKC0G6AQwJC0G7AQwIC0HGAQwHC0G8AQwGC0G9AQwFC0G+AQwEC0G/AQwDC0HAAQwCC0HCAQwBC0HBAQshAwNAAkACQAJAAkACQAJAAkACQAJAIAICfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAgJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACfwJAAkACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAC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iQEhAwykAgtBASABLQAAQd8ARw1nGiABQQFqIQEMXgtBigEhAyABIARGDaICIAIoAgAiACAEIAFraiEFIAEgAGtBAWohBgNAIAEtAAAgAEGMzwBqLQAARw1kIABBAUYN+gEgAEEBaiEAIAQgAUEBaiIBRw0ACyACIAU2AgAMogILQYsBIQMgASAERg2hAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGOzwBqLQAARw1kIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyiAgsgAkEANgIAIAZBAWohAUECDGULQYwBIQMgASAERg2gAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHwzwBqLQAARw1jIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyhAgsgAkEANgIAIAZBAWohAUEfDGQLQY0BIQMgASAERg2fAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHyzwBqLQAARw1iIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAygAgsgAkEANgIAIAZBAWohAUEJDGMLIAEgBEYEQEGOASEDDJ8CCwJAAkAgAS0AAEHJAGsOBwBiYmJiYgFiCyABQQFqIQFB+AAhAwyGAgsgAUEBaiEBQfkAIQMMhQILQY8BIQMgASAERg2dAiACKAIAIgAgBCABa2ohBSABIABrQQVqIQYCQANAIAEtAAAgAEGRzwBqLQAARw1gIABBBUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyeAgsgAkEANgIAIAZBAWohAUEYDGELQZABIQMgASAERg2cAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGXzwBqLQAARw1fIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAydAgsgAkEANgIAIAZBAWohAUEXDGALQZEBIQMgASAERg2bAiACKAIAIgAgBCABa2ohBSABIABrQQZqIQYCQANAIAEtAAAgAEGazwBqLQAARw1eIABBBkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAycAgsgAkEANgIAIAZBAWohAUEV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JSIARQ0RIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMtAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0gIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMswELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0iIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMsgELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0OIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMsQELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0dIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMsAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0fIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMrwELIABBP0cNASABQQFqCyEBQQUhAwyUAQtBACEDIAJBADYCHCACIAE2AhQgAkH9EjYCECACQQc2AgwMrAELIAJBADYCHCACIAE2AhQgAkHcCDYCECACQQc2AgxBACEDDKsBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNByACQeUANgIcIAIgATYCFCACIAA2AgxBACEDDKoBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNFiACQdMANgIcIAIgATYCFCACIAA2AgxBACEDDKkBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNGCACQdIANgIcIAIgATYCFCACIAA2AgxBACEDDKgBCyACQQA2AhwgAiABNgIUIAJBxgo2AhAgAkEHNgIMQQAhAwynAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQMgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwymAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRIgAkHTADYCHCACIAE2AhQgAiAANgIMQQAhAwylAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRQgAkHSADYCHCACIAE2AhQgAiAANgIMQQAhAwykAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQAgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwyjAQtB1QAhAwyJAQsgAEEVRwRAIAJBADYCHCACIAE2AhQgAkG5DTYCECACQRo2AgxBACEDDKIBCyACQeQANgIcIAIgATYCFCACQeMXNgIQIAJBFTYCDEEAIQMMoQELIAJBADYCACAGQQFqIQEgAi0AKSIAQSNrQQtJDQQCQCAAQQZLDQBBASAAdEHKAHFFDQAMBQtBACEDIAJBADYCHCACIAE2AhQgAkH3CTYCECACQQg2AgwMoAELIAJBADYCACAGQQFqIQEgAi0AKUEhRg0DIAJBADYCHCACIAE2AhQgAkGbCjYCECACQQg2AgxBACEDDJ8BCyACQQA2AgALQQAhAyACQQA2AhwgAiABNgIUIAJBkDM2AhAgAkEINgIMDJ0BCyACQQA2AgAgBkEBaiEBIAItAClBI0kNACACQQA2AhwgAiABNgIUIAJB0wk2AhAgAkEINgIMQQAhAwycAQtB0QAhAwyCAQsgAS0AAEEwayIAQf8BcUEKSQRAIAIgADoAKiABQQFqIQFBzwAhAwyCAQsgAigCBCEAIAJBADYCBCACIAAgARAoIgBFDYYBIAJB3gA2AhwgAiABNgIUIAIgADYCDEEAIQMMmgELIAIoAgQhACACQQA2AgQgAiAAIAEQKCIARQ2GASACQdwANgIcIAIgATYCFCACIAA2AgxBACEDDJkBCyACKAIEIQAgAkEANgIEIAIgACAFECgiAEUEQCAFIQEMhwELIAJB2gA2AhwgAiAFNgIUIAIgADYCDAyYAQtBACEBQQEhAwsgAiADOgArIAVBAWohAwJAAkACQCACLQAtQRBxDQACQAJAAkAgAi0AKg4DAQACBAsgBkUNAwwCCyAADQEMAgsgAUUNAQsgAigCBCEAIAJBADYCBCACIAAgAxAoIgBFBEAgAyEBDAILIAJB2AA2AhwgAiADNgIUIAIgADYCDEEAIQMMmAELIAIoAgQhACACQQA2AgQgAiAAIAMQKCIARQRAIAMhAQyHAQsgAkHZADYCHCACIAM2AhQgAiAANgIMQQAhAwyXAQtBzAAhAwx9CyAAQRVHBEAgAkEANgIcIAIgATYCFCACQZQNNgIQIAJBITYCDEEAIQMMlgELIAJB1wA2AhwgAiABNgIUIAJByRc2AhAgAkEVNgIMQQAhAwyVAQtBACEDIAJBADYCHCACIAE2AhQgAkGAETYCECACQQk2AgwMlAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0AIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMkwELQckAIQMMeQsgAkEANgIcIAIgATYCFCACQcEoNgIQIAJBBzYCDCACQQA2AgBBACEDDJEBCyACKAIEIQBBACEDIAJBADYCBCACIAAgARAlIgBFDQAgAkHSADYCHCACIAE2AhQgAiAANgIMDJABC0HIACEDDHYLIAJBADYCACAFIQELIAJBgBI7ASogAUEBaiEBQQAhAAJAIAIoAjgiA0UNACADKAIwIgNFDQAgAiADEQAAIQALIAANAQtBxwAhAwxzCyAAQRVGBEAgAkHRADYCHCACIAE2AhQgAkHjFzYCECACQRU2AgxBACEDDIwBC0EAIQMgAkEANgIcIAIgATYCFCACQbkNNgIQIAJBGjYCDAyLAQtBACEDIAJBADYCHCACIAE2AhQgAkGgGTYCECACQR42AgwMigELIAEtAABBOkYEQCACKAIEIQBBACEDIAJBADYCBCACIAAgARApIgBFDQEgAkHDADYCHCACIAA2AgwgAiABQQFqNgIUDIoBC0EAIQMgAkEANgIcIAIgATYCFCACQbERNgIQIAJBCjYCDAyJAQsgAUEBaiEBQTshAwxvCyACQcMANgIcIAIgADYCDCACIAFBAWo2AhQMhwELQQAhAyACQQA2AhwgAiABNgIUIAJB8A42AhAgAkEcNgIMDIYBCyACIAIvATBBEHI7ATAMZgsCQCACLwEwIgBBCHFFDQAgAi0AKEEBRw0AIAItAC1BCHFFDQMLIAIgAEH3+wNxQYAEcjsBMAwECyABIARHBEACQANAIAEtAABBMGsiAEH/AXFBCk8EQEE1IQMMbgsgAikDICIKQpmz5syZs+bMGVYNASACIApCCn4iCjcDICAKIACtQv8BgyILQn+FVg0BIAIgCiALfDcDICAEIAFBAWoiAUcNAAtBOSEDDIUBCyACKAIEIQBBACEDIAJBADYCBCACIAAgAUEBaiIBECoiAA0MDHcLQTkhAwyDAQsgAi0AMEEgcQ0GQcUBIQMMaQtBACEDIAJBADYCBCACIAEgARAqIgBFDQQgAkE6NgIcIAIgADYCDCACIAFBAWo2AhQMgQELIAItAChBAUcNACACLQAtQQhxRQ0BC0E3IQMMZgsgAigCBCEAQQAhAyACQQA2AgQgAiAAIAEQKiIABEAgAkE7NgIcIAIgADYCDCACIAFBAWo2AhQMfwsgAUEBaiEBDG4LIAJBCDoALAwECyABQQFqIQEMbQtBACEDIAJBADYCHCACIAE2AhQgAkHkEjYCECACQQQ2AgwMewsgAigCBCEAQQAhAyACQQA2AgQgAiAAIAEQKiIARQ1sIAJBNzYCHCACIAE2AhQgAiAANgIMDHoLIAIgAi8BMEEgcjsBMAtBMCEDDF8LIAJBNjYCHCACIAE2AhQgAiAANgIMDHcLIABBLEcNASABQQFqIQBBASEBAkACQAJAAkACQCACLQAsQQVrDgQDAQIEAAsgACEBDAQLQQIhAQwBC0EEIQELIAJBAToALCACIAIvATAgAXI7ATAgACEBDAELIAIgAi8BMEEIcjsBMCAAIQELQTkhAwxcCyACQQA6ACwLQTQhAwxaCyABIARGBEBBLSEDDHMLAkACQANAAkAgAS0AAEEKaw4EAgAAAwALIAQgAUEBaiIBRw0AC0EtIQMMdAsgAigCBCEAQQAhAyACQQA2AgQgAiAAIAEQKiIARQ0CIAJBLDYCHCACIAE2AhQgAiAANgIMDHMLIAIoAgQhAEEAIQMgAkEANgIEIAIgACABECoiAEUEQCABQQFqIQEMAgsgAkEsNgIcIAIgADYCDCACIAFBAWo2AhQMcgsgAS0AAEENRgRAIAIoAgQhAEEAIQMgAkEANgIEIAIgACABECoiAEUEQCABQQFqIQEMAgsgAkEsNgIcIAIgADYCDCACIAFBAWo2AhQMcgsgAi0ALUEBcQRAQcQBIQMMWQsgAigCBCEAQQAhAyACQQA2AgQgAiAAIAEQKiIADQEMZQtBLyEDDFcLIAJBLjYCHCACIAE2AhQgAiAANgIMDG8LQQAhAyACQQA2AhwgAiABNgIUIAJB8BQ2AhAgAkEDNgIMDG4LQQEhAwJAAkACQAJAIAItACxBBWsOBAMBAgAECyACIAIvATBBCHI7ATAMAwtBAiEDDAELQQQhAwsgAkEBOgAsIAIgAi8BMCADcjsBMAtBKiEDDFMLQQAhAyACQQA2AhwgAiABNgIUIAJB4Q82AhAgAkEKNgIMDGsLQQEhAwJAAkACQAJAAkACQCACLQAsQQJrDgcFBAQDAQIABAsgAiACLwEwQQhyOwEwDAMLQQIhAwwBC0EEIQMLIAJBAToALCACIAIvATAgA3I7ATALQSshAwxSC0EAIQMgAkEANgIcIAIgATYCFCACQasSNgIQIAJBCzYCDAxqC0EAIQMgAkEANgIcIAIgATYCFCACQf0NNgIQIAJBHTYCDAxpCyABIARHBEADQCABLQAAQSBHDUggBCABQQFqIgFHDQALQSUhAwxpC0ElIQMMaAsgAi0ALUEBcQRAQcMBIQMMTwsgAigCBCEAQQAhAyACQQA2AgQgAiAAIAEQKSIABEAgAkEmNgIcIAIgADYCDCACIAFBAWo2AhQMaAsgAUEBaiEBDFwLIAFBAWohASACLwEwIgBBgAFxBEBBACEAAkAgAigCOCIDRQ0AIAMoAlQiA0UNACACIAMRAAAhAAsgAEUNBiAAQRVHDR8gAkEFNgIcIAIgATYCFCACQfkXNgIQIAJBFTYCDEEAIQMMZwsCQCAAQaAEcUGgBEcNACACLQAtQQJxDQBBACEDIAJBADYCHCACIAE2AhQgAkGWEzYCECACQQQ2AgwMZwsgAgJ/IAIvATBBFHFBFEYEQEEBIAItAChBAUYNARogAi8BMkHlAEYMAQsgAi0AKUEFRgs6AC5BACEAAkAgAigCOCIDRQ0AIAMoAiQiA0UNACACIAMRAAAhAAsCQAJAAkACQAJAIAAOFgIBAAQEBAQEBAQEBAQEBAQEBAQEBAMECyACQQE6AC4LIAIgAi8BMEHAAHI7ATALQSchAwxPCyACQSM2AhwgAiABNgIUIAJBpRY2AhAgAkEVNgIMQQAhAwxnC0EAIQMgAkEANgIcIAIgATYCFCACQdULNgIQIAJBETYCDAxmC0EAIQACQCACKAI4IgNFDQAgAygCLCIDRQ0AIAIgAxEAACEACyAADQELQQ4hAwxLCyAAQRVGBEAgAkECNgIcIAIgATYCFCACQbAYNgIQIAJBFTYCDEEAIQMMZAtBACEDIAJBADYCHCACIAE2AhQgAkGnDjYCECACQRI2AgwMYwtBACEDIAJBADYCHCACIAE2AhQgAkGqHDYCECACQQ82AgwMYgsgAigCBCEAQQAhAyACQQA2AgQgAiAAIAEgCqdqIgEQKyIARQ0AIAJBBTYCHCACIAE2AhQgAiAANgIMDGELQQ8hAwxHC0EAIQMgAkEANgIcIAIgATYCFCACQc0TNgIQIAJBDDYCDAxfC0IBIQoLIAFBAWohAQJAIAIpAyAiC0L//////////w9YBEAgAiALQgSGIAqENwMgDAELQQAhAyACQQA2AhwgAiABNgIUIAJBrQk2AhAgAkEMNgIMDF4LQSQhAwxEC0EAIQMgAkEANgIcIAIgATYCFCACQc0TNgIQIAJBDDYCDAxcCyACKAIEIQBBACEDIAJBADYCBCACIAAgARAsIgBFBEAgAUEBaiEBDFILIAJBFzYCHCACIAA2AgwgAiABQQFqNgIUDFsLIAIoAgQhAEEAIQMgAkEANgIEAkAgAiAAIAEQLCIARQRAIAFBAWohAQwBCyACQRY2AhwgAiAANgIMIAIgAUEBajYCFAxbC0EfIQMMQQtBACEDIAJBADYCHCACIAE2AhQgAkGaDzYCECACQSI2AgwMWQsgAigCBCEAQQAhAyACQQA2AgQgAiAAIAEQLSIARQRAIAFBAWohAQxQCyACQRQ2AhwgAiAANgIMIAIgAUEBajYCFAxYCyACKAIEIQBBACEDIAJBADYCBAJAIAIgACABEC0iAEUEQCABQQFqIQEMAQsgAkETNgIcIAIgADYCDCACIAFBAWo2AhQMWAtBHiEDDD4LQQAhAyACQQA2AhwgAiABNgIUIAJBxgw2AhAgAkEjNgIMDFYLIAIoAgQhAEEAIQMgAkEANgIEIAIgACABEC0iAEUEQCABQQFqIQEMTgsgAkERNgIcIAIgADYCDCACIAFBAWo2AhQMVQsgAkEQNgIcIAIgATYCFCACIAA2AgwMVAtBACEDIAJBADYCHCACIAE2AhQgAkHGDDYCECACQSM2AgwMUwtBACEDIAJBADYCHCACIAE2AhQgAkHAFTYCECACQQI2AgwMUgsgAigCBCEAQQAhAyACQQA2AgQCQCACIAAgARAtIgBFBEAgAUEBaiEBDAELIAJBDjYCHCACIAA2AgwgAiABQQFqNgIUDFILQRshAww4C0EAIQMgAkEANgIcIAIgATYCFCACQcYMNgIQIAJBIzYCDAxQCyACKAIEIQBBACEDIAJBADYCBAJAIAIgACABECwiAEUEQCABQQFqIQEMAQsgAkENNgIcIAIgADYCDCACIAFBAWo2AhQMUAtBGiEDDDYLQQAhAyACQQA2AhwgAiABNgIUIAJBmg82AhAgAkEiNgIMDE4LIAIoAgQhAEEAIQMgAkEANgIEAkAgAiAAIAEQLCIARQRAIAFBAWohAQwBCyACQQw2AhwgAiAANgIMIAIgAUEBajYCFAxOC0EZIQMMNAtBACEDIAJBADYCHCACIAE2AhQgAkGaDzYCECACQSI2AgwMTAsgAEEVRwRAQQAhAyACQQA2AhwgAiABNgIUIAJBgww2AhAgAkETNgIMDEwLIAJBCjYCHCACIAE2AhQgAkHkFjYCECACQRU2AgxBACEDDEsLIAIoAgQhAEEAIQMgAkEANgIEIAIgACABIAqnaiIBECsiAARAIAJBBzYCHCACIAE2AhQgAiAANgIMDEsLQRMhAwwxCyAAQRVHBEBBACEDIAJBADYCHCACIAE2AhQgAkHaDTYCECACQRQ2AgwMSgsgAkEeNgIcIAIgATYCFCACQfkXNgIQIAJBFTYCDEEAIQMMSQtBACEAAkAgAigCOCIDRQ0AIAMoAiwiA0UNACACIAMRAAAhAAsgAEUNQSAAQRVGBEAgAkEDNgIcIAIgATYCFCACQbAYNgIQIAJBFTYCDEEAIQMMSQtBACEDIAJBADYCHCACIAE2AhQgAkGnDjYCECACQRI2AgwMSAtBACEDIAJBADYCHCACIAE2AhQgAkHaDTYCECACQRQ2AgwMRwtBACEDIAJBADYCHCACIAE2AhQgAkGnDjYCECACQRI2AgwMRgsgAkEAOgAvIAItAC1BBHFFDT8LIAJBADoALyACQQE6ADRBACEDDCsLQQAhAyACQQA2AhwgAkHkETYCECACQQc2AgwgAiABQQFqNgIUDEMLAkADQAJAIAEtAABBCmsOBAACAgACCyAEIAFBAWoiAUcNAAtB3QEhAwxDCwJAAkAgAi0ANEEBRw0AQQAhAAJAIAIoAjgiA0UNACADKAJYIgNFDQAgAiADEQAAIQALIABFDQAgAEEVRw0BIAJB3AE2AhwgAiABNgIUIAJB1RY2AhAgAkEVNgIMQQAhAwxEC0HBASEDDCoLIAJBADYCHCACIAE2AhQgAkHpCzYCECACQR82AgxBACEDDEILAkACQCACLQAoQQFrDgIEAQALQcABIQMMKQtBuQEhAwwoCyACQQI6AC9BACEAAkAgAigCOCIDRQ0AIAMoAgAiA0UNACACIAMRAAAhAAsgAEUEQEHCASEDDCgLIABBFUcEQCACQQA2AhwgAiABNgIUIAJBpAw2AhAgAkEQNgIMQQAhAwxBCyACQdsBNgIcIAIgATYCFCACQfoWNgIQIAJBFTYCDEEAIQMMQAsgASAERgRAQdoBIQMMQAsgAS0AAEHIAEYNASACQQE6ACgLQawBIQMMJQtBvwEhAwwkCyABIARHBEAgAkEQNgIIIAIgATYCBEG+ASEDDCQLQdkBIQMMPAsgASAERgRAQdgBIQMMPAsgAS0AAEHIAEcNBCABQQFqIQFBvQEhAwwiCyABIARGBEBB1wEhAww7CwJAAkAgAS0AAEHFAGsOEAAFBQUFBQUFBQUFBQUFBQEFCyABQQFqIQFBuwEhAwwiCyABQQFqIQFBvAEhAwwhC0HWASEDIAEgBEYNOSACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGD0ABqLQAARw0DIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAw6CyACKAIEIQAgAkIANwMAIAIgACAGQQFqIgEQJyIARQRAQcYBIQMMIQsgAkHVATYCHCACIAE2AhQgAiAANgIMQQAhAww5C0HUASEDIAEgBEYNOCACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEGB0ABqLQAARw0CIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAw5CyACQYEEOwEoIAIoAgQhACACQgA3AwAgAiAAIAZBAWoiARAnIgANAwwCCyACQQA2AgALQQAhAyACQQA2AhwgAiABNgIUIAJB2Bs2AhAgAkEINgIMDDYLQboBIQMMHAsgAkHTATYCHCACIAE2AhQgAiAANgIMQQAhAww0C0EAIQACQCACKAI4IgNFDQAgAygCOCIDRQ0AIAIgAxEAACEACyAARQ0AIABBFUYNASACQQA2AhwgAiABNgIUIAJBzA42AhAgAkEgNgIMQQAhAwwzC0HkACEDDBkLIAJB+AA2AhwgAiABNgIUIAJByhg2AhAgAkEVNgIMQQAhAwwxC0HSASEDIAQgASIARg0wIAQgAWsgAigCACIBaiEFIAAgAWtBBGohBgJAA0AgAC0AACABQfzPAGotAABHDQEgAUEERg0DIAFBAWohASAEIABBAWoiAEcNAAsgAiAFNgIADDELIAJBADYCHCACIAA2AhQgAkGQMzYCECACQQg2AgwgAkEANgIAQQAhAwwwCyABIARHBEAgAkEONgIIIAIgATYCBEG3ASEDDBcLQdEBIQMMLwsgAkEANgIAIAZBAWohAQtBuAEhAwwUCyABIARGBEBB0AEhAwwtCyABLQAAQTBrIgBB/wFxQQpJBEAgAiAAOgAqIAFBAWohAUG2ASEDDBQLIAIoAgQhACACQQA2AgQgAiAAIAEQKCIARQ0UIAJBzwE2AhwgAiABNgIUIAIgADYCDEEAIQMMLAsgASAERgRAQc4BIQMMLAsCQCABLQAAQS5GBEAgAUEBaiEBDAELIAIoAgQhACACQQA2AgQgAiAAIAEQKCIARQ0VIAJBzQE2AhwgAiABNgIUIAIgADYCDEEAIQMMLAtBtQEhAwwSCyAEIAEiBUYEQEHMASEDDCsLQQAhAEEBIQFBASEGQQAhAwJAAkACQAJAAkACfwJAAkACQAJAAkACQAJAIAUtAABBMGsOCgoJAAECAwQFBggLC0ECDAYLQQMMBQtBBAwEC0EFDAMLQQYMAgtBBwwBC0EICyEDQQAhAUEAIQYMAgtBCSEDQQEhAEEAIQFBACEGDAELQQAhAUEBIQMLIAIgAzoAKyAFQQFqIQMCQAJAIAItAC1BEHENAAJAAkACQCACLQAqDgMBAAIECyAGRQ0DDAILIAANAQwCCyABRQ0BCyACKAIEIQAgAkEANgIEIAIgACADECgiAEUEQCADIQEMAwsgAkHJATYCHCACIAM2AhQgAiAANgIMQQAhAwwtCyACKAIEIQAgAkEANgIEIAIgACADECgiAEUEQCADIQEMGAsgAkHKATYCHCACIAM2AhQgAiAANgIMQQAhAwwsCyACKAIEIQAgAkEANgIEIAIgACAFECgiAEUEQCAFIQEMFgsgAkHLATYCHCACIAU2AhQgAiAANgIMDCsLQbQBIQMMEQtBACEAAkAgAigCOCIDRQ0AIAMoAjwiA0UNACACIAMRAAAhAAsCQCAABEAgAEEVRg0BIAJBADYCHCACIAE2AhQgAkGUDTYCECACQSE2AgxBACEDDCsLQbIBIQMMEQsgAkHIATYCHCACIAE2AhQgAkHJFzYCECACQRU2AgxBACEDDCkLIAJBADYCACAGQQFqIQFB9QAhAwwPCyACLQApQQVGBEBB4wAhAwwPC0HiACEDDA4LIAAhASACQQA2AgALIAJBADoALEEJIQMMDAsgAkEANgIAIAdBAWohAUHAACEDDAsLQQELOgAsIAJBADYCACAGQQFqIQELQSkhAwwIC0E4IQMMBwsCQCABIARHBEADQCABLQAAQYA+ai0AACIAQQFHBEAgAEECRw0DIAFBAWohAQwFCyAEIAFBAWoiAUcNAAtBPiEDDCELQT4hAwwgCwsgAkEAOgAsDAELQQshAwwEC0E6IQMMAwsgAUEBaiEBQS0hAwwCCyACIAE6ACwgAkEANgIAIAZBAWohAUEMIQMMAQsgAkEANgIAIAZBAWohAUEKIQMMAAsAC0EAIQMgAkEANgIcIAIgATYCFCACQc0QNgIQIAJBCTYCDAwXC0EAIQMgAkEANgIcIAIgATYCFCACQekKNgIQIAJBCTYCDAwWC0EAIQMgAkEANgIcIAIgATYCFCACQbcQNgIQIAJBCTYCDAwVC0EAIQMgAkEANgIcIAIgATYCFCACQZwRNgIQIAJBCTYCDAwUC0EAIQMgAkEANgIcIAIgATYCFCACQc0QNgIQIAJBCTYCDAwTC0EAIQMgAkEANgIcIAIgATYCFCACQekKNgIQIAJBCTYCDAwSC0EAIQMgAkEANgIcIAIgATYCFCACQbcQNgIQIAJBCTYCDAwRC0EAIQMgAkEANgIcIAIgATYCFCACQZwRNgIQIAJBCTYCDAwQC0EAIQMgAkEANgIcIAIgATYCFCACQZcVNgIQIAJBDzYCDAwPC0EAIQMgAkEANgIcIAIgATYCFCACQZcVNgIQIAJBDzYCDAwOC0EAIQMgAkEANgIcIAIgATYCFCACQcASNgIQIAJBCzYCDAwNC0EAIQMgAkEANgIcIAIgATYCFCACQZUJNgIQIAJBCzYCDAwMC0EAIQMgAkEANgIcIAIgATYCFCACQeEPNgIQIAJBCjYCDAwLC0EAIQMgAkEANgIcIAIgATYCFCACQfsPNgIQIAJBCjYCDAwKC0EAIQMgAkEANgIcIAIgATYCFCACQfEZNgIQIAJBAjYCDAwJC0EAIQMgAkEANgIcIAIgATYCFCACQcQUNgIQIAJBAjYCDAwIC0EAIQMgAkEANgIcIAIgATYCFCACQfIVNgIQIAJBAjYCDAwHCyACQQI2AhwgAiABNgIUIAJBnBo2AhAgAkEWNgIMQQAhAwwGC0EBIQMMBQtB1AAhAyABIARGDQQgCEEIaiEJIAIoAgAhBQJAAkAgASAERwRAIAVB2MIAaiEHIAQgBWogAWshACAFQX9zQQpqIgUgAWohBgNAIAEtAAAgBy0AAEcEQEECIQcMAwsgBUUEQEEAIQcgBiEBDAMLIAVBAWshBSAHQQFqIQcgBCABQQFqIgFHDQALIAAhBSAEIQELIAlBATYCACACIAU2AgAMAQsgAkEANgIAIAkgBzYCAAsgCSABNgIEIAgoAgwhACAIKAIIDgMBBAIACwALIAJBADYCHCACQbUaNgIQIAJBFzYCDCACIABBAWo2AhRBACEDDAILIAJBADYCHCACIAA2AhQgAkHKGjYCECACQQk2AgxBACEDDAELIAEgBEYEQEEiIQMMAQsgAkEJNgIIIAIgATYCBEEhIQMLIAhBEGokACADRQRAIAIoAgwhAAwBCyACIAM2AhxBACEAIAIoAgQiAUUNACACIAEgBCACKAIIEQEAIgFFDQAgAiAENgIUIAIgATYCDCABIQALIAALvgIBAn8gAEEAOgAAIABB3ABqIgFBAWtBADoAACAAQQA6AAIgAEEAOgABIAFBA2tBADoAACABQQJrQQA6AAAgAEEAOgADIAFBBGtBADoAAEEAIABrQQNxIgEgAGoiAEEANgIAQdwAIAFrQXxxIgIgAGoiAUEEa0EANgIAAkAgAkEJSQ0AIABBADYCCCAAQQA2AgQgAUEIa0EANgIAIAFBDGtBADYCACACQRlJDQAgAEEANgIYIABBADYCFCAAQQA2AhAgAEEANgIMIAFBEGtBADYCACABQRRrQQA2AgAgAUEYa0EANgIAIAFBHGtBADYCACACIABBBHFBGHIiAmsiAUEgSQ0AIAAgAmohAANAIABCADcDGCAAQgA3AxAgAEIANwMIIABCADcDACAAQSBqIQAgAUEgayIBQR9LDQALCwtWAQF/AkAgACgCDA0AAkACQAJAAkAgAC0ALw4DAQADAgsgACgCOCIBRQ0AIAEoAiwiAUUNACAAIAERAAAiAQ0DC0EADwsACyAAQcMWNgIQQQ4hAQsgAQsaACAAKAIMRQRAIABB0Rs2AhAgAEEVNgIMCwsUACAAKAIMQRVGBEAgAEEANgIMCwsUACAAKAIMQRZGBEAgAEEANgIMCwsHACAAKAIMCwcAIAAoAhALCQAgACABNgIQCwcAIAAoAhQLFwAgAEEkTwRAAAsgAEECdEGgM2ooAgALFwAgAEEuTwRAAAsgAEECdEGwNGooAgALvwkBAX9B6yghAQJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABB5ABrDvQDY2IAAWFhYWFhYQIDBAVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhBgcICQoLDA0OD2FhYWFhEGFhYWFhYWFhYWFhEWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYRITFBUWFxgZGhthYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2YTc4OTphYWFhYWFhYTthYWE8YWFhYT0+P2FhYWFhYWFhQGFhQWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYUJDREVGR0hJSktMTU5PUFFSU2FhYWFhYWFhVFVWV1hZWlthXF1hYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFeYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhX2BhC0HhJw8LQaQhDwtByywPC0H+MQ8LQcAkDwtBqyQPC0GNKA8LQeImDwtBgDAPC0G5Lw8LQdckDwtB7x8PC0HhHw8LQfofDwtB8iAPC0GoLw8LQa4yDwtBiDAPC0HsJw8LQYIiDwtBjh0PC0HQLg8LQcojDwtBxTIPC0HfHA8LQdIcDwtBxCAPC0HXIA8LQaIfDwtB7S4PC0GrMA8LQdQlDwtBzC4PC0H6Lg8LQfwrDwtB0jAPC0HxHQ8LQbsgDwtB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CABB3AgLii1JbnZhbGlkIGNoYXIgaW4gdXJsIHF1ZXJ5AFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fYm9keQBDb250ZW50LUxlbmd0aCBvdmVyZmxvdwBDaHVuayBzaXplIG92ZXJmbG93AFJlc3BvbnNlIG92ZXJmbG93AEludmFsaWQgbWV0aG9kIGZvciBIVFRQL3gueCByZXF1ZXN0AEludmFsaWQgbWV0aG9kIGZvciBSVFNQL3gueCByZXF1ZXN0AEV4cGVjdGVkIFNPVVJDRSBtZXRob2QgZm9yIElDRS94LnggcmVxdWVzdABJbnZhbGlkIGNoYXIgaW4gdXJsIGZyYWdtZW50IHN0YXJ0AEV4cGVjdGVkIGRvdABTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3N0YXR1cwBJbnZhbGlkIHJlc3BvbnNlIHN0YXR1cwBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zAFVzZXIgY2FsbGJhY2sgZXJyb3IAYG9uX3Jlc2V0YCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfaGVhZGVyYCBjYWxsYmFjayBlcnJvcgBgb25fbWVzc2FnZV9iZWdpbmAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3N0YXR1c19jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3ZlcnNpb25fY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl91cmxfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2hlYWRlcl92YWx1ZV9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX21lc3NhZ2VfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9tZXRob2RfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9oZWFkZXJfZmllbGRfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fbmFtZWAgY2FsbGJhY2sgZXJyb3IAVW5leHBlY3RlZCBjaGFyIGluIHVybCBzZXJ2ZXIASW52YWxpZCBoZWFkZXIgdmFsdWUgY2hhcgBJbnZhbGlkIGhlYWRlciBmaWVsZCBjaGFyAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fdmVyc2lvbgBJbnZhbGlkIG1pbm9yIHZlcnNpb24ASW52YWxpZCBtYWpvciB2ZXJzaW9uAEV4cGVjdGVkIHNwYWNlIGFmdGVyIHZlcnNpb24ARXhwZWN0ZWQgQ1JMRiBhZnRlciB2ZXJzaW9uAEludmFsaWQgSFRUUCB2ZXJzaW9uAEludmFsaWQgaGVhZGVyIHRva2VuAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fdXJsAEludmFsaWQgY2hhcmFjdGVycyBpbiB1cmwAVW5leHBlY3RlZCBzdGFydCBjaGFyIGluIHVybABEb3VibGUgQCBpbiB1cmwARW1wdHkgQ29udGVudC1MZW5ndGgASW52YWxpZCBjaGFyYWN0ZXIgaW4gQ29udGVudC1MZW5ndGgARHVwbGljYXRlIENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhciBpbiB1cmwgcGF0aABDb250ZW50LUxlbmd0aCBjYW4ndCBiZSBwcmVzZW50IHdpdGggVHJhbnNmZXItRW5jb2RpbmcASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgc2l6ZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2hlYWRlcl92YWx1ZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHZhbHVlAE1pc3NpbmcgZXhwZWN0ZWQgTEYgYWZ0ZXIgaGVhZGVyIHZhbHVlAEludmFsaWQgYFRyYW5zZmVyLUVuY29kaW5nYCBoZWFkZXIgdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZSB2YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHF1b3RlZCB2YWx1ZQBQYXVzZWQgYnkgb25faGVhZGVyc19jb21wbGV0ZQBJbnZhbGlkIEVPRiBzdGF0ZQBvbl9yZXNldCBwYXVzZQBvbl9jaHVua19oZWFkZXIgcGF1c2UAb25fbWVzc2FnZV9iZWdpbiBwYXVzZQBvbl9jaHVua19leHRlbnNpb25fdmFsdWUgcGF1c2UAb25fc3RhdHVzX2NvbXBsZXRlIHBhdXNlAG9uX3ZlcnNpb25fY29tcGxldGUgcGF1c2UAb25fdXJsX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2NvbXBsZXRlIHBhdXNlAG9uX2hlYWRlcl92YWx1ZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXNzYWdlX2NvbXBsZXRlIHBhdXNlAG9uX21ldGhvZF9jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfZmllbGRfY29tcGxldGUgcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX25hbWUgcGF1c2UAVW5leHBlY3RlZCBzcGFjZSBhZnRlciBzdGFydCBsaW5lAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fY2h1bmtfZXh0ZW5zaW9uX25hbWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBuYW1lAFBhdXNlIG9uIENPTk5FQ1QvVXBncmFkZQBQYXVzZSBvbiBQUkkvVXBncmFkZQBFeHBlY3RlZCBIVFRQLzIgQ29ubmVjdGlvbiBQcmVmYWNlAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fbWV0aG9kAEV4cGVjdGVkIHNwYWNlIGFmdGVyIG1ldGhvZABTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2hlYWRlcl9maWVsZABQYXVzZWQASW52YWxpZCB3b3JkIGVuY291bnRlcmVkAEludmFsaWQgbWV0aG9kIGVuY291bnRlcmVkAFVuZXhwZWN0ZWQgY2hhciBpbiB1cmwgc2NoZW1hAFJlcXVlc3QgaGFzIGludmFsaWQgYFRyYW5zZmVyLUVuY29kaW5nYABTV0lUQ0hfUFJPWFkAVVNFX1BST1hZAE1LQUNUSVZJVFkAVU5QUk9DRVNTQUJMRV9FTlRJVFkAQ09QWQBNT1ZFRF9QRVJNQU5FTlRMWQBUT09fRUFSTFkATk9USUZZAEZBSUxFRF9ERVBFTkRFTkNZAEJBRF9HQVRFV0FZAFBMQVkAUFVUAENIRUNLT1VUAEdBVEVXQVlfVElNRU9VVABSRVFVRVNUX1RJTUVPVVQATkVUV09SS19DT05ORUNUX1RJTUVPVVQAQ09OTkVDVElPTl9USU1FT1VUAExPR0lOX1RJTUVPVVQATkVUV09SS19SRUFEX1RJTUVPVVQAUE9TVABNSVNESVJFQ1RFRF9SRVFVRVNUAENMSUVOVF9DTE9TRURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX0xPQURfQkFMQU5DRURfUkVRVUVTVABCQURfUkVRVUVTVABIVFRQX1JFUVVFU1RfU0VOVF9UT19IVFRQU19QT1JUAFJFUE9SVABJTV9BX1RFQVBPVABSRVNFVF9DT05URU5UAE5PX0NPTlRFTlQAUEFSVElBTF9DT05URU5UAEhQRV9JTlZBTElEX0NPTlNUQU5UAEhQRV9DQl9SRVNFVABHRVQASFBFX1NUUklDVABDT05GTElDVABURU1QT1JBUllfUkVESVJFQ1QAUEVSTUFORU5UX1JFRElSRUNUAENPTk5FQ1QATVVMVElfU1RBVFVTAEhQRV9JTlZBTElEX1NUQVRVUwBUT09fTUFOWV9SRVFVRVNUUwBFQVJMWV9ISU5UUwBVTkFWQUlMQUJMRV9GT1JfTEVHQUxfUkVBU09OUwBPUFRJT05TAFNXSVRDSElOR19QUk9UT0NPTFMAVkFSSUFOVF9BTFNPX05FR09USUFURVMATVVMVElQTEVfQ0hPSUNFUwBJTlRFUk5BTF9TRVJWRVJfRVJST1IAV0VCX1NFUlZFUl9VTktOT1dOX0VSUk9SAFJBSUxHVU5fRVJST1IASURFTlRJVFlfUFJPVklERVJfQVVUSEVOVElDQVRJT05fRVJST1IAU1NMX0NFUlRJRklDQVRFX0VSUk9SAElOVkFMSURfWF9GT1JXQVJERURfRk9SAFNFVF9QQVJBTUVURVIAR0VUX1BBUkFNRVRFUgBIUEVfVVNFUgBTRUVfT1RIRVIASFBFX0NCX0NIVU5LX0hFQURFUgBNS0NBTEVOREFSAFNFVFVQAFdFQl9TRVJWRVJfSVNfRE9XTgBURUFSRE9XTgBIUEVfQ0xPU0VEX0NPTk5FQ1RJT04ASEVVUklTVElDX0VYUElSQVRJT04ARElTQ09OTkVDVEVEX09QRVJBVElPTgBOT05fQVVUSE9SSVRBVElWRV9JTkZPUk1BVElPTgBIUEVfSU5WQUxJRF9WRVJTSU9OAEhQRV9DQl9NRVNTQUdFX0JFR0lOAFNJVEVfSVNfRlJPWkVOAEhQRV9JTlZBTElEX0hFQURFUl9UT0tFTgBJTlZBTElEX1RPS0VOAEZPUkJJRERFTgBFTkhBTkNFX1lPVVJfQ0FMTQBIUEVfSU5WQUxJRF9VUkwAQkxPQ0tFRF9CWV9QQVJFTlRBTF9DT05UUk9MAE1LQ09MAEFDTABIUEVfSU5URVJOQUwAUkVRVUVTVF9IRUFERVJfRklFTERTX1RPT19MQVJHRV9VTk9GRklDSUFMAEhQRV9PSwBVTkxJTksAVU5MT0NLAFBSSQBSRVRSWV9XSVRIAEhQRV9JTlZBTElEX0NPTlRFTlRfTEVOR1RIAEhQRV9VTkVYUEVDVEVEX0NPTlRFTlRfTEVOR1RIAEZMVVNIAFBST1BQQVRDSABNLVNFQVJDSABVUklfVE9PX0xPTkcAUFJPQ0VTU0lORwBNSVNDRUxMQU5FT1VTX1BFUlNJU1RFTlRfV0FSTklORwBNSVNDRUxMQU5FT1VTX1dBUk5JTkcASFBFX0lOVkFMSURfVFJBTlNGRVJfRU5DT0RJTkcARXhwZWN0ZWQgQ1JMRgBIUEVfSU5WQUxJRF9DSFVOS19TSVpFAE1PVkUAQ09OVElOVUUASFBFX0NCX1NUQVRVU19DT01QTEVURQBIUEVfQ0JfSEVBREVSU19DT01QTEVURQBIUEVfQ0JfVkVSU0lPTl9DT01QTEVURQBIUEVfQ0JfVVJMX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19DT01QTEVURQBIUEVfQ0JfSEVBREVSX1ZBTFVFX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19FWFRFTlNJT05fVkFMVUVfQ09NUExFVEUASFBFX0NCX0NIVU5LX0VYVEVOU0lPTl9OQU1FX0NPTVBMRVRFAEhQRV9DQl9NRVNTQUdFX0NPTVBMRVRFAEhQRV9DQl9NRVRIT0RfQ09NUExFVEUASFBFX0NCX0hFQURFUl9GSUVMRF9DT01QTEVURQBERUxFVEUASFBFX0lOVkFMSURfRU9GX1NUQVRFAElOVkFMSURfU1NMX0NFUlRJRklDQVRFAFBBVVNFAE5PX1JFU1BPTlNFAFVOU1VQUE9SVEVEX01FRElBX1RZUEUAR09ORQBOT1RfQUNDRVBUQUJMRQBTRVJWSUNFX1VOQVZBSUxBQkxFAFJBTkdFX05PVF9TQVRJU0ZJQUJMRQBPUklHSU5fSVNfVU5SRUFDSEFCTEUAUkVTUE9OU0VfSVNfU1RBTEUAUFVSR0UATUVSR0UAUkVRVUVTVF9IRUFERVJfRklFTERTX1RPT19MQVJHRQBSRVFVRVNUX0hFQURFUl9UT09fTEFSR0UAUEFZTE9BRF9UT09fTEFSR0UASU5TVUZGSUNJRU5UX1NUT1JBR0UASFBFX1BBVVNFRF9VUEdSQURFAEhQRV9QQVVTRURfSDJfVVBHUkFERQBTT1VSQ0UAQU5OT1VOQ0UAVFJBQ0UASFBFX1VORVhQRUNURURfU1BBQ0UAREVTQ1JJQkUAVU5TVUJTQ1JJQkUAUkVDT1JEAEhQRV9JTlZBTElEX01FVEhPRABOT1RfRk9VTkQAUFJPUEZJTkQAVU5CSU5EAFJFQklORABVTkFVVEhPUklaRUQATUVUSE9EX05PVF9BTExPV0VEAEhUVFBfVkVSU0lPTl9OT1RfU1VQUE9SVEVEAEFMUkVBRFlfUkVQT1JURUQAQUNDRVBURUQATk9UX0lNUExFTUVOVEVEAExPT1BfREVURUNURUQASFBFX0NSX0VYUEVDVEVEAEhQRV9MRl9FWFBFQ1RFRABDUkVBVEVEAElNX1VTRUQASFBFX1BBVVNFRABUSU1FT1VUX09DQ1VSRUQAUEFZTUVOVF9SRVFVSVJFRABQUkVDT05ESVRJT05fUkVRVUlSRUQAUFJPWFlfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQATkVUV09SS19BVVRIRU5USUNBVElPTl9SRVFVSVJFRABMRU5HVEhfUkVRVUlSRUQAU1NMX0NFUlRJRklDQVRFX1JFUVVJUkVEAFVQR1JBREVfUkVRVUlSRUQAUEFHRV9FWFBJUkVEAFBSRUNPTkRJVElPTl9GQUlMRUQARVhQRUNUQVRJT05fRkFJTEVEAFJFVkFMSURBVElPTl9GQUlMRUQAU1NMX0hBTkRTSEFLRV9GQUlMRUQATE9DS0VEAFRSQU5TRk9STUFUSU9OX0FQUExJRUQATk9UX01PRElGSUVEAE5PVF9FWFRFTkRFRABCQU5EV0lEVEhfTElNSVRfRVhDRUVERUQAU0lURV9JU19PVkVSTE9BREVEAEhFQUQARXhwZWN0ZWQgSFRUUC8AAF4TAAAmEwAAMBAAAPAXAACdEwAAFRIAADkXAADwEgAAChAAAHUSAACtEgAAghMAAE8UAAB/EAAAoBUAACMUAACJEgAAixQAAE0VAADUEQAAzxQAABAYAADJFgAA3BYAAMERAADgFwAAuxQAAHQUAAB8FQAA5RQAAAgXAAAfEAAAZRUAAKMUAAAoFQAAAhUAAJkVAAAsEAAAixkAAE8PAADUDgAAahAAAM4QAAACFwAAiQ4AAG4TAAAcEwAAZhQAAFYXAADBEwAAzRMAAGwTAABoFwAAZhcAAF8XAAAiEwAAzg8AAGkOAADYDgAAYxYAAMsTAACqDgAAKBcAACYXAADFEwAAXRYAAOgRAABnEwAAZRMAAPIWAABzEwAAHRcAAPkWAADzEQAAzw4AAM4VAAAMEgAAsxEAAKURAABhEAAAMhcAALsTAEH5NQsBAQBBkDYL4AEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB/TcLAQEAQZE4C14CAwICAgICAAACAgACAgACAgICAgICAgICAAQAAAAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAEH9OQsBAQBBkToLXgIAAgICAgIAAAICAAICAAICAgICAgICAgIAAwAEAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAAIAQfA7Cw1sb3NlZWVwLWFsaXZlAEGJPAsBAQBBoDwL4AEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBBiT4LAQEAQaA+C+cBAQEBAQEBAQEBAQEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQFjaHVua2VkAEGwwAALXwEBAAEBAQEBAAABAQABAQABAQEBAQEBAQEBAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQABAEGQwgALIWVjdGlvbmVudC1sZW5ndGhvbnJveHktY29ubmVjdGlvbgBBwMIACy1yYW5zZmVyLWVuY29kaW5ncGdyYWRlDQoNCg0KU00NCg0KVFRQL0NFL1RTUC8AQfnCAAsFAQIAAQMAQZDDAAvgAQQBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAEH5xAALBQECAAEDAEGQxQAL4AEEAQEFAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB+cYACwQBAAABAEGRxwAL3wEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAEH6yAALBAEAAAIAQZDJAAtfAwQAAAQEBAQEBAQEBAQEBQQEBAQEBAQEBAQEBAAEAAYHBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQABAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAQAQfrKAAsEAQAAAQBBkMsACwEBAEGqywALQQIAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAEH6zAALBAEAAAEAQZDNAAsBAQBBms0ACwYCAAAAAAIAQbHNAAs6AwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBB8M4AC5YBTk9VTkNFRUNLT1VUTkVDVEVURUNSSUJFTFVTSEVURUFEU0VBUkNIUkdFQ1RJVklUWUxFTkRBUlZFT1RJRllQVElPTlNDSFNFQVlTVEFUQ0hHRU9SRElSRUNUT1JUUkNIUEFSQU1FVEVSVVJDRUJTQ1JJQkVBUkRPV05BQ0VJTkROS0NLVUJTQ1JJQkVIVFRQL0FEVFAv", "base64"), ur;
}
var Er, so;
function hg() {
  if (so) return Er;
  so = 1;
  const { Buffer: e } = at;
  return Er = e.from("AGFzbQEAAAABJwdgAX8Bf2ADf39/AX9gAX8AYAJ/fwBgBH9/f38Bf2AAAGADf39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQAEA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAAy0sBQYAAAIAAAAAAAACAQIAAgICAAADAAAAAAMDAwMBAQEBAQEBAQEAAAIAAAAEBQFwARISBQMBAAIGCAF/AUGA1AQLB9EFIgZtZW1vcnkCAAtfaW5pdGlhbGl6ZQAIGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAtsbGh0dHBfaW5pdAAJGGxsaHR0cF9zaG91bGRfa2VlcF9hbGl2ZQAvDGxsaHR0cF9hbGxvYwALBm1hbGxvYwAxC2xsaHR0cF9mcmVlAAwEZnJlZQAMD2xsaHR0cF9nZXRfdHlwZQANFWxsaHR0cF9nZXRfaHR0cF9tYWpvcgAOFWxsaHR0cF9nZXRfaHR0cF9taW5vcgAPEWxsaHR0cF9nZXRfbWV0aG9kABAWbGxodHRwX2dldF9zdGF0dXNfY29kZQAREmxsaHR0cF9nZXRfdXBncmFkZQASDGxsaHR0cF9yZXNldAATDmxsaHR0cF9leGVjdXRlABQUbGxodHRwX3NldHRpbmdzX2luaXQAFQ1sbGh0dHBfZmluaXNoABYMbGxodHRwX3BhdXNlABcNbGxodHRwX3Jlc3VtZQAYG2xsaHR0cF9yZXN1bWVfYWZ0ZXJfdXBncmFkZQAZEGxsaHR0cF9nZXRfZXJybm8AGhdsbGh0dHBfZ2V0X2Vycm9yX3JlYXNvbgAbF2xsaHR0cF9zZXRfZXJyb3JfcmVhc29uABwUbGxodHRwX2dldF9lcnJvcl9wb3MAHRFsbGh0dHBfZXJybm9fbmFtZQAeEmxsaHR0cF9tZXRob2RfbmFtZQAfEmxsaHR0cF9zdGF0dXNfbmFtZQAgGmxsaHR0cF9zZXRfbGVu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PgtBhwEMPQtBiAEMPAtBiQEMOwtBigEMOgtBiwEMOQtBjAEMOAtBjQEMNwtBjgEMNgtBjwEMNQtBkAEMNAtBkQEMMwtBkgEMMgtBkwEMMQtBlAEMMAtBlQEMLwtBlgEMLgtBlwEMLQtBmAEMLAtBmQEMKwtBmgEMKgtBmwEMKQtBnAEMKAtBnQEMJwtBngEMJgtBnwEMJQtBoAEMJAtBoQEMIwtBogEMIgtBowEMIQtBpAEMIAtBpQEMHwtBpgEMHgtBpwEMHQtBqAEMHAtBqQEMGwtBqgEMGgtBqwEMGQtBrAEMGAtBrQEMFwtBrgEMFgtBAQwVC0GvAQwUC0GwAQwTC0GxAQwSC0GzAQwRC0GyAQwQC0G0AQwPC0G1AQwOC0G2AQwNC0G3AQwMC0G4AQwLC0G5AQwKC0G6AQwJC0G7AQwIC0HGAQwHC0G8AQwGC0G9AQwFC0G+AQwEC0G/AQwDC0HAAQwCC0HCAQwBC0HBAQshAwNAAkACQAJAAkACQAJAAkACQAJAIAICfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAgJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACfwJAAkACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAC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iQEhAwykAgtBASABLQAAQd8ARw1nGiABQQFqIQEMXgtBigEhAyABIARGDaICIAIoAgAiACAEIAFraiEFIAEgAGtBAWohBgNAIAEtAAAgAEGMzwBqLQAARw1kIABBAUYN+gEgAEEBaiEAIAQgAUEBaiIBRw0ACyACIAU2AgAMogILQYsBIQMgASAERg2hAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGOzwBqLQAARw1kIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyiAgsgAkEANgIAIAZBAWohAUECDGULQYwBIQMgASAERg2gAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHwzwBqLQAARw1jIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyhAgsgAkEANgIAIAZBAWohAUEfDGQLQY0BIQMgASAERg2fAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHyzwBqLQAARw1iIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAygAgsgAkEANgIAIAZBAWohAUEJDGMLIAEgBEYEQEGOASEDDJ8CCwJAAkAgAS0AAEHJAGsOBwBiYmJiYgFiCyABQQFqIQFB+AAhAwyGAgsgAUEBaiEBQfkAIQMMhQILQY8BIQMgASAERg2dAiACKAIAIgAgBCABa2ohBSABIABrQQVqIQYCQANAIAEtAAAgAEGRzwBqLQAARw1gIABBBUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyeAgsgAkEANgIAIAZBAWohAUEYDGELQZABIQMgASAERg2cAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGXzwBqLQAARw1fIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAydAgsgAkEANgIAIAZBAWohAUEXDGALQZEBIQMgASAERg2bAiACKAIAIgAgBCABa2ohBSABIABrQQZqIQYCQANAIAEtAAAgAEGazwBqLQAARw1eIABBBkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAycAgsgAkEANgIAIAZBAWohAUEV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JSIARQ0RIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMtAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0gIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMswELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0iIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMsgELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0OIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMsQELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0dIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMsAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0fIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMrwELIABBP0cNASABQQFqCyEBQQUhAwyUAQtBACEDIAJBADYCHCACIAE2AhQgAkH9EjYCECACQQc2AgwMrAELIAJBADYCHCACIAE2AhQgAkHcCDYCECACQQc2AgxBACEDDKsBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNByACQeUANgIcIAIgATYCFCACIAA2AgxBACEDDKoBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNFiACQdMANgIcIAIgATYCFCACIAA2AgxBACEDDKkBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNGCACQdIANgIcIAIgATYCFCACIAA2AgxBACEDDKgBCyACQQA2AhwgAiABNgIUIAJBxgo2AhAgAkEHNgIMQQAhAwynAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQMgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwymAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRIgAkHTADYCHCACIAE2AhQgAiAANgIMQQAhAwylAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRQgAkHSADYCHCACIAE2AhQgAiAANgIMQQAhAwykAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQAgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwyjAQtB1QAhAwyJAQsgAEEVRwRAIAJBADYCHCACIAE2AhQgAkG5DTYCECACQRo2AgxB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AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABB5ABrDvQDY2IAAWFhYWFhYQIDBAVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhBgcICQoLDA0OD2FhYWFhEGFhYWFhYWFhYWFhEWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYRITFBUWFxgZGhthYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2YTc4OTphYWFhYWFhYTthYWE8YWFhYT0+P2FhYWFhYWFhQGFhQWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYUJDREVGR0hJSktMTU5PUFFSU2FhYWFhYWFhVFVWV1hZWlthXF1hYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFeYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhX2BhC0HhJw8LQaQhDwtByywPC0H+MQ8LQcAkDwtBqyQPC0GNKA8LQeImDwtBgDAPC0G5Lw8LQdckDwtB7x8PC0HhHw8LQfofDwtB8iAPC0GoLw8LQa4yDwtBiDAPC0HsJw8LQYIiDwtBjh0PC0HQLg8LQcojDwtBxTIPC0HfHA8LQdIcDwtBxCAPC0HXIA8LQaIfDwtB7S4PC0GrMA8LQdQlDwtBzC4PC0H6Lg8LQfwrDwtB0jAPC0HxHQ8LQbsgDwtB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AAADAEGUCAsFBAAAAAUAQaQICwkGAAAABwAAAAgAQdwIC4otSW52YWxpZCBjaGFyIGluIHVybCBxdWVyeQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2JvZHkAQ29udGVudC1MZW5ndGggb3ZlcmZsb3cAQ2h1bmsgc2l6ZSBvdmVyZmxvdwBSZXNwb25zZSBvdmVyZmxvdwBJbnZhbGlkIG1ldGhvZCBmb3IgSFRUUC94LnggcmVxdWVzdABJbnZhbGlkIG1ldGhvZCBmb3IgUlRTUC94LnggcmVxdWVzdABFeHBlY3RlZCBTT1VSQ0UgbWV0aG9kIGZvciBJQ0UveC54IHJlcXVlc3QASW52YWxpZCBjaGFyIGluIHVybCBmcmFnbWVudCBzdGFydABFeHBlY3RlZCBkb3QAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9zdGF0dXMASW52YWxpZCByZXNwb25zZSBzdGF0dXMASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucwBVc2VyIGNhbGxiYWNrIGVycm9yAGBvbl9yZXNldGAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2hlYWRlcmAgY2FsbGJhY2sgZXJyb3IAYG9uX21lc3NhZ2VfYmVnaW5gIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fdmFsdWVgIGNhbGxiYWNrIGVycm9yAGBvbl9zdGF0dXNfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl92ZXJzaW9uX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fdXJsX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9tZXNzYWdlX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fbWV0aG9kX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfZXh0ZW5zaW9uX25hbWVgIGNhbGxiYWNrIGVycm9yAFVuZXhwZWN0ZWQgY2hhciBpbiB1cmwgc2VydmVyAEludmFsaWQgaGVhZGVyIHZhbHVlIGNoYXIASW52YWxpZCBoZWFkZXIgZmllbGQgY2hhcgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3ZlcnNpb24ASW52YWxpZCBtaW5vciB2ZXJzaW9uAEludmFsaWQgbWFqb3IgdmVyc2lvbgBFeHBlY3RlZCBzcGFjZSBhZnRlciB2ZXJzaW9uAEV4cGVjdGVkIENSTEYgYWZ0ZXIgdmVyc2lvbgBJbnZhbGlkIEhUVFAgdmVyc2lvbgBJbnZhbGlkIGhlYWRlciB0b2tlbgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3VybABJbnZhbGlkIGNoYXJhY3RlcnMgaW4gdXJsAFVuZXhwZWN0ZWQgc3RhcnQgY2hhciBpbiB1cmwARG91YmxlIEAgaW4gdXJsAEVtcHR5IENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhcmFjdGVyIGluIENvbnRlbnQtTGVuZ3RoAER1cGxpY2F0ZSBDb250ZW50LUxlbmd0aABJbnZhbGlkIGNoYXIgaW4gdXJsIHBhdGgAQ29udGVudC1MZW5ndGggY2FuJ3QgYmUgcHJlc2VudCB3aXRoIFRyYW5zZmVyLUVuY29kaW5nAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIHNpemUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfdmFsdWUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9jaHVua19leHRlbnNpb25fdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyB2YWx1ZQBNaXNzaW5nIGV4cGVjdGVkIExGIGFmdGVyIGhlYWRlciB2YWx1ZQBJbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AgaGVhZGVyIHZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgcXVvdGUgdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZWQgdmFsdWUAUGF1c2VkIGJ5IG9uX2hlYWRlcnNfY29tcGxldGUASW52YWxpZCBFT0Ygc3RhdGUAb25fcmVzZXQgcGF1c2UAb25fY2h1bmtfaGVhZGVyIHBhdXNlAG9uX21lc3NhZ2VfYmVnaW4gcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlIHBhdXNlAG9uX3N0YXR1c19jb21wbGV0ZSBwYXVzZQBvbl92ZXJzaW9uX2NvbXBsZXRlIHBhdXNlAG9uX3VybF9jb21wbGV0ZSBwYXVzZQBvbl9jaHVua19jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGUgcGF1c2UAb25fbWVzc2FnZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXRob2RfY29tcGxldGUgcGF1c2UAb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lIHBhdXNlAFVuZXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgc3RhcnQgbGluZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgbmFtZQBQYXVzZSBvbiBDT05ORUNUL1VwZ3JhZGUAUGF1c2Ugb24gUFJJL1VwZ3JhZGUARXhwZWN0ZWQgSFRUUC8yIENvbm5lY3Rpb24gUHJlZmFjZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX21ldGhvZABFeHBlY3RlZCBzcGFjZSBhZnRlciBtZXRob2QAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfZmllbGQAUGF1c2VkAEludmFsaWQgd29yZCBlbmNvdW50ZXJlZABJbnZhbGlkIG1ldGhvZCBlbmNvdW50ZXJlZABVbmV4cGVjdGVkIGNoYXIgaW4gdXJsIHNjaGVtYQBSZXF1ZXN0IGhhcyBpbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AAU1dJVENIX1BST1hZAFVTRV9QUk9YWQBNS0FDVElWSVRZAFVOUFJPQ0VTU0FCTEVfRU5USVRZAENPUFkATU9WRURfUEVSTUFORU5UTFkAVE9PX0VBUkxZAE5PVElGWQBGQUlMRURfREVQRU5ERU5DWQBCQURfR0FURVdBWQBQTEFZAFBVVABDSEVDS09VVABHQVRFV0FZX1RJTUVPVVQAUkVRVUVTVF9USU1FT1VUAE5FVFdPUktfQ09OTkVDVF9USU1FT1VUAENPTk5FQ1RJT05fVElNRU9VVABMT0dJTl9USU1FT1VUAE5FVFdPUktfUkVBRF9USU1FT1VUAFBPU1QATUlTRElSRUNURURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX1JFUVVFU1QAQ0xJRU5UX0NMT1NFRF9MT0FEX0JBTEFOQ0VEX1JFUVVFU1QAQkFEX1JFUVVFU1QASFRUUF9SRVFVRVNUX1NFTlRfVE9fSFRUUFNfUE9SVABSRVBPUlQASU1fQV9URUFQT1QAUkVTRVRfQ09OVEVOVABOT19DT05URU5UAFBBUlRJQUxfQ09OVEVOVABIUEVfSU5WQUxJRF9DT05TVEFOVABIUEVfQ0JfUkVTRVQAR0VUAEhQRV9TVFJJQ1QAQ09ORkxJQ1QAVEVNUE9SQVJZX1JFRElSRUNUAFBFUk1BTkVOVF9SRURJUkVDVABDT05ORUNUAE1VTFRJX1NUQVRVUwBIUEVfSU5WQUxJRF9TVEFUVVMAVE9PX01BTllfUkVRVUVTVFMARUFSTFlfSElOVFMAVU5BVkFJTEFCTEVfRk9SX0xFR0FMX1JFQVNPTlMAT1BUSU9OUwBTV0lUQ0hJTkdfUFJPVE9DT0xTAFZBUklBTlRfQUxTT19ORUdPVElBVEVTAE1VTFRJUExFX0NIT0lDRVMASU5URVJOQUxfU0VSVkVSX0VSUk9SAFdFQl9TRVJWRVJfVU5LTk9XTl9FUlJPUgBSQUlMR1VOX0VSUk9SAElERU5USVRZX1BST1ZJREVSX0FVVEhFTlRJQ0FUSU9OX0VSUk9SAFNTTF9DRVJUSUZJQ0FURV9FUlJPUgBJTlZBTElEX1hfRk9SV0FSREVEX0ZPUgBTRVRfUEFSQU1FVEVSAEdFVF9QQVJBTUVURVIASFBFX1VTRVIAU0VFX09USEVSAEhQRV9DQl9DSFVOS19IRUFERVIATUtDQUxFTkRBUgBTRVRVUABXRUJfU0VSVkVSX0lTX0RPV04AVEVBUkRPV04ASFBFX0NMT1NFRF9DT05ORUNUSU9OAEhFVVJJU1RJQ19FWFBJUkFUSU9OAERJU0NPTk5FQ1RFRF9PUEVSQVRJT04ATk9OX0FVVEhPUklUQVRJVkVfSU5GT1JNQVRJT04ASFBFX0lOVkFMSURfVkVSU0lPTgBIUEVfQ0JfTUVTU0FHRV9CRUdJTgBTSVRFX0lTX0ZST1pFTgBIUEVfSU5WQUxJRF9IRUFERVJfVE9LRU4ASU5WQUxJRF9UT0tFTgBGT1JCSURERU4ARU5IQU5DRV9ZT1VSX0NBTE0ASFBFX0lOVkFMSURfVVJMAEJMT0NLRURfQllfUEFSRU5UQUxfQ09OVFJPTABNS0NPTABBQ0wASFBFX0lOVEVSTkFMAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0VfVU5PRkZJQ0lBTABIUEVfT0sAVU5MSU5LAFVOTE9DSwBQUkkAUkVUUllfV0lUSABIUEVfSU5WQUxJRF9DT05URU5UX0xFTkdUSABIUEVfVU5FWFBFQ1RFRF9DT05URU5UX0xFTkdUSABGTFVTSABQUk9QUEFUQ0gATS1TRUFSQ0gAVVJJX1RPT19MT05HAFBST0NFU1NJTkcATUlTQ0VMTEFORU9VU19QRVJTSVNURU5UX1dBUk5JTkcATUlTQ0VMTEFORU9VU19XQVJOSU5HAEhQRV9JTlZBTElEX1RSQU5TRkVSX0VOQ09ESU5HAEV4cGVjdGVkIENSTEYASFBFX0lOVkFMSURfQ0hVTktfU0laRQBNT1ZFAENPTlRJTlVFAEhQRV9DQl9TVEFUVVNfQ09NUExFVEUASFBFX0NCX0hFQURFUlNfQ09NUExFVEUASFBFX0NCX1ZFUlNJT05fQ09NUExFVEUASFBFX0NCX1VSTF9DT01QTEVURQBIUEVfQ0JfQ0hVTktfQ09NUExFVEUASFBFX0NCX0hFQURFUl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX1ZBTFVFX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19FWFRFTlNJT05fTkFNRV9DT01QTEVURQBIUEVfQ0JfTUVTU0FHRV9DT01QTEVURQBIUEVfQ0JfTUVUSE9EX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfRklFTERfQ09NUExFVEUAREVMRVRFAEhQRV9JTlZBTElEX0VPRl9TVEFURQBJTlZBTElEX1NTTF9DRVJUSUZJQ0FURQBQQVVTRQBOT19SRVNQT05TRQBVTlNVUFBPUlRFRF9NRURJQV9UWVBFAEdPTkUATk9UX0FDQ0VQVEFCTEUAU0VSVklDRV9VTkFWQUlMQUJMRQBSQU5HRV9OT1RfU0FUSVNGSUFCTEUAT1JJR0lOX0lTX1VOUkVBQ0hBQkxFAFJFU1BPTlNFX0lTX1NUQUxFAFBVUkdFAE1FUkdFAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0UAUkVRVUVTVF9IRUFERVJfVE9PX0xBUkdFAFBBWUxPQURfVE9PX0xBUkdFAElOU1VGRklDSUVOVF9TVE9SQUdFAEhQRV9QQVVTRURfVVBHUkFERQBIUEVfUEFVU0VEX0gyX1VQR1JBREUAU09VUkNFAEFOTk9VTkNFAFRSQUNFAEhQRV9VTkVYUEVDVEVEX1NQQUNFAERFU0NSSUJFAFVOU1VCU0NSSUJFAFJFQ09SRABIUEVfSU5WQUxJRF9NRVRIT0QATk9UX0ZPVU5EAFBST1BGSU5EAFVOQklORABSRUJJTkQAVU5BVVRIT1JJWkVEAE1FVEhPRF9OT1RfQUxMT1dFRABIVFRQX1ZFUlNJT05fTk9UX1NVUFBPUlRFRABBTFJFQURZX1JFUE9SVEVEAEFDQ0VQVEVEAE5PVF9JTVBMRU1FTlRFRABMT09QX0RFVEVDVEVEAEhQRV9DUl9FWFBFQ1RFRABIUEVfTEZfRVhQRUNURUQAQ1JFQVRFRABJTV9VU0VEAEhQRV9QQVVTRUQAVElNRU9VVF9PQ0NVUkVEAFBBWU1FTlRfUkVRVUlSRUQAUFJFQ09ORElUSU9OX1JFUVVJUkVEAFBST1hZX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAE5FVFdPUktfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQATEVOR1RIX1JFUVVJUkVEAFNTTF9DRVJUSUZJQ0FURV9SRVFVSVJFRABVUEdSQURFX1JFUVVJUkVEAFBBR0VfRVhQSVJFRABQUkVDT05ESVRJT05fRkFJTEVEAEVYUEVDVEFUSU9OX0ZBSUxFRABSRVZBTElEQVRJT05fRkFJTEVEAFNTTF9IQU5EU0hBS0VfRkFJTEVEAExPQ0tFRABUUkFOU0ZPUk1BVElPTl9BUFBMSUVEAE5PVF9NT0RJRklFRABOT1RfRVhURU5ERUQAQkFORFdJRFRIX0xJTUlUX0VYQ0VFREVEAFNJVEVfSVNfT1ZFUkxPQURFRABIRUFEAEV4cGVjdGVkIEhUVFAvAABeEwAAJhMAADAQAADwFwAAnRMAABUSAAA5FwAA8BIAAAoQAAB1EgAArRIAAIITAABPFAAAfxAAAKAVAAAjFAAAiRIAAIsUAABNFQAA1BEAAM8UAAAQGAAAyRYAANwWAADBEQAA4BcAALsUAAB0FAAAfBUAAOUUAAAIFwAAHxAAAGUVAACjFAAAKBUAAAIVAACZFQAALBAAAIsZAABPDwAA1A4AAGoQAADOEAAAAhcAAIkOAABuEwAAHBMAAGYUAABWFwAAwRMAAM0TAABsEwAAaBcAAGYXAABfFwAAIhMAAM4PAABpDgAA2A4AAGMWAADLEwAAqg4AACgXAAAmFwAAxRMAAF0WAADoEQAAZxMAAGUTAADyFgAAcxMAAB0XAAD5FgAA8xEAAM8OAADOFQAADBIAALMRAAClEQAAYRAAADIXAAC7EwBB+TULAQEAQZA2C+ABAQECAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAQf03CwEBAEGROAteAgMCAgICAgAAAgIAAgIAAgICAgICAgICAgAEAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAAIAAgBB/TkLAQEAQZE6C14CAAICAgICAAACAgACAgACAgICAgICAgICAAMABAAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAEHwOwsNbG9zZWVlcC1hbGl2ZQBBiTwLAQEAQaA8C+ABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAQYk+CwEBAEGgPgvnAQEBAQEBAQEBAQEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBY2h1bmtlZABBsMAAC18BAQABAQEBAQAAAQEAAQEAAQEBAQEBAQEBAQAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQBBkMIACyFlY3Rpb25lbnQtbGVuZ3Rob25yb3h5LWNvbm5lY3Rpb24AQcDCAAstcmFuc2Zlci1lbmNvZGluZ3BncmFkZQ0KDQoNClNNDQoNClRUUC9DRS9UU1AvAEH5wgALBQECAAEDAEGQwwAL4AEEAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB+cQACwUBAgABAwBBkMUAC+ABBAEBBQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAQfnGAAsEAQAAAQBBkccAC98BAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB+sgACwQBAAACAEGQyQALXwMEAAAEBAQEBAQEBAQEBAUEBAQEBAQEBAQEBAQABAAGBwQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEAEH6ygALBAEAAAEAQZDLAAsBAQBBqssAC0ECAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBB+swACwQBAAABAEGQzQALAQEAQZrNAAsGAgAAAAACAEGxzQALOgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAQfDOAAuWAU5PVU5DRUVDS09VVE5FQ1RFVEVDUklCRUxVU0hFVEVBRFNFQVJDSFJHRUNUSVZJVFlMRU5EQVJWRU9USUZZUFRJT05TQ0hTRUFZU1RBVENIR0VPUkRJUkVDVE9SVFJDSFBBUkFNRVRFUlVSQ0VCU0NSSUJFQVJET1dOQUNFSU5ETktDS1VCU0NSSUJFSFRUUC9BRFRQLw==", "base64"), Er;
}
var Qr, no;
function yA() {
  if (no) return Qr;
  no = 1;
  const e = (
    /** @type {const} */
    ["GET", "HEAD", "POST"]
  ), t = new Set(e), A = (
    /** @type {const} */
    [101, 204, 205, 304]
  ), s = (
    /** @type {const} */
    [301, 302, 303, 307, 308]
  ), r = new Set(s), n = (
    /** @type {const} */
    [
      "1",
      "7",
      "9",
      "11",
      "13",
      "15",
      "17",
      "19",
      "20",
      "21",
      "22",
      "23",
      "25",
      "37",
      "42",
      "43",
      "53",
      "69",
      "77",
      "79",
      "87",
      "95",
      "101",
      "102",
      "103",
      "104",
      "109",
      "110",
      "111",
      "113",
      "115",
      "117",
      "119",
      "123",
      "135",
      "137",
      "139",
      "143",
      "161",
      "179",
      "389",
      "427",
      "465",
      "512",
      "513",
      "514",
      "515",
      "526",
      "530",
      "531",
      "532",
      "540",
      "548",
      "554",
      "556",
      "563",
      "587",
      "601",
      "636",
      "989",
      "990",
      "993",
      "995",
      "1719",
      "1720",
      "1723",
      "2049",
      "3659",
      "4045",
      "4190",
      "5060",
      "5061",
      "6000",
      "6566",
      "6665",
      "6666",
      "6667",
      "6668",
      "6669",
      "6679",
      "6697",
      "10080"
    ]
  ), o = new Set(n), a = (
    /** @type {const} */
    [
      "",
      "no-referrer",
      "no-referrer-when-downgrade",
      "same-origin",
      "origin",
      "strict-origin",
      "origin-when-cross-origin",
      "strict-origin-when-cross-origin",
      "unsafe-url"
    ]
  ), u = new Set(a), l = (
    /** @type {const} */
    ["follow", "manual", "error"]
  ), i = (
    /** @type {const} */
    ["GET", "HEAD", "OPTIONS", "TRACE"]
  ), c = new Set(i), Q = (
    /** @type {const} */
    ["navigate", "same-origin", "no-cors", "cors"]
  ), h = (
    /** @type {const} */
    ["omit", "same-origin", "include"]
  ), B = (
    /** @type {const} */
    [
      "default",
      "no-store",
      "reload",
      "no-cache",
      "force-cache",
      "only-if-cached"
    ]
  ), d = (
    /** @type {const} */
    [
      "content-encoding",
      "content-language",
      "content-location",
      "content-type",
      // See https://github.com/nodejs/undici/issues/2021
      // 'Content-Length' is a forbidden header name, which is typically
      // removed in the Headers implementation. However, undici doesn't
      // filter out headers, so we add it here.
      "content-length"
    ]
  ), y = (
    /** @type {const} */
    [
      "half"
    ]
  ), b = (
    /** @type {const} */
    ["CONNECT", "TRACE", "TRACK"]
  ), F = new Set(b), M = (
    /** @type {const} */
    [
      "audio",
      "audioworklet",
      "font",
      "image",
      "manifest",
      "paintworklet",
      "script",
      "style",
      "track",
      "video",
      "xslt",
      ""
    ]
  ), L = new Set(M);
  return Qr = {
    subresource: M,
    forbiddenMethods: b,
    requestBodyHeader: d,
    referrerPolicy: a,
    requestRedirect: l,
    requestMode: Q,
    requestCredentials: h,
    requestCache: B,
    redirectStatus: s,
    corsSafeListedMethods: e,
    nullBodyStatus: A,
    safeMethods: i,
    badPorts: n,
    requestDuplex: y,
    subresourceSet: L,
    badPortsSet: o,
    redirectStatusSet: r,
    corsSafeListedMethodsSet: t,
    safeMethodsSet: c,
    forbiddenMethodsSet: F,
    referrerPolicySet: u
  }, Qr;
}
var hr, oo;
function io() {
  if (oo) return hr;
  oo = 1;
  const e = /* @__PURE__ */ Symbol.for("undici.globalOrigin.1");
  function t() {
    return globalThis[e];
  }
  function A(s) {
    if (s === void 0) {
      Object.defineProperty(globalThis, e, {
        value: void 0,
        writable: !0,
        enumerable: !1,
        configurable: !1
      });
      return;
    }
    const r = new URL(s);
    if (r.protocol !== "http:" && r.protocol !== "https:")
      throw new TypeError(`Only http & https urls are allowed, received ${r.protocol}`);
    Object.defineProperty(globalThis, e, {
      value: r,
      writable: !0,
      enumerable: !1,
      configurable: !1
    });
  }
  return hr = {
    getGlobalOrigin: t,
    setGlobalOrigin: A
  }, hr;
}
var Br, ao;
function st() {
  if (ao) return Br;
  ao = 1;
  const e = He, t = new TextEncoder(), A = /^[!#$%&'*+\-.^_|~A-Za-z0-9]+$/, s = /[\u000A\u000D\u0009\u0020]/, r = /[\u0009\u000A\u000C\u000D\u0020]/g, n = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
  function o(g) {
    e(g.protocol === "data:");
    let C = a(g, !0);
    C = C.slice(5);
    const w = { position: 0 };
    let I = l(
      ",",
      C,
      w
    );
    const m = I.length;
    if (I = N(I, !0, !0), w.position >= C.length)
      return "failure";
    w.position++;
    const D = C.slice(m + 1);
    let U = i(D);
    if (/;(\u0020){0,}base64$/i.test(I)) {
      const G = E(U);
      if (U = d(G), U === "failure")
        return "failure";
      I = I.slice(0, -6), I = I.replace(/(\u0020)+$/, ""), I = I.slice(0, -1);
    }
    I.startsWith(";") && (I = "text/plain" + I);
    let S = B(I);
    return S === "failure" && (S = B("text/plain;charset=US-ASCII")), { mimeType: S, body: U };
  }
  function a(g, C = !1) {
    if (!C)
      return g.href;
    const w = g.href, I = g.hash.length, m = I === 0 ? w : w.substring(0, w.length - I);
    return !I && w.endsWith("#") ? m.slice(0, -1) : m;
  }
  function u(g, C, w) {
    let I = "";
    for (; w.position < C.length && g(C[w.position]); )
      I += C[w.position], w.position++;
    return I;
  }
  function l(g, C, w) {
    const I = C.indexOf(g, w.position), m = w.position;
    return I === -1 ? (w.position = C.length, C.slice(m)) : (w.position = I, C.slice(m, w.position));
  }
  function i(g) {
    const C = t.encode(g);
    return h(C);
  }
  function c(g) {
    return g >= 48 && g <= 57 || g >= 65 && g <= 70 || g >= 97 && g <= 102;
  }
  function Q(g) {
    return (
      // 0-9
      g >= 48 && g <= 57 ? g - 48 : (g & 223) - 55
    );
  }
  function h(g) {
    const C = g.length, w = new Uint8Array(C);
    let I = 0;
    for (let m = 0; m < C; ++m) {
      const D = g[m];
      D !== 37 ? w[I++] = D : D === 37 && !(c(g[m + 1]) && c(g[m + 2])) ? w[I++] = 37 : (w[I++] = Q(g[m + 1]) << 4 | Q(g[m + 2]), m += 2);
    }
    return C === I ? w : w.subarray(0, I);
  }
  function B(g) {
    g = M(g, !0, !0);
    const C = { position: 0 }, w = l(
      "/",
      g,
      C
    );
    if (w.length === 0 || !A.test(w) || C.position > g.length)
      return "failure";
    C.position++;
    let I = l(
      ";",
      g,
      C
    );
    if (I = M(I, !1, !0), I.length === 0 || !A.test(I))
      return "failure";
    const m = w.toLowerCase(), D = I.toLowerCase(), U = {
      type: m,
      subtype: D,
      /** @type {Map<string, string>} */
      parameters: /* @__PURE__ */ new Map(),
      // https://mimesniff.spec.whatwg.org/#mime-type-essence
      essence: `${m}/${D}`
    };
    for (; C.position < g.length; ) {
      C.position++, u(
        // https://fetch.spec.whatwg.org/#http-whitespace
        (v) => s.test(v),
        g,
        C
      );
      let S = u(
        (v) => v !== ";" && v !== "=",
        g,
        C
      );
      if (S = S.toLowerCase(), C.position < g.length) {
        if (g[C.position] === ";")
          continue;
        C.position++;
      }
      if (C.position > g.length)
        break;
      let G = null;
      if (g[C.position] === '"')
        G = y(g, C, !0), l(
          ";",
          g,
          C
        );
      else if (G = l(
        ";",
        g,
        C
      ), G = M(G, !1, !0), G.length === 0)
        continue;
      S.length !== 0 && A.test(S) && (G.length === 0 || n.test(G)) && !U.parameters.has(S) && U.parameters.set(S, G);
    }
    return U;
  }
  function d(g) {
    g = g.replace(r, "");
    let C = g.length;
    if (C % 4 === 0 && g.charCodeAt(C - 1) === 61 && (--C, g.charCodeAt(C - 1) === 61 && --C), C % 4 === 1 || /[^+/0-9A-Za-z]/.test(g.length === C ? g : g.substring(0, C)))
      return "failure";
    const w = Buffer.from(g, "base64");
    return new Uint8Array(w.buffer, w.byteOffset, w.byteLength);
  }
  function y(g, C, w) {
    const I = C.position;
    let m = "";
    for (e(g[C.position] === '"'), C.position++; m += u(
      (U) => U !== '"' && U !== "\\",
      g,
      C
    ), !(C.position >= g.length); ) {
      const D = g[C.position];
      if (C.position++, D === "\\") {
        if (C.position >= g.length) {
          m += "\\";
          break;
        }
        m += g[C.position], C.position++;
      } else {
        e(D === '"');
        break;
      }
    }
    return w ? m : g.slice(I, C.position);
  }
  function b(g) {
    e(g !== "failure");
    const { parameters: C, essence: w } = g;
    let I = w;
    for (let [m, D] of C.entries())
      I += ";", I += m, I += "=", A.test(D) || (D = D.replace(/(\\|")/g, "\\$1"), D = '"' + D, D += '"'), I += D;
    return I;
  }
  function F(g) {
    return g === 13 || g === 10 || g === 9 || g === 32;
  }
  function M(g, C = !0, w = !0) {
    return f(g, C, w, F);
  }
  function L(g) {
    return g === 13 || g === 10 || g === 9 || g === 12 || g === 32;
  }
  function N(g, C = !0, w = !0) {
    return f(g, C, w, L);
  }
  function f(g, C, w, I) {
    let m = 0, D = g.length - 1;
    if (C)
      for (; m < g.length && I(g.charCodeAt(m)); ) m++;
    if (w)
      for (; D > 0 && I(g.charCodeAt(D)); ) D--;
    return m === 0 && D === g.length - 1 ? g : g.slice(m, D + 1);
  }
  function E(g) {
    const C = g.length;
    if (65535 > C)
      return String.fromCharCode.apply(null, g);
    let w = "", I = 0, m = 65535;
    for (; I < C; )
      I + m > C && (m = C - I), w += String.fromCharCode.apply(null, g.subarray(I, I += m));
    return w;
  }
  function p(g) {
    switch (g.essence) {
      case "application/ecmascript":
      case "application/javascript":
      case "application/x-ecmascript":
      case "application/x-javascript":
      case "text/ecmascript":
      case "text/javascript":
      case "text/javascript1.0":
      case "text/javascript1.1":
      case "text/javascript1.2":
      case "text/javascript1.3":
      case "text/javascript1.4":
      case "text/javascript1.5":
      case "text/jscript":
      case "text/livescript":
      case "text/x-ecmascript":
      case "text/x-javascript":
        return "text/javascript";
      case "application/json":
      case "text/json":
        return "application/json";
      case "image/svg+xml":
        return "image/svg+xml";
      case "text/xml":
      case "application/xml":
        return "application/xml";
    }
    return g.subtype.endsWith("+json") ? "application/json" : g.subtype.endsWith("+xml") ? "application/xml" : "";
  }
  return Br = {
    dataURLProcessor: o,
    URLSerializer: a,
    collectASequenceOfCodePoints: u,
    collectASequenceOfCodePointsFast: l,
    stringPercentDecode: i,
    parseMIMEType: B,
    collectAnHTTPQuotedString: y,
    serializeAMimeType: b,
    removeChars: f,
    removeHTTPWhitespace: M,
    minimizeSupportedMimeType: p,
    HTTP_TOKEN_CODEPOINTS: A,
    isomorphicDecode: E
  }, Br;
}
var Cr, co;
function $e() {
  if (co) return Cr;
  co = 1;
  const { types: e, inspect: t } = rt, { markAsUncloneable: A } = Nn, { toUSVString: s } = Ue(), r = {};
  return r.converters = {}, r.util = {}, r.errors = {}, r.errors.exception = function(n) {
    return new TypeError(`${n.header}: ${n.message}`);
  }, r.errors.conversionFailed = function(n) {
    const o = n.types.length === 1 ? "" : " one of", a = `${n.argument} could not be converted to${o}: ${n.types.join(", ")}.`;
    return r.errors.exception({
      header: n.prefix,
      message: a
    });
  }, r.errors.invalidArgument = function(n) {
    return r.errors.exception({
      header: n.prefix,
      message: `"${n.value}" is an invalid ${n.type}.`
    });
  }, r.brandCheck = function(n, o, a) {
    if (a?.strict !== !1) {
      if (!(n instanceof o)) {
        const u = new TypeError("Illegal invocation");
        throw u.code = "ERR_INVALID_THIS", u;
      }
    } else if (n?.[Symbol.toStringTag] !== o.prototype[Symbol.toStringTag]) {
      const u = new TypeError("Illegal invocation");
      throw u.code = "ERR_INVALID_THIS", u;
    }
  }, r.argumentLengthCheck = function({ length: n }, o, a) {
    if (n < o)
      throw r.errors.exception({
        message: `${o} argument${o !== 1 ? "s" : ""} required, but${n ? " only" : ""} ${n} found.`,
        header: a
      });
  }, r.illegalConstructor = function() {
    throw r.errors.exception({
      header: "TypeError",
      message: "Illegal constructor"
    });
  }, r.util.Type = function(n) {
    switch (typeof n) {
      case "undefined":
        return "Undefined";
      case "boolean":
        return "Boolean";
      case "string":
        return "String";
      case "symbol":
        return "Symbol";
      case "number":
        return "Number";
      case "bigint":
        return "BigInt";
      case "function":
      case "object":
        return n === null ? "Null" : "Object";
    }
  }, r.util.markAsUncloneable = A || (() => {
  }), r.util.ConvertToInt = function(n, o, a, u) {
    let l, i;
    o === 64 ? (l = Math.pow(2, 53) - 1, a === "unsigned" ? i = 0 : i = Math.pow(-2, 53) + 1) : a === "unsigned" ? (i = 0, l = Math.pow(2, o) - 1) : (i = Math.pow(-2, o) - 1, l = Math.pow(2, o - 1) - 1);
    let c = Number(n);
    if (c === 0 && (c = 0), u?.enforceRange === !0) {
      if (Number.isNaN(c) || c === Number.POSITIVE_INFINITY || c === Number.NEGATIVE_INFINITY)
        throw r.errors.exception({
          header: "Integer conversion",
          message: `Could not convert ${r.util.Stringify(n)} to an integer.`
        });
      if (c = r.util.IntegerPart(c), c < i || c > l)
        throw r.errors.exception({
          header: "Integer conversion",
          message: `Value must be between ${i}-${l}, got ${c}.`
        });
      return c;
    }
    return !Number.isNaN(c) && u?.clamp === !0 ? (c = Math.min(Math.max(c, i), l), Math.floor(c) % 2 === 0 ? c = Math.floor(c) : c = Math.ceil(c), c) : Number.isNaN(c) || c === 0 && Object.is(0, c) || c === Number.POSITIVE_INFINITY || c === Number.NEGATIVE_INFINITY ? 0 : (c = r.util.IntegerPart(c), c = c % Math.pow(2, o), a === "signed" && c >= Math.pow(2, o) - 1 ? c - Math.pow(2, o) : c);
  }, r.util.IntegerPart = function(n) {
    const o = Math.floor(Math.abs(n));
    return n < 0 ? -1 * o : o;
  }, r.util.Stringify = function(n) {
    switch (r.util.Type(n)) {
      case "Symbol":
        return `Symbol(${n.description})`;
      case "Object":
        return t(n);
      case "String":
        return `"${n}"`;
      default:
        return `${n}`;
    }
  }, r.sequenceConverter = function(n) {
    return (o, a, u, l) => {
      if (r.util.Type(o) !== "Object")
        throw r.errors.exception({
          header: a,
          message: `${u} (${r.util.Stringify(o)}) is not iterable.`
        });
      const i = typeof l == "function" ? l() : o?.[Symbol.iterator]?.(), c = [];
      let Q = 0;
      if (i === void 0 || typeof i.next != "function")
        throw r.errors.exception({
          header: a,
          message: `${u} is not iterable.`
        });
      for (; ; ) {
        const { done: h, value: B } = i.next();
        if (h)
          break;
        c.push(n(B, a, `${u}[${Q++}]`));
      }
      return c;
    };
  }, r.recordConverter = function(n, o) {
    return (a, u, l) => {
      if (r.util.Type(a) !== "Object")
        throw r.errors.exception({
          header: u,
          message: `${l} ("${r.util.Type(a)}") is not an Object.`
        });
      const i = {};
      if (!e.isProxy(a)) {
        const Q = [...Object.getOwnPropertyNames(a), ...Object.getOwnPropertySymbols(a)];
        for (const h of Q) {
          const B = n(h, u, l), d = o(a[h], u, l);
          i[B] = d;
        }
        return i;
      }
      const c = Reflect.ownKeys(a);
      for (const Q of c)
        if (Reflect.getOwnPropertyDescriptor(a, Q)?.enumerable) {
          const B = n(Q, u, l), d = o(a[Q], u, l);
          i[B] = d;
        }
      return i;
    };
  }, r.interfaceConverter = function(n) {
    return (o, a, u, l) => {
      if (l?.strict !== !1 && !(o instanceof n))
        throw r.errors.exception({
          header: a,
          message: `Expected ${u} ("${r.util.Stringify(o)}") to be an instance of ${n.name}.`
        });
      return o;
    };
  }, r.dictionaryConverter = function(n) {
    return (o, a, u) => {
      const l = r.util.Type(o), i = {};
      if (l === "Null" || l === "Undefined")
        return i;
      if (l !== "Object")
        throw r.errors.exception({
          header: a,
          message: `Expected ${o} to be one of: Null, Undefined, Object.`
        });
      for (const c of n) {
        const { key: Q, defaultValue: h, required: B, converter: d } = c;
        if (B === !0 && !Object.hasOwn(o, Q))
          throw r.errors.exception({
            header: a,
            message: `Missing required key "${Q}".`
          });
        let y = o[Q];
        const b = Object.hasOwn(c, "defaultValue");
        if (b && y !== null && (y ??= h()), B || b || y !== void 0) {
          if (y = d(y, a, `${u}.${Q}`), c.allowedValues && !c.allowedValues.includes(y))
            throw r.errors.exception({
              header: a,
              message: `${y} is not an accepted type. Expected one of ${c.allowedValues.join(", ")}.`
            });
          i[Q] = y;
        }
      }
      return i;
    };
  }, r.nullableConverter = function(n) {
    return (o, a, u) => o === null ? o : n(o, a, u);
  }, r.converters.DOMString = function(n, o, a, u) {
    if (n === null && u?.legacyNullToEmptyString)
      return "";
    if (typeof n == "symbol")
      throw r.errors.exception({
        header: o,
        message: `${a} is a symbol, which cannot be converted to a DOMString.`
      });
    return String(n);
  }, r.converters.ByteString = function(n, o, a) {
    const u = r.converters.DOMString(n, o, a);
    for (let l = 0; l < u.length; l++)
      if (u.charCodeAt(l) > 255)
        throw new TypeError(
          `Cannot convert argument to a ByteString because the character at index ${l} has a value of ${u.charCodeAt(l)} which is greater than 255.`
        );
    return u;
  }, r.converters.USVString = s, r.converters.boolean = function(n) {
    return !!n;
  }, r.converters.any = function(n) {
    return n;
  }, r.converters["long long"] = function(n, o, a) {
    return r.util.ConvertToInt(n, 64, "signed", void 0, o, a);
  }, r.converters["unsigned long long"] = function(n, o, a) {
    return r.util.ConvertToInt(n, 64, "unsigned", void 0, o, a);
  }, r.converters["unsigned long"] = function(n, o, a) {
    return r.util.ConvertToInt(n, 32, "unsigned", void 0, o, a);
  }, r.converters["unsigned short"] = function(n, o, a, u) {
    return r.util.ConvertToInt(n, 16, "unsigned", u, o, a);
  }, r.converters.ArrayBuffer = function(n, o, a, u) {
    if (r.util.Type(n) !== "Object" || !e.isAnyArrayBuffer(n))
      throw r.errors.conversionFailed({
        prefix: o,
        argument: `${a} ("${r.util.Stringify(n)}")`,
        types: ["ArrayBuffer"]
      });
    if (u?.allowShared === !1 && e.isSharedArrayBuffer(n))
      throw r.errors.exception({
        header: "ArrayBuffer",
        message: "SharedArrayBuffer is not allowed."
      });
    if (n.resizable || n.growable)
      throw r.errors.exception({
        header: "ArrayBuffer",
        message: "Received a resizable ArrayBuffer."
      });
    return n;
  }, r.converters.TypedArray = function(n, o, a, u, l) {
    if (r.util.Type(n) !== "Object" || !e.isTypedArray(n) || n.constructor.name !== o.name)
      throw r.errors.conversionFailed({
        prefix: a,
        argument: `${u} ("${r.util.Stringify(n)}")`,
        types: [o.name]
      });
    if (l?.allowShared === !1 && e.isSharedArrayBuffer(n.buffer))
      throw r.errors.exception({
        header: "ArrayBuffer",
        message: "SharedArrayBuffer is not allowed."
      });
    if (n.buffer.resizable || n.buffer.growable)
      throw r.errors.exception({
        header: "ArrayBuffer",
        message: "Received a resizable ArrayBuffer."
      });
    return n;
  }, r.converters.DataView = function(n, o, a, u) {
    if (r.util.Type(n) !== "Object" || !e.isDataView(n))
      throw r.errors.exception({
        header: o,
        message: `${a} is not a DataView.`
      });
    if (u?.allowShared === !1 && e.isSharedArrayBuffer(n.buffer))
      throw r.errors.exception({
        header: "ArrayBuffer",
        message: "SharedArrayBuffer is not allowed."
      });
    if (n.buffer.resizable || n.buffer.growable)
      throw r.errors.exception({
        header: "ArrayBuffer",
        message: "Received a resizable ArrayBuffer."
      });
    return n;
  }, r.converters.BufferSource = function(n, o, a, u) {
    if (e.isAnyArrayBuffer(n))
      return r.converters.ArrayBuffer(n, o, a, { ...u, allowShared: !1 });
    if (e.isTypedArray(n))
      return r.converters.TypedArray(n, n.constructor, o, a, { ...u, allowShared: !1 });
    if (e.isDataView(n))
      return r.converters.DataView(n, o, a, { ...u, allowShared: !1 });
    throw r.errors.conversionFailed({
      prefix: o,
      argument: `${a} ("${r.util.Stringify(n)}")`,
      types: ["BufferSource"]
    });
  }, r.converters["sequence<ByteString>"] = r.sequenceConverter(
    r.converters.ByteString
  ), r.converters["sequence<sequence<ByteString>>"] = r.sequenceConverter(
    r.converters["sequence<ByteString>"]
  ), r.converters["record<ByteString, ByteString>"] = r.recordConverter(
    r.converters.ByteString,
    r.converters.ByteString
  ), Cr = {
    webidl: r
  }, Cr;
}
var Ir, go;
function it() {
  if (go) return Ir;
  go = 1;
  const { Transform: e } = ot, t = jA, { redirectStatusSet: A, referrerPolicySet: s, badPortsSet: r } = yA(), { getGlobalOrigin: n } = io(), { collectASequenceOfCodePoints: o, collectAnHTTPQuotedString: a, removeChars: u, parseMIMEType: l } = st(), { performance: i } = Zc, { isBlobLike: c, ReadableStreamFrom: Q, isValidHTTPToken: h, normalizedMethodRecordsBase: B } = Ue(), d = He, { isUint8Array: y } = Un, { webidl: b } = $e();
  let F = [], M;
  try {
    M = require("node:crypto");
    const T = ["sha256", "sha384", "sha512"];
    F = M.getHashes().filter((x) => T.includes(x));
  } catch {
  }
  function L(T) {
    const x = T.urlList, k = x.length;
    return k === 0 ? null : x[k - 1].toString();
  }
  function N(T, x) {
    if (!A.has(T.status))
      return null;
    let k = T.headersList.get("location", !0);
    return k !== null && m(k) && (f(k) || (k = E(k)), k = new URL(k, L(T))), k && !k.hash && (k.hash = x), k;
  }
  function f(T) {
    for (let x = 0; x < T.length; ++x) {
      const k = T.charCodeAt(x);
      if (k > 126 || // Non-US-ASCII + DEL
      k < 32)
        return !1;
    }
    return !0;
  }
  function E(T) {
    return Buffer.from(T, "binary").toString("utf8");
  }
  function p(T) {
    return T.urlList[T.urlList.length - 1];
  }
  function g(T) {
    const x = p(T);
    return Ce(x) && r.has(x.port) ? "blocked" : "allowed";
  }
  function C(T) {
    return T instanceof Error || T?.constructor?.name === "Error" || T?.constructor?.name === "DOMException";
  }
  function w(T) {
    for (let x = 0; x < T.length; ++x) {
      const k = T.charCodeAt(x);
      if (!(k === 9 || // HTAB
      k >= 32 && k <= 126 || // SP / VCHAR
      k >= 128 && k <= 255))
        return !1;
    }
    return !0;
  }
  const I = h;
  function m(T) {
    return (T[0] === "	" || T[0] === " " || T[T.length - 1] === "	" || T[T.length - 1] === " " || T.includes(`
`) || T.includes("\r") || T.includes("\0")) === !1;
  }
  function D(T, x) {
    const { headersList: k } = x, O = (k.get("referrer-policy", !0) ?? "").split(",");
    let H = "";
    if (O.length > 0)
      for (let _ = O.length; _ !== 0; _--) {
        const Ae = O[_ - 1].trim();
        if (s.has(Ae)) {
          H = Ae;
          break;
        }
      }
    H !== "" && (T.referrerPolicy = H);
  }
  function U() {
    return "allowed";
  }
  function S() {
    return "success";
  }
  function G() {
    return "success";
  }
  function v(T) {
    let x = null;
    x = T.mode, T.headersList.set("sec-fetch-mode", x, !0);
  }
  function $(T) {
    let x = T.origin;
    if (!(x === "client" || x === void 0)) {
      if (T.responseTainting === "cors" || T.mode === "websocket")
        T.headersList.append("origin", x, !0);
      else if (T.method !== "GET" && T.method !== "HEAD") {
        switch (T.referrerPolicy) {
          case "no-referrer":
            x = null;
            break;
          case "no-referrer-when-downgrade":
          case "strict-origin":
          case "strict-origin-when-cross-origin":
            T.origin && ue(T.origin) && !ue(p(T)) && (x = null);
            break;
          case "same-origin":
            le(T, p(T)) || (x = null);
            break;
        }
        T.headersList.append("origin", x, !0);
      }
    }
  }
  function ne(T, x) {
    return T;
  }
  function ge(T, x, k) {
    return !T?.startTime || T.startTime < x ? {
      domainLookupStartTime: x,
      domainLookupEndTime: x,
      connectionStartTime: x,
      connectionEndTime: x,
      secureConnectionStartTime: x,
      ALPNNegotiatedProtocol: T?.ALPNNegotiatedProtocol
    } : {
      domainLookupStartTime: ne(T.domainLookupStartTime),
      domainLookupEndTime: ne(T.domainLookupEndTime),
      connectionStartTime: ne(T.connectionStartTime),
      connectionEndTime: ne(T.connectionEndTime),
      secureConnectionStartTime: ne(T.secureConnectionStartTime),
      ALPNNegotiatedProtocol: T.ALPNNegotiatedProtocol
    };
  }
  function ae(T) {
    return ne(i.now());
  }
  function Be(T) {
    return {
      startTime: T.startTime ?? 0,
      redirectStartTime: 0,
      redirectEndTime: 0,
      postRedirectStartTime: T.startTime ?? 0,
      finalServiceWorkerStartTime: 0,
      finalNetworkResponseStartTime: 0,
      finalNetworkRequestStartTime: 0,
      endTime: 0,
      encodedBodySize: 0,
      decodedBodySize: 0,
      finalConnectionTimingInfo: null
    };
  }
  function he() {
    return {
      referrerPolicy: "strict-origin-when-cross-origin"
    };
  }
  function Qe(T) {
    return {
      referrerPolicy: T.referrerPolicy
    };
  }
  function ye(T) {
    const x = T.referrerPolicy;
    d(x);
    let k = null;
    if (T.referrer === "client") {
      const z = n();
      if (!z || z.origin === "null")
        return "no-referrer";
      k = new URL(z);
    } else T.referrer instanceof URL && (k = T.referrer);
    let O = we(k);
    const H = we(k, !0);
    O.toString().length > 4096 && (O = H);
    const _ = le(T, O), Ae = X(O) && !X(T.url);
    switch (x) {
      case "origin":
        return H ?? we(k, !0);
      case "unsafe-url":
        return O;
      case "same-origin":
        return _ ? H : "no-referrer";
      case "origin-when-cross-origin":
        return _ ? O : H;
      case "strict-origin-when-cross-origin": {
        const z = p(T);
        return le(O, z) ? O : X(O) && !X(z) ? "no-referrer" : H;
      }
      // eslint-disable-line
      /**
       * 1. If referrerURL is a potentially trustworthy URL and
       * request’s current URL is not a potentially trustworthy URL,
       * then return no referrer.
       * 2. Return referrerOrigin
      */
      default:
        return Ae ? "no-referrer" : H;
    }
  }
  function we(T, x) {
    return d(T instanceof URL), T = new URL(T), T.protocol === "file:" || T.protocol === "about:" || T.protocol === "blank:" ? "no-referrer" : (T.username = "", T.password = "", T.hash = "", x && (T.pathname = "", T.search = ""), T);
  }
  function X(T) {
    if (!(T instanceof URL))
      return !1;
    if (T.href === "about:blank" || T.href === "about:srcdoc" || T.protocol === "data:" || T.protocol === "file:") return !0;
    return x(T.origin);
    function x(k) {
      if (k == null || k === "null") return !1;
      const O = new URL(k);
      return !!(O.protocol === "https:" || O.protocol === "wss:" || /^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(O.hostname) || O.hostname === "localhost" || O.hostname.includes("localhost.") || O.hostname.endsWith(".localhost"));
    }
  }
  function W(T, x) {
    if (M === void 0)
      return !0;
    const k = J(x);
    if (k === "no metadata" || k.length === 0)
      return !0;
    const O = V(k), H = P(k, O);
    for (const _ of H) {
      const Ae = _.algo, z = _.hash;
      let ce = M.createHash(Ae).update(T).digest("base64");
      if (ce[ce.length - 1] === "=" && (ce[ce.length - 2] === "=" ? ce = ce.slice(0, -2) : ce = ce.slice(0, -1)), Z(ce, z))
        return !0;
    }
    return !1;
  }
  const re = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;
  function J(T) {
    const x = [];
    let k = !0;
    for (const O of T.split(" ")) {
      k = !1;
      const H = re.exec(O);
      if (H === null || H.groups === void 0 || H.groups.algo === void 0)
        continue;
      const _ = H.groups.algo.toLowerCase();
      F.includes(_) && x.push(H.groups);
    }
    return k === !0 ? "no metadata" : x;
  }
  function V(T) {
    let x = T[0].algo;
    if (x[3] === "5")
      return x;
    for (let k = 1; k < T.length; ++k) {
      const O = T[k];
      if (O.algo[3] === "5") {
        x = "sha512";
        break;
      } else {
        if (x[3] === "3")
          continue;
        O.algo[3] === "3" && (x = "sha384");
      }
    }
    return x;
  }
  function P(T, x) {
    if (T.length === 1)
      return T;
    let k = 0;
    for (let O = 0; O < T.length; ++O)
      T[O].algo === x && (T[k++] = T[O]);
    return T.length = k, T;
  }
  function Z(T, x) {
    if (T.length !== x.length)
      return !1;
    for (let k = 0; k < T.length; ++k)
      if (T[k] !== x[k]) {
        if (T[k] === "+" && x[k] === "-" || T[k] === "/" && x[k] === "_")
          continue;
        return !1;
      }
    return !0;
  }
  function se(T) {
  }
  function le(T, x) {
    return T.origin === x.origin && T.origin === "null" || T.protocol === x.protocol && T.hostname === x.hostname && T.port === x.port;
  }
  function oe() {
    let T, x;
    return { promise: new Promise((O, H) => {
      T = O, x = H;
    }), resolve: T, reject: x };
  }
  function fe(T) {
    return T.controller.state === "aborted";
  }
  function Me(T) {
    return T.controller.state === "aborted" || T.controller.state === "terminated";
  }
  function pe(T) {
    return B[T.toLowerCase()] ?? T;
  }
  function Le(T) {
    const x = JSON.stringify(T);
    if (x === void 0)
      throw new TypeError("Value is not JSON serializable");
    return d(typeof x == "string"), x;
  }
  const Re = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
  function ke(T, x, k = 0, O = 1) {
    class H {
      /** @type {any} */
      #e;
      /** @type {'key' | 'value' | 'key+value'} */
      #t;
      /** @type {number} */
      #s;
      /**
       * @see https://webidl.spec.whatwg.org/#dfn-default-iterator-object
       * @param {unknown} target
       * @param {'key' | 'value' | 'key+value'} kind
       */
      constructor(Ae, z) {
        this.#e = Ae, this.#t = z, this.#s = 0;
      }
      next() {
        if (typeof this != "object" || this === null || !(#e in this))
          throw new TypeError(
            `'next' called on an object that does not implement interface ${T} Iterator.`
          );
        const Ae = this.#s, z = this.#e[x], ce = z.length;
        if (Ae >= ce)
          return {
            value: void 0,
            done: !0
          };
        const { [k]: Fe, [O]: Ge } = z[Ae];
        this.#s = Ae + 1;
        let Ne;
        switch (this.#t) {
          case "key":
            Ne = Fe;
            break;
          case "value":
            Ne = Ge;
            break;
          case "key+value":
            Ne = [Fe, Ge];
            break;
        }
        return {
          value: Ne,
          done: !1
        };
      }
    }
    return delete H.prototype.constructor, Object.setPrototypeOf(H.prototype, Re), Object.defineProperties(H.prototype, {
      [Symbol.toStringTag]: {
        writable: !1,
        enumerable: !1,
        configurable: !0,
        value: `${T} Iterator`
      },
      next: { writable: !0, enumerable: !0, configurable: !0 }
    }), function(_, Ae) {
      return new H(_, Ae);
    };
  }
  function de(T, x, k, O = 0, H = 1) {
    const _ = ke(T, k, O, H), Ae = {
      keys: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function() {
          return b.brandCheck(this, x), _(this, "key");
        }
      },
      values: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function() {
          return b.brandCheck(this, x), _(this, "value");
        }
      },
      entries: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function() {
          return b.brandCheck(this, x), _(this, "key+value");
        }
      },
      forEach: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function(ce, Fe = globalThis) {
          if (b.brandCheck(this, x), b.argumentLengthCheck(arguments, 1, `${T}.forEach`), typeof ce != "function")
            throw new TypeError(
              `Failed to execute 'forEach' on '${T}': parameter 1 is not of type 'Function'.`
            );
          for (const { 0: Ge, 1: Ne } of _(this, "key+value"))
            ce.call(Fe, Ne, Ge, this);
        }
      }
    };
    return Object.defineProperties(x.prototype, {
      ...Ae,
      [Symbol.iterator]: {
        writable: !0,
        enumerable: !1,
        configurable: !0,
        value: Ae.entries.value
      }
    });
  }
  async function We(T, x, k) {
    const O = x, H = k;
    let _;
    try {
      _ = T.stream.getReader();
    } catch (Ae) {
      H(Ae);
      return;
    }
    try {
      O(await q(_));
    } catch (Ae) {
      H(Ae);
    }
  }
  function _e(T) {
    return T instanceof ReadableStream || T[Symbol.toStringTag] === "ReadableStream" && typeof T.tee == "function";
  }
  function Je(T) {
    try {
      T.close(), T.byobRequest?.respond(0);
    } catch (x) {
      if (!x.message.includes("Controller is already closed") && !x.message.includes("ReadableStream is already closed"))
        throw x;
    }
  }
  const j = /[^\x00-\xFF]/;
  function R(T) {
    return d(!j.test(T)), T;
  }
  async function q(T) {
    const x = [];
    let k = 0;
    for (; ; ) {
      const { done: O, value: H } = await T.read();
      if (O)
        return Buffer.concat(x, k);
      if (!y(H))
        throw new TypeError("Received non-Uint8Array chunk");
      x.push(H), k += H.length;
    }
  }
  function ie(T) {
    d("protocol" in T);
    const x = T.protocol;
    return x === "about:" || x === "blob:" || x === "data:";
  }
  function ue(T) {
    return typeof T == "string" && T[5] === ":" && T[0] === "h" && T[1] === "t" && T[2] === "t" && T[3] === "p" && T[4] === "s" || T.protocol === "https:";
  }
  function Ce(T) {
    d("protocol" in T);
    const x = T.protocol;
    return x === "http:" || x === "https:";
  }
  function De(T, x) {
    const k = T;
    if (!k.startsWith("bytes"))
      return "failure";
    const O = { position: 5 };
    if (x && o(
      (ce) => ce === "	" || ce === " ",
      k,
      O
    ), k.charCodeAt(O.position) !== 61)
      return "failure";
    O.position++, x && o(
      (ce) => ce === "	" || ce === " ",
      k,
      O
    );
    const H = o(
      (ce) => {
        const Fe = ce.charCodeAt(0);
        return Fe >= 48 && Fe <= 57;
      },
      k,
      O
    ), _ = H.length ? Number(H) : null;
    if (x && o(
      (ce) => ce === "	" || ce === " ",
      k,
      O
    ), k.charCodeAt(O.position) !== 45)
      return "failure";
    O.position++, x && o(
      (ce) => ce === "	" || ce === " ",
      k,
      O
    );
    const Ae = o(
      (ce) => {
        const Fe = ce.charCodeAt(0);
        return Fe >= 48 && Fe <= 57;
      },
      k,
      O
    ), z = Ae.length ? Number(Ae) : null;
    return O.position < k.length || z === null && _ === null || _ > z ? "failure" : { rangeStartValue: _, rangeEndValue: z };
  }
  function ve(T, x, k) {
    let O = "bytes ";
    return O += R(`${T}`), O += "-", O += R(`${x}`), O += "/", O += R(`${k}`), O;
  }
  class ze extends e {
    #e;
    /** @param {zlib.ZlibOptions} [zlibOptions] */
    constructor(x) {
      super(), this.#e = x;
    }
    _transform(x, k, O) {
      if (!this._inflateStream) {
        if (x.length === 0) {
          O();
          return;
        }
        this._inflateStream = (x[0] & 15) === 8 ? t.createInflate(this.#e) : t.createInflateRaw(this.#e), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (H) => this.destroy(H));
      }
      this._inflateStream.write(x, k, O);
    }
    _final(x) {
      this._inflateStream && (this._inflateStream.end(), this._inflateStream = null), x();
    }
  }
  function Ke(T) {
    return new ze(T);
  }
  function Ie(T) {
    let x = null, k = null, O = null;
    const H = ee("content-type", T);
    if (H === null)
      return "failure";
    for (const _ of H) {
      const Ae = l(_);
      Ae === "failure" || Ae.essence === "*/*" || (O = Ae, O.essence !== k ? (x = null, O.parameters.has("charset") && (x = O.parameters.get("charset")), k = O.essence) : !O.parameters.has("charset") && x !== null && O.parameters.set("charset", x));
    }
    return O ?? "failure";
  }
  function Y(T) {
    const x = T, k = { position: 0 }, O = [];
    let H = "";
    for (; k.position < x.length; ) {
      if (H += o(
        (_) => _ !== '"' && _ !== ",",
        x,
        k
      ), k.position < x.length)
        if (x.charCodeAt(k.position) === 34) {
          if (H += a(
            x,
            k
          ), k.position < x.length)
            continue;
        } else
          d(x.charCodeAt(k.position) === 44), k.position++;
      H = u(H, !0, !0, (_) => _ === 9 || _ === 32), O.push(H), H = "";
    }
    return O;
  }
  function ee(T, x) {
    const k = x.get(T, !0);
    return k === null ? null : Y(k);
  }
  const K = new TextDecoder();
  function te(T) {
    return T.length === 0 ? "" : (T[0] === 239 && T[1] === 187 && T[2] === 191 && (T = T.subarray(3)), K.decode(T));
  }
  class Ee {
    get baseUrl() {
      return n();
    }
    get origin() {
      return this.baseUrl?.origin;
    }
    policyContainer = he();
  }
  class be {
    settingsObject = new Ee();
  }
  const Se = new be();
  return Ir = {
    isAborted: fe,
    isCancelled: Me,
    isValidEncodedURL: f,
    createDeferredPromise: oe,
    ReadableStreamFrom: Q,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: se,
    clampAndCoarsenConnectionTimingInfo: ge,
    coarsenedSharedCurrentTime: ae,
    determineRequestsReferrer: ye,
    makePolicyContainer: he,
    clonePolicyContainer: Qe,
    appendFetchMetadata: v,
    appendRequestOriginHeader: $,
    TAOCheck: G,
    corsCheck: S,
    crossOriginResourcePolicyCheck: U,
    createOpaqueTimingInfo: Be,
    setRequestReferrerPolicyOnRedirect: D,
    isValidHTTPToken: h,
    requestBadPort: g,
    requestCurrentURL: p,
    responseURL: L,
    responseLocationURL: N,
    isBlobLike: c,
    isURLPotentiallyTrustworthy: X,
    isValidReasonPhrase: w,
    sameOrigin: le,
    normalizeMethod: pe,
    serializeJavascriptValueToJSONString: Le,
    iteratorMixin: de,
    createIterator: ke,
    isValidHeaderName: I,
    isValidHeaderValue: m,
    isErrorLike: C,
    fullyReadBody: We,
    bytesMatch: W,
    isReadableStreamLike: _e,
    readableStreamClose: Je,
    isomorphicEncode: R,
    urlIsLocal: ie,
    urlHasHttpsScheme: ue,
    urlIsHttpHttpsScheme: Ce,
    readAllBytes: q,
    simpleRangeHeaderValue: De,
    buildContentRange: ve,
    parseMetadata: J,
    createInflate: Ke,
    extractMimeType: Ie,
    getDecodeSplit: ee,
    utf8DecodeBytes: te,
    environmentSettingsObject: Se
  }, Ir;
}
var dr, lo;
function Tt() {
  return lo || (lo = 1, dr = {
    kUrl: /* @__PURE__ */ Symbol("url"),
    kHeaders: /* @__PURE__ */ Symbol("headers"),
    kSignal: /* @__PURE__ */ Symbol("signal"),
    kState: /* @__PURE__ */ Symbol("state"),
    kDispatcher: /* @__PURE__ */ Symbol("dispatcher")
  }), dr;
}
var fr, uo;
function Eo() {
  if (uo) return fr;
  uo = 1;
  const { Blob: e, File: t } = at, { kState: A } = Tt(), { webidl: s } = $e();
  class r {
    constructor(a, u, l = {}) {
      const i = u, c = l.type, Q = l.lastModified ?? Date.now();
      this[A] = {
        blobLike: a,
        name: i,
        type: c,
        lastModified: Q
      };
    }
    stream(...a) {
      return s.brandCheck(this, r), this[A].blobLike.stream(...a);
    }
    arrayBuffer(...a) {
      return s.brandCheck(this, r), this[A].blobLike.arrayBuffer(...a);
    }
    slice(...a) {
      return s.brandCheck(this, r), this[A].blobLike.slice(...a);
    }
    text(...a) {
      return s.brandCheck(this, r), this[A].blobLike.text(...a);
    }
    get size() {
      return s.brandCheck(this, r), this[A].blobLike.size;
    }
    get type() {
      return s.brandCheck(this, r), this[A].blobLike.type;
    }
    get name() {
      return s.brandCheck(this, r), this[A].name;
    }
    get lastModified() {
      return s.brandCheck(this, r), this[A].lastModified;
    }
    get [Symbol.toStringTag]() {
      return "File";
    }
  }
  s.converters.Blob = s.interfaceConverter(e);
  function n(o) {
    return o instanceof t || o && (typeof o.stream == "function" || typeof o.arrayBuffer == "function") && o[Symbol.toStringTag] === "File";
  }
  return fr = { FileLike: r, isFileLike: n }, fr;
}
var pr, Qo;
function DA() {
  if (Qo) return pr;
  Qo = 1;
  const { isBlobLike: e, iteratorMixin: t } = it(), { kState: A } = Tt(), { kEnumerableProperty: s } = Ue(), { FileLike: r, isFileLike: n } = Eo(), { webidl: o } = $e(), { File: a } = at, u = rt, l = globalThis.File ?? a;
  class i {
    constructor(h) {
      if (o.util.markAsUncloneable(this), h !== void 0)
        throw o.errors.conversionFailed({
          prefix: "FormData constructor",
          argument: "Argument 1",
          types: ["undefined"]
        });
      this[A] = [];
    }
    append(h, B, d = void 0) {
      o.brandCheck(this, i);
      const y = "FormData.append";
      if (o.argumentLengthCheck(arguments, 2, y), arguments.length === 3 && !e(B))
        throw new TypeError(
          "Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'"
        );
      h = o.converters.USVString(h, y, "name"), B = e(B) ? o.converters.Blob(B, y, "value", { strict: !1 }) : o.converters.USVString(B, y, "value"), d = arguments.length === 3 ? o.converters.USVString(d, y, "filename") : void 0;
      const b = c(h, B, d);
      this[A].push(b);
    }
    delete(h) {
      o.brandCheck(this, i);
      const B = "FormData.delete";
      o.argumentLengthCheck(arguments, 1, B), h = o.converters.USVString(h, B, "name"), this[A] = this[A].filter((d) => d.name !== h);
    }
    get(h) {
      o.brandCheck(this, i);
      const B = "FormData.get";
      o.argumentLengthCheck(arguments, 1, B), h = o.converters.USVString(h, B, "name");
      const d = this[A].findIndex((y) => y.name === h);
      return d === -1 ? null : this[A][d].value;
    }
    getAll(h) {
      o.brandCheck(this, i);
      const B = "FormData.getAll";
      return o.argumentLengthCheck(arguments, 1, B), h = o.converters.USVString(h, B, "name"), this[A].filter((d) => d.name === h).map((d) => d.value);
    }
    has(h) {
      o.brandCheck(this, i);
      const B = "FormData.has";
      return o.argumentLengthCheck(arguments, 1, B), h = o.converters.USVString(h, B, "name"), this[A].findIndex((d) => d.name === h) !== -1;
    }
    set(h, B, d = void 0) {
      o.brandCheck(this, i);
      const y = "FormData.set";
      if (o.argumentLengthCheck(arguments, 2, y), arguments.length === 3 && !e(B))
        throw new TypeError(
          "Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'"
        );
      h = o.converters.USVString(h, y, "name"), B = e(B) ? o.converters.Blob(B, y, "name", { strict: !1 }) : o.converters.USVString(B, y, "name"), d = arguments.length === 3 ? o.converters.USVString(d, y, "name") : void 0;
      const b = c(h, B, d), F = this[A].findIndex((M) => M.name === h);
      F !== -1 ? this[A] = [
        ...this[A].slice(0, F),
        b,
        ...this[A].slice(F + 1).filter((M) => M.name !== h)
      ] : this[A].push(b);
    }
    [u.inspect.custom](h, B) {
      const d = this[A].reduce((b, F) => (b[F.name] ? Array.isArray(b[F.name]) ? b[F.name].push(F.value) : b[F.name] = [b[F.name], F.value] : b[F.name] = F.value, b), { __proto__: null });
      B.depth ??= h, B.colors ??= !0;
      const y = u.formatWithOptions(B, d);
      return `FormData ${y.slice(y.indexOf("]") + 2)}`;
    }
  }
  t("FormData", i, A, "name", "value"), Object.defineProperties(i.prototype, {
    append: s,
    delete: s,
    get: s,
    getAll: s,
    has: s,
    set: s,
    [Symbol.toStringTag]: {
      value: "FormData",
      configurable: !0
    }
  });
  function c(Q, h, B) {
    if (typeof h != "string") {
      if (n(h) || (h = h instanceof Blob ? new l([h], "blob", { type: h.type }) : new r(h, "blob", { type: h.type })), B !== void 0) {
        const d = {
          type: h.type,
          lastModified: h.lastModified
        };
        h = h instanceof a ? new l([h], B, d) : new r(h, B, d);
      }
    }
    return { name: Q, value: h };
  }
  return pr = { FormData: i, makeEntry: c }, pr;
}
var wr, ho;
function Bg() {
  if (ho) return wr;
  ho = 1;
  const { isUSVString: e, bufferToLowerCasedHeaderName: t } = Ue(), { utf8DecodeBytes: A } = it(), { HTTP_TOKEN_CODEPOINTS: s, isomorphicDecode: r } = st(), { isFileLike: n } = Eo(), { makeEntry: o } = DA(), a = He, { File: u } = at, l = globalThis.File ?? u, i = Buffer.from('form-data; name="'), c = Buffer.from("; filename"), Q = Buffer.from("--"), h = Buffer.from(`--\r
`);
  function B(f) {
    for (let E = 0; E < f.length; ++E)
      if ((f.charCodeAt(E) & -128) !== 0)
        return !1;
    return !0;
  }
  function d(f) {
    const E = f.length;
    if (E < 27 || E > 70)
      return !1;
    for (let p = 0; p < E; ++p) {
      const g = f.charCodeAt(p);
      if (!(g >= 48 && g <= 57 || g >= 65 && g <= 90 || g >= 97 && g <= 122 || g === 39 || g === 45 || g === 95))
        return !1;
    }
    return !0;
  }
  function y(f, E) {
    a(E !== "failure" && E.essence === "multipart/form-data");
    const p = E.parameters.get("boundary");
    if (p === void 0)
      return "failure";
    const g = Buffer.from(`--${p}`, "utf8"), C = [], w = { position: 0 };
    for (; f[w.position] === 13 && f[w.position + 1] === 10; )
      w.position += 2;
    let I = f.length;
    for (; f[I - 1] === 10 && f[I - 2] === 13; )
      I -= 2;
    for (I !== f.length && (f = f.subarray(0, I)); ; ) {
      if (f.subarray(w.position, w.position + g.length).equals(g))
        w.position += g.length;
      else
        return "failure";
      if (w.position === f.length - 2 && N(f, Q, w) || w.position === f.length - 4 && N(f, h, w))
        return C;
      if (f[w.position] !== 13 || f[w.position + 1] !== 10)
        return "failure";
      w.position += 2;
      const m = b(f, w);
      if (m === "failure")
        return "failure";
      let { name: D, filename: U, contentType: S, encoding: G } = m;
      w.position += 2;
      let v;
      {
        const ne = f.indexOf(g.subarray(2), w.position);
        if (ne === -1)
          return "failure";
        v = f.subarray(w.position, ne - 4), w.position += v.length, G === "base64" && (v = Buffer.from(v.toString(), "base64"));
      }
      if (f[w.position] !== 13 || f[w.position + 1] !== 10)
        return "failure";
      w.position += 2;
      let $;
      U !== null ? (S ??= "text/plain", B(S) || (S = ""), $ = new l([v], U, { type: S })) : $ = A(Buffer.from(v)), a(e(D)), a(typeof $ == "string" && e($) || n($)), C.push(o(D, $, U));
    }
  }
  function b(f, E) {
    let p = null, g = null, C = null, w = null;
    for (; ; ) {
      if (f[E.position] === 13 && f[E.position + 1] === 10)
        return p === null ? "failure" : { name: p, filename: g, contentType: C, encoding: w };
      let I = M(
        (m) => m !== 10 && m !== 13 && m !== 58,
        f,
        E
      );
      if (I = L(I, !0, !0, (m) => m === 9 || m === 32), !s.test(I.toString()) || f[E.position] !== 58)
        return "failure";
      switch (E.position++, M(
        (m) => m === 32 || m === 9,
        f,
        E
      ), t(I)) {
        case "content-disposition": {
          if (p = g = null, !N(f, i, E) || (E.position += 17, p = F(f, E), p === null))
            return "failure";
          if (N(f, c, E)) {
            let m = E.position + c.length;
            if (f[m] === 42 && (E.position += 1, m += 1), f[m] !== 61 || f[m + 1] !== 34 || (E.position += 12, g = F(f, E), g === null))
              return "failure";
          }
          break;
        }
        case "content-type": {
          let m = M(
            (D) => D !== 10 && D !== 13,
            f,
            E
          );
          m = L(m, !1, !0, (D) => D === 9 || D === 32), C = r(m);
          break;
        }
        case "content-transfer-encoding": {
          let m = M(
            (D) => D !== 10 && D !== 13,
            f,
            E
          );
          m = L(m, !1, !0, (D) => D === 9 || D === 32), w = r(m);
          break;
        }
        default:
          M(
            (m) => m !== 10 && m !== 13,
            f,
            E
          );
      }
      if (f[E.position] !== 13 && f[E.position + 1] !== 10)
        return "failure";
      E.position += 2;
    }
  }
  function F(f, E) {
    a(f[E.position - 1] === 34);
    let p = M(
      (g) => g !== 10 && g !== 13 && g !== 34,
      f,
      E
    );
    return f[E.position] !== 34 ? null : (E.position++, p = new TextDecoder().decode(p).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), p);
  }
  function M(f, E, p) {
    let g = p.position;
    for (; g < E.length && f(E[g]); )
      ++g;
    return E.subarray(p.position, p.position = g);
  }
  function L(f, E, p, g) {
    let C = 0, w = f.length - 1;
    if (E)
      for (; C < f.length && g(f[C]); ) C++;
    for (; w > 0 && g(f[w]); ) w--;
    return C === 0 && w === f.length - 1 ? f : f.subarray(C, w + 1);
  }
  function N(f, E, p) {
    if (f.length < E.length)
      return !1;
    for (let g = 0; g < E.length; g++)
      if (E[g] !== f[p.position + g])
        return !1;
    return !0;
  }
  return wr = {
    multipartFormDataParser: y,
    validateBoundary: d
  }, wr;
}
var mr, Bo;
function $t() {
  if (Bo) return mr;
  Bo = 1;
  const e = Ue(), {
    ReadableStreamFrom: t,
    isBlobLike: A,
    isReadableStreamLike: s,
    readableStreamClose: r,
    createDeferredPromise: n,
    fullyReadBody: o,
    extractMimeType: a,
    utf8DecodeBytes: u
  } = it(), { FormData: l } = DA(), { kState: i } = Tt(), { webidl: c } = $e(), { Blob: Q } = at, h = He, { isErrored: B, isDisturbed: d } = ot, { isArrayBuffer: y } = Un, { serializeAMimeType: b } = st(), { multipartFormDataParser: F } = Bg();
  let M;
  try {
    const v = require("node:crypto");
    M = ($) => v.randomInt(0, $);
  } catch {
    M = (v) => Math.floor(Math.random(v));
  }
  const L = new TextEncoder();
  function N() {
  }
  const f = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0;
  let E;
  f && (E = new FinalizationRegistry((v) => {
    const $ = v.deref();
    $ && !$.locked && !d($) && !B($) && $.cancel("Response object has been garbage collected").catch(N);
  }));
  function p(v, $ = !1) {
    let ne = null;
    v instanceof ReadableStream ? ne = v : A(v) ? ne = v.stream() : ne = new ReadableStream({
      async pull(ye) {
        const we = typeof ae == "string" ? L.encode(ae) : ae;
        we.byteLength && ye.enqueue(we), queueMicrotask(() => r(ye));
      },
      start() {
      },
      type: "bytes"
    }), h(s(ne));
    let ge = null, ae = null, Be = null, he = null;
    if (typeof v == "string")
      ae = v, he = "text/plain;charset=UTF-8";
    else if (v instanceof URLSearchParams)
      ae = v.toString(), he = "application/x-www-form-urlencoded;charset=UTF-8";
    else if (y(v))
      ae = new Uint8Array(v.slice());
    else if (ArrayBuffer.isView(v))
      ae = new Uint8Array(v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength));
    else if (e.isFormDataLike(v)) {
      const ye = `----formdata-undici-0${`${M(1e11)}`.padStart(11, "0")}`, we = `--${ye}\r
Content-Disposition: form-data`;
      const X = (Z) => Z.replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), W = (Z) => Z.replace(/\r?\n|\r/g, `\r
`), re = [], J = new Uint8Array([13, 10]);
      Be = 0;
      let V = !1;
      for (const [Z, se] of v)
        if (typeof se == "string") {
          const le = L.encode(we + `; name="${X(W(Z))}"\r
\r
${W(se)}\r
`);
          re.push(le), Be += le.byteLength;
        } else {
          const le = L.encode(`${we}; name="${X(W(Z))}"` + (se.name ? `; filename="${X(se.name)}"` : "") + `\r
Content-Type: ${se.type || "application/octet-stream"}\r
\r
`);
          re.push(le, se, J), typeof se.size == "number" ? Be += le.byteLength + se.size + J.byteLength : V = !0;
        }
      const P = L.encode(`--${ye}--\r
`);
      re.push(P), Be += P.byteLength, V && (Be = null), ae = v, ge = async function* () {
        for (const Z of re)
          Z.stream ? yield* Z.stream() : yield Z;
      }, he = `multipart/form-data; boundary=${ye}`;
    } else if (A(v))
      ae = v, Be = v.size, v.type && (he = v.type);
    else if (typeof v[Symbol.asyncIterator] == "function") {
      if ($)
        throw new TypeError("keepalive");
      if (e.isDisturbed(v) || v.locked)
        throw new TypeError(
          "Response body object should not be disturbed or locked"
        );
      ne = v instanceof ReadableStream ? v : t(v);
    }
    if ((typeof ae == "string" || e.isBuffer(ae)) && (Be = Buffer.byteLength(ae)), ge != null) {
      let ye;
      ne = new ReadableStream({
        async start() {
          ye = ge(v)[Symbol.asyncIterator]();
        },
        async pull(we) {
          const { value: X, done: W } = await ye.next();
          if (W)
            queueMicrotask(() => {
              we.close(), we.byobRequest?.respond(0);
            });
          else if (!B(ne)) {
            const re = new Uint8Array(X);
            re.byteLength && we.enqueue(re);
          }
          return we.desiredSize > 0;
        },
        async cancel(we) {
          await ye.return();
        },
        type: "bytes"
      });
    }
    return [{ stream: ne, source: ae, length: Be }, he];
  }
  function g(v, $ = !1) {
    return v instanceof ReadableStream && (h(!e.isDisturbed(v), "The body has already been consumed."), h(!v.locked, "The stream is locked.")), p(v, $);
  }
  function C(v, $) {
    const [ne, ge] = $.stream.tee();
    return $.stream = ne, {
      stream: ge,
      length: $.length,
      source: $.source
    };
  }
  function w(v) {
    if (v.aborted)
      throw new DOMException("The operation was aborted.", "AbortError");
  }
  function I(v) {
    return {
      blob() {
        return D(this, (ne) => {
          let ge = G(this);
          return ge === null ? ge = "" : ge && (ge = b(ge)), new Q([ne], { type: ge });
        }, v);
      },
      arrayBuffer() {
        return D(this, (ne) => new Uint8Array(ne).buffer, v);
      },
      text() {
        return D(this, u, v);
      },
      json() {
        return D(this, S, v);
      },
      formData() {
        return D(this, (ne) => {
          const ge = G(this);
          if (ge !== null)
            switch (ge.essence) {
              case "multipart/form-data": {
                const ae = F(ne, ge);
                if (ae === "failure")
                  throw new TypeError("Failed to parse body as FormData.");
                const Be = new l();
                return Be[i] = ae, Be;
              }
              case "application/x-www-form-urlencoded": {
                const ae = new URLSearchParams(ne.toString()), Be = new l();
                for (const [he, Qe] of ae)
                  Be.append(he, Qe);
                return Be;
              }
            }
          throw new TypeError(
            'Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".'
          );
        }, v);
      },
      bytes() {
        return D(this, (ne) => new Uint8Array(ne), v);
      }
    };
  }
  function m(v) {
    Object.assign(v.prototype, I(v));
  }
  async function D(v, $, ne) {
    if (c.brandCheck(v, ne), U(v))
      throw new TypeError("Body is unusable: Body has already been read");
    w(v[i]);
    const ge = n(), ae = (he) => ge.reject(he), Be = (he) => {
      try {
        ge.resolve($(he));
      } catch (Qe) {
        ae(Qe);
      }
    };
    return v[i].body == null ? (Be(Buffer.allocUnsafe(0)), ge.promise) : (await o(v[i].body, Be, ae), ge.promise);
  }
  function U(v) {
    const $ = v[i].body;
    return $ != null && ($.stream.locked || e.isDisturbed($.stream));
  }
  function S(v) {
    return JSON.parse(u(v));
  }
  function G(v) {
    const $ = v[i].headersList, ne = a($);
    return ne === "failure" ? null : ne;
  }
  return mr = {
    extractBody: p,
    safelyExtractBody: g,
    cloneBody: C,
    mixinBody: m,
    streamRegistry: E,
    hasFinalizationRegistry: f,
    bodyUnusable: U
  }, mr;
}
var yr, Co;
function Cg() {
  if (Co) return yr;
  Co = 1;
  const e = He, t = Ue(), { channels: A } = Kt(), s = Xn(), {
    RequestContentLengthMismatchError: r,
    ResponseContentLengthMismatchError: n,
    RequestAbortedError: o,
    HeadersTimeoutError: a,
    HeadersOverflowError: u,
    SocketError: l,
    InformationalError: i,
    BodyTimeoutError: c,
    HTTPParserError: Q,
    ResponseExceededMaxSizeError: h
  } = Ye(), {
    kUrl: B,
    kReset: d,
    kClient: y,
    kParser: b,
    kBlocking: F,
    kRunning: M,
    kPending: L,
    kSize: N,
    kWriting: f,
    kQueue: E,
    kNoRef: p,
    kKeepAliveDefaultTimeout: g,
    kHostHeader: C,
    kPendingIdx: w,
    kRunningIdx: I,
    kError: m,
    kPipelining: D,
    kSocket: U,
    kKeepAliveTimeoutValue: S,
    kMaxHeadersSize: G,
    kKeepAliveMaxTimeout: v,
    kKeepAliveTimeoutThreshold: $,
    kHeadersTimeout: ne,
    kBodyTimeout: ge,
    kStrictContentLength: ae,
    kMaxRequests: Be,
    kCounter: he,
    kMaxResponseSize: Qe,
    kOnError: ye,
    kResume: we,
    kHTTPContext: X
  } = Ve(), W = Qg(), re = Buffer.alloc(0), J = Buffer[Symbol.species], V = t.addListener, P = t.removeAllListeners;
  let Z;
  async function se() {
    const Ie = process.env.JEST_WORKER_ID ? ro() : void 0;
    let Y;
    try {
      Y = await WebAssembly.compile(hg());
    } catch {
      Y = await WebAssembly.compile(Ie || ro());
    }
    return await WebAssembly.instantiate(Y, {
      env: {
        /* eslint-disable camelcase */
        wasm_on_url: (ee, K, te) => 0,
        wasm_on_status: (ee, K, te) => {
          e(fe.ptr === ee);
          const Ee = K - Le + Me.byteOffset;
          return fe.onStatus(new J(Me.buffer, Ee, te)) || 0;
        },
        wasm_on_message_begin: (ee) => (e(fe.ptr === ee), fe.onMessageBegin() || 0),
        wasm_on_header_field: (ee, K, te) => {
          e(fe.ptr === ee);
          const Ee = K - Le + Me.byteOffset;
          return fe.onHeaderField(new J(Me.buffer, Ee, te)) || 0;
        },
        wasm_on_header_value: (ee, K, te) => {
          e(fe.ptr === ee);
          const Ee = K - Le + Me.byteOffset;
          return fe.onHeaderValue(new J(Me.buffer, Ee, te)) || 0;
        },
        wasm_on_headers_complete: (ee, K, te, Ee) => (e(fe.ptr === ee), fe.onHeadersComplete(K, !!te, !!Ee) || 0),
        wasm_on_body: (ee, K, te) => {
          e(fe.ptr === ee);
          const Ee = K - Le + Me.byteOffset;
          return fe.onBody(new J(Me.buffer, Ee, te)) || 0;
        },
        wasm_on_message_complete: (ee) => (e(fe.ptr === ee), fe.onMessageComplete() || 0)
        /* eslint-enable camelcase */
      }
    });
  }
  let le = null, oe = se();
  oe.catch();
  let fe = null, Me = null, pe = 0, Le = null;
  const Re = 0, ke = 1, de = 2 | ke, We = 4 | ke, _e = 8 | Re;
  class Je {
    constructor(Y, ee, { exports: K }) {
      e(Number.isFinite(Y[G]) && Y[G] > 0), this.llhttp = K, this.ptr = this.llhttp.llhttp_alloc(W.TYPE.RESPONSE), this.client = Y, this.socket = ee, this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.statusCode = null, this.statusText = "", this.upgrade = !1, this.headers = [], this.headersSize = 0, this.headersMaxSize = Y[G], this.shouldKeepAlive = !1, this.paused = !1, this.resume = this.resume.bind(this), this.bytesRead = 0, this.keepAlive = "", this.contentLength = "", this.connection = "", this.maxResponseSize = Y[Qe];
    }
    setTimeout(Y, ee) {
      Y !== this.timeoutValue || ee & ke ^ this.timeoutType & ke ? (this.timeout && (s.clearTimeout(this.timeout), this.timeout = null), Y && (ee & ke ? this.timeout = s.setFastTimeout(j, Y, new WeakRef(this)) : (this.timeout = setTimeout(j, Y, new WeakRef(this)), this.timeout.unref())), this.timeoutValue = Y) : this.timeout && this.timeout.refresh && this.timeout.refresh(), this.timeoutType = ee;
    }
    resume() {
      this.socket.destroyed || !this.paused || (e(this.ptr != null), e(fe == null), this.llhttp.llhttp_resume(this.ptr), e(this.timeoutType === We), this.timeout && this.timeout.refresh && this.timeout.refresh(), this.paused = !1, this.execute(this.socket.read() || re), this.readMore());
    }
    readMore() {
      for (; !this.paused && this.ptr; ) {
        const Y = this.socket.read();
        if (Y === null)
          break;
        this.execute(Y);
      }
    }
    execute(Y) {
      e(this.ptr != null), e(fe == null), e(!this.paused);
      const { socket: ee, llhttp: K } = this;
      Y.length > pe && (Le && K.free(Le), pe = Math.ceil(Y.length / 4096) * 4096, Le = K.malloc(pe)), new Uint8Array(K.memory.buffer, Le, pe).set(Y);
      try {
        let te;
        try {
          Me = Y, fe = this, te = K.llhttp_execute(this.ptr, Le, Y.length);
        } catch (be) {
          throw be;
        } finally {
          fe = null, Me = null;
        }
        const Ee = K.llhttp_get_error_pos(this.ptr) - Le;
        if (te === W.ERROR.PAUSED_UPGRADE)
          this.onUpgrade(Y.slice(Ee));
        else if (te === W.ERROR.PAUSED)
          this.paused = !0, ee.unshift(Y.slice(Ee));
        else if (te !== W.ERROR.OK) {
          const be = K.llhttp_get_error_reason(this.ptr);
          let Se = "";
          if (be) {
            const T = new Uint8Array(K.memory.buffer, be).indexOf(0);
            Se = "Response does not match the HTTP/1.1 protocol (" + Buffer.from(K.memory.buffer, be, T).toString() + ")";
          }
          throw new Q(Se, W.ERROR[te], Y.slice(Ee));
        }
      } catch (te) {
        t.destroy(ee, te);
      }
    }
    destroy() {
      e(this.ptr != null), e(fe == null), this.llhttp.llhttp_free(this.ptr), this.ptr = null, this.timeout && s.clearTimeout(this.timeout), this.timeout = null, this.timeoutValue = null, this.timeoutType = null, this.paused = !1;
    }
    onStatus(Y) {
      this.statusText = Y.toString();
    }
    onMessageBegin() {
      const { socket: Y, client: ee } = this;
      if (Y.destroyed)
        return -1;
      const K = ee[E][ee[I]];
      if (!K)
        return -1;
      K.onResponseStarted();
    }
    onHeaderField(Y) {
      const ee = this.headers.length;
      (ee & 1) === 0 ? this.headers.push(Y) : this.headers[ee - 1] = Buffer.concat([this.headers[ee - 1], Y]), this.trackHeader(Y.length);
    }
    onHeaderValue(Y) {
      let ee = this.headers.length;
      (ee & 1) === 1 ? (this.headers.push(Y), ee += 1) : this.headers[ee - 1] = Buffer.concat([this.headers[ee - 1], Y]);
      const K = this.headers[ee - 2];
      if (K.length === 10) {
        const te = t.bufferToLowerCasedHeaderName(K);
        te === "keep-alive" ? this.keepAlive += Y.toString() : te === "connection" && (this.connection += Y.toString());
      } else K.length === 14 && t.bufferToLowerCasedHeaderName(K) === "content-length" && (this.contentLength += Y.toString());
      this.trackHeader(Y.length);
    }
    trackHeader(Y) {
      this.headersSize += Y, this.headersSize >= this.headersMaxSize && t.destroy(this.socket, new u());
    }
    onUpgrade(Y) {
      const { upgrade: ee, client: K, socket: te, headers: Ee, statusCode: be } = this;
      e(ee), e(K[U] === te), e(!te.destroyed), e(!this.paused), e((Ee.length & 1) === 0);
      const Se = K[E][K[I]];
      e(Se), e(Se.upgrade || Se.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, te.unshift(Y), te[b].destroy(), te[b] = null, te[y] = null, te[m] = null, P(te), K[U] = null, K[X] = null, K[E][K[I]++] = null, K.emit("disconnect", K[B], [K], new i("upgrade"));
      try {
        Se.onUpgrade(be, Ee, te);
      } catch (T) {
        t.destroy(te, T);
      }
      K[we]();
    }
    onHeadersComplete(Y, ee, K) {
      const { client: te, socket: Ee, headers: be, statusText: Se } = this;
      if (Ee.destroyed)
        return -1;
      const T = te[E][te[I]];
      if (!T)
        return -1;
      if (e(!this.upgrade), e(this.statusCode < 200), Y === 100)
        return t.destroy(Ee, new l("bad response", t.getSocketInfo(Ee))), -1;
      if (ee && !T.upgrade)
        return t.destroy(Ee, new l("bad upgrade", t.getSocketInfo(Ee))), -1;
      if (e(this.timeoutType === de), this.statusCode = Y, this.shouldKeepAlive = K || // Override llhttp value which does not allow keepAlive for HEAD.
      T.method === "HEAD" && !Ee[d] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
        const k = T.bodyTimeout != null ? T.bodyTimeout : te[ge];
        this.setTimeout(k, We);
      } else this.timeout && this.timeout.refresh && this.timeout.refresh();
      if (T.method === "CONNECT")
        return e(te[M] === 1), this.upgrade = !0, 2;
      if (ee)
        return e(te[M] === 1), this.upgrade = !0, 2;
      if (e((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && te[D]) {
        const k = this.keepAlive ? t.parseKeepAliveTimeout(this.keepAlive) : null;
        if (k != null) {
          const O = Math.min(
            k - te[$],
            te[v]
          );
          O <= 0 ? Ee[d] = !0 : te[S] = O;
        } else
          te[S] = te[g];
      } else
        Ee[d] = !0;
      const x = T.onHeaders(Y, be, this.resume, Se) === !1;
      return T.aborted ? -1 : T.method === "HEAD" || Y < 200 ? 1 : (Ee[F] && (Ee[F] = !1, te[we]()), x ? W.ERROR.PAUSED : 0);
    }
    onBody(Y) {
      const { client: ee, socket: K, statusCode: te, maxResponseSize: Ee } = this;
      if (K.destroyed)
        return -1;
      const be = ee[E][ee[I]];
      if (e(be), e(this.timeoutType === We), this.timeout && this.timeout.refresh && this.timeout.refresh(), e(te >= 200), Ee > -1 && this.bytesRead + Y.length > Ee)
        return t.destroy(K, new h()), -1;
      if (this.bytesRead += Y.length, be.onData(Y) === !1)
        return W.ERROR.PAUSED;
    }
    onMessageComplete() {
      const { client: Y, socket: ee, statusCode: K, upgrade: te, headers: Ee, contentLength: be, bytesRead: Se, shouldKeepAlive: T } = this;
      if (ee.destroyed && (!K || T))
        return -1;
      if (te)
        return;
      e(K >= 100), e((this.headers.length & 1) === 0);
      const x = Y[E][Y[I]];
      if (e(x), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, !(K < 200)) {
        if (x.method !== "HEAD" && be && Se !== parseInt(be, 10))
          return t.destroy(ee, new n()), -1;
        if (x.onComplete(Ee), Y[E][Y[I]++] = null, ee[f])
          return e(Y[M] === 0), t.destroy(ee, new i("reset")), W.ERROR.PAUSED;
        if (T) {
          if (ee[d] && Y[M] === 0)
            return t.destroy(ee, new i("reset")), W.ERROR.PAUSED;
          Y[D] == null || Y[D] === 1 ? setImmediate(() => Y[we]()) : Y[we]();
        } else return t.destroy(ee, new i("reset")), W.ERROR.PAUSED;
      }
    }
  }
  function j(Ie) {
    const { socket: Y, timeoutType: ee, client: K, paused: te } = Ie.deref();
    ee === de ? (!Y[f] || Y.writableNeedDrain || K[M] > 1) && (e(!te, "cannot be paused while waiting for headers"), t.destroy(Y, new a())) : ee === We ? te || t.destroy(Y, new c()) : ee === _e && (e(K[M] === 0 && K[S]), t.destroy(Y, new i("socket idle timeout")));
  }
  async function R(Ie, Y) {
    Ie[U] = Y, le || (le = await oe, oe = null), Y[p] = !1, Y[f] = !1, Y[d] = !1, Y[F] = !1, Y[b] = new Je(Ie, Y, le), V(Y, "error", function(K) {
      e(K.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      const te = this[b];
      if (K.code === "ECONNRESET" && te.statusCode && !te.shouldKeepAlive) {
        te.onMessageComplete();
        return;
      }
      this[m] = K, this[y][ye](K);
    }), V(Y, "readable", function() {
      const K = this[b];
      K && K.readMore();
    }), V(Y, "end", function() {
      const K = this[b];
      if (K.statusCode && !K.shouldKeepAlive) {
        K.onMessageComplete();
        return;
      }
      t.destroy(this, new l("other side closed", t.getSocketInfo(this)));
    }), V(Y, "close", function() {
      const K = this[y], te = this[b];
      te && (!this[m] && te.statusCode && !te.shouldKeepAlive && te.onMessageComplete(), this[b].destroy(), this[b] = null);
      const Ee = this[m] || new l("closed", t.getSocketInfo(this));
      if (K[U] = null, K[X] = null, K.destroyed) {
        e(K[L] === 0);
        const be = K[E].splice(K[I]);
        for (let Se = 0; Se < be.length; Se++) {
          const T = be[Se];
          t.errorRequest(K, T, Ee);
        }
      } else if (K[M] > 0 && Ee.code !== "UND_ERR_INFO") {
        const be = K[E][K[I]];
        K[E][K[I]++] = null, t.errorRequest(K, be, Ee);
      }
      K[w] = K[I], e(K[M] === 0), K.emit("disconnect", K[B], [K], Ee), K[we]();
    });
    let ee = !1;
    return Y.on("close", () => {
      ee = !0;
    }), {
      version: "h1",
      defaultPipelining: 1,
      write(...K) {
        return ue(Ie, ...K);
      },
      resume() {
        q(Ie);
      },
      destroy(K, te) {
        ee ? queueMicrotask(te) : Y.destroy(K).on("close", te);
      },
      get destroyed() {
        return Y.destroyed;
      },
      busy(K) {
        return !!(Y[f] || Y[d] || Y[F] || K && (Ie[M] > 0 && !K.idempotent || Ie[M] > 0 && (K.upgrade || K.method === "CONNECT") || Ie[M] > 0 && t.bodyLength(K.body) !== 0 && (t.isStream(K.body) || t.isAsyncIterable(K.body) || t.isFormDataLike(K.body))));
      }
    };
  }
  function q(Ie) {
    const Y = Ie[U];
    if (Y && !Y.destroyed) {
      if (Ie[N] === 0 ? !Y[p] && Y.unref && (Y.unref(), Y[p] = !0) : Y[p] && Y.ref && (Y.ref(), Y[p] = !1), Ie[N] === 0)
        Y[b].timeoutType !== _e && Y[b].setTimeout(Ie[S], _e);
      else if (Ie[M] > 0 && Y[b].statusCode < 200 && Y[b].timeoutType !== de) {
        const ee = Ie[E][Ie[I]], K = ee.headersTimeout != null ? ee.headersTimeout : Ie[ne];
        Y[b].setTimeout(K, de);
      }
    }
  }
  function ie(Ie) {
    return Ie !== "GET" && Ie !== "HEAD" && Ie !== "OPTIONS" && Ie !== "TRACE" && Ie !== "CONNECT";
  }
  function ue(Ie, Y) {
    const { method: ee, path: K, host: te, upgrade: Ee, blocking: be, reset: Se } = Y;
    let { body: T, headers: x, contentLength: k } = Y;
    const O = ee === "PUT" || ee === "POST" || ee === "PATCH" || ee === "QUERY" || ee === "PROPFIND" || ee === "PROPPATCH";
    if (t.isFormDataLike(T)) {
      Z || (Z = $t().extractBody);
      const [ce, Fe] = Z(T);
      Y.contentType == null && x.push("content-type", Fe), T = ce.stream, k = ce.length;
    } else t.isBlobLike(T) && Y.contentType == null && T.type && x.push("content-type", T.type);
    T && typeof T.read == "function" && T.read(0);
    const H = t.bodyLength(T);
    if (k = H ?? k, k === null && (k = Y.contentLength), k === 0 && !O && (k = null), ie(ee) && k > 0 && Y.contentLength !== null && Y.contentLength !== k) {
      if (Ie[ae])
        return t.errorRequest(Ie, Y, new r()), !1;
      process.emitWarning(new r());
    }
    const _ = Ie[U], Ae = (ce) => {
      Y.aborted || Y.completed || (t.errorRequest(Ie, Y, ce || new o()), t.destroy(T), t.destroy(_, new i("aborted")));
    };
    try {
      Y.onConnect(Ae);
    } catch (ce) {
      t.errorRequest(Ie, Y, ce);
    }
    if (Y.aborted)
      return !1;
    ee === "HEAD" && (_[d] = !0), (Ee || ee === "CONNECT") && (_[d] = !0), Se != null && (_[d] = Se), Ie[Be] && _[he]++ >= Ie[Be] && (_[d] = !0), be && (_[F] = !0);
    let z = `${ee} ${K} HTTP/1.1\r
`;
    if (typeof te == "string" ? z += `host: ${te}\r
` : z += Ie[C], Ee ? z += `connection: upgrade\r
upgrade: ${Ee}\r
` : Ie[D] && !_[d] ? z += `connection: keep-alive\r
` : z += `connection: close\r
`, Array.isArray(x))
      for (let ce = 0; ce < x.length; ce += 2) {
        const Fe = x[ce + 0], Ge = x[ce + 1];
        if (Array.isArray(Ge))
          for (let Ne = 0; Ne < Ge.length; Ne++)
            z += `${Fe}: ${Ge[Ne]}\r
`;
        else
          z += `${Fe}: ${Ge}\r
`;
      }
    return A.sendHeaders.hasSubscribers && A.sendHeaders.publish({ request: Y, headers: z, socket: _ }), !T || H === 0 ? De(Ae, null, Ie, Y, _, k, z, O) : t.isBuffer(T) ? De(Ae, T, Ie, Y, _, k, z, O) : t.isBlobLike(T) ? typeof T.stream == "function" ? ze(Ae, T.stream(), Ie, Y, _, k, z, O) : ve(Ae, T, Ie, Y, _, k, z, O) : t.isStream(T) ? Ce(Ae, T, Ie, Y, _, k, z, O) : t.isIterable(T) ? ze(Ae, T, Ie, Y, _, k, z, O) : e(!1), !0;
  }
  function Ce(Ie, Y, ee, K, te, Ee, be, Se) {
    e(Ee !== 0 || ee[M] === 0, "stream body cannot be pipelined");
    let T = !1;
    const x = new Ke({ abort: Ie, socket: te, request: K, contentLength: Ee, client: ee, expectsPayload: Se, header: be }), k = function(Ae) {
      if (!T)
        try {
          !x.write(Ae) && this.pause && this.pause();
        } catch (z) {
          t.destroy(this, z);
        }
    }, O = function() {
      T || Y.resume && Y.resume();
    }, H = function() {
      if (queueMicrotask(() => {
        Y.removeListener("error", _);
      }), !T) {
        const Ae = new o();
        queueMicrotask(() => _(Ae));
      }
    }, _ = function(Ae) {
      if (!T) {
        if (T = !0, e(te.destroyed || te[f] && ee[M] <= 1), te.off("drain", O).off("error", _), Y.removeListener("data", k).removeListener("end", _).removeListener("close", H), !Ae)
          try {
            x.end();
          } catch (z) {
            Ae = z;
          }
        x.destroy(Ae), Ae && (Ae.code !== "UND_ERR_INFO" || Ae.message !== "reset") ? t.destroy(Y, Ae) : t.destroy(Y);
      }
    };
    Y.on("data", k).on("end", _).on("error", _).on("close", H), Y.resume && Y.resume(), te.on("drain", O).on("error", _), Y.errorEmitted ?? Y.errored ? setImmediate(() => _(Y.errored)) : (Y.endEmitted ?? Y.readableEnded) && setImmediate(() => _(null)), (Y.closeEmitted ?? Y.closed) && setImmediate(H);
  }
  function De(Ie, Y, ee, K, te, Ee, be, Se) {
    try {
      Y ? t.isBuffer(Y) && (e(Ee === Y.byteLength, "buffer body must have content length"), te.cork(), te.write(`${be}content-length: ${Ee}\r
\r
`, "latin1"), te.write(Y), te.uncork(), K.onBodySent(Y), !Se && K.reset !== !1 && (te[d] = !0)) : Ee === 0 ? te.write(`${be}content-length: 0\r
\r
`, "latin1") : (e(Ee === null, "no body must not have content length"), te.write(`${be}\r
`, "latin1")), K.onRequestSent(), ee[we]();
    } catch (T) {
      Ie(T);
    }
  }
  async function ve(Ie, Y, ee, K, te, Ee, be, Se) {
    e(Ee === Y.size, "blob body must have content length");
    try {
      if (Ee != null && Ee !== Y.size)
        throw new r();
      const T = Buffer.from(await Y.arrayBuffer());
      te.cork(), te.write(`${be}content-length: ${Ee}\r
\r
`, "latin1"), te.write(T), te.uncork(), K.onBodySent(T), K.onRequestSent(), !Se && K.reset !== !1 && (te[d] = !0), ee[we]();
    } catch (T) {
      Ie(T);
    }
  }
  async function ze(Ie, Y, ee, K, te, Ee, be, Se) {
    e(Ee !== 0 || ee[M] === 0, "iterator body cannot be pipelined");
    let T = null;
    function x() {
      if (T) {
        const H = T;
        T = null, H();
      }
    }
    const k = () => new Promise((H, _) => {
      e(T === null), te[m] ? _(te[m]) : T = H;
    });
    te.on("close", x).on("drain", x);
    const O = new Ke({ abort: Ie, socket: te, request: K, contentLength: Ee, client: ee, expectsPayload: Se, header: be });
    try {
      for await (const H of Y) {
        if (te[m])
          throw te[m];
        O.write(H) || await k();
      }
      O.end();
    } catch (H) {
      O.destroy(H);
    } finally {
      te.off("close", x).off("drain", x);
    }
  }
  class Ke {
    constructor({ abort: Y, socket: ee, request: K, contentLength: te, client: Ee, expectsPayload: be, header: Se }) {
      this.socket = ee, this.request = K, this.contentLength = te, this.client = Ee, this.bytesWritten = 0, this.expectsPayload = be, this.header = Se, this.abort = Y, ee[f] = !0;
    }
    write(Y) {
      const { socket: ee, request: K, contentLength: te, client: Ee, bytesWritten: be, expectsPayload: Se, header: T } = this;
      if (ee[m])
        throw ee[m];
      if (ee.destroyed)
        return !1;
      const x = Buffer.byteLength(Y);
      if (!x)
        return !0;
      if (te !== null && be + x > te) {
        if (Ee[ae])
          throw new r();
        process.emitWarning(new r());
      }
      ee.cork(), be === 0 && (!Se && K.reset !== !1 && (ee[d] = !0), te === null ? ee.write(`${T}transfer-encoding: chunked\r
`, "latin1") : ee.write(`${T}content-length: ${te}\r
\r
`, "latin1")), te === null && ee.write(`\r
${x.toString(16)}\r
`, "latin1"), this.bytesWritten += x;
      const k = ee.write(Y);
      return ee.uncork(), K.onBodySent(Y), k || ee[b].timeout && ee[b].timeoutType === de && ee[b].timeout.refresh && ee[b].timeout.refresh(), k;
    }
    end() {
      const { socket: Y, contentLength: ee, client: K, bytesWritten: te, expectsPayload: Ee, header: be, request: Se } = this;
      if (Se.onRequestSent(), Y[f] = !1, Y[m])
        throw Y[m];
      if (!Y.destroyed) {
        if (te === 0 ? Ee ? Y.write(`${be}content-length: 0\r
\r
`, "latin1") : Y.write(`${be}\r
`, "latin1") : ee === null && Y.write(`\r
0\r
\r
`, "latin1"), ee !== null && te !== ee) {
          if (K[ae])
            throw new r();
          process.emitWarning(new r());
        }
        Y[b].timeout && Y[b].timeoutType === de && Y[b].timeout.refresh && Y[b].timeout.refresh(), K[we]();
      }
    }
    destroy(Y) {
      const { socket: ee, client: K, abort: te } = this;
      ee[f] = !1, Y && (e(K[M] <= 1, "pipeline should only contain this request"), te(Y));
    }
  }
  return yr = R, yr;
}
var Dr, Io;
function Ig() {
  if (Io) return Dr;
  Io = 1;
  const e = He, { pipeline: t } = ot, A = Ue(), {
    RequestContentLengthMismatchError: s,
    RequestAbortedError: r,
    SocketError: n,
    InformationalError: o
  } = Ye(), {
    kUrl: a,
    kReset: u,
    kClient: l,
    kRunning: i,
    kPending: c,
    kQueue: Q,
    kPendingIdx: h,
    kRunningIdx: B,
    kError: d,
    kSocket: y,
    kStrictContentLength: b,
    kOnError: F,
    kMaxConcurrentStreams: M,
    kHTTP2Session: L,
    kResume: N,
    kSize: f,
    kHTTPContext: E
  } = Ve(), p = /* @__PURE__ */ Symbol("open streams");
  let g, C = !1, w;
  try {
    w = require("node:http2");
  } catch {
    w = { constants: {} };
  }
  const {
    constants: {
      HTTP2_HEADER_AUTHORITY: I,
      HTTP2_HEADER_METHOD: m,
      HTTP2_HEADER_PATH: D,
      HTTP2_HEADER_SCHEME: U,
      HTTP2_HEADER_CONTENT_LENGTH: S,
      HTTP2_HEADER_EXPECT: G,
      HTTP2_HEADER_STATUS: v
    }
  } = w;
  function $(V) {
    const P = [];
    for (const [Z, se] of Object.entries(V))
      if (Array.isArray(se))
        for (const le of se)
          P.push(Buffer.from(Z), Buffer.from(le));
      else
        P.push(Buffer.from(Z), Buffer.from(se));
    return P;
  }
  async function ne(V, P) {
    V[y] = P, C || (C = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
      code: "UNDICI-H2"
    }));
    const Z = w.connect(V[a], {
      createConnection: () => P,
      peerMaxConcurrentStreams: V[M]
    });
    Z[p] = 0, Z[l] = V, Z[y] = P, A.addListener(Z, "error", ae), A.addListener(Z, "frameError", Be), A.addListener(Z, "end", he), A.addListener(Z, "goaway", Qe), A.addListener(Z, "close", function() {
      const { [l]: le } = this, { [y]: oe } = le, fe = this[y][d] || this[d] || new n("closed", A.getSocketInfo(oe));
      if (le[L] = null, le.destroyed) {
        e(le[c] === 0);
        const Me = le[Q].splice(le[B]);
        for (let pe = 0; pe < Me.length; pe++) {
          const Le = Me[pe];
          A.errorRequest(le, Le, fe);
        }
      }
    }), Z.unref(), V[L] = Z, P[L] = Z, A.addListener(P, "error", function(le) {
      e(le.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[d] = le, this[l][F](le);
    }), A.addListener(P, "end", function() {
      A.destroy(this, new n("other side closed", A.getSocketInfo(this)));
    }), A.addListener(P, "close", function() {
      const le = this[d] || new n("closed", A.getSocketInfo(this));
      V[y] = null, this[L] != null && this[L].destroy(le), V[h] = V[B], e(V[i] === 0), V.emit("disconnect", V[a], [V], le), V[N]();
    });
    let se = !1;
    return P.on("close", () => {
      se = !0;
    }), {
      version: "h2",
      defaultPipelining: 1 / 0,
      write(...le) {
        return we(V, ...le);
      },
      resume() {
        ge(V);
      },
      destroy(le, oe) {
        se ? queueMicrotask(oe) : P.destroy(le).on("close", oe);
      },
      get destroyed() {
        return P.destroyed;
      },
      busy() {
        return !1;
      }
    };
  }
  function ge(V) {
    const P = V[y];
    P?.destroyed === !1 && (V[f] === 0 && V[M] === 0 ? (P.unref(), V[L].unref()) : (P.ref(), V[L].ref()));
  }
  function ae(V) {
    e(V.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[y][d] = V, this[l][F](V);
  }
  function Be(V, P, Z) {
    if (Z === 0) {
      const se = new o(`HTTP/2: "frameError" received - type ${V}, code ${P}`);
      this[y][d] = se, this[l][F](se);
    }
  }
  function he() {
    const V = new n("other side closed", A.getSocketInfo(this[y]));
    this.destroy(V), A.destroy(this[y], V);
  }
  function Qe(V) {
    const P = this[d] || new n(`HTTP/2: "GOAWAY" frame received with code ${V}`, A.getSocketInfo(this)), Z = this[l];
    if (Z[y] = null, Z[E] = null, this[L] != null && (this[L].destroy(P), this[L] = null), A.destroy(this[y], P), Z[B] < Z[Q].length) {
      const se = Z[Q][Z[B]];
      Z[Q][Z[B]++] = null, A.errorRequest(Z, se, P), Z[h] = Z[B];
    }
    e(Z[i] === 0), Z.emit("disconnect", Z[a], [Z], P), Z[N]();
  }
  function ye(V) {
    return V !== "GET" && V !== "HEAD" && V !== "OPTIONS" && V !== "TRACE" && V !== "CONNECT";
  }
  function we(V, P) {
    const Z = V[L], { method: se, path: le, host: oe, upgrade: fe, expectContinue: Me, signal: pe, headers: Le } = P;
    let { body: Re } = P;
    if (fe)
      return A.errorRequest(V, P, new Error("Upgrade not supported for H2")), !1;
    const ke = {};
    for (let ue = 0; ue < Le.length; ue += 2) {
      const Ce = Le[ue + 0], De = Le[ue + 1];
      if (Array.isArray(De))
        for (let ve = 0; ve < De.length; ve++)
          ke[Ce] ? ke[Ce] += `,${De[ve]}` : ke[Ce] = De[ve];
      else
        ke[Ce] = De;
    }
    let de;
    const { hostname: We, port: _e } = V[a];
    ke[I] = oe || `${We}${_e ? `:${_e}` : ""}`, ke[m] = se;
    const Je = (ue) => {
      P.aborted || P.completed || (ue = ue || new r(), A.errorRequest(V, P, ue), de != null && A.destroy(de, ue), A.destroy(Re, ue), V[Q][V[B]++] = null, V[N]());
    };
    try {
      P.onConnect(Je);
    } catch (ue) {
      A.errorRequest(V, P, ue);
    }
    if (P.aborted)
      return !1;
    if (se === "CONNECT")
      return Z.ref(), de = Z.request(ke, { endStream: !1, signal: pe }), de.id && !de.pending ? (P.onUpgrade(null, null, de), ++Z[p], V[Q][V[B]++] = null) : de.once("ready", () => {
        P.onUpgrade(null, null, de), ++Z[p], V[Q][V[B]++] = null;
      }), de.once("close", () => {
        Z[p] -= 1, Z[p] === 0 && Z.unref();
      }), !0;
    ke[D] = le, ke[U] = "https";
    const j = se === "PUT" || se === "POST" || se === "PATCH";
    Re && typeof Re.read == "function" && Re.read(0);
    let R = A.bodyLength(Re);
    if (A.isFormDataLike(Re)) {
      g ??= $t().extractBody;
      const [ue, Ce] = g(Re);
      ke["content-type"] = Ce, Re = ue.stream, R = ue.length;
    }
    if (R == null && (R = P.contentLength), (R === 0 || !j) && (R = null), ye(se) && R > 0 && P.contentLength != null && P.contentLength !== R) {
      if (V[b])
        return A.errorRequest(V, P, new s()), !1;
      process.emitWarning(new s());
    }
    R != null && (e(Re, "no body must not have content length"), ke[S] = `${R}`), Z.ref();
    const q = se === "GET" || se === "HEAD" || Re === null;
    return Me ? (ke[G] = "100-continue", de = Z.request(ke, { endStream: q, signal: pe }), de.once("continue", ie)) : (de = Z.request(ke, {
      endStream: q,
      signal: pe
    }), ie()), ++Z[p], de.once("response", (ue) => {
      const { [v]: Ce, ...De } = ue;
      if (P.onResponseStarted(), P.aborted) {
        const ve = new r();
        A.errorRequest(V, P, ve), A.destroy(de, ve);
        return;
      }
      P.onHeaders(Number(Ce), $(De), de.resume.bind(de), "") === !1 && de.pause(), de.on("data", (ve) => {
        P.onData(ve) === !1 && de.pause();
      });
    }), de.once("end", () => {
      (de.state?.state == null || de.state.state < 6) && P.onComplete([]), Z[p] === 0 && Z.unref(), Je(new o("HTTP/2: stream half-closed (remote)")), V[Q][V[B]++] = null, V[h] = V[B], V[N]();
    }), de.once("close", () => {
      Z[p] -= 1, Z[p] === 0 && Z.unref();
    }), de.once("error", function(ue) {
      Je(ue);
    }), de.once("frameError", (ue, Ce) => {
      Je(new o(`HTTP/2: "frameError" received - type ${ue}, code ${Ce}`));
    }), !0;
    function ie() {
      !Re || R === 0 ? X(
        Je,
        de,
        null,
        V,
        P,
        V[y],
        R,
        j
      ) : A.isBuffer(Re) ? X(
        Je,
        de,
        Re,
        V,
        P,
        V[y],
        R,
        j
      ) : A.isBlobLike(Re) ? typeof Re.stream == "function" ? J(
        Je,
        de,
        Re.stream(),
        V,
        P,
        V[y],
        R,
        j
      ) : re(
        Je,
        de,
        Re,
        V,
        P,
        V[y],
        R,
        j
      ) : A.isStream(Re) ? W(
        Je,
        V[y],
        j,
        de,
        Re,
        V,
        P,
        R
      ) : A.isIterable(Re) ? J(
        Je,
        de,
        Re,
        V,
        P,
        V[y],
        R,
        j
      ) : e(!1);
    }
  }
  function X(V, P, Z, se, le, oe, fe, Me) {
    try {
      Z != null && A.isBuffer(Z) && (e(fe === Z.byteLength, "buffer body must have content length"), P.cork(), P.write(Z), P.uncork(), P.end(), le.onBodySent(Z)), Me || (oe[u] = !0), le.onRequestSent(), se[N]();
    } catch (pe) {
      V(pe);
    }
  }
  function W(V, P, Z, se, le, oe, fe, Me) {
    e(Me !== 0 || oe[i] === 0, "stream body cannot be pipelined");
    const pe = t(
      le,
      se,
      (Re) => {
        Re ? (A.destroy(pe, Re), V(Re)) : (A.removeAllListeners(pe), fe.onRequestSent(), Z || (P[u] = !0), oe[N]());
      }
    );
    A.addListener(pe, "data", Le);
    function Le(Re) {
      fe.onBodySent(Re);
    }
  }
  async function re(V, P, Z, se, le, oe, fe, Me) {
    e(fe === Z.size, "blob body must have content length");
    try {
      if (fe != null && fe !== Z.size)
        throw new s();
      const pe = Buffer.from(await Z.arrayBuffer());
      P.cork(), P.write(pe), P.uncork(), P.end(), le.onBodySent(pe), le.onRequestSent(), Me || (oe[u] = !0), se[N]();
    } catch (pe) {
      V(pe);
    }
  }
  async function J(V, P, Z, se, le, oe, fe, Me) {
    e(fe !== 0 || se[i] === 0, "iterator body cannot be pipelined");
    let pe = null;
    function Le() {
      if (pe) {
        const ke = pe;
        pe = null, ke();
      }
    }
    const Re = () => new Promise((ke, de) => {
      e(pe === null), oe[d] ? de(oe[d]) : pe = ke;
    });
    P.on("close", Le).on("drain", Le);
    try {
      for await (const ke of Z) {
        if (oe[d])
          throw oe[d];
        const de = P.write(ke);
        le.onBodySent(ke), de || await Re();
      }
      P.end(), le.onRequestSent(), Me || (oe[u] = !0), se[N]();
    } catch (ke) {
      V(ke);
    } finally {
      P.off("close", Le).off("drain", Le);
    }
  }
  return Dr = ne, Dr;
}
var br, fo;
function Rr() {
  if (fo) return br;
  fo = 1;
  const e = Ue(), { kBodyUsed: t } = Ve(), A = He, { InvalidArgumentError: s } = Ye(), r = Wt, n = [300, 301, 302, 303, 307, 308], o = /* @__PURE__ */ Symbol("body");
  class a {
    constructor(h) {
      this[o] = h, this[t] = !1;
    }
    async *[Symbol.asyncIterator]() {
      A(!this[t], "disturbed"), this[t] = !0, yield* this[o];
    }
  }
  class u {
    constructor(h, B, d, y) {
      if (B != null && (!Number.isInteger(B) || B < 0))
        throw new s("maxRedirections must be a positive number");
      e.validateHandler(y, d.method, d.upgrade), this.dispatch = h, this.location = null, this.abort = null, this.opts = { ...d, maxRedirections: 0 }, this.maxRedirections = B, this.handler = y, this.history = [], this.redirectionLimitReached = !1, e.isStream(this.opts.body) ? (e.bodyLength(this.opts.body) === 0 && this.opts.body.on("data", function() {
        A(!1);
      }), typeof this.opts.body.readableDidRead != "boolean" && (this.opts.body[t] = !1, r.prototype.on.call(this.opts.body, "data", function() {
        this[t] = !0;
      }))) : this.opts.body && typeof this.opts.body.pipeTo == "function" ? this.opts.body = new a(this.opts.body) : this.opts.body && typeof this.opts.body != "string" && !ArrayBuffer.isView(this.opts.body) && e.isIterable(this.opts.body) && (this.opts.body = new a(this.opts.body));
    }
    onConnect(h) {
      this.abort = h, this.handler.onConnect(h, { history: this.history });
    }
    onUpgrade(h, B, d) {
      this.handler.onUpgrade(h, B, d);
    }
    onError(h) {
      this.handler.onError(h);
    }
    onHeaders(h, B, d, y) {
      if (this.location = this.history.length >= this.maxRedirections || e.isDisturbed(this.opts.body) ? null : l(h, B), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
        this.request && this.request.abort(new Error("max redirects")), this.redirectionLimitReached = !0, this.abort(new Error("max redirects"));
        return;
      }
      if (this.opts.origin && this.history.push(new URL(this.opts.path, this.opts.origin)), !this.location)
        return this.handler.onHeaders(h, B, d, y);
      const { origin: b, pathname: F, search: M } = e.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), L = M ? `${F}${M}` : F;
      this.opts.headers = c(this.opts.headers, h === 303, this.opts.origin !== b), this.opts.path = L, this.opts.origin = b, this.opts.maxRedirections = 0, this.opts.query = null, h === 303 && this.opts.method !== "HEAD" && (this.opts.method = "GET", this.opts.body = null);
    }
    onData(h) {
      if (!this.location) return this.handler.onData(h);
    }
    onComplete(h) {
      this.location ? (this.location = null, this.abort = null, this.dispatch(this.opts, this)) : this.handler.onComplete(h);
    }
    onBodySent(h) {
      this.handler.onBodySent && this.handler.onBodySent(h);
    }
  }
  function l(Q, h) {
    if (n.indexOf(Q) === -1)
      return null;
    for (let B = 0; B < h.length; B += 2)
      if (h[B].length === 8 && e.headerNameToString(h[B]) === "location")
        return h[B + 1];
  }
  function i(Q, h, B) {
    if (Q.length === 4)
      return e.headerNameToString(Q) === "host";
    if (h && e.headerNameToString(Q).startsWith("content-"))
      return !0;
    if (B && (Q.length === 13 || Q.length === 6 || Q.length === 19)) {
      const d = e.headerNameToString(Q);
      return d === "authorization" || d === "cookie" || d === "proxy-authorization";
    }
    return !1;
  }
  function c(Q, h, B) {
    const d = [];
    if (Array.isArray(Q))
      for (let y = 0; y < Q.length; y += 2)
        i(Q[y], h, B) || d.push(Q[y], Q[y + 1]);
    else if (Q && typeof Q == "object")
      for (const y of Object.keys(Q))
        i(y, h, B) || d.push(y, Q[y]);
    else
      A(Q == null, "headers must be an object or an array");
    return d;
  }
  return br = u, br;
}
var kr, po;
function Fr() {
  if (po) return kr;
  po = 1;
  const e = Rr();
  function t({ maxRedirections: A }) {
    return (s) => function(n, o) {
      const { maxRedirections: a = A } = n;
      if (!a)
        return s(n, o);
      const u = new e(s, a, n, o);
      return n = { ...n, maxRedirections: 0 }, s(n, u);
    };
  }
  return kr = t, kr;
}
var Tr, wo;
function eA() {
  if (wo) return Tr;
  wo = 1;
  const e = He, t = dA, A = fA, s = Ue(), { channels: r } = Kt(), n = ug(), o = jt(), {
    InvalidArgumentError: a,
    InformationalError: u,
    ClientDestroyedError: l
  } = Ye(), i = mA(), {
    kUrl: c,
    kServerName: Q,
    kClient: h,
    kBusy: B,
    kConnect: d,
    kResuming: y,
    kRunning: b,
    kPending: F,
    kSize: M,
    kQueue: L,
    kConnected: N,
    kConnecting: f,
    kNeedDrain: E,
    kKeepAliveDefaultTimeout: p,
    kHostHeader: g,
    kPendingIdx: C,
    kRunningIdx: w,
    kError: I,
    kPipelining: m,
    kKeepAliveTimeoutValue: D,
    kMaxHeadersSize: U,
    kKeepAliveMaxTimeout: S,
    kKeepAliveTimeoutThreshold: G,
    kHeadersTimeout: v,
    kBodyTimeout: $,
    kStrictContentLength: ne,
    kConnector: ge,
    kMaxRedirections: ae,
    kMaxRequests: Be,
    kCounter: he,
    kClose: Qe,
    kDestroy: ye,
    kDispatch: we,
    kInterceptors: X,
    kLocalAddress: W,
    kMaxResponseSize: re,
    kOnError: J,
    kHTTPContext: V,
    kMaxConcurrentStreams: P,
    kResume: Z
  } = Ve(), se = Cg(), le = Ig();
  let oe = !1;
  const fe = /* @__PURE__ */ Symbol("kClosedResolve"), Me = () => {
  };
  function pe(j) {
    return j[m] ?? j[V]?.defaultPipelining ?? 1;
  }
  class Le extends o {
    /**
     *
     * @param {string|URL} url
     * @param {import('../../types/client.js').Client.Options} options
     */
    constructor(R, {
      interceptors: q,
      maxHeaderSize: ie,
      headersTimeout: ue,
      socketTimeout: Ce,
      requestTimeout: De,
      connectTimeout: ve,
      bodyTimeout: ze,
      idleTimeout: Ke,
      keepAlive: Ie,
      keepAliveTimeout: Y,
      maxKeepAliveTimeout: ee,
      keepAliveMaxTimeout: K,
      keepAliveTimeoutThreshold: te,
      socketPath: Ee,
      pipelining: be,
      tls: Se,
      strictContentLength: T,
      maxCachedSessions: x,
      maxRedirections: k,
      connect: O,
      maxRequestsPerClient: H,
      localAddress: _,
      maxResponseSize: Ae,
      autoSelectFamily: z,
      autoSelectFamilyAttemptTimeout: ce,
      // h2
      maxConcurrentStreams: Fe,
      allowH2: Ge
    } = {}) {
      if (super(), Ie !== void 0)
        throw new a("unsupported keepAlive, use pipelining=0 instead");
      if (Ce !== void 0)
        throw new a("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");
      if (De !== void 0)
        throw new a("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");
      if (Ke !== void 0)
        throw new a("unsupported idleTimeout, use keepAliveTimeout instead");
      if (ee !== void 0)
        throw new a("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");
      if (ie != null && !Number.isFinite(ie))
        throw new a("invalid maxHeaderSize");
      if (Ee != null && typeof Ee != "string")
        throw new a("invalid socketPath");
      if (ve != null && (!Number.isFinite(ve) || ve < 0))
        throw new a("invalid connectTimeout");
      if (Y != null && (!Number.isFinite(Y) || Y <= 0))
        throw new a("invalid keepAliveTimeout");
      if (K != null && (!Number.isFinite(K) || K <= 0))
        throw new a("invalid keepAliveMaxTimeout");
      if (te != null && !Number.isFinite(te))
        throw new a("invalid keepAliveTimeoutThreshold");
      if (ue != null && (!Number.isInteger(ue) || ue < 0))
        throw new a("headersTimeout must be a positive integer or zero");
      if (ze != null && (!Number.isInteger(ze) || ze < 0))
        throw new a("bodyTimeout must be a positive integer or zero");
      if (O != null && typeof O != "function" && typeof O != "object")
        throw new a("connect must be a function or an object");
      if (k != null && (!Number.isInteger(k) || k < 0))
        throw new a("maxRedirections must be a positive number");
      if (H != null && (!Number.isInteger(H) || H < 0))
        throw new a("maxRequestsPerClient must be a positive number");
      if (_ != null && (typeof _ != "string" || t.isIP(_) === 0))
        throw new a("localAddress must be valid string IP address");
      if (Ae != null && (!Number.isInteger(Ae) || Ae < -1))
        throw new a("maxResponseSize must be a positive number");
      if (ce != null && (!Number.isInteger(ce) || ce < -1))
        throw new a("autoSelectFamilyAttemptTimeout must be a positive number");
      if (Ge != null && typeof Ge != "boolean")
        throw new a("allowH2 must be a valid boolean value");
      if (Fe != null && (typeof Fe != "number" || Fe < 1))
        throw new a("maxConcurrentStreams must be a positive integer, greater than 0");
      typeof O != "function" && (O = i({
        ...Se,
        maxCachedSessions: x,
        allowH2: Ge,
        socketPath: Ee,
        timeout: ve,
        ...z ? { autoSelectFamily: z, autoSelectFamilyAttemptTimeout: ce } : void 0,
        ...O
      })), q?.Client && Array.isArray(q.Client) ? (this[X] = q.Client, oe || (oe = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
        code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
      }))) : this[X] = [Re({ maxRedirections: k })], this[c] = s.parseOrigin(R), this[ge] = O, this[m] = be ?? 1, this[U] = ie || A.maxHeaderSize, this[p] = Y ?? 4e3, this[S] = K ?? 6e5, this[G] = te ?? 2e3, this[D] = this[p], this[Q] = null, this[W] = _ ?? null, this[y] = 0, this[E] = 0, this[g] = `host: ${this[c].hostname}${this[c].port ? `:${this[c].port}` : ""}\r
`, this[$] = ze ?? 3e5, this[v] = ue ?? 3e5, this[ne] = T ?? !0, this[ae] = k, this[Be] = H, this[fe] = null, this[re] = Ae > -1 ? Ae : -1, this[P] = Fe ?? 100, this[V] = null, this[L] = [], this[w] = 0, this[C] = 0, this[Z] = (Ne) => _e(this, Ne), this[J] = (Ne) => ke(this, Ne);
    }
    get pipelining() {
      return this[m];
    }
    set pipelining(R) {
      this[m] = R, this[Z](!0);
    }
    get [F]() {
      return this[L].length - this[C];
    }
    get [b]() {
      return this[C] - this[w];
    }
    get [M]() {
      return this[L].length - this[w];
    }
    get [N]() {
      return !!this[V] && !this[f] && !this[V].destroyed;
    }
    get [B]() {
      return !!(this[V]?.busy(null) || this[M] >= (pe(this) || 1) || this[F] > 0);
    }
    /* istanbul ignore: only used for test */
    [d](R) {
      de(this), this.once("connect", R);
    }
    [we](R, q) {
      const ie = R.origin || this[c].origin, ue = new n(ie, R, q);
      return this[L].push(ue), this[y] || (s.bodyLength(ue.body) == null && s.isIterable(ue.body) ? (this[y] = 1, queueMicrotask(() => _e(this))) : this[Z](!0)), this[y] && this[E] !== 2 && this[B] && (this[E] = 2), this[E] < 2;
    }
    async [Qe]() {
      return new Promise((R) => {
        this[M] ? this[fe] = R : R(null);
      });
    }
    async [ye](R) {
      return new Promise((q) => {
        const ie = this[L].splice(this[C]);
        for (let Ce = 0; Ce < ie.length; Ce++) {
          const De = ie[Ce];
          s.errorRequest(this, De, R);
        }
        const ue = () => {
          this[fe] && (this[fe](), this[fe] = null), q(null);
        };
        this[V] ? (this[V].destroy(R, ue), this[V] = null) : queueMicrotask(ue), this[Z]();
      });
    }
  }
  const Re = Fr();
  function ke(j, R) {
    if (j[b] === 0 && R.code !== "UND_ERR_INFO" && R.code !== "UND_ERR_SOCKET") {
      e(j[C] === j[w]);
      const q = j[L].splice(j[w]);
      for (let ie = 0; ie < q.length; ie++) {
        const ue = q[ie];
        s.errorRequest(j, ue, R);
      }
      e(j[M] === 0);
    }
  }
  async function de(j) {
    e(!j[f]), e(!j[V]);
    let { host: R, hostname: q, protocol: ie, port: ue } = j[c];
    if (q[0] === "[") {
      const Ce = q.indexOf("]");
      e(Ce !== -1);
      const De = q.substring(1, Ce);
      e(t.isIP(De)), q = De;
    }
    j[f] = !0, r.beforeConnect.hasSubscribers && r.beforeConnect.publish({
      connectParams: {
        host: R,
        hostname: q,
        protocol: ie,
        port: ue,
        version: j[V]?.version,
        servername: j[Q],
        localAddress: j[W]
      },
      connector: j[ge]
    });
    try {
      const Ce = await new Promise((De, ve) => {
        j[ge]({
          host: R,
          hostname: q,
          protocol: ie,
          port: ue,
          servername: j[Q],
          localAddress: j[W]
        }, (ze, Ke) => {
          ze ? ve(ze) : De(Ke);
        });
      });
      if (j.destroyed) {
        s.destroy(Ce.on("error", Me), new l());
        return;
      }
      e(Ce);
      try {
        j[V] = Ce.alpnProtocol === "h2" ? await le(j, Ce) : await se(j, Ce);
      } catch (De) {
        throw Ce.destroy().on("error", Me), De;
      }
      j[f] = !1, Ce[he] = 0, Ce[Be] = j[Be], Ce[h] = j, Ce[I] = null, r.connected.hasSubscribers && r.connected.publish({
        connectParams: {
          host: R,
          hostname: q,
          protocol: ie,
          port: ue,
          version: j[V]?.version,
          servername: j[Q],
          localAddress: j[W]
        },
        connector: j[ge],
        socket: Ce
      }), j.emit("connect", j[c], [j]);
    } catch (Ce) {
      if (j.destroyed)
        return;
      if (j[f] = !1, r.connectError.hasSubscribers && r.connectError.publish({
        connectParams: {
          host: R,
          hostname: q,
          protocol: ie,
          port: ue,
          version: j[V]?.version,
          servername: j[Q],
          localAddress: j[W]
        },
        connector: j[ge],
        error: Ce
      }), Ce.code === "ERR_TLS_CERT_ALTNAME_INVALID")
        for (e(j[b] === 0); j[F] > 0 && j[L][j[C]].servername === j[Q]; ) {
          const De = j[L][j[C]++];
          s.errorRequest(j, De, Ce);
        }
      else
        ke(j, Ce);
      j.emit("connectionError", j[c], [j], Ce);
    }
    j[Z]();
  }
  function We(j) {
    j[E] = 0, j.emit("drain", j[c], [j]);
  }
  function _e(j, R) {
    j[y] !== 2 && (j[y] = 2, Je(j, R), j[y] = 0, j[w] > 256 && (j[L].splice(0, j[w]), j[C] -= j[w], j[w] = 0));
  }
  function Je(j, R) {
    for (; ; ) {
      if (j.destroyed) {
        e(j[F] === 0);
        return;
      }
      if (j[fe] && !j[M]) {
        j[fe](), j[fe] = null;
        return;
      }
      if (j[V] && j[V].resume(), j[B])
        j[E] = 2;
      else if (j[E] === 2) {
        R ? (j[E] = 1, queueMicrotask(() => We(j))) : We(j);
        continue;
      }
      if (j[F] === 0 || j[b] >= (pe(j) || 1))
        return;
      const q = j[L][j[C]];
      if (j[c].protocol === "https:" && j[Q] !== q.servername) {
        if (j[b] > 0)
          return;
        j[Q] = q.servername, j[V]?.destroy(new u("servername changed"), () => {
          j[V] = null, _e(j);
        });
      }
      if (j[f])
        return;
      if (!j[V]) {
        de(j);
        return;
      }
      if (j[V].destroyed || j[V].busy(q))
        return;
      !q.aborted && j[V].write(q) ? j[C]++ : j[L].splice(j[C], 1);
    }
  }
  return Tr = Le, Tr;
}
var Sr, mo;
function yo() {
  if (mo) return Sr;
  mo = 1;
  const e = 2048, t = e - 1;
  class A {
    constructor() {
      this.bottom = 0, this.top = 0, this.list = new Array(e), this.next = null;
    }
    isEmpty() {
      return this.top === this.bottom;
    }
    isFull() {
      return (this.top + 1 & t) === this.bottom;
    }
    push(r) {
      this.list[this.top] = r, this.top = this.top + 1 & t;
    }
    shift() {
      const r = this.list[this.bottom];
      return r === void 0 ? null : (this.list[this.bottom] = void 0, this.bottom = this.bottom + 1 & t, r);
    }
  }
  return Sr = class {
    constructor() {
      this.head = this.tail = new A();
    }
    isEmpty() {
      return this.head.isEmpty();
    }
    push(r) {
      this.head.isFull() && (this.head = this.head.next = new A()), this.head.push(r);
    }
    shift() {
      const r = this.tail, n = r.shift();
      return r.isEmpty() && r.next !== null && (this.tail = r.next), n;
    }
  }, Sr;
}
var Ur, Do;
function dg() {
  if (Do) return Ur;
  Do = 1;
  const { kFree: e, kConnected: t, kPending: A, kQueued: s, kRunning: r, kSize: n } = Ve(), o = /* @__PURE__ */ Symbol("pool");
  class a {
    constructor(l) {
      this[o] = l;
    }
    get connected() {
      return this[o][t];
    }
    get free() {
      return this[o][e];
    }
    get pending() {
      return this[o][A];
    }
    get queued() {
      return this[o][s];
    }
    get running() {
      return this[o][r];
    }
    get size() {
      return this[o][n];
    }
  }
  return Ur = a, Ur;
}
var Nr, bo;
function Ro() {
  if (bo) return Nr;
  bo = 1;
  const e = jt(), t = yo(), { kConnected: A, kSize: s, kRunning: r, kPending: n, kQueued: o, kBusy: a, kFree: u, kUrl: l, kClose: i, kDestroy: c, kDispatch: Q } = Ve(), h = dg(), B = /* @__PURE__ */ Symbol("clients"), d = /* @__PURE__ */ Symbol("needDrain"), y = /* @__PURE__ */ Symbol("queue"), b = /* @__PURE__ */ Symbol("closed resolve"), F = /* @__PURE__ */ Symbol("onDrain"), M = /* @__PURE__ */ Symbol("onConnect"), L = /* @__PURE__ */ Symbol("onDisconnect"), N = /* @__PURE__ */ Symbol("onConnectionError"), f = /* @__PURE__ */ Symbol("get dispatcher"), E = /* @__PURE__ */ Symbol("add client"), p = /* @__PURE__ */ Symbol("remove client"), g = /* @__PURE__ */ Symbol("stats");
  class C extends e {
    constructor() {
      super(), this[y] = new t(), this[B] = [], this[o] = 0;
      const I = this;
      this[F] = function(D, U) {
        const S = I[y];
        let G = !1;
        for (; !G; ) {
          const v = S.shift();
          if (!v)
            break;
          I[o]--, G = !this.dispatch(v.opts, v.handler);
        }
        this[d] = G, !this[d] && I[d] && (I[d] = !1, I.emit("drain", D, [I, ...U])), I[b] && S.isEmpty() && Promise.all(I[B].map((v) => v.close())).then(I[b]);
      }, this[M] = (m, D) => {
        I.emit("connect", m, [I, ...D]);
      }, this[L] = (m, D, U) => {
        I.emit("disconnect", m, [I, ...D], U);
      }, this[N] = (m, D, U) => {
        I.emit("connectionError", m, [I, ...D], U);
      }, this[g] = new h(this);
    }
    get [a]() {
      return this[d];
    }
    get [A]() {
      return this[B].filter((I) => I[A]).length;
    }
    get [u]() {
      return this[B].filter((I) => I[A] && !I[d]).length;
    }
    get [n]() {
      let I = this[o];
      for (const { [n]: m } of this[B])
        I += m;
      return I;
    }
    get [r]() {
      let I = 0;
      for (const { [r]: m } of this[B])
        I += m;
      return I;
    }
    get [s]() {
      let I = this[o];
      for (const { [s]: m } of this[B])
        I += m;
      return I;
    }
    get stats() {
      return this[g];
    }
    async [i]() {
      this[y].isEmpty() ? await Promise.all(this[B].map((I) => I.close())) : await new Promise((I) => {
        this[b] = I;
      });
    }
    async [c](I) {
      for (; ; ) {
        const m = this[y].shift();
        if (!m)
          break;
        m.handler.onError(I);
      }
      await Promise.all(this[B].map((m) => m.destroy(I)));
    }
    [Q](I, m) {
      const D = this[f]();
      return D ? D.dispatch(I, m) || (D[d] = !0, this[d] = !this[f]()) : (this[d] = !0, this[y].push({ opts: I, handler: m }), this[o]++), !this[d];
    }
    [E](I) {
      return I.on("drain", this[F]).on("connect", this[M]).on("disconnect", this[L]).on("connectionError", this[N]), this[B].push(I), this[d] && queueMicrotask(() => {
        this[d] && this[F](I[l], [this, I]);
      }), this;
    }
    [p](I) {
      I.close(() => {
        const m = this[B].indexOf(I);
        m !== -1 && this[B].splice(m, 1);
      }), this[d] = this[B].some((m) => !m[d] && m.closed !== !0 && m.destroyed !== !0);
    }
  }
  return Nr = {
    PoolBase: C,
    kClients: B,
    kNeedDrain: d,
    kAddClient: E,
    kRemoveClient: p,
    kGetDispatcher: f
  }, Nr;
}
var Mr, ko;
function tA() {
  if (ko) return Mr;
  ko = 1;
  const {
    PoolBase: e,
    kClients: t,
    kNeedDrain: A,
    kAddClient: s,
    kGetDispatcher: r
  } = Ro(), n = eA(), {
    InvalidArgumentError: o
  } = Ye(), a = Ue(), { kUrl: u, kInterceptors: l } = Ve(), i = mA(), c = /* @__PURE__ */ Symbol("options"), Q = /* @__PURE__ */ Symbol("connections"), h = /* @__PURE__ */ Symbol("factory");
  function B(y, b) {
    return new n(y, b);
  }
  class d extends e {
    constructor(b, {
      connections: F,
      factory: M = B,
      connect: L,
      connectTimeout: N,
      tls: f,
      maxCachedSessions: E,
      socketPath: p,
      autoSelectFamily: g,
      autoSelectFamilyAttemptTimeout: C,
      allowH2: w,
      ...I
    } = {}) {
      if (super(), F != null && (!Number.isFinite(F) || F < 0))
        throw new o("invalid connections");
      if (typeof M != "function")
        throw new o("factory must be a function.");
      if (L != null && typeof L != "function" && typeof L != "object")
        throw new o("connect must be a function or an object");
      typeof L != "function" && (L = i({
        ...f,
        maxCachedSessions: E,
        allowH2: w,
        socketPath: p,
        timeout: N,
        ...g ? { autoSelectFamily: g, autoSelectFamilyAttemptTimeout: C } : void 0,
        ...L
      })), this[l] = I.interceptors?.Pool && Array.isArray(I.interceptors.Pool) ? I.interceptors.Pool : [], this[Q] = F || null, this[u] = a.parseOrigin(b), this[c] = { ...a.deepClone(I), connect: L, allowH2: w }, this[c].interceptors = I.interceptors ? { ...I.interceptors } : void 0, this[h] = M, this.on("connectionError", (m, D, U) => {
        for (const S of D) {
          const G = this[t].indexOf(S);
          G !== -1 && this[t].splice(G, 1);
        }
      });
    }
    [r]() {
      for (const b of this[t])
        if (!b[A])
          return b;
      if (!this[Q] || this[t].length < this[Q]) {
        const b = this[h](this[u], this[c]);
        return this[s](b), b;
      }
    }
  }
  return Mr = d, Mr;
}
var Lr, Fo;
function fg() {
  if (Fo) return Lr;
  Fo = 1;
  const {
    BalancedPoolMissingUpstreamError: e,
    InvalidArgumentError: t
  } = Ye(), {
    PoolBase: A,
    kClients: s,
    kNeedDrain: r,
    kAddClient: n,
    kRemoveClient: o,
    kGetDispatcher: a
  } = Ro(), u = tA(), { kUrl: l, kInterceptors: i } = Ve(), { parseOrigin: c } = Ue(), Q = /* @__PURE__ */ Symbol("factory"), h = /* @__PURE__ */ Symbol("options"), B = /* @__PURE__ */ Symbol("kGreatestCommonDivisor"), d = /* @__PURE__ */ Symbol("kCurrentWeight"), y = /* @__PURE__ */ Symbol("kIndex"), b = /* @__PURE__ */ Symbol("kWeight"), F = /* @__PURE__ */ Symbol("kMaxWeightPerServer"), M = /* @__PURE__ */ Symbol("kErrorPenalty");
  function L(E, p) {
    if (E === 0) return p;
    for (; p !== 0; ) {
      const g = p;
      p = E % p, E = g;
    }
    return E;
  }
  function N(E, p) {
    return new u(E, p);
  }
  class f extends A {
    constructor(p = [], { factory: g = N, ...C } = {}) {
      if (super(), this[h] = C, this[y] = -1, this[d] = 0, this[F] = this[h].maxWeightPerServer || 100, this[M] = this[h].errorPenalty || 15, Array.isArray(p) || (p = [p]), typeof g != "function")
        throw new t("factory must be a function.");
      this[i] = C.interceptors?.BalancedPool && Array.isArray(C.interceptors.BalancedPool) ? C.interceptors.BalancedPool : [], this[Q] = g;
      for (const w of p)
        this.addUpstream(w);
      this._updateBalancedPoolStats();
    }
    addUpstream(p) {
      const g = c(p).origin;
      if (this[s].find((w) => w[l].origin === g && w.closed !== !0 && w.destroyed !== !0))
        return this;
      const C = this[Q](g, Object.assign({}, this[h]));
      this[n](C), C.on("connect", () => {
        C[b] = Math.min(this[F], C[b] + this[M]);
      }), C.on("connectionError", () => {
        C[b] = Math.max(1, C[b] - this[M]), this._updateBalancedPoolStats();
      }), C.on("disconnect", (...w) => {
        const I = w[2];
        I && I.code === "UND_ERR_SOCKET" && (C[b] = Math.max(1, C[b] - this[M]), this._updateBalancedPoolStats());
      });
      for (const w of this[s])
        w[b] = this[F];
      return this._updateBalancedPoolStats(), this;
    }
    _updateBalancedPoolStats() {
      let p = 0;
      for (let g = 0; g < this[s].length; g++)
        p = L(this[s][g][b], p);
      this[B] = p;
    }
    removeUpstream(p) {
      const g = c(p).origin, C = this[s].find((w) => w[l].origin === g && w.closed !== !0 && w.destroyed !== !0);
      return C && this[o](C), this;
    }
    get upstreams() {
      return this[s].filter((p) => p.closed !== !0 && p.destroyed !== !0).map((p) => p[l].origin);
    }
    [a]() {
      if (this[s].length === 0)
        throw new e();
      if (!this[s].find((I) => !I[r] && I.closed !== !0 && I.destroyed !== !0) || this[s].map((I) => I[r]).reduce((I, m) => I && m, !0))
        return;
      let C = 0, w = this[s].findIndex((I) => !I[r]);
      for (; C++ < this[s].length; ) {
        this[y] = (this[y] + 1) % this[s].length;
        const I = this[s][this[y]];
        if (I[b] > this[s][w][b] && !I[r] && (w = this[y]), this[y] === 0 && (this[d] = this[d] - this[B], this[d] <= 0 && (this[d] = this[F])), I[b] >= this[d] && !I[r])
          return I;
      }
      return this[d] = this[s][w][b], this[y] = w, this[s][w];
    }
  }
  return Lr = f, Lr;
}
var Gr, To;
function AA() {
  if (To) return Gr;
  To = 1;
  const { InvalidArgumentError: e } = Ye(), { kClients: t, kRunning: A, kClose: s, kDestroy: r, kDispatch: n, kInterceptors: o } = Ve(), a = jt(), u = tA(), l = eA(), i = Ue(), c = Fr(), Q = /* @__PURE__ */ Symbol("onConnect"), h = /* @__PURE__ */ Symbol("onDisconnect"), B = /* @__PURE__ */ Symbol("onConnectionError"), d = /* @__PURE__ */ Symbol("maxRedirections"), y = /* @__PURE__ */ Symbol("onDrain"), b = /* @__PURE__ */ Symbol("factory"), F = /* @__PURE__ */ Symbol("options");
  function M(N, f) {
    return f && f.connections === 1 ? new l(N, f) : new u(N, f);
  }
  class L extends a {
    constructor({ factory: f = M, maxRedirections: E = 0, connect: p, ...g } = {}) {
      if (super(), typeof f != "function")
        throw new e("factory must be a function.");
      if (p != null && typeof p != "function" && typeof p != "object")
        throw new e("connect must be a function or an object");
      if (!Number.isInteger(E) || E < 0)
        throw new e("maxRedirections must be a positive number");
      p && typeof p != "function" && (p = { ...p }), this[o] = g.interceptors?.Agent && Array.isArray(g.interceptors.Agent) ? g.interceptors.Agent : [c({ maxRedirections: E })], this[F] = { ...i.deepClone(g), connect: p }, this[F].interceptors = g.interceptors ? { ...g.interceptors } : void 0, this[d] = E, this[b] = f, this[t] = /* @__PURE__ */ new Map(), this[y] = (C, w) => {
        this.emit("drain", C, [this, ...w]);
      }, this[Q] = (C, w) => {
        this.emit("connect", C, [this, ...w]);
      }, this[h] = (C, w, I) => {
        this.emit("disconnect", C, [this, ...w], I);
      }, this[B] = (C, w, I) => {
        this.emit("connectionError", C, [this, ...w], I);
      };
    }
    get [A]() {
      let f = 0;
      for (const E of this[t].values())
        f += E[A];
      return f;
    }
    [n](f, E) {
      let p;
      if (f.origin && (typeof f.origin == "string" || f.origin instanceof URL))
        p = String(f.origin);
      else
        throw new e("opts.origin must be a non-empty string or URL.");
      let g = this[t].get(p);
      return g || (g = this[b](f.origin, this[F]).on("drain", this[y]).on("connect", this[Q]).on("disconnect", this[h]).on("connectionError", this[B]), this[t].set(p, g)), g.dispatch(f, E);
    }
    async [s]() {
      const f = [];
      for (const E of this[t].values())
        f.push(E.close());
      this[t].clear(), await Promise.all(f);
    }
    async [r](f) {
      const E = [];
      for (const p of this[t].values())
        E.push(p.destroy(f));
      this[t].clear(), await Promise.all(E);
    }
  }
  return Gr = L, Gr;
}
var vr, So;
function Uo() {
  if (So) return vr;
  So = 1;
  const { kProxy: e, kClose: t, kDestroy: A, kDispatch: s, kInterceptors: r } = Ve(), { URL: n } = Kc, o = AA(), a = tA(), u = jt(), { InvalidArgumentError: l, RequestAbortedError: i, SecureProxyConnectionError: c } = Ye(), Q = mA(), h = eA(), B = /* @__PURE__ */ Symbol("proxy agent"), d = /* @__PURE__ */ Symbol("proxy client"), y = /* @__PURE__ */ Symbol("proxy headers"), b = /* @__PURE__ */ Symbol("request tls settings"), F = /* @__PURE__ */ Symbol("proxy tls settings"), M = /* @__PURE__ */ Symbol("connect endpoint function"), L = /* @__PURE__ */ Symbol("tunnel proxy");
  function N(m) {
    return m === "https:" ? 443 : 80;
  }
  function f(m, D) {
    return new a(m, D);
  }
  const E = () => {
  };
  function p(m, D) {
    return D.connections === 1 ? new h(m, D) : new a(m, D);
  }
  class g extends u {
    #e;
    constructor(D, { headers: U = {}, connect: S, factory: G }) {
      if (super(), !D)
        throw new l("Proxy URL is mandatory");
      this[y] = U, G ? this.#e = G(D, { connect: S }) : this.#e = new h(D, { connect: S });
    }
    [s](D, U) {
      const S = U.onHeaders;
      U.onHeaders = function(ne, ge, ae) {
        if (ne === 407) {
          typeof U.onError == "function" && U.onError(new l("Proxy Authentication Required (407)"));
          return;
        }
        S && S.call(this, ne, ge, ae);
      };
      const {
        origin: G,
        path: v = "/",
        headers: $ = {}
      } = D;
      if (D.path = G + v, !("host" in $) && !("Host" in $)) {
        const { host: ne } = new n(G);
        $.host = ne;
      }
      return D.headers = { ...this[y], ...$ }, this.#e[s](D, U);
    }
    async [t]() {
      return this.#e.close();
    }
    async [A](D) {
      return this.#e.destroy(D);
    }
  }
  class C extends u {
    constructor(D) {
      if (super(), !D || typeof D == "object" && !(D instanceof n) && !D.uri)
        throw new l("Proxy uri is mandatory");
      const { clientFactory: U = f } = D;
      if (typeof U != "function")
        throw new l("Proxy opts.clientFactory must be a function.");
      const { proxyTunnel: S = !0 } = D, G = this.#e(D), { href: v, origin: $, port: ne, protocol: ge, username: ae, password: Be, hostname: he } = G;
      if (this[e] = { uri: v, protocol: ge }, this[r] = D.interceptors?.ProxyAgent && Array.isArray(D.interceptors.ProxyAgent) ? D.interceptors.ProxyAgent : [], this[b] = D.requestTls, this[F] = D.proxyTls, this[y] = D.headers || {}, this[L] = S, D.auth && D.token)
        throw new l("opts.auth cannot be used in combination with opts.token");
      D.auth ? this[y]["proxy-authorization"] = `Basic ${D.auth}` : D.token ? this[y]["proxy-authorization"] = D.token : ae && Be && (this[y]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(ae)}:${decodeURIComponent(Be)}`).toString("base64")}`);
      const Qe = Q({ ...D.proxyTls });
      this[M] = Q({ ...D.requestTls });
      const ye = D.factory || p, we = (X, W) => {
        const { protocol: re } = new n(X);
        return !this[L] && re === "http:" && this[e].protocol === "http:" ? new g(this[e].uri, {
          headers: this[y],
          connect: Qe,
          factory: ye
        }) : ye(X, W);
      };
      this[d] = U(G, { connect: Qe }), this[B] = new o({
        ...D,
        factory: we,
        connect: async (X, W) => {
          let re = X.host;
          X.port || (re += `:${N(X.protocol)}`);
          try {
            const { socket: J, statusCode: V } = await this[d].connect({
              origin: $,
              port: ne,
              path: re,
              signal: X.signal,
              headers: {
                ...this[y],
                host: X.host
              },
              servername: this[F]?.servername || he
            });
            if (V !== 200 && (J.on("error", E).destroy(), W(new i(`Proxy response (${V}) !== 200 when HTTP Tunneling`))), X.protocol !== "https:") {
              W(null, J);
              return;
            }
            let P;
            this[b] ? P = this[b].servername : P = X.servername, this[M]({ ...X, servername: P, httpSocket: J }, W);
          } catch (J) {
            J.code === "ERR_TLS_CERT_ALTNAME_INVALID" ? W(new c(J)) : W(J);
          }
        }
      });
    }
    dispatch(D, U) {
      const S = w(D.headers);
      if (I(S), S && !("host" in S) && !("Host" in S)) {
        const { host: G } = new n(D.origin);
        S.host = G;
      }
      return this[B].dispatch(
        {
          ...D,
          headers: S
        },
        U
      );
    }
    /**
     * @param {import('../types/proxy-agent').ProxyAgent.Options | string | URL} opts
     * @returns {URL}
     */
    #e(D) {
      return typeof D == "string" ? new n(D) : D instanceof n ? D : new n(D.uri);
    }
    async [t]() {
      await this[B].close(), await this[d].close();
    }
    async [A]() {
      await this[B].destroy(), await this[d].destroy();
    }
  }
  function w(m) {
    if (Array.isArray(m)) {
      const D = {};
      for (let U = 0; U < m.length; U += 2)
        D[m[U]] = m[U + 1];
      return D;
    }
    return m;
  }
  function I(m) {
    if (m && Object.keys(m).find((U) => U.toLowerCase() === "proxy-authorization"))
      throw new l("Proxy-Authorization should be sent in ProxyAgent constructor");
  }
  return vr = C, vr;
}
var Yr, No;
function pg() {
  if (No) return Yr;
  No = 1;
  const e = jt(), { kClose: t, kDestroy: A, kClosed: s, kDestroyed: r, kDispatch: n, kNoProxyAgent: o, kHttpProxyAgent: a, kHttpsProxyAgent: u } = Ve(), l = Uo(), i = AA(), c = {
    "http:": 80,
    "https:": 443
  };
  let Q = !1;
  class h extends e {
    #e = null;
    #t = null;
    #s = null;
    constructor(d = {}) {
      super(), this.#s = d, Q || (Q = !0, process.emitWarning("EnvHttpProxyAgent is experimental, expect them to change at any time.", {
        code: "UNDICI-EHPA"
      }));
      const { httpProxy: y, httpsProxy: b, noProxy: F, ...M } = d;
      this[o] = new i(M);
      const L = y ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
      L ? this[a] = new l({ ...M, uri: L }) : this[a] = this[o];
      const N = b ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
      N ? this[u] = new l({ ...M, uri: N }) : this[u] = this[a], this.#n();
    }
    [n](d, y) {
      const b = new URL(d.origin);
      return this.#r(b).dispatch(d, y);
    }
    async [t]() {
      await this[o].close(), this[a][s] || await this[a].close(), this[u][s] || await this[u].close();
    }
    async [A](d) {
      await this[o].destroy(d), this[a][r] || await this[a].destroy(d), this[u][r] || await this[u].destroy(d);
    }
    #r(d) {
      let { protocol: y, host: b, port: F } = d;
      return b = b.replace(/:\d*$/, "").toLowerCase(), F = Number.parseInt(F, 10) || c[y] || 0, this.#A(b, F) ? y === "https:" ? this[u] : this[a] : this[o];
    }
    #A(d, y) {
      if (this.#o && this.#n(), this.#t.length === 0)
        return !0;
      if (this.#e === "*")
        return !1;
      for (let b = 0; b < this.#t.length; b++) {
        const F = this.#t[b];
        if (!(F.port && F.port !== y)) {
          if (/^[.*]/.test(F.hostname)) {
            if (d.endsWith(F.hostname.replace(/^\*/, "")))
              return !1;
          } else if (d === F.hostname)
            return !1;
        }
      }
      return !0;
    }
    #n() {
      const d = this.#s.noProxy ?? this.#i, y = d.split(/[,\s]/), b = [];
      for (let F = 0; F < y.length; F++) {
        const M = y[F];
        if (!M)
          continue;
        const L = M.match(/^(.+):(\d+)$/);
        b.push({
          hostname: (L ? L[1] : M).toLowerCase(),
          port: L ? Number.parseInt(L[2], 10) : 0
        });
      }
      this.#e = d, this.#t = b;
    }
    get #o() {
      return this.#s.noProxy !== void 0 ? !1 : this.#e !== this.#i;
    }
    get #i() {
      return process.env.no_proxy ?? process.env.NO_PROXY ?? "";
    }
  }
  return Yr = h, Yr;
}
var Jr, Mo;
function Hr() {
  if (Mo) return Jr;
  Mo = 1;
  const e = He, { kRetryHandlerDefaultRetry: t } = Ve(), { RequestRetryError: A } = Ye(), {
    isDisturbed: s,
    parseHeaders: r,
    parseRangeHeader: n,
    wrapRequestBody: o
  } = Ue();
  function a(l) {
    const i = Date.now();
    return new Date(l).getTime() - i;
  }
  class u {
    constructor(i, c) {
      const { retryOptions: Q, ...h } = i, {
        // Retry scoped
        retry: B,
        maxRetries: d,
        maxTimeout: y,
        minTimeout: b,
        timeoutFactor: F,
        // Response scoped
        methods: M,
        errorCodes: L,
        retryAfter: N,
        statusCodes: f
      } = Q ?? {};
      this.dispatch = c.dispatch, this.handler = c.handler, this.opts = { ...h, body: o(i.body) }, this.abort = null, this.aborted = !1, this.retryOpts = {
        retry: B ?? u[t],
        retryAfter: N ?? !0,
        maxTimeout: y ?? 30 * 1e3,
        // 30s,
        minTimeout: b ?? 500,
        // .5s
        timeoutFactor: F ?? 2,
        maxRetries: d ?? 5,
        // What errors we should retry
        methods: M ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
        // Indicates which errors to retry
        statusCodes: f ?? [500, 502, 503, 504, 429],
        // List of errors to retry
        errorCodes: L ?? [
          "ECONNRESET",
          "ECONNREFUSED",
          "ENOTFOUND",
          "ENETDOWN",
          "ENETUNREACH",
          "EHOSTDOWN",
          "EHOSTUNREACH",
          "EPIPE",
          "UND_ERR_SOCKET"
        ]
      }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((E) => {
        this.aborted = !0, this.abort ? this.abort(E) : this.reason = E;
      });
    }
    onRequestSent() {
      this.handler.onRequestSent && this.handler.onRequestSent();
    }
    onUpgrade(i, c, Q) {
      this.handler.onUpgrade && this.handler.onUpgrade(i, c, Q);
    }
    onConnect(i) {
      this.aborted ? i(this.reason) : this.abort = i;
    }
    onBodySent(i) {
      if (this.handler.onBodySent) return this.handler.onBodySent(i);
    }
    static [t](i, { state: c, opts: Q }, h) {
      const { statusCode: B, code: d, headers: y } = i, { method: b, retryOptions: F } = Q, {
        maxRetries: M,
        minTimeout: L,
        maxTimeout: N,
        timeoutFactor: f,
        statusCodes: E,
        errorCodes: p,
        methods: g
      } = F, { counter: C } = c;
      if (d && d !== "UND_ERR_REQ_RETRY" && !p.includes(d)) {
        h(i);
        return;
      }
      if (Array.isArray(g) && !g.includes(b)) {
        h(i);
        return;
      }
      if (B != null && Array.isArray(E) && !E.includes(B)) {
        h(i);
        return;
      }
      if (C > M) {
        h(i);
        return;
      }
      let w = y?.["retry-after"];
      w && (w = Number(w), w = Number.isNaN(w) ? a(w) : w * 1e3);
      const I = w > 0 ? Math.min(w, N) : Math.min(L * f ** (C - 1), N);
      setTimeout(() => h(null), I);
    }
    onHeaders(i, c, Q, h) {
      const B = r(c);
      if (this.retryCount += 1, i >= 300)
        return this.retryOpts.statusCodes.includes(i) === !1 ? this.handler.onHeaders(
          i,
          c,
          Q,
          h
        ) : (this.abort(
          new A("Request failed", i, {
            headers: B,
            data: {
              count: this.retryCount
            }
          })
        ), !1);
      if (this.resume != null) {
        if (this.resume = null, i !== 206 && (this.start > 0 || i !== 200))
          return this.abort(
            new A("server does not support the range header and the payload was partially consumed", i, {
              headers: B,
              data: { count: this.retryCount }
            })
          ), !1;
        const y = n(B["content-range"]);
        if (!y)
          return this.abort(
            new A("Content-Range mismatch", i, {
              headers: B,
              data: { count: this.retryCount }
            })
          ), !1;
        if (this.etag != null && this.etag !== B.etag)
          return this.abort(
            new A("ETag mismatch", i, {
              headers: B,
              data: { count: this.retryCount }
            })
          ), !1;
        const { start: b, size: F, end: M = F - 1 } = y;
        return e(this.start === b, "content-range mismatch"), e(this.end == null || this.end === M, "content-range mismatch"), this.resume = Q, !0;
      }
      if (this.end == null) {
        if (i === 206) {
          const y = n(B["content-range"]);
          if (y == null)
            return this.handler.onHeaders(
              i,
              c,
              Q,
              h
            );
          const { start: b, size: F, end: M = F - 1 } = y;
          e(
            b != null && Number.isFinite(b),
            "content-range mismatch"
          ), e(M != null && Number.isFinite(M), "invalid content-length"), this.start = b, this.end = M;
        }
        if (this.end == null) {
          const y = B["content-length"];
          this.end = y != null ? Number(y) - 1 : null;
        }
        return e(Number.isFinite(this.start)), e(
          this.end == null || Number.isFinite(this.end),
          "invalid content-length"
        ), this.resume = Q, this.etag = B.etag != null ? B.etag : null, this.etag != null && this.etag.startsWith("W/") && (this.etag = null), this.handler.onHeaders(
          i,
          c,
          Q,
          h
        );
      }
      const d = new A("Request failed", i, {
        headers: B,
        data: { count: this.retryCount }
      });
      return this.abort(d), !1;
    }
    onData(i) {
      return this.start += i.length, this.handler.onData(i);
    }
    onComplete(i) {
      return this.retryCount = 0, this.handler.onComplete(i);
    }
    onError(i) {
      if (this.aborted || s(this.opts.body))
        return this.handler.onError(i);
      this.retryCount - this.retryCountCheckpoint > 0 ? this.retryCount = this.retryCountCheckpoint + (this.retryCount - this.retryCountCheckpoint) : this.retryCount += 1, this.retryOpts.retry(
        i,
        {
          state: { counter: this.retryCount },
          opts: { retryOptions: this.retryOpts, ...this.opts }
        },
        c.bind(this)
      );
      function c(Q) {
        if (Q != null || this.aborted || s(this.opts.body))
          return this.handler.onError(Q);
        if (this.start !== 0) {
          const h = { range: `bytes=${this.start}-${this.end ?? ""}` };
          this.etag != null && (h["if-match"] = this.etag), this.opts = {
            ...this.opts,
            headers: {
              ...this.opts.headers,
              ...h
            }
          };
        }
        try {
          this.retryCountCheckpoint = this.retryCount, this.dispatch(this.opts, this);
        } catch (h) {
          this.handler.onError(h);
        }
      }
    }
  }
  return Jr = u, Jr;
}
var Or, Lo;
function wg() {
  if (Lo) return Or;
  Lo = 1;
  const e = wA(), t = Hr();
  class A extends e {
    #e = null;
    #t = null;
    constructor(r, n = {}) {
      super(n), this.#e = r, this.#t = n;
    }
    dispatch(r, n) {
      const o = new t({
        ...r,
        retryOptions: this.#t
      }, {
        dispatch: this.#e.dispatch.bind(this.#e),
        handler: n
      });
      return this.#e.dispatch(r, o);
    }
    close() {
      return this.#e.close();
    }
    destroy() {
      return this.#e.destroy();
    }
  }
  return Or = A, Or;
}
var St = {}, bA = { exports: {} }, Pr, Go;
function vo() {
  if (Go) return Pr;
  Go = 1;
  const e = He, { Readable: t } = ot, { RequestAbortedError: A, NotSupportedError: s, InvalidArgumentError: r, AbortError: n } = Ye(), o = Ue(), { ReadableStreamFrom: a } = Ue(), u = /* @__PURE__ */ Symbol("kConsume"), l = /* @__PURE__ */ Symbol("kReading"), i = /* @__PURE__ */ Symbol("kBody"), c = /* @__PURE__ */ Symbol("kAbort"), Q = /* @__PURE__ */ Symbol("kContentType"), h = /* @__PURE__ */ Symbol("kContentLength"), B = () => {
  };
  class d extends t {
    constructor({
      resume: C,
      abort: w,
      contentType: I = "",
      contentLength: m,
      highWaterMark: D = 64 * 1024
      // Same as nodejs fs streams.
    }) {
      super({
        autoDestroy: !0,
        read: C,
        highWaterMark: D
      }), this._readableState.dataEmitted = !1, this[c] = w, this[u] = null, this[i] = null, this[Q] = I, this[h] = m, this[l] = !1;
    }
    destroy(C) {
      return !C && !this._readableState.endEmitted && (C = new A()), C && this[c](), super.destroy(C);
    }
    _destroy(C, w) {
      this[l] ? w(C) : setImmediate(() => {
        w(C);
      });
    }
    on(C, ...w) {
      return (C === "data" || C === "readable") && (this[l] = !0), super.on(C, ...w);
    }
    addListener(C, ...w) {
      return this.on(C, ...w);
    }
    off(C, ...w) {
      const I = super.off(C, ...w);
      return (C === "data" || C === "readable") && (this[l] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0), I;
    }
    removeListener(C, ...w) {
      return this.off(C, ...w);
    }
    push(C) {
      return this[u] && C !== null ? (E(this[u], C), this[l] ? super.push(C) : !0) : super.push(C);
    }
    // https://fetch.spec.whatwg.org/#dom-body-text
    async text() {
      return F(this, "text");
    }
    // https://fetch.spec.whatwg.org/#dom-body-json
    async json() {
      return F(this, "json");
    }
    // https://fetch.spec.whatwg.org/#dom-body-blob
    async blob() {
      return F(this, "blob");
    }
    // https://fetch.spec.whatwg.org/#dom-body-bytes
    async bytes() {
      return F(this, "bytes");
    }
    // https://fetch.spec.whatwg.org/#dom-body-arraybuffer
    async arrayBuffer() {
      return F(this, "arrayBuffer");
    }
    // https://fetch.spec.whatwg.org/#dom-body-formdata
    async formData() {
      throw new s();
    }
    // https://fetch.spec.whatwg.org/#dom-body-bodyused
    get bodyUsed() {
      return o.isDisturbed(this);
    }
    // https://fetch.spec.whatwg.org/#dom-body-body
    get body() {
      return this[i] || (this[i] = a(this), this[u] && (this[i].getReader(), e(this[i].locked))), this[i];
    }
    async dump(C) {
      let w = Number.isFinite(C?.limit) ? C.limit : 131072;
      const I = C?.signal;
      if (I != null && (typeof I != "object" || !("aborted" in I)))
        throw new r("signal must be an AbortSignal");
      return I?.throwIfAborted(), this._readableState.closeEmitted ? null : await new Promise((m, D) => {
        this[h] > w && this.destroy(new n());
        const U = () => {
          this.destroy(I.reason ?? new n());
        };
        I?.addEventListener("abort", U), this.on("close", function() {
          I?.removeEventListener("abort", U), I?.aborted ? D(I.reason ?? new n()) : m(null);
        }).on("error", B).on("data", function(S) {
          w -= S.length, w <= 0 && this.destroy();
        }).resume();
      });
    }
  }
  function y(g) {
    return g[i] && g[i].locked === !0 || g[u];
  }
  function b(g) {
    return o.isDisturbed(g) || y(g);
  }
  async function F(g, C) {
    return e(!g[u]), new Promise((w, I) => {
      if (b(g)) {
        const m = g._readableState;
        m.destroyed && m.closeEmitted === !1 ? g.on("error", (D) => {
          I(D);
        }).on("close", () => {
          I(new TypeError("unusable"));
        }) : I(m.errored ?? new TypeError("unusable"));
      } else
        queueMicrotask(() => {
          g[u] = {
            type: C,
            stream: g,
            resolve: w,
            reject: I,
            length: 0,
            body: []
          }, g.on("error", function(m) {
            p(this[u], m);
          }).on("close", function() {
            this[u].body !== null && p(this[u], new A());
          }), M(g[u]);
        });
    });
  }
  function M(g) {
    if (g.body === null)
      return;
    const { _readableState: C } = g.stream;
    if (C.bufferIndex) {
      const w = C.bufferIndex, I = C.buffer.length;
      for (let m = w; m < I; m++)
        E(g, C.buffer[m]);
    } else
      for (const w of C.buffer)
        E(g, w);
    for (C.endEmitted ? f(this[u]) : g.stream.on("end", function() {
      f(this[u]);
    }), g.stream.resume(); g.stream.read() != null; )
      ;
  }
  function L(g, C) {
    if (g.length === 0 || C === 0)
      return "";
    const w = g.length === 1 ? g[0] : Buffer.concat(g, C), I = w.length, m = I > 2 && w[0] === 239 && w[1] === 187 && w[2] === 191 ? 3 : 0;
    return w.utf8Slice(m, I);
  }
  function N(g, C) {
    if (g.length === 0 || C === 0)
      return new Uint8Array(0);
    if (g.length === 1)
      return new Uint8Array(g[0]);
    const w = new Uint8Array(Buffer.allocUnsafeSlow(C).buffer);
    let I = 0;
    for (let m = 0; m < g.length; ++m) {
      const D = g[m];
      w.set(D, I), I += D.length;
    }
    return w;
  }
  function f(g) {
    const { type: C, body: w, resolve: I, stream: m, length: D } = g;
    try {
      C === "text" ? I(L(w, D)) : C === "json" ? I(JSON.parse(L(w, D))) : C === "arrayBuffer" ? I(N(w, D).buffer) : C === "blob" ? I(new Blob(w, { type: m[Q] })) : C === "bytes" && I(N(w, D)), p(g);
    } catch (U) {
      m.destroy(U);
    }
  }
  function E(g, C) {
    g.length += C.length, g.body.push(C);
  }
  function p(g, C) {
    g.body !== null && (C ? g.reject(C) : g.resolve(), g.type = null, g.stream = null, g.resolve = null, g.reject = null, g.length = 0, g.body = null);
  }
  return Pr = { Readable: d, chunksDecode: L }, Pr;
}
var _r, Yo;
function Jo() {
  if (Yo) return _r;
  Yo = 1;
  const e = He, {
    ResponseStatusCodeError: t
  } = Ye(), { chunksDecode: A } = vo(), s = 128 * 1024;
  async function r({ callback: a, body: u, contentType: l, statusCode: i, statusMessage: c, headers: Q }) {
    e(u);
    let h = [], B = 0;
    try {
      for await (const F of u)
        if (h.push(F), B += F.length, B > s) {
          h = [], B = 0;
          break;
        }
    } catch {
      h = [], B = 0;
    }
    const d = `Response status code ${i}${c ? `: ${c}` : ""}`;
    if (i === 204 || !l || !B) {
      queueMicrotask(() => a(new t(d, i, Q)));
      return;
    }
    const y = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    let b;
    try {
      n(l) ? b = JSON.parse(A(h, B)) : o(l) && (b = A(h, B));
    } catch {
    } finally {
      Error.stackTraceLimit = y;
    }
    queueMicrotask(() => a(new t(d, i, Q, b)));
  }
  const n = (a) => a.length > 15 && a[11] === "/" && a[0] === "a" && a[1] === "p" && a[2] === "p" && a[3] === "l" && a[4] === "i" && a[5] === "c" && a[6] === "a" && a[7] === "t" && a[8] === "i" && a[9] === "o" && a[10] === "n" && a[12] === "j" && a[13] === "s" && a[14] === "o" && a[15] === "n", o = (a) => a.length > 4 && a[4] === "/" && a[0] === "t" && a[1] === "e" && a[2] === "x" && a[3] === "t";
  return _r = {
    getResolveErrorBodyCallback: r,
    isContentTypeApplicationJson: n,
    isContentTypeText: o
  }, _r;
}
var Ho;
function mg() {
  if (Ho) return bA.exports;
  Ho = 1;
  const e = He, { Readable: t } = vo(), { InvalidArgumentError: A, RequestAbortedError: s } = Ye(), r = Ue(), { getResolveErrorBodyCallback: n } = Jo(), { AsyncResource: o } = qt;
  class a extends o {
    constructor(i, c) {
      if (!i || typeof i != "object")
        throw new A("invalid opts");
      const { signal: Q, method: h, opaque: B, body: d, onInfo: y, responseHeaders: b, throwOnError: F, highWaterMark: M } = i;
      try {
        if (typeof c != "function")
          throw new A("invalid callback");
        if (M && (typeof M != "number" || M < 0))
          throw new A("invalid highWaterMark");
        if (Q && typeof Q.on != "function" && typeof Q.addEventListener != "function")
          throw new A("signal must be an EventEmitter or EventTarget");
        if (h === "CONNECT")
          throw new A("invalid method");
        if (y && typeof y != "function")
          throw new A("invalid onInfo callback");
        super("UNDICI_REQUEST");
      } catch (L) {
        throw r.isStream(d) && r.destroy(d.on("error", r.nop), L), L;
      }
      this.method = h, this.responseHeaders = b || null, this.opaque = B || null, this.callback = c, this.res = null, this.abort = null, this.body = d, this.trailers = {}, this.context = null, this.onInfo = y || null, this.throwOnError = F, this.highWaterMark = M, this.signal = Q, this.reason = null, this.removeAbortListener = null, r.isStream(d) && d.on("error", (L) => {
        this.onError(L);
      }), this.signal && (this.signal.aborted ? this.reason = this.signal.reason ?? new s() : this.removeAbortListener = r.addAbortListener(this.signal, () => {
        this.reason = this.signal.reason ?? new s(), this.res ? r.destroy(this.res.on("error", r.nop), this.reason) : this.abort && this.abort(this.reason), this.removeAbortListener && (this.res?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null);
      }));
    }
    onConnect(i, c) {
      if (this.reason) {
        i(this.reason);
        return;
      }
      e(this.callback), this.abort = i, this.context = c;
    }
    onHeaders(i, c, Q, h) {
      const { callback: B, opaque: d, abort: y, context: b, responseHeaders: F, highWaterMark: M } = this, L = F === "raw" ? r.parseRawHeaders(c) : r.parseHeaders(c);
      if (i < 200) {
        this.onInfo && this.onInfo({ statusCode: i, headers: L });
        return;
      }
      const N = F === "raw" ? r.parseHeaders(c) : L, f = N["content-type"], E = N["content-length"], p = new t({
        resume: Q,
        abort: y,
        contentType: f,
        contentLength: this.method !== "HEAD" && E ? Number(E) : null,
        highWaterMark: M
      });
      this.removeAbortListener && p.on("close", this.removeAbortListener), this.callback = null, this.res = p, B !== null && (this.throwOnError && i >= 400 ? this.runInAsyncScope(
        n,
        null,
        { callback: B, body: p, contentType: f, statusCode: i, statusMessage: h, headers: L }
      ) : this.runInAsyncScope(B, null, null, {
        statusCode: i,
        headers: L,
        trailers: this.trailers,
        opaque: d,
        body: p,
        context: b
      }));
    }
    onData(i) {
      return this.res.push(i);
    }
    onComplete(i) {
      r.parseHeaders(i, this.trailers), this.res.push(null);
    }
    onError(i) {
      const { res: c, callback: Q, body: h, opaque: B } = this;
      Q && (this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, i, { opaque: B });
      })), c && (this.res = null, queueMicrotask(() => {
        r.destroy(c, i);
      })), h && (this.body = null, r.destroy(h, i)), this.removeAbortListener && (c?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null);
    }
  }
  function u(l, i) {
    if (i === void 0)
      return new Promise((c, Q) => {
        u.call(this, l, (h, B) => h ? Q(h) : c(B));
      });
    try {
      this.dispatch(l, new a(l, i));
    } catch (c) {
      if (typeof i != "function")
        throw c;
      const Q = l?.opaque;
      queueMicrotask(() => i(c, { opaque: Q }));
    }
  }
  return bA.exports = u, bA.exports.RequestHandler = a, bA.exports;
}
var xr, Oo;
function RA() {
  if (Oo) return xr;
  Oo = 1;
  const { addAbortListener: e } = Ue(), { RequestAbortedError: t } = Ye(), A = /* @__PURE__ */ Symbol("kListener"), s = /* @__PURE__ */ Symbol("kSignal");
  function r(a) {
    a.abort ? a.abort(a[s]?.reason) : a.reason = a[s]?.reason ?? new t(), o(a);
  }
  function n(a, u) {
    if (a.reason = null, a[s] = null, a[A] = null, !!u) {
      if (u.aborted) {
        r(a);
        return;
      }
      a[s] = u, a[A] = () => {
        r(a);
      }, e(a[s], a[A]);
    }
  }
  function o(a) {
    a[s] && ("removeEventListener" in a[s] ? a[s].removeEventListener("abort", a[A]) : a[s].removeListener("abort", a[A]), a[s] = null, a[A] = null);
  }
  return xr = {
    addSignal: n,
    removeSignal: o
  }, xr;
}
var Vr, Po;
function yg() {
  if (Po) return Vr;
  Po = 1;
  const e = He, { finished: t, PassThrough: A } = ot, { InvalidArgumentError: s, InvalidReturnValueError: r } = Ye(), n = Ue(), { getResolveErrorBodyCallback: o } = Jo(), { AsyncResource: a } = qt, { addSignal: u, removeSignal: l } = RA();
  class i extends a {
    constructor(h, B, d) {
      if (!h || typeof h != "object")
        throw new s("invalid opts");
      const { signal: y, method: b, opaque: F, body: M, onInfo: L, responseHeaders: N, throwOnError: f } = h;
      try {
        if (typeof d != "function")
          throw new s("invalid callback");
        if (typeof B != "function")
          throw new s("invalid factory");
        if (y && typeof y.on != "function" && typeof y.addEventListener != "function")
          throw new s("signal must be an EventEmitter or EventTarget");
        if (b === "CONNECT")
          throw new s("invalid method");
        if (L && typeof L != "function")
          throw new s("invalid onInfo callback");
        super("UNDICI_STREAM");
      } catch (E) {
        throw n.isStream(M) && n.destroy(M.on("error", n.nop), E), E;
      }
      this.responseHeaders = N || null, this.opaque = F || null, this.factory = B, this.callback = d, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = M, this.onInfo = L || null, this.throwOnError = f || !1, n.isStream(M) && M.on("error", (E) => {
        this.onError(E);
      }), u(this, y);
    }
    onConnect(h, B) {
      if (this.reason) {
        h(this.reason);
        return;
      }
      e(this.callback), this.abort = h, this.context = B;
    }
    onHeaders(h, B, d, y) {
      const { factory: b, opaque: F, context: M, callback: L, responseHeaders: N } = this, f = N === "raw" ? n.parseRawHeaders(B) : n.parseHeaders(B);
      if (h < 200) {
        this.onInfo && this.onInfo({ statusCode: h, headers: f });
        return;
      }
      this.factory = null;
      let E;
      if (this.throwOnError && h >= 400) {
        const C = (N === "raw" ? n.parseHeaders(B) : f)["content-type"];
        E = new A(), this.callback = null, this.runInAsyncScope(
          o,
          null,
          { callback: L, body: E, contentType: C, statusCode: h, statusMessage: y, headers: f }
        );
      } else {
        if (b === null)
          return;
        if (E = this.runInAsyncScope(b, null, {
          statusCode: h,
          headers: f,
          opaque: F,
          context: M
        }), !E || typeof E.write != "function" || typeof E.end != "function" || typeof E.on != "function")
          throw new r("expected Writable");
        t(E, { readable: !1 }, (g) => {
          const { callback: C, res: w, opaque: I, trailers: m, abort: D } = this;
          this.res = null, (g || !w.readable) && n.destroy(w, g), this.callback = null, this.runInAsyncScope(C, null, g || null, { opaque: I, trailers: m }), g && D();
        });
      }
      return E.on("drain", d), this.res = E, (E.writableNeedDrain !== void 0 ? E.writableNeedDrain : E._writableState?.needDrain) !== !0;
    }
    onData(h) {
      const { res: B } = this;
      return B ? B.write(h) : !0;
    }
    onComplete(h) {
      const { res: B } = this;
      l(this), B && (this.trailers = n.parseHeaders(h), B.end());
    }
    onError(h) {
      const { res: B, callback: d, opaque: y, body: b } = this;
      l(this), this.factory = null, B ? (this.res = null, n.destroy(B, h)) : d && (this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(d, null, h, { opaque: y });
      })), b && (this.body = null, n.destroy(b, h));
    }
  }
  function c(Q, h, B) {
    if (B === void 0)
      return new Promise((d, y) => {
        c.call(this, Q, h, (b, F) => b ? y(b) : d(F));
      });
    try {
      this.dispatch(Q, new i(Q, h, B));
    } catch (d) {
      if (typeof B != "function")
        throw d;
      const y = Q?.opaque;
      queueMicrotask(() => B(d, { opaque: y }));
    }
  }
  return Vr = c, Vr;
}
var Wr, _o;
function Dg() {
  if (_o) return Wr;
  _o = 1;
  const {
    Readable: e,
    Duplex: t,
    PassThrough: A
  } = ot, {
    InvalidArgumentError: s,
    InvalidReturnValueError: r,
    RequestAbortedError: n
  } = Ye(), o = Ue(), { AsyncResource: a } = qt, { addSignal: u, removeSignal: l } = RA(), i = He, c = /* @__PURE__ */ Symbol("resume");
  class Q extends e {
    constructor() {
      super({ autoDestroy: !0 }), this[c] = null;
    }
    _read() {
      const { [c]: b } = this;
      b && (this[c] = null, b());
    }
    _destroy(b, F) {
      this._read(), F(b);
    }
  }
  class h extends e {
    constructor(b) {
      super({ autoDestroy: !0 }), this[c] = b;
    }
    _read() {
      this[c]();
    }
    _destroy(b, F) {
      !b && !this._readableState.endEmitted && (b = new n()), F(b);
    }
  }
  class B extends a {
    constructor(b, F) {
      if (!b || typeof b != "object")
        throw new s("invalid opts");
      if (typeof F != "function")
        throw new s("invalid handler");
      const { signal: M, method: L, opaque: N, onInfo: f, responseHeaders: E } = b;
      if (M && typeof M.on != "function" && typeof M.addEventListener != "function")
        throw new s("signal must be an EventEmitter or EventTarget");
      if (L === "CONNECT")
        throw new s("invalid method");
      if (f && typeof f != "function")
        throw new s("invalid onInfo callback");
      super("UNDICI_PIPELINE"), this.opaque = N || null, this.responseHeaders = E || null, this.handler = F, this.abort = null, this.context = null, this.onInfo = f || null, this.req = new Q().on("error", o.nop), this.ret = new t({
        readableObjectMode: b.objectMode,
        autoDestroy: !0,
        read: () => {
          const { body: p } = this;
          p?.resume && p.resume();
        },
        write: (p, g, C) => {
          const { req: w } = this;
          w.push(p, g) || w._readableState.destroyed ? C() : w[c] = C;
        },
        destroy: (p, g) => {
          const { body: C, req: w, res: I, ret: m, abort: D } = this;
          !p && !m._readableState.endEmitted && (p = new n()), D && p && D(), o.destroy(C, p), o.destroy(w, p), o.destroy(I, p), l(this), g(p);
        }
      }).on("prefinish", () => {
        const { req: p } = this;
        p.push(null);
      }), this.res = null, u(this, M);
    }
    onConnect(b, F) {
      const { ret: M, res: L } = this;
      if (this.reason) {
        b(this.reason);
        return;
      }
      i(!L, "pipeline cannot be retried"), i(!M.destroyed), this.abort = b, this.context = F;
    }
    onHeaders(b, F, M) {
      const { opaque: L, handler: N, context: f } = this;
      if (b < 200) {
        if (this.onInfo) {
          const p = this.responseHeaders === "raw" ? o.parseRawHeaders(F) : o.parseHeaders(F);
          this.onInfo({ statusCode: b, headers: p });
        }
        return;
      }
      this.res = new h(M);
      let E;
      try {
        this.handler = null;
        const p = this.responseHeaders === "raw" ? o.parseRawHeaders(F) : o.parseHeaders(F);
        E = this.runInAsyncScope(N, null, {
          statusCode: b,
          headers: p,
          opaque: L,
          body: this.res,
          context: f
        });
      } catch (p) {
        throw this.res.on("error", o.nop), p;
      }
      if (!E || typeof E.on != "function")
        throw new r("expected Readable");
      E.on("data", (p) => {
        const { ret: g, body: C } = this;
        !g.push(p) && C.pause && C.pause();
      }).on("error", (p) => {
        const { ret: g } = this;
        o.destroy(g, p);
      }).on("end", () => {
        const { ret: p } = this;
        p.push(null);
      }).on("close", () => {
        const { ret: p } = this;
        p._readableState.ended || o.destroy(p, new n());
      }), this.body = E;
    }
    onData(b) {
      const { res: F } = this;
      return F.push(b);
    }
    onComplete(b) {
      const { res: F } = this;
      F.push(null);
    }
    onError(b) {
      const { ret: F } = this;
      this.handler = null, o.destroy(F, b);
    }
  }
  function d(y, b) {
    try {
      const F = new B(y, b);
      return this.dispatch({ ...y, body: F.req }, F), F.ret;
    } catch (F) {
      return new A().destroy(F);
    }
  }
  return Wr = d, Wr;
}
var qr, xo;
function bg() {
  if (xo) return qr;
  xo = 1;
  const { InvalidArgumentError: e, SocketError: t } = Ye(), { AsyncResource: A } = qt, s = Ue(), { addSignal: r, removeSignal: n } = RA(), o = He;
  class a extends A {
    constructor(i, c) {
      if (!i || typeof i != "object")
        throw new e("invalid opts");
      if (typeof c != "function")
        throw new e("invalid callback");
      const { signal: Q, opaque: h, responseHeaders: B } = i;
      if (Q && typeof Q.on != "function" && typeof Q.addEventListener != "function")
        throw new e("signal must be an EventEmitter or EventTarget");
      super("UNDICI_UPGRADE"), this.responseHeaders = B || null, this.opaque = h || null, this.callback = c, this.abort = null, this.context = null, r(this, Q);
    }
    onConnect(i, c) {
      if (this.reason) {
        i(this.reason);
        return;
      }
      o(this.callback), this.abort = i, this.context = null;
    }
    onHeaders() {
      throw new t("bad upgrade", null);
    }
    onUpgrade(i, c, Q) {
      o(i === 101);
      const { callback: h, opaque: B, context: d } = this;
      n(this), this.callback = null;
      const y = this.responseHeaders === "raw" ? s.parseRawHeaders(c) : s.parseHeaders(c);
      this.runInAsyncScope(h, null, null, {
        headers: y,
        socket: Q,
        opaque: B,
        context: d
      });
    }
    onError(i) {
      const { callback: c, opaque: Q } = this;
      n(this), c && (this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(c, null, i, { opaque: Q });
      }));
    }
  }
  function u(l, i) {
    if (i === void 0)
      return new Promise((c, Q) => {
        u.call(this, l, (h, B) => h ? Q(h) : c(B));
      });
    try {
      const c = new a(l, i);
      this.dispatch({
        ...l,
        method: l.method || "GET",
        upgrade: l.protocol || "Websocket"
      }, c);
    } catch (c) {
      if (typeof i != "function")
        throw c;
      const Q = l?.opaque;
      queueMicrotask(() => i(c, { opaque: Q }));
    }
  }
  return qr = u, qr;
}
var zr, Vo;
function Rg() {
  if (Vo) return zr;
  Vo = 1;
  const e = He, { AsyncResource: t } = qt, { InvalidArgumentError: A, SocketError: s } = Ye(), r = Ue(), { addSignal: n, removeSignal: o } = RA();
  class a extends t {
    constructor(i, c) {
      if (!i || typeof i != "object")
        throw new A("invalid opts");
      if (typeof c != "function")
        throw new A("invalid callback");
      const { signal: Q, opaque: h, responseHeaders: B } = i;
      if (Q && typeof Q.on != "function" && typeof Q.addEventListener != "function")
        throw new A("signal must be an EventEmitter or EventTarget");
      super("UNDICI_CONNECT"), this.opaque = h || null, this.responseHeaders = B || null, this.callback = c, this.abort = null, n(this, Q);
    }
    onConnect(i, c) {
      if (this.reason) {
        i(this.reason);
        return;
      }
      e(this.callback), this.abort = i, this.context = c;
    }
    onHeaders() {
      throw new s("bad connect", null);
    }
    onUpgrade(i, c, Q) {
      const { callback: h, opaque: B, context: d } = this;
      o(this), this.callback = null;
      let y = c;
      y != null && (y = this.responseHeaders === "raw" ? r.parseRawHeaders(c) : r.parseHeaders(c)), this.runInAsyncScope(h, null, null, {
        statusCode: i,
        headers: y,
        socket: Q,
        opaque: B,
        context: d
      });
    }
    onError(i) {
      const { callback: c, opaque: Q } = this;
      o(this), c && (this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(c, null, i, { opaque: Q });
      }));
    }
  }
  function u(l, i) {
    if (i === void 0)
      return new Promise((c, Q) => {
        u.call(this, l, (h, B) => h ? Q(h) : c(B));
      });
    try {
      const c = new a(l, i);
      this.dispatch({ ...l, method: "CONNECT" }, c);
    } catch (c) {
      if (typeof i != "function")
        throw c;
      const Q = l?.opaque;
      queueMicrotask(() => i(c, { opaque: Q }));
    }
  }
  return zr = u, zr;
}
var Wo;
function kg() {
  return Wo || (Wo = 1, St.request = mg(), St.stream = yg(), St.pipeline = Dg(), St.upgrade = bg(), St.connect = Rg()), St;
}
var Zr, qo;
function zo() {
  if (qo) return Zr;
  qo = 1;
  const { UndiciError: e } = Ye(), t = /* @__PURE__ */ Symbol.for("undici.error.UND_MOCK_ERR_MOCK_NOT_MATCHED");
  class A extends e {
    constructor(r) {
      super(r), Error.captureStackTrace(this, A), this.name = "MockNotMatchedError", this.message = r || "The request does not match any registered mock dispatches", this.code = "UND_MOCK_ERR_MOCK_NOT_MATCHED";
    }
    static [Symbol.hasInstance](r) {
      return r && r[t] === !0;
    }
    [t] = !0;
  }
  return Zr = {
    MockNotMatchedError: A
  }, Zr;
}
var Kr, Zo;
function rA() {
  return Zo || (Zo = 1, Kr = {
    kAgent: /* @__PURE__ */ Symbol("agent"),
    kOptions: /* @__PURE__ */ Symbol("options"),
    kFactory: /* @__PURE__ */ Symbol("factory"),
    kDispatches: /* @__PURE__ */ Symbol("dispatches"),
    kDispatchKey: /* @__PURE__ */ Symbol("dispatch key"),
    kDefaultHeaders: /* @__PURE__ */ Symbol("default headers"),
    kDefaultTrailers: /* @__PURE__ */ Symbol("default trailers"),
    kContentLength: /* @__PURE__ */ Symbol("content length"),
    kMockAgent: /* @__PURE__ */ Symbol("mock agent"),
    kMockAgentSet: /* @__PURE__ */ Symbol("mock agent set"),
    kMockAgentGet: /* @__PURE__ */ Symbol("mock agent get"),
    kMockDispatch: /* @__PURE__ */ Symbol("mock dispatch"),
    kClose: /* @__PURE__ */ Symbol("close"),
    kOriginalClose: /* @__PURE__ */ Symbol("original agent close"),
    kOrigin: /* @__PURE__ */ Symbol("origin"),
    kIsMockActive: /* @__PURE__ */ Symbol("is mock active"),
    kNetConnect: /* @__PURE__ */ Symbol("net connect"),
    kGetNetConnect: /* @__PURE__ */ Symbol("get net connect"),
    kConnected: /* @__PURE__ */ Symbol("connected")
  }), Kr;
}
var jr, Ko;
function kA() {
  if (Ko) return jr;
  Ko = 1;
  const { MockNotMatchedError: e } = zo(), {
    kDispatches: t,
    kMockAgent: A,
    kOriginalDispatch: s,
    kOrigin: r,
    kGetNetConnect: n
  } = rA(), { buildURL: o } = Ue(), { STATUS_CODES: a } = fA, {
    types: {
      isPromise: u
    }
  } = rt;
  function l(I, m) {
    return typeof I == "string" ? I === m : I instanceof RegExp ? I.test(m) : typeof I == "function" ? I(m) === !0 : !1;
  }
  function i(I) {
    return Object.fromEntries(
      Object.entries(I).map(([m, D]) => [m.toLocaleLowerCase(), D])
    );
  }
  function c(I, m) {
    if (Array.isArray(I)) {
      for (let D = 0; D < I.length; D += 2)
        if (I[D].toLocaleLowerCase() === m.toLocaleLowerCase())
          return I[D + 1];
      return;
    } else return typeof I.get == "function" ? I.get(m) : i(I)[m.toLocaleLowerCase()];
  }
  function Q(I) {
    const m = I.slice(), D = [];
    for (let U = 0; U < m.length; U += 2)
      D.push([m[U], m[U + 1]]);
    return Object.fromEntries(D);
  }
  function h(I, m) {
    if (typeof I.headers == "function")
      return Array.isArray(m) && (m = Q(m)), I.headers(m ? i(m) : {});
    if (typeof I.headers > "u")
      return !0;
    if (typeof m != "object" || typeof I.headers != "object")
      return !1;
    for (const [D, U] of Object.entries(I.headers)) {
      const S = c(m, D);
      if (!l(U, S))
        return !1;
    }
    return !0;
  }
  function B(I) {
    if (typeof I != "string")
      return I;
    const m = I.split("?");
    if (m.length !== 2)
      return I;
    const D = new URLSearchParams(m.pop());
    return D.sort(), [...m, D.toString()].join("?");
  }
  function d(I, { path: m, method: D, body: U, headers: S }) {
    const G = l(I.path, m), v = l(I.method, D), $ = typeof I.body < "u" ? l(I.body, U) : !0, ne = h(I, S);
    return G && v && $ && ne;
  }
  function y(I) {
    return Buffer.isBuffer(I) || I instanceof Uint8Array || I instanceof ArrayBuffer ? I : typeof I == "object" ? JSON.stringify(I) : I.toString();
  }
  function b(I, m) {
    const D = m.query ? o(m.path, m.query) : m.path, U = typeof D == "string" ? B(D) : D;
    let S = I.filter(({ consumed: G }) => !G).filter(({ path: G }) => l(B(G), U));
    if (S.length === 0)
      throw new e(`Mock dispatch not matched for path '${U}'`);
    if (S = S.filter(({ method: G }) => l(G, m.method)), S.length === 0)
      throw new e(`Mock dispatch not matched for method '${m.method}' on path '${U}'`);
    if (S = S.filter(({ body: G }) => typeof G < "u" ? l(G, m.body) : !0), S.length === 0)
      throw new e(`Mock dispatch not matched for body '${m.body}' on path '${U}'`);
    if (S = S.filter((G) => h(G, m.headers)), S.length === 0) {
      const G = typeof m.headers == "object" ? JSON.stringify(m.headers) : m.headers;
      throw new e(`Mock dispatch not matched for headers '${G}' on path '${U}'`);
    }
    return S[0];
  }
  function F(I, m, D) {
    const U = { timesInvoked: 0, times: 1, persist: !1, consumed: !1 }, S = typeof D == "function" ? { callback: D } : { ...D }, G = { ...U, ...m, pending: !0, data: { error: null, ...S } };
    return I.push(G), G;
  }
  function M(I, m) {
    const D = I.findIndex((U) => U.consumed ? d(U, m) : !1);
    D !== -1 && I.splice(D, 1);
  }
  function L(I) {
    const { path: m, method: D, body: U, headers: S, query: G } = I;
    return {
      path: m,
      method: D,
      body: U,
      headers: S,
      query: G
    };
  }
  function N(I) {
    const m = Object.keys(I), D = [];
    for (let U = 0; U < m.length; ++U) {
      const S = m[U], G = I[S], v = Buffer.from(`${S}`);
      if (Array.isArray(G))
        for (let $ = 0; $ < G.length; ++$)
          D.push(v, Buffer.from(`${G[$]}`));
      else
        D.push(v, Buffer.from(`${G}`));
    }
    return D;
  }
  function f(I) {
    return a[I] || "unknown";
  }
  async function E(I) {
    const m = [];
    for await (const D of I)
      m.push(D);
    return Buffer.concat(m).toString("utf8");
  }
  function p(I, m) {
    const D = L(I), U = b(this[t], D);
    U.timesInvoked++, U.data.callback && (U.data = { ...U.data, ...U.data.callback(I) });
    const { data: { statusCode: S, data: G, headers: v, trailers: $, error: ne }, delay: ge, persist: ae } = U, { timesInvoked: Be, times: he } = U;
    if (U.consumed = !ae && Be >= he, U.pending = Be < he, ne !== null)
      return M(this[t], D), m.onError(ne), !0;
    typeof ge == "number" && ge > 0 ? setTimeout(() => {
      Qe(this[t]);
    }, ge) : Qe(this[t]);
    function Qe(we, X = G) {
      const W = Array.isArray(I.headers) ? Q(I.headers) : I.headers, re = typeof X == "function" ? X({ ...I, headers: W }) : X;
      if (u(re)) {
        re.then((Z) => Qe(we, Z));
        return;
      }
      const J = y(re), V = N(v), P = N($);
      m.onConnect?.((Z) => m.onError(Z), null), m.onHeaders?.(S, V, ye, f(S)), m.onData?.(Buffer.from(J)), m.onComplete?.(P), M(we, D);
    }
    function ye() {
    }
    return !0;
  }
  function g() {
    const I = this[A], m = this[r], D = this[s];
    return function(S, G) {
      if (I.isMockActive)
        try {
          p.call(this, S, G);
        } catch (v) {
          if (v instanceof e) {
            const $ = I[n]();
            if ($ === !1)
              throw new e(`${v.message}: subsequent request to origin ${m} was not allowed (net.connect disabled)`);
            if (C($, m))
              D.call(this, S, G);
            else
              throw new e(`${v.message}: subsequent request to origin ${m} was not allowed (net.connect is not enabled for this origin)`);
          } else
            throw v;
        }
      else
        D.call(this, S, G);
    };
  }
  function C(I, m) {
    const D = new URL(m);
    return I === !0 ? !0 : !!(Array.isArray(I) && I.some((U) => l(U, D.host)));
  }
  function w(I) {
    if (I) {
      const { agent: m, ...D } = I;
      return D;
    }
  }
  return jr = {
    getResponseData: y,
    getMockDispatch: b,
    addMockDispatch: F,
    deleteMockDispatch: M,
    buildKey: L,
    generateKeyValues: N,
    matchValue: l,
    getResponse: E,
    getStatusText: f,
    mockDispatch: p,
    buildMockDispatch: g,
    checkNetConnect: C,
    buildMockOptions: w,
    getHeaderByName: c,
    buildHeadersFromArray: Q
  }, jr;
}
var FA = {}, jo;
function Xo() {
  if (jo) return FA;
  jo = 1;
  const { getResponseData: e, buildKey: t, addMockDispatch: A } = kA(), {
    kDispatches: s,
    kDispatchKey: r,
    kDefaultHeaders: n,
    kDefaultTrailers: o,
    kContentLength: a,
    kMockDispatch: u
  } = rA(), { InvalidArgumentError: l } = Ye(), { buildURL: i } = Ue();
  class c {
    constructor(B) {
      this[u] = B;
    }
    /**
     * Delay a reply by a set amount in ms.
     */
    delay(B) {
      if (typeof B != "number" || !Number.isInteger(B) || B <= 0)
        throw new l("waitInMs must be a valid integer > 0");
      return this[u].delay = B, this;
    }
    /**
     * For a defined reply, never mark as consumed.
     */
    persist() {
      return this[u].persist = !0, this;
    }
    /**
     * Allow one to define a reply for a set amount of matching requests.
     */
    times(B) {
      if (typeof B != "number" || !Number.isInteger(B) || B <= 0)
        throw new l("repeatTimes must be a valid integer > 0");
      return this[u].times = B, this;
    }
  }
  class Q {
    constructor(B, d) {
      if (typeof B != "object")
        throw new l("opts must be an object");
      if (typeof B.path > "u")
        throw new l("opts.path must be defined");
      if (typeof B.method > "u" && (B.method = "GET"), typeof B.path == "string")
        if (B.query)
          B.path = i(B.path, B.query);
        else {
          const y = new URL(B.path, "data://");
          B.path = y.pathname + y.search;
        }
      typeof B.method == "string" && (B.method = B.method.toUpperCase()), this[r] = t(B), this[s] = d, this[n] = {}, this[o] = {}, this[a] = !1;
    }
    createMockScopeDispatchData({ statusCode: B, data: d, responseOptions: y }) {
      const b = e(d), F = this[a] ? { "content-length": b.length } : {}, M = { ...this[n], ...F, ...y.headers }, L = { ...this[o], ...y.trailers };
      return { statusCode: B, data: d, headers: M, trailers: L };
    }
    validateReplyParameters(B) {
      if (typeof B.statusCode > "u")
        throw new l("statusCode must be defined");
      if (typeof B.responseOptions != "object" || B.responseOptions === null)
        throw new l("responseOptions must be an object");
    }
    /**
     * Mock an undici request with a defined reply.
     */
    reply(B) {
      if (typeof B == "function") {
        const F = (L) => {
          const N = B(L);
          if (typeof N != "object" || N === null)
            throw new l("reply options callback must return an object");
          const f = { data: "", responseOptions: {}, ...N };
          return this.validateReplyParameters(f), {
            ...this.createMockScopeDispatchData(f)
          };
        }, M = A(this[s], this[r], F);
        return new c(M);
      }
      const d = {
        statusCode: B,
        data: arguments[1] === void 0 ? "" : arguments[1],
        responseOptions: arguments[2] === void 0 ? {} : arguments[2]
      };
      this.validateReplyParameters(d);
      const y = this.createMockScopeDispatchData(d), b = A(this[s], this[r], y);
      return new c(b);
    }
    /**
     * Mock an undici request with a defined error.
     */
    replyWithError(B) {
      if (typeof B > "u")
        throw new l("error must be defined");
      const d = A(this[s], this[r], { error: B });
      return new c(d);
    }
    /**
     * Set default reply headers on the interceptor for subsequent replies
     */
    defaultReplyHeaders(B) {
      if (typeof B > "u")
        throw new l("headers must be defined");
      return this[n] = B, this;
    }
    /**
     * Set default reply trailers on the interceptor for subsequent replies
     */
    defaultReplyTrailers(B) {
      if (typeof B > "u")
        throw new l("trailers must be defined");
      return this[o] = B, this;
    }
    /**
     * Set reply content length header for replies on the interceptor
     */
    replyContentLength() {
      return this[a] = !0, this;
    }
  }
  return FA.MockInterceptor = Q, FA.MockScope = c, FA;
}
var Xr, $o;
function ei() {
  if ($o) return Xr;
  $o = 1;
  const { promisify: e } = rt, t = eA(), { buildMockDispatch: A } = kA(), {
    kDispatches: s,
    kMockAgent: r,
    kClose: n,
    kOriginalClose: o,
    kOrigin: a,
    kOriginalDispatch: u,
    kConnected: l
  } = rA(), { MockInterceptor: i } = Xo(), c = Ve(), { InvalidArgumentError: Q } = Ye();
  class h extends t {
    constructor(d, y) {
      if (super(d, y), !y || !y.agent || typeof y.agent.dispatch != "function")
        throw new Q("Argument opts.agent must implement Agent");
      this[r] = y.agent, this[a] = d, this[s] = [], this[l] = 1, this[u] = this.dispatch, this[o] = this.close.bind(this), this.dispatch = A.call(this), this.close = this[n];
    }
    get [c.kConnected]() {
      return this[l];
    }
    /**
     * Sets up the base interceptor for mocking replies from undici.
     */
    intercept(d) {
      return new i(d, this[s]);
    }
    async [n]() {
      await e(this[o])(), this[l] = 0, this[r][c.kClients].delete(this[a]);
    }
  }
  return Xr = h, Xr;
}
var $r, ti;
function Ai() {
  if (ti) return $r;
  ti = 1;
  const { promisify: e } = rt, t = tA(), { buildMockDispatch: A } = kA(), {
    kDispatches: s,
    kMockAgent: r,
    kClose: n,
    kOriginalClose: o,
    kOrigin: a,
    kOriginalDispatch: u,
    kConnected: l
  } = rA(), { MockInterceptor: i } = Xo(), c = Ve(), { InvalidArgumentError: Q } = Ye();
  class h extends t {
    constructor(d, y) {
      if (super(d, y), !y || !y.agent || typeof y.agent.dispatch != "function")
        throw new Q("Argument opts.agent must implement Agent");
      this[r] = y.agent, this[a] = d, this[s] = [], this[l] = 1, this[u] = this.dispatch, this[o] = this.close.bind(this), this.dispatch = A.call(this), this.close = this[n];
    }
    get [c.kConnected]() {
      return this[l];
    }
    /**
     * Sets up the base interceptor for mocking replies from undici.
     */
    intercept(d) {
      return new i(d, this[s]);
    }
    async [n]() {
      await e(this[o])(), this[l] = 0, this[r][c.kClients].delete(this[a]);
    }
  }
  return $r = h, $r;
}
var es, ri;
function Fg() {
  if (ri) return es;
  ri = 1;
  const e = {
    pronoun: "it",
    is: "is",
    was: "was",
    this: "this"
  }, t = {
    pronoun: "they",
    is: "are",
    was: "were",
    this: "these"
  };
  return es = class {
    constructor(s, r) {
      this.singular = s, this.plural = r;
    }
    pluralize(s) {
      const r = s === 1, n = r ? e : t, o = r ? this.singular : this.plural;
      return { ...n, count: s, noun: o };
    }
  }, es;
}
var ts, si;
function Tg() {
  if (si) return ts;
  si = 1;
  const { Transform: e } = ot, { Console: t } = jc, A = process.versions.icu ? "\u2705" : "Y ", s = process.versions.icu ? "\u274C" : "N ";
  return ts = class {
    constructor({ disableColors: n } = {}) {
      this.transform = new e({
        transform(o, a, u) {
          u(null, o);
        }
      }), this.logger = new t({
        stdout: this.transform,
        inspectOptions: {
          colors: !n && !process.env.CI
        }
      });
    }
    format(n) {
      const o = n.map(
        ({ method: a, path: u, data: { statusCode: l }, persist: i, times: c, timesInvoked: Q, origin: h }) => ({
          Method: a,
          Origin: h,
          Path: u,
          "Status code": l,
          Persistent: i ? A : s,
          Invocations: Q,
          Remaining: i ? 1 / 0 : c - Q
        })
      );
      return this.logger.table(o), this.transform.read().toString();
    }
  }, ts;
}
var As, ni;
function Sg() {
  if (ni) return As;
  ni = 1;
  const { kClients: e } = Ve(), t = AA(), {
    kAgent: A,
    kMockAgentSet: s,
    kMockAgentGet: r,
    kDispatches: n,
    kIsMockActive: o,
    kNetConnect: a,
    kGetNetConnect: u,
    kOptions: l,
    kFactory: i
  } = rA(), c = ei(), Q = Ai(), { matchValue: h, buildMockOptions: B } = kA(), { InvalidArgumentError: d, UndiciError: y } = Ye(), b = wA(), F = Fg(), M = Tg();
  class L extends b {
    constructor(f) {
      if (super(f), this[a] = !0, this[o] = !0, f?.agent && typeof f.agent.dispatch != "function")
        throw new d("Argument opts.agent must implement Agent");
      const E = f?.agent ? f.agent : new t(f);
      this[A] = E, this[e] = E[e], this[l] = B(f);
    }
    get(f) {
      let E = this[r](f);
      return E || (E = this[i](f), this[s](f, E)), E;
    }
    dispatch(f, E) {
      return this.get(f.origin), this[A].dispatch(f, E);
    }
    async close() {
      await this[A].close(), this[e].clear();
    }
    deactivate() {
      this[o] = !1;
    }
    activate() {
      this[o] = !0;
    }
    enableNetConnect(f) {
      if (typeof f == "string" || typeof f == "function" || f instanceof RegExp)
        Array.isArray(this[a]) ? this[a].push(f) : this[a] = [f];
      else if (typeof f > "u")
        this[a] = !0;
      else
        throw new d("Unsupported matcher. Must be one of String|Function|RegExp.");
    }
    disableNetConnect() {
      this[a] = !1;
    }
    // This is required to bypass issues caused by using global symbols - see:
    // https://github.com/nodejs/undici/issues/1447
    get isMockActive() {
      return this[o];
    }
    [s](f, E) {
      this[e].set(f, E);
    }
    [i](f) {
      const E = Object.assign({ agent: this }, this[l]);
      return this[l] && this[l].connections === 1 ? new c(f, E) : new Q(f, E);
    }
    [r](f) {
      const E = this[e].get(f);
      if (E)
        return E;
      if (typeof f != "string") {
        const p = this[i]("http://localhost:9999");
        return this[s](f, p), p;
      }
      for (const [p, g] of Array.from(this[e]))
        if (g && typeof p != "string" && h(p, f)) {
          const C = this[i](f);
          return this[s](f, C), C[n] = g[n], C;
        }
    }
    [u]() {
      return this[a];
    }
    pendingInterceptors() {
      const f = this[e];
      return Array.from(f.entries()).flatMap(([E, p]) => p[n].map((g) => ({ ...g, origin: E }))).filter(({ pending: E }) => E);
    }
    assertNoPendingInterceptors({ pendingInterceptorsFormatter: f = new M() } = {}) {
      const E = this.pendingInterceptors();
      if (E.length === 0)
        return;
      const p = new F("interceptor", "interceptors").pluralize(E.length);
      throw new y(`
${p.count} ${p.noun} ${p.is} pending:

${f.format(E)}
`.trim());
    }
  }
  return As = L, As;
}
var rs, oi;
function ss() {
  if (oi) return rs;
  oi = 1;
  const e = /* @__PURE__ */ Symbol.for("undici.globalDispatcher.1"), { InvalidArgumentError: t } = Ye(), A = AA();
  r() === void 0 && s(new A());
  function s(n) {
    if (!n || typeof n.dispatch != "function")
      throw new t("Argument agent must implement Agent");
    Object.defineProperty(globalThis, e, {
      value: n,
      writable: !0,
      enumerable: !1,
      configurable: !1
    });
  }
  function r() {
    return globalThis[e];
  }
  return rs = {
    setGlobalDispatcher: s,
    getGlobalDispatcher: r
  }, rs;
}
var ns, ii;
function os() {
  return ii || (ii = 1, ns = class {
    #e;
    constructor(t) {
      if (typeof t != "object" || t === null)
        throw new TypeError("handler must be an object");
      this.#e = t;
    }
    onConnect(...t) {
      return this.#e.onConnect?.(...t);
    }
    onError(...t) {
      return this.#e.onError?.(...t);
    }
    onUpgrade(...t) {
      return this.#e.onUpgrade?.(...t);
    }
    onResponseStarted(...t) {
      return this.#e.onResponseStarted?.(...t);
    }
    onHeaders(...t) {
      return this.#e.onHeaders?.(...t);
    }
    onData(...t) {
      return this.#e.onData?.(...t);
    }
    onComplete(...t) {
      return this.#e.onComplete?.(...t);
    }
    onBodySent(...t) {
      return this.#e.onBodySent?.(...t);
    }
  }), ns;
}
var is, ai;
function Ug() {
  if (ai) return is;
  ai = 1;
  const e = Rr();
  return is = (t) => {
    const A = t?.maxRedirections;
    return (s) => function(n, o) {
      const { maxRedirections: a = A, ...u } = n;
      if (!a)
        return s(n, o);
      const l = new e(
        s,
        a,
        n,
        o
      );
      return s(u, l);
    };
  }, is;
}
var as, ci;
function Ng() {
  if (ci) return as;
  ci = 1;
  const e = Hr();
  return as = (t) => (A) => function(r, n) {
    return A(
      r,
      new e(
        { ...r, retryOptions: { ...t, ...r.retryOptions } },
        {
          handler: n,
          dispatch: A
        }
      )
    );
  }, as;
}
var cs, gi;
function Mg() {
  if (gi) return cs;
  gi = 1;
  const e = Ue(), { InvalidArgumentError: t, RequestAbortedError: A } = Ye(), s = os();
  class r extends s {
    #e = 1024 * 1024;
    #t = null;
    #s = !1;
    #r = !1;
    #A = 0;
    #n = null;
    #o = null;
    constructor({ maxSize: a }, u) {
      if (super(u), a != null && (!Number.isFinite(a) || a < 1))
        throw new t("maxSize must be a number greater than 0");
      this.#e = a ?? this.#e, this.#o = u;
    }
    onConnect(a) {
      this.#t = a, this.#o.onConnect(this.#i.bind(this));
    }
    #i(a) {
      this.#r = !0, this.#n = a;
    }
    // TODO: will require adjustment after new hooks are out
    onHeaders(a, u, l, i) {
      const Q = e.parseHeaders(u)["content-length"];
      if (Q != null && Q > this.#e)
        throw new A(
          `Response size (${Q}) larger than maxSize (${this.#e})`
        );
      return this.#r ? !0 : this.#o.onHeaders(
        a,
        u,
        l,
        i
      );
    }
    onError(a) {
      this.#s || (a = this.#n ?? a, this.#o.onError(a));
    }
    onData(a) {
      return this.#A = this.#A + a.length, this.#A >= this.#e && (this.#s = !0, this.#r ? this.#o.onError(this.#n) : this.#o.onComplete([])), !0;
    }
    onComplete(a) {
      if (!this.#s) {
        if (this.#r) {
          this.#o.onError(this.reason);
          return;
        }
        this.#o.onComplete(a);
      }
    }
  }
  function n({ maxSize: o } = {
    maxSize: 1024 * 1024
  }) {
    return (a) => function(l, i) {
      const { dumpMaxSize: c = o } = l, Q = new r(
        { maxSize: c },
        i
      );
      return a(l, Q);
    };
  }
  return cs = n, cs;
}
var gs, li;
function Lg() {
  if (li) return gs;
  li = 1;
  const { isIP: e } = dA, { lookup: t } = Xc, A = os(), { InvalidArgumentError: s, InformationalError: r } = Ye(), n = Math.pow(2, 31) - 1;
  class o {
    #e = 0;
    #t = 0;
    #s = /* @__PURE__ */ new Map();
    dualStack = !0;
    affinity = null;
    lookup = null;
    pick = null;
    constructor(l) {
      this.#e = l.maxTTL, this.#t = l.maxItems, this.dualStack = l.dualStack, this.affinity = l.affinity, this.lookup = l.lookup ?? this.#r, this.pick = l.pick ?? this.#A;
    }
    get full() {
      return this.#s.size === this.#t;
    }
    runLookup(l, i, c) {
      const Q = this.#s.get(l.hostname);
      if (Q == null && this.full) {
        c(null, l.origin);
        return;
      }
      const h = {
        affinity: this.affinity,
        dualStack: this.dualStack,
        lookup: this.lookup,
        pick: this.pick,
        ...i.dns,
        maxTTL: this.#e,
        maxItems: this.#t
      };
      if (Q == null)
        this.lookup(l, h, (B, d) => {
          if (B || d == null || d.length === 0) {
            c(B ?? new r("No DNS entries found"));
            return;
          }
          this.setRecords(l, d);
          const y = this.#s.get(l.hostname), b = this.pick(
            l,
            y,
            h.affinity
          );
          let F;
          typeof b.port == "number" ? F = `:${b.port}` : l.port !== "" ? F = `:${l.port}` : F = "", c(
            null,
            `${l.protocol}//${b.family === 6 ? `[${b.address}]` : b.address}${F}`
          );
        });
      else {
        const B = this.pick(
          l,
          Q,
          h.affinity
        );
        if (B == null) {
          this.#s.delete(l.hostname), this.runLookup(l, i, c);
          return;
        }
        let d;
        typeof B.port == "number" ? d = `:${B.port}` : l.port !== "" ? d = `:${l.port}` : d = "", c(
          null,
          `${l.protocol}//${B.family === 6 ? `[${B.address}]` : B.address}${d}`
        );
      }
    }
    #r(l, i, c) {
      t(
        l.hostname,
        {
          all: !0,
          family: this.dualStack === !1 ? this.affinity : 0,
          order: "ipv4first"
        },
        (Q, h) => {
          if (Q)
            return c(Q);
          const B = /* @__PURE__ */ new Map();
          for (const d of h)
            B.set(`${d.address}:${d.family}`, d);
          c(null, B.values());
        }
      );
    }
    #A(l, i, c) {
      let Q = null;
      const { records: h, offset: B } = i;
      let d;
      if (this.dualStack ? (c == null && (B == null || B === n ? (i.offset = 0, c = 4) : (i.offset++, c = (i.offset & 1) === 1 ? 6 : 4)), h[c] != null && h[c].ips.length > 0 ? d = h[c] : d = h[c === 4 ? 6 : 4]) : d = h[c], d == null || d.ips.length === 0)
        return Q;
      d.offset == null || d.offset === n ? d.offset = 0 : d.offset++;
      const y = d.offset % d.ips.length;
      return Q = d.ips[y] ?? null, Q == null ? Q : Date.now() - Q.timestamp > Q.ttl ? (d.ips.splice(y, 1), this.pick(l, i, c)) : Q;
    }
    setRecords(l, i) {
      const c = Date.now(), Q = { records: { 4: null, 6: null } };
      for (const h of i) {
        h.timestamp = c, typeof h.ttl == "number" ? h.ttl = Math.min(h.ttl, this.#e) : h.ttl = this.#e;
        const B = Q.records[h.family] ?? { ips: [] };
        B.ips.push(h), Q.records[h.family] = B;
      }
      this.#s.set(l.hostname, Q);
    }
    getHandler(l, i) {
      return new a(this, l, i);
    }
  }
  class a extends A {
    #e = null;
    #t = null;
    #s = null;
    #r = null;
    #A = null;
    constructor(l, { origin: i, handler: c, dispatch: Q }, h) {
      super(c), this.#A = i, this.#r = c, this.#t = { ...h }, this.#e = l, this.#s = Q;
    }
    onError(l) {
      switch (l.code) {
        case "ETIMEDOUT":
        case "ECONNREFUSED": {
          if (this.#e.dualStack) {
            this.#e.runLookup(this.#A, this.#t, (i, c) => {
              if (i)
                return this.#r.onError(i);
              const Q = {
                ...this.#t,
                origin: c
              };
              this.#s(Q, this);
            });
            return;
          }
          this.#r.onError(l);
          return;
        }
        case "ENOTFOUND":
          this.#e.deleteRecord(this.#A);
        // eslint-disable-next-line no-fallthrough
        default:
          this.#r.onError(l);
          break;
      }
    }
  }
  return gs = (u) => {
    if (u?.maxTTL != null && (typeof u?.maxTTL != "number" || u?.maxTTL < 0))
      throw new s("Invalid maxTTL. Must be a positive number");
    if (u?.maxItems != null && (typeof u?.maxItems != "number" || u?.maxItems < 1))
      throw new s(
        "Invalid maxItems. Must be a positive number and greater than zero"
      );
    if (u?.affinity != null && u?.affinity !== 4 && u?.affinity !== 6)
      throw new s("Invalid affinity. Must be either 4 or 6");
    if (u?.dualStack != null && typeof u?.dualStack != "boolean")
      throw new s("Invalid dualStack. Must be a boolean");
    if (u?.lookup != null && typeof u?.lookup != "function")
      throw new s("Invalid lookup. Must be a function");
    if (u?.pick != null && typeof u?.pick != "function")
      throw new s("Invalid pick. Must be a function");
    const l = u?.dualStack ?? !0;
    let i;
    l ? i = u?.affinity ?? null : i = u?.affinity ?? 4;
    const c = {
      maxTTL: u?.maxTTL ?? 1e4,
      // Expressed in ms
      lookup: u?.lookup ?? null,
      pick: u?.pick ?? null,
      dualStack: l,
      affinity: i,
      maxItems: u?.maxItems ?? 1 / 0
    }, Q = new o(c);
    return (h) => function(d, y) {
      const b = d.origin.constructor === URL ? d.origin : new URL(d.origin);
      return e(b.hostname) !== 0 ? h(d, y) : (Q.runLookup(b, d, (F, M) => {
        if (F)
          return y.onError(F);
        let L = null;
        L = {
          ...d,
          servername: b.hostname,
          // For SNI on TLS
          origin: M,
          headers: {
            host: b.hostname,
            ...d.headers
          }
        }, h(
          L,
          Q.getHandler({ origin: b, dispatch: h, handler: y }, d)
        );
      }), !0);
    };
  }, gs;
}
var ls, ui;
function Yt() {
  if (ui) return ls;
  ui = 1;
  const { kConstruct: e } = Ve(), { kEnumerableProperty: t } = Ue(), {
    iteratorMixin: A,
    isValidHeaderName: s,
    isValidHeaderValue: r
  } = it(), { webidl: n } = $e(), o = He, a = rt, u = /* @__PURE__ */ Symbol("headers map"), l = /* @__PURE__ */ Symbol("headers map sorted");
  function i(N) {
    return N === 10 || N === 13 || N === 9 || N === 32;
  }
  function c(N) {
    let f = 0, E = N.length;
    for (; E > f && i(N.charCodeAt(E - 1)); ) --E;
    for (; E > f && i(N.charCodeAt(f)); ) ++f;
    return f === 0 && E === N.length ? N : N.substring(f, E);
  }
  function Q(N, f) {
    if (Array.isArray(f))
      for (let E = 0; E < f.length; ++E) {
        const p = f[E];
        if (p.length !== 2)
          throw n.errors.exception({
            header: "Headers constructor",
            message: `expected name/value pair to be length 2, found ${p.length}.`
          });
        h(N, p[0], p[1]);
      }
    else if (typeof f == "object" && f !== null) {
      const E = Object.keys(f);
      for (let p = 0; p < E.length; ++p)
        h(N, E[p], f[E[p]]);
    } else
      throw n.errors.conversionFailed({
        prefix: "Headers constructor",
        argument: "Argument 1",
        types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
      });
  }
  function h(N, f, E) {
    if (E = c(E), s(f)) {
      if (!r(E))
        throw n.errors.invalidArgument({
          prefix: "Headers.append",
          value: E,
          type: "header value"
        });
    } else throw n.errors.invalidArgument({
      prefix: "Headers.append",
      value: f,
      type: "header name"
    });
    if (b(N) === "immutable")
      throw new TypeError("immutable");
    return M(N).append(f, E, !1);
  }
  function B(N, f) {
    return N[0] < f[0] ? -1 : 1;
  }
  class d {
    /** @type {[string, string][]|null} */
    cookies = null;
    constructor(f) {
      f instanceof d ? (this[u] = new Map(f[u]), this[l] = f[l], this.cookies = f.cookies === null ? null : [...f.cookies]) : (this[u] = new Map(f), this[l] = null);
    }
    /**
     * @see https://fetch.spec.whatwg.org/#header-list-contains
     * @param {string} name
     * @param {boolean} isLowerCase
     */
    contains(f, E) {
      return this[u].has(E ? f : f.toLowerCase());
    }
    clear() {
      this[u].clear(), this[l] = null, this.cookies = null;
    }
    /**
     * @see https://fetch.spec.whatwg.org/#concept-header-list-append
     * @param {string} name
     * @param {string} value
     * @param {boolean} isLowerCase
     */
    append(f, E, p) {
      this[l] = null;
      const g = p ? f : f.toLowerCase(), C = this[u].get(g);
      if (C) {
        const w = g === "cookie" ? "; " : ", ";
        this[u].set(g, {
          name: C.name,
          value: `${C.value}${w}${E}`
        });
      } else
        this[u].set(g, { name: f, value: E });
      g === "set-cookie" && (this.cookies ??= []).push(E);
    }
    /**
     * @see https://fetch.spec.whatwg.org/#concept-header-list-set
     * @param {string} name
     * @param {string} value
     * @param {boolean} isLowerCase
     */
    set(f, E, p) {
      this[l] = null;
      const g = p ? f : f.toLowerCase();
      g === "set-cookie" && (this.cookies = [E]), this[u].set(g, { name: f, value: E });
    }
    /**
     * @see https://fetch.spec.whatwg.org/#concept-header-list-delete
     * @param {string} name
     * @param {boolean} isLowerCase
     */
    delete(f, E) {
      this[l] = null, E || (f = f.toLowerCase()), f === "set-cookie" && (this.cookies = null), this[u].delete(f);
    }
    /**
     * @see https://fetch.spec.whatwg.org/#concept-header-list-get
     * @param {string} name
     * @param {boolean} isLowerCase
     * @returns {string | null}
     */
    get(f, E) {
      return this[u].get(E ? f : f.toLowerCase())?.value ?? null;
    }
    *[Symbol.iterator]() {
      for (const { 0: f, 1: { value: E } } of this[u])
        yield [f, E];
    }
    get entries() {
      const f = {};
      if (this[u].size !== 0)
        for (const { name: E, value: p } of this[u].values())
          f[E] = p;
      return f;
    }
    rawValues() {
      return this[u].values();
    }
    get entriesList() {
      const f = [];
      if (this[u].size !== 0)
        for (const { 0: E, 1: { name: p, value: g } } of this[u])
          if (E === "set-cookie")
            for (const C of this.cookies)
              f.push([p, C]);
          else
            f.push([p, g]);
      return f;
    }
    // https://fetch.spec.whatwg.org/#convert-header-names-to-a-sorted-lowercase-set
    toSortedArray() {
      const f = this[u].size, E = new Array(f);
      if (f <= 32) {
        if (f === 0)
          return E;
        const p = this[u][Symbol.iterator](), g = p.next().value;
        E[0] = [g[0], g[1].value], o(g[1].value !== null);
        for (let C = 1, w = 0, I = 0, m = 0, D = 0, U, S; C < f; ++C) {
          for (S = p.next().value, U = E[C] = [S[0], S[1].value], o(U[1] !== null), m = 0, I = C; m < I; )
            D = m + (I - m >> 1), E[D][0] <= U[0] ? m = D + 1 : I = D;
          if (C !== D) {
            for (w = C; w > m; )
              E[w] = E[--w];
            E[m] = U;
          }
        }
        if (!p.next().done)
          throw new TypeError("Unreachable");
        return E;
      } else {
        let p = 0;
        for (const { 0: g, 1: { value: C } } of this[u])
          E[p++] = [g, C], o(C !== null);
        return E.sort(B);
      }
    }
  }
  class y {
    #e;
    #t;
    constructor(f = void 0) {
      n.util.markAsUncloneable(this), f !== e && (this.#t = new d(), this.#e = "none", f !== void 0 && (f = n.converters.HeadersInit(f, "Headers contructor", "init"), Q(this, f)));
    }
    // https://fetch.spec.whatwg.org/#dom-headers-append
    append(f, E) {
      n.brandCheck(this, y), n.argumentLengthCheck(arguments, 2, "Headers.append");
      const p = "Headers.append";
      return f = n.converters.ByteString(f, p, "name"), E = n.converters.ByteString(E, p, "value"), h(this, f, E);
    }
    // https://fetch.spec.whatwg.org/#dom-headers-delete
    delete(f) {
      if (n.brandCheck(this, y), n.argumentLengthCheck(arguments, 1, "Headers.delete"), f = n.converters.ByteString(f, "Headers.delete", "name"), !s(f))
        throw n.errors.invalidArgument({
          prefix: "Headers.delete",
          value: f,
          type: "header name"
        });
      if (this.#e === "immutable")
        throw new TypeError("immutable");
      this.#t.contains(f, !1) && this.#t.delete(f, !1);
    }
    // https://fetch.spec.whatwg.org/#dom-headers-get
    get(f) {
      n.brandCheck(this, y), n.argumentLengthCheck(arguments, 1, "Headers.get");
      const E = "Headers.get";
      if (f = n.converters.ByteString(f, E, "name"), !s(f))
        throw n.errors.invalidArgument({
          prefix: E,
          value: f,
          type: "header name"
        });
      return this.#t.get(f, !1);
    }
    // https://fetch.spec.whatwg.org/#dom-headers-has
    has(f) {
      n.brandCheck(this, y), n.argumentLengthCheck(arguments, 1, "Headers.has");
      const E = "Headers.has";
      if (f = n.converters.ByteString(f, E, "name"), !s(f))
        throw n.errors.invalidArgument({
          prefix: E,
          value: f,
          type: "header name"
        });
      return this.#t.contains(f, !1);
    }
    // https://fetch.spec.whatwg.org/#dom-headers-set
    set(f, E) {
      n.brandCheck(this, y), n.argumentLengthCheck(arguments, 2, "Headers.set");
      const p = "Headers.set";
      if (f = n.converters.ByteString(f, p, "name"), E = n.converters.ByteString(E, p, "value"), E = c(E), s(f)) {
        if (!r(E))
          throw n.errors.invalidArgument({
            prefix: p,
            value: E,
            type: "header value"
          });
      } else throw n.errors.invalidArgument({
        prefix: p,
        value: f,
        type: "header name"
      });
      if (this.#e === "immutable")
        throw new TypeError("immutable");
      this.#t.set(f, E, !1);
    }
    // https://fetch.spec.whatwg.org/#dom-headers-getsetcookie
    getSetCookie() {
      n.brandCheck(this, y);
      const f = this.#t.cookies;
      return f ? [...f] : [];
    }
    // https://fetch.spec.whatwg.org/#concept-header-list-sort-and-combine
    get [l]() {
      if (this.#t[l])
        return this.#t[l];
      const f = [], E = this.#t.toSortedArray(), p = this.#t.cookies;
      if (p === null || p.length === 1)
        return this.#t[l] = E;
      for (let g = 0; g < E.length; ++g) {
        const { 0: C, 1: w } = E[g];
        if (C === "set-cookie")
          for (let I = 0; I < p.length; ++I)
            f.push([C, p[I]]);
        else
          f.push([C, w]);
      }
      return this.#t[l] = f;
    }
    [a.inspect.custom](f, E) {
      return E.depth ??= f, `Headers ${a.formatWithOptions(E, this.#t.entries)}`;
    }
    static getHeadersGuard(f) {
      return f.#e;
    }
    static setHeadersGuard(f, E) {
      f.#e = E;
    }
    static getHeadersList(f) {
      return f.#t;
    }
    static setHeadersList(f, E) {
      f.#t = E;
    }
  }
  const { getHeadersGuard: b, setHeadersGuard: F, getHeadersList: M, setHeadersList: L } = y;
  return Reflect.deleteProperty(y, "getHeadersGuard"), Reflect.deleteProperty(y, "setHeadersGuard"), Reflect.deleteProperty(y, "getHeadersList"), Reflect.deleteProperty(y, "setHeadersList"), A("Headers", y, l, 0, 1), Object.defineProperties(y.prototype, {
    append: t,
    delete: t,
    get: t,
    has: t,
    set: t,
    getSetCookie: t,
    [Symbol.toStringTag]: {
      value: "Headers",
      configurable: !0
    },
    [a.inspect.custom]: {
      enumerable: !1
    }
  }), n.converters.HeadersInit = function(N, f, E) {
    if (n.util.Type(N) === "Object") {
      const p = Reflect.get(N, Symbol.iterator);
      if (!a.types.isProxy(N) && p === y.prototype.entries)
        try {
          return M(N).entriesList;
        } catch {
        }
      return typeof p == "function" ? n.converters["sequence<sequence<ByteString>>"](N, f, E, p.bind(N)) : n.converters["record<ByteString, ByteString>"](N, f, E);
    }
    throw n.errors.conversionFailed({
      prefix: "Headers constructor",
      argument: "Argument 1",
      types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
    });
  }, ls = {
    fill: Q,
    // for test.
    compareHeaderName: B,
    Headers: y,
    HeadersList: d,
    getHeadersGuard: b,
    setHeadersGuard: F,
    setHeadersList: L,
    getHeadersList: M
  }, ls;
}
var us, Ei;
function TA() {
  if (Ei) return us;
  Ei = 1;
  const { Headers: e, HeadersList: t, fill: A, getHeadersGuard: s, setHeadersGuard: r, setHeadersList: n } = Yt(), { extractBody: o, cloneBody: a, mixinBody: u, hasFinalizationRegistry: l, streamRegistry: i, bodyUnusable: c } = $t(), Q = Ue(), h = rt, { kEnumerableProperty: B } = Q, {
    isValidReasonPhrase: d,
    isCancelled: y,
    isAborted: b,
    isBlobLike: F,
    serializeJavascriptValueToJSONString: M,
    isErrorLike: L,
    isomorphicEncode: N,
    environmentSettingsObject: f
  } = it(), {
    redirectStatusSet: E,
    nullBodyStatus: p
  } = yA(), { kState: g, kHeaders: C } = Tt(), { webidl: w } = $e(), { FormData: I } = DA(), { URLSerializer: m } = st(), { kConstruct: D } = Ve(), U = He, { types: S } = rt, G = new TextEncoder("utf-8");
  class v {
    // Creates network error Response.
    static error() {
      return we(ge(), "immutable");
    }
    // https://fetch.spec.whatwg.org/#dom-response-json
    static json(W, re = {}) {
      w.argumentLengthCheck(arguments, 1, "Response.json"), re !== null && (re = w.converters.ResponseInit(re));
      const J = G.encode(
        M(W)
      ), V = o(J), P = we(ne({}), "response");
      return ye(P, re, { body: V[0], type: "application/json" }), P;
    }
    // Creates a redirect Response that redirects to url with status status.
    static redirect(W, re = 302) {
      w.argumentLengthCheck(arguments, 1, "Response.redirect"), W = w.converters.USVString(W), re = w.converters["unsigned short"](re);
      let J;
      try {
        J = new URL(W, f.settingsObject.baseUrl);
      } catch (Z) {
        throw new TypeError(`Failed to parse URL from ${W}`, { cause: Z });
      }
      if (!E.has(re))
        throw new RangeError(`Invalid status code ${re}`);
      const V = we(ne({}), "immutable");
      V[g].status = re;
      const P = N(m(J));
      return V[g].headersList.append("location", P, !0), V;
    }
    // https://fetch.spec.whatwg.org/#dom-response
    constructor(W = null, re = {}) {
      if (w.util.markAsUncloneable(this), W === D)
        return;
      W !== null && (W = w.converters.BodyInit(W)), re = w.converters.ResponseInit(re), this[g] = ne({}), this[C] = new e(D), r(this[C], "response"), n(this[C], this[g].headersList);
      let J = null;
      if (W != null) {
        const [V, P] = o(W);
        J = { body: V, type: P };
      }
      ye(this, re, J);
    }
    // Returns response’s type, e.g., "cors".
    get type() {
      return w.brandCheck(this, v), this[g].type;
    }
    // Returns response’s URL, if it has one; otherwise the empty string.
    get url() {
      w.brandCheck(this, v);
      const W = this[g].urlList, re = W[W.length - 1] ?? null;
      return re === null ? "" : m(re, !0);
    }
    // Returns whether response was obtained through a redirect.
    get redirected() {
      return w.brandCheck(this, v), this[g].urlList.length > 1;
    }
    // Returns response’s status.
    get status() {
      return w.brandCheck(this, v), this[g].status;
    }
    // Returns whether response’s status is an ok status.
    get ok() {
      return w.brandCheck(this, v), this[g].status >= 200 && this[g].status <= 299;
    }
    // Returns response’s status message.
    get statusText() {
      return w.brandCheck(this, v), this[g].statusText;
    }
    // Returns response’s headers as Headers.
    get headers() {
      return w.brandCheck(this, v), this[C];
    }
    get body() {
      return w.brandCheck(this, v), this[g].body ? this[g].body.stream : null;
    }
    get bodyUsed() {
      return w.brandCheck(this, v), !!this[g].body && Q.isDisturbed(this[g].body.stream);
    }
    // Returns a clone of response.
    clone() {
      if (w.brandCheck(this, v), c(this))
        throw w.errors.exception({
          header: "Response.clone",
          message: "Body has already been consumed."
        });
      const W = $(this[g]);
      return l && this[g].body?.stream && i.register(this, new WeakRef(this[g].body.stream)), we(W, s(this[C]));
    }
    [h.inspect.custom](W, re) {
      re.depth === null && (re.depth = 2), re.colors ??= !0;
      const J = {
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        body: this.body,
        bodyUsed: this.bodyUsed,
        ok: this.ok,
        redirected: this.redirected,
        type: this.type,
        url: this.url
      };
      return `Response ${h.formatWithOptions(re, J)}`;
    }
  }
  u(v), Object.defineProperties(v.prototype, {
    type: B,
    url: B,
    status: B,
    ok: B,
    redirected: B,
    statusText: B,
    headers: B,
    clone: B,
    body: B,
    bodyUsed: B,
    [Symbol.toStringTag]: {
      value: "Response",
      configurable: !0
    }
  }), Object.defineProperties(v, {
    json: B,
    redirect: B,
    error: B
  });
  function $(X) {
    if (X.internalResponse)
      return he(
        $(X.internalResponse),
        X.type
      );
    const W = ne({ ...X, body: null });
    return X.body != null && (W.body = a(W, X.body)), W;
  }
  function ne(X) {
    return {
      aborted: !1,
      rangeRequested: !1,
      timingAllowPassed: !1,
      requestIncludesCredentials: !1,
      type: "default",
      status: 200,
      timingInfo: null,
      cacheState: "",
      statusText: "",
      ...X,
      headersList: X?.headersList ? new t(X?.headersList) : new t(),
      urlList: X?.urlList ? [...X.urlList] : []
    };
  }
  function ge(X) {
    const W = L(X);
    return ne({
      type: "error",
      status: 0,
      error: W ? X : new Error(X && String(X)),
      aborted: X && X.name === "AbortError"
    });
  }
  function ae(X) {
    return (
      // A network error is a response whose type is "error",
      X.type === "error" && // status is 0
      X.status === 0
    );
  }
  function Be(X, W) {
    return W = {
      internalResponse: X,
      ...W
    }, new Proxy(X, {
      get(re, J) {
        return J in W ? W[J] : re[J];
      },
      set(re, J, V) {
        return U(!(J in W)), re[J] = V, !0;
      }
    });
  }
  function he(X, W) {
    if (W === "basic")
      return Be(X, {
        type: "basic",
        headersList: X.headersList
      });
    if (W === "cors")
      return Be(X, {
        type: "cors",
        headersList: X.headersList
      });
    if (W === "opaque")
      return Be(X, {
        type: "opaque",
        urlList: Object.freeze([]),
        status: 0,
        statusText: "",
        body: null
      });
    if (W === "opaqueredirect")
      return Be(X, {
        type: "opaqueredirect",
        status: 0,
        statusText: "",
        headersList: [],
        body: null
      });
    U(!1);
  }
  function Qe(X, W = null) {
    return U(y(X)), b(X) ? ge(Object.assign(new DOMException("The operation was aborted.", "AbortError"), { cause: W })) : ge(Object.assign(new DOMException("Request was cancelled."), { cause: W }));
  }
  function ye(X, W, re) {
    if (W.status !== null && (W.status < 200 || W.status > 599))
      throw new RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
    if ("statusText" in W && W.statusText != null && !d(String(W.statusText)))
      throw new TypeError("Invalid statusText");
    if ("status" in W && W.status != null && (X[g].status = W.status), "statusText" in W && W.statusText != null && (X[g].statusText = W.statusText), "headers" in W && W.headers != null && A(X[C], W.headers), re) {
      if (p.includes(X.status))
        throw w.errors.exception({
          header: "Response constructor",
          message: `Invalid response status code ${X.status}`
        });
      X[g].body = re.body, re.type != null && !X[g].headersList.contains("content-type", !0) && X[g].headersList.append("content-type", re.type, !0);
    }
  }
  function we(X, W) {
    const re = new v(D);
    return re[g] = X, re[C] = new e(D), n(re[C], X.headersList), r(re[C], W), l && X.body?.stream && i.register(re, new WeakRef(X.body.stream)), re;
  }
  return w.converters.ReadableStream = w.interfaceConverter(
    ReadableStream
  ), w.converters.FormData = w.interfaceConverter(
    I
  ), w.converters.URLSearchParams = w.interfaceConverter(
    URLSearchParams
  ), w.converters.XMLHttpRequestBodyInit = function(X, W, re) {
    return typeof X == "string" ? w.converters.USVString(X, W, re) : F(X) ? w.converters.Blob(X, W, re, { strict: !1 }) : ArrayBuffer.isView(X) || S.isArrayBuffer(X) ? w.converters.BufferSource(X, W, re) : Q.isFormDataLike(X) ? w.converters.FormData(X, W, re, { strict: !1 }) : X instanceof URLSearchParams ? w.converters.URLSearchParams(X, W, re) : w.converters.DOMString(X, W, re);
  }, w.converters.BodyInit = function(X, W, re) {
    return X instanceof ReadableStream ? w.converters.ReadableStream(X, W, re) : X?.[Symbol.asyncIterator] ? X : w.converters.XMLHttpRequestBodyInit(X, W, re);
  }, w.converters.ResponseInit = w.dictionaryConverter([
    {
      key: "status",
      converter: w.converters["unsigned short"],
      defaultValue: () => 200
    },
    {
      key: "statusText",
      converter: w.converters.ByteString,
      defaultValue: () => ""
    },
    {
      key: "headers",
      converter: w.converters.HeadersInit
    }
  ]), us = {
    isNetworkError: ae,
    makeNetworkError: ge,
    makeResponse: ne,
    makeAppropriateNetworkError: Qe,
    filterResponse: he,
    Response: v,
    cloneResponse: $,
    fromInnerResponse: we
  }, us;
}
var Es, Qi;
function Gg() {
  if (Qi) return Es;
  Qi = 1;
  const { kConnected: e, kSize: t } = Ve();
  class A {
    constructor(n) {
      this.value = n;
    }
    deref() {
      return this.value[e] === 0 && this.value[t] === 0 ? void 0 : this.value;
    }
  }
  class s {
    constructor(n) {
      this.finalizer = n;
    }
    register(n, o) {
      n.on && n.on("disconnect", () => {
        n[e] === 0 && n[t] === 0 && this.finalizer(o);
      });
    }
    unregister(n) {
    }
  }
  return Es = function() {
    return process.env.NODE_V8_COVERAGE && process.version.startsWith("v18") ? (process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
      WeakRef: A,
      FinalizationRegistry: s
    }) : { WeakRef, FinalizationRegistry };
  }, Es;
}
var Qs, hi;
function sA() {
  if (hi) return Qs;
  hi = 1;
  const { extractBody: e, mixinBody: t, cloneBody: A, bodyUnusable: s } = $t(), { Headers: r, fill: n, HeadersList: o, setHeadersGuard: a, getHeadersGuard: u, setHeadersList: l, getHeadersList: i } = Yt(), { FinalizationRegistry: c } = Gg()(), Q = Ue(), h = rt, {
    isValidHTTPToken: B,
    sameOrigin: d,
    environmentSettingsObject: y
  } = it(), {
    forbiddenMethodsSet: b,
    corsSafeListedMethodsSet: F,
    referrerPolicy: M,
    requestRedirect: L,
    requestMode: N,
    requestCredentials: f,
    requestCache: E,
    requestDuplex: p
  } = yA(), { kEnumerableProperty: g, normalizedMethodRecordsBase: C, normalizedMethodRecords: w } = Q, { kHeaders: I, kSignal: m, kState: D, kDispatcher: U } = Tt(), { webidl: S } = $e(), { URLSerializer: G } = st(), { kConstruct: v } = Ve(), $ = He, { getMaxListeners: ne, setMaxListeners: ge, getEventListeners: ae, defaultMaxListeners: Be } = Wt, he = /* @__PURE__ */ Symbol("abortController"), Qe = new c(({ signal: P, abort: Z }) => {
    P.removeEventListener("abort", Z);
  }), ye = /* @__PURE__ */ new WeakMap();
  function we(P) {
    return Z;
    function Z() {
      const se = P.deref();
      if (se !== void 0) {
        Qe.unregister(Z), this.removeEventListener("abort", Z), se.abort(this.reason);
        const le = ye.get(se.signal);
        if (le !== void 0) {
          if (le.size !== 0) {
            for (const oe of le) {
              const fe = oe.deref();
              fe !== void 0 && fe.abort(this.reason);
            }
            le.clear();
          }
          ye.delete(se.signal);
        }
      }
    }
  }
  let X = !1;
  class W {
    // https://fetch.spec.whatwg.org/#dom-request
    constructor(Z, se = {}) {
      if (S.util.markAsUncloneable(this), Z === v)
        return;
      const le = "Request constructor";
      S.argumentLengthCheck(arguments, 1, le), Z = S.converters.RequestInfo(Z, le, "input"), se = S.converters.RequestInit(se, le, "init");
      let oe = null, fe = null;
      const Me = y.settingsObject.baseUrl;
      let pe = null;
      if (typeof Z == "string") {
        this[U] = se.dispatcher;
        let q;
        try {
          q = new URL(Z, Me);
        } catch (ie) {
          throw new TypeError("Failed to parse URL from " + Z, { cause: ie });
        }
        if (q.username || q.password)
          throw new TypeError(
            "Request cannot be constructed from a URL that includes credentials: " + Z
          );
        oe = re({ urlList: [q] }), fe = "cors";
      } else
        this[U] = se.dispatcher || Z[U], $(Z instanceof W), oe = Z[D], pe = Z[m];
      const Le = y.settingsObject.origin;
      let Re = "client";
      if (oe.window?.constructor?.name === "EnvironmentSettingsObject" && d(oe.window, Le) && (Re = oe.window), se.window != null)
        throw new TypeError(`'window' option '${Re}' must be null`);
      "window" in se && (Re = "no-window"), oe = re({
        // URL request’s URL.
        // undici implementation note: this is set as the first item in request's urlList in makeRequest
        // method request’s method.
        method: oe.method,
        // header list A copy of request’s header list.
        // undici implementation note: headersList is cloned in makeRequest
        headersList: oe.headersList,
        // unsafe-request flag Set.
        unsafeRequest: oe.unsafeRequest,
        // client This’s relevant settings object.
        client: y.settingsObject,
        // window window.
        window: Re,
        // priority request’s priority.
        priority: oe.priority,
        // origin request’s origin. The propagation of the origin is only significant for navigation requests
        // being handled by a service worker. In this scenario a request can have an origin that is different
        // from the current client.
        origin: oe.origin,
        // referrer request’s referrer.
        referrer: oe.referrer,
        // referrer policy request’s referrer policy.
        referrerPolicy: oe.referrerPolicy,
        // mode request’s mode.
        mode: oe.mode,
        // credentials mode request’s credentials mode.
        credentials: oe.credentials,
        // cache mode request’s cache mode.
        cache: oe.cache,
        // redirect mode request’s redirect mode.
        redirect: oe.redirect,
        // integrity metadata request’s integrity metadata.
        integrity: oe.integrity,
        // keepalive request’s keepalive.
        keepalive: oe.keepalive,
        // reload-navigation flag request’s reload-navigation flag.
        reloadNavigation: oe.reloadNavigation,
        // history-navigation flag request’s history-navigation flag.
        historyNavigation: oe.historyNavigation,
        // URL list A clone of request’s URL list.
        urlList: [...oe.urlList]
      });
      const ke = Object.keys(se).length !== 0;
      if (ke && (oe.mode === "navigate" && (oe.mode = "same-origin"), oe.reloadNavigation = !1, oe.historyNavigation = !1, oe.origin = "client", oe.referrer = "client", oe.referrerPolicy = "", oe.url = oe.urlList[oe.urlList.length - 1], oe.urlList = [oe.url]), se.referrer !== void 0) {
        const q = se.referrer;
        if (q === "")
          oe.referrer = "no-referrer";
        else {
          let ie;
          try {
            ie = new URL(q, Me);
          } catch (ue) {
            throw new TypeError(`Referrer "${q}" is not a valid URL.`, { cause: ue });
          }
          ie.protocol === "about:" && ie.hostname === "client" || Le && !d(ie, y.settingsObject.baseUrl) ? oe.referrer = "client" : oe.referrer = ie;
        }
      }
      se.referrerPolicy !== void 0 && (oe.referrerPolicy = se.referrerPolicy);
      let de;
      if (se.mode !== void 0 ? de = se.mode : de = fe, de === "navigate")
        throw S.errors.exception({
          header: "Request constructor",
          message: "invalid request mode navigate."
        });
      if (de != null && (oe.mode = de), se.credentials !== void 0 && (oe.credentials = se.credentials), se.cache !== void 0 && (oe.cache = se.cache), oe.cache === "only-if-cached" && oe.mode !== "same-origin")
        throw new TypeError(
          "'only-if-cached' can be set only with 'same-origin' mode"
        );
      if (se.redirect !== void 0 && (oe.redirect = se.redirect), se.integrity != null && (oe.integrity = String(se.integrity)), se.keepalive !== void 0 && (oe.keepalive = !!se.keepalive), se.method !== void 0) {
        let q = se.method;
        const ie = w[q];
        if (ie !== void 0)
          oe.method = ie;
        else {
          if (!B(q))
            throw new TypeError(`'${q}' is not a valid HTTP method.`);
          const ue = q.toUpperCase();
          if (b.has(ue))
            throw new TypeError(`'${q}' HTTP method is unsupported.`);
          q = C[ue] ?? q, oe.method = q;
        }
        !X && oe.method === "patch" && (process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
          code: "UNDICI-FETCH-patch"
        }), X = !0);
      }
      se.signal !== void 0 && (pe = se.signal), this[D] = oe;
      const We = new AbortController();
      if (this[m] = We.signal, pe != null) {
        if (!pe || typeof pe.aborted != "boolean" || typeof pe.addEventListener != "function")
          throw new TypeError(
            "Failed to construct 'Request': member signal is not of type AbortSignal."
          );
        if (pe.aborted)
          We.abort(pe.reason);
        else {
          this[he] = We;
          const q = new WeakRef(We), ie = we(q);
          try {
            (typeof ne == "function" && ne(pe) === Be || ae(pe, "abort").length >= Be) && ge(1500, pe);
          } catch {
          }
          Q.addAbortListener(pe, ie), Qe.register(We, { signal: pe, abort: ie }, ie);
        }
      }
      if (this[I] = new r(v), l(this[I], oe.headersList), a(this[I], "request"), de === "no-cors") {
        if (!F.has(oe.method))
          throw new TypeError(
            `'${oe.method} is unsupported in no-cors mode.`
          );
        a(this[I], "request-no-cors");
      }
      if (ke) {
        const q = i(this[I]), ie = se.headers !== void 0 ? se.headers : new o(q);
        if (q.clear(), ie instanceof o) {
          for (const { name: ue, value: Ce } of ie.rawValues())
            q.append(ue, Ce, !1);
          q.cookies = ie.cookies;
        } else
          n(this[I], ie);
      }
      const _e = Z instanceof W ? Z[D].body : null;
      if ((se.body != null || _e != null) && (oe.method === "GET" || oe.method === "HEAD"))
        throw new TypeError("Request with GET/HEAD method cannot have body.");
      let Je = null;
      if (se.body != null) {
        const [q, ie] = e(
          se.body,
          oe.keepalive
        );
        Je = q, ie && !i(this[I]).contains("content-type", !0) && this[I].append("content-type", ie);
      }
      const j = Je ?? _e;
      if (j != null && j.source == null) {
        if (Je != null && se.duplex == null)
          throw new TypeError("RequestInit: duplex option is required when sending a body.");
        if (oe.mode !== "same-origin" && oe.mode !== "cors")
          throw new TypeError(
            'If request is made from ReadableStream, mode should be "same-origin" or "cors"'
          );
        oe.useCORSPreflightFlag = !0;
      }
      let R = j;
      if (Je == null && _e != null) {
        if (s(Z))
          throw new TypeError(
            "Cannot construct a Request with a Request object that has already been used."
          );
        const q = new TransformStream();
        _e.stream.pipeThrough(q), R = {
          source: _e.source,
          length: _e.length,
          stream: q.readable
        };
      }
      this[D].body = R;
    }
    // Returns request’s HTTP method, which is "GET" by default.
    get method() {
      return S.brandCheck(this, W), this[D].method;
    }
    // Returns the URL of request as a string.
    get url() {
      return S.brandCheck(this, W), G(this[D].url);
    }
    // Returns a Headers object consisting of the headers associated with request.
    // Note that headers added in the network layer by the user agent will not
    // be accounted for in this object, e.g., the "Host" header.
    get headers() {
      return S.brandCheck(this, W), this[I];
    }
    // Returns the kind of resource requested by request, e.g., "document"
    // or "script".
    get destination() {
      return S.brandCheck(this, W), this[D].destination;
    }
    // Returns the referrer of request. Its value can be a same-origin URL if
    // explicitly set in init, the empty string to indicate no referrer, and
    // "about:client" when defaulting to the global’s default. This is used
    // during fetching to determine the value of the `Referer` header of the
    // request being made.
    get referrer() {
      return S.brandCheck(this, W), this[D].referrer === "no-referrer" ? "" : this[D].referrer === "client" ? "about:client" : this[D].referrer.toString();
    }
    // Returns the referrer policy associated with request.
    // This is used during fetching to compute the value of the request’s
    // referrer.
    get referrerPolicy() {
      return S.brandCheck(this, W), this[D].referrerPolicy;
    }
    // Returns the mode associated with request, which is a string indicating
    // whether the request will use CORS, or will be restricted to same-origin
    // URLs.
    get mode() {
      return S.brandCheck(this, W), this[D].mode;
    }
    // Returns the credentials mode associated with request,
    // which is a string indicating whether credentials will be sent with the
    // request always, never, or only when sent to a same-origin URL.
    get credentials() {
      return this[D].credentials;
    }
    // Returns the cache mode associated with request,
    // which is a string indicating how the request will
    // interact with the browser’s cache when fetching.
    get cache() {
      return S.brandCheck(this, W), this[D].cache;
    }
    // Returns the redirect mode associated with request,
    // which is a string indicating how redirects for the
    // request will be handled during fetching. A request
    // will follow redirects by default.
    get redirect() {
      return S.brandCheck(this, W), this[D].redirect;
    }
    // Returns request’s subresource integrity metadata, which is a
    // cryptographic hash of the resource being fetched. Its value
    // consists of multiple hashes separated by whitespace. [SRI]
    get integrity() {
      return S.brandCheck(this, W), this[D].integrity;
    }
    // Returns a boolean indicating whether or not request can outlive the
    // global in which it was created.
    get keepalive() {
      return S.brandCheck(this, W), this[D].keepalive;
    }
    // Returns a boolean indicating whether or not request is for a reload
    // navigation.
    get isReloadNavigation() {
      return S.brandCheck(this, W), this[D].reloadNavigation;
    }
    // Returns a boolean indicating whether or not request is for a history
    // navigation (a.k.a. back-forward navigation).
    get isHistoryNavigation() {
      return S.brandCheck(this, W), this[D].historyNavigation;
    }
    // Returns the signal associated with request, which is an AbortSignal
    // object indicating whether or not request has been aborted, and its
    // abort event handler.
    get signal() {
      return S.brandCheck(this, W), this[m];
    }
    get body() {
      return S.brandCheck(this, W), this[D].body ? this[D].body.stream : null;
    }
    get bodyUsed() {
      return S.brandCheck(this, W), !!this[D].body && Q.isDisturbed(this[D].body.stream);
    }
    get duplex() {
      return S.brandCheck(this, W), "half";
    }
    // Returns a clone of request.
    clone() {
      if (S.brandCheck(this, W), s(this))
        throw new TypeError("unusable");
      const Z = J(this[D]), se = new AbortController();
      if (this.signal.aborted)
        se.abort(this.signal.reason);
      else {
        let le = ye.get(this.signal);
        le === void 0 && (le = /* @__PURE__ */ new Set(), ye.set(this.signal, le));
        const oe = new WeakRef(se);
        le.add(oe), Q.addAbortListener(
          se.signal,
          we(oe)
        );
      }
      return V(Z, se.signal, u(this[I]));
    }
    [h.inspect.custom](Z, se) {
      se.depth === null && (se.depth = 2), se.colors ??= !0;
      const le = {
        method: this.method,
        url: this.url,
        headers: this.headers,
        destination: this.destination,
        referrer: this.referrer,
        referrerPolicy: this.referrerPolicy,
        mode: this.mode,
        credentials: this.credentials,
        cache: this.cache,
        redirect: this.redirect,
        integrity: this.integrity,
        keepalive: this.keepalive,
        isReloadNavigation: this.isReloadNavigation,
        isHistoryNavigation: this.isHistoryNavigation,
        signal: this.signal
      };
      return `Request ${h.formatWithOptions(se, le)}`;
    }
  }
  t(W);
  function re(P) {
    return {
      method: P.method ?? "GET",
      localURLsOnly: P.localURLsOnly ?? !1,
      unsafeRequest: P.unsafeRequest ?? !1,
      body: P.body ?? null,
      client: P.client ?? null,
      reservedClient: P.reservedClient ?? null,
      replacesClientId: P.replacesClientId ?? "",
      window: P.window ?? "client",
      keepalive: P.keepalive ?? !1,
      serviceWorkers: P.serviceWorkers ?? "all",
      initiator: P.initiator ?? "",
      destination: P.destination ?? "",
      priority: P.priority ?? null,
      origin: P.origin ?? "client",
      policyContainer: P.policyContainer ?? "client",
      referrer: P.referrer ?? "client",
      referrerPolicy: P.referrerPolicy ?? "",
      mode: P.mode ?? "no-cors",
      useCORSPreflightFlag: P.useCORSPreflightFlag ?? !1,
      credentials: P.credentials ?? "same-origin",
      useCredentials: P.useCredentials ?? !1,
      cache: P.cache ?? "default",
      redirect: P.redirect ?? "follow",
      integrity: P.integrity ?? "",
      cryptoGraphicsNonceMetadata: P.cryptoGraphicsNonceMetadata ?? "",
      parserMetadata: P.parserMetadata ?? "",
      reloadNavigation: P.reloadNavigation ?? !1,
      historyNavigation: P.historyNavigation ?? !1,
      userActivation: P.userActivation ?? !1,
      taintedOrigin: P.taintedOrigin ?? !1,
      redirectCount: P.redirectCount ?? 0,
      responseTainting: P.responseTainting ?? "basic",
      preventNoCacheCacheControlHeaderModification: P.preventNoCacheCacheControlHeaderModification ?? !1,
      done: P.done ?? !1,
      timingAllowFailed: P.timingAllowFailed ?? !1,
      urlList: P.urlList,
      url: P.urlList[0],
      headersList: P.headersList ? new o(P.headersList) : new o()
    };
  }
  function J(P) {
    const Z = re({ ...P, body: null });
    return P.body != null && (Z.body = A(Z, P.body)), Z;
  }
  function V(P, Z, se) {
    const le = new W(v);
    return le[D] = P, le[m] = Z, le[I] = new r(v), l(le[I], P.headersList), a(le[I], se), le;
  }
  return Object.defineProperties(W.prototype, {
    method: g,
    url: g,
    headers: g,
    redirect: g,
    clone: g,
    signal: g,
    duplex: g,
    destination: g,
    body: g,
    bodyUsed: g,
    isHistoryNavigation: g,
    isReloadNavigation: g,
    keepalive: g,
    integrity: g,
    cache: g,
    credentials: g,
    attribute: g,
    referrerPolicy: g,
    referrer: g,
    mode: g,
    [Symbol.toStringTag]: {
      value: "Request",
      configurable: !0
    }
  }), S.converters.Request = S.interfaceConverter(
    W
  ), S.converters.RequestInfo = function(P, Z, se) {
    return typeof P == "string" ? S.converters.USVString(P, Z, se) : P instanceof W ? S.converters.Request(P, Z, se) : S.converters.USVString(P, Z, se);
  }, S.converters.AbortSignal = S.interfaceConverter(
    AbortSignal
  ), S.converters.RequestInit = S.dictionaryConverter([
    {
      key: "method",
      converter: S.converters.ByteString
    },
    {
      key: "headers",
      converter: S.converters.HeadersInit
    },
    {
      key: "body",
      converter: S.nullableConverter(
        S.converters.BodyInit
      )
    },
    {
      key: "referrer",
      converter: S.converters.USVString
    },
    {
      key: "referrerPolicy",
      converter: S.converters.DOMString,
      // https://w3c.github.io/webappsec-referrer-policy/#referrer-policy
      allowedValues: M
    },
    {
      key: "mode",
      converter: S.converters.DOMString,
      // https://fetch.spec.whatwg.org/#concept-request-mode
      allowedValues: N
    },
    {
      key: "credentials",
      converter: S.converters.DOMString,
      // https://fetch.spec.whatwg.org/#requestcredentials
      allowedValues: f
    },
    {
      key: "cache",
      converter: S.converters.DOMString,
      // https://fetch.spec.whatwg.org/#requestcache
      allowedValues: E
    },
    {
      key: "redirect",
      converter: S.converters.DOMString,
      // https://fetch.spec.whatwg.org/#requestredirect
      allowedValues: L
    },
    {
      key: "integrity",
      converter: S.converters.DOMString
    },
    {
      key: "keepalive",
      converter: S.converters.boolean
    },
    {
      key: "signal",
      converter: S.nullableConverter(
        (P) => S.converters.AbortSignal(
          P,
          "RequestInit",
          "signal",
          { strict: !1 }
        )
      )
    },
    {
      key: "window",
      converter: S.converters.any
    },
    {
      key: "duplex",
      converter: S.converters.DOMString,
      allowedValues: p
    },
    {
      key: "dispatcher",
      // undici specific option
      converter: S.converters.any
    }
  ]), Qs = { Request: W, makeRequest: re, fromInnerRequest: V, cloneRequest: J }, Qs;
}
var hs, Bi;
function SA() {
  if (Bi) return hs;
  Bi = 1;
  const {
    makeNetworkError: e,
    makeAppropriateNetworkError: t,
    filterResponse: A,
    makeResponse: s,
    fromInnerResponse: r
  } = TA(), { HeadersList: n } = Yt(), { Request: o, cloneRequest: a } = sA(), u = jA, {
    bytesMatch: l,
    makePolicyContainer: i,
    clonePolicyContainer: c,
    requestBadPort: Q,
    TAOCheck: h,
    appendRequestOriginHeader: B,
    responseLocationURL: d,
    requestCurrentURL: y,
    setRequestReferrerPolicyOnRedirect: b,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: F,
    createOpaqueTimingInfo: M,
    appendFetchMetadata: L,
    corsCheck: N,
    crossOriginResourcePolicyCheck: f,
    determineRequestsReferrer: E,
    coarsenedSharedCurrentTime: p,
    createDeferredPromise: g,
    isBlobLike: C,
    sameOrigin: w,
    isCancelled: I,
    isAborted: m,
    isErrorLike: D,
    fullyReadBody: U,
    readableStreamClose: S,
    isomorphicEncode: G,
    urlIsLocal: v,
    urlIsHttpHttpsScheme: $,
    urlHasHttpsScheme: ne,
    clampAndCoarsenConnectionTimingInfo: ge,
    simpleRangeHeaderValue: ae,
    buildContentRange: Be,
    createInflate: he,
    extractMimeType: Qe
  } = it(), { kState: ye, kDispatcher: we } = Tt(), X = He, { safelyExtractBody: W, extractBody: re } = $t(), {
    redirectStatusSet: J,
    nullBodyStatus: V,
    safeMethodsSet: P,
    requestBodyHeader: Z,
    subresourceSet: se
  } = yA(), le = Wt, { Readable: oe, pipeline: fe, finished: Me } = ot, { addAbortListener: pe, isErrored: Le, isReadable: Re, bufferToLowerCasedHeaderName: ke } = Ue(), { dataURLProcessor: de, serializeAMimeType: We, minimizeSupportedMimeType: _e } = st(), { getGlobalDispatcher: Je } = ss(), { webidl: j } = $e(), { STATUS_CODES: R } = fA, q = ["GET", "HEAD"], ie = typeof __UNDICI_IS_NODE__ < "u" || typeof esbuildDetection < "u" ? "node" : "undici";
  let ue;
  class Ce extends le {
    constructor(O) {
      super(), this.dispatcher = O, this.connection = null, this.dump = !1, this.state = "ongoing";
    }
    terminate(O) {
      this.state === "ongoing" && (this.state = "terminated", this.connection?.destroy(O), this.emit("terminated", O));
    }
    // https://fetch.spec.whatwg.org/#fetch-controller-abort
    abort(O) {
      this.state === "ongoing" && (this.state = "aborted", O || (O = new DOMException("The operation was aborted.", "AbortError")), this.serializedAbortReason = O, this.connection?.destroy(O), this.emit("terminated", O));
    }
  }
  function De(k) {
    ze(k, "fetch");
  }
  function ve(k, O = void 0) {
    j.argumentLengthCheck(arguments, 1, "globalThis.fetch");
    let H = g(), _;
    try {
      _ = new o(k, O);
    } catch (xe) {
      return H.reject(xe), H.promise;
    }
    const Ae = _[ye];
    if (_.signal.aborted)
      return Ie(H, Ae, null, _.signal.reason), H.promise;
    Ae.client.globalObject?.constructor?.name === "ServiceWorkerGlobalScope" && (Ae.serviceWorkers = "none");
    let ce = null, Fe = !1, Ge = null;
    return pe(
      _.signal,
      () => {
        Fe = !0, X(Ge != null), Ge.abort(_.signal.reason);
        const xe = ce?.deref();
        Ie(H, Ae, xe, _.signal.reason);
      }
    ), Ge = Y({
      request: Ae,
      processResponseEndOfBody: De,
      processResponse: (xe) => {
        if (!Fe) {
          if (xe.aborted) {
            Ie(H, Ae, ce, Ge.serializedAbortReason);
            return;
          }
          if (xe.type === "error") {
            H.reject(new TypeError("fetch failed", { cause: xe.error }));
            return;
          }
          ce = new WeakRef(r(xe, "immutable")), H.resolve(ce.deref()), H = null;
        }
      },
      dispatcher: _[we]
      // undici
    }), H.promise;
  }
  function ze(k, O = "other") {
    if (k.type === "error" && k.aborted || !k.urlList?.length)
      return;
    const H = k.urlList[0];
    let _ = k.timingInfo, Ae = k.cacheState;
    $(H) && _ !== null && (k.timingAllowPassed || (_ = M({
      startTime: _.startTime
    }), Ae = ""), _.endTime = p(), k.timingInfo = _, Ke(
      _,
      H.href,
      O,
      globalThis,
      Ae
    ));
  }
  const Ke = performance.markResourceTiming;
  function Ie(k, O, H, _) {
    if (k && k.reject(_), O.body != null && Re(O.body?.stream) && O.body.stream.cancel(_).catch((z) => {
      if (z.code !== "ERR_INVALID_STATE")
        throw z;
    }), H == null)
      return;
    const Ae = H[ye];
    Ae.body != null && Re(Ae.body?.stream) && Ae.body.stream.cancel(_).catch((z) => {
      if (z.code !== "ERR_INVALID_STATE")
        throw z;
    });
  }
  function Y({
    request: k,
    processRequestBodyChunkLength: O,
    processRequestEndOfBody: H,
    processResponse: _,
    processResponseEndOfBody: Ae,
    processResponseConsumeBody: z,
    useParallelQueue: ce = !1,
    dispatcher: Fe = Je()
    // undici
  }) {
    X(Fe);
    let Ge = null, Ne = !1;
    k.client != null && (Ge = k.client.globalObject, Ne = k.client.crossOriginIsolatedCapability);
    const xe = p(Ne), lt = M({
      startTime: xe
    }), Te = {
      controller: new Ce(Fe),
      request: k,
      timingInfo: lt,
      processRequestBodyChunkLength: O,
      processRequestEndOfBody: H,
      processResponse: _,
      processResponseConsumeBody: z,
      processResponseEndOfBody: Ae,
      taskDestination: Ge,
      crossOriginIsolatedCapability: Ne
    };
    return X(!k.body || k.body.stream), k.window === "client" && (k.window = k.client?.globalObject?.constructor?.name === "Window" ? k.client : "no-window"), k.origin === "client" && (k.origin = k.client.origin), k.policyContainer === "client" && (k.client != null ? k.policyContainer = c(
      k.client.policyContainer
    ) : k.policyContainer = i()), k.headersList.contains("accept", !0) || k.headersList.append("accept", "*/*", !0), k.headersList.contains("accept-language", !0) || k.headersList.append("accept-language", "*", !0), k.priority, se.has(k.destination), ee(Te).catch((je) => {
      Te.controller.terminate(je);
    }), Te.controller;
  }
  async function ee(k, O = !1) {
    const H = k.request;
    let _ = null;
    if (H.localURLsOnly && !v(y(H)) && (_ = e("local URLs only")), F(H), Q(H) === "blocked" && (_ = e("bad port")), H.referrerPolicy === "" && (H.referrerPolicy = H.policyContainer.referrerPolicy), H.referrer !== "no-referrer" && (H.referrer = E(H)), _ === null && (_ = await (async () => {
      const z = y(H);
      return (
        // - request’s current URL’s origin is same origin with request’s origin,
        //   and request’s response tainting is "basic"
        w(z, H.url) && H.responseTainting === "basic" || // request’s current URL’s scheme is "data"
        z.protocol === "data:" || // - request’s mode is "navigate" or "websocket"
        H.mode === "navigate" || H.mode === "websocket" ? (H.responseTainting = "basic", await K(k)) : H.mode === "same-origin" ? e('request mode cannot be "same-origin"') : H.mode === "no-cors" ? H.redirect !== "follow" ? e(
          'redirect mode cannot be "follow" for "no-cors" request'
        ) : (H.responseTainting = "opaque", await K(k)) : $(y(H)) ? (H.responseTainting = "cors", await be(k)) : e("URL scheme must be a HTTP(S) scheme")
      );
    })()), O)
      return _;
    _.status !== 0 && !_.internalResponse && (H.responseTainting, H.responseTainting === "basic" ? _ = A(_, "basic") : H.responseTainting === "cors" ? _ = A(_, "cors") : H.responseTainting === "opaque" ? _ = A(_, "opaque") : X(!1));
    let Ae = _.status === 0 ? _ : _.internalResponse;
    if (Ae.urlList.length === 0 && Ae.urlList.push(...H.urlList), H.timingAllowFailed || (_.timingAllowPassed = !0), _.type === "opaque" && Ae.status === 206 && Ae.rangeRequested && !H.headers.contains("range", !0) && (_ = Ae = e()), _.status !== 0 && (H.method === "HEAD" || H.method === "CONNECT" || V.includes(Ae.status)) && (Ae.body = null, k.controller.dump = !0), H.integrity) {
      const z = (Fe) => Ee(k, e(Fe));
      if (H.responseTainting === "opaque" || _.body == null) {
        z(_.error);
        return;
      }
      const ce = (Fe) => {
        if (!l(Fe, H.integrity)) {
          z("integrity mismatch");
          return;
        }
        _.body = W(Fe)[0], Ee(k, _);
      };
      await U(_.body, ce, z);
    } else
      Ee(k, _);
  }
  function K(k) {
    if (I(k) && k.request.redirectCount === 0)
      return Promise.resolve(t(k));
    const { request: O } = k, { protocol: H } = y(O);
    switch (H) {
      case "about:":
        return Promise.resolve(e("about scheme is not supported"));
      case "blob:": {
        ue || (ue = at.resolveObjectURL);
        const _ = y(O);
        if (_.search.length !== 0)
          return Promise.resolve(e("NetworkError when attempting to fetch resource."));
        const Ae = ue(_.toString());
        if (O.method !== "GET" || !C(Ae))
          return Promise.resolve(e("invalid method"));
        const z = s(), ce = Ae.size, Fe = G(`${ce}`), Ge = Ae.type;
        if (O.headersList.contains("range", !0)) {
          z.rangeRequested = !0;
          const Ne = O.headersList.get("range", !0), xe = ae(Ne, !0);
          if (xe === "failure")
            return Promise.resolve(e("failed to fetch the data URL"));
          let { rangeStartValue: lt, rangeEndValue: Te } = xe;
          if (lt === null)
            lt = ce - Te, Te = lt + Te - 1;
          else {
            if (lt >= ce)
              return Promise.resolve(e("Range start is greater than the blob's size."));
            (Te === null || Te >= ce) && (Te = ce - 1);
          }
          const je = Ae.slice(lt, Te, Ge), nt = re(je);
          z.body = nt[0];
          const qe = G(`${je.size}`), It = Be(lt, Te, ce);
          z.status = 206, z.statusText = "Partial Content", z.headersList.set("content-length", qe, !0), z.headersList.set("content-type", Ge, !0), z.headersList.set("content-range", It, !0);
        } else {
          const Ne = re(Ae);
          z.statusText = "OK", z.body = Ne[0], z.headersList.set("content-length", Fe, !0), z.headersList.set("content-type", Ge, !0);
        }
        return Promise.resolve(z);
      }
      case "data:": {
        const _ = y(O), Ae = de(_);
        if (Ae === "failure")
          return Promise.resolve(e("failed to fetch the data URL"));
        const z = We(Ae.mimeType);
        return Promise.resolve(s({
          statusText: "OK",
          headersList: [
            ["content-type", { name: "Content-Type", value: z }]
          ],
          body: W(Ae.body)[0]
        }));
      }
      case "file:":
        return Promise.resolve(e("not implemented... yet..."));
      case "http:":
      case "https:":
        return be(k).catch((_) => e(_));
      default:
        return Promise.resolve(e("unknown scheme"));
    }
  }
  function te(k, O) {
    k.request.done = !0, k.processResponseDone != null && queueMicrotask(() => k.processResponseDone(O));
  }
  function Ee(k, O) {
    let H = k.timingInfo;
    const _ = () => {
      const z = Date.now();
      k.request.destination === "document" && (k.controller.fullTimingInfo = H), k.controller.reportTimingSteps = () => {
        if (k.request.url.protocol !== "https:")
          return;
        H.endTime = z;
        let Fe = O.cacheState;
        const Ge = O.bodyInfo;
        O.timingAllowPassed || (H = M(H), Fe = "");
        let Ne = 0;
        if (k.request.mode !== "navigator" || !O.hasCrossOriginRedirects) {
          Ne = O.status;
          const xe = Qe(O.headersList);
          xe !== "failure" && (Ge.contentType = _e(xe));
        }
        k.request.initiatorType != null && Ke(H, k.request.url.href, k.request.initiatorType, globalThis, Fe, Ge, Ne);
      };
      const ce = () => {
        k.request.done = !0, k.processResponseEndOfBody != null && queueMicrotask(() => k.processResponseEndOfBody(O)), k.request.initiatorType != null && k.controller.reportTimingSteps();
      };
      queueMicrotask(() => ce());
    };
    k.processResponse != null && queueMicrotask(() => {
      k.processResponse(O), k.processResponse = null;
    });
    const Ae = O.type === "error" ? O : O.internalResponse ?? O;
    Ae.body == null ? _() : Me(Ae.body.stream, () => {
      _();
    });
  }
  async function be(k) {
    const O = k.request;
    let H = null, _ = null;
    const Ae = k.timingInfo;
    if (O.serviceWorkers, H === null) {
      if (O.redirect === "follow" && (O.serviceWorkers = "none"), _ = H = await T(k), O.responseTainting === "cors" && N(O, H) === "failure")
        return e("cors failure");
      h(O, H) === "failure" && (O.timingAllowFailed = !0);
    }
    return (O.responseTainting === "opaque" || H.type === "opaque") && f(
      O.origin,
      O.client,
      O.destination,
      _
    ) === "blocked" ? e("blocked") : (J.has(_.status) && (O.redirect !== "manual" && k.controller.connection.destroy(void 0, !1), O.redirect === "error" ? H = e("unexpected redirect") : O.redirect === "manual" ? H = _ : O.redirect === "follow" ? H = await Se(k, H) : X(!1)), H.timingInfo = Ae, H);
  }
  function Se(k, O) {
    const H = k.request, _ = O.internalResponse ? O.internalResponse : O;
    let Ae;
    try {
      if (Ae = d(
        _,
        y(H).hash
      ), Ae == null)
        return O;
    } catch (ce) {
      return Promise.resolve(e(ce));
    }
    if (!$(Ae))
      return Promise.resolve(e("URL scheme must be a HTTP(S) scheme"));
    if (H.redirectCount === 20)
      return Promise.resolve(e("redirect count exceeded"));
    if (H.redirectCount += 1, H.mode === "cors" && (Ae.username || Ae.password) && !w(H, Ae))
      return Promise.resolve(e('cross origin not allowed for request mode "cors"'));
    if (H.responseTainting === "cors" && (Ae.username || Ae.password))
      return Promise.resolve(e(
        'URL cannot contain credentials for request mode "cors"'
      ));
    if (_.status !== 303 && H.body != null && H.body.source == null)
      return Promise.resolve(e());
    if ([301, 302].includes(_.status) && H.method === "POST" || _.status === 303 && !q.includes(H.method)) {
      H.method = "GET", H.body = null;
      for (const ce of Z)
        H.headersList.delete(ce);
    }
    w(y(H), Ae) || (H.headersList.delete("authorization", !0), H.headersList.delete("proxy-authorization", !0), H.headersList.delete("cookie", !0), H.headersList.delete("host", !0)), H.body != null && (X(H.body.source != null), H.body = W(H.body.source)[0]);
    const z = k.timingInfo;
    return z.redirectEndTime = z.postRedirectStartTime = p(k.crossOriginIsolatedCapability), z.redirectStartTime === 0 && (z.redirectStartTime = z.startTime), H.urlList.push(Ae), b(H, _), ee(k, !0);
  }
  async function T(k, O = !1, H = !1) {
    const _ = k.request;
    let Ae = null, z = null, ce = null;
    _.window === "no-window" && _.redirect === "error" ? (Ae = k, z = _) : (z = a(_), Ae = { ...k }, Ae.request = z);
    const Fe = _.credentials === "include" || _.credentials === "same-origin" && _.responseTainting === "basic", Ge = z.body ? z.body.length : null;
    let Ne = null;
    if (z.body == null && ["POST", "PUT"].includes(z.method) && (Ne = "0"), Ge != null && (Ne = G(`${Ge}`)), Ne != null && z.headersList.append("content-length", Ne, !0), Ge != null && z.keepalive, z.referrer instanceof URL && z.headersList.append("referer", G(z.referrer.href), !0), B(z), L(z), z.headersList.contains("user-agent", !0) || z.headersList.append("user-agent", ie), z.cache === "default" && (z.headersList.contains("if-modified-since", !0) || z.headersList.contains("if-none-match", !0) || z.headersList.contains("if-unmodified-since", !0) || z.headersList.contains("if-match", !0) || z.headersList.contains("if-range", !0)) && (z.cache = "no-store"), z.cache === "no-cache" && !z.preventNoCacheCacheControlHeaderModification && !z.headersList.contains("cache-control", !0) && z.headersList.append("cache-control", "max-age=0", !0), (z.cache === "no-store" || z.cache === "reload") && (z.headersList.contains("pragma", !0) || z.headersList.append("pragma", "no-cache", !0), z.headersList.contains("cache-control", !0) || z.headersList.append("cache-control", "no-cache", !0)), z.headersList.contains("range", !0) && z.headersList.append("accept-encoding", "identity", !0), z.headersList.contains("accept-encoding", !0) || (ne(y(z)) ? z.headersList.append("accept-encoding", "br, gzip, deflate", !0) : z.headersList.append("accept-encoding", "gzip, deflate", !0)), z.headersList.delete("host", !0), z.cache = "no-store", z.cache !== "no-store" && z.cache, ce == null) {
      if (z.cache === "only-if-cached")
        return e("only if cached");
      const xe = await x(
        Ae,
        Fe,
        H
      );
      !P.has(z.method) && xe.status >= 200 && xe.status <= 399, ce == null && (ce = xe);
    }
    if (ce.urlList = [...z.urlList], z.headersList.contains("range", !0) && (ce.rangeRequested = !0), ce.requestIncludesCredentials = Fe, ce.status === 407)
      return _.window === "no-window" ? e() : I(k) ? t(k) : e("proxy authentication required");
    if (
      // response’s status is 421
      ce.status === 421 && // isNewConnectionFetch is false
      !H && // request’s body is null, or request’s body is non-null and request’s body’s source is non-null
      (_.body == null || _.body.source != null)
    ) {
      if (I(k))
        return t(k);
      k.controller.connection.destroy(), ce = await T(
        k,
        O,
        !0
      );
    }
    return ce;
  }
  async function x(k, O = !1, H = !1) {
    X(!k.controller.connection || k.controller.connection.destroyed), k.controller.connection = {
      abort: null,
      destroyed: !1,
      destroy(Te, je = !0) {
        this.destroyed || (this.destroyed = !0, je && this.abort?.(Te ?? new DOMException("The operation was aborted.", "AbortError")));
      }
    };
    const _ = k.request;
    let Ae = null;
    const z = k.timingInfo;
    _.cache = "no-store", _.mode;
    let ce = null;
    if (_.body == null && k.processRequestEndOfBody)
      queueMicrotask(() => k.processRequestEndOfBody());
    else if (_.body != null) {
      const Te = async function* (qe) {
        I(k) || (yield qe, k.processRequestBodyChunkLength?.(qe.byteLength));
      }, je = () => {
        I(k) || k.processRequestEndOfBody && k.processRequestEndOfBody();
      }, nt = (qe) => {
        I(k) || (qe.name === "AbortError" ? k.controller.abort() : k.controller.terminate(qe));
      };
      ce = (async function* () {
        try {
          for await (const qe of _.body.stream)
            yield* Te(qe);
          je();
        } catch (qe) {
          nt(qe);
        }
      })();
    }
    try {
      const { body: Te, status: je, statusText: nt, headersList: qe, socket: It } = await lt({ body: ce });
      if (It)
        Ae = s({ status: je, statusText: nt, headersList: qe, socket: It });
      else {
        const Ze = Te[Symbol.asyncIterator]();
        k.controller.next = () => Ze.next(), Ae = s({ status: je, statusText: nt, headersList: qe });
      }
    } catch (Te) {
      return Te.name === "AbortError" ? (k.controller.connection.destroy(), t(k, Te)) : e(Te);
    }
    const Fe = async () => {
      await k.controller.resume();
    }, Ge = (Te) => {
      I(k) || k.controller.abort(Te);
    }, Ne = new ReadableStream(
      {
        async start(Te) {
          k.controller.controller = Te;
        },
        async pull(Te) {
          await Fe();
        },
        async cancel(Te) {
          await Ge(Te);
        },
        type: "bytes"
      }
    );
    Ae.body = { stream: Ne, source: null, length: null }, k.controller.onAborted = xe, k.controller.on("terminated", xe), k.controller.resume = async () => {
      for (; ; ) {
        let Te, je;
        try {
          const { done: qe, value: It } = await k.controller.next();
          if (m(k))
            break;
          Te = qe ? void 0 : It;
        } catch (qe) {
          k.controller.ended && !z.encodedBodySize ? Te = void 0 : (Te = qe, je = !0);
        }
        if (Te === void 0) {
          S(k.controller.controller), te(k, Ae);
          return;
        }
        if (z.decodedBodySize += Te?.byteLength ?? 0, je) {
          k.controller.terminate(Te);
          return;
        }
        const nt = new Uint8Array(Te);
        if (nt.byteLength && k.controller.controller.enqueue(nt), Le(Ne)) {
          k.controller.terminate();
          return;
        }
        if (k.controller.controller.desiredSize <= 0)
          return;
      }
    };
    function xe(Te) {
      m(k) ? (Ae.aborted = !0, Re(Ne) && k.controller.controller.error(
        k.controller.serializedAbortReason
      )) : Re(Ne) && k.controller.controller.error(new TypeError("terminated", {
        cause: D(Te) ? Te : void 0
      })), k.controller.connection.destroy();
    }
    return Ae;
    function lt({ body: Te }) {
      const je = y(_), nt = k.controller.dispatcher;
      return new Promise((qe, It) => nt.dispatch(
        {
          path: je.pathname + je.search,
          origin: je.origin,
          method: _.method,
          body: nt.isMockActive ? _.body && (_.body.source || _.body.stream) : Te,
          headers: _.headersList.entries,
          maxRedirections: 0,
          upgrade: _.mode === "websocket" ? "websocket" : void 0
        },
        {
          body: null,
          abort: null,
          onConnect(Ze) {
            const { connection: At } = k.controller;
            z.finalConnectionTimingInfo = ge(void 0, z.postRedirectStartTime, k.crossOriginIsolatedCapability), At.destroyed ? Ze(new DOMException("The operation was aborted.", "AbortError")) : (k.controller.on("terminated", Ze), this.abort = At.abort = Ze), z.finalNetworkRequestStartTime = p(k.crossOriginIsolatedCapability);
          },
          onResponseStarted() {
            z.finalNetworkResponseStartTime = p(k.crossOriginIsolatedCapability);
          },
          onHeaders(Ze, At, ZA, QA) {
            if (Ze < 200)
              return;
            let kt = "";
            const hA = new n();
            for (let ut = 0; ut < At.length; ut += 2)
              hA.append(ke(At[ut]), At[ut + 1].toString("latin1"), !0);
            kt = hA.get("location", !0), this.body = new oe({ read: ZA });
            const Gt = [], Oc = kt && _.redirect === "follow" && J.has(Ze);
            if (_.method !== "HEAD" && _.method !== "CONNECT" && !V.includes(Ze) && !Oc) {
              const ut = hA.get("content-encoding", !0), BA = ut ? ut.toLowerCase().split(",") : [], Rn = 5;
              if (BA.length > Rn)
                return It(new Error(`too many content-encodings in response: ${BA.length}, maximum allowed is ${Rn}`)), !0;
              for (let KA = BA.length - 1; KA >= 0; --KA) {
                const CA = BA[KA].trim();
                if (CA === "x-gzip" || CA === "gzip")
                  Gt.push(u.createGunzip({
                    // Be less strict when decoding compressed responses, since sometimes
                    // servers send slightly invalid responses that are still accepted
                    // by common browsers.
                    // Always using Z_SYNC_FLUSH is what cURL does.
                    flush: u.constants.Z_SYNC_FLUSH,
                    finishFlush: u.constants.Z_SYNC_FLUSH
                  }));
                else if (CA === "deflate")
                  Gt.push(he({
                    flush: u.constants.Z_SYNC_FLUSH,
                    finishFlush: u.constants.Z_SYNC_FLUSH
                  }));
                else if (CA === "br")
                  Gt.push(u.createBrotliDecompress({
                    flush: u.constants.BROTLI_OPERATION_FLUSH,
                    finishFlush: u.constants.BROTLI_OPERATION_FLUSH
                  }));
                else {
                  Gt.length = 0;
                  break;
                }
              }
            }
            const bn = this.onError.bind(this);
            return qe({
              status: Ze,
              statusText: QA,
              headersList: hA,
              body: Gt.length ? fe(this.body, ...Gt, (ut) => {
                ut && this.onError(ut);
              }).on("error", bn) : this.body.on("error", bn)
            }), !0;
          },
          onData(Ze) {
            if (k.controller.dump)
              return;
            const At = Ze;
            return z.encodedBodySize += At.byteLength, this.body.push(At);
          },
          onComplete() {
            this.abort && k.controller.off("terminated", this.abort), k.controller.onAborted && k.controller.off("terminated", k.controller.onAborted), k.controller.ended = !0, this.body.push(null);
          },
          onError(Ze) {
            this.abort && k.controller.off("terminated", this.abort), this.body?.destroy(Ze), k.controller.terminate(Ze), It(Ze);
          },
          onUpgrade(Ze, At, ZA) {
            if (Ze !== 101)
              return;
            const QA = new n();
            for (let kt = 0; kt < At.length; kt += 2)
              QA.append(ke(At[kt]), At[kt + 1].toString("latin1"), !0);
            return qe({
              status: Ze,
              statusText: R[Ze],
              headersList: QA,
              socket: ZA
            }), !0;
          }
        }
      ));
    }
  }
  return hs = {
    fetch: ve,
    Fetch: Ce,
    fetching: Y,
    finalizeAndReportTiming: ze
  }, hs;
}
var Bs, Ci;
function Ii() {
  return Ci || (Ci = 1, Bs = {
    kState: /* @__PURE__ */ Symbol("FileReader state"),
    kResult: /* @__PURE__ */ Symbol("FileReader result"),
    kError: /* @__PURE__ */ Symbol("FileReader error"),
    kLastProgressEventFired: /* @__PURE__ */ Symbol("FileReader last progress event fired timestamp"),
    kEvents: /* @__PURE__ */ Symbol("FileReader events"),
    kAborted: /* @__PURE__ */ Symbol("FileReader aborted")
  }), Bs;
}
var Cs, di;
function vg() {
  if (di) return Cs;
  di = 1;
  const { webidl: e } = $e(), t = /* @__PURE__ */ Symbol("ProgressEvent state");
  class A extends Event {
    constructor(r, n = {}) {
      r = e.converters.DOMString(r, "ProgressEvent constructor", "type"), n = e.converters.ProgressEventInit(n ?? {}), super(r, n), this[t] = {
        lengthComputable: n.lengthComputable,
        loaded: n.loaded,
        total: n.total
      };
    }
    get lengthComputable() {
      return e.brandCheck(this, A), this[t].lengthComputable;
    }
    get loaded() {
      return e.brandCheck(this, A), this[t].loaded;
    }
    get total() {
      return e.brandCheck(this, A), this[t].total;
    }
  }
  return e.converters.ProgressEventInit = e.dictionaryConverter([
    {
      key: "lengthComputable",
      converter: e.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "loaded",
      converter: e.converters["unsigned long long"],
      defaultValue: () => 0
    },
    {
      key: "total",
      converter: e.converters["unsigned long long"],
      defaultValue: () => 0
    },
    {
      key: "bubbles",
      converter: e.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "cancelable",
      converter: e.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "composed",
      converter: e.converters.boolean,
      defaultValue: () => !1
    }
  ]), Cs = {
    ProgressEvent: A
  }, Cs;
}
var Is, fi;
function Yg() {
  if (fi) return Is;
  fi = 1;
  function e(t) {
    if (!t)
      return "failure";
    switch (t.trim().toLowerCase()) {
      case "unicode-1-1-utf-8":
      case "unicode11utf8":
      case "unicode20utf8":
      case "utf-8":
      case "utf8":
      case "x-unicode20utf8":
        return "UTF-8";
      case "866":
      case "cp866":
      case "csibm866":
      case "ibm866":
        return "IBM866";
      case "csisolatin2":
      case "iso-8859-2":
      case "iso-ir-101":
      case "iso8859-2":
      case "iso88592":
      case "iso_8859-2":
      case "iso_8859-2:1987":
      case "l2":
      case "latin2":
        return "ISO-8859-2";
      case "csisolatin3":
      case "iso-8859-3":
      case "iso-ir-109":
      case "iso8859-3":
      case "iso88593":
      case "iso_8859-3":
      case "iso_8859-3:1988":
      case "l3":
      case "latin3":
        return "ISO-8859-3";
      case "csisolatin4":
      case "iso-8859-4":
      case "iso-ir-110":
      case "iso8859-4":
      case "iso88594":
      case "iso_8859-4":
      case "iso_8859-4:1988":
      case "l4":
      case "latin4":
        return "ISO-8859-4";
      case "csisolatincyrillic":
      case "cyrillic":
      case "iso-8859-5":
      case "iso-ir-144":
      case "iso8859-5":
      case "iso88595":
      case "iso_8859-5":
      case "iso_8859-5:1988":
        return "ISO-8859-5";
      case "arabic":
      case "asmo-708":
      case "csiso88596e":
      case "csiso88596i":
      case "csisolatinarabic":
      case "ecma-114":
      case "iso-8859-6":
      case "iso-8859-6-e":
      case "iso-8859-6-i":
      case "iso-ir-127":
      case "iso8859-6":
      case "iso88596":
      case "iso_8859-6":
      case "iso_8859-6:1987":
        return "ISO-8859-6";
      case "csisolatingreek":
      case "ecma-118":
      case "elot_928":
      case "greek":
      case "greek8":
      case "iso-8859-7":
      case "iso-ir-126":
      case "iso8859-7":
      case "iso88597":
      case "iso_8859-7":
      case "iso_8859-7:1987":
      case "sun_eu_greek":
        return "ISO-8859-7";
      case "csiso88598e":
      case "csisolatinhebrew":
      case "hebrew":
      case "iso-8859-8":
      case "iso-8859-8-e":
      case "iso-ir-138":
      case "iso8859-8":
      case "iso88598":
      case "iso_8859-8":
      case "iso_8859-8:1988":
      case "visual":
        return "ISO-8859-8";
      case "csiso88598i":
      case "iso-8859-8-i":
      case "logical":
        return "ISO-8859-8-I";
      case "csisolatin6":
      case "iso-8859-10":
      case "iso-ir-157":
      case "iso8859-10":
      case "iso885910":
      case "l6":
      case "latin6":
        return "ISO-8859-10";
      case "iso-8859-13":
      case "iso8859-13":
      case "iso885913":
        return "ISO-8859-13";
      case "iso-8859-14":
      case "iso8859-14":
      case "iso885914":
        return "ISO-8859-14";
      case "csisolatin9":
      case "iso-8859-15":
      case "iso8859-15":
      case "iso885915":
      case "iso_8859-15":
      case "l9":
        return "ISO-8859-15";
      case "iso-8859-16":
        return "ISO-8859-16";
      case "cskoi8r":
      case "koi":
      case "koi8":
      case "koi8-r":
      case "koi8_r":
        return "KOI8-R";
      case "koi8-ru":
      case "koi8-u":
        return "KOI8-U";
      case "csmacintosh":
      case "mac":
      case "macintosh":
      case "x-mac-roman":
        return "macintosh";
      case "iso-8859-11":
      case "iso8859-11":
      case "iso885911":
      case "tis-620":
      case "windows-874":
        return "windows-874";
      case "cp1250":
      case "windows-1250":
      case "x-cp1250":
        return "windows-1250";
      case "cp1251":
      case "windows-1251":
      case "x-cp1251":
        return "windows-1251";
      case "ansi_x3.4-1968":
      case "ascii":
      case "cp1252":
      case "cp819":
      case "csisolatin1":
      case "ibm819":
      case "iso-8859-1":
      case "iso-ir-100":
      case "iso8859-1":
      case "iso88591":
      case "iso_8859-1":
      case "iso_8859-1:1987":
      case "l1":
      case "latin1":
      case "us-ascii":
      case "windows-1252":
      case "x-cp1252":
        return "windows-1252";
      case "cp1253":
      case "windows-1253":
      case "x-cp1253":
        return "windows-1253";
      case "cp1254":
      case "csisolatin5":
      case "iso-8859-9":
      case "iso-ir-148":
      case "iso8859-9":
      case "iso88599":
      case "iso_8859-9":
      case "iso_8859-9:1989":
      case "l5":
      case "latin5":
      case "windows-1254":
      case "x-cp1254":
        return "windows-1254";
      case "cp1255":
      case "windows-1255":
      case "x-cp1255":
        return "windows-1255";
      case "cp1256":
      case "windows-1256":
      case "x-cp1256":
        return "windows-1256";
      case "cp1257":
      case "windows-1257":
      case "x-cp1257":
        return "windows-1257";
      case "cp1258":
      case "windows-1258":
      case "x-cp1258":
        return "windows-1258";
      case "x-mac-cyrillic":
      case "x-mac-ukrainian":
        return "x-mac-cyrillic";
      case "chinese":
      case "csgb2312":
      case "csiso58gb231280":
      case "gb2312":
      case "gb_2312":
      case "gb_2312-80":
      case "gbk":
      case "iso-ir-58":
      case "x-gbk":
        return "GBK";
      case "gb18030":
        return "gb18030";
      case "big5":
      case "big5-hkscs":
      case "cn-big5":
      case "csbig5":
      case "x-x-big5":
        return "Big5";
      case "cseucpkdfmtjapanese":
      case "euc-jp":
      case "x-euc-jp":
        return "EUC-JP";
      case "csiso2022jp":
      case "iso-2022-jp":
        return "ISO-2022-JP";
      case "csshiftjis":
      case "ms932":
      case "ms_kanji":
      case "shift-jis":
      case "shift_jis":
      case "sjis":
      case "windows-31j":
      case "x-sjis":
        return "Shift_JIS";
      case "cseuckr":
      case "csksc56011987":
      case "euc-kr":
      case "iso-ir-149":
      case "korean":
      case "ks_c_5601-1987":
      case "ks_c_5601-1989":
      case "ksc5601":
      case "ksc_5601":
      case "windows-949":
        return "EUC-KR";
      case "csiso2022kr":
      case "hz-gb-2312":
      case "iso-2022-cn":
      case "iso-2022-cn-ext":
      case "iso-2022-kr":
      case "replacement":
        return "replacement";
      case "unicodefffe":
      case "utf-16be":
        return "UTF-16BE";
      case "csunicode":
      case "iso-10646-ucs-2":
      case "ucs-2":
      case "unicode":
      case "unicodefeff":
      case "utf-16":
      case "utf-16le":
        return "UTF-16LE";
      case "x-user-defined":
        return "x-user-defined";
      default:
        return "failure";
    }
  }
  return Is = {
    getEncoding: e
  }, Is;
}
var ds, pi;
function Jg() {
  if (pi) return ds;
  pi = 1;
  const {
    kState: e,
    kError: t,
    kResult: A,
    kAborted: s,
    kLastProgressEventFired: r
  } = Ii(), { ProgressEvent: n } = vg(), { getEncoding: o } = Yg(), { serializeAMimeType: a, parseMIMEType: u } = st(), { types: l } = rt, { StringDecoder: i } = $c, { btoa: c } = at, Q = {
    enumerable: !0,
    writable: !1,
    configurable: !1
  };
  function h(M, L, N, f) {
    if (M[e] === "loading")
      throw new DOMException("Invalid state", "InvalidStateError");
    M[e] = "loading", M[A] = null, M[t] = null;
    const p = L.stream().getReader(), g = [];
    let C = p.read(), w = !0;
    (async () => {
      for (; !M[s]; )
        try {
          const { done: I, value: m } = await C;
          if (w && !M[s] && queueMicrotask(() => {
            B("loadstart", M);
          }), w = !1, !I && l.isUint8Array(m))
            g.push(m), (M[r] === void 0 || Date.now() - M[r] >= 50) && !M[s] && (M[r] = Date.now(), queueMicrotask(() => {
              B("progress", M);
            })), C = p.read();
          else if (I) {
            queueMicrotask(() => {
              M[e] = "done";
              try {
                const D = d(g, N, L.type, f);
                if (M[s])
                  return;
                M[A] = D, B("load", M);
              } catch (D) {
                M[t] = D, B("error", M);
              }
              M[e] !== "loading" && B("loadend", M);
            });
            break;
          }
        } catch (I) {
          if (M[s])
            return;
          queueMicrotask(() => {
            M[e] = "done", M[t] = I, B("error", M), M[e] !== "loading" && B("loadend", M);
          });
          break;
        }
    })();
  }
  function B(M, L) {
    const N = new n(M, {
      bubbles: !1,
      cancelable: !1
    });
    L.dispatchEvent(N);
  }
  function d(M, L, N, f) {
    switch (L) {
      case "DataURL": {
        let E = "data:";
        const p = u(N || "application/octet-stream");
        p !== "failure" && (E += a(p)), E += ";base64,";
        const g = new i("latin1");
        for (const C of M)
          E += c(g.write(C));
        return E += c(g.end()), E;
      }
      case "Text": {
        let E = "failure";
        if (f && (E = o(f)), E === "failure" && N) {
          const p = u(N);
          p !== "failure" && (E = o(p.parameters.get("charset")));
        }
        return E === "failure" && (E = "UTF-8"), y(M, E);
      }
      case "ArrayBuffer":
        return F(M).buffer;
      case "BinaryString": {
        let E = "";
        const p = new i("latin1");
        for (const g of M)
          E += p.write(g);
        return E += p.end(), E;
      }
    }
  }
  function y(M, L) {
    const N = F(M), f = b(N);
    let E = 0;
    f !== null && (L = f, E = f === "UTF-8" ? 3 : 2);
    const p = N.slice(E);
    return new TextDecoder(L).decode(p);
  }
  function b(M) {
    const [L, N, f] = M;
    return L === 239 && N === 187 && f === 191 ? "UTF-8" : L === 254 && N === 255 ? "UTF-16BE" : L === 255 && N === 254 ? "UTF-16LE" : null;
  }
  function F(M) {
    const L = M.reduce((f, E) => f + E.byteLength, 0);
    let N = 0;
    return M.reduce((f, E) => (f.set(E, N), N += E.byteLength, f), new Uint8Array(L));
  }
  return ds = {
    staticPropertyDescriptors: Q,
    readOperation: h,
    fireAProgressEvent: B
  }, ds;
}
var fs, wi;
function Hg() {
  if (wi) return fs;
  wi = 1;
  const {
    staticPropertyDescriptors: e,
    readOperation: t,
    fireAProgressEvent: A
  } = Jg(), {
    kState: s,
    kError: r,
    kResult: n,
    kEvents: o,
    kAborted: a
  } = Ii(), { webidl: u } = $e(), { kEnumerableProperty: l } = Ue();
  class i extends EventTarget {
    constructor() {
      super(), this[s] = "empty", this[n] = null, this[r] = null, this[o] = {
        loadend: null,
        error: null,
        abort: null,
        load: null,
        progress: null,
        loadstart: null
      };
    }
    /**
     * @see https://w3c.github.io/FileAPI/#dfn-readAsArrayBuffer
     * @param {import('buffer').Blob} blob
     */
    readAsArrayBuffer(Q) {
      u.brandCheck(this, i), u.argumentLengthCheck(arguments, 1, "FileReader.readAsArrayBuffer"), Q = u.converters.Blob(Q, { strict: !1 }), t(this, Q, "ArrayBuffer");
    }
    /**
     * @see https://w3c.github.io/FileAPI/#readAsBinaryString
     * @param {import('buffer').Blob} blob
     */
    readAsBinaryString(Q) {
      u.brandCheck(this, i), u.argumentLengthCheck(arguments, 1, "FileReader.readAsBinaryString"), Q = u.converters.Blob(Q, { strict: !1 }), t(this, Q, "BinaryString");
    }
    /**
     * @see https://w3c.github.io/FileAPI/#readAsDataText
     * @param {import('buffer').Blob} blob
     * @param {string?} encoding
     */
    readAsText(Q, h = void 0) {
      u.brandCheck(this, i), u.argumentLengthCheck(arguments, 1, "FileReader.readAsText"), Q = u.converters.Blob(Q, { strict: !1 }), h !== void 0 && (h = u.converters.DOMString(h, "FileReader.readAsText", "encoding")), t(this, Q, "Text", h);
    }
    /**
     * @see https://w3c.github.io/FileAPI/#dfn-readAsDataURL
     * @param {import('buffer').Blob} blob
     */
    readAsDataURL(Q) {
      u.brandCheck(this, i), u.argumentLengthCheck(arguments, 1, "FileReader.readAsDataURL"), Q = u.converters.Blob(Q, { strict: !1 }), t(this, Q, "DataURL");
    }
    /**
     * @see https://w3c.github.io/FileAPI/#dfn-abort
     */
    abort() {
      if (this[s] === "empty" || this[s] === "done") {
        this[n] = null;
        return;
      }
      this[s] === "loading" && (this[s] = "done", this[n] = null), this[a] = !0, A("abort", this), this[s] !== "loading" && A("loadend", this);
    }
    /**
     * @see https://w3c.github.io/FileAPI/#dom-filereader-readystate
     */
    get readyState() {
      switch (u.brandCheck(this, i), this[s]) {
        case "empty":
          return this.EMPTY;
        case "loading":
          return this.LOADING;
        case "done":
          return this.DONE;
      }
    }
    /**
     * @see https://w3c.github.io/FileAPI/#dom-filereader-result
     */
    get result() {
      return u.brandCheck(this, i), this[n];
    }
    /**
     * @see https://w3c.github.io/FileAPI/#dom-filereader-error
     */
    get error() {
      return u.brandCheck(this, i), this[r];
    }
    get onloadend() {
      return u.brandCheck(this, i), this[o].loadend;
    }
    set onloadend(Q) {
      u.brandCheck(this, i), this[o].loadend && this.removeEventListener("loadend", this[o].loadend), typeof Q == "function" ? (this[o].loadend = Q, this.addEventListener("loadend", Q)) : this[o].loadend = null;
    }
    get onerror() {
      return u.brandCheck(this, i), this[o].error;
    }
    set onerror(Q) {
      u.brandCheck(this, i), this[o].error && this.removeEventListener("error", this[o].error), typeof Q == "function" ? (this[o].error = Q, this.addEventListener("error", Q)) : this[o].error = null;
    }
    get onloadstart() {
      return u.brandCheck(this, i), this[o].loadstart;
    }
    set onloadstart(Q) {
      u.brandCheck(this, i), this[o].loadstart && this.removeEventListener("loadstart", this[o].loadstart), typeof Q == "function" ? (this[o].loadstart = Q, this.addEventListener("loadstart", Q)) : this[o].loadstart = null;
    }
    get onprogress() {
      return u.brandCheck(this, i), this[o].progress;
    }
    set onprogress(Q) {
      u.brandCheck(this, i), this[o].progress && this.removeEventListener("progress", this[o].progress), typeof Q == "function" ? (this[o].progress = Q, this.addEventListener("progress", Q)) : this[o].progress = null;
    }
    get onload() {
      return u.brandCheck(this, i), this[o].load;
    }
    set onload(Q) {
      u.brandCheck(this, i), this[o].load && this.removeEventListener("load", this[o].load), typeof Q == "function" ? (this[o].load = Q, this.addEventListener("load", Q)) : this[o].load = null;
    }
    get onabort() {
      return u.brandCheck(this, i), this[o].abort;
    }
    set onabort(Q) {
      u.brandCheck(this, i), this[o].abort && this.removeEventListener("abort", this[o].abort), typeof Q == "function" ? (this[o].abort = Q, this.addEventListener("abort", Q)) : this[o].abort = null;
    }
  }
  return i.EMPTY = i.prototype.EMPTY = 0, i.LOADING = i.prototype.LOADING = 1, i.DONE = i.prototype.DONE = 2, Object.defineProperties(i.prototype, {
    EMPTY: e,
    LOADING: e,
    DONE: e,
    readAsArrayBuffer: l,
    readAsBinaryString: l,
    readAsText: l,
    readAsDataURL: l,
    abort: l,
    readyState: l,
    result: l,
    error: l,
    onloadstart: l,
    onprogress: l,
    onload: l,
    onabort: l,
    onerror: l,
    onloadend: l,
    [Symbol.toStringTag]: {
      value: "FileReader",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }
  }), Object.defineProperties(i, {
    EMPTY: e,
    LOADING: e,
    DONE: e
  }), fs = {
    FileReader: i
  }, fs;
}
var ps, mi;
function ws() {
  return mi || (mi = 1, ps = {
    kConstruct: Ve().kConstruct
  }), ps;
}
var ms, yi;
function Og() {
  if (yi) return ms;
  yi = 1;
  const e = He, { URLSerializer: t } = st(), { isValidHeaderName: A } = it();
  function s(n, o, a = !1) {
    const u = t(n, a), l = t(o, a);
    return u === l;
  }
  function r(n) {
    e(n !== null);
    const o = [];
    for (let a of n.split(","))
      a = a.trim(), A(a) && o.push(a);
    return o;
  }
  return ms = {
    urlEquals: s,
    getFieldValues: r
  }, ms;
}
var ys, Di;
function Pg() {
  if (Di) return ys;
  Di = 1;
  const { kConstruct: e } = ws(), { urlEquals: t, getFieldValues: A } = Og(), { kEnumerableProperty: s, isDisturbed: r } = Ue(), { webidl: n } = $e(), { Response: o, cloneResponse: a, fromInnerResponse: u } = TA(), { Request: l, fromInnerRequest: i } = sA(), { kState: c } = Tt(), { fetching: Q } = SA(), { urlIsHttpHttpsScheme: h, createDeferredPromise: B, readAllBytes: d } = it(), y = He;
  class b {
    /**
     * @see https://w3c.github.io/ServiceWorker/#dfn-relevant-request-response-list
     * @type {requestResponseList}
     */
    #e;
    constructor() {
      arguments[0] !== e && n.illegalConstructor(), n.util.markAsUncloneable(this), this.#e = arguments[1];
    }
    async match(L, N = {}) {
      n.brandCheck(this, b);
      const f = "Cache.match";
      n.argumentLengthCheck(arguments, 1, f), L = n.converters.RequestInfo(L, f, "request"), N = n.converters.CacheQueryOptions(N, f, "options");
      const E = this.#A(L, N, 1);
      if (E.length !== 0)
        return E[0];
    }
    async matchAll(L = void 0, N = {}) {
      n.brandCheck(this, b);
      const f = "Cache.matchAll";
      return L !== void 0 && (L = n.converters.RequestInfo(L, f, "request")), N = n.converters.CacheQueryOptions(N, f, "options"), this.#A(L, N);
    }
    async add(L) {
      n.brandCheck(this, b);
      const N = "Cache.add";
      n.argumentLengthCheck(arguments, 1, N), L = n.converters.RequestInfo(L, N, "request");
      const f = [L];
      return await this.addAll(f);
    }
    async addAll(L) {
      n.brandCheck(this, b);
      const N = "Cache.addAll";
      n.argumentLengthCheck(arguments, 1, N);
      const f = [], E = [];
      for (let U of L) {
        if (U === void 0)
          throw n.errors.conversionFailed({
            prefix: N,
            argument: "Argument 1",
            types: ["undefined is not allowed"]
          });
        if (U = n.converters.RequestInfo(U), typeof U == "string")
          continue;
        const S = U[c];
        if (!h(S.url) || S.method !== "GET")
          throw n.errors.exception({
            header: N,
            message: "Expected http/s scheme when method is not GET."
          });
      }
      const p = [];
      for (const U of L) {
        const S = new l(U)[c];
        if (!h(S.url))
          throw n.errors.exception({
            header: N,
            message: "Expected http/s scheme."
          });
        S.initiator = "fetch", S.destination = "subresource", E.push(S);
        const G = B();
        p.push(Q({
          request: S,
          processResponse(v) {
            if (v.type === "error" || v.status === 206 || v.status < 200 || v.status > 299)
              G.reject(n.errors.exception({
                header: "Cache.addAll",
                message: "Received an invalid status code or the request failed."
              }));
            else if (v.headersList.contains("vary")) {
              const $ = A(v.headersList.get("vary"));
              for (const ne of $)
                if (ne === "*") {
                  G.reject(n.errors.exception({
                    header: "Cache.addAll",
                    message: "invalid vary field value"
                  }));
                  for (const ge of p)
                    ge.abort();
                  return;
                }
            }
          },
          processResponseEndOfBody(v) {
            if (v.aborted) {
              G.reject(new DOMException("aborted", "AbortError"));
              return;
            }
            G.resolve(v);
          }
        })), f.push(G.promise);
      }
      const C = await Promise.all(f), w = [];
      let I = 0;
      for (const U of C) {
        const S = {
          type: "put",
          // 7.3.2
          request: E[I],
          // 7.3.3
          response: U
          // 7.3.4
        };
        w.push(S), I++;
      }
      const m = B();
      let D = null;
      try {
        this.#t(w);
      } catch (U) {
        D = U;
      }
      return queueMicrotask(() => {
        D === null ? m.resolve(void 0) : m.reject(D);
      }), m.promise;
    }
    async put(L, N) {
      n.brandCheck(this, b);
      const f = "Cache.put";
      n.argumentLengthCheck(arguments, 2, f), L = n.converters.RequestInfo(L, f, "request"), N = n.converters.Response(N, f, "response");
      let E = null;
      if (L instanceof l ? E = L[c] : E = new l(L)[c], !h(E.url) || E.method !== "GET")
        throw n.errors.exception({
          header: f,
          message: "Expected an http/s scheme when method is not GET"
        });
      const p = N[c];
      if (p.status === 206)
        throw n.errors.exception({
          header: f,
          message: "Got 206 status"
        });
      if (p.headersList.contains("vary")) {
        const S = A(p.headersList.get("vary"));
        for (const G of S)
          if (G === "*")
            throw n.errors.exception({
              header: f,
              message: "Got * vary field value"
            });
      }
      if (p.body && (r(p.body.stream) || p.body.stream.locked))
        throw n.errors.exception({
          header: f,
          message: "Response body is locked or disturbed"
        });
      const g = a(p), C = B();
      if (p.body != null) {
        const G = p.body.stream.getReader();
        d(G).then(C.resolve, C.reject);
      } else
        C.resolve(void 0);
      const w = [], I = {
        type: "put",
        // 14.
        request: E,
        // 15.
        response: g
        // 16.
      };
      w.push(I);
      const m = await C.promise;
      g.body != null && (g.body.source = m);
      const D = B();
      let U = null;
      try {
        this.#t(w);
      } catch (S) {
        U = S;
      }
      return queueMicrotask(() => {
        U === null ? D.resolve() : D.reject(U);
      }), D.promise;
    }
    async delete(L, N = {}) {
      n.brandCheck(this, b);
      const f = "Cache.delete";
      n.argumentLengthCheck(arguments, 1, f), L = n.converters.RequestInfo(L, f, "request"), N = n.converters.CacheQueryOptions(N, f, "options");
      let E = null;
      if (L instanceof l) {
        if (E = L[c], E.method !== "GET" && !N.ignoreMethod)
          return !1;
      } else
        y(typeof L == "string"), E = new l(L)[c];
      const p = [], g = {
        type: "delete",
        request: E,
        options: N
      };
      p.push(g);
      const C = B();
      let w = null, I;
      try {
        I = this.#t(p);
      } catch (m) {
        w = m;
      }
      return queueMicrotask(() => {
        w === null ? C.resolve(!!I?.length) : C.reject(w);
      }), C.promise;
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#dom-cache-keys
     * @param {any} request
     * @param {import('../../types/cache').CacheQueryOptions} options
     * @returns {Promise<readonly Request[]>}
     */
    async keys(L = void 0, N = {}) {
      n.brandCheck(this, b);
      const f = "Cache.keys";
      L !== void 0 && (L = n.converters.RequestInfo(L, f, "request")), N = n.converters.CacheQueryOptions(N, f, "options");
      let E = null;
      if (L !== void 0)
        if (L instanceof l) {
          if (E = L[c], E.method !== "GET" && !N.ignoreMethod)
            return [];
        } else typeof L == "string" && (E = new l(L)[c]);
      const p = B(), g = [];
      if (L === void 0)
        for (const C of this.#e)
          g.push(C[0]);
      else {
        const C = this.#s(E, N);
        for (const w of C)
          g.push(w[0]);
      }
      return queueMicrotask(() => {
        const C = [];
        for (const w of g) {
          const I = i(
            w,
            new AbortController().signal,
            "immutable"
          );
          C.push(I);
        }
        p.resolve(Object.freeze(C));
      }), p.promise;
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#batch-cache-operations-algorithm
     * @param {CacheBatchOperation[]} operations
     * @returns {requestResponseList}
     */
    #t(L) {
      const N = this.#e, f = [...N], E = [], p = [];
      try {
        for (const g of L) {
          if (g.type !== "delete" && g.type !== "put")
            throw n.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: 'operation type does not match "delete" or "put"'
            });
          if (g.type === "delete" && g.response != null)
            throw n.errors.exception({
              header: "Cache.#batchCacheOperations",
              message: "delete operation should not have an associated response"
            });
          if (this.#s(g.request, g.options, E).length)
            throw new DOMException("???", "InvalidStateError");
          let C;
          if (g.type === "delete") {
            if (C = this.#s(g.request, g.options), C.length === 0)
              return [];
            for (const w of C) {
              const I = N.indexOf(w);
              y(I !== -1), N.splice(I, 1);
            }
          } else if (g.type === "put") {
            if (g.response == null)
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "put operation should have an associated response"
              });
            const w = g.request;
            if (!h(w.url))
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "expected http or https scheme"
              });
            if (w.method !== "GET")
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "not get method"
              });
            if (g.options != null)
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "options must not be defined"
              });
            C = this.#s(g.request);
            for (const I of C) {
              const m = N.indexOf(I);
              y(m !== -1), N.splice(m, 1);
            }
            N.push([g.request, g.response]), E.push([g.request, g.response]);
          }
          p.push([g.request, g.response]);
        }
        return p;
      } catch (g) {
        throw this.#e.length = 0, this.#e = f, g;
      }
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#query-cache
     * @param {any} requestQuery
     * @param {import('../../types/cache').CacheQueryOptions} options
     * @param {requestResponseList} targetStorage
     * @returns {requestResponseList}
     */
    #s(L, N, f) {
      const E = [], p = f ?? this.#e;
      for (const g of p) {
        const [C, w] = g;
        this.#r(L, C, w, N) && E.push(g);
      }
      return E;
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#request-matches-cached-item-algorithm
     * @param {any} requestQuery
     * @param {any} request
     * @param {any | null} response
     * @param {import('../../types/cache').CacheQueryOptions | undefined} options
     * @returns {boolean}
     */
    #r(L, N, f = null, E) {
      const p = new URL(L.url), g = new URL(N.url);
      if (E?.ignoreSearch && (g.search = "", p.search = ""), !t(p, g, !0))
        return !1;
      if (f == null || E?.ignoreVary || !f.headersList.contains("vary"))
        return !0;
      const C = A(f.headersList.get("vary"));
      for (const w of C) {
        if (w === "*")
          return !1;
        const I = N.headersList.get(w), m = L.headersList.get(w);
        if (I !== m)
          return !1;
      }
      return !0;
    }
    #A(L, N, f = 1 / 0) {
      let E = null;
      if (L !== void 0)
        if (L instanceof l) {
          if (E = L[c], E.method !== "GET" && !N.ignoreMethod)
            return [];
        } else typeof L == "string" && (E = new l(L)[c]);
      const p = [];
      if (L === void 0)
        for (const C of this.#e)
          p.push(C[1]);
      else {
        const C = this.#s(E, N);
        for (const w of C)
          p.push(w[1]);
      }
      const g = [];
      for (const C of p) {
        const w = u(C, "immutable");
        if (g.push(w.clone()), g.length >= f)
          break;
      }
      return Object.freeze(g);
    }
  }
  Object.defineProperties(b.prototype, {
    [Symbol.toStringTag]: {
      value: "Cache",
      configurable: !0
    },
    match: s,
    matchAll: s,
    add: s,
    addAll: s,
    put: s,
    delete: s,
    keys: s
  });
  const F = [
    {
      key: "ignoreSearch",
      converter: n.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "ignoreMethod",
      converter: n.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "ignoreVary",
      converter: n.converters.boolean,
      defaultValue: () => !1
    }
  ];
  return n.converters.CacheQueryOptions = n.dictionaryConverter(F), n.converters.MultiCacheQueryOptions = n.dictionaryConverter([
    ...F,
    {
      key: "cacheName",
      converter: n.converters.DOMString
    }
  ]), n.converters.Response = n.interfaceConverter(o), n.converters["sequence<RequestInfo>"] = n.sequenceConverter(
    n.converters.RequestInfo
  ), ys = {
    Cache: b
  }, ys;
}
var Ds, bi;
function _g() {
  if (bi) return Ds;
  bi = 1;
  const { kConstruct: e } = ws(), { Cache: t } = Pg(), { webidl: A } = $e(), { kEnumerableProperty: s } = Ue();
  class r {
    /**
     * @see https://w3c.github.io/ServiceWorker/#dfn-relevant-name-to-cache-map
     * @type {Map<string, import('./cache').requestResponseList}
     */
    #e = /* @__PURE__ */ new Map();
    constructor() {
      arguments[0] !== e && A.illegalConstructor(), A.util.markAsUncloneable(this);
    }
    async match(o, a = {}) {
      if (A.brandCheck(this, r), A.argumentLengthCheck(arguments, 1, "CacheStorage.match"), o = A.converters.RequestInfo(o), a = A.converters.MultiCacheQueryOptions(a), a.cacheName != null) {
        if (this.#e.has(a.cacheName)) {
          const u = this.#e.get(a.cacheName);
          return await new t(e, u).match(o, a);
        }
      } else
        for (const u of this.#e.values()) {
          const i = await new t(e, u).match(o, a);
          if (i !== void 0)
            return i;
        }
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#cache-storage-has
     * @param {string} cacheName
     * @returns {Promise<boolean>}
     */
    async has(o) {
      A.brandCheck(this, r);
      const a = "CacheStorage.has";
      return A.argumentLengthCheck(arguments, 1, a), o = A.converters.DOMString(o, a, "cacheName"), this.#e.has(o);
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#dom-cachestorage-open
     * @param {string} cacheName
     * @returns {Promise<Cache>}
     */
    async open(o) {
      A.brandCheck(this, r);
      const a = "CacheStorage.open";
      if (A.argumentLengthCheck(arguments, 1, a), o = A.converters.DOMString(o, a, "cacheName"), this.#e.has(o)) {
        const l = this.#e.get(o);
        return new t(e, l);
      }
      const u = [];
      return this.#e.set(o, u), new t(e, u);
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#cache-storage-delete
     * @param {string} cacheName
     * @returns {Promise<boolean>}
     */
    async delete(o) {
      A.brandCheck(this, r);
      const a = "CacheStorage.delete";
      return A.argumentLengthCheck(arguments, 1, a), o = A.converters.DOMString(o, a, "cacheName"), this.#e.delete(o);
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#cache-storage-keys
     * @returns {Promise<string[]>}
     */
    async keys() {
      return A.brandCheck(this, r), [...this.#e.keys()];
    }
  }
  return Object.defineProperties(r.prototype, {
    [Symbol.toStringTag]: {
      value: "CacheStorage",
      configurable: !0
    },
    match: s,
    has: s,
    open: s,
    delete: s,
    keys: s
  }), Ds = {
    CacheStorage: r
  }, Ds;
}
var bs, Ri;
function xg() {
  return Ri || (Ri = 1, bs = {
    maxAttributeValueSize: 1024,
    maxNameValuePairSize: 4096
  }), bs;
}
var Rs, ki;
function Fi() {
  if (ki) return Rs;
  ki = 1;
  function e(c) {
    for (let Q = 0; Q < c.length; ++Q) {
      const h = c.charCodeAt(Q);
      if (h >= 0 && h <= 8 || h >= 10 && h <= 31 || h === 127)
        return !0;
    }
    return !1;
  }
  function t(c) {
    for (let Q = 0; Q < c.length; ++Q) {
      const h = c.charCodeAt(Q);
      if (h < 33 || // exclude CTLs (0-31), SP and HT
      h > 126 || // exclude non-ascii and DEL
      h === 34 || // "
      h === 40 || // (
      h === 41 || // )
      h === 60 || // <
      h === 62 || // >
      h === 64 || // @
      h === 44 || // ,
      h === 59 || // ;
      h === 58 || // :
      h === 92 || // \
      h === 47 || // /
      h === 91 || // [
      h === 93 || // ]
      h === 63 || // ?
      h === 61 || // =
      h === 123 || // {
      h === 125)
        throw new Error("Invalid cookie name");
    }
  }
  function A(c) {
    let Q = c.length, h = 0;
    if (c[0] === '"') {
      if (Q === 1 || c[Q - 1] !== '"')
        throw new Error("Invalid cookie value");
      --Q, ++h;
    }
    for (; h < Q; ) {
      const B = c.charCodeAt(h++);
      if (B < 33 || // exclude CTLs (0-31)
      B > 126 || // non-ascii and DEL (127)
      B === 34 || // "
      B === 44 || // ,
      B === 59 || // ;
      B === 92)
        throw new Error("Invalid cookie value");
    }
  }
  function s(c) {
    for (let Q = 0; Q < c.length; ++Q) {
      const h = c.charCodeAt(Q);
      if (h < 32 || // exclude CTLs (0-31)
      h === 127 || // DEL
      h === 59)
        throw new Error("Invalid cookie path");
    }
  }
  function r(c) {
    if (c.startsWith("-") || c.endsWith(".") || c.endsWith("-"))
      throw new Error("Invalid cookie domain");
  }
  const n = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ], o = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ], a = Array(61).fill(0).map((c, Q) => Q.toString().padStart(2, "0"));
  function u(c) {
    return typeof c == "number" && (c = new Date(c)), `${n[c.getUTCDay()]}, ${a[c.getUTCDate()]} ${o[c.getUTCMonth()]} ${c.getUTCFullYear()} ${a[c.getUTCHours()]}:${a[c.getUTCMinutes()]}:${a[c.getUTCSeconds()]} GMT`;
  }
  function l(c) {
    if (c < 0)
      throw new Error("Invalid cookie max-age");
  }
  function i(c) {
    if (c.name.length === 0)
      return null;
    t(c.name), A(c.value);
    const Q = [`${c.name}=${c.value}`];
    c.name.startsWith("__Secure-") && (c.secure = !0), c.name.startsWith("__Host-") && (c.secure = !0, c.domain = null, c.path = "/"), c.secure && Q.push("Secure"), c.httpOnly && Q.push("HttpOnly"), typeof c.maxAge == "number" && (l(c.maxAge), Q.push(`Max-Age=${c.maxAge}`)), c.domain && (r(c.domain), Q.push(`Domain=${c.domain}`)), c.path && (s(c.path), Q.push(`Path=${c.path}`)), c.expires && c.expires.toString() !== "Invalid Date" && Q.push(`Expires=${u(c.expires)}`), c.sameSite && Q.push(`SameSite=${c.sameSite}`);
    for (const h of c.unparsed) {
      if (!h.includes("="))
        throw new Error("Invalid unparsed");
      const [B, ...d] = h.split("=");
      Q.push(`${B.trim()}=${d.join("=")}`);
    }
    return Q.join("; ");
  }
  return Rs = {
    isCTLExcludingHtab: e,
    validateCookieName: t,
    validateCookiePath: s,
    validateCookieValue: A,
    toIMFDate: u,
    stringify: i
  }, Rs;
}
var ks, Ti;
function Vg() {
  if (Ti) return ks;
  Ti = 1;
  const { maxNameValuePairSize: e, maxAttributeValueSize: t } = xg(), { isCTLExcludingHtab: A } = Fi(), { collectASequenceOfCodePointsFast: s } = st(), r = He;
  function n(a) {
    if (A(a))
      return null;
    let u = "", l = "", i = "", c = "";
    if (a.includes(";")) {
      const Q = { position: 0 };
      u = s(";", a, Q), l = a.slice(Q.position);
    } else
      u = a;
    if (!u.includes("="))
      c = u;
    else {
      const Q = { position: 0 };
      i = s(
        "=",
        u,
        Q
      ), c = u.slice(Q.position + 1);
    }
    return i = i.trim(), c = c.trim(), i.length + c.length > e ? null : {
      name: i,
      value: c,
      ...o(l)
    };
  }
  function o(a, u = {}) {
    if (a.length === 0)
      return u;
    r(a[0] === ";"), a = a.slice(1);
    let l = "";
    a.includes(";") ? (l = s(
      ";",
      a,
      { position: 0 }
    ), a = a.slice(l.length)) : (l = a, a = "");
    let i = "", c = "";
    if (l.includes("=")) {
      const h = { position: 0 };
      i = s(
        "=",
        l,
        h
      ), c = l.slice(h.position + 1);
    } else
      i = l;
    if (i = i.trim(), c = c.trim(), c.length > t)
      return o(a, u);
    const Q = i.toLowerCase();
    if (Q === "expires") {
      const h = new Date(c);
      u.expires = h;
    } else if (Q === "max-age") {
      const h = c.charCodeAt(0);
      if ((h < 48 || h > 57) && c[0] !== "-" || !/^\d+$/.test(c))
        return o(a, u);
      const B = Number(c);
      u.maxAge = B;
    } else if (Q === "domain") {
      let h = c;
      h[0] === "." && (h = h.slice(1)), h = h.toLowerCase(), u.domain = h;
    } else if (Q === "path") {
      let h = "";
      c.length === 0 || c[0] !== "/" ? h = "/" : h = c, u.path = h;
    } else if (Q === "secure")
      u.secure = !0;
    else if (Q === "httponly")
      u.httpOnly = !0;
    else if (Q === "samesite") {
      let h = "Default";
      const B = c.toLowerCase();
      B.includes("none") && (h = "None"), B.includes("strict") && (h = "Strict"), B.includes("lax") && (h = "Lax"), u.sameSite = h;
    } else
      u.unparsed ??= [], u.unparsed.push(`${i}=${c}`);
    return o(a, u);
  }
  return ks = {
    parseSetCookie: n,
    parseUnparsedAttributes: o
  }, ks;
}
var Fs, Si;
function Wg() {
  if (Si) return Fs;
  Si = 1;
  const { parseSetCookie: e } = Vg(), { stringify: t } = Fi(), { webidl: A } = $e(), { Headers: s } = Yt();
  function r(u) {
    A.argumentLengthCheck(arguments, 1, "getCookies"), A.brandCheck(u, s, { strict: !1 });
    const l = u.get("cookie"), i = {};
    if (!l)
      return i;
    for (const c of l.split(";")) {
      const [Q, ...h] = c.split("=");
      i[Q.trim()] = h.join("=");
    }
    return i;
  }
  function n(u, l, i) {
    A.brandCheck(u, s, { strict: !1 });
    const c = "deleteCookie";
    A.argumentLengthCheck(arguments, 2, c), l = A.converters.DOMString(l, c, "name"), i = A.converters.DeleteCookieAttributes(i), a(u, {
      name: l,
      value: "",
      expires: /* @__PURE__ */ new Date(0),
      ...i
    });
  }
  function o(u) {
    A.argumentLengthCheck(arguments, 1, "getSetCookies"), A.brandCheck(u, s, { strict: !1 });
    const l = u.getSetCookie();
    return l ? l.map((i) => e(i)) : [];
  }
  function a(u, l) {
    A.argumentLengthCheck(arguments, 2, "setCookie"), A.brandCheck(u, s, { strict: !1 }), l = A.converters.Cookie(l);
    const i = t(l);
    i && u.append("Set-Cookie", i);
  }
  return A.converters.DeleteCookieAttributes = A.dictionaryConverter([
    {
      converter: A.nullableConverter(A.converters.DOMString),
      key: "path",
      defaultValue: () => null
    },
    {
      converter: A.nullableConverter(A.converters.DOMString),
      key: "domain",
      defaultValue: () => null
    }
  ]), A.converters.Cookie = A.dictionaryConverter([
    {
      converter: A.converters.DOMString,
      key: "name"
    },
    {
      converter: A.converters.DOMString,
      key: "value"
    },
    {
      converter: A.nullableConverter((u) => typeof u == "number" ? A.converters["unsigned long long"](u) : new Date(u)),
      key: "expires",
      defaultValue: () => null
    },
    {
      converter: A.nullableConverter(A.converters["long long"]),
      key: "maxAge",
      defaultValue: () => null
    },
    {
      converter: A.nullableConverter(A.converters.DOMString),
      key: "domain",
      defaultValue: () => null
    },
    {
      converter: A.nullableConverter(A.converters.DOMString),
      key: "path",
      defaultValue: () => null
    },
    {
      converter: A.nullableConverter(A.converters.boolean),
      key: "secure",
      defaultValue: () => null
    },
    {
      converter: A.nullableConverter(A.converters.boolean),
      key: "httpOnly",
      defaultValue: () => null
    },
    {
      converter: A.converters.USVString,
      key: "sameSite",
      allowedValues: ["Strict", "Lax", "None"]
    },
    {
      converter: A.sequenceConverter(A.converters.DOMString),
      key: "unparsed",
      defaultValue: () => new Array(0)
    }
  ]), Fs = {
    getCookies: r,
    deleteCookie: n,
    getSetCookies: o,
    setCookie: a
  }, Fs;
}
var Ts, Ui;
function nA() {
  if (Ui) return Ts;
  Ui = 1;
  const { webidl: e } = $e(), { kEnumerableProperty: t } = Ue(), { kConstruct: A } = Ve(), { MessagePort: s } = Nn;
  class r extends Event {
    #e;
    constructor(i, c = {}) {
      if (i === A) {
        super(arguments[1], arguments[2]), e.util.markAsUncloneable(this);
        return;
      }
      const Q = "MessageEvent constructor";
      e.argumentLengthCheck(arguments, 1, Q), i = e.converters.DOMString(i, Q, "type"), c = e.converters.MessageEventInit(c, Q, "eventInitDict"), super(i, c), this.#e = c, e.util.markAsUncloneable(this);
    }
    get data() {
      return e.brandCheck(this, r), this.#e.data;
    }
    get origin() {
      return e.brandCheck(this, r), this.#e.origin;
    }
    get lastEventId() {
      return e.brandCheck(this, r), this.#e.lastEventId;
    }
    get source() {
      return e.brandCheck(this, r), this.#e.source;
    }
    get ports() {
      return e.brandCheck(this, r), Object.isFrozen(this.#e.ports) || Object.freeze(this.#e.ports), this.#e.ports;
    }
    initMessageEvent(i, c = !1, Q = !1, h = null, B = "", d = "", y = null, b = []) {
      return e.brandCheck(this, r), e.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent"), new r(i, {
        bubbles: c,
        cancelable: Q,
        data: h,
        origin: B,
        lastEventId: d,
        source: y,
        ports: b
      });
    }
    static createFastMessageEvent(i, c) {
      const Q = new r(A, i, c);
      return Q.#e = c, Q.#e.data ??= null, Q.#e.origin ??= "", Q.#e.lastEventId ??= "", Q.#e.source ??= null, Q.#e.ports ??= [], Q;
    }
  }
  const { createFastMessageEvent: n } = r;
  delete r.createFastMessageEvent;
  class o extends Event {
    #e;
    constructor(i, c = {}) {
      const Q = "CloseEvent constructor";
      e.argumentLengthCheck(arguments, 1, Q), i = e.converters.DOMString(i, Q, "type"), c = e.converters.CloseEventInit(c), super(i, c), this.#e = c, e.util.markAsUncloneable(this);
    }
    get wasClean() {
      return e.brandCheck(this, o), this.#e.wasClean;
    }
    get code() {
      return e.brandCheck(this, o), this.#e.code;
    }
    get reason() {
      return e.brandCheck(this, o), this.#e.reason;
    }
  }
  class a extends Event {
    #e;
    constructor(i, c) {
      const Q = "ErrorEvent constructor";
      e.argumentLengthCheck(arguments, 1, Q), super(i, c), e.util.markAsUncloneable(this), i = e.converters.DOMString(i, Q, "type"), c = e.converters.ErrorEventInit(c ?? {}), this.#e = c;
    }
    get message() {
      return e.brandCheck(this, a), this.#e.message;
    }
    get filename() {
      return e.brandCheck(this, a), this.#e.filename;
    }
    get lineno() {
      return e.brandCheck(this, a), this.#e.lineno;
    }
    get colno() {
      return e.brandCheck(this, a), this.#e.colno;
    }
    get error() {
      return e.brandCheck(this, a), this.#e.error;
    }
  }
  Object.defineProperties(r.prototype, {
    [Symbol.toStringTag]: {
      value: "MessageEvent",
      configurable: !0
    },
    data: t,
    origin: t,
    lastEventId: t,
    source: t,
    ports: t,
    initMessageEvent: t
  }), Object.defineProperties(o.prototype, {
    [Symbol.toStringTag]: {
      value: "CloseEvent",
      configurable: !0
    },
    reason: t,
    code: t,
    wasClean: t
  }), Object.defineProperties(a.prototype, {
    [Symbol.toStringTag]: {
      value: "ErrorEvent",
      configurable: !0
    },
    message: t,
    filename: t,
    lineno: t,
    colno: t,
    error: t
  }), e.converters.MessagePort = e.interfaceConverter(s), e.converters["sequence<MessagePort>"] = e.sequenceConverter(
    e.converters.MessagePort
  );
  const u = [
    {
      key: "bubbles",
      converter: e.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "cancelable",
      converter: e.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "composed",
      converter: e.converters.boolean,
      defaultValue: () => !1
    }
  ];
  return e.converters.MessageEventInit = e.dictionaryConverter([
    ...u,
    {
      key: "data",
      converter: e.converters.any,
      defaultValue: () => null
    },
    {
      key: "origin",
      converter: e.converters.USVString,
      defaultValue: () => ""
    },
    {
      key: "lastEventId",
      converter: e.converters.DOMString,
      defaultValue: () => ""
    },
    {
      key: "source",
      // Node doesn't implement WindowProxy or ServiceWorker, so the only
      // valid value for source is a MessagePort.
      converter: e.nullableConverter(e.converters.MessagePort),
      defaultValue: () => null
    },
    {
      key: "ports",
      converter: e.converters["sequence<MessagePort>"],
      defaultValue: () => new Array(0)
    }
  ]), e.converters.CloseEventInit = e.dictionaryConverter([
    ...u,
    {
      key: "wasClean",
      converter: e.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "code",
      converter: e.converters["unsigned short"],
      defaultValue: () => 0
    },
    {
      key: "reason",
      converter: e.converters.USVString,
      defaultValue: () => ""
    }
  ]), e.converters.ErrorEventInit = e.dictionaryConverter([
    ...u,
    {
      key: "message",
      converter: e.converters.DOMString,
      defaultValue: () => ""
    },
    {
      key: "filename",
      converter: e.converters.USVString,
      defaultValue: () => ""
    },
    {
      key: "lineno",
      converter: e.converters["unsigned long"],
      defaultValue: () => 0
    },
    {
      key: "colno",
      converter: e.converters["unsigned long"],
      defaultValue: () => 0
    },
    {
      key: "error",
      converter: e.converters.any
    }
  ]), Ts = {
    MessageEvent: r,
    CloseEvent: o,
    ErrorEvent: a,
    createFastMessageEvent: n
  }, Ts;
}
var Ss, Ni;
function Jt() {
  if (Ni) return Ss;
  Ni = 1;
  const e = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", t = {
    enumerable: !0,
    writable: !1,
    configurable: !1
  }, A = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
  }, s = {
    NOT_SENT: 0,
    PROCESSING: 1,
    SENT: 2
  }, r = {
    CONTINUATION: 0,
    TEXT: 1,
    BINARY: 2,
    CLOSE: 8,
    PING: 9,
    PONG: 10
  }, n = 2 ** 16 - 1, o = {
    INFO: 0,
    PAYLOADLENGTH_16: 2,
    PAYLOADLENGTH_64: 3,
    READ_DATA: 4
  }, a = Buffer.allocUnsafe(0);
  return Ss = {
    uid: e,
    sentCloseFrameState: s,
    staticPropertyDescriptors: t,
    states: A,
    opcodes: r,
    maxUnsigned16Bit: n,
    parserStates: o,
    emptyBuffer: a,
    sendHints: {
      string: 1,
      typedArray: 2,
      arrayBuffer: 3,
      blob: 4
    }
  }, Ss;
}
var Us, Mi;
function UA() {
  return Mi || (Mi = 1, Us = {
    kWebSocketURL: /* @__PURE__ */ Symbol("url"),
    kReadyState: /* @__PURE__ */ Symbol("ready state"),
    kController: /* @__PURE__ */ Symbol("controller"),
    kResponse: /* @__PURE__ */ Symbol("response"),
    kBinaryType: /* @__PURE__ */ Symbol("binary type"),
    kSentClose: /* @__PURE__ */ Symbol("sent close"),
    kReceivedClose: /* @__PURE__ */ Symbol("received close"),
    kByteParser: /* @__PURE__ */ Symbol("byte parser")
  }), Us;
}
var Ns, Li;
function NA() {
  if (Li) return Ns;
  Li = 1;
  const { kReadyState: e, kController: t, kResponse: A, kBinaryType: s, kWebSocketURL: r } = UA(), { states: n, opcodes: o } = Jt(), { ErrorEvent: a, createFastMessageEvent: u } = nA(), { isUtf8: l } = at, { collectASequenceOfCodePointsFast: i, removeHTTPWhitespace: c } = st();
  function Q(U) {
    return U[e] === n.CONNECTING;
  }
  function h(U) {
    return U[e] === n.OPEN;
  }
  function B(U) {
    return U[e] === n.CLOSING;
  }
  function d(U) {
    return U[e] === n.CLOSED;
  }
  function y(U, S, G = ($, ne) => new Event($, ne), v = {}) {
    const $ = G(U, v);
    S.dispatchEvent($);
  }
  function b(U, S, G) {
    if (U[e] !== n.OPEN)
      return;
    let v;
    if (S === o.TEXT)
      try {
        v = D(G);
      } catch {
        N(U, "Received invalid UTF-8 in text frame.");
        return;
      }
    else S === o.BINARY && (U[s] === "blob" ? v = new Blob([G]) : v = F(G));
    y("message", U, u, {
      origin: U[r].origin,
      data: v
    });
  }
  function F(U) {
    return U.byteLength === U.buffer.byteLength ? U.buffer : U.buffer.slice(U.byteOffset, U.byteOffset + U.byteLength);
  }
  function M(U) {
    if (U.length === 0)
      return !1;
    for (let S = 0; S < U.length; ++S) {
      const G = U.charCodeAt(S);
      if (G < 33 || // CTL, contains SP (0x20) and HT (0x09)
      G > 126 || G === 34 || // "
      G === 40 || // (
      G === 41 || // )
      G === 44 || // ,
      G === 47 || // /
      G === 58 || // :
      G === 59 || // ;
      G === 60 || // <
      G === 61 || // =
      G === 62 || // >
      G === 63 || // ?
      G === 64 || // @
      G === 91 || // [
      G === 92 || // \
      G === 93 || // ]
      G === 123 || // {
      G === 125)
        return !1;
    }
    return !0;
  }
  function L(U) {
    return U >= 1e3 && U < 1015 ? U !== 1004 && // reserved
    U !== 1005 && // "MUST NOT be set as a status code"
    U !== 1006 : U >= 3e3 && U <= 4999;
  }
  function N(U, S) {
    const { [t]: G, [A]: v } = U;
    G.abort(), v?.socket && !v.socket.destroyed && v.socket.destroy(), S && y("error", U, ($, ne) => new a($, ne), {
      error: new Error(S),
      message: S
    });
  }
  function f(U) {
    return U === o.CLOSE || U === o.PING || U === o.PONG;
  }
  function E(U) {
    return U === o.CONTINUATION;
  }
  function p(U) {
    return U === o.TEXT || U === o.BINARY;
  }
  function g(U) {
    return p(U) || E(U) || f(U);
  }
  function C(U) {
    const S = { position: 0 }, G = /* @__PURE__ */ new Map();
    for (; S.position < U.length; ) {
      const v = i(";", U, S), [$, ne = ""] = v.split("=");
      G.set(
        c($, !0, !1),
        c(ne, !1, !0)
      ), S.position++;
    }
    return G;
  }
  function w(U) {
    for (let S = 0; S < U.length; S++) {
      const G = U.charCodeAt(S);
      if (G < 48 || G > 57)
        return !1;
    }
    return !0;
  }
  const I = typeof process.versions.icu == "string", m = I ? new TextDecoder("utf-8", { fatal: !0 }) : void 0, D = I ? m.decode.bind(m) : function(U) {
    if (l(U))
      return U.toString("utf-8");
    throw new TypeError("Invalid utf-8 received.");
  };
  return Ns = {
    isConnecting: Q,
    isEstablished: h,
    isClosing: B,
    isClosed: d,
    fireEvent: y,
    isValidSubprotocol: M,
    isValidStatusCode: L,
    failWebsocketConnection: N,
    websocketMessageReceived: b,
    utf8Decode: D,
    isControlFrame: f,
    isContinuationFrame: E,
    isTextBinaryFrame: p,
    isValidOpcode: g,
    parseExtensions: C,
    isValidClientWindowBits: w
  }, Ns;
}
var Ms, Gi;
function Ls() {
  if (Gi) return Ms;
  Gi = 1;
  const { maxUnsigned16Bit: e } = Jt(), t = 16386;
  let A, s = null, r = t;
  try {
    A = require("node:crypto");
  } catch {
    A = {
      // not full compatibility, but minimum.
      randomFillSync: function(u, l, i) {
        for (let c = 0; c < u.length; ++c)
          u[c] = Math.random() * 255 | 0;
        return u;
      }
    };
  }
  function n() {
    return r === t && (r = 0, A.randomFillSync(s ??= Buffer.allocUnsafe(t), 0, t)), [s[r++], s[r++], s[r++], s[r++]];
  }
  class o {
    /**
     * @param {Buffer|undefined} data
     */
    constructor(u) {
      this.frameData = u;
    }
    createFrame(u) {
      const l = this.frameData, i = n(), c = l?.byteLength ?? 0;
      let Q = c, h = 6;
      c > e ? (h += 8, Q = 127) : c > 125 && (h += 2, Q = 126);
      const B = Buffer.allocUnsafe(c + h);
      B[0] = B[1] = 0, B[0] |= 128, B[0] = (B[0] & 240) + u;
      B[h - 4] = i[0], B[h - 3] = i[1], B[h - 2] = i[2], B[h - 1] = i[3], B[1] = Q, Q === 126 ? B.writeUInt16BE(c, 2) : Q === 127 && (B[2] = B[3] = 0, B.writeUIntBE(c, 4, 6)), B[1] |= 128;
      for (let d = 0; d < c; ++d)
        B[h + d] = l[d] ^ i[d & 3];
      return B;
    }
  }
  return Ms = {
    WebsocketFrameSend: o
  }, Ms;
}
var Gs, vi;
function Yi() {
  if (vi) return Gs;
  vi = 1;
  const { uid: e, states: t, sentCloseFrameState: A, emptyBuffer: s, opcodes: r } = Jt(), {
    kReadyState: n,
    kSentClose: o,
    kByteParser: a,
    kReceivedClose: u,
    kResponse: l
  } = UA(), { fireEvent: i, failWebsocketConnection: c, isClosing: Q, isClosed: h, isEstablished: B, parseExtensions: d } = NA(), { channels: y } = Kt(), { CloseEvent: b } = nA(), { makeRequest: F } = sA(), { fetching: M } = SA(), { Headers: L, getHeadersList: N } = Yt(), { getDecodeSplit: f } = it(), { WebsocketFrameSend: E } = Ls();
  let p;
  try {
    p = require("node:crypto");
  } catch {
  }
  function g(D, U, S, G, v, $) {
    const ne = D;
    ne.protocol = D.protocol === "ws:" ? "http:" : "https:";
    const ge = F({
      urlList: [ne],
      client: S,
      serviceWorkers: "none",
      referrer: "no-referrer",
      mode: "websocket",
      credentials: "include",
      cache: "no-store",
      redirect: "error"
    });
    if ($.headers) {
      const Qe = N(new L($.headers));
      ge.headersList = Qe;
    }
    const ae = p.randomBytes(16).toString("base64");
    ge.headersList.append("sec-websocket-key", ae), ge.headersList.append("sec-websocket-version", "13");
    for (const Qe of U)
      ge.headersList.append("sec-websocket-protocol", Qe);
    return ge.headersList.append("sec-websocket-extensions", "permessage-deflate; client_max_window_bits"), M({
      request: ge,
      useParallelQueue: !0,
      dispatcher: $.dispatcher,
      processResponse(Qe) {
        if (Qe.type === "error" || Qe.status !== 101) {
          c(G, "Received network error or non-101 status code.");
          return;
        }
        if (U.length !== 0 && !Qe.headersList.get("Sec-WebSocket-Protocol")) {
          c(G, "Server did not respond with sent protocols.");
          return;
        }
        if (Qe.headersList.get("Upgrade")?.toLowerCase() !== "websocket") {
          c(G, 'Server did not set Upgrade header to "websocket".');
          return;
        }
        if (Qe.headersList.get("Connection")?.toLowerCase() !== "upgrade") {
          c(G, 'Server did not set Connection header to "upgrade".');
          return;
        }
        const ye = Qe.headersList.get("Sec-WebSocket-Accept"), we = p.createHash("sha1").update(ae + e).digest("base64");
        if (ye !== we) {
          c(G, "Incorrect hash received in Sec-WebSocket-Accept header.");
          return;
        }
        const X = Qe.headersList.get("Sec-WebSocket-Extensions");
        let W;
        if (X !== null && (W = d(X), !W.has("permessage-deflate"))) {
          c(G, "Sec-WebSocket-Extensions header does not match.");
          return;
        }
        const re = Qe.headersList.get("Sec-WebSocket-Protocol");
        if (re !== null && !f("sec-websocket-protocol", ge.headersList).includes(re)) {
          c(G, "Protocol was not set in the opening handshake.");
          return;
        }
        Qe.socket.on("data", w), Qe.socket.on("close", I), Qe.socket.on("error", m), y.open.hasSubscribers && y.open.publish({
          address: Qe.socket.address(),
          protocol: re,
          extensions: X
        }), v(Qe, W);
      }
    });
  }
  function C(D, U, S, G) {
    if (!(Q(D) || h(D))) if (!B(D))
      c(D, "Connection was closed before it was established."), D[n] = t.CLOSING;
    else if (D[o] === A.NOT_SENT) {
      D[o] = A.PROCESSING;
      const v = new E();
      U !== void 0 && S === void 0 ? (v.frameData = Buffer.allocUnsafe(2), v.frameData.writeUInt16BE(U, 0)) : U !== void 0 && S !== void 0 ? (v.frameData = Buffer.allocUnsafe(2 + G), v.frameData.writeUInt16BE(U, 0), v.frameData.write(S, 2, "utf-8")) : v.frameData = s, D[l].socket.write(v.createFrame(r.CLOSE)), D[o] = A.SENT, D[n] = t.CLOSING;
    } else
      D[n] = t.CLOSING;
  }
  function w(D) {
    this.ws[a].write(D) || this.pause();
  }
  function I() {
    const { ws: D } = this, { [l]: U } = D;
    U.socket.off("data", w), U.socket.off("close", I), U.socket.off("error", m);
    const S = D[o] === A.SENT && D[u];
    let G = 1005, v = "";
    const $ = D[a].closingInfo;
    $ && !$.error ? (G = $.code ?? 1005, v = $.reason) : D[u] || (G = 1006), D[n] = t.CLOSED, i("close", D, (ne, ge) => new b(ne, ge), {
      wasClean: S,
      code: G,
      reason: v
    }), y.close.hasSubscribers && y.close.publish({
      websocket: D,
      code: G,
      reason: v
    });
  }
  function m(D) {
    const { ws: U } = this;
    U[n] = t.CLOSING, y.socketError.hasSubscribers && y.socketError.publish(D), this.destroy();
  }
  return Gs = {
    establishWebSocketConnection: g,
    closeWebSocketConnection: C
  }, Gs;
}
var vs, Ji;
function qg() {
  if (Ji) return vs;
  Ji = 1;
  const { createInflateRaw: e, Z_DEFAULT_WINDOWBITS: t } = jA, { isValidClientWindowBits: A } = NA(), s = Buffer.from([0, 0, 255, 255]), r = /* @__PURE__ */ Symbol("kBuffer"), n = /* @__PURE__ */ Symbol("kLength");
  class o {
    /** @type {import('node:zlib').InflateRaw} */
    #e;
    #t = {};
    constructor(u) {
      this.#t.serverNoContextTakeover = u.has("server_no_context_takeover"), this.#t.serverMaxWindowBits = u.get("server_max_window_bits");
    }
    decompress(u, l, i) {
      if (!this.#e) {
        let c = t;
        if (this.#t.serverMaxWindowBits) {
          if (!A(this.#t.serverMaxWindowBits)) {
            i(new Error("Invalid server_max_window_bits"));
            return;
          }
          c = Number.parseInt(this.#t.serverMaxWindowBits);
        }
        this.#e = e({ windowBits: c }), this.#e[r] = [], this.#e[n] = 0, this.#e.on("data", (Q) => {
          this.#e[r].push(Q), this.#e[n] += Q.length;
        }), this.#e.on("error", (Q) => {
          this.#e = null, i(Q);
        });
      }
      this.#e.write(u), l && this.#e.write(s), this.#e.flush(() => {
        const c = Buffer.concat(this.#e[r], this.#e[n]);
        this.#e[r].length = 0, this.#e[n] = 0, i(null, c);
      });
    }
  }
  return vs = { PerMessageDeflate: o }, vs;
}
var Ys, Hi;
function zg() {
  if (Hi) return Ys;
  Hi = 1;
  const { Writable: e } = ot, t = He, { parserStates: A, opcodes: s, states: r, emptyBuffer: n, sentCloseFrameState: o } = Jt(), { kReadyState: a, kSentClose: u, kResponse: l, kReceivedClose: i } = UA(), { channels: c } = Kt(), {
    isValidStatusCode: Q,
    isValidOpcode: h,
    failWebsocketConnection: B,
    websocketMessageReceived: d,
    utf8Decode: y,
    isControlFrame: b,
    isTextBinaryFrame: F,
    isContinuationFrame: M
  } = NA(), { WebsocketFrameSend: L } = Ls(), { closeWebSocketConnection: N } = Yi(), { PerMessageDeflate: f } = qg();
  class E extends e {
    #e = [];
    #t = 0;
    #s = !1;
    #r = A.INFO;
    #A = {};
    #n = [];
    /** @type {Map<string, PerMessageDeflate>} */
    #o;
    constructor(g, C) {
      super(), this.ws = g, this.#o = C ?? /* @__PURE__ */ new Map(), this.#o.has("permessage-deflate") && this.#o.set("permessage-deflate", new f(C));
    }
    /**
     * @param {Buffer} chunk
     * @param {() => void} callback
     */
    _write(g, C, w) {
      this.#e.push(g), this.#t += g.length, this.#s = !0, this.run(w);
    }
    /**
     * Runs whenever a new chunk is received.
     * Callback is called whenever there are no more chunks buffering,
     * or not enough bytes are buffered to parse.
     */
    run(g) {
      for (; this.#s; )
        if (this.#r === A.INFO) {
          if (this.#t < 2)
            return g();
          const C = this.consume(2), w = (C[0] & 128) !== 0, I = C[0] & 15, m = (C[1] & 128) === 128, D = !w && I !== s.CONTINUATION, U = C[1] & 127, S = C[0] & 64, G = C[0] & 32, v = C[0] & 16;
          if (!h(I))
            return B(this.ws, "Invalid opcode received"), g();
          if (m)
            return B(this.ws, "Frame cannot be masked"), g();
          if (S !== 0 && !this.#o.has("permessage-deflate")) {
            B(this.ws, "Expected RSV1 to be clear.");
            return;
          }
          if (G !== 0 || v !== 0) {
            B(this.ws, "RSV1, RSV2, RSV3 must be clear");
            return;
          }
          if (D && !F(I)) {
            B(this.ws, "Invalid frame type was fragmented.");
            return;
          }
          if (F(I) && this.#n.length > 0) {
            B(this.ws, "Expected continuation frame");
            return;
          }
          if (this.#A.fragmented && D) {
            B(this.ws, "Fragmented frame exceeded 125 bytes.");
            return;
          }
          if ((U > 125 || D) && b(I)) {
            B(this.ws, "Control frame either too large or fragmented");
            return;
          }
          if (M(I) && this.#n.length === 0 && !this.#A.compressed) {
            B(this.ws, "Unexpected continuation frame");
            return;
          }
          U <= 125 ? (this.#A.payloadLength = U, this.#r = A.READ_DATA) : U === 126 ? this.#r = A.PAYLOADLENGTH_16 : U === 127 && (this.#r = A.PAYLOADLENGTH_64), F(I) && (this.#A.binaryType = I, this.#A.compressed = S !== 0), this.#A.opcode = I, this.#A.masked = m, this.#A.fin = w, this.#A.fragmented = D;
        } else if (this.#r === A.PAYLOADLENGTH_16) {
          if (this.#t < 2)
            return g();
          const C = this.consume(2);
          this.#A.payloadLength = C.readUInt16BE(0), this.#r = A.READ_DATA;
        } else if (this.#r === A.PAYLOADLENGTH_64) {
          if (this.#t < 8)
            return g();
          const C = this.consume(8), w = C.readUInt32BE(0);
          if (w > 2 ** 31 - 1) {
            B(this.ws, "Received payload length > 2^31 bytes.");
            return;
          }
          const I = C.readUInt32BE(4);
          this.#A.payloadLength = (w << 8) + I, this.#r = A.READ_DATA;
        } else if (this.#r === A.READ_DATA) {
          if (this.#t < this.#A.payloadLength)
            return g();
          const C = this.consume(this.#A.payloadLength);
          if (b(this.#A.opcode))
            this.#s = this.parseControlFrame(C), this.#r = A.INFO;
          else if (this.#A.compressed) {
            this.#o.get("permessage-deflate").decompress(C, this.#A.fin, (w, I) => {
              if (w) {
                N(this.ws, 1007, w.message, w.message.length);
                return;
              }
              if (this.#n.push(I), !this.#A.fin) {
                this.#r = A.INFO, this.#s = !0, this.run(g);
                return;
              }
              d(this.ws, this.#A.binaryType, Buffer.concat(this.#n)), this.#s = !0, this.#r = A.INFO, this.#n.length = 0, this.run(g);
            }), this.#s = !1;
            break;
          } else {
            if (this.#n.push(C), !this.#A.fragmented && this.#A.fin) {
              const w = Buffer.concat(this.#n);
              d(this.ws, this.#A.binaryType, w), this.#n.length = 0;
            }
            this.#r = A.INFO;
          }
        }
    }
    /**
     * Take n bytes from the buffered Buffers
     * @param {number} n
     * @returns {Buffer}
     */
    consume(g) {
      if (g > this.#t)
        throw new Error("Called consume() before buffers satiated.");
      if (g === 0)
        return n;
      if (this.#e[0].length === g)
        return this.#t -= this.#e[0].length, this.#e.shift();
      const C = Buffer.allocUnsafe(g);
      let w = 0;
      for (; w !== g; ) {
        const I = this.#e[0], { length: m } = I;
        if (m + w === g) {
          C.set(this.#e.shift(), w);
          break;
        } else if (m + w > g) {
          C.set(I.subarray(0, g - w), w), this.#e[0] = I.subarray(g - w);
          break;
        } else
          C.set(this.#e.shift(), w), w += I.length;
      }
      return this.#t -= g, C;
    }
    parseCloseBody(g) {
      t(g.length !== 1);
      let C;
      if (g.length >= 2 && (C = g.readUInt16BE(0)), C !== void 0 && !Q(C))
        return { code: 1002, reason: "Invalid status code", error: !0 };
      let w = g.subarray(2);
      w[0] === 239 && w[1] === 187 && w[2] === 191 && (w = w.subarray(3));
      try {
        w = y(w);
      } catch {
        return { code: 1007, reason: "Invalid UTF-8", error: !0 };
      }
      return { code: C, reason: w, error: !1 };
    }
    /**
     * Parses control frames.
     * @param {Buffer} body
     */
    parseControlFrame(g) {
      const { opcode: C, payloadLength: w } = this.#A;
      if (C === s.CLOSE) {
        if (w === 1)
          return B(this.ws, "Received close frame with a 1-byte body."), !1;
        if (this.#A.closeInfo = this.parseCloseBody(g), this.#A.closeInfo.error) {
          const { code: I, reason: m } = this.#A.closeInfo;
          return N(this.ws, I, m, m.length), B(this.ws, m), !1;
        }
        if (this.ws[u] !== o.SENT) {
          let I = n;
          this.#A.closeInfo.code && (I = Buffer.allocUnsafe(2), I.writeUInt16BE(this.#A.closeInfo.code, 0));
          const m = new L(I);
          this.ws[l].socket.write(
            m.createFrame(s.CLOSE),
            (D) => {
              D || (this.ws[u] = o.SENT);
            }
          );
        }
        return this.ws[a] = r.CLOSING, this.ws[i] = !0, !1;
      } else if (C === s.PING) {
        if (!this.ws[i]) {
          const I = new L(g);
          this.ws[l].socket.write(I.createFrame(s.PONG)), c.ping.hasSubscribers && c.ping.publish({
            payload: g
          });
        }
      } else C === s.PONG && c.pong.hasSubscribers && c.pong.publish({
        payload: g
      });
      return !0;
    }
    get closingInfo() {
      return this.#A.closeInfo;
    }
  }
  return Ys = {
    ByteParser: E
  }, Ys;
}
var Js, Oi;
function Zg() {
  if (Oi) return Js;
  Oi = 1;
  const { WebsocketFrameSend: e } = Ls(), { opcodes: t, sendHints: A } = Jt(), s = yo(), r = Buffer[Symbol.species];
  class n {
    /**
     * @type {FixedQueue}
     */
    #e = new s();
    /**
     * @type {boolean}
     */
    #t = !1;
    /** @type {import('node:net').Socket} */
    #s;
    constructor(l) {
      this.#s = l;
    }
    add(l, i, c) {
      if (c !== A.blob) {
        const h = o(l, c);
        if (!this.#t)
          this.#s.write(h, i);
        else {
          const B = {
            promise: null,
            callback: i,
            frame: h
          };
          this.#e.push(B);
        }
        return;
      }
      const Q = {
        promise: l.arrayBuffer().then((h) => {
          Q.promise = null, Q.frame = o(h, c);
        }),
        callback: i,
        frame: null
      };
      this.#e.push(Q), this.#t || this.#r();
    }
    async #r() {
      this.#t = !0;
      const l = this.#e;
      for (; !l.isEmpty(); ) {
        const i = l.shift();
        i.promise !== null && await i.promise, this.#s.write(i.frame, i.callback), i.callback = i.frame = null;
      }
      this.#t = !1;
    }
  }
  function o(u, l) {
    return new e(a(u, l)).createFrame(l === A.string ? t.TEXT : t.BINARY);
  }
  function a(u, l) {
    switch (l) {
      case A.string:
        return Buffer.from(u);
      case A.arrayBuffer:
      case A.blob:
        return new r(u);
      case A.typedArray:
        return new r(u.buffer, u.byteOffset, u.byteLength);
    }
  }
  return Js = { SendQueue: n }, Js;
}
var Hs, Pi;
function Kg() {
  if (Pi) return Hs;
  Pi = 1;
  const { webidl: e } = $e(), { URLSerializer: t } = st(), { environmentSettingsObject: A } = it(), { staticPropertyDescriptors: s, states: r, sentCloseFrameState: n, sendHints: o } = Jt(), {
    kWebSocketURL: a,
    kReadyState: u,
    kController: l,
    kBinaryType: i,
    kResponse: c,
    kSentClose: Q,
    kByteParser: h
  } = UA(), {
    isConnecting: B,
    isEstablished: d,
    isClosing: y,
    isValidSubprotocol: b,
    fireEvent: F
  } = NA(), { establishWebSocketConnection: M, closeWebSocketConnection: L } = Yi(), { ByteParser: N } = zg(), { kEnumerableProperty: f, isBlobLike: E } = Ue(), { getGlobalDispatcher: p } = ss(), { types: g } = rt, { ErrorEvent: C, CloseEvent: w } = nA(), { SendQueue: I } = Zg();
  class m extends EventTarget {
    #e = {
      open: null,
      error: null,
      close: null,
      message: null
    };
    #t = 0;
    #s = "";
    #r = "";
    /** @type {SendQueue} */
    #A;
    /**
     * @param {string} url
     * @param {string|string[]} protocols
     */
    constructor(G, v = []) {
      super(), e.util.markAsUncloneable(this);
      const $ = "WebSocket constructor";
      e.argumentLengthCheck(arguments, 1, $);
      const ne = e.converters["DOMString or sequence<DOMString> or WebSocketInit"](v, $, "options");
      G = e.converters.USVString(G, $, "url"), v = ne.protocols;
      const ge = A.settingsObject.baseUrl;
      let ae;
      try {
        ae = new URL(G, ge);
      } catch (he) {
        throw new DOMException(he, "SyntaxError");
      }
      if (ae.protocol === "http:" ? ae.protocol = "ws:" : ae.protocol === "https:" && (ae.protocol = "wss:"), ae.protocol !== "ws:" && ae.protocol !== "wss:")
        throw new DOMException(
          `Expected a ws: or wss: protocol, got ${ae.protocol}`,
          "SyntaxError"
        );
      if (ae.hash || ae.href.endsWith("#"))
        throw new DOMException("Got fragment", "SyntaxError");
      if (typeof v == "string" && (v = [v]), v.length !== new Set(v.map((he) => he.toLowerCase())).size)
        throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      if (v.length > 0 && !v.every((he) => b(he)))
        throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      this[a] = new URL(ae.href);
      const Be = A.settingsObject;
      this[l] = M(
        ae,
        v,
        Be,
        this,
        (he, Qe) => this.#n(he, Qe),
        ne
      ), this[u] = m.CONNECTING, this[Q] = n.NOT_SENT, this[i] = "blob";
    }
    /**
     * @see https://websockets.spec.whatwg.org/#dom-websocket-close
     * @param {number|undefined} code
     * @param {string|undefined} reason
     */
    close(G = void 0, v = void 0) {
      e.brandCheck(this, m);
      const $ = "WebSocket.close";
      if (G !== void 0 && (G = e.converters["unsigned short"](G, $, "code", { clamp: !0 })), v !== void 0 && (v = e.converters.USVString(v, $, "reason")), G !== void 0 && G !== 1e3 && (G < 3e3 || G > 4999))
        throw new DOMException("invalid code", "InvalidAccessError");
      let ne = 0;
      if (v !== void 0 && (ne = Buffer.byteLength(v), ne > 123))
        throw new DOMException(
          `Reason must be less than 123 bytes; received ${ne}`,
          "SyntaxError"
        );
      L(this, G, v, ne);
    }
    /**
     * @see https://websockets.spec.whatwg.org/#dom-websocket-send
     * @param {NodeJS.TypedArray|ArrayBuffer|Blob|string} data
     */
    send(G) {
      e.brandCheck(this, m);
      const v = "WebSocket.send";
      if (e.argumentLengthCheck(arguments, 1, v), G = e.converters.WebSocketSendData(G, v, "data"), B(this))
        throw new DOMException("Sent before connected.", "InvalidStateError");
      if (!(!d(this) || y(this)))
        if (typeof G == "string") {
          const $ = Buffer.byteLength(G);
          this.#t += $, this.#A.add(G, () => {
            this.#t -= $;
          }, o.string);
        } else g.isArrayBuffer(G) ? (this.#t += G.byteLength, this.#A.add(G, () => {
          this.#t -= G.byteLength;
        }, o.arrayBuffer)) : ArrayBuffer.isView(G) ? (this.#t += G.byteLength, this.#A.add(G, () => {
          this.#t -= G.byteLength;
        }, o.typedArray)) : E(G) && (this.#t += G.size, this.#A.add(G, () => {
          this.#t -= G.size;
        }, o.blob));
    }
    get readyState() {
      return e.brandCheck(this, m), this[u];
    }
    get bufferedAmount() {
      return e.brandCheck(this, m), this.#t;
    }
    get url() {
      return e.brandCheck(this, m), t(this[a]);
    }
    get extensions() {
      return e.brandCheck(this, m), this.#r;
    }
    get protocol() {
      return e.brandCheck(this, m), this.#s;
    }
    get onopen() {
      return e.brandCheck(this, m), this.#e.open;
    }
    set onopen(G) {
      e.brandCheck(this, m), this.#e.open && this.removeEventListener("open", this.#e.open), typeof G == "function" ? (this.#e.open = G, this.addEventListener("open", G)) : this.#e.open = null;
    }
    get onerror() {
      return e.brandCheck(this, m), this.#e.error;
    }
    set onerror(G) {
      e.brandCheck(this, m), this.#e.error && this.removeEventListener("error", this.#e.error), typeof G == "function" ? (this.#e.error = G, this.addEventListener("error", G)) : this.#e.error = null;
    }
    get onclose() {
      return e.brandCheck(this, m), this.#e.close;
    }
    set onclose(G) {
      e.brandCheck(this, m), this.#e.close && this.removeEventListener("close", this.#e.close), typeof G == "function" ? (this.#e.close = G, this.addEventListener("close", G)) : this.#e.close = null;
    }
    get onmessage() {
      return e.brandCheck(this, m), this.#e.message;
    }
    set onmessage(G) {
      e.brandCheck(this, m), this.#e.message && this.removeEventListener("message", this.#e.message), typeof G == "function" ? (this.#e.message = G, this.addEventListener("message", G)) : this.#e.message = null;
    }
    get binaryType() {
      return e.brandCheck(this, m), this[i];
    }
    set binaryType(G) {
      e.brandCheck(this, m), G !== "blob" && G !== "arraybuffer" ? this[i] = "blob" : this[i] = G;
    }
    /**
     * @see https://websockets.spec.whatwg.org/#feedback-from-the-protocol
     */
    #n(G, v) {
      this[c] = G;
      const $ = new N(this, v);
      $.on("drain", D), $.on("error", U.bind(this)), G.socket.ws = this, this[h] = $, this.#A = new I(G.socket), this[u] = r.OPEN;
      const ne = G.headersList.get("sec-websocket-extensions");
      ne !== null && (this.#r = ne);
      const ge = G.headersList.get("sec-websocket-protocol");
      ge !== null && (this.#s = ge), F("open", this);
    }
  }
  m.CONNECTING = m.prototype.CONNECTING = r.CONNECTING, m.OPEN = m.prototype.OPEN = r.OPEN, m.CLOSING = m.prototype.CLOSING = r.CLOSING, m.CLOSED = m.prototype.CLOSED = r.CLOSED, Object.defineProperties(m.prototype, {
    CONNECTING: s,
    OPEN: s,
    CLOSING: s,
    CLOSED: s,
    url: f,
    readyState: f,
    bufferedAmount: f,
    onopen: f,
    onerror: f,
    onclose: f,
    close: f,
    onmessage: f,
    binaryType: f,
    send: f,
    extensions: f,
    protocol: f,
    [Symbol.toStringTag]: {
      value: "WebSocket",
      writable: !1,
      enumerable: !1,
      configurable: !0
    }
  }), Object.defineProperties(m, {
    CONNECTING: s,
    OPEN: s,
    CLOSING: s,
    CLOSED: s
  }), e.converters["sequence<DOMString>"] = e.sequenceConverter(
    e.converters.DOMString
  ), e.converters["DOMString or sequence<DOMString>"] = function(S, G, v) {
    return e.util.Type(S) === "Object" && Symbol.iterator in S ? e.converters["sequence<DOMString>"](S) : e.converters.DOMString(S, G, v);
  }, e.converters.WebSocketInit = e.dictionaryConverter([
    {
      key: "protocols",
      converter: e.converters["DOMString or sequence<DOMString>"],
      defaultValue: () => new Array(0)
    },
    {
      key: "dispatcher",
      converter: e.converters.any,
      defaultValue: () => p()
    },
    {
      key: "headers",
      converter: e.nullableConverter(e.converters.HeadersInit)
    }
  ]), e.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(S) {
    return e.util.Type(S) === "Object" && !(Symbol.iterator in S) ? e.converters.WebSocketInit(S) : { protocols: e.converters["DOMString or sequence<DOMString>"](S) };
  }, e.converters.WebSocketSendData = function(S) {
    if (e.util.Type(S) === "Object") {
      if (E(S))
        return e.converters.Blob(S, { strict: !1 });
      if (ArrayBuffer.isView(S) || g.isArrayBuffer(S))
        return e.converters.BufferSource(S);
    }
    return e.converters.USVString(S);
  };
  function D() {
    this.ws[c].socket.resume();
  }
  function U(S) {
    let G, v;
    S instanceof w ? (G = S.reason, v = S.code) : G = S.message, F("error", this, () => new C("error", { error: S, message: G })), L(this, v);
  }
  return Hs = {
    WebSocket: m
  }, Hs;
}
var Os, _i;
function xi() {
  if (_i) return Os;
  _i = 1;
  function e(s) {
    return s.indexOf("\0") === -1;
  }
  function t(s) {
    if (s.length === 0) return !1;
    for (let r = 0; r < s.length; r++)
      if (s.charCodeAt(r) < 48 || s.charCodeAt(r) > 57) return !1;
    return !0;
  }
  function A(s) {
    return new Promise((r) => {
      setTimeout(r, s).unref();
    });
  }
  return Os = {
    isValidLastEventId: e,
    isASCIINumber: t,
    delay: A
  }, Os;
}
var Ps, Vi;
function jg() {
  if (Vi) return Ps;
  Vi = 1;
  const { Transform: e } = ot, { isASCIINumber: t, isValidLastEventId: A } = xi(), s = [239, 187, 191], r = 10, n = 13, o = 58, a = 32;
  class u extends e {
    /**
     * @type {eventSourceSettings}
     */
    state = null;
    /**
     * Leading byte-order-mark check.
     * @type {boolean}
     */
    checkBOM = !0;
    /**
     * @type {boolean}
     */
    crlfCheck = !1;
    /**
     * @type {boolean}
     */
    eventEndCheck = !1;
    /**
     * @type {Buffer}
     */
    buffer = null;
    pos = 0;
    event = {
      data: void 0,
      event: void 0,
      id: void 0,
      retry: void 0
    };
    /**
     * @param {object} options
     * @param {eventSourceSettings} options.eventSourceSettings
     * @param {Function} [options.push]
     */
    constructor(i = {}) {
      i.readableObjectMode = !0, super(i), this.state = i.eventSourceSettings || {}, i.push && (this.push = i.push);
    }
    /**
     * @param {Buffer} chunk
     * @param {string} _encoding
     * @param {Function} callback
     * @returns {void}
     */
    _transform(i, c, Q) {
      if (i.length === 0) {
        Q();
        return;
      }
      if (this.buffer ? this.buffer = Buffer.concat([this.buffer, i]) : this.buffer = i, this.checkBOM)
        switch (this.buffer.length) {
          case 1:
            if (this.buffer[0] === s[0]) {
              Q();
              return;
            }
            this.checkBOM = !1, Q();
            return;
          case 2:
            if (this.buffer[0] === s[0] && this.buffer[1] === s[1]) {
              Q();
              return;
            }
            this.checkBOM = !1;
            break;
          case 3:
            if (this.buffer[0] === s[0] && this.buffer[1] === s[1] && this.buffer[2] === s[2]) {
              this.buffer = Buffer.alloc(0), this.checkBOM = !1, Q();
              return;
            }
            this.checkBOM = !1;
            break;
          default:
            this.buffer[0] === s[0] && this.buffer[1] === s[1] && this.buffer[2] === s[2] && (this.buffer = this.buffer.subarray(3)), this.checkBOM = !1;
            break;
        }
      for (; this.pos < this.buffer.length; ) {
        if (this.eventEndCheck) {
          if (this.crlfCheck) {
            if (this.buffer[this.pos] === r) {
              this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.crlfCheck = !1;
              continue;
            }
            this.crlfCheck = !1;
          }
          if (this.buffer[this.pos] === r || this.buffer[this.pos] === n) {
            this.buffer[this.pos] === n && (this.crlfCheck = !0), this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, (this.event.data !== void 0 || this.event.event || this.event.id || this.event.retry) && this.processEvent(this.event), this.clearEvent();
            continue;
          }
          this.eventEndCheck = !1;
          continue;
        }
        if (this.buffer[this.pos] === r || this.buffer[this.pos] === n) {
          this.buffer[this.pos] === n && (this.crlfCheck = !0), this.parseLine(this.buffer.subarray(0, this.pos), this.event), this.buffer = this.buffer.subarray(this.pos + 1), this.pos = 0, this.eventEndCheck = !0;
          continue;
        }
        this.pos++;
      }
      Q();
    }
    /**
     * @param {Buffer} line
     * @param {EventStreamEvent} event
     */
    parseLine(i, c) {
      if (i.length === 0)
        return;
      const Q = i.indexOf(o);
      if (Q === 0)
        return;
      let h = "", B = "";
      if (Q !== -1) {
        h = i.subarray(0, Q).toString("utf8");
        let d = Q + 1;
        i[d] === a && ++d, B = i.subarray(d).toString("utf8");
      } else
        h = i.toString("utf8"), B = "";
      switch (h) {
        case "data":
          c[h] === void 0 ? c[h] = B : c[h] += `
${B}`;
          break;
        case "retry":
          t(B) && (c[h] = B);
          break;
        case "id":
          A(B) && (c[h] = B);
          break;
        case "event":
          B.length > 0 && (c[h] = B);
          break;
      }
    }
    /**
     * @param {EventSourceStreamEvent} event
     */
    processEvent(i) {
      i.retry && t(i.retry) && (this.state.reconnectionTime = parseInt(i.retry, 10)), i.id && A(i.id) && (this.state.lastEventId = i.id), i.data !== void 0 && this.push({
        type: i.event || "message",
        options: {
          data: i.data,
          lastEventId: this.state.lastEventId,
          origin: this.state.origin
        }
      });
    }
    clearEvent() {
      this.event = {
        data: void 0,
        event: void 0,
        id: void 0,
        retry: void 0
      };
    }
  }
  return Ps = {
    EventSourceStream: u
  }, Ps;
}
var _s, Wi;
function Xg() {
  if (Wi) return _s;
  Wi = 1;
  const { pipeline: e } = ot, { fetching: t } = SA(), { makeRequest: A } = sA(), { webidl: s } = $e(), { EventSourceStream: r } = jg(), { parseMIMEType: n } = st(), { createFastMessageEvent: o } = nA(), { isNetworkError: a } = TA(), { delay: u } = xi(), { kEnumerableProperty: l } = Ue(), { environmentSettingsObject: i } = it();
  let c = !1;
  const Q = 3e3, h = 0, B = 1, d = 2, y = "anonymous", b = "use-credentials";
  class F extends EventTarget {
    #e = {
      open: null,
      error: null,
      message: null
    };
    #t = null;
    #s = !1;
    #r = h;
    #A = null;
    #n = null;
    #o;
    /**
     * @type {import('./eventsource-stream').eventSourceSettings}
     */
    #i;
    /**
     * Creates a new EventSource object.
     * @param {string} url
     * @param {EventSourceInit} [eventSourceInitDict]
     * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface
     */
    constructor(N, f = {}) {
      super(), s.util.markAsUncloneable(this);
      const E = "EventSource constructor";
      s.argumentLengthCheck(arguments, 1, E), c || (c = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
        code: "UNDICI-ES"
      })), N = s.converters.USVString(N, E, "url"), f = s.converters.EventSourceInitDict(f, E, "eventSourceInitDict"), this.#o = f.dispatcher, this.#i = {
        lastEventId: "",
        reconnectionTime: Q
      };
      const p = i;
      let g;
      try {
        g = new URL(N, p.settingsObject.baseUrl), this.#i.origin = g.origin;
      } catch (I) {
        throw new DOMException(I, "SyntaxError");
      }
      this.#t = g.href;
      let C = y;
      f.withCredentials && (C = b, this.#s = !0);
      const w = {
        redirect: "follow",
        keepalive: !0,
        // @see https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
        mode: "cors",
        credentials: C === "anonymous" ? "same-origin" : "omit",
        referrer: "no-referrer"
      };
      w.client = i.settingsObject, w.headersList = [["accept", { name: "accept", value: "text/event-stream" }]], w.cache = "no-store", w.initiator = "other", w.urlList = [new URL(this.#t)], this.#A = A(w), this.#a();
    }
    /**
     * Returns the state of this EventSource object's connection. It can have the
     * values described below.
     * @returns {0|1|2}
     * @readonly
     */
    get readyState() {
      return this.#r;
    }
    /**
     * Returns the URL providing the event stream.
     * @readonly
     * @returns {string}
     */
    get url() {
      return this.#t;
    }
    /**
     * Returns a boolean indicating whether the EventSource object was
     * instantiated with CORS credentials set (true), or not (false, the default).
     */
    get withCredentials() {
      return this.#s;
    }
    #a() {
      if (this.#r === d) return;
      this.#r = h;
      const N = {
        request: this.#A,
        dispatcher: this.#o
      }, f = (E) => {
        a(E) && (this.dispatchEvent(new Event("error")), this.close()), this.#c();
      };
      N.processResponseEndOfBody = f, N.processResponse = (E) => {
        if (a(E))
          if (E.aborted) {
            this.close(), this.dispatchEvent(new Event("error"));
            return;
          } else {
            this.#c();
            return;
          }
        const p = E.headersList.get("content-type", !0), g = p !== null ? n(p) : "failure", C = g !== "failure" && g.essence === "text/event-stream";
        if (E.status !== 200 || C === !1) {
          this.close(), this.dispatchEvent(new Event("error"));
          return;
        }
        this.#r = B, this.dispatchEvent(new Event("open")), this.#i.origin = E.urlList[E.urlList.length - 1].origin;
        const w = new r({
          eventSourceSettings: this.#i,
          push: (I) => {
            this.dispatchEvent(o(
              I.type,
              I.options
            ));
          }
        });
        e(
          E.body.stream,
          w,
          (I) => {
            I?.aborted === !1 && (this.close(), this.dispatchEvent(new Event("error")));
          }
        );
      }, this.#n = t(N);
    }
    /**
     * @see https://html.spec.whatwg.org/multipage/server-sent-events.html#sse-processing-model
     * @returns {Promise<void>}
     */
    async #c() {
      this.#r !== d && (this.#r = h, this.dispatchEvent(new Event("error")), await u(this.#i.reconnectionTime), this.#r === h && (this.#i.lastEventId.length && this.#A.headersList.set("last-event-id", this.#i.lastEventId, !0), this.#a()));
    }
    /**
     * Closes the connection, if any, and sets the readyState attribute to
     * CLOSED.
     */
    close() {
      s.brandCheck(this, F), this.#r !== d && (this.#r = d, this.#n.abort(), this.#A = null);
    }
    get onopen() {
      return this.#e.open;
    }
    set onopen(N) {
      this.#e.open && this.removeEventListener("open", this.#e.open), typeof N == "function" ? (this.#e.open = N, this.addEventListener("open", N)) : this.#e.open = null;
    }
    get onmessage() {
      return this.#e.message;
    }
    set onmessage(N) {
      this.#e.message && this.removeEventListener("message", this.#e.message), typeof N == "function" ? (this.#e.message = N, this.addEventListener("message", N)) : this.#e.message = null;
    }
    get onerror() {
      return this.#e.error;
    }
    set onerror(N) {
      this.#e.error && this.removeEventListener("error", this.#e.error), typeof N == "function" ? (this.#e.error = N, this.addEventListener("error", N)) : this.#e.error = null;
    }
  }
  const M = {
    CONNECTING: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: h,
      writable: !1
    },
    OPEN: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: B,
      writable: !1
    },
    CLOSED: {
      __proto__: null,
      configurable: !1,
      enumerable: !0,
      value: d,
      writable: !1
    }
  };
  return Object.defineProperties(F, M), Object.defineProperties(F.prototype, M), Object.defineProperties(F.prototype, {
    close: l,
    onerror: l,
    onmessage: l,
    onopen: l,
    readyState: l,
    url: l,
    withCredentials: l
  }), s.converters.EventSourceInitDict = s.dictionaryConverter([
    {
      key: "withCredentials",
      converter: s.converters.boolean,
      defaultValue: () => !1
    },
    {
      key: "dispatcher",
      // undici only
      converter: s.converters.any
    }
  ]), _s = {
    EventSource: F,
    defaultReconnectionTime: Q
  }, _s;
}
var qi;
function zi() {
  if (qi) return me;
  qi = 1;
  const e = eA(), t = wA(), A = tA(), s = fg(), r = AA(), n = Uo(), o = pg(), a = wg(), u = Ye(), l = Ue(), { InvalidArgumentError: i } = u, c = kg(), Q = mA(), h = ei(), B = Sg(), d = Ai(), y = zo(), b = Hr(), { getGlobalDispatcher: F, setGlobalDispatcher: M } = ss(), L = os(), N = Rr(), f = Fr();
  Object.assign(t.prototype, c), me.Dispatcher = t, me.Client = e, me.Pool = A, me.BalancedPool = s, me.Agent = r, me.ProxyAgent = n, me.EnvHttpProxyAgent = o, me.RetryAgent = a, me.RetryHandler = b, me.DecoratorHandler = L, me.RedirectHandler = N, me.createRedirectInterceptor = f, me.interceptors = {
    redirect: Ug(),
    retry: Ng(),
    dump: Mg(),
    dns: Lg()
  }, me.buildConnector = Q, me.errors = u, me.util = {
    parseHeaders: l.parseHeaders,
    headerNameToString: l.headerNameToString
  };
  function E(Be) {
    return (he, Qe, ye) => {
      if (typeof Qe == "function" && (ye = Qe, Qe = null), !he || typeof he != "string" && typeof he != "object" && !(he instanceof URL))
        throw new i("invalid url");
      if (Qe != null && typeof Qe != "object")
        throw new i("invalid opts");
      if (Qe && Qe.path != null) {
        if (typeof Qe.path != "string")
          throw new i("invalid opts.path");
        let W = Qe.path;
        Qe.path.startsWith("/") || (W = `/${W}`), he = new URL(l.parseOrigin(he).origin + W);
      } else
        Qe || (Qe = typeof he == "object" ? he : {}), he = l.parseURL(he);
      const { agent: we, dispatcher: X = F() } = Qe;
      if (we)
        throw new i("unsupported opts.agent. Did you mean opts.client?");
      return Be.call(X, {
        ...Qe,
        origin: he.origin,
        path: he.search ? `${he.pathname}${he.search}` : he.pathname,
        method: Qe.method || (Qe.body ? "PUT" : "GET")
      }, ye);
    };
  }
  me.setGlobalDispatcher = M, me.getGlobalDispatcher = F;
  const p = SA().fetch;
  me.fetch = async function(he, Qe = void 0) {
    try {
      return await p(he, Qe);
    } catch (ye) {
      throw ye && typeof ye == "object" && Error.captureStackTrace(ye), ye;
    }
  }, me.Headers = Yt().Headers, me.Response = TA().Response, me.Request = sA().Request, me.FormData = DA().FormData, me.File = globalThis.File ?? at.File, me.FileReader = Hg().FileReader;
  const { setGlobalOrigin: g, getGlobalOrigin: C } = io();
  me.setGlobalOrigin = g, me.getGlobalOrigin = C;
  const { CacheStorage: w } = _g(), { kConstruct: I } = ws();
  me.caches = new w(I);
  const { deleteCookie: m, getCookies: D, getSetCookies: U, setCookie: S } = Wg();
  me.deleteCookie = m, me.getCookies = D, me.getSetCookies = U, me.setCookie = S;
  const { parseMIMEType: G, serializeAMimeType: v } = st();
  me.parseMIMEType = G, me.serializeAMimeType = v;
  const { CloseEvent: $, ErrorEvent: ne, MessageEvent: ge } = nA();
  me.WebSocket = Kg().WebSocket, me.CloseEvent = $, me.ErrorEvent = ne, me.MessageEvent = ge, me.request = E(c.request), me.stream = E(c.stream), me.pipeline = E(c.pipeline), me.connect = E(c.connect), me.upgrade = E(c.upgrade), me.MockClient = h, me.MockPool = d, me.MockAgent = B, me.mockErrors = y;
  const { EventSource: ae } = Xg();
  return me.EventSource = ae, me;
}
var $g = zi(), Qt;
(function(e) {
  e[e.OK = 200] = "OK", e[e.MultipleChoices = 300] = "MultipleChoices", e[e.MovedPermanently = 301] = "MovedPermanently", e[e.ResourceMoved = 302] = "ResourceMoved", e[e.SeeOther = 303] = "SeeOther", e[e.NotModified = 304] = "NotModified", e[e.UseProxy = 305] = "UseProxy", e[e.SwitchProxy = 306] = "SwitchProxy", e[e.TemporaryRedirect = 307] = "TemporaryRedirect", e[e.PermanentRedirect = 308] = "PermanentRedirect", e[e.BadRequest = 400] = "BadRequest", e[e.Unauthorized = 401] = "Unauthorized", e[e.PaymentRequired = 402] = "PaymentRequired", e[e.Forbidden = 403] = "Forbidden", e[e.NotFound = 404] = "NotFound", e[e.MethodNotAllowed = 405] = "MethodNotAllowed", e[e.NotAcceptable = 406] = "NotAcceptable", e[e.ProxyAuthenticationRequired = 407] = "ProxyAuthenticationRequired", e[e.RequestTimeout = 408] = "RequestTimeout", e[e.Conflict = 409] = "Conflict", e[e.Gone = 410] = "Gone", e[e.TooManyRequests = 429] = "TooManyRequests", e[e.InternalServerError = 500] = "InternalServerError", e[e.NotImplemented = 501] = "NotImplemented", e[e.BadGateway = 502] = "BadGateway", e[e.ServiceUnavailable = 503] = "ServiceUnavailable", e[e.GatewayTimeout = 504] = "GatewayTimeout";
})(Qt || (Qt = {}));
var Zi;
(function(e) {
  e.Accept = "accept", e.ContentType = "content-type";
})(Zi || (Zi = {}));
var Ki;
(function(e) {
  e.ApplicationJson = "application/json";
})(Ki || (Ki = {})), Qt.MovedPermanently, Qt.ResourceMoved, Qt.SeeOther, Qt.TemporaryRedirect, Qt.PermanentRedirect, Qt.BadGateway, Qt.ServiceUnavailable, Qt.GatewayTimeout;
const { access: xB, appendFile: VB, writeFile: WB } = dt.promises;
var ji = function(e, t, A, s) {
  function r(n) {
    return n instanceof A ? n : new A(function(o) {
      o(n);
    });
  }
  return new (A || (A = Promise))(function(n, o) {
    function a(i) {
      try {
        l(s.next(i));
      } catch (c) {
        o(c);
      }
    }
    function u(i) {
      try {
        l(s.throw(i));
      } catch (c) {
        o(c);
      }
    }
    function l(i) {
      i.done ? n(i.value) : r(i.value).then(a, u);
    }
    l((s = s.apply(e, t || [])).next());
  });
};
const { chmod: qB, copyFile: zB, lstat: ZB, mkdir: KB, open: jB, readdir: el, rename: XB, rm: tl, rmdir: $B, stat: xs, symlink: eC, unlink: tC } = pA.promises, Ut = process.platform === "win32";
pA.constants.O_RDONLY;
function Al(e) {
  return ji(this, void 0, void 0, function* () {
    try {
      yield xs(e);
    } catch (t) {
      if (t.code === "ENOENT")
        return !1;
      throw t;
    }
    return !0;
  });
}
function Xi(e) {
  if (e = rl(e), !e)
    throw new Error('isRooted() parameter "p" cannot be empty');
  return Ut ? e.startsWith("\\") || /^[A-Z]:/i.test(e) : e.startsWith("/");
}
function $i(e, t) {
  return ji(this, void 0, void 0, function* () {
    let A;
    try {
      A = yield xs(e);
    } catch (r) {
      r.code !== "ENOENT" && console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${r}`);
    }
    if (A && A.isFile()) {
      if (Ut) {
        const r = ft.extname(e).toUpperCase();
        if (t.some((n) => n.toUpperCase() === r))
          return e;
      } else if (ea(A))
        return e;
    }
    const s = e;
    for (const r of t) {
      e = s + r, A = void 0;
      try {
        A = yield xs(e);
      } catch (n) {
        n.code !== "ENOENT" && console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${n}`);
      }
      if (A && A.isFile()) {
        if (Ut) {
          try {
            const n = ft.dirname(e), o = ft.basename(e).toUpperCase();
            for (const a of yield el(n))
              if (o === a.toUpperCase()) {
                e = ft.join(n, a);
                break;
              }
          } catch (n) {
            console.log(`Unexpected error attempting to determine the actual case of the file '${e}': ${n}`);
          }
          return e;
        } else if (ea(A))
          return e;
      }
    }
    return "";
  });
}
function rl(e) {
  return e = e || "", Ut ? (e = e.replace(/\//g, "\\"), e.replace(/\\\\+/g, "\\")) : e.replace(/\/\/+/g, "/");
}
function ea(e) {
  return (e.mode & 1) > 0 || (e.mode & 8) > 0 && process.getgid !== void 0 && e.gid === process.getgid() || (e.mode & 64) > 0 && process.getuid !== void 0 && e.uid === process.getuid();
}
var Vs = function(e, t, A, s) {
  function r(n) {
    return n instanceof A ? n : new A(function(o) {
      o(n);
    });
  }
  return new (A || (A = Promise))(function(n, o) {
    function a(i) {
      try {
        l(s.next(i));
      } catch (c) {
        o(c);
      }
    }
    function u(i) {
      try {
        l(s.throw(i));
      } catch (c) {
        o(c);
      }
    }
    function l(i) {
      i.done ? n(i.value) : r(i.value).then(a, u);
    }
    l((s = s.apply(e, t || [])).next());
  });
};
function sl(e) {
  return Vs(this, void 0, void 0, function* () {
    if (Ut && /[*"<>|]/.test(e))
      throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
    try {
      yield tl(e, {
        force: !0,
        maxRetries: 3,
        recursive: !0,
        retryDelay: 300
      });
    } catch (t) {
      throw new Error(`File was unable to be removed ${t}`);
    }
  });
}
function ta(e, t) {
  return Vs(this, void 0, void 0, function* () {
    if (!e)
      throw new Error("parameter 'tool' is required");
    if (t) {
      const s = yield ta(e, !1);
      if (!s)
        throw Ut ? new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`) : new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
      return s;
    }
    const A = yield nl(e);
    return A && A.length > 0 ? A[0] : "";
  });
}
function nl(e) {
  return Vs(this, void 0, void 0, function* () {
    if (!e)
      throw new Error("parameter 'tool' is required");
    const t = [];
    if (Ut && process.env.PATHEXT)
      for (const r of process.env.PATHEXT.split(ft.delimiter))
        r && t.push(r);
    if (Xi(e)) {
      const r = yield $i(e, t);
      return r ? [r] : [];
    }
    if (e.includes(ft.sep))
      return [];
    const A = [];
    if (process.env.PATH)
      for (const r of process.env.PATH.split(ft.delimiter))
        r && A.push(r);
    const s = [];
    for (const r of A) {
      const n = yield $i(ft.join(r, e), t);
      n && s.push(n);
    }
    return s;
  });
}
var Aa = function(e, t, A, s) {
  function r(n) {
    return n instanceof A ? n : new A(function(o) {
      o(n);
    });
  }
  return new (A || (A = Promise))(function(n, o) {
    function a(i) {
      try {
        l(s.next(i));
      } catch (c) {
        o(c);
      }
    }
    function u(i) {
      try {
        l(s.throw(i));
      } catch (c) {
        o(c);
      }
    }
    function l(i) {
      i.done ? n(i.value) : r(i.value).then(a, u);
    }
    l((s = s.apply(e, t || [])).next());
  });
};
const MA = process.platform === "win32";
class ol extends Mn.EventEmitter {
  constructor(t, A, s) {
    if (super(), !t)
      throw new Error("Parameter 'toolPath' cannot be null or empty.");
    this.toolPath = t, this.args = A || [], this.options = s || {};
  }
  _debug(t) {
    this.options.listeners && this.options.listeners.debug && this.options.listeners.debug(t);
  }
  _getCommandString(t, A) {
    const s = this._getSpawnFileName(), r = this._getSpawnArgs(t);
    let n = A ? "" : "[command]";
    if (MA)
      if (this._isCmdFile()) {
        n += s;
        for (const o of r)
          n += ` ${o}`;
      } else if (t.windowsVerbatimArguments) {
        n += `"${s}"`;
        for (const o of r)
          n += ` ${o}`;
      } else {
        n += this._windowsQuoteCmdArg(s);
        for (const o of r)
          n += ` ${this._windowsQuoteCmdArg(o)}`;
      }
    else {
      n += s;
      for (const o of r)
        n += ` ${o}`;
    }
    return n;
  }
  _processLineBuffer(t, A, s) {
    try {
      let r = A + t.toString(), n = r.indexOf(Et.EOL);
      for (; n > -1; ) {
        const o = r.substring(0, n);
        s(o), r = r.substring(n + Et.EOL.length), n = r.indexOf(Et.EOL);
      }
      return r;
    } catch (r) {
      return this._debug(`error processing line. Failed with error ${r}`), "";
    }
  }
  _getSpawnFileName() {
    return MA && this._isCmdFile() ? process.env.COMSPEC || "cmd.exe" : this.toolPath;
  }
  _getSpawnArgs(t) {
    if (MA && this._isCmdFile()) {
      let A = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
      for (const s of this.args)
        A += " ", A += t.windowsVerbatimArguments ? s : this._windowsQuoteCmdArg(s);
      return A += '"', [A];
    }
    return this.args;
  }
  _endsWith(t, A) {
    return t.endsWith(A);
  }
  _isCmdFile() {
    const t = this.toolPath.toUpperCase();
    return this._endsWith(t, ".CMD") || this._endsWith(t, ".BAT");
  }
  _windowsQuoteCmdArg(t) {
    if (!this._isCmdFile())
      return this._uvQuoteCmdArg(t);
    if (!t)
      return '""';
    const A = [
      " ",
      "	",
      "&",
      "(",
      ")",
      "[",
      "]",
      "{",
      "}",
      "^",
      "=",
      ";",
      "!",
      "'",
      "+",
      ",",
      "`",
      "~",
      "|",
      "<",
      ">",
      '"'
    ];
    let s = !1;
    for (const o of t)
      if (A.some((a) => a === o)) {
        s = !0;
        break;
      }
    if (!s)
      return t;
    let r = '"', n = !0;
    for (let o = t.length; o > 0; o--)
      r += t[o - 1], n && t[o - 1] === "\\" ? r += "\\" : t[o - 1] === '"' ? (n = !0, r += '"') : n = !1;
    return r += '"', r.split("").reverse().join("");
  }
  _uvQuoteCmdArg(t) {
    if (!t)
      return '""';
    if (!t.includes(" ") && !t.includes("	") && !t.includes('"'))
      return t;
    if (!t.includes('"') && !t.includes("\\"))
      return `"${t}"`;
    let A = '"', s = !0;
    for (let r = t.length; r > 0; r--)
      A += t[r - 1], s && t[r - 1] === "\\" ? A += "\\" : t[r - 1] === '"' ? (s = !0, A += "\\") : s = !1;
    return A += '"', A.split("").reverse().join("");
  }
  _cloneExecOptions(t) {
    t = t || {};
    const A = {
      cwd: t.cwd || process.cwd(),
      env: t.env || process.env,
      silent: t.silent || !1,
      windowsVerbatimArguments: t.windowsVerbatimArguments || !1,
      failOnStdErr: t.failOnStdErr || !1,
      ignoreReturnCode: t.ignoreReturnCode || !1,
      delay: t.delay || 1e4
    };
    return A.outStream = t.outStream || process.stdout, A.errStream = t.errStream || process.stderr, A;
  }
  _getSpawnOptions(t, A) {
    t = t || {};
    const s = {};
    return s.cwd = t.cwd, s.env = t.env, s.windowsVerbatimArguments = t.windowsVerbatimArguments || this._isCmdFile(), t.windowsVerbatimArguments && (s.argv0 = `"${A}"`), s;
  }
  /**
   * Exec a tool.
   * Output will be streamed to the live console.
   * Returns promise with return code
   *
   * @param     tool     path to tool to exec
   * @param     options  optional exec options.  See ExecOptions
   * @returns   number
   */
  exec() {
    return Aa(this, void 0, void 0, function* () {
      return !Xi(this.toolPath) && (this.toolPath.includes("/") || MA && this.toolPath.includes("\\")) && (this.toolPath = ft.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath)), this.toolPath = yield ta(this.toolPath, !0), new Promise((t, A) => Aa(this, void 0, void 0, function* () {
        this._debug(`exec tool: ${this.toolPath}`), this._debug("arguments:");
        for (const l of this.args)
          this._debug(`   ${l}`);
        const s = this._cloneExecOptions(this.options);
        !s.silent && s.outStream && s.outStream.write(this._getCommandString(s) + Et.EOL);
        const r = new Dn(s, this.toolPath);
        if (r.on("debug", (l) => {
          this._debug(l);
        }), this.options.cwd && !(yield Al(this.options.cwd)))
          return A(new Error(`The cwd: ${this.options.cwd} does not exist!`));
        const n = this._getSpawnFileName(), o = rg.spawn(n, this._getSpawnArgs(s), this._getSpawnOptions(this.options, n));
        let a = "";
        o.stdout && o.stdout.on("data", (l) => {
          this.options.listeners && this.options.listeners.stdout && this.options.listeners.stdout(l), !s.silent && s.outStream && s.outStream.write(l), a = this._processLineBuffer(l, a, (i) => {
            this.options.listeners && this.options.listeners.stdline && this.options.listeners.stdline(i);
          });
        });
        let u = "";
        if (o.stderr && o.stderr.on("data", (l) => {
          r.processStderr = !0, this.options.listeners && this.options.listeners.stderr && this.options.listeners.stderr(l), !s.silent && s.errStream && s.outStream && (s.failOnStdErr ? s.errStream : s.outStream).write(l), u = this._processLineBuffer(l, u, (i) => {
            this.options.listeners && this.options.listeners.errline && this.options.listeners.errline(i);
          });
        }), o.on("error", (l) => {
          r.processError = l.message, r.processExited = !0, r.processClosed = !0, r.CheckComplete();
        }), o.on("exit", (l) => {
          r.processExitCode = l, r.processExited = !0, this._debug(`Exit code ${l} received from tool '${this.toolPath}'`), r.CheckComplete();
        }), o.on("close", (l) => {
          r.processExitCode = l, r.processExited = !0, r.processClosed = !0, this._debug(`STDIO streams have closed for tool '${this.toolPath}'`), r.CheckComplete();
        }), r.on("done", (l, i) => {
          a.length > 0 && this.emit("stdline", a), u.length > 0 && this.emit("errline", u), o.removeAllListeners(), l ? A(l) : t(i);
        }), this.options.input) {
          if (!o.stdin)
            throw new Error("child process missing stdin");
          o.stdin.end(this.options.input);
        }
      }));
    });
  }
}
function il(e) {
  const t = [];
  let A = !1, s = !1, r = "";
  function n(o) {
    s && o !== '"' && (r += "\\"), r += o, s = !1;
  }
  for (let o = 0; o < e.length; o++) {
    const a = e.charAt(o);
    if (a === '"') {
      s ? n(a) : A = !A;
      continue;
    }
    if (a === "\\" && s) {
      n(a);
      continue;
    }
    if (a === "\\" && A) {
      s = !0;
      continue;
    }
    if (a === " " && !A) {
      r.length > 0 && (t.push(r), r = "");
      continue;
    }
    n(a);
  }
  return r.length > 0 && t.push(r.trim()), t;
}
class Dn extends Mn.EventEmitter {
  constructor(t, A) {
    if (super(), this.processClosed = !1, this.processError = "", this.processExitCode = 0, this.processExited = !1, this.processStderr = !1, this.delay = 1e4, this.done = !1, this.timeout = null, !A)
      throw new Error("toolPath must not be empty");
    this.options = t, this.toolPath = A, t.delay && (this.delay = t.delay);
  }
  CheckComplete() {
    this.done || (this.processClosed ? this._setResult() : this.processExited && (this.timeout = tg.setTimeout(Dn.HandleTimeout, this.delay, this)));
  }
  _debug(t) {
    this.emit("debug", t);
  }
  _setResult() {
    let t;
    this.processExited && (this.processError ? t = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`) : this.processExitCode !== 0 && !this.options.ignoreReturnCode ? t = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`) : this.processStderr && this.options.failOnStdErr && (t = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`))), this.timeout && (clearTimeout(this.timeout), this.timeout = null), this.done = !0, this.emit("done", t, this.processExitCode);
  }
  static HandleTimeout(t) {
    if (!t.done) {
      if (!t.processClosed && t.processExited) {
        const A = `The STDIO streams did not close within ${t.delay / 1e3} seconds of the exit event from process '${t.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
        t._debug(A);
      }
      t._setResult();
    }
  }
}
var al = function(e, t, A, s) {
  function r(n) {
    return n instanceof A ? n : new A(function(o) {
      o(n);
    });
  }
  return new (A || (A = Promise))(function(n, o) {
    function a(i) {
      try {
        l(s.next(i));
      } catch (c) {
        o(c);
      }
    }
    function u(i) {
      try {
        l(s.throw(i));
      } catch (c) {
        o(c);
      }
    }
    function l(i) {
      i.done ? n(i.value) : r(i.value).then(a, u);
    }
    l((s = s.apply(e, t || [])).next());
  });
};
function cl(e, t, A) {
  return al(this, void 0, void 0, function* () {
    const s = il(e);
    if (s.length === 0)
      throw new Error("Parameter 'commandLine' cannot be null or empty.");
    const r = s[0];
    return t = s.slice(1).concat(t || []), new ol(r, t, A).exec();
  });
}
IA.platform(), IA.arch();
var Ws;
(function(e) {
  e[e.Success = 0] = "Success", e[e.Failure = 1] = "Failure";
})(Ws || (Ws = {}));
function ct(e, t) {
  return (process.env[`INPUT_${e.replace(/ /g, "_").toUpperCase()}`] || "").trim();
}
function qs(e, t) {
  if (process.env.GITHUB_OUTPUT || "")
    return ig("OUTPUT", ag(e, t));
  process.stdout.write(Et.EOL), Zt("set-output", { name: e }, zt(t));
}
function gl(e) {
  process.exitCode = Ws.Failure, ll(e);
}
function ra(e) {
  Zt("debug", {}, e);
}
function ll(e, t = {}) {
  Zt("error", Ln(t), e instanceof Error ? e.toString() : e);
}
function zs(e, t = {}) {
  Zt("warning", Ln(t), e instanceof Error ? e.toString() : e);
}
function Xe(e) {
  process.stdout.write(e + Et.EOL);
}
function LA(e) {
  Gn("group", e);
}
function GA() {
  Gn("endgroup");
}
class sa {
  /**
   * Hydrate the context from the environment
   */
  constructor() {
    var t, A, s;
    if (this.payload = {}, process.env.GITHUB_EVENT_PATH)
      if (dt.existsSync(process.env.GITHUB_EVENT_PATH))
        this.payload = JSON.parse(dt.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: "utf8" }));
      else {
        const r = process.env.GITHUB_EVENT_PATH;
        process.stdout.write(`GITHUB_EVENT_PATH ${r} does not exist${IA.EOL}`);
      }
    this.eventName = process.env.GITHUB_EVENT_NAME, this.sha = process.env.GITHUB_SHA, this.ref = process.env.GITHUB_REF, this.workflow = process.env.GITHUB_WORKFLOW, this.action = process.env.GITHUB_ACTION, this.actor = process.env.GITHUB_ACTOR, this.job = process.env.GITHUB_JOB, this.runAttempt = parseInt(process.env.GITHUB_RUN_ATTEMPT, 10), this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10), this.runId = parseInt(process.env.GITHUB_RUN_ID, 10), this.apiUrl = (t = process.env.GITHUB_API_URL) !== null && t !== void 0 ? t : "https://api.github.com", this.serverUrl = (A = process.env.GITHUB_SERVER_URL) !== null && A !== void 0 ? A : "https://github.com", this.graphqlUrl = (s = process.env.GITHUB_GRAPHQL_URL) !== null && s !== void 0 ? s : "https://api.github.com/graphql";
  }
  get issue() {
    const t = this.payload;
    return Object.assign(Object.assign({}, this.repo), { number: (t.issue || t.pull_request || t).number });
  }
  get repo() {
    if (process.env.GITHUB_REPOSITORY) {
      const [t, A] = process.env.GITHUB_REPOSITORY.split("/");
      return { owner: t, repo: A };
    }
    if (this.payload.repository)
      return {
        owner: this.payload.repository.owner.login,
        repo: this.payload.repository.name
      };
    throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
  }
}
var Oe = {}, oA = {}, na;
function ul() {
  if (na) return oA;
  na = 1, Object.defineProperty(oA, "__esModule", { value: !0 }), oA.getProxyUrl = e, oA.checkBypass = t;
  function e(r) {
    const n = r.protocol === "https:";
    if (t(r))
      return;
    const o = n ? process.env.https_proxy || process.env.HTTPS_PROXY : process.env.http_proxy || process.env.HTTP_PROXY;
    if (o)
      try {
        return new s(o);
      } catch {
        if (!o.startsWith("http://") && !o.startsWith("https://"))
          return new s(`http://${o}`);
      }
    else
      return;
  }
  function t(r) {
    if (!r.hostname)
      return !1;
    const n = r.hostname;
    if (A(n))
      return !0;
    const o = process.env.no_proxy || process.env.NO_PROXY || "";
    if (!o)
      return !1;
    let a;
    r.port ? a = Number(r.port) : r.protocol === "http:" ? a = 80 : r.protocol === "https:" && (a = 443);
    const u = [r.hostname.toUpperCase()];
    typeof a == "number" && u.push(`${u[0]}:${a}`);
    for (const l of o.split(",").map((i) => i.trim().toUpperCase()).filter((i) => i))
      if (l === "*" || u.some((i) => i === l || i.endsWith(`.${l}`) || l.startsWith(".") && i.endsWith(`${l}`)))
        return !0;
    return !1;
  }
  function A(r) {
    const n = r.toLowerCase();
    return n === "localhost" || n.startsWith("127.") || n.startsWith("[::1]") || n.startsWith("[0:0:0:0:0:0:0:1]");
  }
  class s extends URL {
    constructor(n, o) {
      super(n, o), this._decodedUsername = decodeURIComponent(super.username), this._decodedPassword = decodeURIComponent(super.password);
    }
    get username() {
      return this._decodedUsername;
    }
    get password() {
      return this._decodedPassword;
    }
  }
  return oA;
}
var oa;
function El() {
  if (oa) return Oe;
  oa = 1;
  var e = Oe && Oe.__createBinding || (Object.create ? (function(E, p, g, C) {
    C === void 0 && (C = g);
    var w = Object.getOwnPropertyDescriptor(p, g);
    (!w || ("get" in w ? !p.__esModule : w.writable || w.configurable)) && (w = { enumerable: !0, get: function() {
      return p[g];
    } }), Object.defineProperty(E, C, w);
  }) : (function(E, p, g, C) {
    C === void 0 && (C = g), E[C] = p[g];
  })), t = Oe && Oe.__setModuleDefault || (Object.create ? (function(E, p) {
    Object.defineProperty(E, "default", { enumerable: !0, value: p });
  }) : function(E, p) {
    E.default = p;
  }), A = Oe && Oe.__importStar || /* @__PURE__ */ (function() {
    var E = function(p) {
      return E = Object.getOwnPropertyNames || function(g) {
        var C = [];
        for (var w in g) Object.prototype.hasOwnProperty.call(g, w) && (C[C.length] = w);
        return C;
      }, E(p);
    };
    return function(p) {
      if (p && p.__esModule) return p;
      var g = {};
      if (p != null) for (var C = E(p), w = 0; w < C.length; w++) C[w] !== "default" && e(g, p, C[w]);
      return t(g, p), g;
    };
  })(), s = Oe && Oe.__awaiter || function(E, p, g, C) {
    function w(I) {
      return I instanceof g ? I : new g(function(m) {
        m(I);
      });
    }
    return new (g || (g = Promise))(function(I, m) {
      function D(G) {
        try {
          S(C.next(G));
        } catch (v) {
          m(v);
        }
      }
      function U(G) {
        try {
          S(C.throw(G));
        } catch (v) {
          m(v);
        }
      }
      function S(G) {
        G.done ? I(G.value) : w(G.value).then(D, U);
      }
      S((C = C.apply(E, p || [])).next());
    });
  };
  Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.HttpClient = Oe.HttpClientResponse = Oe.HttpClientError = Oe.MediaTypes = Oe.Headers = Oe.HttpCodes = void 0, Oe.getProxyUrl = Q, Oe.isHttps = L;
  const r = A(Fn), n = A(Tn), o = A(ul()), a = A(On()), u = zi();
  var l;
  (function(E) {
    E[E.OK = 200] = "OK", E[E.MultipleChoices = 300] = "MultipleChoices", E[E.MovedPermanently = 301] = "MovedPermanently", E[E.ResourceMoved = 302] = "ResourceMoved", E[E.SeeOther = 303] = "SeeOther", E[E.NotModified = 304] = "NotModified", E[E.UseProxy = 305] = "UseProxy", E[E.SwitchProxy = 306] = "SwitchProxy", E[E.TemporaryRedirect = 307] = "TemporaryRedirect", E[E.PermanentRedirect = 308] = "PermanentRedirect", E[E.BadRequest = 400] = "BadRequest", E[E.Unauthorized = 401] = "Unauthorized", E[E.PaymentRequired = 402] = "PaymentRequired", E[E.Forbidden = 403] = "Forbidden", E[E.NotFound = 404] = "NotFound", E[E.MethodNotAllowed = 405] = "MethodNotAllowed", E[E.NotAcceptable = 406] = "NotAcceptable", E[E.ProxyAuthenticationRequired = 407] = "ProxyAuthenticationRequired", E[E.RequestTimeout = 408] = "RequestTimeout", E[E.Conflict = 409] = "Conflict", E[E.Gone = 410] = "Gone", E[E.TooManyRequests = 429] = "TooManyRequests", E[E.InternalServerError = 500] = "InternalServerError", E[E.NotImplemented = 501] = "NotImplemented", E[E.BadGateway = 502] = "BadGateway", E[E.ServiceUnavailable = 503] = "ServiceUnavailable", E[E.GatewayTimeout = 504] = "GatewayTimeout";
  })(l || (Oe.HttpCodes = l = {}));
  var i;
  (function(E) {
    E.Accept = "accept", E.ContentType = "content-type";
  })(i || (Oe.Headers = i = {}));
  var c;
  (function(E) {
    E.ApplicationJson = "application/json";
  })(c || (Oe.MediaTypes = c = {}));
  function Q(E) {
    const p = o.getProxyUrl(new URL(E));
    return p ? p.href : "";
  }
  const h = [
    l.MovedPermanently,
    l.ResourceMoved,
    l.SeeOther,
    l.TemporaryRedirect,
    l.PermanentRedirect
  ], B = [
    l.BadGateway,
    l.ServiceUnavailable,
    l.GatewayTimeout
  ], d = ["OPTIONS", "GET", "DELETE", "HEAD"], y = 10, b = 5;
  class F extends Error {
    constructor(p, g) {
      super(p), this.name = "HttpClientError", this.statusCode = g, Object.setPrototypeOf(this, F.prototype);
    }
  }
  Oe.HttpClientError = F;
  class M {
    constructor(p) {
      this.message = p;
    }
    readBody() {
      return s(this, void 0, void 0, function* () {
        return new Promise((p) => s(this, void 0, void 0, function* () {
          let g = Buffer.alloc(0);
          this.message.on("data", (C) => {
            g = Buffer.concat([g, C]);
          }), this.message.on("end", () => {
            p(g.toString());
          });
        }));
      });
    }
    readBodyBuffer() {
      return s(this, void 0, void 0, function* () {
        return new Promise((p) => s(this, void 0, void 0, function* () {
          const g = [];
          this.message.on("data", (C) => {
            g.push(C);
          }), this.message.on("end", () => {
            p(Buffer.concat(g));
          });
        }));
      });
    }
  }
  Oe.HttpClientResponse = M;
  function L(E) {
    return new URL(E).protocol === "https:";
  }
  class N {
    constructor(p, g, C) {
      this._ignoreSslError = !1, this._allowRedirects = !0, this._allowRedirectDowngrade = !1, this._maxRedirects = 50, this._allowRetries = !1, this._maxRetries = 1, this._keepAlive = !1, this._disposed = !1, this.userAgent = this._getUserAgentWithOrchestrationId(p), this.handlers = g || [], this.requestOptions = C, C && (C.ignoreSslError != null && (this._ignoreSslError = C.ignoreSslError), this._socketTimeout = C.socketTimeout, C.allowRedirects != null && (this._allowRedirects = C.allowRedirects), C.allowRedirectDowngrade != null && (this._allowRedirectDowngrade = C.allowRedirectDowngrade), C.maxRedirects != null && (this._maxRedirects = Math.max(C.maxRedirects, 0)), C.keepAlive != null && (this._keepAlive = C.keepAlive), C.allowRetries != null && (this._allowRetries = C.allowRetries), C.maxRetries != null && (this._maxRetries = C.maxRetries));
    }
    options(p, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("OPTIONS", p, null, g || {});
      });
    }
    get(p, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("GET", p, null, g || {});
      });
    }
    del(p, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("DELETE", p, null, g || {});
      });
    }
    post(p, g, C) {
      return s(this, void 0, void 0, function* () {
        return this.request("POST", p, g, C || {});
      });
    }
    patch(p, g, C) {
      return s(this, void 0, void 0, function* () {
        return this.request("PATCH", p, g, C || {});
      });
    }
    put(p, g, C) {
      return s(this, void 0, void 0, function* () {
        return this.request("PUT", p, g, C || {});
      });
    }
    head(p, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("HEAD", p, null, g || {});
      });
    }
    sendStream(p, g, C, w) {
      return s(this, void 0, void 0, function* () {
        return this.request(p, g, C, w);
      });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(p) {
      return s(this, arguments, void 0, function* (g, C = {}) {
        C[i.Accept] = this._getExistingOrDefaultHeader(C, i.Accept, c.ApplicationJson);
        const w = yield this.get(g, C);
        return this._processResponse(w, this.requestOptions);
      });
    }
    postJson(p, g) {
      return s(this, arguments, void 0, function* (C, w, I = {}) {
        const m = JSON.stringify(w, null, 2);
        I[i.Accept] = this._getExistingOrDefaultHeader(I, i.Accept, c.ApplicationJson), I[i.ContentType] = this._getExistingOrDefaultContentTypeHeader(I, c.ApplicationJson);
        const D = yield this.post(C, m, I);
        return this._processResponse(D, this.requestOptions);
      });
    }
    putJson(p, g) {
      return s(this, arguments, void 0, function* (C, w, I = {}) {
        const m = JSON.stringify(w, null, 2);
        I[i.Accept] = this._getExistingOrDefaultHeader(I, i.Accept, c.ApplicationJson), I[i.ContentType] = this._getExistingOrDefaultContentTypeHeader(I, c.ApplicationJson);
        const D = yield this.put(C, m, I);
        return this._processResponse(D, this.requestOptions);
      });
    }
    patchJson(p, g) {
      return s(this, arguments, void 0, function* (C, w, I = {}) {
        const m = JSON.stringify(w, null, 2);
        I[i.Accept] = this._getExistingOrDefaultHeader(I, i.Accept, c.ApplicationJson), I[i.ContentType] = this._getExistingOrDefaultContentTypeHeader(I, c.ApplicationJson);
        const D = yield this.patch(C, m, I);
        return this._processResponse(D, this.requestOptions);
      });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(p, g, C, w) {
      return s(this, void 0, void 0, function* () {
        if (this._disposed)
          throw new Error("Client has already been disposed.");
        const I = new URL(g);
        let m = this._prepareRequest(p, I, w);
        const D = this._allowRetries && d.includes(p) ? this._maxRetries + 1 : 1;
        let U = 0, S;
        do {
          if (S = yield this.requestRaw(m, C), S && S.message && S.message.statusCode === l.Unauthorized) {
            let v;
            for (const $ of this.handlers)
              if ($.canHandleAuthentication(S)) {
                v = $;
                break;
              }
            return v ? v.handleAuthentication(this, m, C) : S;
          }
          let G = this._maxRedirects;
          for (; S.message.statusCode && h.includes(S.message.statusCode) && this._allowRedirects && G > 0; ) {
            const v = S.message.headers.location;
            if (!v)
              break;
            const $ = new URL(v);
            if (I.protocol === "https:" && I.protocol !== $.protocol && !this._allowRedirectDowngrade)
              throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
            if (yield S.readBody(), $.hostname !== I.hostname)
              for (const ne in w)
                ne.toLowerCase() === "authorization" && delete w[ne];
            m = this._prepareRequest(p, $, w), S = yield this.requestRaw(m, C), G--;
          }
          if (!S.message.statusCode || !B.includes(S.message.statusCode))
            return S;
          U += 1, U < D && (yield S.readBody(), yield this._performExponentialBackoff(U));
        } while (U < D);
        return S;
      });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
      this._agent && this._agent.destroy(), this._disposed = !0;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(p, g) {
      return s(this, void 0, void 0, function* () {
        return new Promise((C, w) => {
          function I(m, D) {
            m ? w(m) : D ? C(D) : w(new Error("Unknown error"));
          }
          this.requestRawWithCallback(p, g, I);
        });
      });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(p, g, C) {
      typeof g == "string" && (p.options.headers || (p.options.headers = {}), p.options.headers["Content-Length"] = Buffer.byteLength(g, "utf8"));
      let w = !1;
      function I(U, S) {
        w || (w = !0, C(U, S));
      }
      const m = p.httpModule.request(p.options, (U) => {
        const S = new M(U);
        I(void 0, S);
      });
      let D;
      m.on("socket", (U) => {
        D = U;
      }), m.setTimeout(this._socketTimeout || 3 * 6e4, () => {
        D && D.end(), I(new Error(`Request timeout: ${p.options.path}`));
      }), m.on("error", function(U) {
        I(U);
      }), g && typeof g == "string" && m.write(g, "utf8"), g && typeof g != "string" ? (g.on("close", function() {
        m.end();
      }), g.pipe(m)) : m.end();
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(p) {
      const g = new URL(p);
      return this._getAgent(g);
    }
    getAgentDispatcher(p) {
      const g = new URL(p), C = o.getProxyUrl(g);
      if (C && C.hostname)
        return this._getProxyAgentDispatcher(g, C);
    }
    _prepareRequest(p, g, C) {
      const w = {};
      w.parsedUrl = g;
      const I = w.parsedUrl.protocol === "https:";
      w.httpModule = I ? n : r;
      const m = I ? 443 : 80;
      if (w.options = {}, w.options.host = w.parsedUrl.hostname, w.options.port = w.parsedUrl.port ? parseInt(w.parsedUrl.port) : m, w.options.path = (w.parsedUrl.pathname || "") + (w.parsedUrl.search || ""), w.options.method = p, w.options.headers = this._mergeHeaders(C), this.userAgent != null && (w.options.headers["user-agent"] = this.userAgent), w.options.agent = this._getAgent(w.parsedUrl), this.handlers)
        for (const D of this.handlers)
          D.prepareRequest(w.options);
      return w;
    }
    _mergeHeaders(p) {
      return this.requestOptions && this.requestOptions.headers ? Object.assign({}, f(this.requestOptions.headers), f(p || {})) : f(p || {});
    }
    /**
     * Gets an existing header value or returns a default.
     * Handles converting number header values to strings since HTTP headers must be strings.
     * Note: This returns string | string[] since some headers can have multiple values.
     * For headers that must always be a single string (like Content-Type), use the
     * specialized _getExistingOrDefaultContentTypeHeader method instead.
     */
    _getExistingOrDefaultHeader(p, g, C) {
      let w;
      if (this.requestOptions && this.requestOptions.headers) {
        const m = f(this.requestOptions.headers)[g];
        m && (w = typeof m == "number" ? m.toString() : m);
      }
      const I = p[g];
      return I !== void 0 ? typeof I == "number" ? I.toString() : I : w !== void 0 ? w : C;
    }
    /**
     * Specialized version of _getExistingOrDefaultHeader for Content-Type header.
     * Always returns a single string (not an array) since Content-Type should be a single value.
     * Converts arrays to comma-separated strings and numbers to strings to ensure type safety.
     * This was split from _getExistingOrDefaultHeader to provide stricter typing for callers
     * that assign the result to places expecting a string (e.g., additionalHeaders[Headers.ContentType]).
     */
    _getExistingOrDefaultContentTypeHeader(p, g) {
      let C;
      if (this.requestOptions && this.requestOptions.headers) {
        const I = f(this.requestOptions.headers)[i.ContentType];
        I && (typeof I == "number" ? C = String(I) : Array.isArray(I) ? C = I.join(", ") : C = I);
      }
      const w = p[i.ContentType];
      return w !== void 0 ? typeof w == "number" ? String(w) : Array.isArray(w) ? w.join(", ") : w : C !== void 0 ? C : g;
    }
    _getAgent(p) {
      let g;
      const C = o.getProxyUrl(p), w = C && C.hostname;
      if (this._keepAlive && w && (g = this._proxyAgent), w || (g = this._agent), g)
        return g;
      const I = p.protocol === "https:";
      let m = 100;
      if (this.requestOptions && (m = this.requestOptions.maxSockets || r.globalAgent.maxSockets), C && C.hostname) {
        const D = {
          maxSockets: m,
          keepAlive: this._keepAlive,
          proxy: Object.assign(Object.assign({}, (C.username || C.password) && {
            proxyAuth: `${C.username}:${C.password}`
          }), { host: C.hostname, port: C.port })
        };
        let U;
        const S = C.protocol === "https:";
        I ? U = S ? a.httpsOverHttps : a.httpsOverHttp : U = S ? a.httpOverHttps : a.httpOverHttp, g = U(D), this._proxyAgent = g;
      }
      if (!g) {
        const D = { keepAlive: this._keepAlive, maxSockets: m };
        g = I ? new n.Agent(D) : new r.Agent(D), this._agent = g;
      }
      return I && this._ignoreSslError && (g.options = Object.assign(g.options || {}, {
        rejectUnauthorized: !1
      })), g;
    }
    _getProxyAgentDispatcher(p, g) {
      let C;
      if (this._keepAlive && (C = this._proxyAgentDispatcher), C)
        return C;
      const w = p.protocol === "https:";
      return C = new u.ProxyAgent(Object.assign({ uri: g.href, pipelining: this._keepAlive ? 1 : 0 }, (g.username || g.password) && {
        token: `Basic ${Buffer.from(`${g.username}:${g.password}`).toString("base64")}`
      })), this._proxyAgentDispatcher = C, w && this._ignoreSslError && (C.options = Object.assign(C.options.requestTls || {}, {
        rejectUnauthorized: !1
      })), C;
    }
    _getUserAgentWithOrchestrationId(p) {
      const g = p || "actions/http-client", C = process.env.ACTIONS_ORCHESTRATION_ID;
      if (C) {
        const w = C.replace(/[^a-z0-9_.-]/gi, "_");
        return `${g} actions_orchestration_id/${w}`;
      }
      return g;
    }
    _performExponentialBackoff(p) {
      return s(this, void 0, void 0, function* () {
        p = Math.min(y, p);
        const g = b * Math.pow(2, p);
        return new Promise((C) => setTimeout(() => C(), g));
      });
    }
    _processResponse(p, g) {
      return s(this, void 0, void 0, function* () {
        return new Promise((C, w) => s(this, void 0, void 0, function* () {
          const I = p.message.statusCode || 0, m = {
            statusCode: I,
            result: null,
            headers: {}
          };
          I === l.NotFound && C(m);
          function D(G, v) {
            if (typeof v == "string") {
              const $ = new Date(v);
              if (!isNaN($.valueOf()))
                return $;
            }
            return v;
          }
          let U, S;
          try {
            S = yield p.readBody(), S && S.length > 0 && (g && g.deserializeDates ? U = JSON.parse(S, D) : U = JSON.parse(S), m.result = U), m.headers = p.message.headers;
          } catch {
          }
          if (I > 299) {
            let G;
            U && U.message ? G = U.message : S && S.length > 0 ? G = S : G = `Failed request: (${I})`;
            const v = new F(G, I);
            v.result = m.result, w(v);
          } else
            C(m);
        }));
      });
    }
  }
  Oe.HttpClient = N;
  const f = (E) => Object.keys(E).reduce((p, g) => (p[g.toLowerCase()] = E[g], p), {});
  return Oe;
}
var ia = El(), Ql = function(e, t, A, s) {
  function r(n) {
    return n instanceof A ? n : new A(function(o) {
      o(n);
    });
  }
  return new (A || (A = Promise))(function(n, o) {
    function a(i) {
      try {
        l(s.next(i));
      } catch (c) {
        o(c);
      }
    }
    function u(i) {
      try {
        l(s.throw(i));
      } catch (c) {
        o(c);
      }
    }
    function l(i) {
      i.done ? n(i.value) : r(i.value).then(a, u);
    }
    l((s = s.apply(e, t || [])).next());
  });
};
function hl(e, t) {
  if (!e && !t.auth)
    throw new Error("Parameter token or opts.auth is required");
  if (e && t.auth)
    throw new Error("Parameters token and opts.auth may not both be specified");
  return typeof t.auth == "string" ? t.auth : `token ${e}`;
}
function Bl(e) {
  return new ia.HttpClient().getAgent(e);
}
function Cl(e) {
  return new ia.HttpClient().getAgentDispatcher(e);
}
function Il(e) {
  const t = Cl(e);
  return (s, r) => Ql(this, void 0, void 0, function* () {
    return $g.fetch(s, Object.assign(Object.assign({}, r), { dispatcher: t }));
  });
}
function dl() {
  return process.env.GITHUB_API_URL || "https://api.github.com";
}
function vA() {
  return typeof navigator == "object" && "userAgent" in navigator ? navigator.userAgent : typeof process == "object" && process.version !== void 0 ? `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})` : "<environment undetectable>";
}
function aa(e, t, A, s) {
  if (typeof A != "function")
    throw new Error("method for before hook must be a function");
  return s || (s = {}), Array.isArray(t) ? t.reverse().reduce((r, n) => aa.bind(null, e, n, r, s), A)() : Promise.resolve().then(() => e.registry[t] ? e.registry[t].reduce((r, n) => n.hook.bind(null, r, s), A)() : A(s));
}
function fl(e, t, A, s) {
  const r = s;
  e.registry[A] || (e.registry[A] = []), t === "before" && (s = (n, o) => Promise.resolve().then(r.bind(null, o)).then(n.bind(null, o))), t === "after" && (s = (n, o) => {
    let a;
    return Promise.resolve().then(n.bind(null, o)).then((u) => (a = u, r(a, o))).then(() => a);
  }), t === "error" && (s = (n, o) => Promise.resolve().then(n.bind(null, o)).catch((a) => r(a, o))), e.registry[A].push({
    hook: s,
    orig: r
  });
}
function pl(e, t, A) {
  if (!e.registry[t])
    return;
  const s = e.registry[t].map((r) => r.orig).indexOf(A);
  s !== -1 && e.registry[t].splice(s, 1);
}
const ca = Function.bind, ga = ca.bind(ca);
function wl(e, t, A) {
  const s = ga(pl, null).apply(
    null,
    [t]
  );
  e.api = { remove: s }, e.remove = s, ["before", "error", "after", "wrap"].forEach((r) => {
    const n = [t, r];
    e[r] = e.api[r] = ga(fl, null).apply(null, n);
  });
}
function ml() {
  const e = {
    registry: {}
  }, t = aa.bind(null, e);
  return wl(t, e), t;
}
var yl = { Collection: ml }, Dl = "0.0.0-development", bl = `octokit-endpoint.js/${Dl} ${vA()}`, Rl = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": bl
  },
  mediaType: {
    format: ""
  }
};
function kl(e) {
  return e ? Object.keys(e).reduce((t, A) => (t[A.toLowerCase()] = e[A], t), {}) : {};
}
function Fl(e) {
  if (typeof e != "object" || e === null || Object.prototype.toString.call(e) !== "[object Object]") return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null) return !0;
  const A = Object.prototype.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof A == "function" && A instanceof A && Function.prototype.call(A) === Function.prototype.call(e);
}
function la(e, t) {
  const A = Object.assign({}, e);
  return Object.keys(t).forEach((s) => {
    Fl(t[s]) ? s in e ? A[s] = la(e[s], t[s]) : Object.assign(A, { [s]: t[s] }) : Object.assign(A, { [s]: t[s] });
  }), A;
}
function ua(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function Zs(e, t, A) {
  if (typeof t == "string") {
    let [r, n] = t.split(" ");
    A = Object.assign(n ? { method: r, url: n } : { url: r }, A);
  } else
    A = Object.assign({}, t);
  A.headers = kl(A.headers), ua(A), ua(A.headers);
  const s = la(e || {}, A);
  return A.url === "/graphql" && (e && e.mediaType.previews?.length && (s.mediaType.previews = e.mediaType.previews.filter(
    (r) => !s.mediaType.previews.includes(r)
  ).concat(s.mediaType.previews)), s.mediaType.previews = (s.mediaType.previews || []).map((r) => r.replace(/-preview/, ""))), s;
}
function Tl(e, t) {
  const A = /\?/.test(e) ? "&" : "?", s = Object.keys(t);
  return s.length === 0 ? e : e + A + s.map((r) => r === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${r}=${encodeURIComponent(t[r])}`).join("&");
}
var Sl = /\{[^{}}]+\}/g;
function Ul(e) {
  return e.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function Nl(e) {
  const t = e.match(Sl);
  return t ? t.map(Ul).reduce((A, s) => A.concat(s), []) : [];
}
function Ea(e, t) {
  const A = { __proto__: null };
  for (const s of Object.keys(e))
    t.indexOf(s) === -1 && (A[s] = e[s]);
  return A;
}
function Qa(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function Ht(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function iA(e, t, A) {
  return t = e === "+" || e === "#" ? Qa(t) : Ht(t), A ? Ht(A) + "=" + t : t;
}
function Ot(e) {
  return e != null;
}
function Ks(e) {
  return e === ";" || e === "&" || e === "?";
}
function Ml(e, t, A, s) {
  var r = e[A], n = [];
  if (Ot(r) && r !== "")
    if (typeof r == "string" || typeof r == "number" || typeof r == "bigint" || typeof r == "boolean")
      r = r.toString(), s && s !== "*" && (r = r.substring(0, parseInt(s, 10))), n.push(
        iA(t, r, Ks(t) ? A : "")
      );
    else if (s === "*")
      Array.isArray(r) ? r.filter(Ot).forEach(function(o) {
        n.push(
          iA(t, o, Ks(t) ? A : "")
        );
      }) : Object.keys(r).forEach(function(o) {
        Ot(r[o]) && n.push(iA(t, r[o], o));
      });
    else {
      const o = [];
      Array.isArray(r) ? r.filter(Ot).forEach(function(a) {
        o.push(iA(t, a));
      }) : Object.keys(r).forEach(function(a) {
        Ot(r[a]) && (o.push(Ht(a)), o.push(iA(t, r[a].toString())));
      }), Ks(t) ? n.push(Ht(A) + "=" + o.join(",")) : o.length !== 0 && n.push(o.join(","));
    }
  else
    t === ";" ? Ot(r) && n.push(Ht(A)) : r === "" && (t === "&" || t === "?") ? n.push(Ht(A) + "=") : r === "" && n.push("");
  return n;
}
function Ll(e) {
  return {
    expand: Gl.bind(null, e)
  };
}
function Gl(e, t) {
  var A = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(s, r, n) {
      if (r) {
        let a = "";
        const u = [];
        if (A.indexOf(r.charAt(0)) !== -1 && (a = r.charAt(0), r = r.substr(1)), r.split(/,/g).forEach(function(l) {
          var i = /([^:\*]*)(?::(\d+)|(\*))?/.exec(l);
          u.push(Ml(t, a, i[1], i[2] || i[3]));
        }), a && a !== "+") {
          var o = ",";
          return a === "?" ? o = "&" : a !== "#" && (o = a), (u.length !== 0 ? a : "") + u.join(o);
        } else
          return u.join(",");
      } else
        return Qa(n);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function ha(e) {
  let t = e.method.toUpperCase(), A = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), s = Object.assign({}, e.headers), r, n = Ea(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const o = Nl(A);
  A = Ll(A).expand(n), /^http/.test(A) || (A = e.baseUrl + A);
  const a = Object.keys(e).filter((i) => o.includes(i)).concat("baseUrl"), u = Ea(n, a);
  if (!/application\/octet-stream/i.test(s.accept) && (e.mediaType.format && (s.accept = s.accept.split(/,/).map(
    (i) => i.replace(
      /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
      `application/vnd$1$2.${e.mediaType.format}`
    )
  ).join(",")), A.endsWith("/graphql") && e.mediaType.previews?.length)) {
    const i = s.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
    s.accept = i.concat(e.mediaType.previews).map((c) => {
      const Q = e.mediaType.format ? `.${e.mediaType.format}` : "+json";
      return `application/vnd.github.${c}-preview${Q}`;
    }).join(",");
  }
  return ["GET", "HEAD"].includes(t) ? A = Tl(A, u) : "data" in u ? r = u.data : Object.keys(u).length && (r = u), !s["content-type"] && typeof r < "u" && (s["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof r > "u" && (r = ""), Object.assign(
    { method: t, url: A, headers: s },
    typeof r < "u" ? { body: r } : null,
    e.request ? { request: e.request } : null
  );
}
function vl(e, t, A) {
  return ha(Zs(e, t, A));
}
function Ba(e, t) {
  const A = Zs(e, t), s = vl.bind(null, A);
  return Object.assign(s, {
    DEFAULTS: A,
    defaults: Ba.bind(null, A),
    merge: Zs.bind(null, A),
    parse: ha
  });
}
var Yl = Ba(null, Rl), Pt = {}, Ca;
function Jl() {
  if (Ca) return Pt;
  Ca = 1;
  const e = function() {
  };
  e.prototype = /* @__PURE__ */ Object.create(null);
  const t = /; *([!#$%&'*+.^\w`|~-]+)=("(?:[\v\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\v\u0020-\u00ff])*"|[!#$%&'*+.^\w`|~-]+) */gu, A = /\\([\v\u0020-\u00ff])/gu, s = /^[!#$%&'*+.^\w|~-]+\/[!#$%&'*+.^\w|~-]+$/u, r = { type: "", parameters: new e() };
  Object.freeze(r.parameters), Object.freeze(r);
  function n(a) {
    if (typeof a != "string")
      throw new TypeError("argument header is required and must be a string");
    let u = a.indexOf(";");
    const l = u !== -1 ? a.slice(0, u).trim() : a.trim();
    if (s.test(l) === !1)
      throw new TypeError("invalid media type");
    const i = {
      type: l.toLowerCase(),
      parameters: new e()
    };
    if (u === -1)
      return i;
    let c, Q, h;
    for (t.lastIndex = u; Q = t.exec(a); ) {
      if (Q.index !== u)
        throw new TypeError("invalid parameter format");
      u += Q[0].length, c = Q[1].toLowerCase(), h = Q[2], h[0] === '"' && (h = h.slice(1, h.length - 1), A.test(h) && (h = h.replace(A, "$1"))), i.parameters[c] = h;
    }
    if (u !== a.length)
      throw new TypeError("invalid parameter format");
    return i;
  }
  function o(a) {
    if (typeof a != "string")
      return r;
    let u = a.indexOf(";");
    const l = u !== -1 ? a.slice(0, u).trim() : a.trim();
    if (s.test(l) === !1)
      return r;
    const i = {
      type: l.toLowerCase(),
      parameters: new e()
    };
    if (u === -1)
      return i;
    let c, Q, h;
    for (t.lastIndex = u; Q = t.exec(a); ) {
      if (Q.index !== u)
        return r;
      u += Q[0].length, c = Q[1].toLowerCase(), h = Q[2], h[0] === '"' && (h = h.slice(1, h.length - 1), A.test(h) && (h = h.replace(A, "$1"))), i.parameters[c] = h;
    }
    return u !== a.length ? r : i;
  }
  return Pt.default = { parse: n, safeParse: o }, Pt.parse = n, Pt.safeParse = o, Pt.defaultContentType = r, Pt;
}
var Hl = Jl();
const Ol = /^-?\d+$/, Ia = /^-?\d+n+$/, js = JSON.stringify, da = JSON.parse, Pl = /^-?\d+n$/, _l = /([\[:])?"(-?\d+)n"($|([\\n]|\s)*(\s|[\\n])*[,\}\]])/g, xl = /([\[:])?("-?\d+n+)n("$|"([\\n]|\s)*(\s|[\\n])*[,\}\]])/g, Vl = (e, t, A) => "rawJSON" in JSON ? js(
  e,
  (o, a) => typeof a == "bigint" ? JSON.rawJSON(a.toString()) : (Array.isArray(t) && t.includes(o), a),
  A
) : e ? js(
  e,
  (o, a) => typeof a == "string" && !!a.match(Ia) || typeof a == "bigint" ? a.toString() + "n" : (Array.isArray(t) && t.includes(o), a),
  A
).replace(
  _l,
  "$1$2$3"
).replace(xl, "$1$2$3") : js(e, t, A), Wl = () => JSON.parse("1", (e, t, A) => !!A && A.source === "1"), ql = (e, t, A, s) => typeof t == "string" && t.match(Pl) ? BigInt(t.slice(0, -1)) : typeof t == "string" && t.match(Ia) ? t.slice(0, -1) : t, zl = (e, t) => JSON.parse(e, (A, s, r) => {
  const n = typeof s == "number" && (s > Number.MAX_SAFE_INTEGER || s < Number.MIN_SAFE_INTEGER), o = r && Ol.test(r.source);
  return n && o ? BigInt(r.source) : s;
}), fa = Number.MAX_SAFE_INTEGER.toString(), pa = fa.length, Zl = /"(?:\\.|[^"])*"|-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?/g, Kl = /^"-?\d+n+"$/, jl = (e, t) => {
  if (!e) return da(e, t);
  if (Wl()) return zl(e);
  const A = e.replace(
    Zl,
    (s, r, n, o) => {
      const a = s[0] === '"';
      if (a && !!s.match(Kl)) return s.substring(0, s.length - 1) + 'n"';
      const l = n || o, i = r && (r.length < pa || r.length === pa && r <= fa);
      return a || l || i ? s : '"' + s + 'n"';
    }
  );
  return da(
    A,
    (s, r, n) => ql(s, r)
  );
};
class YA extends Error {
  name;
  /**
   * http status code
   */
  status;
  /**
   * Request options that lead to the error.
   */
  request;
  /**
   * Response object if a response was received
   */
  response;
  constructor(t, A, s) {
    super(t, { cause: s.cause }), this.name = "HttpError", this.status = Number.parseInt(A), Number.isNaN(this.status) && (this.status = 0);
    "response" in s && (this.response = s.response);
    const r = Object.assign({}, s.request);
    s.request.headers.authorization && (r.headers = Object.assign({}, s.request.headers, {
      authorization: s.request.headers.authorization.replace(
        /(?<! ) .*$/,
        " [REDACTED]"
      )
    })), r.url = r.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]"), this.request = r;
  }
}
var Xl = "10.0.8", $l = {
  headers: {
    "user-agent": `octokit-request.js/${Xl} ${vA()}`
  }
};
function eu(e) {
  if (typeof e != "object" || e === null || Object.prototype.toString.call(e) !== "[object Object]") return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null) return !0;
  const A = Object.prototype.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof A == "function" && A instanceof A && Function.prototype.call(A) === Function.prototype.call(e);
}
var wa = () => "";
async function ma(e) {
  const t = e.request?.fetch || globalThis.fetch;
  if (!t)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  const A = e.request?.log || console, s = e.request?.parseSuccessResponseBody !== !1, r = eu(e.body) || Array.isArray(e.body) ? Vl(e.body) : e.body, n = Object.fromEntries(
    Object.entries(e.headers).map(([c, Q]) => [
      c,
      String(Q)
    ])
  );
  let o;
  try {
    o = await t(e.url, {
      method: e.method,
      body: r,
      redirect: e.request?.redirect,
      headers: n,
      signal: e.request?.signal,
      // duplex must be set if request.body is ReadableStream or Async Iterables.
      // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
      ...e.body && { duplex: "half" }
    });
  } catch (c) {
    let Q = "Unknown Error";
    if (c instanceof Error) {
      if (c.name === "AbortError")
        throw c.status = 500, c;
      Q = c.message, c.name === "TypeError" && "cause" in c && (c.cause instanceof Error ? Q = c.cause.message : typeof c.cause == "string" && (Q = c.cause));
    }
    const h = new YA(Q, 500, {
      request: e
    });
    throw h.cause = c, h;
  }
  const a = o.status, u = o.url, l = {};
  for (const [c, Q] of o.headers)
    l[c] = Q;
  const i = {
    url: u,
    status: a,
    headers: l,
    data: ""
  };
  if ("deprecation" in l) {
    const c = l.link && l.link.match(/<([^<>]+)>; rel="deprecation"/), Q = c && c.pop();
    A.warn(
      `[@octokit/request] "${e.method} ${e.url}" is deprecated. It is scheduled to be removed on ${l.sunset}${Q ? `. See ${Q}` : ""}`
    );
  }
  if (a === 204 || a === 205)
    return i;
  if (e.method === "HEAD") {
    if (a < 400)
      return i;
    throw new YA(o.statusText, a, {
      response: i,
      request: e
    });
  }
  if (a === 304)
    throw i.data = await Xs(o), new YA("Not modified", a, {
      response: i,
      request: e
    });
  if (a >= 400)
    throw i.data = await Xs(o), new YA(Au(i.data), a, {
      response: i,
      request: e
    });
  return i.data = s ? await Xs(o) : o.body, i;
}
async function Xs(e) {
  const t = e.headers.get("content-type");
  if (!t)
    return e.text().catch(wa);
  const A = Hl.safeParse(t);
  if (tu(A)) {
    let s = "";
    try {
      return s = await e.text(), jl(s);
    } catch {
      return s;
    }
  } else return A.type.startsWith("text/") || A.parameters.charset?.toLowerCase() === "utf-8" ? e.text().catch(wa) : e.arrayBuffer().catch(
    /* v8 ignore next -- @preserve */
    () => new ArrayBuffer(0)
  );
}
function tu(e) {
  return e.type === "application/json" || e.type === "application/scim+json";
}
function Au(e) {
  if (typeof e == "string")
    return e;
  if (e instanceof ArrayBuffer)
    return "Unknown error";
  if ("message" in e) {
    const t = "documentation_url" in e ? ` - ${e.documentation_url}` : "";
    return Array.isArray(e.errors) ? `${e.message}: ${e.errors.map((A) => JSON.stringify(A)).join(", ")}${t}` : `${e.message}${t}`;
  }
  return `Unknown error: ${JSON.stringify(e)}`;
}
function $s(e, t) {
  const A = e.defaults(t);
  return Object.assign(function(r, n) {
    const o = A.merge(r, n);
    if (!o.request || !o.request.hook)
      return ma(A.parse(o));
    const a = (u, l) => ma(
      A.parse(A.merge(u, l))
    );
    return Object.assign(a, {
      endpoint: A,
      defaults: $s.bind(null, A)
    }), o.request.hook(a, o);
  }, {
    endpoint: A,
    defaults: $s.bind(null, A)
  });
}
var en = $s(Yl, $l);
var ru = "0.0.0-development";
function su(e) {
  return `Request failed due to following response errors:
` + e.errors.map((t) => ` - ${t.message}`).join(`
`);
}
var nu = class extends Error {
  constructor(e, t, A) {
    super(su(A)), this.request = e, this.headers = t, this.response = A, this.errors = A.errors, this.data = A.data, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
  name = "GraphqlResponseError";
  errors;
  data;
}, ou = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
  "operationName"
], iu = ["query", "method", "url"], ya = /\/api\/v3\/?$/;
function au(e, t, A) {
  if (A) {
    if (typeof t == "string" && "query" in A)
      return Promise.reject(
        new Error('[@octokit/graphql] "query" cannot be used as variable name')
      );
    for (const o in A)
      if (iu.includes(o))
        return Promise.reject(
          new Error(
            `[@octokit/graphql] "${o}" cannot be used as variable name`
          )
        );
  }
  const s = typeof t == "string" ? Object.assign({ query: t }, A) : t, r = Object.keys(
    s
  ).reduce((o, a) => ou.includes(a) ? (o[a] = s[a], o) : (o.variables || (o.variables = {}), o.variables[a] = s[a], o), {}), n = s.baseUrl || e.endpoint.DEFAULTS.baseUrl;
  return ya.test(n) && (r.url = n.replace(ya, "/api/graphql")), e(r).then((o) => {
    if (o.data.errors) {
      const a = {};
      for (const u of Object.keys(o.headers))
        a[u] = o.headers[u];
      throw new nu(
        r,
        a,
        o.data
      );
    }
    return o.data.data;
  });
}
function tn(e, t) {
  const A = e.defaults(t);
  return Object.assign((r, n) => au(A, r, n), {
    defaults: tn.bind(null, A),
    endpoint: A.endpoint
  });
}
tn(en, {
  headers: {
    "user-agent": `octokit-graphql.js/${ru} ${vA()}`
  },
  method: "POST",
  url: "/graphql"
});
function cu(e) {
  return tn(e, {
    method: "POST",
    url: "/graphql"
  });
}
var An = "(?:[a-zA-Z0-9_-]+)", Da = "\\.", ba = new RegExp(`^${An}${Da}${An}${Da}${An}$`), gu = ba.test.bind(ba);
async function lu(e) {
  const t = gu(e), A = e.startsWith("v1.") || e.startsWith("ghs_"), s = e.startsWith("ghu_");
  return {
    type: "token",
    token: e,
    tokenType: t ? "app" : A ? "installation" : s ? "user-to-server" : "oauth"
  };
}
function uu(e) {
  return e.split(/\./).length === 3 ? `bearer ${e}` : `token ${e}`;
}
async function Eu(e, t, A, s) {
  const r = t.endpoint.merge(
    A,
    s
  );
  return r.headers.authorization = uu(e), t(r);
}
var Qu = function(t) {
  if (!t)
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  if (typeof t != "string")
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  return t = t.replace(/^(token|bearer) +/i, ""), Object.assign(lu.bind(null, t), {
    hook: Eu.bind(null, t)
  });
};
const Ra = "7.0.6", ka = () => {
}, hu = console.warn.bind(console), Bu = console.error.bind(console);
function Cu(e = {}) {
  return typeof e.debug != "function" && (e.debug = ka), typeof e.info != "function" && (e.info = ka), typeof e.warn != "function" && (e.warn = hu), typeof e.error != "function" && (e.error = Bu), e;
}
const Fa = `octokit-core.js/${Ra} ${vA()}`;
class Iu {
  static VERSION = Ra;
  static defaults(t) {
    return class extends this {
      constructor(...s) {
        const r = s[0] || {};
        if (typeof t == "function") {
          super(t(r));
          return;
        }
        super(
          Object.assign(
            {},
            t,
            r,
            r.userAgent && t.userAgent ? {
              userAgent: `${r.userAgent} ${t.userAgent}`
            } : null
          )
        );
      }
    };
  }
  static plugins = [];
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...t) {
    const A = this.plugins;
    return class extends this {
      static plugins = A.concat(
        t.filter((r) => !A.includes(r))
      );
    };
  }
  constructor(t = {}) {
    const A = new yl.Collection(), s = {
      baseUrl: en.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, t.request, {
        // @ts-ignore internal usage only, no need to type
        hook: A.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    if (s.headers["user-agent"] = t.userAgent ? `${t.userAgent} ${Fa}` : Fa, t.baseUrl && (s.baseUrl = t.baseUrl), t.previews && (s.mediaType.previews = t.previews), t.timeZone && (s.headers["time-zone"] = t.timeZone), this.request = en.defaults(s), this.graphql = cu(this.request).defaults(s), this.log = Cu(t.log), this.hook = A, t.authStrategy) {
      const { authStrategy: n, ...o } = t, a = n(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: o
          },
          t.auth
        )
      );
      A.wrap("request", a.hook), this.auth = a;
    } else if (!t.auth)
      this.auth = async () => ({
        type: "unauthenticated"
      });
    else {
      const n = Qu(t.auth);
      A.wrap("request", n.hook), this.auth = n;
    }
    const r = this.constructor;
    for (let n = 0; n < r.plugins.length; ++n)
      Object.assign(this, r.plugins[n](this, t));
  }
  // assigned during constructor
  request;
  graphql;
  log;
  hook;
  // TODO: type `octokit.auth` based on passed options.authStrategy
  auth;
}
const du = "17.0.0", fu = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addRepoAccessToSelfHostedRunnerGroupInOrg: [
      "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    createHostedRunnerForOrg: ["POST /orgs/{org}/actions/hosted-runners"],
    createOrUpdateEnvironmentSecret: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteCustomImageFromOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}"
    ],
    deleteCustomImageVersionFromOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    deleteHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    forceCancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getCustomImageForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}"
    ],
    getCustomImageVersionForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions/{version}"
    ],
    getCustomOidcSubClaimForRepo: [
      "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    getEnvironmentPublicKey: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    getHostedRunnersGithubOwnedImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/github-owned"
    ],
    getHostedRunnersLimitsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/limits"
    ],
    getHostedRunnersMachineSpecsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/machine-sizes"
    ],
    getHostedRunnersPartnerImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/partner"
    ],
    getHostedRunnersPlatformsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/platforms"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listCustomImageVersionsForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom/{image_definition_id}/versions"
    ],
    listCustomImagesForOrg: [
      "GET /orgs/{org}/actions/hosted-runners/images/custom"
    ],
    listEnvironmentSecrets: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    listGithubHostedRunnersInGroupForOrg: [
      "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners"
    ],
    listHostedRunnersForOrg: ["GET /orgs/{org}/actions/hosted-runners"],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setCustomOidcSubClaimForRepo: [
      "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    updateHostedRunnerForOrg: [
      "PATCH /orgs/{org}/actions/hosted-runners/{hosted_runner_id}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubBillingPremiumRequestUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/premium_request/usage"
    ],
    getGithubBillingPremiumRequestUsageReportUser: [
      "GET /users/{username}/settings/billing/premium_request/usage"
    ],
    getGithubBillingUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/usage"
    ],
    getGithubBillingUsageReportUser: [
      "GET /users/{username}/settings/billing/usage"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  campaigns: {
    createCampaign: ["POST /orgs/{org}/campaigns"],
    deleteCampaign: ["DELETE /orgs/{org}/campaigns/{campaign_number}"],
    getCampaignSummary: ["GET /orgs/{org}/campaigns/{campaign_number}"],
    listOrgCampaigns: ["GET /orgs/{org}/campaigns"],
    updateCampaign: ["PATCH /orgs/{org}/campaigns/{campaign_number}"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    commitAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
    ],
    createAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    createVariantAnalysis: [
      "POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"
    ],
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    deleteCodeqlDatabase: [
      "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getAutofix: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    getVariantAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
    ],
    getVariantAnalysisRepoTask: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
    ],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codeSecurity: {
    attachConfiguration: [
      "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
    ],
    attachEnterpriseConfiguration: [
      "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
    ],
    createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
    createConfigurationForEnterprise: [
      "POST /enterprises/{enterprise}/code-security/configurations"
    ],
    deleteConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    deleteConfigurationForEnterprise: [
      "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    detachConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/detach"
    ],
    getConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    getConfigurationForRepository: [
      "GET /repos/{owner}/{repo}/code-security-configuration"
    ],
    getConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations"
    ],
    getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
    getDefaultConfigurations: [
      "GET /orgs/{org}/code-security/configurations/defaults"
    ],
    getDefaultConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/defaults"
    ],
    getRepositoriesForConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
    ],
    getRepositoriesForEnterpriseConfiguration: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
    ],
    getSingleConfigurationForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    setConfigurationAsDefault: [
      "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
    ],
    setConfigurationAsDefaultForEnterprise: [
      "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
    ],
    updateConfiguration: [
      "PATCH /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    updateEnterpriseConfiguration: [
      "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: [
      "GET /repos/{owner}/{repo}/codespaces/permissions_check"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotSeatsForTeams: [
      "POST /orgs/{org}/copilot/billing/selected_teams"
    ],
    addCopilotSeatsForUsers: [
      "POST /orgs/{org}/copilot/billing/selected_users"
    ],
    cancelCopilotSeatAssignmentForTeams: [
      "DELETE /orgs/{org}/copilot/billing/selected_teams"
    ],
    cancelCopilotSeatAssignmentForUsers: [
      "DELETE /orgs/{org}/copilot/billing/selected_users"
    ],
    copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
    copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: [
      "GET /orgs/{org}/members/{username}/copilot"
    ],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"]
  },
  credentials: { revoke: ["POST /credentials/revoke"] },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repositoryAccessForOrg: [
      "GET /organizations/{org}/dependabot/repository-access"
    ],
    setRepositoryAccessDefaultLevel: [
      "PUT /organizations/{org}/dependabot/repository-access/default-level"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ],
    updateRepositoryAccessForOrg: [
      "PATCH /organizations/{org}/dependabot/repository-access"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  enterpriseTeamMemberships: {
    add: [
      "PUT /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"
    ],
    bulkAdd: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/memberships/add"
    ],
    bulkRemove: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/memberships/remove"
    ],
    get: [
      "GET /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"
    ],
    list: ["GET /enterprises/{enterprise}/teams/{enterprise-team}/memberships"],
    remove: [
      "DELETE /enterprises/{enterprise}/teams/{enterprise-team}/memberships/{username}"
    ]
  },
  enterpriseTeamOrganizations: {
    add: [
      "PUT /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"
    ],
    bulkAdd: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/organizations/add"
    ],
    bulkRemove: [
      "POST /enterprises/{enterprise}/teams/{enterprise-team}/organizations/remove"
    ],
    delete: [
      "DELETE /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"
    ],
    getAssignment: [
      "GET /enterprises/{enterprise}/teams/{enterprise-team}/organizations/{org}"
    ],
    getAssignments: [
      "GET /enterprises/{enterprise}/teams/{enterprise-team}/organizations"
    ]
  },
  enterpriseTeams: {
    create: ["POST /enterprises/{enterprise}/teams"],
    delete: ["DELETE /enterprises/{enterprise}/teams/{team_slug}"],
    get: ["GET /enterprises/{enterprise}/teams/{team_slug}"],
    list: ["GET /enterprises/{enterprise}/teams"],
    update: ["PATCH /enterprises/{enterprise}/teams/{team_slug}"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  hostedCompute: {
    createNetworkConfigurationForOrg: [
      "POST /orgs/{org}/settings/network-configurations"
    ],
    deleteNetworkConfigurationFromOrg: [
      "DELETE /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkConfigurationForOrg: [
      "GET /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ],
    getNetworkSettingsForOrg: [
      "GET /orgs/{org}/settings/network-settings/{network_settings_id}"
    ],
    listNetworkConfigurationsForOrg: [
      "GET /orgs/{org}/settings/network-configurations"
    ],
    updateNetworkConfigurationForOrg: [
      "PATCH /orgs/{org}/settings/network-configurations/{network_configuration_id}"
    ]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addBlockedByDependency: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    addSubIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    getParent: ["GET /repos/{owner}/{repo}/issues/{issue_number}/parent"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listDependenciesBlockedBy: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by"
    ],
    listDependenciesBlocking: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocking"
    ],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    listSubIssues: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeDependencyBlockedBy: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by/{issue_id}"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    removeSubIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"
    ],
    reprioritizeSubIssue: [
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ]
  },
  oidc: {
    getOidcCustomSubTemplateForOrg: [
      "GET /orgs/{org}/actions/oidc/customization/sub"
    ],
    updateOidcCustomSubTemplateForOrg: [
      "PUT /orgs/{org}/actions/oidc/customization/sub"
    ]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
      }
    ],
    assignTeamToOrgRole: [
      "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    assignUserToOrgRole: [
      "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createArtifactStorageRecord: [
      "POST /orgs/{org}/artifacts/metadata/storage-record"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createIssueType: ["POST /orgs/{org}/issue-types"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    customPropertiesForOrgsCreateOrUpdateOrganizationValues: [
      "PATCH /organizations/{org}/org-properties/values"
    ],
    customPropertiesForOrgsGetOrganizationValues: [
      "GET /organizations/{org}/org-properties/values"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationDefinition: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationDefinitions: [
      "PATCH /orgs/{org}/properties/schema"
    ],
    customPropertiesForReposCreateOrUpdateOrganizationValues: [
      "PATCH /orgs/{org}/properties/values"
    ],
    customPropertiesForReposDeleteOrganizationDefinition: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposGetOrganizationDefinition: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    customPropertiesForReposGetOrganizationDefinitions: [
      "GET /orgs/{org}/properties/schema"
    ],
    customPropertiesForReposGetOrganizationValues: [
      "GET /orgs/{org}/properties/values"
    ],
    delete: ["DELETE /orgs/{org}"],
    deleteAttestationsBulk: ["POST /orgs/{org}/attestations/delete-request"],
    deleteAttestationsById: [
      "DELETE /orgs/{org}/attestations/{attestation_id}"
    ],
    deleteAttestationsBySubjectDigest: [
      "DELETE /orgs/{org}/attestations/digest/{subject_digest}"
    ],
    deleteIssueType: ["DELETE /orgs/{org}/issue-types/{issue_type_id}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    disableSelectedRepositoryImmutableReleasesOrganization: [
      "DELETE /orgs/{org}/settings/immutable-releases/repositories/{repository_id}"
    ],
    enableSelectedRepositoryImmutableReleasesOrganization: [
      "PUT /orgs/{org}/settings/immutable-releases/repositories/{repository_id}"
    ],
    get: ["GET /orgs/{org}"],
    getImmutableReleasesSettings: [
      "GET /orgs/{org}/settings/immutable-releases"
    ],
    getImmutableReleasesSettingsRepositories: [
      "GET /orgs/{org}/settings/immutable-releases/repositories"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
    getOrgRulesetHistory: ["GET /orgs/{org}/rulesets/{ruleset_id}/history"],
    getOrgRulesetVersion: [
      "GET /orgs/{org}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listArtifactStorageRecords: [
      "GET /orgs/{org}/artifacts/{subject_digest}/metadata/storage-records"
    ],
    listAttestationRepositories: ["GET /orgs/{org}/attestations/repositories"],
    listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
    listAttestationsBulk: [
      "POST /orgs/{org}/attestations/bulk-list{?per_page,before,after}"
    ],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listIssueTypes: ["GET /orgs/{org}/issue-types"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
    listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
    listOrgRoles: ["GET /orgs/{org}/organization-roles"],
    listOrganizationFineGrainedPermissions: [
      "GET /orgs/{org}/organization-fine-grained-permissions"
    ],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: [
      "GET /orgs/{org}/security-managers",
      {},
      {
        deprecated: "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
      }
    ],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
      }
    ],
    reviewPatGrantRequest: [
      "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /orgs/{org}/personal-access-token-requests"
    ],
    revokeAllOrgRolesTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
    ],
    revokeAllOrgRolesUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}"
    ],
    revokeOrgRoleTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    revokeOrgRoleUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    setImmutableReleasesSettings: [
      "PUT /orgs/{org}/settings/immutable-releases"
    ],
    setImmutableReleasesSettingsRepositories: [
      "PUT /orgs/{org}/settings/immutable-releases/repositories"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateIssueType: ["PUT /orgs/{org}/issue-types/{issue_type_id}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  privateRegistries: {
    createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
    deleteOrgPrivateRegistry: [
      "DELETE /orgs/{org}/private-registries/{secret_name}"
    ],
    getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
    listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
    updateOrgPrivateRegistry: [
      "PATCH /orgs/{org}/private-registries/{secret_name}"
    ]
  },
  projects: {
    addItemForOrg: ["POST /orgs/{org}/projectsV2/{project_number}/items"],
    addItemForUser: [
      "POST /users/{username}/projectsV2/{project_number}/items"
    ],
    deleteItemForOrg: [
      "DELETE /orgs/{org}/projectsV2/{project_number}/items/{item_id}"
    ],
    deleteItemForUser: [
      "DELETE /users/{username}/projectsV2/{project_number}/items/{item_id}"
    ],
    getFieldForOrg: [
      "GET /orgs/{org}/projectsV2/{project_number}/fields/{field_id}"
    ],
    getFieldForUser: [
      "GET /users/{username}/projectsV2/{project_number}/fields/{field_id}"
    ],
    getForOrg: ["GET /orgs/{org}/projectsV2/{project_number}"],
    getForUser: ["GET /users/{username}/projectsV2/{project_number}"],
    getOrgItem: ["GET /orgs/{org}/projectsV2/{project_number}/items/{item_id}"],
    getUserItem: [
      "GET /users/{username}/projectsV2/{project_number}/items/{item_id}"
    ],
    listFieldsForOrg: ["GET /orgs/{org}/projectsV2/{project_number}/fields"],
    listFieldsForUser: [
      "GET /users/{username}/projectsV2/{project_number}/fields"
    ],
    listForOrg: ["GET /orgs/{org}/projectsV2"],
    listForUser: ["GET /users/{username}/projectsV2"],
    listItemsForOrg: ["GET /orgs/{org}/projectsV2/{project_number}/items"],
    listItemsForUser: [
      "GET /users/{username}/projectsV2/{project_number}/items"
    ],
    updateItemForOrg: [
      "PATCH /orgs/{org}/projectsV2/{project_number}/items/{item_id}"
    ],
    updateItemForUser: [
      "PATCH /users/{username}/projectsV2/{project_number}/items/{item_id}"
    ]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    cancelPagesDeployment: [
      "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
    ],
    checkAutomatedSecurityFixes: [
      "GET /repos/{owner}/{repo}/automated-security-fixes"
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkImmutableReleases: ["GET /repos/{owner}/{repo}/immutable-releases"],
    checkPrivateVulnerabilityReporting: [
      "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    customPropertiesForReposCreateOrUpdateRepositoryValues: [
      "PATCH /repos/{owner}/{repo}/properties/values"
    ],
    customPropertiesForReposGetRepositoryValues: [
      "GET /repos/{owner}/{repo}/properties/values"
    ],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disableImmutableReleases: [
      "DELETE /repos/{owner}/{repo}/immutable-releases"
    ],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enableImmutableReleases: ["PUT /repos/{owner}/{repo}/immutable-releases"],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesDeployment: [
      "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
    ],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: [
      "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
    ],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesetHistory: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history"
    ],
    getRepoRulesetVersion: [
      "GET /repos/{owner}/{repo}/rulesets/{ruleset_id}/history/{version_id}"
    ],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAttestations: [
      "GET /repos/{owner}/{repo}/attestations/{subject_digest}"
    ],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    createPushProtectionBypass: [
      "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    listOrgPatternConfigs: [
      "GET /orgs/{org}/secret-scanning/pattern-configurations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    updateOrgPatternConfigs: [
      "PATCH /orgs/{org}/secret-scanning/pattern-configurations"
    ]
  },
  securityAdvisories: {
    createFork: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
    ],
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteAttestationsBulk: [
      "POST /users/{username}/attestations/delete-request"
    ],
    deleteAttestationsById: [
      "DELETE /users/{username}/attestations/{attestation_id}"
    ],
    deleteAttestationsBySubjectDigest: [
      "DELETE /users/{username}/attestations/digest/{subject_digest}"
    ],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getById: ["GET /user/{account_id}"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
    listAttestationsBulk: [
      "POST /users/{username}/attestations/bulk-list{?per_page,before,after}"
    ],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var pu = fu;
const Nt = /* @__PURE__ */ new Map();
for (const [e, t] of Object.entries(pu))
  for (const [A, s] of Object.entries(t)) {
    const [r, n, o] = s, [a, u] = r.split(/ /), l = Object.assign(
      {
        method: a,
        url: u
      },
      n
    );
    Nt.has(e) || Nt.set(e, /* @__PURE__ */ new Map()), Nt.get(e).set(A, {
      scope: e,
      methodName: A,
      endpointDefaults: l,
      decorations: o
    });
  }
const wu = {
  has({ scope: e }, t) {
    return Nt.get(e).has(t);
  },
  getOwnPropertyDescriptor(e, t) {
    return {
      value: this.get(e, t),
      // ensures method is in the cache
      configurable: !0,
      writable: !0,
      enumerable: !0
    };
  },
  defineProperty(e, t, A) {
    return Object.defineProperty(e.cache, t, A), !0;
  },
  deleteProperty(e, t) {
    return delete e.cache[t], !0;
  },
  ownKeys({ scope: e }) {
    return [...Nt.get(e).keys()];
  },
  set(e, t, A) {
    return e.cache[t] = A;
  },
  get({ octokit: e, scope: t, cache: A }, s) {
    if (A[s])
      return A[s];
    const r = Nt.get(t).get(s);
    if (!r)
      return;
    const { endpointDefaults: n, decorations: o } = r;
    return o ? A[s] = yu(
      e,
      t,
      s,
      n,
      o
    ) : A[s] = e.request.defaults(n), A[s];
  }
};
function mu(e) {
  const t = {};
  for (const A of Nt.keys())
    t[A] = new Proxy({ octokit: e, scope: A, cache: {} }, wu);
  return t;
}
function yu(e, t, A, s, r) {
  const n = e.request.defaults(s);
  function o(...a) {
    let u = n.endpoint.merge(...a);
    if (r.mapToData)
      return u = Object.assign({}, u, {
        data: u[r.mapToData],
        [r.mapToData]: void 0
      }), n(u);
    if (r.renamed) {
      const [l, i] = r.renamed;
      e.log.warn(
        `octokit.${t}.${A}() has been renamed to octokit.${l}.${i}()`
      );
    }
    if (r.deprecated && e.log.warn(r.deprecated), r.renamedParameters) {
      const l = n.endpoint.merge(...a);
      for (const [i, c] of Object.entries(
        r.renamedParameters
      ))
        i in l && (e.log.warn(
          `"${i}" parameter is deprecated for "octokit.${t}.${A}()". Use "${c}" instead`
        ), c in l || (l[c] = l[i]), delete l[i]);
      return n(l);
    }
    return n(...a);
  }
  return Object.assign(o, n);
}
function Ta(e) {
  return {
    rest: mu(e)
  };
}
Ta.VERSION = du;
var Du = "0.0.0-development";
function bu(e) {
  if (!e.data)
    return {
      ...e,
      data: []
    };
  if (!(("total_count" in e.data || "total_commits" in e.data) && !("url" in e.data))) return e;
  const A = e.data.incomplete_results, s = e.data.repository_selection, r = e.data.total_count, n = e.data.total_commits;
  delete e.data.incomplete_results, delete e.data.repository_selection, delete e.data.total_count, delete e.data.total_commits;
  const o = Object.keys(e.data)[0], a = e.data[o];
  return e.data = a, typeof A < "u" && (e.data.incomplete_results = A), typeof s < "u" && (e.data.repository_selection = s), e.data.total_count = r, e.data.total_commits = n, e;
}
function rn(e, t, A) {
  const s = typeof t == "function" ? t.endpoint(A) : e.request.endpoint(t, A), r = typeof t == "function" ? t : e.request, n = s.method, o = s.headers;
  let a = s.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!a) return { done: !0 };
        try {
          const u = await r({ method: n, url: a, headers: o }), l = bu(u);
          if (a = ((l.headers.link || "").match(
            /<([^<>]+)>;\s*rel="next"/
          ) || [])[1], !a && "total_commits" in l.data) {
            const i = new URL(l.url), c = i.searchParams, Q = parseInt(c.get("page") || "1", 10), h = parseInt(c.get("per_page") || "250", 10);
            Q * h < l.data.total_commits && (c.set("page", String(Q + 1)), a = i.toString());
          }
          return { value: l };
        } catch (u) {
          if (u.status !== 409) throw u;
          return a = "", {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}
function Sa(e, t, A, s) {
  return typeof A == "function" && (s = A, A = void 0), Ua(
    e,
    [],
    rn(e, t, A)[Symbol.asyncIterator](),
    s
  );
}
function Ua(e, t, A, s) {
  return A.next().then((r) => {
    if (r.done)
      return t;
    let n = !1;
    function o() {
      n = !0;
    }
    return t = t.concat(
      s ? s(r.value, o) : r.value.data
    ), n ? t : Ua(e, t, A, s);
  });
}
Object.assign(Sa, {
  iterator: rn
});
function Na(e) {
  return {
    paginate: Object.assign(Sa.bind(null, e), {
      iterator: rn.bind(null, e)
    })
  };
}
Na.VERSION = Du, new sa();
const sn = dl(), Ru = {
  baseUrl: sn,
  request: {
    agent: Bl(sn),
    fetch: Il(sn)
  }
}, ku = Iu.plugin(Ta, Na).defaults(Ru);
function Fu(e, t) {
  const A = Object.assign({}, {}), s = hl(e, A);
  return s && (A.auth = s), A;
}
const nn = new sa();
function Tu(e, t, ...A) {
  const s = ku.plugin(...A);
  return new s(Fu(e));
}
const et = (e) => `\`${e}\``, Su = (e, t) => `[${e}](${t})`, Ma = (e) => `<sub>${e}</sub>`, JA = (e) => `<sup>${e}</sup>`, HA = (e) => `**${e}**`;
async function Uu({
  token: e,
  commentSignature: t,
  repo: A,
  prNumber: s,
  body: r
}) {
  LA("Comment on PR"), r += `

${t}`;
  const n = Tu(e);
  Xe("Getting list of comments");
  const { data: o } = await n.rest.issues.listComments({
    ...A,
    issue_number: s
  }), a = o.find((u) => u.body.endsWith(t));
  a ? (Xe(`Updating previous comment ID ${a.id}`), await n.rest.issues.updateComment({
    ...A,
    comment_id: a.id,
    body: r
  })) : (Xe("Posting new comment"), await n.rest.issues.createComment({
    ...A,
    issue_number: s,
    body: r
  })), GA();
}
let La = {};
const Ga = /* @__PURE__ */ new WeakMap(), va = {
  metric: [
    { from: 0, to: 1e3, unit: "B", long: "bytes" },
    { from: 1e3, to: 1e6, unit: "kB", long: "kilobytes" },
    { from: 1e6, to: 1e9, unit: "MB", long: "megabytes" },
    { from: 1e9, to: 1e12, unit: "GB", long: "gigabytes" },
    { from: 1e12, to: 1e15, unit: "TB", long: "terabytes" },
    { from: 1e15, to: 1e18, unit: "PB", long: "petabytes" },
    { from: 1e18, to: 1e21, unit: "EB", long: "exabytes" },
    { from: 1e21, to: 1e24, unit: "ZB", long: "zettabytes" },
    { from: 1e24, to: 1e27, unit: "YB", long: "yottabytes" }
  ],
  metric_octet: [
    { from: 0, to: 1e3, unit: "o", long: "octets" },
    { from: 1e3, to: 1e6, unit: "ko", long: "kilooctets" },
    { from: 1e6, to: 1e9, unit: "Mo", long: "megaoctets" },
    { from: 1e9, to: 1e12, unit: "Go", long: "gigaoctets" },
    { from: 1e12, to: 1e15, unit: "To", long: "teraoctets" },
    { from: 1e15, to: 1e18, unit: "Po", long: "petaoctets" },
    { from: 1e18, to: 1e21, unit: "Eo", long: "exaoctets" },
    { from: 1e21, to: 1e24, unit: "Zo", long: "zettaoctets" },
    { from: 1e24, to: 1e27, unit: "Yo", long: "yottaoctets" }
  ],
  iec: [
    { from: 0, to: Math.pow(1024, 1), unit: "B", long: "bytes" },
    { from: Math.pow(1024, 1), to: Math.pow(1024, 2), unit: "KiB", long: "kibibytes" },
    { from: Math.pow(1024, 2), to: Math.pow(1024, 3), unit: "MiB", long: "mebibytes" },
    { from: Math.pow(1024, 3), to: Math.pow(1024, 4), unit: "GiB", long: "gibibytes" },
    { from: Math.pow(1024, 4), to: Math.pow(1024, 5), unit: "TiB", long: "tebibytes" },
    { from: Math.pow(1024, 5), to: Math.pow(1024, 6), unit: "PiB", long: "pebibytes" },
    { from: Math.pow(1024, 6), to: Math.pow(1024, 7), unit: "EiB", long: "exbibytes" },
    { from: Math.pow(1024, 7), to: Math.pow(1024, 8), unit: "ZiB", long: "zebibytes" },
    { from: Math.pow(1024, 8), to: Math.pow(1024, 9), unit: "YiB", long: "yobibytes" }
  ],
  iec_octet: [
    { from: 0, to: Math.pow(1024, 1), unit: "o", long: "octets" },
    { from: Math.pow(1024, 1), to: Math.pow(1024, 2), unit: "Kio", long: "kibioctets" },
    { from: Math.pow(1024, 2), to: Math.pow(1024, 3), unit: "Mio", long: "mebioctets" },
    { from: Math.pow(1024, 3), to: Math.pow(1024, 4), unit: "Gio", long: "gibioctets" },
    { from: Math.pow(1024, 4), to: Math.pow(1024, 5), unit: "Tio", long: "tebioctets" },
    { from: Math.pow(1024, 5), to: Math.pow(1024, 6), unit: "Pio", long: "pebioctets" },
    { from: Math.pow(1024, 6), to: Math.pow(1024, 7), unit: "Eio", long: "exbioctets" },
    { from: Math.pow(1024, 7), to: Math.pow(1024, 8), unit: "Zio", long: "zebioctets" },
    { from: Math.pow(1024, 8), to: Math.pow(1024, 9), unit: "Yio", long: "yobioctets" }
  ]
};
class Nu {
  constructor(t, A) {
    A = Object.assign({
      units: "metric",
      precision: 1,
      locale: void 0
      // Default to the user's system locale
    }, La, A), Ga.set(this, A), Object.assign(va, A.customUnits);
    const s = t < 0 ? "-" : "";
    t = Math.abs(t);
    const r = va[A.units];
    if (r) {
      const n = r.find((o) => t >= o.from && t < o.to);
      if (n) {
        const o = new Intl.NumberFormat(A.locale, {
          style: "decimal",
          maximumFractionDigits: A.precision
        }), a = n.from === 0 ? s + o.format(t) : s + o.format(t / n.from);
        this.value = a, this.unit = n.unit, this.long = n.long;
      } else
        this.value = s + t, this.unit = "", this.long = "";
    } else
      throw new Error(`Invalid units specified: ${A.units}`);
  }
  toString() {
    const t = Ga.get(this);
    return t.toStringFn ? t.toStringFn.bind(this)() : `${this.value} ${this.unit}`;
  }
}
function tt(e, t) {
  return new Nu(e, t);
}
tt.defaultOptions = function(e) {
  La = e;
};
function Mu(e) {
  return e.length;
}
function pt(e, t) {
  const A = t || {}, s = (A.align || []).concat(), r = A.stringLength || Mu, n = [], o = [], a = [], u = [];
  let l = 0, i = -1;
  for (; ++i < e.length; ) {
    const d = [], y = [];
    let b = -1;
    for (e[i].length > l && (l = e[i].length); ++b < e[i].length; ) {
      const F = Lu(e[i][b]);
      if (A.alignDelimiters !== !1) {
        const M = r(F);
        y[b] = M, (u[b] === void 0 || M > u[b]) && (u[b] = M);
      }
      d.push(F);
    }
    o[i] = d, a[i] = y;
  }
  let c = -1;
  if (typeof s == "object" && "length" in s)
    for (; ++c < l; )
      n[c] = Ya(s[c]);
  else {
    const d = Ya(s);
    for (; ++c < l; )
      n[c] = d;
  }
  c = -1;
  const Q = [], h = [];
  for (; ++c < l; ) {
    const d = n[c];
    let y = "", b = "";
    d === 99 ? (y = ":", b = ":") : d === 108 ? y = ":" : d === 114 && (b = ":");
    let F = A.alignDelimiters === !1 ? 1 : Math.max(
      1,
      u[c] - y.length - b.length
    );
    const M = y + "-".repeat(F) + b;
    A.alignDelimiters !== !1 && (F = y.length + F + b.length, F > u[c] && (u[c] = F), h[c] = F), Q[c] = M;
  }
  o.splice(1, 0, Q), a.splice(1, 0, h), i = -1;
  const B = [];
  for (; ++i < o.length; ) {
    const d = o[i], y = a[i];
    c = -1;
    const b = [];
    for (; ++c < l; ) {
      const F = d[c] || "";
      let M = "", L = "";
      if (A.alignDelimiters !== !1) {
        const N = u[c] - (y[c] || 0), f = n[c];
        f === 114 ? M = " ".repeat(N) : f === 99 ? N % 2 ? (M = " ".repeat(N / 2 + 0.5), L = " ".repeat(N / 2 - 0.5)) : (M = " ".repeat(N / 2), L = M) : L = " ".repeat(N);
      }
      A.delimiterStart !== !1 && !c && b.push("|"), A.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(A.alignDelimiters === !1 && F === "") && (A.delimiterStart !== !1 || c) && b.push(" "), A.alignDelimiters !== !1 && b.push(M), b.push(F), A.alignDelimiters !== !1 && b.push(L), A.padding !== !1 && b.push(" "), (A.delimiterEnd !== !1 || c !== l - 1) && b.push("|");
    }
    B.push(
      A.delimiterEnd === !1 ? b.join("").replace(/ +$/, "") : b.join("")
    );
  }
  return B.join(`
`);
}
function Lu(e) {
  return e == null ? "" : String(e);
}
function Ya(e) {
  const t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function OA() {
}
function Ja() {
  return typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : Gu();
}
function Gu() {
  return {
    add: OA,
    delete: OA,
    get: OA,
    set: OA,
    has: function(e) {
      return !1;
    }
  };
}
var vu = Object.prototype.hasOwnProperty, on = function(e, t) {
  return vu.call(e, t);
};
function an(e, t) {
  for (var A in t)
    on(t, A) && (e[A] = t[A]);
  return e;
}
var Yu = /^[ \t]*(?:\r\n|\r|\n)/, Ju = /(?:\r\n|\r|\n)[ \t]*$/, Hu = /^(?:[\r\n]|$)/, Ou = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/, Pu = /^[ \t]*[\r\n][ \t\r\n]*$/;
function Ha(e, t, A) {
  var s = 0, r = e[0].match(Ou);
  r && (s = r[1].length);
  var n = "(\\r\\n|\\r|\\n).{0," + s + "}", o = new RegExp(n, "g");
  t && (e = e.slice(1));
  var a = A.newline, u = A.trimLeadingNewline, l = A.trimTrailingNewline, i = typeof a == "string", c = e.length, Q = e.map(function(h, B) {
    return h = h.replace(o, "$1"), B === 0 && u && (h = h.replace(Yu, "")), B === c - 1 && l && (h = h.replace(Ju, "")), i && (h = h.replace(/\r\n|\n|\r/g, function(d) {
      return a;
    })), h;
  });
  return Q;
}
function _u(e, t) {
  for (var A = "", s = 0, r = e.length; s < r; s++)
    A += e[s], s < r - 1 && (A += t[s]);
  return A;
}
function xu(e) {
  return on(e, "raw") && on(e, "length");
}
function Oa(e) {
  var t = Ja(), A = Ja();
  function s(n) {
    for (var o = [], a = 1; a < arguments.length; a++)
      o[a - 1] = arguments[a];
    if (xu(n)) {
      var u = n, l = (o[0] === s || o[0] === wt) && Pu.test(u[0]) && Hu.test(u[1]), i = l ? A : t, c = i.get(u);
      if (c || (c = Ha(u, l, e), i.set(u, c)), o.length === 0)
        return c[0];
      var Q = _u(c, l ? o.slice(1) : o);
      return Q;
    } else
      return Oa(an(an({}, e), n || {}));
  }
  var r = an(s, {
    string: function(n) {
      return Ha([n], !1, e)[0];
    }
  });
  return r;
}
var wt = Oa({
  trimLeadingNewline: !0,
  trimTrailingNewline: !0
});
if (typeof module < "u")
  try {
    module.exports = wt, Object.defineProperty(wt, "__esModule", { value: !0 }), wt.default = wt, wt.outdent = wt;
  } catch {
  }
var Pa = typeof global == "object" && global && global.Object === Object && global, Vu = typeof self == "object" && self && self.Object === Object && self, ht = Pa || Vu || Function("return this")(), bt = ht.Symbol, _a = Object.prototype, Wu = _a.hasOwnProperty, qu = _a.toString, aA = bt ? bt.toStringTag : void 0;
function zu(e) {
  var t = Wu.call(e, aA), A = e[aA];
  try {
    e[aA] = void 0;
    var s = !0;
  } catch {
  }
  var r = qu.call(e);
  return s && (t ? e[aA] = A : delete e[aA]), r;
}
var Zu = Object.prototype, Ku = Zu.toString;
function ju(e) {
  return Ku.call(e);
}
var Xu = "[object Null]", $u = "[object Undefined]", xa = bt ? bt.toStringTag : void 0;
function _t(e) {
  return e == null ? e === void 0 ? $u : Xu : xa && xa in Object(e) ? zu(e) : ju(e);
}
function xt(e) {
  return e != null && typeof e == "object";
}
var eE = "[object Symbol]";
function PA(e) {
  return typeof e == "symbol" || xt(e) && _t(e) == eE;
}
function tE(e, t) {
  for (var A = -1, s = e == null ? 0 : e.length, r = Array(s); ++A < s; )
    r[A] = t(e[A], A, e);
  return r;
}
var Bt = Array.isArray, Va = bt ? bt.prototype : void 0, Wa = Va ? Va.toString : void 0;
function qa(e) {
  if (typeof e == "string")
    return e;
  if (Bt(e))
    return tE(e, qa) + "";
  if (PA(e))
    return Wa ? Wa.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
var AE = /\s/;
function rE(e) {
  for (var t = e.length; t-- && AE.test(e.charAt(t)); )
    ;
  return t;
}
var sE = /^\s+/;
function nE(e) {
  return e && e.slice(0, rE(e) + 1).replace(sE, "");
}
function cA(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var za = NaN, oE = /^[-+]0x[0-9a-f]+$/i, iE = /^0b[01]+$/i, aE = /^0o[0-7]+$/i, cE = parseInt;
function Za(e) {
  if (typeof e == "number")
    return e;
  if (PA(e))
    return za;
  if (cA(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = cA(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = nE(e);
  var A = iE.test(e);
  return A || aE.test(e) ? cE(e.slice(2), A ? 2 : 8) : oE.test(e) ? za : +e;
}
var Ka = 1 / 0, gE = 17976931348623157e292;
function lE(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = Za(e), e === Ka || e === -Ka) {
    var t = e < 0 ? -1 : 1;
    return t * gE;
  }
  return e === e ? e : 0;
}
function uE(e) {
  var t = lE(e), A = t % 1;
  return t === t ? A ? t - A : t : 0;
}
function EE(e) {
  return e;
}
var QE = "[object AsyncFunction]", hE = "[object Function]", BE = "[object GeneratorFunction]", CE = "[object Proxy]";
function ja(e) {
  if (!cA(e))
    return !1;
  var t = _t(e);
  return t == hE || t == BE || t == QE || t == CE;
}
var cn = ht["__core-js_shared__"], Xa = (function() {
  var e = /[^.]+$/.exec(cn && cn.keys && cn.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
})();
function IE(e) {
  return !!Xa && Xa in e;
}
var dE = Function.prototype, fE = dE.toString;
function Mt(e) {
  if (e != null) {
    try {
      return fE.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var pE = /[\\^$.*+?()[\]{}|]/g, wE = /^\[object .+?Constructor\]$/, mE = Function.prototype, yE = Object.prototype, DE = mE.toString, bE = yE.hasOwnProperty, RE = RegExp(
  "^" + DE.call(bE).replace(pE, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function kE(e) {
  if (!cA(e) || IE(e))
    return !1;
  var t = ja(e) ? RE : wE;
  return t.test(Mt(e));
}
function FE(e, t) {
  return e?.[t];
}
function Vt(e, t) {
  var A = FE(e, t);
  return kE(A) ? A : void 0;
}
var gn = Vt(ht, "WeakMap"), TE = 9007199254740991, SE = /^(?:0|[1-9]\d*)$/;
function $a(e, t) {
  var A = typeof e;
  return t = t ?? TE, !!t && (A == "number" || A != "symbol" && SE.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function ec(e, t) {
  return e === t || e !== e && t !== t;
}
var UE = 9007199254740991;
function ln(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= UE;
}
function tc(e) {
  return e != null && ln(e.length) && !ja(e);
}
var NE = Object.prototype;
function ME(e) {
  var t = e && e.constructor, A = typeof t == "function" && t.prototype || NE;
  return e === A;
}
function LE(e, t) {
  for (var A = -1, s = Array(e); ++A < e; )
    s[A] = t(A);
  return s;
}
var GE = "[object Arguments]";
function Ac(e) {
  return xt(e) && _t(e) == GE;
}
var rc = Object.prototype, vE = rc.hasOwnProperty, YE = rc.propertyIsEnumerable, sc = Ac(/* @__PURE__ */ (function() {
  return arguments;
})()) ? Ac : function(e) {
  return xt(e) && vE.call(e, "callee") && !YE.call(e, "callee");
};
function JE() {
  return !1;
}
var nc = typeof exports == "object" && exports && !exports.nodeType && exports, oc = nc && typeof module == "object" && module && !module.nodeType && module, HE = oc && oc.exports === nc, ic = HE ? ht.Buffer : void 0, OE = ic ? ic.isBuffer : void 0, un = OE || JE, PE = "[object Arguments]", _E = "[object Array]", xE = "[object Boolean]", VE = "[object Date]", WE = "[object Error]", qE = "[object Function]", zE = "[object Map]", ZE = "[object Number]", KE = "[object Object]", jE = "[object RegExp]", XE = "[object Set]", $E = "[object String]", eQ = "[object WeakMap]", tQ = "[object ArrayBuffer]", AQ = "[object DataView]", rQ = "[object Float32Array]", sQ = "[object Float64Array]", nQ = "[object Int8Array]", oQ = "[object Int16Array]", iQ = "[object Int32Array]", aQ = "[object Uint8Array]", cQ = "[object Uint8ClampedArray]", gQ = "[object Uint16Array]", lQ = "[object Uint32Array]", Pe = {};
Pe[rQ] = Pe[sQ] = Pe[nQ] = Pe[oQ] = Pe[iQ] = Pe[aQ] = Pe[cQ] = Pe[gQ] = Pe[lQ] = !0, Pe[PE] = Pe[_E] = Pe[tQ] = Pe[xE] = Pe[AQ] = Pe[VE] = Pe[WE] = Pe[qE] = Pe[zE] = Pe[ZE] = Pe[KE] = Pe[jE] = Pe[XE] = Pe[$E] = Pe[eQ] = !1;
function uQ(e) {
  return xt(e) && ln(e.length) && !!Pe[_t(e)];
}
function EQ(e) {
  return function(t) {
    return e(t);
  };
}
var ac = typeof exports == "object" && exports && !exports.nodeType && exports, gA = ac && typeof module == "object" && module && !module.nodeType && module, QQ = gA && gA.exports === ac, En = QQ && Pa.process, cc = (function() {
  try {
    var e = gA && gA.require && gA.require("util").types;
    return e || En && En.binding && En.binding("util");
  } catch {
  }
})(), gc = cc && cc.isTypedArray, lc = gc ? EQ(gc) : uQ, hQ = Object.prototype, BQ = hQ.hasOwnProperty;
function CQ(e, t) {
  var A = Bt(e), s = !A && sc(e), r = !A && !s && un(e), n = !A && !s && !r && lc(e), o = A || s || r || n, a = o ? LE(e.length, String) : [], u = a.length;
  for (var l in e)
    BQ.call(e, l) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (l == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    r && (l == "offset" || l == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    n && (l == "buffer" || l == "byteLength" || l == "byteOffset") || // Skip index properties.
    $a(l, u))) && a.push(l);
  return a;
}
function IQ(e, t) {
  return function(A) {
    return e(t(A));
  };
}
var dQ = IQ(Object.keys, Object), fQ = Object.prototype, pQ = fQ.hasOwnProperty;
function wQ(e) {
  if (!ME(e))
    return dQ(e);
  var t = [];
  for (var A in Object(e))
    pQ.call(e, A) && A != "constructor" && t.push(A);
  return t;
}
function Qn(e) {
  return tc(e) ? CQ(e) : wQ(e);
}
var mQ = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, yQ = /^\w*$/;
function hn(e, t) {
  if (Bt(e))
    return !1;
  var A = typeof e;
  return A == "number" || A == "symbol" || A == "boolean" || e == null || PA(e) ? !0 : yQ.test(e) || !mQ.test(e) || t != null && e in Object(t);
}
var lA = Vt(Object, "create");
function DQ() {
  this.__data__ = lA ? lA(null) : {}, this.size = 0;
}
function bQ(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var RQ = "__lodash_hash_undefined__", kQ = Object.prototype, FQ = kQ.hasOwnProperty;
function TQ(e) {
  var t = this.__data__;
  if (lA) {
    var A = t[e];
    return A === RQ ? void 0 : A;
  }
  return FQ.call(t, e) ? t[e] : void 0;
}
var SQ = Object.prototype, UQ = SQ.hasOwnProperty;
function NQ(e) {
  var t = this.__data__;
  return lA ? t[e] !== void 0 : UQ.call(t, e);
}
var MQ = "__lodash_hash_undefined__";
function LQ(e, t) {
  var A = this.__data__;
  return this.size += this.has(e) ? 0 : 1, A[e] = lA && t === void 0 ? MQ : t, this;
}
function Lt(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.clear(); ++t < A; ) {
    var s = e[t];
    this.set(s[0], s[1]);
  }
}
Lt.prototype.clear = DQ, Lt.prototype.delete = bQ, Lt.prototype.get = TQ, Lt.prototype.has = NQ, Lt.prototype.set = LQ;
function GQ() {
  this.__data__ = [], this.size = 0;
}
function _A(e, t) {
  for (var A = e.length; A--; )
    if (ec(e[A][0], t))
      return A;
  return -1;
}
var vQ = Array.prototype, YQ = vQ.splice;
function JQ(e) {
  var t = this.__data__, A = _A(t, e);
  if (A < 0)
    return !1;
  var s = t.length - 1;
  return A == s ? t.pop() : YQ.call(t, A, 1), --this.size, !0;
}
function HQ(e) {
  var t = this.__data__, A = _A(t, e);
  return A < 0 ? void 0 : t[A][1];
}
function OQ(e) {
  return _A(this.__data__, e) > -1;
}
function PQ(e, t) {
  var A = this.__data__, s = _A(A, e);
  return s < 0 ? (++this.size, A.push([e, t])) : A[s][1] = t, this;
}
function mt(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.clear(); ++t < A; ) {
    var s = e[t];
    this.set(s[0], s[1]);
  }
}
mt.prototype.clear = GQ, mt.prototype.delete = JQ, mt.prototype.get = HQ, mt.prototype.has = OQ, mt.prototype.set = PQ;
var uA = Vt(ht, "Map");
function _Q() {
  this.size = 0, this.__data__ = {
    hash: new Lt(),
    map: new (uA || mt)(),
    string: new Lt()
  };
}
function xQ(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function xA(e, t) {
  var A = e.__data__;
  return xQ(t) ? A[typeof t == "string" ? "string" : "hash"] : A.map;
}
function VQ(e) {
  var t = xA(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function WQ(e) {
  return xA(this, e).get(e);
}
function qQ(e) {
  return xA(this, e).has(e);
}
function zQ(e, t) {
  var A = xA(this, e), s = A.size;
  return A.set(e, t), this.size += A.size == s ? 0 : 1, this;
}
function yt(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.clear(); ++t < A; ) {
    var s = e[t];
    this.set(s[0], s[1]);
  }
}
yt.prototype.clear = _Q, yt.prototype.delete = VQ, yt.prototype.get = WQ, yt.prototype.has = qQ, yt.prototype.set = zQ;
var ZQ = "Expected a function";
function Bn(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(ZQ);
  var A = function() {
    var s = arguments, r = t ? t.apply(this, s) : s[0], n = A.cache;
    if (n.has(r))
      return n.get(r);
    var o = e.apply(this, s);
    return A.cache = n.set(r, o) || n, o;
  };
  return A.cache = new (Bn.Cache || yt)(), A;
}
Bn.Cache = yt;
var KQ = 500;
function jQ(e) {
  var t = Bn(e, function(s) {
    return A.size === KQ && A.clear(), s;
  }), A = t.cache;
  return t;
}
var XQ = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, $Q = /\\(\\)?/g, eh = jQ(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(XQ, function(A, s, r, n) {
    t.push(r ? n.replace($Q, "$1") : s || A);
  }), t;
});
function Cn(e) {
  return e == null ? "" : qa(e);
}
function uc(e, t) {
  return Bt(e) ? e : hn(e, t) ? [e] : eh(Cn(e));
}
function VA(e) {
  if (typeof e == "string" || PA(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Ec(e, t) {
  t = uc(t, e);
  for (var A = 0, s = t.length; e != null && A < s; )
    e = e[VA(t[A++])];
  return A && A == s ? e : void 0;
}
function th(e, t, A) {
  var s = e == null ? void 0 : Ec(e, t);
  return s === void 0 ? A : s;
}
function Ah(e, t) {
  for (var A = -1, s = t.length, r = e.length; ++A < s; )
    e[r + A] = t[A];
  return e;
}
var rh = ht.isFinite, sh = Math.min;
function nh(e) {
  var t = Math[e];
  return function(A, s) {
    if (A = Za(A), s = s == null ? 0 : sh(uE(s), 292), s && rh(A)) {
      var r = (Cn(A) + "e").split("e"), n = t(r[0] + "e" + (+r[1] + s));
      return r = (Cn(n) + "e").split("e"), +(r[0] + "e" + (+r[1] - s));
    }
    return t(A);
  };
}
function oh() {
  this.__data__ = new mt(), this.size = 0;
}
function ih(e) {
  var t = this.__data__, A = t.delete(e);
  return this.size = t.size, A;
}
function ah(e) {
  return this.__data__.get(e);
}
function ch(e) {
  return this.__data__.has(e);
}
var gh = 200;
function lh(e, t) {
  var A = this.__data__;
  if (A instanceof mt) {
    var s = A.__data__;
    if (!uA || s.length < gh - 1)
      return s.push([e, t]), this.size = ++A.size, this;
    A = this.__data__ = new yt(s);
  }
  return A.set(e, t), this.size = A.size, this;
}
function Dt(e) {
  var t = this.__data__ = new mt(e);
  this.size = t.size;
}
Dt.prototype.clear = oh, Dt.prototype.delete = ih, Dt.prototype.get = ah, Dt.prototype.has = ch, Dt.prototype.set = lh;
function uh(e, t) {
  for (var A = -1, s = e == null ? 0 : e.length, r = 0, n = []; ++A < s; ) {
    var o = e[A];
    t(o, A, e) && (n[r++] = o);
  }
  return n;
}
function Eh() {
  return [];
}
var Qh = Object.prototype, hh = Qh.propertyIsEnumerable, Qc = Object.getOwnPropertySymbols, Bh = Qc ? function(e) {
  return e == null ? [] : (e = Object(e), uh(Qc(e), function(t) {
    return hh.call(e, t);
  }));
} : Eh;
function Ch(e, t, A) {
  var s = t(e);
  return Bt(e) ? s : Ah(s, A(e));
}
function hc(e) {
  return Ch(e, Qn, Bh);
}
var In = Vt(ht, "DataView"), dn = Vt(ht, "Promise"), fn = Vt(ht, "Set"), Bc = "[object Map]", Ih = "[object Object]", Cc = "[object Promise]", Ic = "[object Set]", dc = "[object WeakMap]", fc = "[object DataView]", dh = Mt(In), fh = Mt(uA), ph = Mt(dn), wh = Mt(fn), mh = Mt(gn), Rt = _t;
(In && Rt(new In(new ArrayBuffer(1))) != fc || uA && Rt(new uA()) != Bc || dn && Rt(dn.resolve()) != Cc || fn && Rt(new fn()) != Ic || gn && Rt(new gn()) != dc) && (Rt = function(e) {
  var t = _t(e), A = t == Ih ? e.constructor : void 0, s = A ? Mt(A) : "";
  if (s)
    switch (s) {
      case dh:
        return fc;
      case fh:
        return Bc;
      case ph:
        return Cc;
      case wh:
        return Ic;
      case mh:
        return dc;
    }
  return t;
});
var pc = ht.Uint8Array, yh = "__lodash_hash_undefined__";
function Dh(e) {
  return this.__data__.set(e, yh), this;
}
function bh(e) {
  return this.__data__.has(e);
}
function WA(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.__data__ = new yt(); ++t < A; )
    this.add(e[t]);
}
WA.prototype.add = WA.prototype.push = Dh, WA.prototype.has = bh;
function Rh(e, t) {
  for (var A = -1, s = e == null ? 0 : e.length; ++A < s; )
    if (t(e[A], A, e))
      return !0;
  return !1;
}
function kh(e, t) {
  return e.has(t);
}
var Fh = 1, Th = 2;
function wc(e, t, A, s, r, n) {
  var o = A & Fh, a = e.length, u = t.length;
  if (a != u && !(o && u > a))
    return !1;
  var l = n.get(e), i = n.get(t);
  if (l && i)
    return l == t && i == e;
  var c = -1, Q = !0, h = A & Th ? new WA() : void 0;
  for (n.set(e, t), n.set(t, e); ++c < a; ) {
    var B = e[c], d = t[c];
    if (s)
      var y = o ? s(d, B, c, t, e, n) : s(B, d, c, e, t, n);
    if (y !== void 0) {
      if (y)
        continue;
      Q = !1;
      break;
    }
    if (h) {
      if (!Rh(t, function(b, F) {
        if (!kh(h, F) && (B === b || r(B, b, A, s, n)))
          return h.push(F);
      })) {
        Q = !1;
        break;
      }
    } else if (!(B === d || r(B, d, A, s, n))) {
      Q = !1;
      break;
    }
  }
  return n.delete(e), n.delete(t), Q;
}
function Sh(e) {
  var t = -1, A = Array(e.size);
  return e.forEach(function(s, r) {
    A[++t] = [r, s];
  }), A;
}
function Uh(e) {
  var t = -1, A = Array(e.size);
  return e.forEach(function(s) {
    A[++t] = s;
  }), A;
}
var Nh = 1, Mh = 2, Lh = "[object Boolean]", Gh = "[object Date]", vh = "[object Error]", Yh = "[object Map]", Jh = "[object Number]", Hh = "[object RegExp]", Oh = "[object Set]", Ph = "[object String]", _h = "[object Symbol]", xh = "[object ArrayBuffer]", Vh = "[object DataView]", mc = bt ? bt.prototype : void 0, pn = mc ? mc.valueOf : void 0;
function Wh(e, t, A, s, r, n, o) {
  switch (A) {
    case Vh:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case xh:
      return !(e.byteLength != t.byteLength || !n(new pc(e), new pc(t)));
    case Lh:
    case Gh:
    case Jh:
      return ec(+e, +t);
    case vh:
      return e.name == t.name && e.message == t.message;
    case Hh:
    case Ph:
      return e == t + "";
    case Yh:
      var a = Sh;
    case Oh:
      var u = s & Nh;
      if (a || (a = Uh), e.size != t.size && !u)
        return !1;
      var l = o.get(e);
      if (l)
        return l == t;
      s |= Mh, o.set(e, t);
      var i = wc(a(e), a(t), s, r, n, o);
      return o.delete(e), i;
    case _h:
      if (pn)
        return pn.call(e) == pn.call(t);
  }
  return !1;
}
var qh = 1, zh = Object.prototype, Zh = zh.hasOwnProperty;
function Kh(e, t, A, s, r, n) {
  var o = A & qh, a = hc(e), u = a.length, l = hc(t), i = l.length;
  if (u != i && !o)
    return !1;
  for (var c = u; c--; ) {
    var Q = a[c];
    if (!(o ? Q in t : Zh.call(t, Q)))
      return !1;
  }
  var h = n.get(e), B = n.get(t);
  if (h && B)
    return h == t && B == e;
  var d = !0;
  n.set(e, t), n.set(t, e);
  for (var y = o; ++c < u; ) {
    Q = a[c];
    var b = e[Q], F = t[Q];
    if (s)
      var M = o ? s(F, b, Q, t, e, n) : s(b, F, Q, e, t, n);
    if (!(M === void 0 ? b === F || r(b, F, A, s, n) : M)) {
      d = !1;
      break;
    }
    y || (y = Q == "constructor");
  }
  if (d && !y) {
    var L = e.constructor, N = t.constructor;
    L != N && "constructor" in e && "constructor" in t && !(typeof L == "function" && L instanceof L && typeof N == "function" && N instanceof N) && (d = !1);
  }
  return n.delete(e), n.delete(t), d;
}
var jh = 1, yc = "[object Arguments]", Dc = "[object Array]", qA = "[object Object]", Xh = Object.prototype, bc = Xh.hasOwnProperty;
function $h(e, t, A, s, r, n) {
  var o = Bt(e), a = Bt(t), u = o ? Dc : Rt(e), l = a ? Dc : Rt(t);
  u = u == yc ? qA : u, l = l == yc ? qA : l;
  var i = u == qA, c = l == qA, Q = u == l;
  if (Q && un(e)) {
    if (!un(t))
      return !1;
    o = !0, i = !1;
  }
  if (Q && !i)
    return n || (n = new Dt()), o || lc(e) ? wc(e, t, A, s, r, n) : Wh(e, t, u, A, s, r, n);
  if (!(A & jh)) {
    var h = i && bc.call(e, "__wrapped__"), B = c && bc.call(t, "__wrapped__");
    if (h || B) {
      var d = h ? e.value() : e, y = B ? t.value() : t;
      return n || (n = new Dt()), r(d, y, A, s, n);
    }
  }
  return Q ? (n || (n = new Dt()), Kh(e, t, A, s, r, n)) : !1;
}
function wn(e, t, A, s, r) {
  return e === t ? !0 : e == null || t == null || !xt(e) && !xt(t) ? e !== e && t !== t : $h(e, t, A, s, wn, r);
}
var eB = 1, tB = 2;
function AB(e, t, A, s) {
  var r = A.length, n = r;
  if (e == null)
    return !n;
  for (e = Object(e); r--; ) {
    var o = A[r];
    if (o[2] ? o[1] !== e[o[0]] : !(o[0] in e))
      return !1;
  }
  for (; ++r < n; ) {
    o = A[r];
    var a = o[0], u = e[a], l = o[1];
    if (o[2]) {
      if (u === void 0 && !(a in e))
        return !1;
    } else {
      var i = new Dt(), c;
      if (!(c === void 0 ? wn(l, u, eB | tB, s, i) : c))
        return !1;
    }
  }
  return !0;
}
function Rc(e) {
  return e === e && !cA(e);
}
function rB(e) {
  for (var t = Qn(e), A = t.length; A--; ) {
    var s = t[A], r = e[s];
    t[A] = [s, r, Rc(r)];
  }
  return t;
}
function kc(e, t) {
  return function(A) {
    return A == null ? !1 : A[e] === t && (t !== void 0 || e in Object(A));
  };
}
function sB(e) {
  var t = rB(e);
  return t.length == 1 && t[0][2] ? kc(t[0][0], t[0][1]) : function(A) {
    return A === e || AB(A, e, t);
  };
}
function nB(e, t) {
  return e != null && t in Object(e);
}
function oB(e, t, A) {
  t = uc(t, e);
  for (var s = -1, r = t.length, n = !1; ++s < r; ) {
    var o = VA(t[s]);
    if (!(n = e != null && A(e, o)))
      break;
    e = e[o];
  }
  return n || ++s != r ? n : (r = e == null ? 0 : e.length, !!r && ln(r) && $a(o, r) && (Bt(e) || sc(e)));
}
function iB(e, t) {
  return e != null && oB(e, t, nB);
}
var aB = 1, cB = 2;
function gB(e, t) {
  return hn(e) && Rc(t) ? kc(VA(e), t) : function(A) {
    var s = th(A, e);
    return s === void 0 && s === t ? iB(A, e) : wn(t, s, aB | cB);
  };
}
function lB(e) {
  return function(t) {
    return t?.[e];
  };
}
function uB(e) {
  return function(t) {
    return Ec(t, e);
  };
}
function EB(e) {
  return hn(e) ? lB(VA(e)) : uB(e);
}
function QB(e) {
  return typeof e == "function" ? e : e == null ? EE : typeof e == "object" ? Bt(e) ? gB(e[0], e[1]) : sB(e) : EB(e);
}
function hB(e, t, A, s) {
  for (var r = -1, n = e == null ? 0 : e.length; ++r < n; ) {
    var o = e[r];
    t(s, o, A(o), e);
  }
  return s;
}
function BB(e) {
  return function(t, A, s) {
    for (var r = -1, n = Object(t), o = s(t), a = o.length; a--; ) {
      var u = o[++r];
      if (A(n[u], u, n) === !1)
        break;
    }
    return t;
  };
}
var CB = BB();
function IB(e, t) {
  return e && CB(e, t, Qn);
}
function dB(e, t) {
  return function(A, s) {
    if (A == null)
      return A;
    if (!tc(A))
      return e(A, s);
    for (var r = A.length, n = -1, o = Object(A); ++n < r && s(o[n], n, o) !== !1; )
      ;
    return A;
  };
}
var fB = dB(IB);
function pB(e, t, A, s) {
  return fB(e, function(r, n, o) {
    t(s, r, A(r), o);
  }), s;
}
function wB(e, t) {
  return function(A, s) {
    var r = Bt(A) ? hB : pB, n = t ? t() : {};
    return r(A, e, QB(s), n);
  };
}
var Fc = wB(function(e, t, A) {
  e[A ? 0 : 1].push(t);
}, function() {
  return [[], []];
}), mn = nh("round"), yn, Tc;
function mB() {
  return Tc || (Tc = 1, yn = function(e, t) {
    if (typeof e != "string")
      throw new TypeError("Expected a string");
    for (var A = String(e), s = "", r = t ? !!t.extended : !1, n = t ? !!t.globstar : !1, o = !1, a = t && typeof t.flags == "string" ? t.flags : "", u, l = 0, i = A.length; l < i; l++)
      switch (u = A[l], u) {
        case "/":
        case "$":
        case "^":
        case "+":
        case ".":
        case "(":
        case ")":
        case "=":
        case "!":
        case "|":
          s += "\\" + u;
          break;
        case "?":
          if (r) {
            s += ".";
            break;
          }
        case "[":
        case "]":
          if (r) {
            s += u;
            break;
          }
        case "{":
          if (r) {
            o = !0, s += "(";
            break;
          }
        case "}":
          if (r) {
            o = !1, s += ")";
            break;
          }
        case ",":
          if (o) {
            s += "|";
            break;
          }
          s += "\\" + u;
          break;
        case "*":
          for (var c = A[l - 1], Q = 1; A[l + 1] === "*"; )
            Q++, l++;
          var h = A[l + 1];
          if (!n)
            s += ".*";
          else {
            var B = Q > 1 && (c === "/" || c === void 0) && (h === "/" || h === void 0);
            B ? (s += "((?:[^/]*(?:/|$))*)", l++) : s += "([^/]*)";
          }
          break;
        default:
          s += u;
      }
    return (!a || !~a.indexOf("g")) && (s = "^" + s + "$"), new RegExp(s, a);
  }), yn;
}
var yB = mB(), DB = /* @__PURE__ */ cg(yB);
function Sc(e, t) {
  if (!e)
    return [[], t];
  const A = DB(e, { extended: !0 });
  return Fc(t, (s) => A.test(s.path));
}
function bB(e) {
  if (!e)
    return;
  const t = new RegExp(e);
  return function(A) {
    return A.replace(t, (s, ...r) => {
      if (r = r.slice(0, -2).filter((n) => n != null), r.length) {
        for (let n = 0; n < r.length; n++) {
          const o = r[n] || "";
          s = s.replace(o, "*".repeat(o.length));
        }
        return s;
      }
      return "";
    });
  };
}
function Uc(e) {
  return e.length === 1 && e[0].property === "size" ? "" : ` (${e.map((t) => t.label).join(" / ")})`;
}
const Nc = {
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
function Mc(e) {
  return e.split(",").map((t) => t.trim()).filter((t) => Nc.hasOwnProperty(t)).map((t) => Nc[t]);
}
const Ct = (e, t) => e.map(({ property: A }) => t(A)).join(" / ");
function Lc(e, t, A) {
  e.sort((s, r) => r[t] - s[t] || s.path.localeCompare(r.path)), A === "asc" && e.reverse();
}
const RB = (e) => (e < 1e-3 ? e = mn(e, 4) : e < 0.01 ? e = mn(e, 3) : e = mn(e, 2), e.toLocaleString(void 0, {
  style: "percent",
  maximumSignificantDigits: 3
}));
function zA(e, t, A) {
  const s = e[A] - t[A];
  return {
    delta: s,
    percent: RB(s / t[A])
  };
}
function Gc(e, t) {
  return {
    size: zA(e, t, "size"),
    sizeGzip: zA(e, t, "sizeGzip"),
    sizeBrotli: zA(e, t, "sizeBrotli")
  };
}
function vc(e, t, A, s) {
  for (const r of A.files) {
    const n = s ? s(r.path) : r.path;
    e[n] || (e[n] = {
      path: r.path,
      label: r.label
    });
    const o = e[n];
    o[t] = r, o.head && o.base && (o.diff = Gc(o.head, o.base));
  }
}
function kB(e, t, {
  sortBy: A,
  sortOrder: s,
  hideFiles: r,
  ignoreThreshold: n = 100,
  stripHash: o
} = {}) {
  const a = {}, u = bB(o);
  vc(a, "head", e, u), vc(a, "base", t, u);
  const l = Object.values(a);
  Lc(l, A, s);
  const [i, c] = Sc(r, l), [Q, h] = Fc(
    c,
    (B) => B.diff && B.diff.size && Math.abs(B.diff.size.delta) < n
  );
  return {
    head: e,
    base: t,
    diff: {
      ...Gc(e, t),
      tarballSize: zA(e, t, "tarballSize")
    },
    files: {
      changed: h,
      unchanged: Q,
      hidden: i
    }
  };
}
const FB = (e) => e < 0 ? "\u2193" : e > 0 ? "\u2191" : "", EA = ({ delta: e, percent: t }) => e ? t + FB(e) : "", TB = 20;
function SB({
  headPkgData: e,
  basePkgData: t,
  sortBy: A,
  sortOrder: s,
  hideFiles: r,
  unchangedFiles: n,
  displaySize: o,
  ignoreThreshold: a,
  autoCollapse: u,
  stripHash: l
}) {
  const i = kB(e, t, {
    sortBy: A,
    sortOrder: s,
    hideFiles: r,
    ignoreThreshold: a,
    stripHash: l
  });
  qs("regressionData", i);
  const { changed: c, unchanged: Q, hidden: h } = i.files, B = Mc(o), d = Uc(B), y = [
    ...c,
    ...n === "show" ? Q : []
  ], b = (p) => [
    p.label,
    p.base && p.base.size ? Ct(B, (g) => et(tt(p.base[g]))) : "\u2014",
    p.head && p.head.size ? Ct(
      B,
      (g) => (p.base && p.base[g] ? JA(EA(p.diff[g])) : "") + et(tt(p.head[g]))
    ) : "\u2014"
  ], F = [
    [
      `${HA("Total")} ${n === "show" ? "" : Ma("_(Includes all files)_")}`,
      Ct(B, (p) => et(tt(i.base[p]))),
      Ct(B, (p) => JA(EA(i.diff[p])) + et(tt(i.head[p])))
    ],
    [
      HA("Tarball size"),
      et(tt(i.base.tarballSize)),
      JA(EA(i.diff.tarballSize)) + et(tt(i.head.tarballSize))
    ]
  ], M = u && y.length > TB;
  let L, N = "";
  if (M) {
    L = pt([
      ["File", `Before${d}`, `After${d}`],
      ...F
    ], {
      align: ["", "r", "r"]
    });
    const p = pt([
      ["File", `Before${d}`, `After${d}`],
      ...y.map(b)
    ], {
      align: ["", "r", "r"]
    });
    N = `<details><summary>Show files (${y.length} files)</summary>

${p}
</details>`;
  } else
    L = pt([
      ["File", `Before${d}`, `After${d}`],
      ...y.map(b),
      ...F
    ], {
      align: ["", "r", "r"]
    });
  let f = "";
  n === "collapse" && Q.length > 0 && (f = pt([
    ["File", `Size${d}`],
    ...Q.map((p) => [
      p.label,
      Ct(B, (g) => et(tt(p.base[g])))
    ])
  ], {
    align: ["", "r"]
  }), f = `<details><summary>Unchanged files</summary>

${f}
</details>`);
  let E = "";
  return h.length > 0 && (E = pt([
    ["File", `Before${d}`, `After${d}`],
    ...h.map((p) => [
      p.label,
      p.base && p.base.size ? Ct(B, (g) => et(tt(p.base[g]))) : "\u2014",
      p.head && p.head.size ? Ct(
        B,
        (g) => (p.base && p.base[g] ? JA(EA(p.diff[g])) : "") + et(tt(p.head[g]))
      ) : "\u2014"
    ])
  ], {
    align: ["", "r", "r"]
  }), E = `<details><summary>Hidden files</summary>

${E}
</details>`), wt`
	### 📊 Package size report&nbsp;&nbsp;&nbsp;<kbd>${EA(i.diff.size) || "No changes"}</kbd>

	${L}

	${N}

	${f}

	${E}
	`;
}
const UB = 20;
function NB({
  headPkgData: e,
  hideFiles: t,
  displaySize: A,
  sortBy: s,
  sortOrder: r,
  autoCollapse: n
}) {
  const o = Mc(A), a = Uc(o);
  Lc(e.files, s, r);
  const [u, l] = Sc(t, e.files), i = (y) => [
    y.label,
    Ct(o, (b) => et(tt(y[b])))
  ], c = [
    [
      HA("Total"),
      Ct(o, (y) => et(tt(e[y])))
    ],
    [
      HA("Tarball size"),
      et(tt(e.tarballSize))
    ]
  ], Q = n && l.length > UB;
  let h, B = "";
  if (Q) {
    h = pt([
      ["File", `Size${a}`],
      ...c
    ], {
      align: ["", "r"]
    });
    const y = pt([
      ["File", `Size${a}`],
      ...l.map(i)
    ], {
      align: ["", "r"]
    });
    B = `<details><summary>Show files (${l.length} files)</summary>

${y}
</details>`;
  } else
    h = pt([
      ["File", `Size${a}`],
      ...l.map(i),
      ...c
    ], {
      align: ["", "r"]
    });
  let d = "";
  return u.length > 0 && (d = pt([
    ["File", `Size${a}`],
    ...u.map((y) => [
      y.label,
      Ct(o, (b) => et(tt(y[b])))
    ])
  ], {
    align: ["", "r"]
  }), d = `<details><summary>Hidden files</summary>

${d}
</details>`), wt`
	### 📊 Package size report

	${h}

	${B}

	${d}
	`;
}
async function gt(e, t) {
  let A = "", s = "";
  const r = Date.now(), n = await cl(e, null, {
    ...t,
    silent: !0,
    listeners: {
      stdout(a) {
        A += a.toString();
      },
      stderr(a) {
        s += a.toString();
      }
    }
  }), o = Date.now() - r;
  return {
    exitCode: n,
    duration: o,
    stdout: A,
    stderr: s
  };
}
async function MB(e) {
  try {
    await gt(`git fetch origin ${e} --depth=1`);
  } catch (A) {
    throw new Error(`Failed to git fetch ${e} ${A.message}`);
  }
  const { exitCode: t } = await gt(`git diff --quiet origin/${e}`, { ignoreReturnCode: !0 });
  return t !== 0;
}
async function LB({ cwd: e } = {}) {
  dt.existsSync("node_modules") && (Xe("Cleaning node_modules"), await sl(kn.join(e, "node_modules")));
  const t = {
    cwd: e,
    ignoreReturnCode: !0
  };
  let A = "";
  dt.existsSync("package-lock.json") ? (Xe("Installing dependencies with npm"), A = "npm ci") : dt.existsSync("yarn.lock") ? (Xe("Installing dependencies with yarn"), A = "yarn install --frozen-lockfile") : dt.existsSync("pnpm-lock.yaml") ? (Xe("Installing dependencies with pnpm"), A = "npx pnpm i --frozen-lockfile") : (Xe("No lock file detected. Installing dependencies with npm"), A = "npm i");
  const { exitCode: s, stdout: r, stderr: n } = await gt(A, t);
  if (s > 0)
    throw new Error(`${n}
${r}`);
}
async function GB(e) {
  const { exitCode: t } = await gt(`git ls-files --error-unmatch ${e}`, { ignoreReturnCode: !0 });
  return t === 0;
}
let Yc = !1;
async function Jc({
  checkoutRef: e,
  refData: t,
  buildCommand: A
}) {
  const s = process.cwd();
  if (Xe(`Current working directory: ${s}`), e && (Xe(`Checking out ref '${e}'`), await gt(`git checkout -f ${e}`)), A !== "false") {
    if (!A) {
      let a;
      try {
        a = JSON.parse(dt.readFileSync("./package.json"));
      } catch (u) {
        zs("Error reading package.json", u);
      }
      a && a.scripts && a.scripts.build && (Xe("Build script found in package.json"), A = "npm run build");
    }
    if (A) {
      await LB({ cwd: s }).catch((u) => {
        throw new Error(`Failed to install dependencies:
${u.message}`);
      }), Xe(`Running build command: ${A}`);
      const a = Date.now();
      await gt(A, { cwd: s }).catch((u) => {
        throw new Error(`Failed to run build command: ${A}
${u.message}`);
      }), Xe(`Build completed in ${(Date.now() - a) / 1e3}s`);
    }
  }
  Yc || (Xe("Installing pkg-size globally"), await gt("npm i -g pkg-size"), Yc = !0), Xe("Getting package size");
  const r = await gt("pkg-size --json", { cwd: s }).catch((a) => {
    throw new Error(`Failed to determine package size: ${a.message}`);
  });
  ra(JSON.stringify(r, null, 4));
  const n = {
    ...JSON.parse(r.stdout),
    ref: t,
    size: 0,
    sizeGzip: 0,
    sizeBrotli: 0
  };
  await Promise.all(n.files.map(async (a) => {
    n.size += a.size, n.sizeGzip += a.sizeGzip, n.sizeBrotli += a.sizeBrotli;
    const u = await GB(a.path);
    a.isTracked = u, a.label = u ? Su(et(a.path), `${t.repo.html_url}/blob/${t.ref}/${a.path}`) : et(a.path);
  })), Xe("Cleaning up"), await gt("git reset --hard");
  const { stdout: o } = await gt("git clean -dfx");
  return ra(o), n;
}
async function vB({
  pr: e,
  buildCommand: t,
  commentReport: A,
  mode: s,
  unchangedFiles: r,
  hideFiles: n,
  sortBy: o,
  sortOrder: a,
  displaySize: u,
  ignoreThreshold: l,
  autoCollapse: i,
  stripHash: c
}) {
  LA("Build HEAD");
  const Q = await Jc({
    refData: e.head,
    buildCommand: t
  });
  if (qs("headPkgData", Q), GA(), s === "head-only")
    return A !== "false" ? NB({
      headPkgData: Q,
      displaySize: u,
      sortBy: o,
      sortOrder: a,
      hideFiles: n,
      autoCollapse: i
    }) : !1;
  const { ref: h } = e.base;
  let B;
  return await MB(h) ? (Xe("HEAD is different from BASE. Triggering build."), LA("Build BASE"), B = await Jc({
    checkoutRef: h,
    refData: e.base,
    buildCommand: t
  }), GA()) : (Xe("HEAD is identical to BASE. Skipping base build."), B = {
    ...Q,
    ref: e.base
  }), qs("basePkgData", B), A !== "false" ? SB({
    headPkgData: Q,
    basePkgData: B,
    displaySize: u,
    sortBy: o,
    sortOrder: a,
    hideFiles: n,
    unchangedFiles: r,
    ignoreThreshold: l,
    autoCollapse: i,
    stripHash: c
  }) : !1;
}
const Hc = Ma("\u{1F916} This report was automatically generated by [pkg-size-action](https://github.com/pkg-size/action/)");
(async () => {
  const { GITHUB_TOKEN: e } = process.env;
  Pc(e, 'Environment variable "GITHUB_TOKEN" not set. Required for accessing and reporting on the PR.');
  const { pull_request: t } = nn.payload, A = await vB({
    pr: t,
    buildCommand: ct("build-command"),
    commentReport: ct("comment-report"),
    mode: ct("mode") || "regression",
    unchangedFiles: ct("unchanged-files") || "collapse",
    hideFiles: ct("hide-files"),
    sortBy: ct("sort-by") || "delta",
    sortOrder: ct("sort-order") || "desc",
    displaySize: ct("display-size") || "uncompressed",
    ignoreThreshold: Number(ct("ignore-threshold") || 100),
    autoCollapse: ct("auto-collapse") !== "false",
    stripHash: (() => {
      const s = ct("strip-hash");
      return s === "false" ? "" : s || "[.-]([0-9a-zA-Z_-]{8,})[.-]";
    })()
  });
  await gt(`git checkout -f ${nn.sha}`), A && (t.head.repo && t.head.repo.full_name !== t.base.repo.full_name ? (LA("\u{1F4CB} Size Report (fork PR \u2014 copy to post as a comment)"), Xe(`${A}

${Hc}`), GA(), zs(
    `This PR is from a fork. GitHub Actions restricts write access for fork PRs, so the size report could not be posted as a comment automatically.
To share the report, copy the content from the "Size Report" group above and post it as a comment on the PR.`
  )) : await Uu({
    token: e,
    commentSignature: Hc,
    repo: nn.repo,
    prNumber: t.number,
    body: A
  }));
})().catch((e) => {
  gl(e.message), zs(e.stack);
});
