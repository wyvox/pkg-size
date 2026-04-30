"use strict";
var Vc = require("assert"), fA = require("os"), Wc = require("crypto"), dt = require("fs"), Fn = require("path"), Tn = require("http"), Sn = require("https");
require("net");
var qc = require("tls"), Un = require("events"), zc = require("util"), He = require("node:assert"), pA = require("node:net"), wA = require("node:http"), ot = require("node:stream"), ct = require("node:buffer"), rt = require("node:util"), Zc = require("node:querystring"), qt = require("node:events"), Kc = require("node:diagnostics_channel"), jc = require("node:tls"), $A = require("node:zlib"), Xc = require("node:perf_hooks"), Nn = require("node:util/types"), Mn = require("node:worker_threads"), $c = require("node:url"), zt = require("node:async_hooks"), eg = require("node:console"), tg = require("node:dns"), Ag = require("string_decoder"), rg = require("child_process"), sg = require("timers");
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
var Et = /* @__PURE__ */ vt(fA), ng = /* @__PURE__ */ vt(Wc), mA = /* @__PURE__ */ vt(dt), ft = /* @__PURE__ */ vt(Fn), Ln = /* @__PURE__ */ vt(Un), og = /* @__PURE__ */ vt(rg);
function Zt(e) {
  return e == null ? "" : typeof e == "string" || e instanceof String ? e : JSON.stringify(e);
}
function Gn(e) {
  return Object.keys(e).length ? {
    title: e.title,
    file: e.file,
    line: e.startLine,
    endLine: e.endLine,
    col: e.startColumn,
    endColumn: e.endColumn
  } : {};
}
function Kt(e, t, A) {
  const s = new ig(e, t, A);
  process.stdout.write(s.toString() + Et.EOL);
}
function vn(e, t = "") {
  Kt(e, {}, t);
}
const Yn = "::";
class ig {
  constructor(t, A, s) {
    t || (t = "missing.command"), this.command = t, this.properties = A, this.message = s;
  }
  toString() {
    let t = Yn + this.command;
    if (this.properties && Object.keys(this.properties).length > 0) {
      t += " ";
      let A = !0;
      for (const s in this.properties)
        if (this.properties.hasOwnProperty(s)) {
          const r = this.properties[s];
          r && (A ? A = !1 : t += ",", t += `${s}=${cg(r)}`);
        }
    }
    return t += `${Yn}${ag(this.message)}`, t;
  }
}
function ag(e) {
  return Zt(e).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
function cg(e) {
  return Zt(e).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
}
function gg(e, t) {
  const A = process.env[`GITHUB_${e}`];
  if (!A)
    throw new Error(`Unable to find environment variable for file command ${e}`);
  if (!mA.existsSync(A))
    throw new Error(`Missing file at path: ${A}`);
  mA.appendFileSync(A, `${Zt(t)}${Et.EOL}`, {
    encoding: "utf8"
  });
}
function lg(e, t) {
  const A = `ghadelimiter_${ng.randomUUID()}`, s = Zt(t);
  if (e.includes(A))
    throw new Error(`Unexpected input: name should not contain the delimiter "${A}"`);
  if (s.includes(A))
    throw new Error(`Unexpected input: value should not contain the delimiter "${A}"`);
  return `${e}<<${A}${Et.EOL}${s}${Et.EOL}${A}`;
}
var Jn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ug(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ft = {}, Hn;
function Eg() {
  if (Hn) return Ft;
  Hn = 1;
  var e = qc, t = Tn, A = Sn, s = Un, r = zc;
  Ft.httpOverHttp = n, Ft.httpsOverHttp = o, Ft.httpOverHttps = a, Ft.httpsOverHttps = u;
  function n(C) {
    var d = new l(C);
    return d.request = t.request, d;
  }
  function o(C) {
    var d = new l(C);
    return d.request = t.request, d.createSocket = i, d.defaultPort = 443, d;
  }
  function a(C) {
    var d = new l(C);
    return d.request = A.request, d;
  }
  function u(C) {
    var d = new l(C);
    return d.request = A.request, d.createSocket = i, d.defaultPort = 443, d;
  }
  function l(C) {
    var d = this;
    d.options = C || {}, d.proxyOptions = d.options.proxy || {}, d.maxSockets = d.options.maxSockets || t.Agent.defaultMaxSockets, d.requests = [], d.sockets = [], d.on("free", function(D, k, N, L) {
      for (var M = c(k, N, L), f = 0, B = d.requests.length; f < B; ++f) {
        var w = d.requests[f];
        if (w.host === M.host && w.port === M.port) {
          d.requests.splice(f, 1), w.request.onSocket(D);
          return;
        }
      }
      D.destroy(), d.removeSocket(D);
    });
  }
  r.inherits(l, s.EventEmitter), l.prototype.addRequest = function(d, y, D, k) {
    var N = this, L = Q({ request: d }, N.options, c(y, D, k));
    if (N.sockets.length >= this.maxSockets) {
      N.requests.push(L);
      return;
    }
    N.createSocket(L, function(M) {
      M.on("free", f), M.on("close", B), M.on("agentRemove", B), d.onSocket(M);
      function f() {
        N.emit("free", M, L);
      }
      function B(w) {
        N.removeSocket(M), M.removeListener("free", f), M.removeListener("close", B), M.removeListener("agentRemove", B);
      }
    });
  }, l.prototype.createSocket = function(d, y) {
    var D = this, k = {};
    D.sockets.push(k);
    var N = Q({}, D.proxyOptions, {
      method: "CONNECT",
      path: d.host + ":" + d.port,
      agent: !1,
      headers: {
        host: d.host + ":" + d.port
      }
    });
    d.localAddress && (N.localAddress = d.localAddress), N.proxyAuth && (N.headers = N.headers || {}, N.headers["Proxy-Authorization"] = "Basic " + new Buffer(N.proxyAuth).toString("base64")), h("making CONNECT request");
    var L = D.request(N);
    L.useChunkedEncodingByDefault = !1, L.once("response", M), L.once("upgrade", f), L.once("connect", B), L.once("error", w), L.end();
    function M(g) {
      g.upgrade = !0;
    }
    function f(g, E, p) {
      process.nextTick(function() {
        B(g, E, p);
      });
    }
    function B(g, E, p) {
      if (L.removeAllListeners(), E.removeAllListeners(), g.statusCode !== 200) {
        h(
          "tunneling socket could not be established, statusCode=%d",
          g.statusCode
        ), E.destroy();
        var I = new Error("tunneling socket could not be established, statusCode=" + g.statusCode);
        I.code = "ECONNRESET", d.request.emit("error", I), D.removeSocket(k);
        return;
      }
      if (p.length > 0) {
        h("got illegal response body from proxy"), E.destroy();
        var I = new Error("got illegal response body from proxy");
        I.code = "ECONNRESET", d.request.emit("error", I), D.removeSocket(k);
        return;
      }
      return h("tunneling connection has established"), D.sockets[D.sockets.indexOf(k)] = E, y(E);
    }
    function w(g) {
      L.removeAllListeners(), h(
        `tunneling socket could not be established, cause=%s
`,
        g.message,
        g.stack
      );
      var E = new Error("tunneling socket could not be established, cause=" + g.message);
      E.code = "ECONNRESET", d.request.emit("error", E), D.removeSocket(k);
    }
  }, l.prototype.removeSocket = function(d) {
    var y = this.sockets.indexOf(d);
    if (y !== -1) {
      this.sockets.splice(y, 1);
      var D = this.requests.shift();
      D && this.createSocket(D, function(k) {
        D.request.onSocket(k);
      });
    }
  };
  function i(C, d) {
    var y = this;
    l.prototype.createSocket.call(y, C, function(D) {
      var k = C.request.getHeader("host"), N = Q({}, y.options, {
        socket: D,
        servername: k ? k.replace(/:.*$/, "") : C.host
      }), L = e.connect(0, N);
      y.sockets[y.sockets.indexOf(D)] = L, d(L);
    });
  }
  function c(C, d, y) {
    return typeof C == "string" ? {
      host: C,
      port: d,
      localAddress: y
    } : C;
  }
  function Q(C) {
    for (var d = 1, y = arguments.length; d < y; ++d) {
      var D = arguments[d];
      if (typeof D == "object")
        for (var k = Object.keys(D), N = 0, L = k.length; N < L; ++N) {
          var M = k[N];
          D[M] !== void 0 && (C[M] = D[M]);
        }
    }
    return C;
  }
  var h;
  return process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG) ? h = function() {
    var C = Array.prototype.slice.call(arguments);
    typeof C[0] == "string" ? C[0] = "TUNNEL: " + C[0] : C.unshift("TUNNEL:"), console.error.apply(console, C);
  } : h = function() {
  }, Ft.debug = h, Ft;
}
var er, On;
function Pn() {
  return On || (On = 1, er = Eg()), er;
}
Pn();
var me = {}, tr, xn;
function Ve() {
  return xn || (xn = 1, tr = {
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
  }), tr;
}
var Ar, _n;
function Ye() {
  if (_n) return Ar;
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
  const C = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INVALID_RETURN_VALUE");
  class d extends t {
    constructor(J) {
      super(J), this.name = "InvalidReturnValueError", this.message = J || "Invalid Return Value Error", this.code = "UND_ERR_INVALID_RETURN_VALUE";
    }
    static [Symbol.hasInstance](J) {
      return J && J[C] === !0;
    }
    [C] = !0;
  }
  const y = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_ABORT");
  class D extends t {
    constructor(J) {
      super(J), this.name = "AbortError", this.message = J || "The operation was aborted", this.code = "UND_ERR_ABORT";
    }
    static [Symbol.hasInstance](J) {
      return J && J[y] === !0;
    }
    [y] = !0;
  }
  const k = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_ABORTED");
  class N extends D {
    constructor(J) {
      super(J), this.name = "AbortError", this.message = J || "Request aborted", this.code = "UND_ERR_ABORTED";
    }
    static [Symbol.hasInstance](J) {
      return J && J[k] === !0;
    }
    [k] = !0;
  }
  const L = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_INFO");
  class M extends t {
    constructor(J) {
      super(J), this.name = "InformationalError", this.message = J || "Request information", this.code = "UND_ERR_INFO";
    }
    static [Symbol.hasInstance](J) {
      return J && J[L] === !0;
    }
    [L] = !0;
  }
  const f = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_REQ_CONTENT_LENGTH_MISMATCH");
  class B extends t {
    constructor(J) {
      super(J), this.name = "RequestContentLengthMismatchError", this.message = J || "Request body length does not match content-length header", this.code = "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH";
    }
    static [Symbol.hasInstance](J) {
      return J && J[f] === !0;
    }
    [f] = !0;
  }
  const w = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_RES_CONTENT_LENGTH_MISMATCH");
  class g extends t {
    constructor(J) {
      super(J), this.name = "ResponseContentLengthMismatchError", this.message = J || "Response body length does not match content-length header", this.code = "UND_ERR_RES_CONTENT_LENGTH_MISMATCH";
    }
    static [Symbol.hasInstance](J) {
      return J && J[w] === !0;
    }
    [w] = !0;
  }
  const E = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_DESTROYED");
  class p extends t {
    constructor(J) {
      super(J), this.name = "ClientDestroyedError", this.message = J || "The client is destroyed", this.code = "UND_ERR_DESTROYED";
    }
    static [Symbol.hasInstance](J) {
      return J && J[E] === !0;
    }
    [E] = !0;
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
  const b = /* @__PURE__ */ Symbol.for("undici.error.UND_ERR_SOCKET");
  class U extends t {
    constructor(J, V) {
      super(J), this.name = "SocketError", this.message = J || "Socket error", this.code = "UND_ERR_SOCKET", this.socket = V;
    }
    static [Symbol.hasInstance](J) {
      return J && J[b] === !0;
    }
    [b] = !0;
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
  return Ar = {
    AbortError: D,
    HTTPParserError: ge,
    UndiciError: t,
    HeadersTimeoutError: n,
    HeadersOverflowError: a,
    BodyTimeoutError: l,
    RequestContentLengthMismatchError: B,
    ConnectTimeoutError: s,
    ResponseStatusCodeError: c,
    InvalidArgumentError: h,
    InvalidReturnValueError: d,
    RequestAbortedError: N,
    ClientDestroyedError: p,
    ClientClosedError: m,
    InformationalError: M,
    SocketError: U,
    NotSupportedError: G,
    ResponseContentLengthMismatchError: g,
    BalancedPoolMissingUpstreamError: $,
    ResponseExceededMaxSizeError: Be,
    RequestRetryError: Qe,
    ResponseError: we,
    SecureProxyConnectionError: W
  }, Ar;
}
var rr, Vn;
function sr() {
  if (Vn) return rr;
  Vn = 1;
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
  return Object.setPrototypeOf(e, null), rr = {
    wellknownHeaderNames: t,
    headerNameLowerCasedRecord: e
  }, rr;
}
var nr, Wn;
function Qg() {
  if (Wn) return nr;
  Wn = 1;
  const {
    wellknownHeaderNames: e,
    headerNameLowerCasedRecord: t
  } = sr();
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
  return nr = {
    TernarySearchTree: s,
    tree: r
  }, nr;
}
var or, qn;
function Ue() {
  if (qn) return or;
  qn = 1;
  const e = He, { kDestroyed: t, kBodyUsed: A, kListeners: s, kBody: r } = Ve(), { IncomingMessage: n } = wA, o = ot, a = pA, { Blob: u } = ct, l = rt, { stringify: i } = Zc, { EventEmitter: c } = qt, { InvalidArgumentError: Q } = Ye(), { headerNameLowerCasedRecord: h } = sr(), { tree: C } = Qg(), [d, y] = process.versions.node.split(".").map((R) => Number(R));
  class D {
    constructor(q) {
      this[r] = q, this[A] = !1;
    }
    async *[Symbol.asyncIterator]() {
      e(!this[A], "disturbed"), this[A] = !0, yield* this[r];
    }
  }
  function k(R) {
    return L(R) ? (S(R) === 0 && R.on("data", function() {
      e(!1);
    }), typeof R.readableDidRead != "boolean" && (R[A] = !1, c.prototype.on.call(R, "data", function() {
      this[A] = !0;
    })), R) : R && typeof R.pipeTo == "function" ? new D(R) : R && typeof R != "string" && !ArrayBuffer.isView(R) && U(R) ? new D(R) : R;
  }
  function N() {
  }
  function L(R) {
    return R && typeof R == "object" && typeof R.pipe == "function" && typeof R.on == "function";
  }
  function M(R) {
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
  function B(R) {
    const q = parseInt(R, 10);
    return q === Number(R) && q >= 0 && q <= 65535;
  }
  function w(R) {
    return R != null && R[0] === "h" && R[1] === "t" && R[2] === "t" && R[3] === "p" && (R[4] === ":" || R[4] === "s" && R[5] === ":");
  }
  function g(R) {
    if (typeof R == "string") {
      if (R = new URL(R), !w(R.origin || R.protocol))
        throw new Q("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      return R;
    }
    if (!R || typeof R != "object")
      throw new Q("Invalid URL: The URL argument must be a non-null object.");
    if (!(R instanceof URL)) {
      if (R.port != null && R.port !== "" && B(R.port) === !1)
        throw new Q("Invalid URL: port must be a valid integer or a string representation of an integer.");
      if (R.path != null && typeof R.path != "string")
        throw new Q("Invalid URL path: the path must be a string or null/undefined.");
      if (R.pathname != null && typeof R.pathname != "string")
        throw new Q("Invalid URL pathname: the pathname must be a string or null/undefined.");
      if (R.hostname != null && typeof R.hostname != "string")
        throw new Q("Invalid URL hostname: the hostname must be a string or null/undefined.");
      if (R.origin != null && typeof R.origin != "string")
        throw new Q("Invalid URL origin: the origin must be a string or null/undefined.");
      if (!w(R.origin || R.protocol))
        throw new Q("Invalid URL protocol: the URL must start with `http:` or `https:`.");
      const q = R.port != null ? R.port : R.protocol === "https:" ? 443 : 80;
      let ie = R.origin != null ? R.origin : `${R.protocol || ""}//${R.hostname || ""}:${q}`, ue = R.path != null ? R.path : `${R.pathname || ""}${R.search || ""}`;
      return ie[ie.length - 1] === "/" && (ie = ie.slice(0, ie.length - 1)), ue && ue[0] !== "/" && (ue = `/${ue}`), new URL(`${ie}${ue}`);
    }
    if (!w(R.origin || R.protocol))
      throw new Q("Invalid URL protocol: the URL must start with `http:` or `https:`.");
    return R;
  }
  function E(R) {
    if (R = g(R), R.pathname !== "/" || R.search || R.hash)
      throw new Q("invalid url");
    return R;
  }
  function p(R) {
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
    const q = p(R);
    return a.isIP(q) ? "" : q;
  }
  function m(R) {
    return JSON.parse(JSON.stringify(R));
  }
  function b(R) {
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
      if (M(R))
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
    return typeof R == "string" ? h[R] ?? R.toLowerCase() : C.lookup(R) ?? R.toString("latin1").toLowerCase();
  }
  function ae(R) {
    return C.lookup(R) ?? R.toString("latin1").toLowerCase();
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
  const xe = /* @__PURE__ */ Object.create(null);
  xe.enumerable = !0;
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
  return Object.setPrototypeOf(Je, null), Object.setPrototypeOf(j, null), or = {
    kEnumerableProperty: xe,
    nop: N,
    isDisturbed: we,
    isErrored: X,
    isReadable: W,
    toUSVString: le,
    isUSVString: oe,
    isBlobLike: M,
    parseOrigin: E,
    parseURL: g,
    getServerName: I,
    isStream: L,
    isIterable: U,
    isAsyncIterable: b,
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
    isValidPort: B,
    isHttpOrHttpsPrefixed: w,
    nodeMajor: d,
    nodeMinor: y,
    safeHTTPMethods: ["GET", "HEAD", "OPTIONS", "TRACE"],
    wrapRequestBody: k
  }, or;
}
var ir, zn;
function jt() {
  if (zn) return ir;
  zn = 1;
  const e = Kc, t = rt, A = t.debuglog("undici"), s = t.debuglog("fetch"), r = t.debuglog("websocket");
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
  return ir = {
    channels: o
  }, ir;
}
var ar, Zn;
function hg() {
  if (Zn) return ar;
  Zn = 1;
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
    normalizedMethodRecords: C
  } = Ue(), { channels: d } = jt(), { headerNameLowerCasedRecord: y } = sr(), D = /[^\u0021-\u00ff]/, k = /* @__PURE__ */ Symbol("handler");
  class N {
    constructor(f, {
      path: B,
      method: w,
      body: g,
      headers: E,
      query: p,
      idempotent: I,
      blocking: m,
      upgrade: b,
      headersTimeout: U,
      bodyTimeout: S,
      reset: G,
      throwOnError: v,
      expectContinue: $,
      servername: ne
    }, ge) {
      if (typeof B != "string")
        throw new e("path must be a string");
      if (B[0] !== "/" && !(B.startsWith("http://") || B.startsWith("https://")) && w !== "CONNECT")
        throw new e("path must be an absolute URL or start with a slash");
      if (D.test(B))
        throw new e("invalid request path");
      if (typeof w != "string")
        throw new e("method must be a string");
      if (C[w] === void 0 && !s(w))
        throw new e("invalid request method");
      if (b && typeof b != "string")
        throw new e("upgrade must be a string");
      if (U != null && (!Number.isFinite(U) || U < 0))
        throw new e("invalid headersTimeout");
      if (S != null && (!Number.isFinite(S) || S < 0))
        throw new e("invalid bodyTimeout");
      if (G != null && typeof G != "boolean")
        throw new e("invalid reset");
      if ($ != null && typeof $ != "boolean")
        throw new e("invalid expectContinue");
      if (this.headersTimeout = U, this.bodyTimeout = S, this.throwOnError = v === !0, this.method = w, this.abort = null, g == null)
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
      if (this.completed = !1, this.aborted = !1, this.upgrade = b || null, this.path = p ? c(B, p) : B, this.origin = f, this.idempotent = I ?? (w === "HEAD" || w === "GET"), this.blocking = m ?? !1, this.reset = G ?? null, this.host = null, this.contentLength = null, this.contentType = null, this.headers = [], this.expectContinue = $ ?? !1, Array.isArray(E)) {
        if (E.length % 2 !== 0)
          throw new e("headers array must be even");
        for (let ae = 0; ae < E.length; ae += 2)
          L(this, E[ae], E[ae + 1]);
      } else if (E && typeof E == "object")
        if (E[Symbol.iterator])
          for (const ae of E) {
            if (!Array.isArray(ae) || ae.length !== 2)
              throw new e("headers must be in key-value pair format");
            L(this, ae[0], ae[1]);
          }
        else {
          const ae = Object.keys(E);
          for (let Be = 0; Be < ae.length; ++Be)
            L(this, ae[Be], E[ae[Be]]);
        }
      else if (E != null)
        throw new e("headers must be an object or an array");
      Q(ge, w, b), this.servername = ne || h(this.host), this[k] = ge, d.create.hasSubscribers && d.create.publish({ request: this });
    }
    onBodySent(f) {
      if (this[k].onBodySent)
        try {
          return this[k].onBodySent(f);
        } catch (B) {
          this.abort(B);
        }
    }
    onRequestSent() {
      if (d.bodySent.hasSubscribers && d.bodySent.publish({ request: this }), this[k].onRequestSent)
        try {
          return this[k].onRequestSent();
        } catch (f) {
          this.abort(f);
        }
    }
    onConnect(f) {
      if (A(!this.aborted), A(!this.completed), this.error)
        f(this.error);
      else
        return this.abort = f, this[k].onConnect(f);
    }
    onResponseStarted() {
      return this[k].onResponseStarted?.();
    }
    onHeaders(f, B, w, g) {
      A(!this.aborted), A(!this.completed), d.headers.hasSubscribers && d.headers.publish({ request: this, response: { statusCode: f, headers: B, statusText: g } });
      try {
        return this[k].onHeaders(f, B, w, g);
      } catch (E) {
        this.abort(E);
      }
    }
    onData(f) {
      A(!this.aborted), A(!this.completed);
      try {
        return this[k].onData(f);
      } catch (B) {
        return this.abort(B), !1;
      }
    }
    onUpgrade(f, B, w) {
      return A(!this.aborted), A(!this.completed), this[k].onUpgrade(f, B, w);
    }
    onComplete(f) {
      this.onFinally(), A(!this.aborted), this.completed = !0, d.trailers.hasSubscribers && d.trailers.publish({ request: this, trailers: f });
      try {
        return this[k].onComplete(f);
      } catch (B) {
        this.onError(B);
      }
    }
    onError(f) {
      if (this.onFinally(), d.error.hasSubscribers && d.error.publish({ request: this, error: f }), !this.aborted)
        return this.aborted = !0, this[k].onError(f);
    }
    onFinally() {
      this.errorHandler && (this.body.off("error", this.errorHandler), this.errorHandler = null), this.endHandler && (this.body.off("end", this.endHandler), this.endHandler = null);
    }
    addHeader(f, B) {
      return L(this, f, B), this;
    }
  }
  function L(M, f, B) {
    if (B && typeof B == "object" && !Array.isArray(B))
      throw new e(`invalid ${f} header`);
    if (B === void 0)
      return;
    let w = y[f];
    if (w === void 0 && (w = f.toLowerCase(), y[w] === void 0 && !s(w)))
      throw new e("invalid header key");
    if (Array.isArray(B)) {
      const g = [];
      for (let E = 0; E < B.length; E++)
        if (typeof B[E] == "string") {
          if (!r(B[E]))
            throw new e(`invalid ${f} header`);
          g.push(B[E]);
        } else if (B[E] === null)
          g.push("");
        else {
          if (typeof B[E] == "object")
            throw new e(`invalid ${f} header`);
          g.push(`${B[E]}`);
        }
      B = g;
    } else if (typeof B == "string") {
      if (!r(B))
        throw new e(`invalid ${f} header`);
    } else B === null ? B = "" : B = `${B}`;
    if (M.host === null && w === "host") {
      if (typeof B != "string")
        throw new e("invalid host header");
      M.host = B;
    } else if (M.contentLength === null && w === "content-length") {
      if (M.contentLength = parseInt(B, 10), !Number.isFinite(M.contentLength))
        throw new e("invalid content-length header");
    } else if (M.contentType === null && w === "content-type")
      M.contentType = B, M.headers.push(f, B);
    else {
      if (w === "transfer-encoding" || w === "keep-alive" || w === "upgrade")
        throw new e(`invalid ${w} header`);
      if (w === "connection") {
        const g = typeof B == "string" ? B.toLowerCase() : null;
        if (g !== "close" && g !== "keep-alive")
          throw new e("invalid connection header");
        g === "close" && (M.reset = !0);
      } else {
        if (w === "expect")
          throw new t("expect header not supported");
        M.headers.push(f, B);
      }
    }
  }
  return ar = N, ar;
}
var cr, Kn;
function yA() {
  if (Kn) return cr;
  Kn = 1;
  const e = qt;
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
  return cr = t, cr;
}
var gr, jn;
function Xt() {
  if (jn) return gr;
  jn = 1;
  const e = yA(), {
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
        return new Promise((D, k) => {
          this.close((N, L) => N ? k(N) : D(L));
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
        const D = this[c];
        this[c] = null;
        for (let k = 0; k < D.length; k++)
          D[k](null, null);
      };
      this[n]().then(() => this.destroy()).then(() => {
        queueMicrotask(y);
      });
    }
    destroy(d, y) {
      if (typeof d == "function" && (y = d, d = null), y === void 0)
        return new Promise((k, N) => {
          this.destroy(d, (L, M) => L ? (
            /* istanbul ignore next: should never error */
            N(L)
          ) : k(M));
        });
      if (typeof y != "function")
        throw new s("invalid callback");
      if (this[a]) {
        this[i] ? this[i].push(y) : queueMicrotask(() => y(null, null));
        return;
      }
      d || (d = new t()), this[a] = !0, this[i] = this[i] || [], this[i].push(y);
      const D = () => {
        const k = this[i];
        this[i] = null;
        for (let N = 0; N < k.length; N++)
          k[N](null, null);
      };
      this[r](d).then(() => {
        queueMicrotask(D);
      });
    }
    [Q](d, y) {
      if (!this[l] || this[l].length === 0)
        return this[Q] = this[u], this[u](d, y);
      let D = this[u].bind(this);
      for (let k = this[l].length - 1; k >= 0; k--)
        D = this[l][k](D);
      return this[Q] = D, D(d, y);
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
      } catch (D) {
        if (typeof y.onError != "function")
          throw new s("invalid onError method");
        return y.onError(D), !1;
      }
    }
  }
  return gr = h, gr;
}
var lr, Xn;
function $n() {
  if (Xn) return lr;
  Xn = 1;
  let e = 0;
  const t = 1e3, A = (t >> 1) - 1;
  let s;
  const r = /* @__PURE__ */ Symbol("kFastTimer"), n = [], o = -2, a = -1, u = 0, l = 1;
  function i() {
    e += A;
    let h = 0, C = n.length;
    for (; h < C; ) {
      const d = n[h];
      d._state === u ? (d._idleStart = e - A, d._state = l) : d._state === l && e >= d._idleStart + d._idleTimeout && (d._state = a, d._idleStart = -1, d._onTimeout(d._timerArg)), d._state === a ? (d._state = o, --C !== 0 && (n[h] = n[C])) : ++h;
    }
    n.length = C, n.length !== 0 && c();
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
    constructor(C, d, y) {
      this._onTimeout = C, this._idleTimeout = d, this._timerArg = y, this.refresh();
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
  return lr = {
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
    setTimeout(h, C, d) {
      return C <= t ? setTimeout(h, C, d) : new Q(h, C, d);
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
    setFastTimeout(h, C, d) {
      return new Q(h, C, d);
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
  }, lr;
}
var ur, eo;
function DA() {
  if (eo) return ur;
  eo = 1;
  const e = pA, t = He, A = Ue(), { InvalidArgumentError: s, ConnectTimeoutError: r } = Ye(), n = $n();
  function o() {
  }
  let a, u;
  Jn.FinalizationRegistry && !(process.env.NODE_V8_COVERAGE || process.env.UNDICI_NO_FG) ? u = class {
    constructor(h) {
      this._maxCachedSessions = h, this._sessionCache = /* @__PURE__ */ new Map(), this._sessionRegistry = new Jn.FinalizationRegistry((C) => {
        if (this._sessionCache.size < this._maxCachedSessions)
          return;
        const d = this._sessionCache.get(C);
        d !== void 0 && d.deref() === void 0 && this._sessionCache.delete(C);
      });
    }
    get(h) {
      const C = this._sessionCache.get(h);
      return C ? C.deref() : null;
    }
    set(h, C) {
      this._maxCachedSessions !== 0 && (this._sessionCache.set(h, new WeakRef(C)), this._sessionRegistry.register(C, h));
    }
  } : u = class {
    constructor(h) {
      this._maxCachedSessions = h, this._sessionCache = /* @__PURE__ */ new Map();
    }
    get(h) {
      return this._sessionCache.get(h);
    }
    set(h, C) {
      if (this._maxCachedSessions !== 0) {
        if (this._sessionCache.size >= this._maxCachedSessions) {
          const { value: d } = this._sessionCache.keys().next();
          this._sessionCache.delete(d);
        }
        this._sessionCache.set(h, C);
      }
    }
  };
  function l({ allowH2: Q, maxCachedSessions: h, socketPath: C, timeout: d, session: y, ...D }) {
    if (h != null && (!Number.isInteger(h) || h < 0))
      throw new s("maxCachedSessions must be a positive integer or zero");
    const k = { path: C, ...D }, N = new u(h ?? 100);
    return d = d ?? 1e4, Q = Q ?? !1, function({ hostname: M, host: f, protocol: B, port: w, servername: g, localAddress: E, httpSocket: p }, I) {
      let m;
      if (B === "https:") {
        a || (a = jc), g = g || k.servername || A.getServerName(f) || null;
        const U = g || M;
        t(U);
        const S = y || N.get(U) || null;
        w = w || 443, m = a.connect({
          highWaterMark: 16384,
          // TLS in node can't have bigger HWM anyway...
          ...k,
          servername: g,
          session: S,
          localAddress: E,
          // TODO(HTTP/2): Add support for h2c
          ALPNProtocols: Q ? ["http/1.1", "h2"] : ["http/1.1"],
          socket: p,
          // upgrade socket connection
          port: w,
          host: M
        }), m.on("session", function(G) {
          N.set(U, G);
        });
      } else
        t(!p, "httpSocket can only be sent on TLS update"), w = w || 80, m = e.connect({
          highWaterMark: 64 * 1024,
          // Same as nodejs fs streams.
          ...k,
          localAddress: E,
          port: w,
          host: M
        });
      if (k.keepAlive == null || k.keepAlive) {
        const U = k.keepAliveInitialDelay === void 0 ? 6e4 : k.keepAliveInitialDelay;
        m.setKeepAlive(!0, U);
      }
      const b = i(new WeakRef(m), { timeout: d, hostname: M, port: w });
      return m.setNoDelay(!0).once(B === "https:" ? "secureConnect" : "connect", function() {
        if (queueMicrotask(b), I) {
          const U = I;
          I = null, U(null, this);
        }
      }).on("error", function(U) {
        if (queueMicrotask(b), I) {
          const S = I;
          I = null, S(U);
        }
      }), m;
    };
  }
  const i = process.platform === "win32" ? (Q, h) => {
    if (!h.timeout)
      return o;
    let C = null, d = null;
    const y = n.setFastTimeout(() => {
      C = setImmediate(() => {
        d = setImmediate(() => c(Q.deref(), h));
      });
    }, h.timeout);
    return () => {
      n.clearFastTimeout(y), clearImmediate(C), clearImmediate(d);
    };
  } : (Q, h) => {
    if (!h.timeout)
      return o;
    let C = null;
    const d = n.setFastTimeout(() => {
      C = setImmediate(() => {
        c(Q.deref(), h);
      });
    }, h.timeout);
    return () => {
      n.clearFastTimeout(d), clearImmediate(C);
    };
  };
  function c(Q, h) {
    if (Q == null)
      return;
    let C = "Connect Timeout Error";
    Array.isArray(Q.autoSelectFamilyAttemptedAddresses) ? C += ` (attempted addresses: ${Q.autoSelectFamilyAttemptedAddresses.join(", ")},` : C += ` (attempted address: ${h.hostname}:${h.port},`, C += ` timeout: ${h.timeout}ms)`, A.destroy(Q, new r(C));
  }
  return ur = l, ur;
}
var Er = {}, $t = {}, to;
function Bg() {
  if (to) return $t;
  to = 1, Object.defineProperty($t, "__esModule", { value: !0 }), $t.enumToMap = void 0;
  function e(t) {
    const A = {};
    return Object.keys(t).forEach((s) => {
      const r = t[s];
      typeof r == "number" && (A[s] = r);
    }), A;
  }
  return $t.enumToMap = e, $t;
}
var Ao;
function Cg() {
  return Ao || (Ao = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.SPECIAL_HEADERS = e.HEADER_STATE = e.MINOR = e.MAJOR = e.CONNECTION_TOKEN_CHARS = e.HEADER_CHARS = e.TOKEN = e.STRICT_TOKEN = e.HEX = e.URL_CHAR = e.STRICT_URL_CHAR = e.USERINFO_CHARS = e.MARK = e.ALPHANUM = e.NUM = e.HEX_MAP = e.NUM_MAP = e.ALPHA = e.FINISH = e.H_METHOD_MAP = e.METHOD_MAP = e.METHODS_RTSP = e.METHODS_ICE = e.METHODS_HTTP = e.METHODS = e.LENIENT_FLAGS = e.FLAGS = e.TYPE = e.ERROR = void 0;
    const t = Bg();
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
  })(Er)), Er;
}
var Qr, ro;
function so() {
  if (ro) return Qr;
  ro = 1;
  const { Buffer: e } = ct;
  return Qr = e.from("AGFzbQEAAAABJwdgAX8Bf2ADf39/AX9gAX8AYAJ/fwBgBH9/f38Bf2AAAGADf39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQAEA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAAy0sBQYAAAIAAAAAAAACAQIAAgICAAADAAAAAAMDAwMBAQEBAQEBAQEAAAIAAAAEBQFwARISBQMBAAIGCAF/AUGA1AQLB9EFIgZtZW1vcnkCAAtfaW5pdGlhbGl6ZQAIGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAtsbGh0dHBfaW5pdAAJGGxsaHR0cF9zaG91bGRfa2VlcF9hbGl2ZQAvDGxsaHR0cF9hbGxvYwALBm1hbGxvYwAxC2xsaHR0cF9mcmVlAAwEZnJlZQAMD2xsaHR0cF9nZXRfdHlwZQANFWxsaHR0cF9nZXRfaHR0cF9tYWpvcgAOFWxsaHR0cF9nZXRfaHR0cF9taW5vcgAPEWxsaHR0cF9nZXRfbWV0aG9kABAWbGxodHRwX2dldF9zdGF0dXNfY29kZQAREmxsaHR0cF9nZXRfdXBncmFkZQASDGxsaHR0cF9yZXNldAATDmxsaHR0cF9leGVjdXRlABQUbGxodHRwX3NldHRpbmdzX2luaXQAFQ1sbGh0dHBfZmluaXNoABYMbGxodHRwX3BhdXNlABcNbGxodHRwX3Jlc3VtZQAYG2xsaHR0cF9yZXN1bWVfYWZ0ZXJfdXBncmFkZQAZEGxsaHR0cF9nZXRfZXJybm8AGhdsbGh0dHBfZ2V0X2Vycm9yX3JlYXNvbgAbF2xsaHR0cF9zZXRfZXJyb3JfcmVhc29uABwUbGxodHRwX2dldF9lcnJvcl9wb3MAHRFsbGh0dHBfZXJybm9fbmFtZQAeEmxsaHR0cF9tZXRob2RfbmFtZQAfEmxsaHR0cF9zdGF0dXNfbmFtZQAgGmxsaHR0cF9zZXRfbGVu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PgtBhwEMPQtBiAEMPAtBiQEMOwtBigEMOgtBiwEMOQtBjAEMOAtBjQEMNwtBjgEMNgtBjwEMNQtBkAEMNAtBkQEMMwtBkgEMMgtBkwEMMQtBlAEMMAtBlQEMLwtBlgEMLgtBlwEMLQtBmAEMLAtBmQEMKwtBmgEMKgtBmwEMKQtBnAEMKAtBnQEMJwtBngEMJgtBnwEMJQtBoAEMJAtBoQEMIwtBogEMIgtBowEMIQtBpAEMIAtBpQEMHwtBpgEMHgtBpwEMHQtBqAEMHAtBqQEMGwtBqgEMGgtBqwEMGQtBrAEMGAtBrQEMFwtBrgEMFgtBAQwVC0GvAQwUC0GwAQwTC0GxAQwSC0GzAQwRC0GyAQwQC0G0AQwPC0G1AQwOC0G2AQwNC0G3AQwMC0G4AQwLC0G5AQwKC0G6AQwJC0G7AQwIC0HGAQwHC0G8AQwGC0G9AQwFC0G+AQwEC0G/AQwDC0HAAQwCC0HCAQwBC0HBAQshAwNAAkACQAJAAkACQAJAAkACQAJAIAICfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAgJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACfwJAAkACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAC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iQEhAwykAgtBASABLQAAQd8ARw1nGiABQQFqIQEMXgtBigEhAyABIARGDaICIAIoAgAiACAEIAFraiEFIAEgAGtBAWohBgNAIAEtAAAgAEGMzwBqLQAARw1kIABBAUYN+gEgAEEBaiEAIAQgAUEBaiIBRw0ACyACIAU2AgAMogILQYsBIQMgASAERg2hAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGOzwBqLQAARw1kIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyiAgsgAkEANgIAIAZBAWohAUECDGULQYwBIQMgASAERg2gAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHwzwBqLQAARw1jIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyhAgsgAkEANgIAIAZBAWohAUEfDGQLQY0BIQMgASAERg2fAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHyzwBqLQAARw1iIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAygAgsgAkEANgIAIAZBAWohAUEJDGMLIAEgBEYEQEGOASEDDJ8CCwJAAkAgAS0AAEHJAGsOBwBiYmJiYgFiCyABQQFqIQFB+AAhAwyGAgsgAUEBaiEBQfkAIQMMhQILQY8BIQMgASAERg2dAiACKAIAIgAgBCABa2ohBSABIABrQQVqIQYCQANAIAEtAAAgAEGRzwBqLQAARw1gIABBBUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyeAgsgAkEANgIAIAZBAWohAUEYDGELQZABIQMgASAERg2cAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGXzwBqLQAARw1fIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAydAgsgAkEANgIAIAZBAWohAUEXDGALQZEBIQMgASAERg2bAiACKAIAIgAgBCABa2ohBSABIABrQQZqIQYCQANAIAEtAAAgAEGazwBqLQAARw1eIABBBkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAycAgsgAkEANgIAIAZBAWohAUEV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JSIARQ0RIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMtAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0gIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMswELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0iIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMsgELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0OIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMsQELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0dIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMsAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0fIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMrwELIABBP0cNASABQQFqCyEBQQUhAwyUAQtBACEDIAJBADYCHCACIAE2AhQgAkH9EjYCECACQQc2AgwMrAELIAJBADYCHCACIAE2AhQgAkHcCDYCECACQQc2AgxBACEDDKsBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNByACQeUANgIcIAIgATYCFCACIAA2AgxBACEDDKoBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNFiACQdMANgIcIAIgATYCFCACIAA2AgxBACEDDKkBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNGCACQdIANgIcIAIgATYCFCACIAA2AgxBACEDDKgBCyACQQA2AhwgAiABNgIUIAJBxgo2AhAgAkEHNgIMQQAhAwynAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQMgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwymAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRIgAkHTADYCHCACIAE2AhQgAiAANgIMQQAhAwylAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRQgAkHSADYCHCACIAE2AhQgAiAANgIMQQAhAwykAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQAgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwyjAQtB1QAhAwyJAQsgAEEVRwRAIAJBADYCHCACIAE2AhQgAkG5DTYCECACQRo2AgxB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AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABB5ABrDvQDY2IAAWFhYWFhYQIDBAVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhBgcICQoLDA0OD2FhYWFhEGFhYWFhYWFhYWFhEWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYRITFBUWFxgZGhthYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2YTc4OTphYWFhYWFhYTthYWE8YWFhYT0+P2FhYWFhYWFhQGFhQWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYUJDREVGR0hJSktMTU5PUFFSU2FhYWFhYWFhVFVWV1hZWlthXF1hYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFeYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhX2BhC0HhJw8LQaQhDwtByywPC0H+MQ8LQcAkDwtBqyQPC0GNKA8LQeImDwtBgDAPC0G5Lw8LQdckDwtB7x8PC0HhHw8LQfofDwtB8iAPC0GoLw8LQa4yDwtBiDAPC0HsJw8LQYIiDwtBjh0PC0HQLg8LQcojDwtBxTIPC0HfHA8LQdIcDwtBxCAPC0HXIA8LQaIfDwtB7S4PC0GrMA8LQdQlDwtBzC4PC0H6Lg8LQfwrDwtB0jAPC0HxHQ8LQbsgDwtB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CABB3AgLii1JbnZhbGlkIGNoYXIgaW4gdXJsIHF1ZXJ5AFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fYm9keQBDb250ZW50LUxlbmd0aCBvdmVyZmxvdwBDaHVuayBzaXplIG92ZXJmbG93AFJlc3BvbnNlIG92ZXJmbG93AEludmFsaWQgbWV0aG9kIGZvciBIVFRQL3gueCByZXF1ZXN0AEludmFsaWQgbWV0aG9kIGZvciBSVFNQL3gueCByZXF1ZXN0AEV4cGVjdGVkIFNPVVJDRSBtZXRob2QgZm9yIElDRS94LnggcmVxdWVzdABJbnZhbGlkIGNoYXIgaW4gdXJsIGZyYWdtZW50IHN0YXJ0AEV4cGVjdGVkIGRvdABTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3N0YXR1cwBJbnZhbGlkIHJlc3BvbnNlIHN0YXR1cwBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zAFVzZXIgY2FsbGJhY2sgZXJyb3IAYG9uX3Jlc2V0YCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfaGVhZGVyYCBjYWxsYmFjayBlcnJvcgBgb25fbWVzc2FnZV9iZWdpbmAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3N0YXR1c19jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3ZlcnNpb25fY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl91cmxfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2hlYWRlcl92YWx1ZV9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX21lc3NhZ2VfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9tZXRob2RfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9oZWFkZXJfZmllbGRfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fbmFtZWAgY2FsbGJhY2sgZXJyb3IAVW5leHBlY3RlZCBjaGFyIGluIHVybCBzZXJ2ZXIASW52YWxpZCBoZWFkZXIgdmFsdWUgY2hhcgBJbnZhbGlkIGhlYWRlciBmaWVsZCBjaGFyAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fdmVyc2lvbgBJbnZhbGlkIG1pbm9yIHZlcnNpb24ASW52YWxpZCBtYWpvciB2ZXJzaW9uAEV4cGVjdGVkIHNwYWNlIGFmdGVyIHZlcnNpb24ARXhwZWN0ZWQgQ1JMRiBhZnRlciB2ZXJzaW9uAEludmFsaWQgSFRUUCB2ZXJzaW9uAEludmFsaWQgaGVhZGVyIHRva2VuAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fdXJsAEludmFsaWQgY2hhcmFjdGVycyBpbiB1cmwAVW5leHBlY3RlZCBzdGFydCBjaGFyIGluIHVybABEb3VibGUgQCBpbiB1cmwARW1wdHkgQ29udGVudC1MZW5ndGgASW52YWxpZCBjaGFyYWN0ZXIgaW4gQ29udGVudC1MZW5ndGgARHVwbGljYXRlIENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhciBpbiB1cmwgcGF0aABDb250ZW50LUxlbmd0aCBjYW4ndCBiZSBwcmVzZW50IHdpdGggVHJhbnNmZXItRW5jb2RpbmcASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgc2l6ZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2hlYWRlcl92YWx1ZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHZhbHVlAE1pc3NpbmcgZXhwZWN0ZWQgTEYgYWZ0ZXIgaGVhZGVyIHZhbHVlAEludmFsaWQgYFRyYW5zZmVyLUVuY29kaW5nYCBoZWFkZXIgdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZSB2YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHF1b3RlZCB2YWx1ZQBQYXVzZWQgYnkgb25faGVhZGVyc19jb21wbGV0ZQBJbnZhbGlkIEVPRiBzdGF0ZQBvbl9yZXNldCBwYXVzZQBvbl9jaHVua19oZWFkZXIgcGF1c2UAb25fbWVzc2FnZV9iZWdpbiBwYXVzZQBvbl9jaHVua19leHRlbnNpb25fdmFsdWUgcGF1c2UAb25fc3RhdHVzX2NvbXBsZXRlIHBhdXNlAG9uX3ZlcnNpb25fY29tcGxldGUgcGF1c2UAb25fdXJsX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2NvbXBsZXRlIHBhdXNlAG9uX2hlYWRlcl92YWx1ZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXNzYWdlX2NvbXBsZXRlIHBhdXNlAG9uX21ldGhvZF9jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfZmllbGRfY29tcGxldGUgcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX25hbWUgcGF1c2UAVW5leHBlY3RlZCBzcGFjZSBhZnRlciBzdGFydCBsaW5lAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fY2h1bmtfZXh0ZW5zaW9uX25hbWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBuYW1lAFBhdXNlIG9uIENPTk5FQ1QvVXBncmFkZQBQYXVzZSBvbiBQUkkvVXBncmFkZQBFeHBlY3RlZCBIVFRQLzIgQ29ubmVjdGlvbiBQcmVmYWNlAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fbWV0aG9kAEV4cGVjdGVkIHNwYWNlIGFmdGVyIG1ldGhvZABTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2hlYWRlcl9maWVsZABQYXVzZWQASW52YWxpZCB3b3JkIGVuY291bnRlcmVkAEludmFsaWQgbWV0aG9kIGVuY291bnRlcmVkAFVuZXhwZWN0ZWQgY2hhciBpbiB1cmwgc2NoZW1hAFJlcXVlc3QgaGFzIGludmFsaWQgYFRyYW5zZmVyLUVuY29kaW5nYABTV0lUQ0hfUFJPWFkAVVNFX1BST1hZAE1LQUNUSVZJVFkAVU5QUk9DRVNTQUJMRV9FTlRJVFkAQ09QWQBNT1ZFRF9QRVJNQU5FTlRMWQBUT09fRUFSTFkATk9USUZZAEZBSUxFRF9ERVBFTkRFTkNZAEJBRF9HQVRFV0FZAFBMQVkAUFVUAENIRUNLT1VUAEdBVEVXQVlfVElNRU9VVABSRVFVRVNUX1RJTUVPVVQATkVUV09SS19DT05ORUNUX1RJTUVPVVQAQ09OTkVDVElPTl9USU1FT1VUAExPR0lOX1RJTUVPVVQATkVUV09SS19SRUFEX1RJTUVPVVQAUE9TVABNSVNESVJFQ1RFRF9SRVFVRVNUAENMSUVOVF9DTE9TRURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX0xPQURfQkFMQU5DRURfUkVRVUVTVABCQURfUkVRVUVTVABIVFRQX1JFUVVFU1RfU0VOVF9UT19IVFRQU19QT1JUAFJFUE9SVABJTV9BX1RFQVBPVABSRVNFVF9DT05URU5UAE5PX0NPTlRFTlQAUEFSVElBTF9DT05URU5UAEhQRV9JTlZBTElEX0NPTlNUQU5UAEhQRV9DQl9SRVNFVABHRVQASFBFX1NUUklDVABDT05GTElDVABURU1QT1JBUllfUkVESVJFQ1QAUEVSTUFORU5UX1JFRElSRUNUAENPTk5FQ1QATVVMVElfU1RBVFVTAEhQRV9JTlZBTElEX1NUQVRVUwBUT09fTUFOWV9SRVFVRVNUUwBFQVJMWV9ISU5UUwBVTkFWQUlMQUJMRV9GT1JfTEVHQUxfUkVBU09OUwBPUFRJT05TAFNXSVRDSElOR19QUk9UT0NPTFMAVkFSSUFOVF9BTFNPX05FR09USUFURVMATVVMVElQTEVfQ0hPSUNFUwBJTlRFUk5BTF9TRVJWRVJfRVJST1IAV0VCX1NFUlZFUl9VTktOT1dOX0VSUk9SAFJBSUxHVU5fRVJST1IASURFTlRJVFlfUFJPVklERVJfQVVUSEVOVElDQVRJT05fRVJST1IAU1NMX0NFUlRJRklDQVRFX0VSUk9SAElOVkFMSURfWF9GT1JXQVJERURfRk9SAFNFVF9QQVJBTUVURVIAR0VUX1BBUkFNRVRFUgBIUEVfVVNFUgBTRUVfT1RIRVIASFBFX0NCX0NIVU5LX0hFQURFUgBNS0NBTEVOREFSAFNFVFVQAFdFQl9TRVJWRVJfSVNfRE9XTgBURUFSRE9XTgBIUEVfQ0xPU0VEX0NPTk5FQ1RJT04ASEVVUklTVElDX0VYUElSQVRJT04ARElTQ09OTkVDVEVEX09QRVJBVElPTgBOT05fQVVUSE9SSVRBVElWRV9JTkZPUk1BVElPTgBIUEVfSU5WQUxJRF9WRVJTSU9OAEhQRV9DQl9NRVNTQUdFX0JFR0lOAFNJVEVfSVNfRlJPWkVOAEhQRV9JTlZBTElEX0hFQURFUl9UT0tFTgBJTlZBTElEX1RPS0VOAEZPUkJJRERFTgBFTkhBTkNFX1lPVVJfQ0FMTQBIUEVfSU5WQUxJRF9VUkwAQkxPQ0tFRF9CWV9QQVJFTlRBTF9DT05UUk9MAE1LQ09MAEFDTABIUEVfSU5URVJOQUwAUkVRVUVTVF9IRUFERVJfRklFTERTX1RPT19MQVJHRV9VTk9GRklDSUFMAEhQRV9PSwBVTkxJTksAVU5MT0NLAFBSSQBSRVRSWV9XSVRIAEhQRV9JTlZBTElEX0NPTlRFTlRfTEVOR1RIAEhQRV9VTkVYUEVDVEVEX0NPTlRFTlRfTEVOR1RIAEZMVVNIAFBST1BQQVRDSABNLVNFQVJDSABVUklfVE9PX0xPTkcAUFJPQ0VTU0lORwBNSVNDRUxMQU5FT1VTX1BFUlNJU1RFTlRfV0FSTklORwBNSVNDRUxMQU5FT1VTX1dBUk5JTkcASFBFX0lOVkFMSURfVFJBTlNGRVJfRU5DT0RJTkcARXhwZWN0ZWQgQ1JMRgBIUEVfSU5WQUxJRF9DSFVOS19TSVpFAE1PVkUAQ09OVElOVUUASFBFX0NCX1NUQVRVU19DT01QTEVURQBIUEVfQ0JfSEVBREVSU19DT01QTEVURQBIUEVfQ0JfVkVSU0lPTl9DT01QTEVURQBIUEVfQ0JfVVJMX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19DT01QTEVURQBIUEVfQ0JfSEVBREVSX1ZBTFVFX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19FWFRFTlNJT05fVkFMVUVfQ09NUExFVEUASFBFX0NCX0NIVU5LX0VYVEVOU0lPTl9OQU1FX0NPTVBMRVRFAEhQRV9DQl9NRVNTQUdFX0NPTVBMRVRFAEhQRV9DQl9NRVRIT0RfQ09NUExFVEUASFBFX0NCX0hFQURFUl9GSUVMRF9DT01QTEVURQBERUxFVEUASFBFX0lOVkFMSURfRU9GX1NUQVRFAElOVkFMSURfU1NMX0NFUlRJRklDQVRFAFBBVVNFAE5PX1JFU1BPTlNFAFVOU1VQUE9SVEVEX01FRElBX1RZUEUAR09ORQBOT1RfQUNDRVBUQUJMRQBTRVJWSUNFX1VOQVZBSUxBQkxFAFJBTkdFX05PVF9TQVRJU0ZJQUJMRQBPUklHSU5fSVNfVU5SRUFDSEFCTEUAUkVTUE9OU0VfSVNfU1RBTEUAUFVSR0UATUVSR0UAUkVRVUVTVF9IRUFERVJfRklFTERTX1RPT19MQVJHRQBSRVFVRVNUX0hFQURFUl9UT09fTEFSR0UAUEFZTE9BRF9UT09fTEFSR0UASU5TVUZGSUNJRU5UX1NUT1JBR0UASFBFX1BBVVNFRF9VUEdSQURFAEhQRV9QQVVTRURfSDJfVVBHUkFERQBTT1VSQ0UAQU5OT1VOQ0UAVFJBQ0UASFBFX1VORVhQRUNURURfU1BBQ0UAREVTQ1JJQkUAVU5TVUJTQ1JJQkUAUkVDT1JEAEhQRV9JTlZBTElEX01FVEhPRABOT1RfRk9VTkQAUFJPUEZJTkQAVU5CSU5EAFJFQklORABVTkFVVEhPUklaRUQATUVUSE9EX05PVF9BTExPV0VEAEhUVFBfVkVSU0lPTl9OT1RfU1VQUE9SVEVEAEFMUkVBRFlfUkVQT1JURUQAQUNDRVBURUQATk9UX0lNUExFTUVOVEVEAExPT1BfREVURUNURUQASFBFX0NSX0VYUEVDVEVEAEhQRV9MRl9FWFBFQ1RFRABDUkVBVEVEAElNX1VTRUQASFBFX1BBVVNFRABUSU1FT1VUX09DQ1VSRUQAUEFZTUVOVF9SRVFVSVJFRABQUkVDT05ESVRJT05fUkVRVUlSRUQAUFJPWFlfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQATkVUV09SS19BVVRIRU5USUNBVElPTl9SRVFVSVJFRABMRU5HVEhfUkVRVUlSRUQAU1NMX0NFUlRJRklDQVRFX1JFUVVJUkVEAFVQR1JBREVfUkVRVUlSRUQAUEFHRV9FWFBJUkVEAFBSRUNPTkRJVElPTl9GQUlMRUQARVhQRUNUQVRJT05fRkFJTEVEAFJFVkFMSURBVElPTl9GQUlMRUQAU1NMX0hBTkRTSEFLRV9GQUlMRUQATE9DS0VEAFRSQU5TRk9STUFUSU9OX0FQUExJRUQATk9UX01PRElGSUVEAE5PVF9FWFRFTkRFRABCQU5EV0lEVEhfTElNSVRfRVhDRUVERUQAU0lURV9JU19PVkVSTE9BREVEAEhFQUQARXhwZWN0ZWQgSFRUUC8AAF4TAAAmEwAAMBAAAPAXAACdEwAAFRIAADkXAADwEgAAChAAAHUSAACtEgAAghMAAE8UAAB/EAAAoBUAACMUAACJEgAAixQAAE0VAADUEQAAzxQAABAYAADJFgAA3BYAAMERAADgFwAAuxQAAHQUAAB8FQAA5RQAAAgXAAAfEAAAZRUAAKMUAAAoFQAAAhUAAJkVAAAsEAAAixkAAE8PAADUDgAAahAAAM4QAAACFwAAiQ4AAG4TAAAcEwAAZhQAAFYXAADBEwAAzRMAAGwTAABoFwAAZhcAAF8XAAAiEwAAzg8AAGkOAADYDgAAYxYAAMsTAACqDgAAKBcAACYXAADFEwAAXRYAAOgRAABnEwAAZRMAAPIWAABzEwAAHRcAAPkWAADzEQAAzw4AAM4VAAAMEgAAsxEAAKURAABhEAAAMhcAALsTAEH5NQsBAQBBkDYL4AEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB/TcLAQEAQZE4C14CAwICAgICAAACAgACAgACAgICAgICAgICAAQAAAAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAEH9OQsBAQBBkToLXgIAAgICAgIAAAICAAICAAICAgICAgICAgIAAwAEAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAAIAQfA7Cw1sb3NlZWVwLWFsaXZlAEGJPAsBAQBBoDwL4AEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBBiT4LAQEAQaA+C+cBAQEBAQEBAQEBAQEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQFjaHVua2VkAEGwwAALXwEBAAEBAQEBAAABAQABAQABAQEBAQEBAQEBAAAAAAAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQABAEGQwgALIWVjdGlvbmVudC1sZW5ndGhvbnJveHktY29ubmVjdGlvbgBBwMIACy1yYW5zZmVyLWVuY29kaW5ncGdyYWRlDQoNCg0KU00NCg0KVFRQL0NFL1RTUC8AQfnCAAsFAQIAAQMAQZDDAAvgAQQBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAEH5xAALBQECAAEDAEGQxQAL4AEEAQEFAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB+cYACwQBAAABAEGRxwAL3wEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAEH6yAALBAEAAAIAQZDJAAtfAwQAAAQEBAQEBAQEBAQEBQQEBAQEBAQEBAQEBAAEAAYHBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQABAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAQAQfrKAAsEAQAAAQBBkMsACwEBAEGqywALQQIAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAEH6zAALBAEAAAEAQZDNAAsBAQBBms0ACwYCAAAAAAIAQbHNAAs6AwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBB8M4AC5YBTk9VTkNFRUNLT1VUTkVDVEVURUNSSUJFTFVTSEVURUFEU0VBUkNIUkdFQ1RJVklUWUxFTkRBUlZFT1RJRllQVElPTlNDSFNFQVlTVEFUQ0hHRU9SRElSRUNUT1JUUkNIUEFSQU1FVEVSVVJDRUJTQ1JJQkVBUkRPV05BQ0VJTkROS0NLVUJTQ1JJQkVIVFRQL0FEVFAv", "base64"), Qr;
}
var hr, no;
function Ig() {
  if (no) return hr;
  no = 1;
  const { Buffer: e } = ct;
  return hr = e.from("AGFzbQEAAAABJwdgAX8Bf2ADf39/AX9gAX8AYAJ/fwBgBH9/f38Bf2AAAGADf39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQAEA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAAy0sBQYAAAIAAAAAAAACAQIAAgICAAADAAAAAAMDAwMBAQEBAQEBAQEAAAIAAAAEBQFwARISBQMBAAIGCAF/AUGA1AQLB9EFIgZtZW1vcnkCAAtfaW5pdGlhbGl6ZQAIGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAtsbGh0dHBfaW5pdAAJGGxsaHR0cF9zaG91bGRfa2VlcF9hbGl2ZQAvDGxsaHR0cF9hbGxvYwALBm1hbGxvYwAxC2xsaHR0cF9mcmVlAAwEZnJlZQAMD2xsaHR0cF9nZXRfdHlwZQANFWxsaHR0cF9nZXRfaHR0cF9tYWpvcgAOFWxsaHR0cF9nZXRfaHR0cF9taW5vcgAPEWxsaHR0cF9nZXRfbWV0aG9kABAWbGxodHRwX2dldF9zdGF0dXNfY29kZQAREmxsaHR0cF9nZXRfdXBncmFkZQASDGxsaHR0cF9yZXNldAATDmxsaHR0cF9leGVjdXRlABQUbGxodHRwX3NldHRpbmdzX2luaXQAFQ1sbGh0dHBfZmluaXNoABYMbGxodHRwX3BhdXNlABcNbGxodHRwX3Jlc3VtZQAYG2xsaHR0cF9yZXN1bWVfYWZ0ZXJfdXBncmFkZQAZEGxsaHR0cF9nZXRfZXJybm8AGhdsbGh0dHBfZ2V0X2Vycm9yX3JlYXNvbgAbF2xsaHR0cF9zZXRfZXJyb3JfcmVhc29uABwUbGxodHRwX2dldF9lcnJvcl9wb3MAHRFsbGh0dHBfZXJybm9fbmFtZQAeEmxsaHR0cF9tZXRob2RfbmFtZQAfEmxsaHR0cF9zdGF0dXNfbmFtZQAgGmxsaHR0cF9zZXRfbGVu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PgtBhwEMPQtBiAEMPAtBiQEMOwtBigEMOgtBiwEMOQtBjAEMOAtBjQEMNwtBjgEMNgtBjwEMNQtBkAEMNAtBkQEMMwtBkgEMMgtBkwEMMQtBlAEMMAtBlQEMLwtBlgEMLgtBlwEMLQtBmAEMLAtBmQEMKwtBmgEMKgtBmwEMKQtBnAEMKAtBnQEMJwtBngEMJgtBnwEMJQtBoAEMJAtBoQEMIwtBogEMIgtBowEMIQtBpAEMIAtBpQEMHwtBpgEMHgtBpwEMHQtBqAEMHAtBqQEMGwtBqgEMGgtBqwEMGQtBrAEMGAtBrQEMFwtBrgEMFgtBAQwVC0GvAQwUC0GwAQwTC0GxAQwSC0GzAQwRC0GyAQwQC0G0AQwPC0G1AQwOC0G2AQwNC0G3AQwMC0G4AQwLC0G5AQwKC0G6AQwJC0G7AQwIC0HGAQwHC0G8AQwGC0G9AQwFC0G+AQwEC0G/AQwDC0HAAQwCC0HCAQwBC0HBAQshAwNAAkACQAJAAkACQAJAAkACQAJAIAICfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgAgJ/AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACfwJAAkACfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAC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iQEhAwykAgtBASABLQAAQd8ARw1nGiABQQFqIQEMXgtBigEhAyABIARGDaICIAIoAgAiACAEIAFraiEFIAEgAGtBAWohBgNAIAEtAAAgAEGMzwBqLQAARw1kIABBAUYN+gEgAEEBaiEAIAQgAUEBaiIBRw0ACyACIAU2AgAMogILQYsBIQMgASAERg2hAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGOzwBqLQAARw1kIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyiAgsgAkEANgIAIAZBAWohAUECDGULQYwBIQMgASAERg2gAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHwzwBqLQAARw1jIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyhAgsgAkEANgIAIAZBAWohAUEfDGQLQY0BIQMgASAERg2fAiACKAIAIgAgBCABa2ohBSABIABrQQFqIQYCQANAIAEtAAAgAEHyzwBqLQAARw1iIABBAUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAygAgsgAkEANgIAIAZBAWohAUEJDGMLIAEgBEYEQEGOASEDDJ8CCwJAAkAgAS0AAEHJAGsOBwBiYmJiYgFiCyABQQFqIQFB+AAhAwyGAgsgAUEBaiEBQfkAIQMMhQILQY8BIQMgASAERg2dAiACKAIAIgAgBCABa2ohBSABIABrQQVqIQYCQANAIAEtAAAgAEGRzwBqLQAARw1gIABBBUYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAyeAgsgAkEANgIAIAZBAWohAUEYDGELQZABIQMgASAERg2cAiACKAIAIgAgBCABa2ohBSABIABrQQJqIQYCQANAIAEtAAAgAEGXzwBqLQAARw1fIABBAkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAydAgsgAkEANgIAIAZBAWohAUEXDGALQZEBIQMgASAERg2bAiACKAIAIgAgBCABa2ohBSABIABrQQZqIQYCQANAIAEtAAAgAEGazwBqLQAARw1eIABBBkYNASAAQQFqIQAgBCABQQFqIgFHDQALIAIgBTYCAAycAgsgAkEANgIAIAZBAWohAUEV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JSIARQ0RIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMtAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0gIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMswELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0iIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMsgELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0OIAJB5QA2AhwgAiABNgIUIAIgADYCDEEAIQMMsQELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0dIAJB0wA2AhwgAiABNgIUIAIgADYCDEEAIQMMsAELIAIoAgQhACACQQA2AgQgAiAAIAEQJSIARQ0fIAJB0gA2AhwgAiABNgIUIAIgADYCDEEAIQMMrwELIABBP0cNASABQQFqCyEBQQUhAwyUAQtBACEDIAJBADYCHCACIAE2AhQgAkH9EjYCECACQQc2AgwMrAELIAJBADYCHCACIAE2AhQgAkHcCDYCECACQQc2AgxBACEDDKsBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNByACQeUANgIcIAIgATYCFCACIAA2AgxBACEDDKoBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNFiACQdMANgIcIAIgATYCFCACIAA2AgxBACEDDKkBCyACKAIEIQAgAkEANgIEIAIgACABECUiAEUNGCACQdIANgIcIAIgATYCFCACIAA2AgxBACEDDKgBCyACQQA2AhwgAiABNgIUIAJBxgo2AhAgAkEHNgIMQQAhAwynAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQMgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwymAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRIgAkHTADYCHCACIAE2AhQgAiAANgIMQQAhAwylAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDRQgAkHSADYCHCACIAE2AhQgAiAANgIMQQAhAwykAQsgAigCBCEAIAJBADYCBCACIAAgARAlIgBFDQAgAkHlADYCHCACIAE2AhQgAiAANgIMQQAhAwyjAQtB1QAhAwyJAQsgAEEVRwRAIAJBADYCHCACIAE2AhQgAkG5DTYCECACQRo2AgxB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AkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIABB5ABrDvQDY2IAAWFhYWFhYQIDBAVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhBgcICQoLDA0OD2FhYWFhEGFhYWFhYWFhYWFhEWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYRITFBUWFxgZGhthYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2YTc4OTphYWFhYWFhYTthYWE8YWFhYT0+P2FhYWFhYWFhQGFhQWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYUJDREVGR0hJSktMTU5PUFFSU2FhYWFhYWFhVFVWV1hZWlthXF1hYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFeYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhX2BhC0HhJw8LQaQhDwtByywPC0H+MQ8LQcAkDwtBqyQPC0GNKA8LQeImDwtBgDAPC0G5Lw8LQdckDwtB7x8PC0HhHw8LQfofDwtB8iAPC0GoLw8LQa4yDwtBiDAPC0HsJw8LQYIiDwtBjh0PC0HQLg8LQcojDwtBxTIPC0HfHA8LQdIcDwtBxCAPC0HXIA8LQaIfDwtB7S4PC0GrMA8LQdQlDwtBzC4PC0H6Lg8LQfwrDwtB0jAPC0HxHQ8LQbsgDwtB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AAADAEGUCAsFBAAAAAUAQaQICwkGAAAABwAAAAgAQdwIC4otSW52YWxpZCBjaGFyIGluIHVybCBxdWVyeQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2JvZHkAQ29udGVudC1MZW5ndGggb3ZlcmZsb3cAQ2h1bmsgc2l6ZSBvdmVyZmxvdwBSZXNwb25zZSBvdmVyZmxvdwBJbnZhbGlkIG1ldGhvZCBmb3IgSFRUUC94LnggcmVxdWVzdABJbnZhbGlkIG1ldGhvZCBmb3IgUlRTUC94LnggcmVxdWVzdABFeHBlY3RlZCBTT1VSQ0UgbWV0aG9kIGZvciBJQ0UveC54IHJlcXVlc3QASW52YWxpZCBjaGFyIGluIHVybCBmcmFnbWVudCBzdGFydABFeHBlY3RlZCBkb3QAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9zdGF0dXMASW52YWxpZCByZXNwb25zZSBzdGF0dXMASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucwBVc2VyIGNhbGxiYWNrIGVycm9yAGBvbl9yZXNldGAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2hlYWRlcmAgY2FsbGJhY2sgZXJyb3IAYG9uX21lc3NhZ2VfYmVnaW5gIGNhbGxiYWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fdmFsdWVgIGNhbGxiYWNrIGVycm9yAGBvbl9zdGF0dXNfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl92ZXJzaW9uX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fdXJsX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9tZXNzYWdlX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fbWV0aG9kX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfZXh0ZW5zaW9uX25hbWVgIGNhbGxiYWNrIGVycm9yAFVuZXhwZWN0ZWQgY2hhciBpbiB1cmwgc2VydmVyAEludmFsaWQgaGVhZGVyIHZhbHVlIGNoYXIASW52YWxpZCBoZWFkZXIgZmllbGQgY2hhcgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3ZlcnNpb24ASW52YWxpZCBtaW5vciB2ZXJzaW9uAEludmFsaWQgbWFqb3IgdmVyc2lvbgBFeHBlY3RlZCBzcGFjZSBhZnRlciB2ZXJzaW9uAEV4cGVjdGVkIENSTEYgYWZ0ZXIgdmVyc2lvbgBJbnZhbGlkIEhUVFAgdmVyc2lvbgBJbnZhbGlkIGhlYWRlciB0b2tlbgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3VybABJbnZhbGlkIGNoYXJhY3RlcnMgaW4gdXJsAFVuZXhwZWN0ZWQgc3RhcnQgY2hhciBpbiB1cmwARG91YmxlIEAgaW4gdXJsAEVtcHR5IENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhcmFjdGVyIGluIENvbnRlbnQtTGVuZ3RoAER1cGxpY2F0ZSBDb250ZW50LUxlbmd0aABJbnZhbGlkIGNoYXIgaW4gdXJsIHBhdGgAQ29udGVudC1MZW5ndGggY2FuJ3QgYmUgcHJlc2VudCB3aXRoIFRyYW5zZmVyLUVuY29kaW5nAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIHNpemUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfdmFsdWUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9jaHVua19leHRlbnNpb25fdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyB2YWx1ZQBNaXNzaW5nIGV4cGVjdGVkIExGIGFmdGVyIGhlYWRlciB2YWx1ZQBJbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AgaGVhZGVyIHZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgcXVvdGUgdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZWQgdmFsdWUAUGF1c2VkIGJ5IG9uX2hlYWRlcnNfY29tcGxldGUASW52YWxpZCBFT0Ygc3RhdGUAb25fcmVzZXQgcGF1c2UAb25fY2h1bmtfaGVhZGVyIHBhdXNlAG9uX21lc3NhZ2VfYmVnaW4gcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlIHBhdXNlAG9uX3N0YXR1c19jb21wbGV0ZSBwYXVzZQBvbl92ZXJzaW9uX2NvbXBsZXRlIHBhdXNlAG9uX3VybF9jb21wbGV0ZSBwYXVzZQBvbl9jaHVua19jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGUgcGF1c2UAb25fbWVzc2FnZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXRob2RfY29tcGxldGUgcGF1c2UAb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lIHBhdXNlAFVuZXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgc3RhcnQgbGluZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgbmFtZQBQYXVzZSBvbiBDT05ORUNUL1VwZ3JhZGUAUGF1c2Ugb24gUFJJL1VwZ3JhZGUARXhwZWN0ZWQgSFRUUC8yIENvbm5lY3Rpb24gUHJlZmFjZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX21ldGhvZABFeHBlY3RlZCBzcGFjZSBhZnRlciBtZXRob2QAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfZmllbGQAUGF1c2VkAEludmFsaWQgd29yZCBlbmNvdW50ZXJlZABJbnZhbGlkIG1ldGhvZCBlbmNvdW50ZXJlZABVbmV4cGVjdGVkIGNoYXIgaW4gdXJsIHNjaGVtYQBSZXF1ZXN0IGhhcyBpbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AAU1dJVENIX1BST1hZAFVTRV9QUk9YWQBNS0FDVElWSVRZAFVOUFJPQ0VTU0FCTEVfRU5USVRZAENPUFkATU9WRURfUEVSTUFORU5UTFkAVE9PX0VBUkxZAE5PVElGWQBGQUlMRURfREVQRU5ERU5DWQBCQURfR0FURVdBWQBQTEFZAFBVVABDSEVDS09VVABHQVRFV0FZX1RJTUVPVVQAUkVRVUVTVF9USU1FT1VUAE5FVFdPUktfQ09OTkVDVF9USU1FT1VUAENPTk5FQ1RJT05fVElNRU9VVABMT0dJTl9USU1FT1VUAE5FVFdPUktfUkVBRF9USU1FT1VUAFBPU1QATUlTRElSRUNURURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX1JFUVVFU1QAQ0xJRU5UX0NMT1NFRF9MT0FEX0JBTEFOQ0VEX1JFUVVFU1QAQkFEX1JFUVVFU1QASFRUUF9SRVFVRVNUX1NFTlRfVE9fSFRUUFNfUE9SVABSRVBPUlQASU1fQV9URUFQT1QAUkVTRVRfQ09OVEVOVABOT19DT05URU5UAFBBUlRJQUxfQ09OVEVOVABIUEVfSU5WQUxJRF9DT05TVEFOVABIUEVfQ0JfUkVTRVQAR0VUAEhQRV9TVFJJQ1QAQ09ORkxJQ1QAVEVNUE9SQVJZX1JFRElSRUNUAFBFUk1BTkVOVF9SRURJUkVDVABDT05ORUNUAE1VTFRJX1NUQVRVUwBIUEVfSU5WQUxJRF9TVEFUVVMAVE9PX01BTllfUkVRVUVTVFMARUFSTFlfSElOVFMAVU5BVkFJTEFCTEVfRk9SX0xFR0FMX1JFQVNPTlMAT1BUSU9OUwBTV0lUQ0hJTkdfUFJPVE9DT0xTAFZBUklBTlRfQUxTT19ORUdPVElBVEVTAE1VTFRJUExFX0NIT0lDRVMASU5URVJOQUxfU0VSVkVSX0VSUk9SAFdFQl9TRVJWRVJfVU5LTk9XTl9FUlJPUgBSQUlMR1VOX0VSUk9SAElERU5USVRZX1BST1ZJREVSX0FVVEhFTlRJQ0FUSU9OX0VSUk9SAFNTTF9DRVJUSUZJQ0FURV9FUlJPUgBJTlZBTElEX1hfRk9SV0FSREVEX0ZPUgBTRVRfUEFSQU1FVEVSAEdFVF9QQVJBTUVURVIASFBFX1VTRVIAU0VFX09USEVSAEhQRV9DQl9DSFVOS19IRUFERVIATUtDQUxFTkRBUgBTRVRVUABXRUJfU0VSVkVSX0lTX0RPV04AVEVBUkRPV04ASFBFX0NMT1NFRF9DT05ORUNUSU9OAEhFVVJJU1RJQ19FWFBJUkFUSU9OAERJU0NPTk5FQ1RFRF9PUEVSQVRJT04ATk9OX0FVVEhPUklUQVRJVkVfSU5GT1JNQVRJT04ASFBFX0lOVkFMSURfVkVSU0lPTgBIUEVfQ0JfTUVTU0FHRV9CRUdJTgBTSVRFX0lTX0ZST1pFTgBIUEVfSU5WQUxJRF9IRUFERVJfVE9LRU4ASU5WQUxJRF9UT0tFTgBGT1JCSURERU4ARU5IQU5DRV9ZT1VSX0NBTE0ASFBFX0lOVkFMSURfVVJMAEJMT0NLRURfQllfUEFSRU5UQUxfQ09OVFJPTABNS0NPTABBQ0wASFBFX0lOVEVSTkFMAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0VfVU5PRkZJQ0lBTABIUEVfT0sAVU5MSU5LAFVOTE9DSwBQUkkAUkVUUllfV0lUSABIUEVfSU5WQUxJRF9DT05URU5UX0xFTkdUSABIUEVfVU5FWFBFQ1RFRF9DT05URU5UX0xFTkdUSABGTFVTSABQUk9QUEFUQ0gATS1TRUFSQ0gAVVJJX1RPT19MT05HAFBST0NFU1NJTkcATUlTQ0VMTEFORU9VU19QRVJTSVNURU5UX1dBUk5JTkcATUlTQ0VMTEFORU9VU19XQVJOSU5HAEhQRV9JTlZBTElEX1RSQU5TRkVSX0VOQ09ESU5HAEV4cGVjdGVkIENSTEYASFBFX0lOVkFMSURfQ0hVTktfU0laRQBNT1ZFAENPTlRJTlVFAEhQRV9DQl9TVEFUVVNfQ09NUExFVEUASFBFX0NCX0hFQURFUlNfQ09NUExFVEUASFBFX0NCX1ZFUlNJT05fQ09NUExFVEUASFBFX0NCX1VSTF9DT01QTEVURQBIUEVfQ0JfQ0hVTktfQ09NUExFVEUASFBFX0NCX0hFQURFUl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX1ZBTFVFX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19FWFRFTlNJT05fTkFNRV9DT01QTEVURQBIUEVfQ0JfTUVTU0FHRV9DT01QTEVURQBIUEVfQ0JfTUVUSE9EX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfRklFTERfQ09NUExFVEUAREVMRVRFAEhQRV9JTlZBTElEX0VPRl9TVEFURQBJTlZBTElEX1NTTF9DRVJUSUZJQ0FURQBQQVVTRQBOT19SRVNQT05TRQBVTlNVUFBPUlRFRF9NRURJQV9UWVBFAEdPTkUATk9UX0FDQ0VQVEFCTEUAU0VSVklDRV9VTkFWQUlMQUJMRQBSQU5HRV9OT1RfU0FUSVNGSUFCTEUAT1JJR0lOX0lTX1VOUkVBQ0hBQkxFAFJFU1BPTlNFX0lTX1NUQUxFAFBVUkdFAE1FUkdFAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0UAUkVRVUVTVF9IRUFERVJfVE9PX0xBUkdFAFBBWUxPQURfVE9PX0xBUkdFAElOU1VGRklDSUVOVF9TVE9SQUdFAEhQRV9QQVVTRURfVVBHUkFERQBIUEVfUEFVU0VEX0gyX1VQR1JBREUAU09VUkNFAEFOTk9VTkNFAFRSQUNFAEhQRV9VTkVYUEVDVEVEX1NQQUNFAERFU0NSSUJFAFVOU1VCU0NSSUJFAFJFQ09SRABIUEVfSU5WQUxJRF9NRVRIT0QATk9UX0ZPVU5EAFBST1BGSU5EAFVOQklORABSRUJJTkQAVU5BVVRIT1JJWkVEAE1FVEhPRF9OT1RfQUxMT1dFRABIVFRQX1ZFUlNJT05fTk9UX1NVUFBPUlRFRABBTFJFQURZX1JFUE9SVEVEAEFDQ0VQVEVEAE5PVF9JTVBMRU1FTlRFRABMT09QX0RFVEVDVEVEAEhQRV9DUl9FWFBFQ1RFRABIUEVfTEZfRVhQRUNURUQAQ1JFQVRFRABJTV9VU0VEAEhQRV9QQVVTRUQAVElNRU9VVF9PQ0NVUkVEAFBBWU1FTlRfUkVRVUlSRUQAUFJFQ09ORElUSU9OX1JFUVVJUkVEAFBST1hZX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAE5FVFdPUktfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQATEVOR1RIX1JFUVVJUkVEAFNTTF9DRVJUSUZJQ0FURV9SRVFVSVJFRABVUEdSQURFX1JFUVVJUkVEAFBBR0VfRVhQSVJFRABQUkVDT05ESVRJT05fRkFJTEVEAEVYUEVDVEFUSU9OX0ZBSUxFRABSRVZBTElEQVRJT05fRkFJTEVEAFNTTF9IQU5EU0hBS0VfRkFJTEVEAExPQ0tFRABUUkFOU0ZPUk1BVElPTl9BUFBMSUVEAE5PVF9NT0RJRklFRABOT1RfRVhURU5ERUQAQkFORFdJRFRIX0xJTUlUX0VYQ0VFREVEAFNJVEVfSVNfT1ZFUkxPQURFRABIRUFEAEV4cGVjdGVkIEhUVFAvAABeEwAAJhMAADAQAADwFwAAnRMAABUSAAA5FwAA8BIAAAoQAAB1EgAArRIAAIITAABPFAAAfxAAAKAVAAAjFAAAiRIAAIsUAABNFQAA1BEAAM8UAAAQGAAAyRYAANwWAADBEQAA4BcAALsUAAB0FAAAfBUAAOUUAAAIFwAAHxAAAGUVAACjFAAAKBUAAAIVAACZFQAALBAAAIsZAABPDwAA1A4AAGoQAADOEAAAAhcAAIkOAABuEwAAHBMAAGYUAABWFwAAwRMAAM0TAABsEwAAaBcAAGYXAABfFwAAIhMAAM4PAABpDgAA2A4AAGMWAADLEwAAqg4AACgXAAAmFwAAxRMAAF0WAADoEQAAZxMAAGUTAADyFgAAcxMAAB0XAAD5FgAA8xEAAM8OAADOFQAADBIAALMRAAClEQAAYRAAADIXAAC7EwBB+TULAQEAQZA2C+ABAQECAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAQf03CwEBAEGROAteAgMCAgICAgAAAgIAAgIAAgICAgICAgICAgAEAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAAIAAgBB/TkLAQEAQZE6C14CAAICAgICAAACAgACAgACAgICAgICAgICAAMABAAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAEHwOwsNbG9zZWVlcC1hbGl2ZQBBiTwLAQEAQaA8C+ABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAQYk+CwEBAEGgPgvnAQEBAQEBAQEBAQEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBY2h1bmtlZABBsMAAC18BAQABAQEBAQAAAQEAAQEAAQEBAQEBAQEBAQAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQBBkMIACyFlY3Rpb25lbnQtbGVuZ3Rob25yb3h5LWNvbm5lY3Rpb24AQcDCAAstcmFuc2Zlci1lbmNvZGluZ3BncmFkZQ0KDQoNClNNDQoNClRUUC9DRS9UU1AvAEH5wgALBQECAAEDAEGQwwAL4AEEAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB+cQACwUBAgABAwBBkMUAC+ABBAEBBQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAQfnGAAsEAQAAAQBBkccAC98BAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQBB+sgACwQBAAACAEGQyQALXwMEAAAEBAQEBAQEBAQEBAUEBAQEBAQEBAQEBAQABAAGBwQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEAEH6ygALBAEAAAEAQZDLAAsBAQBBqssAC0ECAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBB+swACwQBAAABAEGQzQALAQEAQZrNAAsGAgAAAAACAEGxzQALOgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAQfDOAAuWAU5PVU5DRUVDS09VVE5FQ1RFVEVDUklCRUxVU0hFVEVBRFNFQVJDSFJHRUNUSVZJVFlMRU5EQVJWRU9USUZZUFRJT05TQ0hTRUFZU1RBVENIR0VPUkRJUkVDVE9SVFJDSFBBUkFNRVRFUlVSQ0VCU0NSSUJFQVJET1dOQUNFSU5ETktDS1VCU0NSSUJFSFRUUC9BRFRQLw==", "base64"), hr;
}
var Br, oo;
function bA() {
  if (oo) return Br;
  oo = 1;
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
  ), C = (
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
  ), D = (
    /** @type {const} */
    ["CONNECT", "TRACE", "TRACK"]
  ), k = new Set(D), N = (
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
  ), L = new Set(N);
  return Br = {
    subresource: N,
    forbiddenMethods: D,
    requestBodyHeader: d,
    referrerPolicy: a,
    requestRedirect: l,
    requestMode: Q,
    requestCredentials: h,
    requestCache: C,
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
    forbiddenMethodsSet: k,
    referrerPolicySet: u
  }, Br;
}
var Cr, io;
function ao() {
  if (io) return Cr;
  io = 1;
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
  return Cr = {
    getGlobalOrigin: t,
    setGlobalOrigin: A
  }, Cr;
}
var Ir, co;
function st() {
  if (co) return Ir;
  co = 1;
  const e = He, t = new TextEncoder(), A = /^[!#$%&'*+\-.^_|~A-Za-z0-9]+$/, s = /[\u000A\u000D\u0009\u0020]/, r = /[\u0009\u000A\u000C\u000D\u0020]/g, n = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
  function o(g) {
    e(g.protocol === "data:");
    let E = a(g, !0);
    E = E.slice(5);
    const p = { position: 0 };
    let I = l(
      ",",
      E,
      p
    );
    const m = I.length;
    if (I = M(I, !0, !0), p.position >= E.length)
      return "failure";
    p.position++;
    const b = E.slice(m + 1);
    let U = i(b);
    if (/;(\u0020){0,}base64$/i.test(I)) {
      const G = B(U);
      if (U = d(G), U === "failure")
        return "failure";
      I = I.slice(0, -6), I = I.replace(/(\u0020)+$/, ""), I = I.slice(0, -1);
    }
    I.startsWith(";") && (I = "text/plain" + I);
    let S = C(I);
    return S === "failure" && (S = C("text/plain;charset=US-ASCII")), { mimeType: S, body: U };
  }
  function a(g, E = !1) {
    if (!E)
      return g.href;
    const p = g.href, I = g.hash.length, m = I === 0 ? p : p.substring(0, p.length - I);
    return !I && p.endsWith("#") ? m.slice(0, -1) : m;
  }
  function u(g, E, p) {
    let I = "";
    for (; p.position < E.length && g(E[p.position]); )
      I += E[p.position], p.position++;
    return I;
  }
  function l(g, E, p) {
    const I = E.indexOf(g, p.position), m = p.position;
    return I === -1 ? (p.position = E.length, E.slice(m)) : (p.position = I, E.slice(m, p.position));
  }
  function i(g) {
    const E = t.encode(g);
    return h(E);
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
    const E = g.length, p = new Uint8Array(E);
    let I = 0;
    for (let m = 0; m < E; ++m) {
      const b = g[m];
      b !== 37 ? p[I++] = b : b === 37 && !(c(g[m + 1]) && c(g[m + 2])) ? p[I++] = 37 : (p[I++] = Q(g[m + 1]) << 4 | Q(g[m + 2]), m += 2);
    }
    return E === I ? p : p.subarray(0, I);
  }
  function C(g) {
    g = N(g, !0, !0);
    const E = { position: 0 }, p = l(
      "/",
      g,
      E
    );
    if (p.length === 0 || !A.test(p) || E.position > g.length)
      return "failure";
    E.position++;
    let I = l(
      ";",
      g,
      E
    );
    if (I = N(I, !1, !0), I.length === 0 || !A.test(I))
      return "failure";
    const m = p.toLowerCase(), b = I.toLowerCase(), U = {
      type: m,
      subtype: b,
      /** @type {Map<string, string>} */
      parameters: /* @__PURE__ */ new Map(),
      // https://mimesniff.spec.whatwg.org/#mime-type-essence
      essence: `${m}/${b}`
    };
    for (; E.position < g.length; ) {
      E.position++, u(
        // https://fetch.spec.whatwg.org/#http-whitespace
        (v) => s.test(v),
        g,
        E
      );
      let S = u(
        (v) => v !== ";" && v !== "=",
        g,
        E
      );
      if (S = S.toLowerCase(), E.position < g.length) {
        if (g[E.position] === ";")
          continue;
        E.position++;
      }
      if (E.position > g.length)
        break;
      let G = null;
      if (g[E.position] === '"')
        G = y(g, E, !0), l(
          ";",
          g,
          E
        );
      else if (G = l(
        ";",
        g,
        E
      ), G = N(G, !1, !0), G.length === 0)
        continue;
      S.length !== 0 && A.test(S) && (G.length === 0 || n.test(G)) && !U.parameters.has(S) && U.parameters.set(S, G);
    }
    return U;
  }
  function d(g) {
    g = g.replace(r, "");
    let E = g.length;
    if (E % 4 === 0 && g.charCodeAt(E - 1) === 61 && (--E, g.charCodeAt(E - 1) === 61 && --E), E % 4 === 1 || /[^+/0-9A-Za-z]/.test(g.length === E ? g : g.substring(0, E)))
      return "failure";
    const p = Buffer.from(g, "base64");
    return new Uint8Array(p.buffer, p.byteOffset, p.byteLength);
  }
  function y(g, E, p) {
    const I = E.position;
    let m = "";
    for (e(g[E.position] === '"'), E.position++; m += u(
      (U) => U !== '"' && U !== "\\",
      g,
      E
    ), !(E.position >= g.length); ) {
      const b = g[E.position];
      if (E.position++, b === "\\") {
        if (E.position >= g.length) {
          m += "\\";
          break;
        }
        m += g[E.position], E.position++;
      } else {
        e(b === '"');
        break;
      }
    }
    return p ? m : g.slice(I, E.position);
  }
  function D(g) {
    e(g !== "failure");
    const { parameters: E, essence: p } = g;
    let I = p;
    for (let [m, b] of E.entries())
      I += ";", I += m, I += "=", A.test(b) || (b = b.replace(/(\\|")/g, "\\$1"), b = '"' + b, b += '"'), I += b;
    return I;
  }
  function k(g) {
    return g === 13 || g === 10 || g === 9 || g === 32;
  }
  function N(g, E = !0, p = !0) {
    return f(g, E, p, k);
  }
  function L(g) {
    return g === 13 || g === 10 || g === 9 || g === 12 || g === 32;
  }
  function M(g, E = !0, p = !0) {
    return f(g, E, p, L);
  }
  function f(g, E, p, I) {
    let m = 0, b = g.length - 1;
    if (E)
      for (; m < g.length && I(g.charCodeAt(m)); ) m++;
    if (p)
      for (; b > 0 && I(g.charCodeAt(b)); ) b--;
    return m === 0 && b === g.length - 1 ? g : g.slice(m, b + 1);
  }
  function B(g) {
    const E = g.length;
    if (65535 > E)
      return String.fromCharCode.apply(null, g);
    let p = "", I = 0, m = 65535;
    for (; I < E; )
      I + m > E && (m = E - I), p += String.fromCharCode.apply(null, g.subarray(I, I += m));
    return p;
  }
  function w(g) {
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
  return Ir = {
    dataURLProcessor: o,
    URLSerializer: a,
    collectASequenceOfCodePoints: u,
    collectASequenceOfCodePointsFast: l,
    stringPercentDecode: i,
    parseMIMEType: C,
    collectAnHTTPQuotedString: y,
    serializeAMimeType: D,
    removeChars: f,
    removeHTTPWhitespace: N,
    minimizeSupportedMimeType: w,
    HTTP_TOKEN_CODEPOINTS: A,
    isomorphicDecode: B
  }, Ir;
}
var dr, go;
function $e() {
  if (go) return dr;
  go = 1;
  const { types: e, inspect: t } = rt, { markAsUncloneable: A } = Mn, { toUSVString: s } = Ue(), r = {};
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
        const { done: h, value: C } = i.next();
        if (h)
          break;
        c.push(n(C, a, `${u}[${Q++}]`));
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
          const C = n(h, u, l), d = o(a[h], u, l);
          i[C] = d;
        }
        return i;
      }
      const c = Reflect.ownKeys(a);
      for (const Q of c)
        if (Reflect.getOwnPropertyDescriptor(a, Q)?.enumerable) {
          const C = n(Q, u, l), d = o(a[Q], u, l);
          i[C] = d;
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
        const { key: Q, defaultValue: h, required: C, converter: d } = c;
        if (C === !0 && !Object.hasOwn(o, Q))
          throw r.errors.exception({
            header: a,
            message: `Missing required key "${Q}".`
          });
        let y = o[Q];
        const D = Object.hasOwn(c, "defaultValue");
        if (D && y !== null && (y ??= h()), C || D || y !== void 0) {
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
  ), dr = {
    webidl: r
  }, dr;
}
var fr, lo;
function it() {
  if (lo) return fr;
  lo = 1;
  const { Transform: e } = ot, t = $A, { redirectStatusSet: A, referrerPolicySet: s, badPortsSet: r } = bA(), { getGlobalOrigin: n } = ao(), { collectASequenceOfCodePoints: o, collectAnHTTPQuotedString: a, removeChars: u, parseMIMEType: l } = st(), { performance: i } = Xc, { isBlobLike: c, ReadableStreamFrom: Q, isValidHTTPToken: h, normalizedMethodRecordsBase: C } = Ue(), d = He, { isUint8Array: y } = Nn, { webidl: D } = $e();
  let k = [], N;
  try {
    N = require("node:crypto");
    const T = ["sha256", "sha384", "sha512"];
    k = N.getHashes().filter((_) => T.includes(_));
  } catch {
  }
  function L(T) {
    const _ = T.urlList, F = _.length;
    return F === 0 ? null : _[F - 1].toString();
  }
  function M(T, _) {
    if (!A.has(T.status))
      return null;
    let F = T.headersList.get("location", !0);
    return F !== null && m(F) && (f(F) || (F = B(F)), F = new URL(F, L(T))), F && !F.hash && (F.hash = _), F;
  }
  function f(T) {
    for (let _ = 0; _ < T.length; ++_) {
      const F = T.charCodeAt(_);
      if (F > 126 || // Non-US-ASCII + DEL
      F < 32)
        return !1;
    }
    return !0;
  }
  function B(T) {
    return Buffer.from(T, "binary").toString("utf8");
  }
  function w(T) {
    return T.urlList[T.urlList.length - 1];
  }
  function g(T) {
    const _ = w(T);
    return Ce(_) && r.has(_.port) ? "blocked" : "allowed";
  }
  function E(T) {
    return T instanceof Error || T?.constructor?.name === "Error" || T?.constructor?.name === "DOMException";
  }
  function p(T) {
    for (let _ = 0; _ < T.length; ++_) {
      const F = T.charCodeAt(_);
      if (!(F === 9 || // HTAB
      F >= 32 && F <= 126 || // SP / VCHAR
      F >= 128 && F <= 255))
        return !1;
    }
    return !0;
  }
  const I = h;
  function m(T) {
    return (T[0] === "	" || T[0] === " " || T[T.length - 1] === "	" || T[T.length - 1] === " " || T.includes(`
`) || T.includes("\r") || T.includes("\0")) === !1;
  }
  function b(T, _) {
    const { headersList: F } = _, O = (F.get("referrer-policy", !0) ?? "").split(",");
    let H = "";
    if (O.length > 0)
      for (let x = O.length; x !== 0; x--) {
        const Ae = O[x - 1].trim();
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
    let _ = null;
    _ = T.mode, T.headersList.set("sec-fetch-mode", _, !0);
  }
  function $(T) {
    let _ = T.origin;
    if (!(_ === "client" || _ === void 0)) {
      if (T.responseTainting === "cors" || T.mode === "websocket")
        T.headersList.append("origin", _, !0);
      else if (T.method !== "GET" && T.method !== "HEAD") {
        switch (T.referrerPolicy) {
          case "no-referrer":
            _ = null;
            break;
          case "no-referrer-when-downgrade":
          case "strict-origin":
          case "strict-origin-when-cross-origin":
            T.origin && ue(T.origin) && !ue(w(T)) && (_ = null);
            break;
          case "same-origin":
            le(T, w(T)) || (_ = null);
            break;
        }
        T.headersList.append("origin", _, !0);
      }
    }
  }
  function ne(T, _) {
    return T;
  }
  function ge(T, _, F) {
    return !T?.startTime || T.startTime < _ ? {
      domainLookupStartTime: _,
      domainLookupEndTime: _,
      connectionStartTime: _,
      connectionEndTime: _,
      secureConnectionStartTime: _,
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
    const _ = T.referrerPolicy;
    d(_);
    let F = null;
    if (T.referrer === "client") {
      const z = n();
      if (!z || z.origin === "null")
        return "no-referrer";
      F = new URL(z);
    } else T.referrer instanceof URL && (F = T.referrer);
    let O = we(F);
    const H = we(F, !0);
    O.toString().length > 4096 && (O = H);
    const x = le(T, O), Ae = X(O) && !X(T.url);
    switch (_) {
      case "origin":
        return H ?? we(F, !0);
      case "unsafe-url":
        return O;
      case "same-origin":
        return x ? H : "no-referrer";
      case "origin-when-cross-origin":
        return x ? O : H;
      case "strict-origin-when-cross-origin": {
        const z = w(T);
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
  function we(T, _) {
    return d(T instanceof URL), T = new URL(T), T.protocol === "file:" || T.protocol === "about:" || T.protocol === "blank:" ? "no-referrer" : (T.username = "", T.password = "", T.hash = "", _ && (T.pathname = "", T.search = ""), T);
  }
  function X(T) {
    if (!(T instanceof URL))
      return !1;
    if (T.href === "about:blank" || T.href === "about:srcdoc" || T.protocol === "data:" || T.protocol === "file:") return !0;
    return _(T.origin);
    function _(F) {
      if (F == null || F === "null") return !1;
      const O = new URL(F);
      return !!(O.protocol === "https:" || O.protocol === "wss:" || /^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(O.hostname) || O.hostname === "localhost" || O.hostname.includes("localhost.") || O.hostname.endsWith(".localhost"));
    }
  }
  function W(T, _) {
    if (N === void 0)
      return !0;
    const F = J(_);
    if (F === "no metadata" || F.length === 0)
      return !0;
    const O = V(F), H = P(F, O);
    for (const x of H) {
      const Ae = x.algo, z = x.hash;
      let ce = N.createHash(Ae).update(T).digest("base64");
      if (ce[ce.length - 1] === "=" && (ce[ce.length - 2] === "=" ? ce = ce.slice(0, -2) : ce = ce.slice(0, -1)), Z(ce, z))
        return !0;
    }
    return !1;
  }
  const re = /(?<algo>sha256|sha384|sha512)-((?<hash>[A-Za-z0-9+/]+|[A-Za-z0-9_-]+)={0,2}(?:\s|$)( +[!-~]*)?)?/i;
  function J(T) {
    const _ = [];
    let F = !0;
    for (const O of T.split(" ")) {
      F = !1;
      const H = re.exec(O);
      if (H === null || H.groups === void 0 || H.groups.algo === void 0)
        continue;
      const x = H.groups.algo.toLowerCase();
      k.includes(x) && _.push(H.groups);
    }
    return F === !0 ? "no metadata" : _;
  }
  function V(T) {
    let _ = T[0].algo;
    if (_[3] === "5")
      return _;
    for (let F = 1; F < T.length; ++F) {
      const O = T[F];
      if (O.algo[3] === "5") {
        _ = "sha512";
        break;
      } else {
        if (_[3] === "3")
          continue;
        O.algo[3] === "3" && (_ = "sha384");
      }
    }
    return _;
  }
  function P(T, _) {
    if (T.length === 1)
      return T;
    let F = 0;
    for (let O = 0; O < T.length; ++O)
      T[O].algo === _ && (T[F++] = T[O]);
    return T.length = F, T;
  }
  function Z(T, _) {
    if (T.length !== _.length)
      return !1;
    for (let F = 0; F < T.length; ++F)
      if (T[F] !== _[F]) {
        if (T[F] === "+" && _[F] === "-" || T[F] === "/" && _[F] === "_")
          continue;
        return !1;
      }
    return !0;
  }
  function se(T) {
  }
  function le(T, _) {
    return T.origin === _.origin && T.origin === "null" || T.protocol === _.protocol && T.hostname === _.hostname && T.port === _.port;
  }
  function oe() {
    let T, _;
    return { promise: new Promise((O, H) => {
      T = O, _ = H;
    }), resolve: T, reject: _ };
  }
  function fe(T) {
    return T.controller.state === "aborted";
  }
  function Me(T) {
    return T.controller.state === "aborted" || T.controller.state === "terminated";
  }
  function pe(T) {
    return C[T.toLowerCase()] ?? T;
  }
  function Le(T) {
    const _ = JSON.stringify(T);
    if (_ === void 0)
      throw new TypeError("Value is not JSON serializable");
    return d(typeof _ == "string"), _;
  }
  const Re = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));
  function ke(T, _, F = 0, O = 1) {
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
        const Ae = this.#s, z = this.#e[_], ce = z.length;
        if (Ae >= ce)
          return {
            value: void 0,
            done: !0
          };
        const { [F]: Fe, [O]: Ge } = z[Ae];
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
    }), function(x, Ae) {
      return new H(x, Ae);
    };
  }
  function de(T, _, F, O = 0, H = 1) {
    const x = ke(T, F, O, H), Ae = {
      keys: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function() {
          return D.brandCheck(this, _), x(this, "key");
        }
      },
      values: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function() {
          return D.brandCheck(this, _), x(this, "value");
        }
      },
      entries: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function() {
          return D.brandCheck(this, _), x(this, "key+value");
        }
      },
      forEach: {
        writable: !0,
        enumerable: !0,
        configurable: !0,
        value: function(ce, Fe = globalThis) {
          if (D.brandCheck(this, _), D.argumentLengthCheck(arguments, 1, `${T}.forEach`), typeof ce != "function")
            throw new TypeError(
              `Failed to execute 'forEach' on '${T}': parameter 1 is not of type 'Function'.`
            );
          for (const { 0: Ge, 1: Ne } of x(this, "key+value"))
            ce.call(Fe, Ne, Ge, this);
        }
      }
    };
    return Object.defineProperties(_.prototype, {
      ...Ae,
      [Symbol.iterator]: {
        writable: !0,
        enumerable: !1,
        configurable: !0,
        value: Ae.entries.value
      }
    });
  }
  async function We(T, _, F) {
    const O = _, H = F;
    let x;
    try {
      x = T.stream.getReader();
    } catch (Ae) {
      H(Ae);
      return;
    }
    try {
      O(await q(x));
    } catch (Ae) {
      H(Ae);
    }
  }
  function xe(T) {
    return T instanceof ReadableStream || T[Symbol.toStringTag] === "ReadableStream" && typeof T.tee == "function";
  }
  function Je(T) {
    try {
      T.close(), T.byobRequest?.respond(0);
    } catch (_) {
      if (!_.message.includes("Controller is already closed") && !_.message.includes("ReadableStream is already closed"))
        throw _;
    }
  }
  const j = /[^\x00-\xFF]/;
  function R(T) {
    return d(!j.test(T)), T;
  }
  async function q(T) {
    const _ = [];
    let F = 0;
    for (; ; ) {
      const { done: O, value: H } = await T.read();
      if (O)
        return Buffer.concat(_, F);
      if (!y(H))
        throw new TypeError("Received non-Uint8Array chunk");
      _.push(H), F += H.length;
    }
  }
  function ie(T) {
    d("protocol" in T);
    const _ = T.protocol;
    return _ === "about:" || _ === "blob:" || _ === "data:";
  }
  function ue(T) {
    return typeof T == "string" && T[5] === ":" && T[0] === "h" && T[1] === "t" && T[2] === "t" && T[3] === "p" && T[4] === "s" || T.protocol === "https:";
  }
  function Ce(T) {
    d("protocol" in T);
    const _ = T.protocol;
    return _ === "http:" || _ === "https:";
  }
  function De(T, _) {
    const F = T;
    if (!F.startsWith("bytes"))
      return "failure";
    const O = { position: 5 };
    if (_ && o(
      (ce) => ce === "	" || ce === " ",
      F,
      O
    ), F.charCodeAt(O.position) !== 61)
      return "failure";
    O.position++, _ && o(
      (ce) => ce === "	" || ce === " ",
      F,
      O
    );
    const H = o(
      (ce) => {
        const Fe = ce.charCodeAt(0);
        return Fe >= 48 && Fe <= 57;
      },
      F,
      O
    ), x = H.length ? Number(H) : null;
    if (_ && o(
      (ce) => ce === "	" || ce === " ",
      F,
      O
    ), F.charCodeAt(O.position) !== 45)
      return "failure";
    O.position++, _ && o(
      (ce) => ce === "	" || ce === " ",
      F,
      O
    );
    const Ae = o(
      (ce) => {
        const Fe = ce.charCodeAt(0);
        return Fe >= 48 && Fe <= 57;
      },
      F,
      O
    ), z = Ae.length ? Number(Ae) : null;
    return O.position < F.length || z === null && x === null || x > z ? "failure" : { rangeStartValue: x, rangeEndValue: z };
  }
  function ve(T, _, F) {
    let O = "bytes ";
    return O += R(`${T}`), O += "-", O += R(`${_}`), O += "/", O += R(`${F}`), O;
  }
  class ze extends e {
    #e;
    /** @param {zlib.ZlibOptions} [zlibOptions] */
    constructor(_) {
      super(), this.#e = _;
    }
    _transform(_, F, O) {
      if (!this._inflateStream) {
        if (_.length === 0) {
          O();
          return;
        }
        this._inflateStream = (_[0] & 15) === 8 ? t.createInflate(this.#e) : t.createInflateRaw(this.#e), this._inflateStream.on("data", this.push.bind(this)), this._inflateStream.on("end", () => this.push(null)), this._inflateStream.on("error", (H) => this.destroy(H));
      }
      this._inflateStream.write(_, F, O);
    }
    _final(_) {
      this._inflateStream && (this._inflateStream.end(), this._inflateStream = null), _();
    }
  }
  function Ke(T) {
    return new ze(T);
  }
  function Ie(T) {
    let _ = null, F = null, O = null;
    const H = ee("content-type", T);
    if (H === null)
      return "failure";
    for (const x of H) {
      const Ae = l(x);
      Ae === "failure" || Ae.essence === "*/*" || (O = Ae, O.essence !== F ? (_ = null, O.parameters.has("charset") && (_ = O.parameters.get("charset")), F = O.essence) : !O.parameters.has("charset") && _ !== null && O.parameters.set("charset", _));
    }
    return O ?? "failure";
  }
  function Y(T) {
    const _ = T, F = { position: 0 }, O = [];
    let H = "";
    for (; F.position < _.length; ) {
      if (H += o(
        (x) => x !== '"' && x !== ",",
        _,
        F
      ), F.position < _.length)
        if (_.charCodeAt(F.position) === 34) {
          if (H += a(
            _,
            F
          ), F.position < _.length)
            continue;
        } else
          d(_.charCodeAt(F.position) === 44), F.position++;
      H = u(H, !0, !0, (x) => x === 9 || x === 32), O.push(H), H = "";
    }
    return O;
  }
  function ee(T, _) {
    const F = _.get(T, !0);
    return F === null ? null : Y(F);
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
  return fr = {
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
    setRequestReferrerPolicyOnRedirect: b,
    isValidHTTPToken: h,
    requestBadPort: g,
    requestCurrentURL: w,
    responseURL: L,
    responseLocationURL: M,
    isBlobLike: c,
    isURLPotentiallyTrustworthy: X,
    isValidReasonPhrase: p,
    sameOrigin: le,
    normalizeMethod: pe,
    serializeJavascriptValueToJSONString: Le,
    iteratorMixin: de,
    createIterator: ke,
    isValidHeaderName: I,
    isValidHeaderValue: m,
    isErrorLike: E,
    fullyReadBody: We,
    bytesMatch: W,
    isReadableStreamLike: xe,
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
  }, fr;
}
var pr, uo;
function Tt() {
  return uo || (uo = 1, pr = {
    kUrl: /* @__PURE__ */ Symbol("url"),
    kHeaders: /* @__PURE__ */ Symbol("headers"),
    kSignal: /* @__PURE__ */ Symbol("signal"),
    kState: /* @__PURE__ */ Symbol("state"),
    kDispatcher: /* @__PURE__ */ Symbol("dispatcher")
  }), pr;
}
var wr, Eo;
function Qo() {
  if (Eo) return wr;
  Eo = 1;
  const { Blob: e, File: t } = ct, { kState: A } = Tt(), { webidl: s } = $e();
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
  return wr = { FileLike: r, isFileLike: n }, wr;
}
var mr, ho;
function RA() {
  if (ho) return mr;
  ho = 1;
  const { isBlobLike: e, iteratorMixin: t } = it(), { kState: A } = Tt(), { kEnumerableProperty: s } = Ue(), { FileLike: r, isFileLike: n } = Qo(), { webidl: o } = $e(), { File: a } = ct, u = rt, l = globalThis.File ?? a;
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
    append(h, C, d = void 0) {
      o.brandCheck(this, i);
      const y = "FormData.append";
      if (o.argumentLengthCheck(arguments, 2, y), arguments.length === 3 && !e(C))
        throw new TypeError(
          "Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'"
        );
      h = o.converters.USVString(h, y, "name"), C = e(C) ? o.converters.Blob(C, y, "value", { strict: !1 }) : o.converters.USVString(C, y, "value"), d = arguments.length === 3 ? o.converters.USVString(d, y, "filename") : void 0;
      const D = c(h, C, d);
      this[A].push(D);
    }
    delete(h) {
      o.brandCheck(this, i);
      const C = "FormData.delete";
      o.argumentLengthCheck(arguments, 1, C), h = o.converters.USVString(h, C, "name"), this[A] = this[A].filter((d) => d.name !== h);
    }
    get(h) {
      o.brandCheck(this, i);
      const C = "FormData.get";
      o.argumentLengthCheck(arguments, 1, C), h = o.converters.USVString(h, C, "name");
      const d = this[A].findIndex((y) => y.name === h);
      return d === -1 ? null : this[A][d].value;
    }
    getAll(h) {
      o.brandCheck(this, i);
      const C = "FormData.getAll";
      return o.argumentLengthCheck(arguments, 1, C), h = o.converters.USVString(h, C, "name"), this[A].filter((d) => d.name === h).map((d) => d.value);
    }
    has(h) {
      o.brandCheck(this, i);
      const C = "FormData.has";
      return o.argumentLengthCheck(arguments, 1, C), h = o.converters.USVString(h, C, "name"), this[A].findIndex((d) => d.name === h) !== -1;
    }
    set(h, C, d = void 0) {
      o.brandCheck(this, i);
      const y = "FormData.set";
      if (o.argumentLengthCheck(arguments, 2, y), arguments.length === 3 && !e(C))
        throw new TypeError(
          "Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'"
        );
      h = o.converters.USVString(h, y, "name"), C = e(C) ? o.converters.Blob(C, y, "name", { strict: !1 }) : o.converters.USVString(C, y, "name"), d = arguments.length === 3 ? o.converters.USVString(d, y, "name") : void 0;
      const D = c(h, C, d), k = this[A].findIndex((N) => N.name === h);
      k !== -1 ? this[A] = [
        ...this[A].slice(0, k),
        D,
        ...this[A].slice(k + 1).filter((N) => N.name !== h)
      ] : this[A].push(D);
    }
    [u.inspect.custom](h, C) {
      const d = this[A].reduce((D, k) => (D[k.name] ? Array.isArray(D[k.name]) ? D[k.name].push(k.value) : D[k.name] = [D[k.name], k.value] : D[k.name] = k.value, D), { __proto__: null });
      C.depth ??= h, C.colors ??= !0;
      const y = u.formatWithOptions(C, d);
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
  function c(Q, h, C) {
    if (typeof h != "string") {
      if (n(h) || (h = h instanceof Blob ? new l([h], "blob", { type: h.type }) : new r(h, "blob", { type: h.type })), C !== void 0) {
        const d = {
          type: h.type,
          lastModified: h.lastModified
        };
        h = h instanceof a ? new l([h], C, d) : new r(h, C, d);
      }
    }
    return { name: Q, value: h };
  }
  return mr = { FormData: i, makeEntry: c }, mr;
}
var yr, Bo;
function dg() {
  if (Bo) return yr;
  Bo = 1;
  const { isUSVString: e, bufferToLowerCasedHeaderName: t } = Ue(), { utf8DecodeBytes: A } = it(), { HTTP_TOKEN_CODEPOINTS: s, isomorphicDecode: r } = st(), { isFileLike: n } = Qo(), { makeEntry: o } = RA(), a = He, { File: u } = ct, l = globalThis.File ?? u, i = Buffer.from('form-data; name="'), c = Buffer.from("; filename"), Q = Buffer.from("--"), h = Buffer.from(`--\r
`);
  function C(f) {
    for (let B = 0; B < f.length; ++B)
      if ((f.charCodeAt(B) & -128) !== 0)
        return !1;
    return !0;
  }
  function d(f) {
    const B = f.length;
    if (B < 27 || B > 70)
      return !1;
    for (let w = 0; w < B; ++w) {
      const g = f.charCodeAt(w);
      if (!(g >= 48 && g <= 57 || g >= 65 && g <= 90 || g >= 97 && g <= 122 || g === 39 || g === 45 || g === 95))
        return !1;
    }
    return !0;
  }
  function y(f, B) {
    a(B !== "failure" && B.essence === "multipart/form-data");
    const w = B.parameters.get("boundary");
    if (w === void 0)
      return "failure";
    const g = Buffer.from(`--${w}`, "utf8"), E = [], p = { position: 0 };
    for (; f[p.position] === 13 && f[p.position + 1] === 10; )
      p.position += 2;
    let I = f.length;
    for (; f[I - 1] === 10 && f[I - 2] === 13; )
      I -= 2;
    for (I !== f.length && (f = f.subarray(0, I)); ; ) {
      if (f.subarray(p.position, p.position + g.length).equals(g))
        p.position += g.length;
      else
        return "failure";
      if (p.position === f.length - 2 && M(f, Q, p) || p.position === f.length - 4 && M(f, h, p))
        return E;
      if (f[p.position] !== 13 || f[p.position + 1] !== 10)
        return "failure";
      p.position += 2;
      const m = D(f, p);
      if (m === "failure")
        return "failure";
      let { name: b, filename: U, contentType: S, encoding: G } = m;
      p.position += 2;
      let v;
      {
        const ne = f.indexOf(g.subarray(2), p.position);
        if (ne === -1)
          return "failure";
        v = f.subarray(p.position, ne - 4), p.position += v.length, G === "base64" && (v = Buffer.from(v.toString(), "base64"));
      }
      if (f[p.position] !== 13 || f[p.position + 1] !== 10)
        return "failure";
      p.position += 2;
      let $;
      U !== null ? (S ??= "text/plain", C(S) || (S = ""), $ = new l([v], U, { type: S })) : $ = A(Buffer.from(v)), a(e(b)), a(typeof $ == "string" && e($) || n($)), E.push(o(b, $, U));
    }
  }
  function D(f, B) {
    let w = null, g = null, E = null, p = null;
    for (; ; ) {
      if (f[B.position] === 13 && f[B.position + 1] === 10)
        return w === null ? "failure" : { name: w, filename: g, contentType: E, encoding: p };
      let I = N(
        (m) => m !== 10 && m !== 13 && m !== 58,
        f,
        B
      );
      if (I = L(I, !0, !0, (m) => m === 9 || m === 32), !s.test(I.toString()) || f[B.position] !== 58)
        return "failure";
      switch (B.position++, N(
        (m) => m === 32 || m === 9,
        f,
        B
      ), t(I)) {
        case "content-disposition": {
          if (w = g = null, !M(f, i, B) || (B.position += 17, w = k(f, B), w === null))
            return "failure";
          if (M(f, c, B)) {
            let m = B.position + c.length;
            if (f[m] === 42 && (B.position += 1, m += 1), f[m] !== 61 || f[m + 1] !== 34 || (B.position += 12, g = k(f, B), g === null))
              return "failure";
          }
          break;
        }
        case "content-type": {
          let m = N(
            (b) => b !== 10 && b !== 13,
            f,
            B
          );
          m = L(m, !1, !0, (b) => b === 9 || b === 32), E = r(m);
          break;
        }
        case "content-transfer-encoding": {
          let m = N(
            (b) => b !== 10 && b !== 13,
            f,
            B
          );
          m = L(m, !1, !0, (b) => b === 9 || b === 32), p = r(m);
          break;
        }
        default:
          N(
            (m) => m !== 10 && m !== 13,
            f,
            B
          );
      }
      if (f[B.position] !== 13 && f[B.position + 1] !== 10)
        return "failure";
      B.position += 2;
    }
  }
  function k(f, B) {
    a(f[B.position - 1] === 34);
    let w = N(
      (g) => g !== 10 && g !== 13 && g !== 34,
      f,
      B
    );
    return f[B.position] !== 34 ? null : (B.position++, w = new TextDecoder().decode(w).replace(/%0A/ig, `
`).replace(/%0D/ig, "\r").replace(/%22/g, '"'), w);
  }
  function N(f, B, w) {
    let g = w.position;
    for (; g < B.length && f(B[g]); )
      ++g;
    return B.subarray(w.position, w.position = g);
  }
  function L(f, B, w, g) {
    let E = 0, p = f.length - 1;
    if (B)
      for (; E < f.length && g(f[E]); ) E++;
    for (; p > 0 && g(f[p]); ) p--;
    return E === 0 && p === f.length - 1 ? f : f.subarray(E, p + 1);
  }
  function M(f, B, w) {
    if (f.length < B.length)
      return !1;
    for (let g = 0; g < B.length; g++)
      if (B[g] !== f[w.position + g])
        return !1;
    return !0;
  }
  return yr = {
    multipartFormDataParser: y,
    validateBoundary: d
  }, yr;
}
var Dr, Co;
function eA() {
  if (Co) return Dr;
  Co = 1;
  const e = Ue(), {
    ReadableStreamFrom: t,
    isBlobLike: A,
    isReadableStreamLike: s,
    readableStreamClose: r,
    createDeferredPromise: n,
    fullyReadBody: o,
    extractMimeType: a,
    utf8DecodeBytes: u
  } = it(), { FormData: l } = RA(), { kState: i } = Tt(), { webidl: c } = $e(), { Blob: Q } = ct, h = He, { isErrored: C, isDisturbed: d } = ot, { isArrayBuffer: y } = Nn, { serializeAMimeType: D } = st(), { multipartFormDataParser: k } = dg();
  let N;
  try {
    const v = require("node:crypto");
    N = ($) => v.randomInt(0, $);
  } catch {
    N = (v) => Math.floor(Math.random(v));
  }
  const L = new TextEncoder();
  function M() {
  }
  const f = globalThis.FinalizationRegistry && process.version.indexOf("v18") !== 0;
  let B;
  f && (B = new FinalizationRegistry((v) => {
    const $ = v.deref();
    $ && !$.locked && !d($) && !C($) && $.cancel("Response object has been garbage collected").catch(M);
  }));
  function w(v, $ = !1) {
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
      const ye = `----formdata-undici-0${`${N(1e11)}`.padStart(11, "0")}`, we = `--${ye}\r
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
          else if (!C(ne)) {
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
    return v instanceof ReadableStream && (h(!e.isDisturbed(v), "The body has already been consumed."), h(!v.locked, "The stream is locked.")), w(v, $);
  }
  function E(v, $) {
    const [ne, ge] = $.stream.tee();
    return $.stream = ne, {
      stream: ge,
      length: $.length,
      source: $.source
    };
  }
  function p(v) {
    if (v.aborted)
      throw new DOMException("The operation was aborted.", "AbortError");
  }
  function I(v) {
    return {
      blob() {
        return b(this, (ne) => {
          let ge = G(this);
          return ge === null ? ge = "" : ge && (ge = D(ge)), new Q([ne], { type: ge });
        }, v);
      },
      arrayBuffer() {
        return b(this, (ne) => new Uint8Array(ne).buffer, v);
      },
      text() {
        return b(this, u, v);
      },
      json() {
        return b(this, S, v);
      },
      formData() {
        return b(this, (ne) => {
          const ge = G(this);
          if (ge !== null)
            switch (ge.essence) {
              case "multipart/form-data": {
                const ae = k(ne, ge);
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
        return b(this, (ne) => new Uint8Array(ne), v);
      }
    };
  }
  function m(v) {
    Object.assign(v.prototype, I(v));
  }
  async function b(v, $, ne) {
    if (c.brandCheck(v, ne), U(v))
      throw new TypeError("Body is unusable: Body has already been read");
    p(v[i]);
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
  return Dr = {
    extractBody: w,
    safelyExtractBody: g,
    cloneBody: E,
    mixinBody: m,
    streamRegistry: B,
    hasFinalizationRegistry: f,
    bodyUnusable: U
  }, Dr;
}
var br, Io;
function fg() {
  if (Io) return br;
  Io = 1;
  const e = He, t = Ue(), { channels: A } = jt(), s = $n(), {
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
    kUrl: C,
    kReset: d,
    kClient: y,
    kParser: D,
    kBlocking: k,
    kRunning: N,
    kPending: L,
    kSize: M,
    kWriting: f,
    kQueue: B,
    kNoRef: w,
    kKeepAliveDefaultTimeout: g,
    kHostHeader: E,
    kPendingIdx: p,
    kRunningIdx: I,
    kError: m,
    kPipelining: b,
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
  } = Ve(), W = Cg(), re = Buffer.alloc(0), J = Buffer[Symbol.species], V = t.addListener, P = t.removeAllListeners;
  let Z;
  async function se() {
    const Ie = process.env.JEST_WORKER_ID ? so() : void 0;
    let Y;
    try {
      Y = await WebAssembly.compile(Ig());
    } catch {
      Y = await WebAssembly.compile(Ie || so());
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
  const Re = 0, ke = 1, de = 2 | ke, We = 4 | ke, xe = 8 | Re;
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
      const K = ee[B][ee[I]];
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
      const Se = K[B][K[I]];
      e(Se), e(Se.upgrade || Se.method === "CONNECT"), this.statusCode = null, this.statusText = "", this.shouldKeepAlive = null, this.headers = [], this.headersSize = 0, te.unshift(Y), te[D].destroy(), te[D] = null, te[y] = null, te[m] = null, P(te), K[U] = null, K[X] = null, K[B][K[I]++] = null, K.emit("disconnect", K[C], [K], new i("upgrade"));
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
      const T = te[B][te[I]];
      if (!T)
        return -1;
      if (e(!this.upgrade), e(this.statusCode < 200), Y === 100)
        return t.destroy(Ee, new l("bad response", t.getSocketInfo(Ee))), -1;
      if (ee && !T.upgrade)
        return t.destroy(Ee, new l("bad upgrade", t.getSocketInfo(Ee))), -1;
      if (e(this.timeoutType === de), this.statusCode = Y, this.shouldKeepAlive = K || // Override llhttp value which does not allow keepAlive for HEAD.
      T.method === "HEAD" && !Ee[d] && this.connection.toLowerCase() === "keep-alive", this.statusCode >= 200) {
        const F = T.bodyTimeout != null ? T.bodyTimeout : te[ge];
        this.setTimeout(F, We);
      } else this.timeout && this.timeout.refresh && this.timeout.refresh();
      if (T.method === "CONNECT")
        return e(te[N] === 1), this.upgrade = !0, 2;
      if (ee)
        return e(te[N] === 1), this.upgrade = !0, 2;
      if (e((this.headers.length & 1) === 0), this.headers = [], this.headersSize = 0, this.shouldKeepAlive && te[b]) {
        const F = this.keepAlive ? t.parseKeepAliveTimeout(this.keepAlive) : null;
        if (F != null) {
          const O = Math.min(
            F - te[$],
            te[v]
          );
          O <= 0 ? Ee[d] = !0 : te[S] = O;
        } else
          te[S] = te[g];
      } else
        Ee[d] = !0;
      const _ = T.onHeaders(Y, be, this.resume, Se) === !1;
      return T.aborted ? -1 : T.method === "HEAD" || Y < 200 ? 1 : (Ee[k] && (Ee[k] = !1, te[we]()), _ ? W.ERROR.PAUSED : 0);
    }
    onBody(Y) {
      const { client: ee, socket: K, statusCode: te, maxResponseSize: Ee } = this;
      if (K.destroyed)
        return -1;
      const be = ee[B][ee[I]];
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
      const _ = Y[B][Y[I]];
      if (e(_), this.statusCode = null, this.statusText = "", this.bytesRead = 0, this.contentLength = "", this.keepAlive = "", this.connection = "", this.headers = [], this.headersSize = 0, !(K < 200)) {
        if (_.method !== "HEAD" && be && Se !== parseInt(be, 10))
          return t.destroy(ee, new n()), -1;
        if (_.onComplete(Ee), Y[B][Y[I]++] = null, ee[f])
          return e(Y[N] === 0), t.destroy(ee, new i("reset")), W.ERROR.PAUSED;
        if (T) {
          if (ee[d] && Y[N] === 0)
            return t.destroy(ee, new i("reset")), W.ERROR.PAUSED;
          Y[b] == null || Y[b] === 1 ? setImmediate(() => Y[we]()) : Y[we]();
        } else return t.destroy(ee, new i("reset")), W.ERROR.PAUSED;
      }
    }
  }
  function j(Ie) {
    const { socket: Y, timeoutType: ee, client: K, paused: te } = Ie.deref();
    ee === de ? (!Y[f] || Y.writableNeedDrain || K[N] > 1) && (e(!te, "cannot be paused while waiting for headers"), t.destroy(Y, new a())) : ee === We ? te || t.destroy(Y, new c()) : ee === xe && (e(K[N] === 0 && K[S]), t.destroy(Y, new i("socket idle timeout")));
  }
  async function R(Ie, Y) {
    Ie[U] = Y, le || (le = await oe, oe = null), Y[w] = !1, Y[f] = !1, Y[d] = !1, Y[k] = !1, Y[D] = new Je(Ie, Y, le), V(Y, "error", function(K) {
      e(K.code !== "ERR_TLS_CERT_ALTNAME_INVALID");
      const te = this[D];
      if (K.code === "ECONNRESET" && te.statusCode && !te.shouldKeepAlive) {
        te.onMessageComplete();
        return;
      }
      this[m] = K, this[y][ye](K);
    }), V(Y, "readable", function() {
      const K = this[D];
      K && K.readMore();
    }), V(Y, "end", function() {
      const K = this[D];
      if (K.statusCode && !K.shouldKeepAlive) {
        K.onMessageComplete();
        return;
      }
      t.destroy(this, new l("other side closed", t.getSocketInfo(this)));
    }), V(Y, "close", function() {
      const K = this[y], te = this[D];
      te && (!this[m] && te.statusCode && !te.shouldKeepAlive && te.onMessageComplete(), this[D].destroy(), this[D] = null);
      const Ee = this[m] || new l("closed", t.getSocketInfo(this));
      if (K[U] = null, K[X] = null, K.destroyed) {
        e(K[L] === 0);
        const be = K[B].splice(K[I]);
        for (let Se = 0; Se < be.length; Se++) {
          const T = be[Se];
          t.errorRequest(K, T, Ee);
        }
      } else if (K[N] > 0 && Ee.code !== "UND_ERR_INFO") {
        const be = K[B][K[I]];
        K[B][K[I]++] = null, t.errorRequest(K, be, Ee);
      }
      K[p] = K[I], e(K[N] === 0), K.emit("disconnect", K[C], [K], Ee), K[we]();
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
        return !!(Y[f] || Y[d] || Y[k] || K && (Ie[N] > 0 && !K.idempotent || Ie[N] > 0 && (K.upgrade || K.method === "CONNECT") || Ie[N] > 0 && t.bodyLength(K.body) !== 0 && (t.isStream(K.body) || t.isAsyncIterable(K.body) || t.isFormDataLike(K.body))));
      }
    };
  }
  function q(Ie) {
    const Y = Ie[U];
    if (Y && !Y.destroyed) {
      if (Ie[M] === 0 ? !Y[w] && Y.unref && (Y.unref(), Y[w] = !0) : Y[w] && Y.ref && (Y.ref(), Y[w] = !1), Ie[M] === 0)
        Y[D].timeoutType !== xe && Y[D].setTimeout(Ie[S], xe);
      else if (Ie[N] > 0 && Y[D].statusCode < 200 && Y[D].timeoutType !== de) {
        const ee = Ie[B][Ie[I]], K = ee.headersTimeout != null ? ee.headersTimeout : Ie[ne];
        Y[D].setTimeout(K, de);
      }
    }
  }
  function ie(Ie) {
    return Ie !== "GET" && Ie !== "HEAD" && Ie !== "OPTIONS" && Ie !== "TRACE" && Ie !== "CONNECT";
  }
  function ue(Ie, Y) {
    const { method: ee, path: K, host: te, upgrade: Ee, blocking: be, reset: Se } = Y;
    let { body: T, headers: _, contentLength: F } = Y;
    const O = ee === "PUT" || ee === "POST" || ee === "PATCH" || ee === "QUERY" || ee === "PROPFIND" || ee === "PROPPATCH";
    if (t.isFormDataLike(T)) {
      Z || (Z = eA().extractBody);
      const [ce, Fe] = Z(T);
      Y.contentType == null && _.push("content-type", Fe), T = ce.stream, F = ce.length;
    } else t.isBlobLike(T) && Y.contentType == null && T.type && _.push("content-type", T.type);
    T && typeof T.read == "function" && T.read(0);
    const H = t.bodyLength(T);
    if (F = H ?? F, F === null && (F = Y.contentLength), F === 0 && !O && (F = null), ie(ee) && F > 0 && Y.contentLength !== null && Y.contentLength !== F) {
      if (Ie[ae])
        return t.errorRequest(Ie, Y, new r()), !1;
      process.emitWarning(new r());
    }
    const x = Ie[U], Ae = (ce) => {
      Y.aborted || Y.completed || (t.errorRequest(Ie, Y, ce || new o()), t.destroy(T), t.destroy(x, new i("aborted")));
    };
    try {
      Y.onConnect(Ae);
    } catch (ce) {
      t.errorRequest(Ie, Y, ce);
    }
    if (Y.aborted)
      return !1;
    ee === "HEAD" && (x[d] = !0), (Ee || ee === "CONNECT") && (x[d] = !0), Se != null && (x[d] = Se), Ie[Be] && x[he]++ >= Ie[Be] && (x[d] = !0), be && (x[k] = !0);
    let z = `${ee} ${K} HTTP/1.1\r
`;
    if (typeof te == "string" ? z += `host: ${te}\r
` : z += Ie[E], Ee ? z += `connection: upgrade\r
upgrade: ${Ee}\r
` : Ie[b] && !x[d] ? z += `connection: keep-alive\r
` : z += `connection: close\r
`, Array.isArray(_))
      for (let ce = 0; ce < _.length; ce += 2) {
        const Fe = _[ce + 0], Ge = _[ce + 1];
        if (Array.isArray(Ge))
          for (let Ne = 0; Ne < Ge.length; Ne++)
            z += `${Fe}: ${Ge[Ne]}\r
`;
        else
          z += `${Fe}: ${Ge}\r
`;
      }
    return A.sendHeaders.hasSubscribers && A.sendHeaders.publish({ request: Y, headers: z, socket: x }), !T || H === 0 ? De(Ae, null, Ie, Y, x, F, z, O) : t.isBuffer(T) ? De(Ae, T, Ie, Y, x, F, z, O) : t.isBlobLike(T) ? typeof T.stream == "function" ? ze(Ae, T.stream(), Ie, Y, x, F, z, O) : ve(Ae, T, Ie, Y, x, F, z, O) : t.isStream(T) ? Ce(Ae, T, Ie, Y, x, F, z, O) : t.isIterable(T) ? ze(Ae, T, Ie, Y, x, F, z, O) : e(!1), !0;
  }
  function Ce(Ie, Y, ee, K, te, Ee, be, Se) {
    e(Ee !== 0 || ee[N] === 0, "stream body cannot be pipelined");
    let T = !1;
    const _ = new Ke({ abort: Ie, socket: te, request: K, contentLength: Ee, client: ee, expectsPayload: Se, header: be }), F = function(Ae) {
      if (!T)
        try {
          !_.write(Ae) && this.pause && this.pause();
        } catch (z) {
          t.destroy(this, z);
        }
    }, O = function() {
      T || Y.resume && Y.resume();
    }, H = function() {
      if (queueMicrotask(() => {
        Y.removeListener("error", x);
      }), !T) {
        const Ae = new o();
        queueMicrotask(() => x(Ae));
      }
    }, x = function(Ae) {
      if (!T) {
        if (T = !0, e(te.destroyed || te[f] && ee[N] <= 1), te.off("drain", O).off("error", x), Y.removeListener("data", F).removeListener("end", x).removeListener("close", H), !Ae)
          try {
            _.end();
          } catch (z) {
            Ae = z;
          }
        _.destroy(Ae), Ae && (Ae.code !== "UND_ERR_INFO" || Ae.message !== "reset") ? t.destroy(Y, Ae) : t.destroy(Y);
      }
    };
    Y.on("data", F).on("end", x).on("error", x).on("close", H), Y.resume && Y.resume(), te.on("drain", O).on("error", x), Y.errorEmitted ?? Y.errored ? setImmediate(() => x(Y.errored)) : (Y.endEmitted ?? Y.readableEnded) && setImmediate(() => x(null)), (Y.closeEmitted ?? Y.closed) && setImmediate(H);
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
    e(Ee !== 0 || ee[N] === 0, "iterator body cannot be pipelined");
    let T = null;
    function _() {
      if (T) {
        const H = T;
        T = null, H();
      }
    }
    const F = () => new Promise((H, x) => {
      e(T === null), te[m] ? x(te[m]) : T = H;
    });
    te.on("close", _).on("drain", _);
    const O = new Ke({ abort: Ie, socket: te, request: K, contentLength: Ee, client: ee, expectsPayload: Se, header: be });
    try {
      for await (const H of Y) {
        if (te[m])
          throw te[m];
        O.write(H) || await F();
      }
      O.end();
    } catch (H) {
      O.destroy(H);
    } finally {
      te.off("close", _).off("drain", _);
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
      const _ = Buffer.byteLength(Y);
      if (!_)
        return !0;
      if (te !== null && be + _ > te) {
        if (Ee[ae])
          throw new r();
        process.emitWarning(new r());
      }
      ee.cork(), be === 0 && (!Se && K.reset !== !1 && (ee[d] = !0), te === null ? ee.write(`${T}transfer-encoding: chunked\r
`, "latin1") : ee.write(`${T}content-length: ${te}\r
\r
`, "latin1")), te === null && ee.write(`\r
${_.toString(16)}\r
`, "latin1"), this.bytesWritten += _;
      const F = ee.write(Y);
      return ee.uncork(), K.onBodySent(Y), F || ee[D].timeout && ee[D].timeoutType === de && ee[D].timeout.refresh && ee[D].timeout.refresh(), F;
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
        Y[D].timeout && Y[D].timeoutType === de && Y[D].timeout.refresh && Y[D].timeout.refresh(), K[we]();
      }
    }
    destroy(Y) {
      const { socket: ee, client: K, abort: te } = this;
      ee[f] = !1, Y && (e(K[N] <= 1, "pipeline should only contain this request"), te(Y));
    }
  }
  return br = R, br;
}
var Rr, fo;
function pg() {
  if (fo) return Rr;
  fo = 1;
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
    kRunningIdx: C,
    kError: d,
    kSocket: y,
    kStrictContentLength: D,
    kOnError: k,
    kMaxConcurrentStreams: N,
    kHTTP2Session: L,
    kResume: M,
    kSize: f,
    kHTTPContext: B
  } = Ve(), w = /* @__PURE__ */ Symbol("open streams");
  let g, E = !1, p;
  try {
    p = require("node:http2");
  } catch {
    p = { constants: {} };
  }
  const {
    constants: {
      HTTP2_HEADER_AUTHORITY: I,
      HTTP2_HEADER_METHOD: m,
      HTTP2_HEADER_PATH: b,
      HTTP2_HEADER_SCHEME: U,
      HTTP2_HEADER_CONTENT_LENGTH: S,
      HTTP2_HEADER_EXPECT: G,
      HTTP2_HEADER_STATUS: v
    }
  } = p;
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
    V[y] = P, E || (E = !0, process.emitWarning("H2 support is experimental, expect them to change at any time.", {
      code: "UNDICI-H2"
    }));
    const Z = p.connect(V[a], {
      createConnection: () => P,
      peerMaxConcurrentStreams: V[N]
    });
    Z[w] = 0, Z[l] = V, Z[y] = P, A.addListener(Z, "error", ae), A.addListener(Z, "frameError", Be), A.addListener(Z, "end", he), A.addListener(Z, "goaway", Qe), A.addListener(Z, "close", function() {
      const { [l]: le } = this, { [y]: oe } = le, fe = this[y][d] || this[d] || new n("closed", A.getSocketInfo(oe));
      if (le[L] = null, le.destroyed) {
        e(le[c] === 0);
        const Me = le[Q].splice(le[C]);
        for (let pe = 0; pe < Me.length; pe++) {
          const Le = Me[pe];
          A.errorRequest(le, Le, fe);
        }
      }
    }), Z.unref(), V[L] = Z, P[L] = Z, A.addListener(P, "error", function(le) {
      e(le.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[d] = le, this[l][k](le);
    }), A.addListener(P, "end", function() {
      A.destroy(this, new n("other side closed", A.getSocketInfo(this)));
    }), A.addListener(P, "close", function() {
      const le = this[d] || new n("closed", A.getSocketInfo(this));
      V[y] = null, this[L] != null && this[L].destroy(le), V[h] = V[C], e(V[i] === 0), V.emit("disconnect", V[a], [V], le), V[M]();
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
    P?.destroyed === !1 && (V[f] === 0 && V[N] === 0 ? (P.unref(), V[L].unref()) : (P.ref(), V[L].ref()));
  }
  function ae(V) {
    e(V.code !== "ERR_TLS_CERT_ALTNAME_INVALID"), this[y][d] = V, this[l][k](V);
  }
  function Be(V, P, Z) {
    if (Z === 0) {
      const se = new o(`HTTP/2: "frameError" received - type ${V}, code ${P}`);
      this[y][d] = se, this[l][k](se);
    }
  }
  function he() {
    const V = new n("other side closed", A.getSocketInfo(this[y]));
    this.destroy(V), A.destroy(this[y], V);
  }
  function Qe(V) {
    const P = this[d] || new n(`HTTP/2: "GOAWAY" frame received with code ${V}`, A.getSocketInfo(this)), Z = this[l];
    if (Z[y] = null, Z[B] = null, this[L] != null && (this[L].destroy(P), this[L] = null), A.destroy(this[y], P), Z[C] < Z[Q].length) {
      const se = Z[Q][Z[C]];
      Z[Q][Z[C]++] = null, A.errorRequest(Z, se, P), Z[h] = Z[C];
    }
    e(Z[i] === 0), Z.emit("disconnect", Z[a], [Z], P), Z[M]();
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
    const { hostname: We, port: xe } = V[a];
    ke[I] = oe || `${We}${xe ? `:${xe}` : ""}`, ke[m] = se;
    const Je = (ue) => {
      P.aborted || P.completed || (ue = ue || new r(), A.errorRequest(V, P, ue), de != null && A.destroy(de, ue), A.destroy(Re, ue), V[Q][V[C]++] = null, V[M]());
    };
    try {
      P.onConnect(Je);
    } catch (ue) {
      A.errorRequest(V, P, ue);
    }
    if (P.aborted)
      return !1;
    if (se === "CONNECT")
      return Z.ref(), de = Z.request(ke, { endStream: !1, signal: pe }), de.id && !de.pending ? (P.onUpgrade(null, null, de), ++Z[w], V[Q][V[C]++] = null) : de.once("ready", () => {
        P.onUpgrade(null, null, de), ++Z[w], V[Q][V[C]++] = null;
      }), de.once("close", () => {
        Z[w] -= 1, Z[w] === 0 && Z.unref();
      }), !0;
    ke[b] = le, ke[U] = "https";
    const j = se === "PUT" || se === "POST" || se === "PATCH";
    Re && typeof Re.read == "function" && Re.read(0);
    let R = A.bodyLength(Re);
    if (A.isFormDataLike(Re)) {
      g ??= eA().extractBody;
      const [ue, Ce] = g(Re);
      ke["content-type"] = Ce, Re = ue.stream, R = ue.length;
    }
    if (R == null && (R = P.contentLength), (R === 0 || !j) && (R = null), ye(se) && R > 0 && P.contentLength != null && P.contentLength !== R) {
      if (V[D])
        return A.errorRequest(V, P, new s()), !1;
      process.emitWarning(new s());
    }
    R != null && (e(Re, "no body must not have content length"), ke[S] = `${R}`), Z.ref();
    const q = se === "GET" || se === "HEAD" || Re === null;
    return Me ? (ke[G] = "100-continue", de = Z.request(ke, { endStream: q, signal: pe }), de.once("continue", ie)) : (de = Z.request(ke, {
      endStream: q,
      signal: pe
    }), ie()), ++Z[w], de.once("response", (ue) => {
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
      (de.state?.state == null || de.state.state < 6) && P.onComplete([]), Z[w] === 0 && Z.unref(), Je(new o("HTTP/2: stream half-closed (remote)")), V[Q][V[C]++] = null, V[h] = V[C], V[M]();
    }), de.once("close", () => {
      Z[w] -= 1, Z[w] === 0 && Z.unref();
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
      Z != null && A.isBuffer(Z) && (e(fe === Z.byteLength, "buffer body must have content length"), P.cork(), P.write(Z), P.uncork(), P.end(), le.onBodySent(Z)), Me || (oe[u] = !0), le.onRequestSent(), se[M]();
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
        Re ? (A.destroy(pe, Re), V(Re)) : (A.removeAllListeners(pe), fe.onRequestSent(), Z || (P[u] = !0), oe[M]());
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
      P.cork(), P.write(pe), P.uncork(), P.end(), le.onBodySent(pe), le.onRequestSent(), Me || (oe[u] = !0), se[M]();
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
      P.end(), le.onRequestSent(), Me || (oe[u] = !0), se[M]();
    } catch (ke) {
      V(ke);
    } finally {
      P.off("close", Le).off("drain", Le);
    }
  }
  return Rr = ne, Rr;
}
var kr, po;
function Fr() {
  if (po) return kr;
  po = 1;
  const e = Ue(), { kBodyUsed: t } = Ve(), A = He, { InvalidArgumentError: s } = Ye(), r = qt, n = [300, 301, 302, 303, 307, 308], o = /* @__PURE__ */ Symbol("body");
  class a {
    constructor(h) {
      this[o] = h, this[t] = !1;
    }
    async *[Symbol.asyncIterator]() {
      A(!this[t], "disturbed"), this[t] = !0, yield* this[o];
    }
  }
  class u {
    constructor(h, C, d, y) {
      if (C != null && (!Number.isInteger(C) || C < 0))
        throw new s("maxRedirections must be a positive number");
      e.validateHandler(y, d.method, d.upgrade), this.dispatch = h, this.location = null, this.abort = null, this.opts = { ...d, maxRedirections: 0 }, this.maxRedirections = C, this.handler = y, this.history = [], this.redirectionLimitReached = !1, e.isStream(this.opts.body) ? (e.bodyLength(this.opts.body) === 0 && this.opts.body.on("data", function() {
        A(!1);
      }), typeof this.opts.body.readableDidRead != "boolean" && (this.opts.body[t] = !1, r.prototype.on.call(this.opts.body, "data", function() {
        this[t] = !0;
      }))) : this.opts.body && typeof this.opts.body.pipeTo == "function" ? this.opts.body = new a(this.opts.body) : this.opts.body && typeof this.opts.body != "string" && !ArrayBuffer.isView(this.opts.body) && e.isIterable(this.opts.body) && (this.opts.body = new a(this.opts.body));
    }
    onConnect(h) {
      this.abort = h, this.handler.onConnect(h, { history: this.history });
    }
    onUpgrade(h, C, d) {
      this.handler.onUpgrade(h, C, d);
    }
    onError(h) {
      this.handler.onError(h);
    }
    onHeaders(h, C, d, y) {
      if (this.location = this.history.length >= this.maxRedirections || e.isDisturbed(this.opts.body) ? null : l(h, C), this.opts.throwOnMaxRedirect && this.history.length >= this.maxRedirections) {
        this.request && this.request.abort(new Error("max redirects")), this.redirectionLimitReached = !0, this.abort(new Error("max redirects"));
        return;
      }
      if (this.opts.origin && this.history.push(new URL(this.opts.path, this.opts.origin)), !this.location)
        return this.handler.onHeaders(h, C, d, y);
      const { origin: D, pathname: k, search: N } = e.parseURL(new URL(this.location, this.opts.origin && new URL(this.opts.path, this.opts.origin))), L = N ? `${k}${N}` : k;
      this.opts.headers = c(this.opts.headers, h === 303, this.opts.origin !== D), this.opts.path = L, this.opts.origin = D, this.opts.maxRedirections = 0, this.opts.query = null, h === 303 && this.opts.method !== "HEAD" && (this.opts.method = "GET", this.opts.body = null);
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
    for (let C = 0; C < h.length; C += 2)
      if (h[C].length === 8 && e.headerNameToString(h[C]) === "location")
        return h[C + 1];
  }
  function i(Q, h, C) {
    if (Q.length === 4)
      return e.headerNameToString(Q) === "host";
    if (h && e.headerNameToString(Q).startsWith("content-"))
      return !0;
    if (C && (Q.length === 13 || Q.length === 6 || Q.length === 19)) {
      const d = e.headerNameToString(Q);
      return d === "authorization" || d === "cookie" || d === "proxy-authorization";
    }
    return !1;
  }
  function c(Q, h, C) {
    const d = [];
    if (Array.isArray(Q))
      for (let y = 0; y < Q.length; y += 2)
        i(Q[y], h, C) || d.push(Q[y], Q[y + 1]);
    else if (Q && typeof Q == "object")
      for (const y of Object.keys(Q))
        i(y, h, C) || d.push(y, Q[y]);
    else
      A(Q == null, "headers must be an object or an array");
    return d;
  }
  return kr = u, kr;
}
var Tr, wo;
function Sr() {
  if (wo) return Tr;
  wo = 1;
  const e = Fr();
  function t({ maxRedirections: A }) {
    return (s) => function(n, o) {
      const { maxRedirections: a = A } = n;
      if (!a)
        return s(n, o);
      const u = new e(s, a, n, o);
      return n = { ...n, maxRedirections: 0 }, s(n, u);
    };
  }
  return Tr = t, Tr;
}
var Ur, mo;
function tA() {
  if (mo) return Ur;
  mo = 1;
  const e = He, t = pA, A = wA, s = Ue(), { channels: r } = jt(), n = hg(), o = Xt(), {
    InvalidArgumentError: a,
    InformationalError: u,
    ClientDestroyedError: l
  } = Ye(), i = DA(), {
    kUrl: c,
    kServerName: Q,
    kClient: h,
    kBusy: C,
    kConnect: d,
    kResuming: y,
    kRunning: D,
    kPending: k,
    kSize: N,
    kQueue: L,
    kConnected: M,
    kConnecting: f,
    kNeedDrain: B,
    kKeepAliveDefaultTimeout: w,
    kHostHeader: g,
    kPendingIdx: E,
    kRunningIdx: p,
    kError: I,
    kPipelining: m,
    kKeepAliveTimeoutValue: b,
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
  } = Ve(), se = fg(), le = pg();
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
      maxCachedSessions: _,
      maxRedirections: F,
      connect: O,
      maxRequestsPerClient: H,
      localAddress: x,
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
      if (F != null && (!Number.isInteger(F) || F < 0))
        throw new a("maxRedirections must be a positive number");
      if (H != null && (!Number.isInteger(H) || H < 0))
        throw new a("maxRequestsPerClient must be a positive number");
      if (x != null && (typeof x != "string" || t.isIP(x) === 0))
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
        maxCachedSessions: _,
        allowH2: Ge,
        socketPath: Ee,
        timeout: ve,
        ...z ? { autoSelectFamily: z, autoSelectFamilyAttemptTimeout: ce } : void 0,
        ...O
      })), q?.Client && Array.isArray(q.Client) ? (this[X] = q.Client, oe || (oe = !0, process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.", {
        code: "UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"
      }))) : this[X] = [Re({ maxRedirections: F })], this[c] = s.parseOrigin(R), this[ge] = O, this[m] = be ?? 1, this[U] = ie || A.maxHeaderSize, this[w] = Y ?? 4e3, this[S] = K ?? 6e5, this[G] = te ?? 2e3, this[b] = this[w], this[Q] = null, this[W] = x ?? null, this[y] = 0, this[B] = 0, this[g] = `host: ${this[c].hostname}${this[c].port ? `:${this[c].port}` : ""}\r
`, this[$] = ze ?? 3e5, this[v] = ue ?? 3e5, this[ne] = T ?? !0, this[ae] = F, this[Be] = H, this[fe] = null, this[re] = Ae > -1 ? Ae : -1, this[P] = Fe ?? 100, this[V] = null, this[L] = [], this[p] = 0, this[E] = 0, this[Z] = (Ne) => xe(this, Ne), this[J] = (Ne) => ke(this, Ne);
    }
    get pipelining() {
      return this[m];
    }
    set pipelining(R) {
      this[m] = R, this[Z](!0);
    }
    get [k]() {
      return this[L].length - this[E];
    }
    get [D]() {
      return this[E] - this[p];
    }
    get [N]() {
      return this[L].length - this[p];
    }
    get [M]() {
      return !!this[V] && !this[f] && !this[V].destroyed;
    }
    get [C]() {
      return !!(this[V]?.busy(null) || this[N] >= (pe(this) || 1) || this[k] > 0);
    }
    /* istanbul ignore: only used for test */
    [d](R) {
      de(this), this.once("connect", R);
    }
    [we](R, q) {
      const ie = R.origin || this[c].origin, ue = new n(ie, R, q);
      return this[L].push(ue), this[y] || (s.bodyLength(ue.body) == null && s.isIterable(ue.body) ? (this[y] = 1, queueMicrotask(() => xe(this))) : this[Z](!0)), this[y] && this[B] !== 2 && this[C] && (this[B] = 2), this[B] < 2;
    }
    async [Qe]() {
      return new Promise((R) => {
        this[N] ? this[fe] = R : R(null);
      });
    }
    async [ye](R) {
      return new Promise((q) => {
        const ie = this[L].splice(this[E]);
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
  const Re = Sr();
  function ke(j, R) {
    if (j[D] === 0 && R.code !== "UND_ERR_INFO" && R.code !== "UND_ERR_SOCKET") {
      e(j[E] === j[p]);
      const q = j[L].splice(j[p]);
      for (let ie = 0; ie < q.length; ie++) {
        const ue = q[ie];
        s.errorRequest(j, ue, R);
      }
      e(j[N] === 0);
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
        for (e(j[D] === 0); j[k] > 0 && j[L][j[E]].servername === j[Q]; ) {
          const De = j[L][j[E]++];
          s.errorRequest(j, De, Ce);
        }
      else
        ke(j, Ce);
      j.emit("connectionError", j[c], [j], Ce);
    }
    j[Z]();
  }
  function We(j) {
    j[B] = 0, j.emit("drain", j[c], [j]);
  }
  function xe(j, R) {
    j[y] !== 2 && (j[y] = 2, Je(j, R), j[y] = 0, j[p] > 256 && (j[L].splice(0, j[p]), j[E] -= j[p], j[p] = 0));
  }
  function Je(j, R) {
    for (; ; ) {
      if (j.destroyed) {
        e(j[k] === 0);
        return;
      }
      if (j[fe] && !j[N]) {
        j[fe](), j[fe] = null;
        return;
      }
      if (j[V] && j[V].resume(), j[C])
        j[B] = 2;
      else if (j[B] === 2) {
        R ? (j[B] = 1, queueMicrotask(() => We(j))) : We(j);
        continue;
      }
      if (j[k] === 0 || j[D] >= (pe(j) || 1))
        return;
      const q = j[L][j[E]];
      if (j[c].protocol === "https:" && j[Q] !== q.servername) {
        if (j[D] > 0)
          return;
        j[Q] = q.servername, j[V]?.destroy(new u("servername changed"), () => {
          j[V] = null, xe(j);
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
      !q.aborted && j[V].write(q) ? j[E]++ : j[L].splice(j[E], 1);
    }
  }
  return Ur = Le, Ur;
}
var Nr, yo;
function Do() {
  if (yo) return Nr;
  yo = 1;
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
  return Nr = class {
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
  }, Nr;
}
var Mr, bo;
function wg() {
  if (bo) return Mr;
  bo = 1;
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
  return Mr = a, Mr;
}
var Lr, Ro;
function ko() {
  if (Ro) return Lr;
  Ro = 1;
  const e = Xt(), t = Do(), { kConnected: A, kSize: s, kRunning: r, kPending: n, kQueued: o, kBusy: a, kFree: u, kUrl: l, kClose: i, kDestroy: c, kDispatch: Q } = Ve(), h = wg(), C = /* @__PURE__ */ Symbol("clients"), d = /* @__PURE__ */ Symbol("needDrain"), y = /* @__PURE__ */ Symbol("queue"), D = /* @__PURE__ */ Symbol("closed resolve"), k = /* @__PURE__ */ Symbol("onDrain"), N = /* @__PURE__ */ Symbol("onConnect"), L = /* @__PURE__ */ Symbol("onDisconnect"), M = /* @__PURE__ */ Symbol("onConnectionError"), f = /* @__PURE__ */ Symbol("get dispatcher"), B = /* @__PURE__ */ Symbol("add client"), w = /* @__PURE__ */ Symbol("remove client"), g = /* @__PURE__ */ Symbol("stats");
  class E extends e {
    constructor() {
      super(), this[y] = new t(), this[C] = [], this[o] = 0;
      const I = this;
      this[k] = function(b, U) {
        const S = I[y];
        let G = !1;
        for (; !G; ) {
          const v = S.shift();
          if (!v)
            break;
          I[o]--, G = !this.dispatch(v.opts, v.handler);
        }
        this[d] = G, !this[d] && I[d] && (I[d] = !1, I.emit("drain", b, [I, ...U])), I[D] && S.isEmpty() && Promise.all(I[C].map((v) => v.close())).then(I[D]);
      }, this[N] = (m, b) => {
        I.emit("connect", m, [I, ...b]);
      }, this[L] = (m, b, U) => {
        I.emit("disconnect", m, [I, ...b], U);
      }, this[M] = (m, b, U) => {
        I.emit("connectionError", m, [I, ...b], U);
      }, this[g] = new h(this);
    }
    get [a]() {
      return this[d];
    }
    get [A]() {
      return this[C].filter((I) => I[A]).length;
    }
    get [u]() {
      return this[C].filter((I) => I[A] && !I[d]).length;
    }
    get [n]() {
      let I = this[o];
      for (const { [n]: m } of this[C])
        I += m;
      return I;
    }
    get [r]() {
      let I = 0;
      for (const { [r]: m } of this[C])
        I += m;
      return I;
    }
    get [s]() {
      let I = this[o];
      for (const { [s]: m } of this[C])
        I += m;
      return I;
    }
    get stats() {
      return this[g];
    }
    async [i]() {
      this[y].isEmpty() ? await Promise.all(this[C].map((I) => I.close())) : await new Promise((I) => {
        this[D] = I;
      });
    }
    async [c](I) {
      for (; ; ) {
        const m = this[y].shift();
        if (!m)
          break;
        m.handler.onError(I);
      }
      await Promise.all(this[C].map((m) => m.destroy(I)));
    }
    [Q](I, m) {
      const b = this[f]();
      return b ? b.dispatch(I, m) || (b[d] = !0, this[d] = !this[f]()) : (this[d] = !0, this[y].push({ opts: I, handler: m }), this[o]++), !this[d];
    }
    [B](I) {
      return I.on("drain", this[k]).on("connect", this[N]).on("disconnect", this[L]).on("connectionError", this[M]), this[C].push(I), this[d] && queueMicrotask(() => {
        this[d] && this[k](I[l], [this, I]);
      }), this;
    }
    [w](I) {
      I.close(() => {
        const m = this[C].indexOf(I);
        m !== -1 && this[C].splice(m, 1);
      }), this[d] = this[C].some((m) => !m[d] && m.closed !== !0 && m.destroyed !== !0);
    }
  }
  return Lr = {
    PoolBase: E,
    kClients: C,
    kNeedDrain: d,
    kAddClient: B,
    kRemoveClient: w,
    kGetDispatcher: f
  }, Lr;
}
var Gr, Fo;
function AA() {
  if (Fo) return Gr;
  Fo = 1;
  const {
    PoolBase: e,
    kClients: t,
    kNeedDrain: A,
    kAddClient: s,
    kGetDispatcher: r
  } = ko(), n = tA(), {
    InvalidArgumentError: o
  } = Ye(), a = Ue(), { kUrl: u, kInterceptors: l } = Ve(), i = DA(), c = /* @__PURE__ */ Symbol("options"), Q = /* @__PURE__ */ Symbol("connections"), h = /* @__PURE__ */ Symbol("factory");
  function C(y, D) {
    return new n(y, D);
  }
  class d extends e {
    constructor(D, {
      connections: k,
      factory: N = C,
      connect: L,
      connectTimeout: M,
      tls: f,
      maxCachedSessions: B,
      socketPath: w,
      autoSelectFamily: g,
      autoSelectFamilyAttemptTimeout: E,
      allowH2: p,
      ...I
    } = {}) {
      if (super(), k != null && (!Number.isFinite(k) || k < 0))
        throw new o("invalid connections");
      if (typeof N != "function")
        throw new o("factory must be a function.");
      if (L != null && typeof L != "function" && typeof L != "object")
        throw new o("connect must be a function or an object");
      typeof L != "function" && (L = i({
        ...f,
        maxCachedSessions: B,
        allowH2: p,
        socketPath: w,
        timeout: M,
        ...g ? { autoSelectFamily: g, autoSelectFamilyAttemptTimeout: E } : void 0,
        ...L
      })), this[l] = I.interceptors?.Pool && Array.isArray(I.interceptors.Pool) ? I.interceptors.Pool : [], this[Q] = k || null, this[u] = a.parseOrigin(D), this[c] = { ...a.deepClone(I), connect: L, allowH2: p }, this[c].interceptors = I.interceptors ? { ...I.interceptors } : void 0, this[h] = N, this.on("connectionError", (m, b, U) => {
        for (const S of b) {
          const G = this[t].indexOf(S);
          G !== -1 && this[t].splice(G, 1);
        }
      });
    }
    [r]() {
      for (const D of this[t])
        if (!D[A])
          return D;
      if (!this[Q] || this[t].length < this[Q]) {
        const D = this[h](this[u], this[c]);
        return this[s](D), D;
      }
    }
  }
  return Gr = d, Gr;
}
var vr, To;
function mg() {
  if (To) return vr;
  To = 1;
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
  } = ko(), u = AA(), { kUrl: l, kInterceptors: i } = Ve(), { parseOrigin: c } = Ue(), Q = /* @__PURE__ */ Symbol("factory"), h = /* @__PURE__ */ Symbol("options"), C = /* @__PURE__ */ Symbol("kGreatestCommonDivisor"), d = /* @__PURE__ */ Symbol("kCurrentWeight"), y = /* @__PURE__ */ Symbol("kIndex"), D = /* @__PURE__ */ Symbol("kWeight"), k = /* @__PURE__ */ Symbol("kMaxWeightPerServer"), N = /* @__PURE__ */ Symbol("kErrorPenalty");
  function L(B, w) {
    if (B === 0) return w;
    for (; w !== 0; ) {
      const g = w;
      w = B % w, B = g;
    }
    return B;
  }
  function M(B, w) {
    return new u(B, w);
  }
  class f extends A {
    constructor(w = [], { factory: g = M, ...E } = {}) {
      if (super(), this[h] = E, this[y] = -1, this[d] = 0, this[k] = this[h].maxWeightPerServer || 100, this[N] = this[h].errorPenalty || 15, Array.isArray(w) || (w = [w]), typeof g != "function")
        throw new t("factory must be a function.");
      this[i] = E.interceptors?.BalancedPool && Array.isArray(E.interceptors.BalancedPool) ? E.interceptors.BalancedPool : [], this[Q] = g;
      for (const p of w)
        this.addUpstream(p);
      this._updateBalancedPoolStats();
    }
    addUpstream(w) {
      const g = c(w).origin;
      if (this[s].find((p) => p[l].origin === g && p.closed !== !0 && p.destroyed !== !0))
        return this;
      const E = this[Q](g, Object.assign({}, this[h]));
      this[n](E), E.on("connect", () => {
        E[D] = Math.min(this[k], E[D] + this[N]);
      }), E.on("connectionError", () => {
        E[D] = Math.max(1, E[D] - this[N]), this._updateBalancedPoolStats();
      }), E.on("disconnect", (...p) => {
        const I = p[2];
        I && I.code === "UND_ERR_SOCKET" && (E[D] = Math.max(1, E[D] - this[N]), this._updateBalancedPoolStats());
      });
      for (const p of this[s])
        p[D] = this[k];
      return this._updateBalancedPoolStats(), this;
    }
    _updateBalancedPoolStats() {
      let w = 0;
      for (let g = 0; g < this[s].length; g++)
        w = L(this[s][g][D], w);
      this[C] = w;
    }
    removeUpstream(w) {
      const g = c(w).origin, E = this[s].find((p) => p[l].origin === g && p.closed !== !0 && p.destroyed !== !0);
      return E && this[o](E), this;
    }
    get upstreams() {
      return this[s].filter((w) => w.closed !== !0 && w.destroyed !== !0).map((w) => w[l].origin);
    }
    [a]() {
      if (this[s].length === 0)
        throw new e();
      if (!this[s].find((I) => !I[r] && I.closed !== !0 && I.destroyed !== !0) || this[s].map((I) => I[r]).reduce((I, m) => I && m, !0))
        return;
      let E = 0, p = this[s].findIndex((I) => !I[r]);
      for (; E++ < this[s].length; ) {
        this[y] = (this[y] + 1) % this[s].length;
        const I = this[s][this[y]];
        if (I[D] > this[s][p][D] && !I[r] && (p = this[y]), this[y] === 0 && (this[d] = this[d] - this[C], this[d] <= 0 && (this[d] = this[k])), I[D] >= this[d] && !I[r])
          return I;
      }
      return this[d] = this[s][p][D], this[y] = p, this[s][p];
    }
  }
  return vr = f, vr;
}
var Yr, So;
function rA() {
  if (So) return Yr;
  So = 1;
  const { InvalidArgumentError: e } = Ye(), { kClients: t, kRunning: A, kClose: s, kDestroy: r, kDispatch: n, kInterceptors: o } = Ve(), a = Xt(), u = AA(), l = tA(), i = Ue(), c = Sr(), Q = /* @__PURE__ */ Symbol("onConnect"), h = /* @__PURE__ */ Symbol("onDisconnect"), C = /* @__PURE__ */ Symbol("onConnectionError"), d = /* @__PURE__ */ Symbol("maxRedirections"), y = /* @__PURE__ */ Symbol("onDrain"), D = /* @__PURE__ */ Symbol("factory"), k = /* @__PURE__ */ Symbol("options");
  function N(M, f) {
    return f && f.connections === 1 ? new l(M, f) : new u(M, f);
  }
  class L extends a {
    constructor({ factory: f = N, maxRedirections: B = 0, connect: w, ...g } = {}) {
      if (super(), typeof f != "function")
        throw new e("factory must be a function.");
      if (w != null && typeof w != "function" && typeof w != "object")
        throw new e("connect must be a function or an object");
      if (!Number.isInteger(B) || B < 0)
        throw new e("maxRedirections must be a positive number");
      w && typeof w != "function" && (w = { ...w }), this[o] = g.interceptors?.Agent && Array.isArray(g.interceptors.Agent) ? g.interceptors.Agent : [c({ maxRedirections: B })], this[k] = { ...i.deepClone(g), connect: w }, this[k].interceptors = g.interceptors ? { ...g.interceptors } : void 0, this[d] = B, this[D] = f, this[t] = /* @__PURE__ */ new Map(), this[y] = (E, p) => {
        this.emit("drain", E, [this, ...p]);
      }, this[Q] = (E, p) => {
        this.emit("connect", E, [this, ...p]);
      }, this[h] = (E, p, I) => {
        this.emit("disconnect", E, [this, ...p], I);
      }, this[C] = (E, p, I) => {
        this.emit("connectionError", E, [this, ...p], I);
      };
    }
    get [A]() {
      let f = 0;
      for (const B of this[t].values())
        f += B[A];
      return f;
    }
    [n](f, B) {
      let w;
      if (f.origin && (typeof f.origin == "string" || f.origin instanceof URL))
        w = String(f.origin);
      else
        throw new e("opts.origin must be a non-empty string or URL.");
      let g = this[t].get(w);
      return g || (g = this[D](f.origin, this[k]).on("drain", this[y]).on("connect", this[Q]).on("disconnect", this[h]).on("connectionError", this[C]), this[t].set(w, g)), g.dispatch(f, B);
    }
    async [s]() {
      const f = [];
      for (const B of this[t].values())
        f.push(B.close());
      this[t].clear(), await Promise.all(f);
    }
    async [r](f) {
      const B = [];
      for (const w of this[t].values())
        B.push(w.destroy(f));
      this[t].clear(), await Promise.all(B);
    }
  }
  return Yr = L, Yr;
}
var Jr, Uo;
function No() {
  if (Uo) return Jr;
  Uo = 1;
  const { kProxy: e, kClose: t, kDestroy: A, kDispatch: s, kInterceptors: r } = Ve(), { URL: n } = $c, o = rA(), a = AA(), u = Xt(), { InvalidArgumentError: l, RequestAbortedError: i, SecureProxyConnectionError: c } = Ye(), Q = DA(), h = tA(), C = /* @__PURE__ */ Symbol("proxy agent"), d = /* @__PURE__ */ Symbol("proxy client"), y = /* @__PURE__ */ Symbol("proxy headers"), D = /* @__PURE__ */ Symbol("request tls settings"), k = /* @__PURE__ */ Symbol("proxy tls settings"), N = /* @__PURE__ */ Symbol("connect endpoint function"), L = /* @__PURE__ */ Symbol("tunnel proxy");
  function M(m) {
    return m === "https:" ? 443 : 80;
  }
  function f(m, b) {
    return new a(m, b);
  }
  const B = () => {
  };
  function w(m, b) {
    return b.connections === 1 ? new h(m, b) : new a(m, b);
  }
  class g extends u {
    #e;
    constructor(b, { headers: U = {}, connect: S, factory: G }) {
      if (super(), !b)
        throw new l("Proxy URL is mandatory");
      this[y] = U, G ? this.#e = G(b, { connect: S }) : this.#e = new h(b, { connect: S });
    }
    [s](b, U) {
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
      } = b;
      if (b.path = G + v, !("host" in $) && !("Host" in $)) {
        const { host: ne } = new n(G);
        $.host = ne;
      }
      return b.headers = { ...this[y], ...$ }, this.#e[s](b, U);
    }
    async [t]() {
      return this.#e.close();
    }
    async [A](b) {
      return this.#e.destroy(b);
    }
  }
  class E extends u {
    constructor(b) {
      if (super(), !b || typeof b == "object" && !(b instanceof n) && !b.uri)
        throw new l("Proxy uri is mandatory");
      const { clientFactory: U = f } = b;
      if (typeof U != "function")
        throw new l("Proxy opts.clientFactory must be a function.");
      const { proxyTunnel: S = !0 } = b, G = this.#e(b), { href: v, origin: $, port: ne, protocol: ge, username: ae, password: Be, hostname: he } = G;
      if (this[e] = { uri: v, protocol: ge }, this[r] = b.interceptors?.ProxyAgent && Array.isArray(b.interceptors.ProxyAgent) ? b.interceptors.ProxyAgent : [], this[D] = b.requestTls, this[k] = b.proxyTls, this[y] = b.headers || {}, this[L] = S, b.auth && b.token)
        throw new l("opts.auth cannot be used in combination with opts.token");
      b.auth ? this[y]["proxy-authorization"] = `Basic ${b.auth}` : b.token ? this[y]["proxy-authorization"] = b.token : ae && Be && (this[y]["proxy-authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(ae)}:${decodeURIComponent(Be)}`).toString("base64")}`);
      const Qe = Q({ ...b.proxyTls });
      this[N] = Q({ ...b.requestTls });
      const ye = b.factory || w, we = (X, W) => {
        const { protocol: re } = new n(X);
        return !this[L] && re === "http:" && this[e].protocol === "http:" ? new g(this[e].uri, {
          headers: this[y],
          connect: Qe,
          factory: ye
        }) : ye(X, W);
      };
      this[d] = U(G, { connect: Qe }), this[C] = new o({
        ...b,
        factory: we,
        connect: async (X, W) => {
          let re = X.host;
          X.port || (re += `:${M(X.protocol)}`);
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
              servername: this[k]?.servername || he
            });
            if (V !== 200 && (J.on("error", B).destroy(), W(new i(`Proxy response (${V}) !== 200 when HTTP Tunneling`))), X.protocol !== "https:") {
              W(null, J);
              return;
            }
            let P;
            this[D] ? P = this[D].servername : P = X.servername, this[N]({ ...X, servername: P, httpSocket: J }, W);
          } catch (J) {
            J.code === "ERR_TLS_CERT_ALTNAME_INVALID" ? W(new c(J)) : W(J);
          }
        }
      });
    }
    dispatch(b, U) {
      const S = p(b.headers);
      if (I(S), S && !("host" in S) && !("Host" in S)) {
        const { host: G } = new n(b.origin);
        S.host = G;
      }
      return this[C].dispatch(
        {
          ...b,
          headers: S
        },
        U
      );
    }
    /**
     * @param {import('../types/proxy-agent').ProxyAgent.Options | string | URL} opts
     * @returns {URL}
     */
    #e(b) {
      return typeof b == "string" ? new n(b) : b instanceof n ? b : new n(b.uri);
    }
    async [t]() {
      await this[C].close(), await this[d].close();
    }
    async [A]() {
      await this[C].destroy(), await this[d].destroy();
    }
  }
  function p(m) {
    if (Array.isArray(m)) {
      const b = {};
      for (let U = 0; U < m.length; U += 2)
        b[m[U]] = m[U + 1];
      return b;
    }
    return m;
  }
  function I(m) {
    if (m && Object.keys(m).find((U) => U.toLowerCase() === "proxy-authorization"))
      throw new l("Proxy-Authorization should be sent in ProxyAgent constructor");
  }
  return Jr = E, Jr;
}
var Hr, Mo;
function yg() {
  if (Mo) return Hr;
  Mo = 1;
  const e = Xt(), { kClose: t, kDestroy: A, kClosed: s, kDestroyed: r, kDispatch: n, kNoProxyAgent: o, kHttpProxyAgent: a, kHttpsProxyAgent: u } = Ve(), l = No(), i = rA(), c = {
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
      const { httpProxy: y, httpsProxy: D, noProxy: k, ...N } = d;
      this[o] = new i(N);
      const L = y ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
      L ? this[a] = new l({ ...N, uri: L }) : this[a] = this[o];
      const M = D ?? process.env.https_proxy ?? process.env.HTTPS_PROXY;
      M ? this[u] = new l({ ...N, uri: M }) : this[u] = this[a], this.#n();
    }
    [n](d, y) {
      const D = new URL(d.origin);
      return this.#r(D).dispatch(d, y);
    }
    async [t]() {
      await this[o].close(), this[a][s] || await this[a].close(), this[u][s] || await this[u].close();
    }
    async [A](d) {
      await this[o].destroy(d), this[a][r] || await this[a].destroy(d), this[u][r] || await this[u].destroy(d);
    }
    #r(d) {
      let { protocol: y, host: D, port: k } = d;
      return D = D.replace(/:\d*$/, "").toLowerCase(), k = Number.parseInt(k, 10) || c[y] || 0, this.#A(D, k) ? y === "https:" ? this[u] : this[a] : this[o];
    }
    #A(d, y) {
      if (this.#o && this.#n(), this.#t.length === 0)
        return !0;
      if (this.#e === "*")
        return !1;
      for (let D = 0; D < this.#t.length; D++) {
        const k = this.#t[D];
        if (!(k.port && k.port !== y)) {
          if (/^[.*]/.test(k.hostname)) {
            if (d.endsWith(k.hostname.replace(/^\*/, "")))
              return !1;
          } else if (d === k.hostname)
            return !1;
        }
      }
      return !0;
    }
    #n() {
      const d = this.#s.noProxy ?? this.#i, y = d.split(/[,\s]/), D = [];
      for (let k = 0; k < y.length; k++) {
        const N = y[k];
        if (!N)
          continue;
        const L = N.match(/^(.+):(\d+)$/);
        D.push({
          hostname: (L ? L[1] : N).toLowerCase(),
          port: L ? Number.parseInt(L[2], 10) : 0
        });
      }
      this.#e = d, this.#t = D;
    }
    get #o() {
      return this.#s.noProxy !== void 0 ? !1 : this.#e !== this.#i;
    }
    get #i() {
      return process.env.no_proxy ?? process.env.NO_PROXY ?? "";
    }
  }
  return Hr = h, Hr;
}
var Or, Lo;
function Pr() {
  if (Lo) return Or;
  Lo = 1;
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
        retry: C,
        maxRetries: d,
        maxTimeout: y,
        minTimeout: D,
        timeoutFactor: k,
        // Response scoped
        methods: N,
        errorCodes: L,
        retryAfter: M,
        statusCodes: f
      } = Q ?? {};
      this.dispatch = c.dispatch, this.handler = c.handler, this.opts = { ...h, body: o(i.body) }, this.abort = null, this.aborted = !1, this.retryOpts = {
        retry: C ?? u[t],
        retryAfter: M ?? !0,
        maxTimeout: y ?? 30 * 1e3,
        // 30s,
        minTimeout: D ?? 500,
        // .5s
        timeoutFactor: k ?? 2,
        maxRetries: d ?? 5,
        // What errors we should retry
        methods: N ?? ["GET", "HEAD", "OPTIONS", "PUT", "DELETE", "TRACE"],
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
      }, this.retryCount = 0, this.retryCountCheckpoint = 0, this.start = 0, this.end = null, this.etag = null, this.resume = null, this.handler.onConnect((B) => {
        this.aborted = !0, this.abort ? this.abort(B) : this.reason = B;
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
      const { statusCode: C, code: d, headers: y } = i, { method: D, retryOptions: k } = Q, {
        maxRetries: N,
        minTimeout: L,
        maxTimeout: M,
        timeoutFactor: f,
        statusCodes: B,
        errorCodes: w,
        methods: g
      } = k, { counter: E } = c;
      if (d && d !== "UND_ERR_REQ_RETRY" && !w.includes(d)) {
        h(i);
        return;
      }
      if (Array.isArray(g) && !g.includes(D)) {
        h(i);
        return;
      }
      if (C != null && Array.isArray(B) && !B.includes(C)) {
        h(i);
        return;
      }
      if (E > N) {
        h(i);
        return;
      }
      let p = y?.["retry-after"];
      p && (p = Number(p), p = Number.isNaN(p) ? a(p) : p * 1e3);
      const I = p > 0 ? Math.min(p, M) : Math.min(L * f ** (E - 1), M);
      setTimeout(() => h(null), I);
    }
    onHeaders(i, c, Q, h) {
      const C = r(c);
      if (this.retryCount += 1, i >= 300)
        return this.retryOpts.statusCodes.includes(i) === !1 ? this.handler.onHeaders(
          i,
          c,
          Q,
          h
        ) : (this.abort(
          new A("Request failed", i, {
            headers: C,
            data: {
              count: this.retryCount
            }
          })
        ), !1);
      if (this.resume != null) {
        if (this.resume = null, i !== 206 && (this.start > 0 || i !== 200))
          return this.abort(
            new A("server does not support the range header and the payload was partially consumed", i, {
              headers: C,
              data: { count: this.retryCount }
            })
          ), !1;
        const y = n(C["content-range"]);
        if (!y)
          return this.abort(
            new A("Content-Range mismatch", i, {
              headers: C,
              data: { count: this.retryCount }
            })
          ), !1;
        if (this.etag != null && this.etag !== C.etag)
          return this.abort(
            new A("ETag mismatch", i, {
              headers: C,
              data: { count: this.retryCount }
            })
          ), !1;
        const { start: D, size: k, end: N = k - 1 } = y;
        return e(this.start === D, "content-range mismatch"), e(this.end == null || this.end === N, "content-range mismatch"), this.resume = Q, !0;
      }
      if (this.end == null) {
        if (i === 206) {
          const y = n(C["content-range"]);
          if (y == null)
            return this.handler.onHeaders(
              i,
              c,
              Q,
              h
            );
          const { start: D, size: k, end: N = k - 1 } = y;
          e(
            D != null && Number.isFinite(D),
            "content-range mismatch"
          ), e(N != null && Number.isFinite(N), "invalid content-length"), this.start = D, this.end = N;
        }
        if (this.end == null) {
          const y = C["content-length"];
          this.end = y != null ? Number(y) - 1 : null;
        }
        return e(Number.isFinite(this.start)), e(
          this.end == null || Number.isFinite(this.end),
          "invalid content-length"
        ), this.resume = Q, this.etag = C.etag != null ? C.etag : null, this.etag != null && this.etag.startsWith("W/") && (this.etag = null), this.handler.onHeaders(
          i,
          c,
          Q,
          h
        );
      }
      const d = new A("Request failed", i, {
        headers: C,
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
  return Or = u, Or;
}
var xr, Go;
function Dg() {
  if (Go) return xr;
  Go = 1;
  const e = yA(), t = Pr();
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
  return xr = A, xr;
}
var St = {}, kA = { exports: {} }, _r, vo;
function Yo() {
  if (vo) return _r;
  vo = 1;
  const e = He, { Readable: t } = ot, { RequestAbortedError: A, NotSupportedError: s, InvalidArgumentError: r, AbortError: n } = Ye(), o = Ue(), { ReadableStreamFrom: a } = Ue(), u = /* @__PURE__ */ Symbol("kConsume"), l = /* @__PURE__ */ Symbol("kReading"), i = /* @__PURE__ */ Symbol("kBody"), c = /* @__PURE__ */ Symbol("kAbort"), Q = /* @__PURE__ */ Symbol("kContentType"), h = /* @__PURE__ */ Symbol("kContentLength"), C = () => {
  };
  class d extends t {
    constructor({
      resume: E,
      abort: p,
      contentType: I = "",
      contentLength: m,
      highWaterMark: b = 64 * 1024
      // Same as nodejs fs streams.
    }) {
      super({
        autoDestroy: !0,
        read: E,
        highWaterMark: b
      }), this._readableState.dataEmitted = !1, this[c] = p, this[u] = null, this[i] = null, this[Q] = I, this[h] = m, this[l] = !1;
    }
    destroy(E) {
      return !E && !this._readableState.endEmitted && (E = new A()), E && this[c](), super.destroy(E);
    }
    _destroy(E, p) {
      this[l] ? p(E) : setImmediate(() => {
        p(E);
      });
    }
    on(E, ...p) {
      return (E === "data" || E === "readable") && (this[l] = !0), super.on(E, ...p);
    }
    addListener(E, ...p) {
      return this.on(E, ...p);
    }
    off(E, ...p) {
      const I = super.off(E, ...p);
      return (E === "data" || E === "readable") && (this[l] = this.listenerCount("data") > 0 || this.listenerCount("readable") > 0), I;
    }
    removeListener(E, ...p) {
      return this.off(E, ...p);
    }
    push(E) {
      return this[u] && E !== null ? (B(this[u], E), this[l] ? super.push(E) : !0) : super.push(E);
    }
    // https://fetch.spec.whatwg.org/#dom-body-text
    async text() {
      return k(this, "text");
    }
    // https://fetch.spec.whatwg.org/#dom-body-json
    async json() {
      return k(this, "json");
    }
    // https://fetch.spec.whatwg.org/#dom-body-blob
    async blob() {
      return k(this, "blob");
    }
    // https://fetch.spec.whatwg.org/#dom-body-bytes
    async bytes() {
      return k(this, "bytes");
    }
    // https://fetch.spec.whatwg.org/#dom-body-arraybuffer
    async arrayBuffer() {
      return k(this, "arrayBuffer");
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
    async dump(E) {
      let p = Number.isFinite(E?.limit) ? E.limit : 131072;
      const I = E?.signal;
      if (I != null && (typeof I != "object" || !("aborted" in I)))
        throw new r("signal must be an AbortSignal");
      return I?.throwIfAborted(), this._readableState.closeEmitted ? null : await new Promise((m, b) => {
        this[h] > p && this.destroy(new n());
        const U = () => {
          this.destroy(I.reason ?? new n());
        };
        I?.addEventListener("abort", U), this.on("close", function() {
          I?.removeEventListener("abort", U), I?.aborted ? b(I.reason ?? new n()) : m(null);
        }).on("error", C).on("data", function(S) {
          p -= S.length, p <= 0 && this.destroy();
        }).resume();
      });
    }
  }
  function y(g) {
    return g[i] && g[i].locked === !0 || g[u];
  }
  function D(g) {
    return o.isDisturbed(g) || y(g);
  }
  async function k(g, E) {
    return e(!g[u]), new Promise((p, I) => {
      if (D(g)) {
        const m = g._readableState;
        m.destroyed && m.closeEmitted === !1 ? g.on("error", (b) => {
          I(b);
        }).on("close", () => {
          I(new TypeError("unusable"));
        }) : I(m.errored ?? new TypeError("unusable"));
      } else
        queueMicrotask(() => {
          g[u] = {
            type: E,
            stream: g,
            resolve: p,
            reject: I,
            length: 0,
            body: []
          }, g.on("error", function(m) {
            w(this[u], m);
          }).on("close", function() {
            this[u].body !== null && w(this[u], new A());
          }), N(g[u]);
        });
    });
  }
  function N(g) {
    if (g.body === null)
      return;
    const { _readableState: E } = g.stream;
    if (E.bufferIndex) {
      const p = E.bufferIndex, I = E.buffer.length;
      for (let m = p; m < I; m++)
        B(g, E.buffer[m]);
    } else
      for (const p of E.buffer)
        B(g, p);
    for (E.endEmitted ? f(this[u]) : g.stream.on("end", function() {
      f(this[u]);
    }), g.stream.resume(); g.stream.read() != null; )
      ;
  }
  function L(g, E) {
    if (g.length === 0 || E === 0)
      return "";
    const p = g.length === 1 ? g[0] : Buffer.concat(g, E), I = p.length, m = I > 2 && p[0] === 239 && p[1] === 187 && p[2] === 191 ? 3 : 0;
    return p.utf8Slice(m, I);
  }
  function M(g, E) {
    if (g.length === 0 || E === 0)
      return new Uint8Array(0);
    if (g.length === 1)
      return new Uint8Array(g[0]);
    const p = new Uint8Array(Buffer.allocUnsafeSlow(E).buffer);
    let I = 0;
    for (let m = 0; m < g.length; ++m) {
      const b = g[m];
      p.set(b, I), I += b.length;
    }
    return p;
  }
  function f(g) {
    const { type: E, body: p, resolve: I, stream: m, length: b } = g;
    try {
      E === "text" ? I(L(p, b)) : E === "json" ? I(JSON.parse(L(p, b))) : E === "arrayBuffer" ? I(M(p, b).buffer) : E === "blob" ? I(new Blob(p, { type: m[Q] })) : E === "bytes" && I(M(p, b)), w(g);
    } catch (U) {
      m.destroy(U);
    }
  }
  function B(g, E) {
    g.length += E.length, g.body.push(E);
  }
  function w(g, E) {
    g.body !== null && (E ? g.reject(E) : g.resolve(), g.type = null, g.stream = null, g.resolve = null, g.reject = null, g.length = 0, g.body = null);
  }
  return _r = { Readable: d, chunksDecode: L }, _r;
}
var Vr, Jo;
function Ho() {
  if (Jo) return Vr;
  Jo = 1;
  const e = He, {
    ResponseStatusCodeError: t
  } = Ye(), { chunksDecode: A } = Yo(), s = 128 * 1024;
  async function r({ callback: a, body: u, contentType: l, statusCode: i, statusMessage: c, headers: Q }) {
    e(u);
    let h = [], C = 0;
    try {
      for await (const k of u)
        if (h.push(k), C += k.length, C > s) {
          h = [], C = 0;
          break;
        }
    } catch {
      h = [], C = 0;
    }
    const d = `Response status code ${i}${c ? `: ${c}` : ""}`;
    if (i === 204 || !l || !C) {
      queueMicrotask(() => a(new t(d, i, Q)));
      return;
    }
    const y = Error.stackTraceLimit;
    Error.stackTraceLimit = 0;
    let D;
    try {
      n(l) ? D = JSON.parse(A(h, C)) : o(l) && (D = A(h, C));
    } catch {
    } finally {
      Error.stackTraceLimit = y;
    }
    queueMicrotask(() => a(new t(d, i, Q, D)));
  }
  const n = (a) => a.length > 15 && a[11] === "/" && a[0] === "a" && a[1] === "p" && a[2] === "p" && a[3] === "l" && a[4] === "i" && a[5] === "c" && a[6] === "a" && a[7] === "t" && a[8] === "i" && a[9] === "o" && a[10] === "n" && a[12] === "j" && a[13] === "s" && a[14] === "o" && a[15] === "n", o = (a) => a.length > 4 && a[4] === "/" && a[0] === "t" && a[1] === "e" && a[2] === "x" && a[3] === "t";
  return Vr = {
    getResolveErrorBodyCallback: r,
    isContentTypeApplicationJson: n,
    isContentTypeText: o
  }, Vr;
}
var Oo;
function bg() {
  if (Oo) return kA.exports;
  Oo = 1;
  const e = He, { Readable: t } = Yo(), { InvalidArgumentError: A, RequestAbortedError: s } = Ye(), r = Ue(), { getResolveErrorBodyCallback: n } = Ho(), { AsyncResource: o } = zt;
  class a extends o {
    constructor(i, c) {
      if (!i || typeof i != "object")
        throw new A("invalid opts");
      const { signal: Q, method: h, opaque: C, body: d, onInfo: y, responseHeaders: D, throwOnError: k, highWaterMark: N } = i;
      try {
        if (typeof c != "function")
          throw new A("invalid callback");
        if (N && (typeof N != "number" || N < 0))
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
      this.method = h, this.responseHeaders = D || null, this.opaque = C || null, this.callback = c, this.res = null, this.abort = null, this.body = d, this.trailers = {}, this.context = null, this.onInfo = y || null, this.throwOnError = k, this.highWaterMark = N, this.signal = Q, this.reason = null, this.removeAbortListener = null, r.isStream(d) && d.on("error", (L) => {
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
      const { callback: C, opaque: d, abort: y, context: D, responseHeaders: k, highWaterMark: N } = this, L = k === "raw" ? r.parseRawHeaders(c) : r.parseHeaders(c);
      if (i < 200) {
        this.onInfo && this.onInfo({ statusCode: i, headers: L });
        return;
      }
      const M = k === "raw" ? r.parseHeaders(c) : L, f = M["content-type"], B = M["content-length"], w = new t({
        resume: Q,
        abort: y,
        contentType: f,
        contentLength: this.method !== "HEAD" && B ? Number(B) : null,
        highWaterMark: N
      });
      this.removeAbortListener && w.on("close", this.removeAbortListener), this.callback = null, this.res = w, C !== null && (this.throwOnError && i >= 400 ? this.runInAsyncScope(
        n,
        null,
        { callback: C, body: w, contentType: f, statusCode: i, statusMessage: h, headers: L }
      ) : this.runInAsyncScope(C, null, null, {
        statusCode: i,
        headers: L,
        trailers: this.trailers,
        opaque: d,
        body: w,
        context: D
      }));
    }
    onData(i) {
      return this.res.push(i);
    }
    onComplete(i) {
      r.parseHeaders(i, this.trailers), this.res.push(null);
    }
    onError(i) {
      const { res: c, callback: Q, body: h, opaque: C } = this;
      Q && (this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(Q, null, i, { opaque: C });
      })), c && (this.res = null, queueMicrotask(() => {
        r.destroy(c, i);
      })), h && (this.body = null, r.destroy(h, i)), this.removeAbortListener && (c?.off("close", this.removeAbortListener), this.removeAbortListener(), this.removeAbortListener = null);
    }
  }
  function u(l, i) {
    if (i === void 0)
      return new Promise((c, Q) => {
        u.call(this, l, (h, C) => h ? Q(h) : c(C));
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
  return kA.exports = u, kA.exports.RequestHandler = a, kA.exports;
}
var Wr, Po;
function FA() {
  if (Po) return Wr;
  Po = 1;
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
  return Wr = {
    addSignal: n,
    removeSignal: o
  }, Wr;
}
var qr, xo;
function Rg() {
  if (xo) return qr;
  xo = 1;
  const e = He, { finished: t, PassThrough: A } = ot, { InvalidArgumentError: s, InvalidReturnValueError: r } = Ye(), n = Ue(), { getResolveErrorBodyCallback: o } = Ho(), { AsyncResource: a } = zt, { addSignal: u, removeSignal: l } = FA();
  class i extends a {
    constructor(h, C, d) {
      if (!h || typeof h != "object")
        throw new s("invalid opts");
      const { signal: y, method: D, opaque: k, body: N, onInfo: L, responseHeaders: M, throwOnError: f } = h;
      try {
        if (typeof d != "function")
          throw new s("invalid callback");
        if (typeof C != "function")
          throw new s("invalid factory");
        if (y && typeof y.on != "function" && typeof y.addEventListener != "function")
          throw new s("signal must be an EventEmitter or EventTarget");
        if (D === "CONNECT")
          throw new s("invalid method");
        if (L && typeof L != "function")
          throw new s("invalid onInfo callback");
        super("UNDICI_STREAM");
      } catch (B) {
        throw n.isStream(N) && n.destroy(N.on("error", n.nop), B), B;
      }
      this.responseHeaders = M || null, this.opaque = k || null, this.factory = C, this.callback = d, this.res = null, this.abort = null, this.context = null, this.trailers = null, this.body = N, this.onInfo = L || null, this.throwOnError = f || !1, n.isStream(N) && N.on("error", (B) => {
        this.onError(B);
      }), u(this, y);
    }
    onConnect(h, C) {
      if (this.reason) {
        h(this.reason);
        return;
      }
      e(this.callback), this.abort = h, this.context = C;
    }
    onHeaders(h, C, d, y) {
      const { factory: D, opaque: k, context: N, callback: L, responseHeaders: M } = this, f = M === "raw" ? n.parseRawHeaders(C) : n.parseHeaders(C);
      if (h < 200) {
        this.onInfo && this.onInfo({ statusCode: h, headers: f });
        return;
      }
      this.factory = null;
      let B;
      if (this.throwOnError && h >= 400) {
        const E = (M === "raw" ? n.parseHeaders(C) : f)["content-type"];
        B = new A(), this.callback = null, this.runInAsyncScope(
          o,
          null,
          { callback: L, body: B, contentType: E, statusCode: h, statusMessage: y, headers: f }
        );
      } else {
        if (D === null)
          return;
        if (B = this.runInAsyncScope(D, null, {
          statusCode: h,
          headers: f,
          opaque: k,
          context: N
        }), !B || typeof B.write != "function" || typeof B.end != "function" || typeof B.on != "function")
          throw new r("expected Writable");
        t(B, { readable: !1 }, (g) => {
          const { callback: E, res: p, opaque: I, trailers: m, abort: b } = this;
          this.res = null, (g || !p.readable) && n.destroy(p, g), this.callback = null, this.runInAsyncScope(E, null, g || null, { opaque: I, trailers: m }), g && b();
        });
      }
      return B.on("drain", d), this.res = B, (B.writableNeedDrain !== void 0 ? B.writableNeedDrain : B._writableState?.needDrain) !== !0;
    }
    onData(h) {
      const { res: C } = this;
      return C ? C.write(h) : !0;
    }
    onComplete(h) {
      const { res: C } = this;
      l(this), C && (this.trailers = n.parseHeaders(h), C.end());
    }
    onError(h) {
      const { res: C, callback: d, opaque: y, body: D } = this;
      l(this), this.factory = null, C ? (this.res = null, n.destroy(C, h)) : d && (this.callback = null, queueMicrotask(() => {
        this.runInAsyncScope(d, null, h, { opaque: y });
      })), D && (this.body = null, n.destroy(D, h));
    }
  }
  function c(Q, h, C) {
    if (C === void 0)
      return new Promise((d, y) => {
        c.call(this, Q, h, (D, k) => D ? y(D) : d(k));
      });
    try {
      this.dispatch(Q, new i(Q, h, C));
    } catch (d) {
      if (typeof C != "function")
        throw d;
      const y = Q?.opaque;
      queueMicrotask(() => C(d, { opaque: y }));
    }
  }
  return qr = c, qr;
}
var zr, _o;
function kg() {
  if (_o) return zr;
  _o = 1;
  const {
    Readable: e,
    Duplex: t,
    PassThrough: A
  } = ot, {
    InvalidArgumentError: s,
    InvalidReturnValueError: r,
    RequestAbortedError: n
  } = Ye(), o = Ue(), { AsyncResource: a } = zt, { addSignal: u, removeSignal: l } = FA(), i = He, c = /* @__PURE__ */ Symbol("resume");
  class Q extends e {
    constructor() {
      super({ autoDestroy: !0 }), this[c] = null;
    }
    _read() {
      const { [c]: D } = this;
      D && (this[c] = null, D());
    }
    _destroy(D, k) {
      this._read(), k(D);
    }
  }
  class h extends e {
    constructor(D) {
      super({ autoDestroy: !0 }), this[c] = D;
    }
    _read() {
      this[c]();
    }
    _destroy(D, k) {
      !D && !this._readableState.endEmitted && (D = new n()), k(D);
    }
  }
  class C extends a {
    constructor(D, k) {
      if (!D || typeof D != "object")
        throw new s("invalid opts");
      if (typeof k != "function")
        throw new s("invalid handler");
      const { signal: N, method: L, opaque: M, onInfo: f, responseHeaders: B } = D;
      if (N && typeof N.on != "function" && typeof N.addEventListener != "function")
        throw new s("signal must be an EventEmitter or EventTarget");
      if (L === "CONNECT")
        throw new s("invalid method");
      if (f && typeof f != "function")
        throw new s("invalid onInfo callback");
      super("UNDICI_PIPELINE"), this.opaque = M || null, this.responseHeaders = B || null, this.handler = k, this.abort = null, this.context = null, this.onInfo = f || null, this.req = new Q().on("error", o.nop), this.ret = new t({
        readableObjectMode: D.objectMode,
        autoDestroy: !0,
        read: () => {
          const { body: w } = this;
          w?.resume && w.resume();
        },
        write: (w, g, E) => {
          const { req: p } = this;
          p.push(w, g) || p._readableState.destroyed ? E() : p[c] = E;
        },
        destroy: (w, g) => {
          const { body: E, req: p, res: I, ret: m, abort: b } = this;
          !w && !m._readableState.endEmitted && (w = new n()), b && w && b(), o.destroy(E, w), o.destroy(p, w), o.destroy(I, w), l(this), g(w);
        }
      }).on("prefinish", () => {
        const { req: w } = this;
        w.push(null);
      }), this.res = null, u(this, N);
    }
    onConnect(D, k) {
      const { ret: N, res: L } = this;
      if (this.reason) {
        D(this.reason);
        return;
      }
      i(!L, "pipeline cannot be retried"), i(!N.destroyed), this.abort = D, this.context = k;
    }
    onHeaders(D, k, N) {
      const { opaque: L, handler: M, context: f } = this;
      if (D < 200) {
        if (this.onInfo) {
          const w = this.responseHeaders === "raw" ? o.parseRawHeaders(k) : o.parseHeaders(k);
          this.onInfo({ statusCode: D, headers: w });
        }
        return;
      }
      this.res = new h(N);
      let B;
      try {
        this.handler = null;
        const w = this.responseHeaders === "raw" ? o.parseRawHeaders(k) : o.parseHeaders(k);
        B = this.runInAsyncScope(M, null, {
          statusCode: D,
          headers: w,
          opaque: L,
          body: this.res,
          context: f
        });
      } catch (w) {
        throw this.res.on("error", o.nop), w;
      }
      if (!B || typeof B.on != "function")
        throw new r("expected Readable");
      B.on("data", (w) => {
        const { ret: g, body: E } = this;
        !g.push(w) && E.pause && E.pause();
      }).on("error", (w) => {
        const { ret: g } = this;
        o.destroy(g, w);
      }).on("end", () => {
        const { ret: w } = this;
        w.push(null);
      }).on("close", () => {
        const { ret: w } = this;
        w._readableState.ended || o.destroy(w, new n());
      }), this.body = B;
    }
    onData(D) {
      const { res: k } = this;
      return k.push(D);
    }
    onComplete(D) {
      const { res: k } = this;
      k.push(null);
    }
    onError(D) {
      const { ret: k } = this;
      this.handler = null, o.destroy(k, D);
    }
  }
  function d(y, D) {
    try {
      const k = new C(y, D);
      return this.dispatch({ ...y, body: k.req }, k), k.ret;
    } catch (k) {
      return new A().destroy(k);
    }
  }
  return zr = d, zr;
}
var Zr, Vo;
function Fg() {
  if (Vo) return Zr;
  Vo = 1;
  const { InvalidArgumentError: e, SocketError: t } = Ye(), { AsyncResource: A } = zt, s = Ue(), { addSignal: r, removeSignal: n } = FA(), o = He;
  class a extends A {
    constructor(i, c) {
      if (!i || typeof i != "object")
        throw new e("invalid opts");
      if (typeof c != "function")
        throw new e("invalid callback");
      const { signal: Q, opaque: h, responseHeaders: C } = i;
      if (Q && typeof Q.on != "function" && typeof Q.addEventListener != "function")
        throw new e("signal must be an EventEmitter or EventTarget");
      super("UNDICI_UPGRADE"), this.responseHeaders = C || null, this.opaque = h || null, this.callback = c, this.abort = null, this.context = null, r(this, Q);
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
      const { callback: h, opaque: C, context: d } = this;
      n(this), this.callback = null;
      const y = this.responseHeaders === "raw" ? s.parseRawHeaders(c) : s.parseHeaders(c);
      this.runInAsyncScope(h, null, null, {
        headers: y,
        socket: Q,
        opaque: C,
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
        u.call(this, l, (h, C) => h ? Q(h) : c(C));
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
  return Zr = u, Zr;
}
var Kr, Wo;
function Tg() {
  if (Wo) return Kr;
  Wo = 1;
  const e = He, { AsyncResource: t } = zt, { InvalidArgumentError: A, SocketError: s } = Ye(), r = Ue(), { addSignal: n, removeSignal: o } = FA();
  class a extends t {
    constructor(i, c) {
      if (!i || typeof i != "object")
        throw new A("invalid opts");
      if (typeof c != "function")
        throw new A("invalid callback");
      const { signal: Q, opaque: h, responseHeaders: C } = i;
      if (Q && typeof Q.on != "function" && typeof Q.addEventListener != "function")
        throw new A("signal must be an EventEmitter or EventTarget");
      super("UNDICI_CONNECT"), this.opaque = h || null, this.responseHeaders = C || null, this.callback = c, this.abort = null, n(this, Q);
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
      const { callback: h, opaque: C, context: d } = this;
      o(this), this.callback = null;
      let y = c;
      y != null && (y = this.responseHeaders === "raw" ? r.parseRawHeaders(c) : r.parseHeaders(c)), this.runInAsyncScope(h, null, null, {
        statusCode: i,
        headers: y,
        socket: Q,
        opaque: C,
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
        u.call(this, l, (h, C) => h ? Q(h) : c(C));
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
  return Kr = u, Kr;
}
var qo;
function Sg() {
  return qo || (qo = 1, St.request = bg(), St.stream = Rg(), St.pipeline = kg(), St.upgrade = Fg(), St.connect = Tg()), St;
}
var jr, zo;
function Zo() {
  if (zo) return jr;
  zo = 1;
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
  return jr = {
    MockNotMatchedError: A
  }, jr;
}
var Xr, Ko;
function sA() {
  return Ko || (Ko = 1, Xr = {
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
  }), Xr;
}
var $r, jo;
function TA() {
  if (jo) return $r;
  jo = 1;
  const { MockNotMatchedError: e } = Zo(), {
    kDispatches: t,
    kMockAgent: A,
    kOriginalDispatch: s,
    kOrigin: r,
    kGetNetConnect: n
  } = sA(), { buildURL: o } = Ue(), { STATUS_CODES: a } = wA, {
    types: {
      isPromise: u
    }
  } = rt;
  function l(I, m) {
    return typeof I == "string" ? I === m : I instanceof RegExp ? I.test(m) : typeof I == "function" ? I(m) === !0 : !1;
  }
  function i(I) {
    return Object.fromEntries(
      Object.entries(I).map(([m, b]) => [m.toLocaleLowerCase(), b])
    );
  }
  function c(I, m) {
    if (Array.isArray(I)) {
      for (let b = 0; b < I.length; b += 2)
        if (I[b].toLocaleLowerCase() === m.toLocaleLowerCase())
          return I[b + 1];
      return;
    } else return typeof I.get == "function" ? I.get(m) : i(I)[m.toLocaleLowerCase()];
  }
  function Q(I) {
    const m = I.slice(), b = [];
    for (let U = 0; U < m.length; U += 2)
      b.push([m[U], m[U + 1]]);
    return Object.fromEntries(b);
  }
  function h(I, m) {
    if (typeof I.headers == "function")
      return Array.isArray(m) && (m = Q(m)), I.headers(m ? i(m) : {});
    if (typeof I.headers > "u")
      return !0;
    if (typeof m != "object" || typeof I.headers != "object")
      return !1;
    for (const [b, U] of Object.entries(I.headers)) {
      const S = c(m, b);
      if (!l(U, S))
        return !1;
    }
    return !0;
  }
  function C(I) {
    if (typeof I != "string")
      return I;
    const m = I.split("?");
    if (m.length !== 2)
      return I;
    const b = new URLSearchParams(m.pop());
    return b.sort(), [...m, b.toString()].join("?");
  }
  function d(I, { path: m, method: b, body: U, headers: S }) {
    const G = l(I.path, m), v = l(I.method, b), $ = typeof I.body < "u" ? l(I.body, U) : !0, ne = h(I, S);
    return G && v && $ && ne;
  }
  function y(I) {
    return Buffer.isBuffer(I) || I instanceof Uint8Array || I instanceof ArrayBuffer ? I : typeof I == "object" ? JSON.stringify(I) : I.toString();
  }
  function D(I, m) {
    const b = m.query ? o(m.path, m.query) : m.path, U = typeof b == "string" ? C(b) : b;
    let S = I.filter(({ consumed: G }) => !G).filter(({ path: G }) => l(C(G), U));
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
  function k(I, m, b) {
    const U = { timesInvoked: 0, times: 1, persist: !1, consumed: !1 }, S = typeof b == "function" ? { callback: b } : { ...b }, G = { ...U, ...m, pending: !0, data: { error: null, ...S } };
    return I.push(G), G;
  }
  function N(I, m) {
    const b = I.findIndex((U) => U.consumed ? d(U, m) : !1);
    b !== -1 && I.splice(b, 1);
  }
  function L(I) {
    const { path: m, method: b, body: U, headers: S, query: G } = I;
    return {
      path: m,
      method: b,
      body: U,
      headers: S,
      query: G
    };
  }
  function M(I) {
    const m = Object.keys(I), b = [];
    for (let U = 0; U < m.length; ++U) {
      const S = m[U], G = I[S], v = Buffer.from(`${S}`);
      if (Array.isArray(G))
        for (let $ = 0; $ < G.length; ++$)
          b.push(v, Buffer.from(`${G[$]}`));
      else
        b.push(v, Buffer.from(`${G}`));
    }
    return b;
  }
  function f(I) {
    return a[I] || "unknown";
  }
  async function B(I) {
    const m = [];
    for await (const b of I)
      m.push(b);
    return Buffer.concat(m).toString("utf8");
  }
  function w(I, m) {
    const b = L(I), U = D(this[t], b);
    U.timesInvoked++, U.data.callback && (U.data = { ...U.data, ...U.data.callback(I) });
    const { data: { statusCode: S, data: G, headers: v, trailers: $, error: ne }, delay: ge, persist: ae } = U, { timesInvoked: Be, times: he } = U;
    if (U.consumed = !ae && Be >= he, U.pending = Be < he, ne !== null)
      return N(this[t], b), m.onError(ne), !0;
    typeof ge == "number" && ge > 0 ? setTimeout(() => {
      Qe(this[t]);
    }, ge) : Qe(this[t]);
    function Qe(we, X = G) {
      const W = Array.isArray(I.headers) ? Q(I.headers) : I.headers, re = typeof X == "function" ? X({ ...I, headers: W }) : X;
      if (u(re)) {
        re.then((Z) => Qe(we, Z));
        return;
      }
      const J = y(re), V = M(v), P = M($);
      m.onConnect?.((Z) => m.onError(Z), null), m.onHeaders?.(S, V, ye, f(S)), m.onData?.(Buffer.from(J)), m.onComplete?.(P), N(we, b);
    }
    function ye() {
    }
    return !0;
  }
  function g() {
    const I = this[A], m = this[r], b = this[s];
    return function(S, G) {
      if (I.isMockActive)
        try {
          w.call(this, S, G);
        } catch (v) {
          if (v instanceof e) {
            const $ = I[n]();
            if ($ === !1)
              throw new e(`${v.message}: subsequent request to origin ${m} was not allowed (net.connect disabled)`);
            if (E($, m))
              b.call(this, S, G);
            else
              throw new e(`${v.message}: subsequent request to origin ${m} was not allowed (net.connect is not enabled for this origin)`);
          } else
            throw v;
        }
      else
        b.call(this, S, G);
    };
  }
  function E(I, m) {
    const b = new URL(m);
    return I === !0 ? !0 : !!(Array.isArray(I) && I.some((U) => l(U, b.host)));
  }
  function p(I) {
    if (I) {
      const { agent: m, ...b } = I;
      return b;
    }
  }
  return $r = {
    getResponseData: y,
    getMockDispatch: D,
    addMockDispatch: k,
    deleteMockDispatch: N,
    buildKey: L,
    generateKeyValues: M,
    matchValue: l,
    getResponse: B,
    getStatusText: f,
    mockDispatch: w,
    buildMockDispatch: g,
    checkNetConnect: E,
    buildMockOptions: p,
    getHeaderByName: c,
    buildHeadersFromArray: Q
  }, $r;
}
var SA = {}, Xo;
function $o() {
  if (Xo) return SA;
  Xo = 1;
  const { getResponseData: e, buildKey: t, addMockDispatch: A } = TA(), {
    kDispatches: s,
    kDispatchKey: r,
    kDefaultHeaders: n,
    kDefaultTrailers: o,
    kContentLength: a,
    kMockDispatch: u
  } = sA(), { InvalidArgumentError: l } = Ye(), { buildURL: i } = Ue();
  class c {
    constructor(C) {
      this[u] = C;
    }
    /**
     * Delay a reply by a set amount in ms.
     */
    delay(C) {
      if (typeof C != "number" || !Number.isInteger(C) || C <= 0)
        throw new l("waitInMs must be a valid integer > 0");
      return this[u].delay = C, this;
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
    times(C) {
      if (typeof C != "number" || !Number.isInteger(C) || C <= 0)
        throw new l("repeatTimes must be a valid integer > 0");
      return this[u].times = C, this;
    }
  }
  class Q {
    constructor(C, d) {
      if (typeof C != "object")
        throw new l("opts must be an object");
      if (typeof C.path > "u")
        throw new l("opts.path must be defined");
      if (typeof C.method > "u" && (C.method = "GET"), typeof C.path == "string")
        if (C.query)
          C.path = i(C.path, C.query);
        else {
          const y = new URL(C.path, "data://");
          C.path = y.pathname + y.search;
        }
      typeof C.method == "string" && (C.method = C.method.toUpperCase()), this[r] = t(C), this[s] = d, this[n] = {}, this[o] = {}, this[a] = !1;
    }
    createMockScopeDispatchData({ statusCode: C, data: d, responseOptions: y }) {
      const D = e(d), k = this[a] ? { "content-length": D.length } : {}, N = { ...this[n], ...k, ...y.headers }, L = { ...this[o], ...y.trailers };
      return { statusCode: C, data: d, headers: N, trailers: L };
    }
    validateReplyParameters(C) {
      if (typeof C.statusCode > "u")
        throw new l("statusCode must be defined");
      if (typeof C.responseOptions != "object" || C.responseOptions === null)
        throw new l("responseOptions must be an object");
    }
    /**
     * Mock an undici request with a defined reply.
     */
    reply(C) {
      if (typeof C == "function") {
        const k = (L) => {
          const M = C(L);
          if (typeof M != "object" || M === null)
            throw new l("reply options callback must return an object");
          const f = { data: "", responseOptions: {}, ...M };
          return this.validateReplyParameters(f), {
            ...this.createMockScopeDispatchData(f)
          };
        }, N = A(this[s], this[r], k);
        return new c(N);
      }
      const d = {
        statusCode: C,
        data: arguments[1] === void 0 ? "" : arguments[1],
        responseOptions: arguments[2] === void 0 ? {} : arguments[2]
      };
      this.validateReplyParameters(d);
      const y = this.createMockScopeDispatchData(d), D = A(this[s], this[r], y);
      return new c(D);
    }
    /**
     * Mock an undici request with a defined error.
     */
    replyWithError(C) {
      if (typeof C > "u")
        throw new l("error must be defined");
      const d = A(this[s], this[r], { error: C });
      return new c(d);
    }
    /**
     * Set default reply headers on the interceptor for subsequent replies
     */
    defaultReplyHeaders(C) {
      if (typeof C > "u")
        throw new l("headers must be defined");
      return this[n] = C, this;
    }
    /**
     * Set default reply trailers on the interceptor for subsequent replies
     */
    defaultReplyTrailers(C) {
      if (typeof C > "u")
        throw new l("trailers must be defined");
      return this[o] = C, this;
    }
    /**
     * Set reply content length header for replies on the interceptor
     */
    replyContentLength() {
      return this[a] = !0, this;
    }
  }
  return SA.MockInterceptor = Q, SA.MockScope = c, SA;
}
var es, ei;
function ti() {
  if (ei) return es;
  ei = 1;
  const { promisify: e } = rt, t = tA(), { buildMockDispatch: A } = TA(), {
    kDispatches: s,
    kMockAgent: r,
    kClose: n,
    kOriginalClose: o,
    kOrigin: a,
    kOriginalDispatch: u,
    kConnected: l
  } = sA(), { MockInterceptor: i } = $o(), c = Ve(), { InvalidArgumentError: Q } = Ye();
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
  return es = h, es;
}
var ts, Ai;
function ri() {
  if (Ai) return ts;
  Ai = 1;
  const { promisify: e } = rt, t = AA(), { buildMockDispatch: A } = TA(), {
    kDispatches: s,
    kMockAgent: r,
    kClose: n,
    kOriginalClose: o,
    kOrigin: a,
    kOriginalDispatch: u,
    kConnected: l
  } = sA(), { MockInterceptor: i } = $o(), c = Ve(), { InvalidArgumentError: Q } = Ye();
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
  return ts = h, ts;
}
var As, si;
function Ug() {
  if (si) return As;
  si = 1;
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
  return As = class {
    constructor(s, r) {
      this.singular = s, this.plural = r;
    }
    pluralize(s) {
      const r = s === 1, n = r ? e : t, o = r ? this.singular : this.plural;
      return { ...n, count: s, noun: o };
    }
  }, As;
}
var rs, ni;
function Ng() {
  if (ni) return rs;
  ni = 1;
  const { Transform: e } = ot, { Console: t } = eg, A = process.versions.icu ? "\u2705" : "Y ", s = process.versions.icu ? "\u274C" : "N ";
  return rs = class {
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
  }, rs;
}
var ss, oi;
function Mg() {
  if (oi) return ss;
  oi = 1;
  const { kClients: e } = Ve(), t = rA(), {
    kAgent: A,
    kMockAgentSet: s,
    kMockAgentGet: r,
    kDispatches: n,
    kIsMockActive: o,
    kNetConnect: a,
    kGetNetConnect: u,
    kOptions: l,
    kFactory: i
  } = sA(), c = ti(), Q = ri(), { matchValue: h, buildMockOptions: C } = TA(), { InvalidArgumentError: d, UndiciError: y } = Ye(), D = yA(), k = Ug(), N = Ng();
  class L extends D {
    constructor(f) {
      if (super(f), this[a] = !0, this[o] = !0, f?.agent && typeof f.agent.dispatch != "function")
        throw new d("Argument opts.agent must implement Agent");
      const B = f?.agent ? f.agent : new t(f);
      this[A] = B, this[e] = B[e], this[l] = C(f);
    }
    get(f) {
      let B = this[r](f);
      return B || (B = this[i](f), this[s](f, B)), B;
    }
    dispatch(f, B) {
      return this.get(f.origin), this[A].dispatch(f, B);
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
    [s](f, B) {
      this[e].set(f, B);
    }
    [i](f) {
      const B = Object.assign({ agent: this }, this[l]);
      return this[l] && this[l].connections === 1 ? new c(f, B) : new Q(f, B);
    }
    [r](f) {
      const B = this[e].get(f);
      if (B)
        return B;
      if (typeof f != "string") {
        const w = this[i]("http://localhost:9999");
        return this[s](f, w), w;
      }
      for (const [w, g] of Array.from(this[e]))
        if (g && typeof w != "string" && h(w, f)) {
          const E = this[i](f);
          return this[s](f, E), E[n] = g[n], E;
        }
    }
    [u]() {
      return this[a];
    }
    pendingInterceptors() {
      const f = this[e];
      return Array.from(f.entries()).flatMap(([B, w]) => w[n].map((g) => ({ ...g, origin: B }))).filter(({ pending: B }) => B);
    }
    assertNoPendingInterceptors({ pendingInterceptorsFormatter: f = new N() } = {}) {
      const B = this.pendingInterceptors();
      if (B.length === 0)
        return;
      const w = new k("interceptor", "interceptors").pluralize(B.length);
      throw new y(`
${w.count} ${w.noun} ${w.is} pending:

${f.format(B)}
`.trim());
    }
  }
  return ss = L, ss;
}
var ns, ii;
function os() {
  if (ii) return ns;
  ii = 1;
  const e = /* @__PURE__ */ Symbol.for("undici.globalDispatcher.1"), { InvalidArgumentError: t } = Ye(), A = rA();
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
  return ns = {
    setGlobalDispatcher: s,
    getGlobalDispatcher: r
  }, ns;
}
var is, ai;
function as() {
  return ai || (ai = 1, is = class {
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
  }), is;
}
var cs, ci;
function Lg() {
  if (ci) return cs;
  ci = 1;
  const e = Fr();
  return cs = (t) => {
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
  }, cs;
}
var gs, gi;
function Gg() {
  if (gi) return gs;
  gi = 1;
  const e = Pr();
  return gs = (t) => (A) => function(r, n) {
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
  }, gs;
}
var ls, li;
function vg() {
  if (li) return ls;
  li = 1;
  const e = Ue(), { InvalidArgumentError: t, RequestAbortedError: A } = Ye(), s = as();
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
  return ls = n, ls;
}
var us, ui;
function Yg() {
  if (ui) return us;
  ui = 1;
  const { isIP: e } = pA, { lookup: t } = tg, A = as(), { InvalidArgumentError: s, InformationalError: r } = Ye(), n = Math.pow(2, 31) - 1;
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
        this.lookup(l, h, (C, d) => {
          if (C || d == null || d.length === 0) {
            c(C ?? new r("No DNS entries found"));
            return;
          }
          this.setRecords(l, d);
          const y = this.#s.get(l.hostname), D = this.pick(
            l,
            y,
            h.affinity
          );
          let k;
          typeof D.port == "number" ? k = `:${D.port}` : l.port !== "" ? k = `:${l.port}` : k = "", c(
            null,
            `${l.protocol}//${D.family === 6 ? `[${D.address}]` : D.address}${k}`
          );
        });
      else {
        const C = this.pick(
          l,
          Q,
          h.affinity
        );
        if (C == null) {
          this.#s.delete(l.hostname), this.runLookup(l, i, c);
          return;
        }
        let d;
        typeof C.port == "number" ? d = `:${C.port}` : l.port !== "" ? d = `:${l.port}` : d = "", c(
          null,
          `${l.protocol}//${C.family === 6 ? `[${C.address}]` : C.address}${d}`
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
          const C = /* @__PURE__ */ new Map();
          for (const d of h)
            C.set(`${d.address}:${d.family}`, d);
          c(null, C.values());
        }
      );
    }
    #A(l, i, c) {
      let Q = null;
      const { records: h, offset: C } = i;
      let d;
      if (this.dualStack ? (c == null && (C == null || C === n ? (i.offset = 0, c = 4) : (i.offset++, c = (i.offset & 1) === 1 ? 6 : 4)), h[c] != null && h[c].ips.length > 0 ? d = h[c] : d = h[c === 4 ? 6 : 4]) : d = h[c], d == null || d.ips.length === 0)
        return Q;
      d.offset == null || d.offset === n ? d.offset = 0 : d.offset++;
      const y = d.offset % d.ips.length;
      return Q = d.ips[y] ?? null, Q == null ? Q : Date.now() - Q.timestamp > Q.ttl ? (d.ips.splice(y, 1), this.pick(l, i, c)) : Q;
    }
    setRecords(l, i) {
      const c = Date.now(), Q = { records: { 4: null, 6: null } };
      for (const h of i) {
        h.timestamp = c, typeof h.ttl == "number" ? h.ttl = Math.min(h.ttl, this.#e) : h.ttl = this.#e;
        const C = Q.records[h.family] ?? { ips: [] };
        C.ips.push(h), Q.records[h.family] = C;
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
  return us = (u) => {
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
      const D = d.origin.constructor === URL ? d.origin : new URL(d.origin);
      return e(D.hostname) !== 0 ? h(d, y) : (Q.runLookup(D, d, (k, N) => {
        if (k)
          return y.onError(k);
        let L = null;
        L = {
          ...d,
          servername: D.hostname,
          // For SNI on TLS
          origin: N,
          headers: {
            host: D.hostname,
            ...d.headers
          }
        }, h(
          L,
          Q.getHandler({ origin: D, dispatch: h, handler: y }, d)
        );
      }), !0);
    };
  }, us;
}
var Es, Ei;
function Yt() {
  if (Ei) return Es;
  Ei = 1;
  const { kConstruct: e } = Ve(), { kEnumerableProperty: t } = Ue(), {
    iteratorMixin: A,
    isValidHeaderName: s,
    isValidHeaderValue: r
  } = it(), { webidl: n } = $e(), o = He, a = rt, u = /* @__PURE__ */ Symbol("headers map"), l = /* @__PURE__ */ Symbol("headers map sorted");
  function i(M) {
    return M === 10 || M === 13 || M === 9 || M === 32;
  }
  function c(M) {
    let f = 0, B = M.length;
    for (; B > f && i(M.charCodeAt(B - 1)); ) --B;
    for (; B > f && i(M.charCodeAt(f)); ) ++f;
    return f === 0 && B === M.length ? M : M.substring(f, B);
  }
  function Q(M, f) {
    if (Array.isArray(f))
      for (let B = 0; B < f.length; ++B) {
        const w = f[B];
        if (w.length !== 2)
          throw n.errors.exception({
            header: "Headers constructor",
            message: `expected name/value pair to be length 2, found ${w.length}.`
          });
        h(M, w[0], w[1]);
      }
    else if (typeof f == "object" && f !== null) {
      const B = Object.keys(f);
      for (let w = 0; w < B.length; ++w)
        h(M, B[w], f[B[w]]);
    } else
      throw n.errors.conversionFailed({
        prefix: "Headers constructor",
        argument: "Argument 1",
        types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
      });
  }
  function h(M, f, B) {
    if (B = c(B), s(f)) {
      if (!r(B))
        throw n.errors.invalidArgument({
          prefix: "Headers.append",
          value: B,
          type: "header value"
        });
    } else throw n.errors.invalidArgument({
      prefix: "Headers.append",
      value: f,
      type: "header name"
    });
    if (D(M) === "immutable")
      throw new TypeError("immutable");
    return N(M).append(f, B, !1);
  }
  function C(M, f) {
    return M[0] < f[0] ? -1 : 1;
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
    contains(f, B) {
      return this[u].has(B ? f : f.toLowerCase());
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
    append(f, B, w) {
      this[l] = null;
      const g = w ? f : f.toLowerCase(), E = this[u].get(g);
      if (E) {
        const p = g === "cookie" ? "; " : ", ";
        this[u].set(g, {
          name: E.name,
          value: `${E.value}${p}${B}`
        });
      } else
        this[u].set(g, { name: f, value: B });
      g === "set-cookie" && (this.cookies ??= []).push(B);
    }
    /**
     * @see https://fetch.spec.whatwg.org/#concept-header-list-set
     * @param {string} name
     * @param {string} value
     * @param {boolean} isLowerCase
     */
    set(f, B, w) {
      this[l] = null;
      const g = w ? f : f.toLowerCase();
      g === "set-cookie" && (this.cookies = [B]), this[u].set(g, { name: f, value: B });
    }
    /**
     * @see https://fetch.spec.whatwg.org/#concept-header-list-delete
     * @param {string} name
     * @param {boolean} isLowerCase
     */
    delete(f, B) {
      this[l] = null, B || (f = f.toLowerCase()), f === "set-cookie" && (this.cookies = null), this[u].delete(f);
    }
    /**
     * @see https://fetch.spec.whatwg.org/#concept-header-list-get
     * @param {string} name
     * @param {boolean} isLowerCase
     * @returns {string | null}
     */
    get(f, B) {
      return this[u].get(B ? f : f.toLowerCase())?.value ?? null;
    }
    *[Symbol.iterator]() {
      for (const { 0: f, 1: { value: B } } of this[u])
        yield [f, B];
    }
    get entries() {
      const f = {};
      if (this[u].size !== 0)
        for (const { name: B, value: w } of this[u].values())
          f[B] = w;
      return f;
    }
    rawValues() {
      return this[u].values();
    }
    get entriesList() {
      const f = [];
      if (this[u].size !== 0)
        for (const { 0: B, 1: { name: w, value: g } } of this[u])
          if (B === "set-cookie")
            for (const E of this.cookies)
              f.push([w, E]);
          else
            f.push([w, g]);
      return f;
    }
    // https://fetch.spec.whatwg.org/#convert-header-names-to-a-sorted-lowercase-set
    toSortedArray() {
      const f = this[u].size, B = new Array(f);
      if (f <= 32) {
        if (f === 0)
          return B;
        const w = this[u][Symbol.iterator](), g = w.next().value;
        B[0] = [g[0], g[1].value], o(g[1].value !== null);
        for (let E = 1, p = 0, I = 0, m = 0, b = 0, U, S; E < f; ++E) {
          for (S = w.next().value, U = B[E] = [S[0], S[1].value], o(U[1] !== null), m = 0, I = E; m < I; )
            b = m + (I - m >> 1), B[b][0] <= U[0] ? m = b + 1 : I = b;
          if (E !== b) {
            for (p = E; p > m; )
              B[p] = B[--p];
            B[m] = U;
          }
        }
        if (!w.next().done)
          throw new TypeError("Unreachable");
        return B;
      } else {
        let w = 0;
        for (const { 0: g, 1: { value: E } } of this[u])
          B[w++] = [g, E], o(E !== null);
        return B.sort(C);
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
    append(f, B) {
      n.brandCheck(this, y), n.argumentLengthCheck(arguments, 2, "Headers.append");
      const w = "Headers.append";
      return f = n.converters.ByteString(f, w, "name"), B = n.converters.ByteString(B, w, "value"), h(this, f, B);
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
      const B = "Headers.get";
      if (f = n.converters.ByteString(f, B, "name"), !s(f))
        throw n.errors.invalidArgument({
          prefix: B,
          value: f,
          type: "header name"
        });
      return this.#t.get(f, !1);
    }
    // https://fetch.spec.whatwg.org/#dom-headers-has
    has(f) {
      n.brandCheck(this, y), n.argumentLengthCheck(arguments, 1, "Headers.has");
      const B = "Headers.has";
      if (f = n.converters.ByteString(f, B, "name"), !s(f))
        throw n.errors.invalidArgument({
          prefix: B,
          value: f,
          type: "header name"
        });
      return this.#t.contains(f, !1);
    }
    // https://fetch.spec.whatwg.org/#dom-headers-set
    set(f, B) {
      n.brandCheck(this, y), n.argumentLengthCheck(arguments, 2, "Headers.set");
      const w = "Headers.set";
      if (f = n.converters.ByteString(f, w, "name"), B = n.converters.ByteString(B, w, "value"), B = c(B), s(f)) {
        if (!r(B))
          throw n.errors.invalidArgument({
            prefix: w,
            value: B,
            type: "header value"
          });
      } else throw n.errors.invalidArgument({
        prefix: w,
        value: f,
        type: "header name"
      });
      if (this.#e === "immutable")
        throw new TypeError("immutable");
      this.#t.set(f, B, !1);
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
      const f = [], B = this.#t.toSortedArray(), w = this.#t.cookies;
      if (w === null || w.length === 1)
        return this.#t[l] = B;
      for (let g = 0; g < B.length; ++g) {
        const { 0: E, 1: p } = B[g];
        if (E === "set-cookie")
          for (let I = 0; I < w.length; ++I)
            f.push([E, w[I]]);
        else
          f.push([E, p]);
      }
      return this.#t[l] = f;
    }
    [a.inspect.custom](f, B) {
      return B.depth ??= f, `Headers ${a.formatWithOptions(B, this.#t.entries)}`;
    }
    static getHeadersGuard(f) {
      return f.#e;
    }
    static setHeadersGuard(f, B) {
      f.#e = B;
    }
    static getHeadersList(f) {
      return f.#t;
    }
    static setHeadersList(f, B) {
      f.#t = B;
    }
  }
  const { getHeadersGuard: D, setHeadersGuard: k, getHeadersList: N, setHeadersList: L } = y;
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
  }), n.converters.HeadersInit = function(M, f, B) {
    if (n.util.Type(M) === "Object") {
      const w = Reflect.get(M, Symbol.iterator);
      if (!a.types.isProxy(M) && w === y.prototype.entries)
        try {
          return N(M).entriesList;
        } catch {
        }
      return typeof w == "function" ? n.converters["sequence<sequence<ByteString>>"](M, f, B, w.bind(M)) : n.converters["record<ByteString, ByteString>"](M, f, B);
    }
    throw n.errors.conversionFailed({
      prefix: "Headers constructor",
      argument: "Argument 1",
      types: ["sequence<sequence<ByteString>>", "record<ByteString, ByteString>"]
    });
  }, Es = {
    fill: Q,
    // for test.
    compareHeaderName: C,
    Headers: y,
    HeadersList: d,
    getHeadersGuard: D,
    setHeadersGuard: k,
    setHeadersList: L,
    getHeadersList: N
  }, Es;
}
var Qs, Qi;
function UA() {
  if (Qi) return Qs;
  Qi = 1;
  const { Headers: e, HeadersList: t, fill: A, getHeadersGuard: s, setHeadersGuard: r, setHeadersList: n } = Yt(), { extractBody: o, cloneBody: a, mixinBody: u, hasFinalizationRegistry: l, streamRegistry: i, bodyUnusable: c } = eA(), Q = Ue(), h = rt, { kEnumerableProperty: C } = Q, {
    isValidReasonPhrase: d,
    isCancelled: y,
    isAborted: D,
    isBlobLike: k,
    serializeJavascriptValueToJSONString: N,
    isErrorLike: L,
    isomorphicEncode: M,
    environmentSettingsObject: f
  } = it(), {
    redirectStatusSet: B,
    nullBodyStatus: w
  } = bA(), { kState: g, kHeaders: E } = Tt(), { webidl: p } = $e(), { FormData: I } = RA(), { URLSerializer: m } = st(), { kConstruct: b } = Ve(), U = He, { types: S } = rt, G = new TextEncoder("utf-8");
  class v {
    // Creates network error Response.
    static error() {
      return we(ge(), "immutable");
    }
    // https://fetch.spec.whatwg.org/#dom-response-json
    static json(W, re = {}) {
      p.argumentLengthCheck(arguments, 1, "Response.json"), re !== null && (re = p.converters.ResponseInit(re));
      const J = G.encode(
        N(W)
      ), V = o(J), P = we(ne({}), "response");
      return ye(P, re, { body: V[0], type: "application/json" }), P;
    }
    // Creates a redirect Response that redirects to url with status status.
    static redirect(W, re = 302) {
      p.argumentLengthCheck(arguments, 1, "Response.redirect"), W = p.converters.USVString(W), re = p.converters["unsigned short"](re);
      let J;
      try {
        J = new URL(W, f.settingsObject.baseUrl);
      } catch (Z) {
        throw new TypeError(`Failed to parse URL from ${W}`, { cause: Z });
      }
      if (!B.has(re))
        throw new RangeError(`Invalid status code ${re}`);
      const V = we(ne({}), "immutable");
      V[g].status = re;
      const P = M(m(J));
      return V[g].headersList.append("location", P, !0), V;
    }
    // https://fetch.spec.whatwg.org/#dom-response
    constructor(W = null, re = {}) {
      if (p.util.markAsUncloneable(this), W === b)
        return;
      W !== null && (W = p.converters.BodyInit(W)), re = p.converters.ResponseInit(re), this[g] = ne({}), this[E] = new e(b), r(this[E], "response"), n(this[E], this[g].headersList);
      let J = null;
      if (W != null) {
        const [V, P] = o(W);
        J = { body: V, type: P };
      }
      ye(this, re, J);
    }
    // Returns response’s type, e.g., "cors".
    get type() {
      return p.brandCheck(this, v), this[g].type;
    }
    // Returns response’s URL, if it has one; otherwise the empty string.
    get url() {
      p.brandCheck(this, v);
      const W = this[g].urlList, re = W[W.length - 1] ?? null;
      return re === null ? "" : m(re, !0);
    }
    // Returns whether response was obtained through a redirect.
    get redirected() {
      return p.brandCheck(this, v), this[g].urlList.length > 1;
    }
    // Returns response’s status.
    get status() {
      return p.brandCheck(this, v), this[g].status;
    }
    // Returns whether response’s status is an ok status.
    get ok() {
      return p.brandCheck(this, v), this[g].status >= 200 && this[g].status <= 299;
    }
    // Returns response’s status message.
    get statusText() {
      return p.brandCheck(this, v), this[g].statusText;
    }
    // Returns response’s headers as Headers.
    get headers() {
      return p.brandCheck(this, v), this[E];
    }
    get body() {
      return p.brandCheck(this, v), this[g].body ? this[g].body.stream : null;
    }
    get bodyUsed() {
      return p.brandCheck(this, v), !!this[g].body && Q.isDisturbed(this[g].body.stream);
    }
    // Returns a clone of response.
    clone() {
      if (p.brandCheck(this, v), c(this))
        throw p.errors.exception({
          header: "Response.clone",
          message: "Body has already been consumed."
        });
      const W = $(this[g]);
      return l && this[g].body?.stream && i.register(this, new WeakRef(this[g].body.stream)), we(W, s(this[E]));
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
    type: C,
    url: C,
    status: C,
    ok: C,
    redirected: C,
    statusText: C,
    headers: C,
    clone: C,
    body: C,
    bodyUsed: C,
    [Symbol.toStringTag]: {
      value: "Response",
      configurable: !0
    }
  }), Object.defineProperties(v, {
    json: C,
    redirect: C,
    error: C
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
    return U(y(X)), D(X) ? ge(Object.assign(new DOMException("The operation was aborted.", "AbortError"), { cause: W })) : ge(Object.assign(new DOMException("Request was cancelled."), { cause: W }));
  }
  function ye(X, W, re) {
    if (W.status !== null && (W.status < 200 || W.status > 599))
      throw new RangeError('init["status"] must be in the range of 200 to 599, inclusive.');
    if ("statusText" in W && W.statusText != null && !d(String(W.statusText)))
      throw new TypeError("Invalid statusText");
    if ("status" in W && W.status != null && (X[g].status = W.status), "statusText" in W && W.statusText != null && (X[g].statusText = W.statusText), "headers" in W && W.headers != null && A(X[E], W.headers), re) {
      if (w.includes(X.status))
        throw p.errors.exception({
          header: "Response constructor",
          message: `Invalid response status code ${X.status}`
        });
      X[g].body = re.body, re.type != null && !X[g].headersList.contains("content-type", !0) && X[g].headersList.append("content-type", re.type, !0);
    }
  }
  function we(X, W) {
    const re = new v(b);
    return re[g] = X, re[E] = new e(b), n(re[E], X.headersList), r(re[E], W), l && X.body?.stream && i.register(re, new WeakRef(X.body.stream)), re;
  }
  return p.converters.ReadableStream = p.interfaceConverter(
    ReadableStream
  ), p.converters.FormData = p.interfaceConverter(
    I
  ), p.converters.URLSearchParams = p.interfaceConverter(
    URLSearchParams
  ), p.converters.XMLHttpRequestBodyInit = function(X, W, re) {
    return typeof X == "string" ? p.converters.USVString(X, W, re) : k(X) ? p.converters.Blob(X, W, re, { strict: !1 }) : ArrayBuffer.isView(X) || S.isArrayBuffer(X) ? p.converters.BufferSource(X, W, re) : Q.isFormDataLike(X) ? p.converters.FormData(X, W, re, { strict: !1 }) : X instanceof URLSearchParams ? p.converters.URLSearchParams(X, W, re) : p.converters.DOMString(X, W, re);
  }, p.converters.BodyInit = function(X, W, re) {
    return X instanceof ReadableStream ? p.converters.ReadableStream(X, W, re) : X?.[Symbol.asyncIterator] ? X : p.converters.XMLHttpRequestBodyInit(X, W, re);
  }, p.converters.ResponseInit = p.dictionaryConverter([
    {
      key: "status",
      converter: p.converters["unsigned short"],
      defaultValue: () => 200
    },
    {
      key: "statusText",
      converter: p.converters.ByteString,
      defaultValue: () => ""
    },
    {
      key: "headers",
      converter: p.converters.HeadersInit
    }
  ]), Qs = {
    isNetworkError: ae,
    makeNetworkError: ge,
    makeResponse: ne,
    makeAppropriateNetworkError: Qe,
    filterResponse: he,
    Response: v,
    cloneResponse: $,
    fromInnerResponse: we
  }, Qs;
}
var hs, hi;
function Jg() {
  if (hi) return hs;
  hi = 1;
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
  return hs = function() {
    return process.env.NODE_V8_COVERAGE && process.version.startsWith("v18") ? (process._rawDebug("Using compatibility WeakRef and FinalizationRegistry"), {
      WeakRef: A,
      FinalizationRegistry: s
    }) : { WeakRef, FinalizationRegistry };
  }, hs;
}
var Bs, Bi;
function nA() {
  if (Bi) return Bs;
  Bi = 1;
  const { extractBody: e, mixinBody: t, cloneBody: A, bodyUnusable: s } = eA(), { Headers: r, fill: n, HeadersList: o, setHeadersGuard: a, getHeadersGuard: u, setHeadersList: l, getHeadersList: i } = Yt(), { FinalizationRegistry: c } = Jg()(), Q = Ue(), h = rt, {
    isValidHTTPToken: C,
    sameOrigin: d,
    environmentSettingsObject: y
  } = it(), {
    forbiddenMethodsSet: D,
    corsSafeListedMethodsSet: k,
    referrerPolicy: N,
    requestRedirect: L,
    requestMode: M,
    requestCredentials: f,
    requestCache: B,
    requestDuplex: w
  } = bA(), { kEnumerableProperty: g, normalizedMethodRecordsBase: E, normalizedMethodRecords: p } = Q, { kHeaders: I, kSignal: m, kState: b, kDispatcher: U } = Tt(), { webidl: S } = $e(), { URLSerializer: G } = st(), { kConstruct: v } = Ve(), $ = He, { getMaxListeners: ne, setMaxListeners: ge, getEventListeners: ae, defaultMaxListeners: Be } = qt, he = /* @__PURE__ */ Symbol("abortController"), Qe = new c(({ signal: P, abort: Z }) => {
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
        this[U] = se.dispatcher || Z[U], $(Z instanceof W), oe = Z[b], pe = Z[m];
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
        const ie = p[q];
        if (ie !== void 0)
          oe.method = ie;
        else {
          if (!C(q))
            throw new TypeError(`'${q}' is not a valid HTTP method.`);
          const ue = q.toUpperCase();
          if (D.has(ue))
            throw new TypeError(`'${q}' HTTP method is unsupported.`);
          q = E[ue] ?? q, oe.method = q;
        }
        !X && oe.method === "patch" && (process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.", {
          code: "UNDICI-FETCH-patch"
        }), X = !0);
      }
      se.signal !== void 0 && (pe = se.signal), this[b] = oe;
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
        if (!k.has(oe.method))
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
      const xe = Z instanceof W ? Z[b].body : null;
      if ((se.body != null || xe != null) && (oe.method === "GET" || oe.method === "HEAD"))
        throw new TypeError("Request with GET/HEAD method cannot have body.");
      let Je = null;
      if (se.body != null) {
        const [q, ie] = e(
          se.body,
          oe.keepalive
        );
        Je = q, ie && !i(this[I]).contains("content-type", !0) && this[I].append("content-type", ie);
      }
      const j = Je ?? xe;
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
      if (Je == null && xe != null) {
        if (s(Z))
          throw new TypeError(
            "Cannot construct a Request with a Request object that has already been used."
          );
        const q = new TransformStream();
        xe.stream.pipeThrough(q), R = {
          source: xe.source,
          length: xe.length,
          stream: q.readable
        };
      }
      this[b].body = R;
    }
    // Returns request’s HTTP method, which is "GET" by default.
    get method() {
      return S.brandCheck(this, W), this[b].method;
    }
    // Returns the URL of request as a string.
    get url() {
      return S.brandCheck(this, W), G(this[b].url);
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
      return S.brandCheck(this, W), this[b].destination;
    }
    // Returns the referrer of request. Its value can be a same-origin URL if
    // explicitly set in init, the empty string to indicate no referrer, and
    // "about:client" when defaulting to the global’s default. This is used
    // during fetching to determine the value of the `Referer` header of the
    // request being made.
    get referrer() {
      return S.brandCheck(this, W), this[b].referrer === "no-referrer" ? "" : this[b].referrer === "client" ? "about:client" : this[b].referrer.toString();
    }
    // Returns the referrer policy associated with request.
    // This is used during fetching to compute the value of the request’s
    // referrer.
    get referrerPolicy() {
      return S.brandCheck(this, W), this[b].referrerPolicy;
    }
    // Returns the mode associated with request, which is a string indicating
    // whether the request will use CORS, or will be restricted to same-origin
    // URLs.
    get mode() {
      return S.brandCheck(this, W), this[b].mode;
    }
    // Returns the credentials mode associated with request,
    // which is a string indicating whether credentials will be sent with the
    // request always, never, or only when sent to a same-origin URL.
    get credentials() {
      return this[b].credentials;
    }
    // Returns the cache mode associated with request,
    // which is a string indicating how the request will
    // interact with the browser’s cache when fetching.
    get cache() {
      return S.brandCheck(this, W), this[b].cache;
    }
    // Returns the redirect mode associated with request,
    // which is a string indicating how redirects for the
    // request will be handled during fetching. A request
    // will follow redirects by default.
    get redirect() {
      return S.brandCheck(this, W), this[b].redirect;
    }
    // Returns request’s subresource integrity metadata, which is a
    // cryptographic hash of the resource being fetched. Its value
    // consists of multiple hashes separated by whitespace. [SRI]
    get integrity() {
      return S.brandCheck(this, W), this[b].integrity;
    }
    // Returns a boolean indicating whether or not request can outlive the
    // global in which it was created.
    get keepalive() {
      return S.brandCheck(this, W), this[b].keepalive;
    }
    // Returns a boolean indicating whether or not request is for a reload
    // navigation.
    get isReloadNavigation() {
      return S.brandCheck(this, W), this[b].reloadNavigation;
    }
    // Returns a boolean indicating whether or not request is for a history
    // navigation (a.k.a. back-forward navigation).
    get isHistoryNavigation() {
      return S.brandCheck(this, W), this[b].historyNavigation;
    }
    // Returns the signal associated with request, which is an AbortSignal
    // object indicating whether or not request has been aborted, and its
    // abort event handler.
    get signal() {
      return S.brandCheck(this, W), this[m];
    }
    get body() {
      return S.brandCheck(this, W), this[b].body ? this[b].body.stream : null;
    }
    get bodyUsed() {
      return S.brandCheck(this, W), !!this[b].body && Q.isDisturbed(this[b].body.stream);
    }
    get duplex() {
      return S.brandCheck(this, W), "half";
    }
    // Returns a clone of request.
    clone() {
      if (S.brandCheck(this, W), s(this))
        throw new TypeError("unusable");
      const Z = J(this[b]), se = new AbortController();
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
    return le[b] = P, le[m] = Z, le[I] = new r(v), l(le[I], P.headersList), a(le[I], se), le;
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
      allowedValues: N
    },
    {
      key: "mode",
      converter: S.converters.DOMString,
      // https://fetch.spec.whatwg.org/#concept-request-mode
      allowedValues: M
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
      allowedValues: B
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
      allowedValues: w
    },
    {
      key: "dispatcher",
      // undici specific option
      converter: S.converters.any
    }
  ]), Bs = { Request: W, makeRequest: re, fromInnerRequest: V, cloneRequest: J }, Bs;
}
var Cs, Ci;
function NA() {
  if (Ci) return Cs;
  Ci = 1;
  const {
    makeNetworkError: e,
    makeAppropriateNetworkError: t,
    filterResponse: A,
    makeResponse: s,
    fromInnerResponse: r
  } = UA(), { HeadersList: n } = Yt(), { Request: o, cloneRequest: a } = nA(), u = $A, {
    bytesMatch: l,
    makePolicyContainer: i,
    clonePolicyContainer: c,
    requestBadPort: Q,
    TAOCheck: h,
    appendRequestOriginHeader: C,
    responseLocationURL: d,
    requestCurrentURL: y,
    setRequestReferrerPolicyOnRedirect: D,
    tryUpgradeRequestToAPotentiallyTrustworthyURL: k,
    createOpaqueTimingInfo: N,
    appendFetchMetadata: L,
    corsCheck: M,
    crossOriginResourcePolicyCheck: f,
    determineRequestsReferrer: B,
    coarsenedSharedCurrentTime: w,
    createDeferredPromise: g,
    isBlobLike: E,
    sameOrigin: p,
    isCancelled: I,
    isAborted: m,
    isErrorLike: b,
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
  } = it(), { kState: ye, kDispatcher: we } = Tt(), X = He, { safelyExtractBody: W, extractBody: re } = eA(), {
    redirectStatusSet: J,
    nullBodyStatus: V,
    safeMethodsSet: P,
    requestBodyHeader: Z,
    subresourceSet: se
  } = bA(), le = qt, { Readable: oe, pipeline: fe, finished: Me } = ot, { addAbortListener: pe, isErrored: Le, isReadable: Re, bufferToLowerCasedHeaderName: ke } = Ue(), { dataURLProcessor: de, serializeAMimeType: We, minimizeSupportedMimeType: xe } = st(), { getGlobalDispatcher: Je } = os(), { webidl: j } = $e(), { STATUS_CODES: R } = wA, q = ["GET", "HEAD"], ie = typeof __UNDICI_IS_NODE__ < "u" || typeof esbuildDetection < "u" ? "node" : "undici";
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
  function De(F) {
    ze(F, "fetch");
  }
  function ve(F, O = void 0) {
    j.argumentLengthCheck(arguments, 1, "globalThis.fetch");
    let H = g(), x;
    try {
      x = new o(F, O);
    } catch (_e) {
      return H.reject(_e), H.promise;
    }
    const Ae = x[ye];
    if (x.signal.aborted)
      return Ie(H, Ae, null, x.signal.reason), H.promise;
    Ae.client.globalObject?.constructor?.name === "ServiceWorkerGlobalScope" && (Ae.serviceWorkers = "none");
    let ce = null, Fe = !1, Ge = null;
    return pe(
      x.signal,
      () => {
        Fe = !0, X(Ge != null), Ge.abort(x.signal.reason);
        const _e = ce?.deref();
        Ie(H, Ae, _e, x.signal.reason);
      }
    ), Ge = Y({
      request: Ae,
      processResponseEndOfBody: De,
      processResponse: (_e) => {
        if (!Fe) {
          if (_e.aborted) {
            Ie(H, Ae, ce, Ge.serializedAbortReason);
            return;
          }
          if (_e.type === "error") {
            H.reject(new TypeError("fetch failed", { cause: _e.error }));
            return;
          }
          ce = new WeakRef(r(_e, "immutable")), H.resolve(ce.deref()), H = null;
        }
      },
      dispatcher: x[we]
      // undici
    }), H.promise;
  }
  function ze(F, O = "other") {
    if (F.type === "error" && F.aborted || !F.urlList?.length)
      return;
    const H = F.urlList[0];
    let x = F.timingInfo, Ae = F.cacheState;
    $(H) && x !== null && (F.timingAllowPassed || (x = N({
      startTime: x.startTime
    }), Ae = ""), x.endTime = w(), F.timingInfo = x, Ke(
      x,
      H.href,
      O,
      globalThis,
      Ae
    ));
  }
  const Ke = performance.markResourceTiming;
  function Ie(F, O, H, x) {
    if (F && F.reject(x), O.body != null && Re(O.body?.stream) && O.body.stream.cancel(x).catch((z) => {
      if (z.code !== "ERR_INVALID_STATE")
        throw z;
    }), H == null)
      return;
    const Ae = H[ye];
    Ae.body != null && Re(Ae.body?.stream) && Ae.body.stream.cancel(x).catch((z) => {
      if (z.code !== "ERR_INVALID_STATE")
        throw z;
    });
  }
  function Y({
    request: F,
    processRequestBodyChunkLength: O,
    processRequestEndOfBody: H,
    processResponse: x,
    processResponseEndOfBody: Ae,
    processResponseConsumeBody: z,
    useParallelQueue: ce = !1,
    dispatcher: Fe = Je()
    // undici
  }) {
    X(Fe);
    let Ge = null, Ne = !1;
    F.client != null && (Ge = F.client.globalObject, Ne = F.client.crossOriginIsolatedCapability);
    const _e = w(Ne), lt = N({
      startTime: _e
    }), Te = {
      controller: new Ce(Fe),
      request: F,
      timingInfo: lt,
      processRequestBodyChunkLength: O,
      processRequestEndOfBody: H,
      processResponse: x,
      processResponseConsumeBody: z,
      processResponseEndOfBody: Ae,
      taskDestination: Ge,
      crossOriginIsolatedCapability: Ne
    };
    return X(!F.body || F.body.stream), F.window === "client" && (F.window = F.client?.globalObject?.constructor?.name === "Window" ? F.client : "no-window"), F.origin === "client" && (F.origin = F.client.origin), F.policyContainer === "client" && (F.client != null ? F.policyContainer = c(
      F.client.policyContainer
    ) : F.policyContainer = i()), F.headersList.contains("accept", !0) || F.headersList.append("accept", "*/*", !0), F.headersList.contains("accept-language", !0) || F.headersList.append("accept-language", "*", !0), F.priority, se.has(F.destination), ee(Te).catch((je) => {
      Te.controller.terminate(je);
    }), Te.controller;
  }
  async function ee(F, O = !1) {
    const H = F.request;
    let x = null;
    if (H.localURLsOnly && !v(y(H)) && (x = e("local URLs only")), k(H), Q(H) === "blocked" && (x = e("bad port")), H.referrerPolicy === "" && (H.referrerPolicy = H.policyContainer.referrerPolicy), H.referrer !== "no-referrer" && (H.referrer = B(H)), x === null && (x = await (async () => {
      const z = y(H);
      return (
        // - request’s current URL’s origin is same origin with request’s origin,
        //   and request’s response tainting is "basic"
        p(z, H.url) && H.responseTainting === "basic" || // request’s current URL’s scheme is "data"
        z.protocol === "data:" || // - request’s mode is "navigate" or "websocket"
        H.mode === "navigate" || H.mode === "websocket" ? (H.responseTainting = "basic", await K(F)) : H.mode === "same-origin" ? e('request mode cannot be "same-origin"') : H.mode === "no-cors" ? H.redirect !== "follow" ? e(
          'redirect mode cannot be "follow" for "no-cors" request'
        ) : (H.responseTainting = "opaque", await K(F)) : $(y(H)) ? (H.responseTainting = "cors", await be(F)) : e("URL scheme must be a HTTP(S) scheme")
      );
    })()), O)
      return x;
    x.status !== 0 && !x.internalResponse && (H.responseTainting, H.responseTainting === "basic" ? x = A(x, "basic") : H.responseTainting === "cors" ? x = A(x, "cors") : H.responseTainting === "opaque" ? x = A(x, "opaque") : X(!1));
    let Ae = x.status === 0 ? x : x.internalResponse;
    if (Ae.urlList.length === 0 && Ae.urlList.push(...H.urlList), H.timingAllowFailed || (x.timingAllowPassed = !0), x.type === "opaque" && Ae.status === 206 && Ae.rangeRequested && !H.headers.contains("range", !0) && (x = Ae = e()), x.status !== 0 && (H.method === "HEAD" || H.method === "CONNECT" || V.includes(Ae.status)) && (Ae.body = null, F.controller.dump = !0), H.integrity) {
      const z = (Fe) => Ee(F, e(Fe));
      if (H.responseTainting === "opaque" || x.body == null) {
        z(x.error);
        return;
      }
      const ce = (Fe) => {
        if (!l(Fe, H.integrity)) {
          z("integrity mismatch");
          return;
        }
        x.body = W(Fe)[0], Ee(F, x);
      };
      await U(x.body, ce, z);
    } else
      Ee(F, x);
  }
  function K(F) {
    if (I(F) && F.request.redirectCount === 0)
      return Promise.resolve(t(F));
    const { request: O } = F, { protocol: H } = y(O);
    switch (H) {
      case "about:":
        return Promise.resolve(e("about scheme is not supported"));
      case "blob:": {
        ue || (ue = ct.resolveObjectURL);
        const x = y(O);
        if (x.search.length !== 0)
          return Promise.resolve(e("NetworkError when attempting to fetch resource."));
        const Ae = ue(x.toString());
        if (O.method !== "GET" || !E(Ae))
          return Promise.resolve(e("invalid method"));
        const z = s(), ce = Ae.size, Fe = G(`${ce}`), Ge = Ae.type;
        if (O.headersList.contains("range", !0)) {
          z.rangeRequested = !0;
          const Ne = O.headersList.get("range", !0), _e = ae(Ne, !0);
          if (_e === "failure")
            return Promise.resolve(e("failed to fetch the data URL"));
          let { rangeStartValue: lt, rangeEndValue: Te } = _e;
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
        const x = y(O), Ae = de(x);
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
        return be(F).catch((x) => e(x));
      default:
        return Promise.resolve(e("unknown scheme"));
    }
  }
  function te(F, O) {
    F.request.done = !0, F.processResponseDone != null && queueMicrotask(() => F.processResponseDone(O));
  }
  function Ee(F, O) {
    let H = F.timingInfo;
    const x = () => {
      const z = Date.now();
      F.request.destination === "document" && (F.controller.fullTimingInfo = H), F.controller.reportTimingSteps = () => {
        if (F.request.url.protocol !== "https:")
          return;
        H.endTime = z;
        let Fe = O.cacheState;
        const Ge = O.bodyInfo;
        O.timingAllowPassed || (H = N(H), Fe = "");
        let Ne = 0;
        if (F.request.mode !== "navigator" || !O.hasCrossOriginRedirects) {
          Ne = O.status;
          const _e = Qe(O.headersList);
          _e !== "failure" && (Ge.contentType = xe(_e));
        }
        F.request.initiatorType != null && Ke(H, F.request.url.href, F.request.initiatorType, globalThis, Fe, Ge, Ne);
      };
      const ce = () => {
        F.request.done = !0, F.processResponseEndOfBody != null && queueMicrotask(() => F.processResponseEndOfBody(O)), F.request.initiatorType != null && F.controller.reportTimingSteps();
      };
      queueMicrotask(() => ce());
    };
    F.processResponse != null && queueMicrotask(() => {
      F.processResponse(O), F.processResponse = null;
    });
    const Ae = O.type === "error" ? O : O.internalResponse ?? O;
    Ae.body == null ? x() : Me(Ae.body.stream, () => {
      x();
    });
  }
  async function be(F) {
    const O = F.request;
    let H = null, x = null;
    const Ae = F.timingInfo;
    if (O.serviceWorkers, H === null) {
      if (O.redirect === "follow" && (O.serviceWorkers = "none"), x = H = await T(F), O.responseTainting === "cors" && M(O, H) === "failure")
        return e("cors failure");
      h(O, H) === "failure" && (O.timingAllowFailed = !0);
    }
    return (O.responseTainting === "opaque" || H.type === "opaque") && f(
      O.origin,
      O.client,
      O.destination,
      x
    ) === "blocked" ? e("blocked") : (J.has(x.status) && (O.redirect !== "manual" && F.controller.connection.destroy(void 0, !1), O.redirect === "error" ? H = e("unexpected redirect") : O.redirect === "manual" ? H = x : O.redirect === "follow" ? H = await Se(F, H) : X(!1)), H.timingInfo = Ae, H);
  }
  function Se(F, O) {
    const H = F.request, x = O.internalResponse ? O.internalResponse : O;
    let Ae;
    try {
      if (Ae = d(
        x,
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
    if (H.redirectCount += 1, H.mode === "cors" && (Ae.username || Ae.password) && !p(H, Ae))
      return Promise.resolve(e('cross origin not allowed for request mode "cors"'));
    if (H.responseTainting === "cors" && (Ae.username || Ae.password))
      return Promise.resolve(e(
        'URL cannot contain credentials for request mode "cors"'
      ));
    if (x.status !== 303 && H.body != null && H.body.source == null)
      return Promise.resolve(e());
    if ([301, 302].includes(x.status) && H.method === "POST" || x.status === 303 && !q.includes(H.method)) {
      H.method = "GET", H.body = null;
      for (const ce of Z)
        H.headersList.delete(ce);
    }
    p(y(H), Ae) || (H.headersList.delete("authorization", !0), H.headersList.delete("proxy-authorization", !0), H.headersList.delete("cookie", !0), H.headersList.delete("host", !0)), H.body != null && (X(H.body.source != null), H.body = W(H.body.source)[0]);
    const z = F.timingInfo;
    return z.redirectEndTime = z.postRedirectStartTime = w(F.crossOriginIsolatedCapability), z.redirectStartTime === 0 && (z.redirectStartTime = z.startTime), H.urlList.push(Ae), D(H, x), ee(F, !0);
  }
  async function T(F, O = !1, H = !1) {
    const x = F.request;
    let Ae = null, z = null, ce = null;
    x.window === "no-window" && x.redirect === "error" ? (Ae = F, z = x) : (z = a(x), Ae = { ...F }, Ae.request = z);
    const Fe = x.credentials === "include" || x.credentials === "same-origin" && x.responseTainting === "basic", Ge = z.body ? z.body.length : null;
    let Ne = null;
    if (z.body == null && ["POST", "PUT"].includes(z.method) && (Ne = "0"), Ge != null && (Ne = G(`${Ge}`)), Ne != null && z.headersList.append("content-length", Ne, !0), Ge != null && z.keepalive, z.referrer instanceof URL && z.headersList.append("referer", G(z.referrer.href), !0), C(z), L(z), z.headersList.contains("user-agent", !0) || z.headersList.append("user-agent", ie), z.cache === "default" && (z.headersList.contains("if-modified-since", !0) || z.headersList.contains("if-none-match", !0) || z.headersList.contains("if-unmodified-since", !0) || z.headersList.contains("if-match", !0) || z.headersList.contains("if-range", !0)) && (z.cache = "no-store"), z.cache === "no-cache" && !z.preventNoCacheCacheControlHeaderModification && !z.headersList.contains("cache-control", !0) && z.headersList.append("cache-control", "max-age=0", !0), (z.cache === "no-store" || z.cache === "reload") && (z.headersList.contains("pragma", !0) || z.headersList.append("pragma", "no-cache", !0), z.headersList.contains("cache-control", !0) || z.headersList.append("cache-control", "no-cache", !0)), z.headersList.contains("range", !0) && z.headersList.append("accept-encoding", "identity", !0), z.headersList.contains("accept-encoding", !0) || (ne(y(z)) ? z.headersList.append("accept-encoding", "br, gzip, deflate", !0) : z.headersList.append("accept-encoding", "gzip, deflate", !0)), z.headersList.delete("host", !0), z.cache = "no-store", z.cache !== "no-store" && z.cache, ce == null) {
      if (z.cache === "only-if-cached")
        return e("only if cached");
      const _e = await _(
        Ae,
        Fe,
        H
      );
      !P.has(z.method) && _e.status >= 200 && _e.status <= 399, ce == null && (ce = _e);
    }
    if (ce.urlList = [...z.urlList], z.headersList.contains("range", !0) && (ce.rangeRequested = !0), ce.requestIncludesCredentials = Fe, ce.status === 407)
      return x.window === "no-window" ? e() : I(F) ? t(F) : e("proxy authentication required");
    if (
      // response’s status is 421
      ce.status === 421 && // isNewConnectionFetch is false
      !H && // request’s body is null, or request’s body is non-null and request’s body’s source is non-null
      (x.body == null || x.body.source != null)
    ) {
      if (I(F))
        return t(F);
      F.controller.connection.destroy(), ce = await T(
        F,
        O,
        !0
      );
    }
    return ce;
  }
  async function _(F, O = !1, H = !1) {
    X(!F.controller.connection || F.controller.connection.destroyed), F.controller.connection = {
      abort: null,
      destroyed: !1,
      destroy(Te, je = !0) {
        this.destroyed || (this.destroyed = !0, je && this.abort?.(Te ?? new DOMException("The operation was aborted.", "AbortError")));
      }
    };
    const x = F.request;
    let Ae = null;
    const z = F.timingInfo;
    x.cache = "no-store", x.mode;
    let ce = null;
    if (x.body == null && F.processRequestEndOfBody)
      queueMicrotask(() => F.processRequestEndOfBody());
    else if (x.body != null) {
      const Te = async function* (qe) {
        I(F) || (yield qe, F.processRequestBodyChunkLength?.(qe.byteLength));
      }, je = () => {
        I(F) || F.processRequestEndOfBody && F.processRequestEndOfBody();
      }, nt = (qe) => {
        I(F) || (qe.name === "AbortError" ? F.controller.abort() : F.controller.terminate(qe));
      };
      ce = (async function* () {
        try {
          for await (const qe of x.body.stream)
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
        F.controller.next = () => Ze.next(), Ae = s({ status: je, statusText: nt, headersList: qe });
      }
    } catch (Te) {
      return Te.name === "AbortError" ? (F.controller.connection.destroy(), t(F, Te)) : e(Te);
    }
    const Fe = async () => {
      await F.controller.resume();
    }, Ge = (Te) => {
      I(F) || F.controller.abort(Te);
    }, Ne = new ReadableStream(
      {
        async start(Te) {
          F.controller.controller = Te;
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
    Ae.body = { stream: Ne, source: null, length: null }, F.controller.onAborted = _e, F.controller.on("terminated", _e), F.controller.resume = async () => {
      for (; ; ) {
        let Te, je;
        try {
          const { done: qe, value: It } = await F.controller.next();
          if (m(F))
            break;
          Te = qe ? void 0 : It;
        } catch (qe) {
          F.controller.ended && !z.encodedBodySize ? Te = void 0 : (Te = qe, je = !0);
        }
        if (Te === void 0) {
          S(F.controller.controller), te(F, Ae);
          return;
        }
        if (z.decodedBodySize += Te?.byteLength ?? 0, je) {
          F.controller.terminate(Te);
          return;
        }
        const nt = new Uint8Array(Te);
        if (nt.byteLength && F.controller.controller.enqueue(nt), Le(Ne)) {
          F.controller.terminate();
          return;
        }
        if (F.controller.controller.desiredSize <= 0)
          return;
      }
    };
    function _e(Te) {
      m(F) ? (Ae.aborted = !0, Re(Ne) && F.controller.controller.error(
        F.controller.serializedAbortReason
      )) : Re(Ne) && F.controller.controller.error(new TypeError("terminated", {
        cause: b(Te) ? Te : void 0
      })), F.controller.connection.destroy();
    }
    return Ae;
    function lt({ body: Te }) {
      const je = y(x), nt = F.controller.dispatcher;
      return new Promise((qe, It) => nt.dispatch(
        {
          path: je.pathname + je.search,
          origin: je.origin,
          method: x.method,
          body: nt.isMockActive ? x.body && (x.body.source || x.body.stream) : Te,
          headers: x.headersList.entries,
          maxRedirections: 0,
          upgrade: x.mode === "websocket" ? "websocket" : void 0
        },
        {
          body: null,
          abort: null,
          onConnect(Ze) {
            const { connection: At } = F.controller;
            z.finalConnectionTimingInfo = ge(void 0, z.postRedirectStartTime, F.crossOriginIsolatedCapability), At.destroyed ? Ze(new DOMException("The operation was aborted.", "AbortError")) : (F.controller.on("terminated", Ze), this.abort = At.abort = Ze), z.finalNetworkRequestStartTime = w(F.crossOriginIsolatedCapability);
          },
          onResponseStarted() {
            z.finalNetworkResponseStartTime = w(F.crossOriginIsolatedCapability);
          },
          onHeaders(Ze, At, jA, BA) {
            if (Ze < 200)
              return;
            let kt = "";
            const CA = new n();
            for (let ut = 0; ut < At.length; ut += 2)
              CA.append(ke(At[ut]), At[ut + 1].toString("latin1"), !0);
            kt = CA.get("location", !0), this.body = new oe({ read: jA });
            const Gt = [], _c = kt && x.redirect === "follow" && J.has(Ze);
            if (x.method !== "HEAD" && x.method !== "CONNECT" && !V.includes(Ze) && !_c) {
              const ut = CA.get("content-encoding", !0), IA = ut ? ut.toLowerCase().split(",") : [], kn = 5;
              if (IA.length > kn)
                return It(new Error(`too many content-encodings in response: ${IA.length}, maximum allowed is ${kn}`)), !0;
              for (let XA = IA.length - 1; XA >= 0; --XA) {
                const dA = IA[XA].trim();
                if (dA === "x-gzip" || dA === "gzip")
                  Gt.push(u.createGunzip({
                    // Be less strict when decoding compressed responses, since sometimes
                    // servers send slightly invalid responses that are still accepted
                    // by common browsers.
                    // Always using Z_SYNC_FLUSH is what cURL does.
                    flush: u.constants.Z_SYNC_FLUSH,
                    finishFlush: u.constants.Z_SYNC_FLUSH
                  }));
                else if (dA === "deflate")
                  Gt.push(he({
                    flush: u.constants.Z_SYNC_FLUSH,
                    finishFlush: u.constants.Z_SYNC_FLUSH
                  }));
                else if (dA === "br")
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
            const Rn = this.onError.bind(this);
            return qe({
              status: Ze,
              statusText: BA,
              headersList: CA,
              body: Gt.length ? fe(this.body, ...Gt, (ut) => {
                ut && this.onError(ut);
              }).on("error", Rn) : this.body.on("error", Rn)
            }), !0;
          },
          onData(Ze) {
            if (F.controller.dump)
              return;
            const At = Ze;
            return z.encodedBodySize += At.byteLength, this.body.push(At);
          },
          onComplete() {
            this.abort && F.controller.off("terminated", this.abort), F.controller.onAborted && F.controller.off("terminated", F.controller.onAborted), F.controller.ended = !0, this.body.push(null);
          },
          onError(Ze) {
            this.abort && F.controller.off("terminated", this.abort), this.body?.destroy(Ze), F.controller.terminate(Ze), It(Ze);
          },
          onUpgrade(Ze, At, jA) {
            if (Ze !== 101)
              return;
            const BA = new n();
            for (let kt = 0; kt < At.length; kt += 2)
              BA.append(ke(At[kt]), At[kt + 1].toString("latin1"), !0);
            return qe({
              status: Ze,
              statusText: R[Ze],
              headersList: BA,
              socket: jA
            }), !0;
          }
        }
      ));
    }
  }
  return Cs = {
    fetch: ve,
    Fetch: Ce,
    fetching: Y,
    finalizeAndReportTiming: ze
  }, Cs;
}
var Is, Ii;
function di() {
  return Ii || (Ii = 1, Is = {
    kState: /* @__PURE__ */ Symbol("FileReader state"),
    kResult: /* @__PURE__ */ Symbol("FileReader result"),
    kError: /* @__PURE__ */ Symbol("FileReader error"),
    kLastProgressEventFired: /* @__PURE__ */ Symbol("FileReader last progress event fired timestamp"),
    kEvents: /* @__PURE__ */ Symbol("FileReader events"),
    kAborted: /* @__PURE__ */ Symbol("FileReader aborted")
  }), Is;
}
var ds, fi;
function Hg() {
  if (fi) return ds;
  fi = 1;
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
  ]), ds = {
    ProgressEvent: A
  }, ds;
}
var fs, pi;
function Og() {
  if (pi) return fs;
  pi = 1;
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
  return fs = {
    getEncoding: e
  }, fs;
}
var ps, wi;
function Pg() {
  if (wi) return ps;
  wi = 1;
  const {
    kState: e,
    kError: t,
    kResult: A,
    kAborted: s,
    kLastProgressEventFired: r
  } = di(), { ProgressEvent: n } = Hg(), { getEncoding: o } = Og(), { serializeAMimeType: a, parseMIMEType: u } = st(), { types: l } = rt, { StringDecoder: i } = Ag, { btoa: c } = ct, Q = {
    enumerable: !0,
    writable: !1,
    configurable: !1
  };
  function h(N, L, M, f) {
    if (N[e] === "loading")
      throw new DOMException("Invalid state", "InvalidStateError");
    N[e] = "loading", N[A] = null, N[t] = null;
    const w = L.stream().getReader(), g = [];
    let E = w.read(), p = !0;
    (async () => {
      for (; !N[s]; )
        try {
          const { done: I, value: m } = await E;
          if (p && !N[s] && queueMicrotask(() => {
            C("loadstart", N);
          }), p = !1, !I && l.isUint8Array(m))
            g.push(m), (N[r] === void 0 || Date.now() - N[r] >= 50) && !N[s] && (N[r] = Date.now(), queueMicrotask(() => {
              C("progress", N);
            })), E = w.read();
          else if (I) {
            queueMicrotask(() => {
              N[e] = "done";
              try {
                const b = d(g, M, L.type, f);
                if (N[s])
                  return;
                N[A] = b, C("load", N);
              } catch (b) {
                N[t] = b, C("error", N);
              }
              N[e] !== "loading" && C("loadend", N);
            });
            break;
          }
        } catch (I) {
          if (N[s])
            return;
          queueMicrotask(() => {
            N[e] = "done", N[t] = I, C("error", N), N[e] !== "loading" && C("loadend", N);
          });
          break;
        }
    })();
  }
  function C(N, L) {
    const M = new n(N, {
      bubbles: !1,
      cancelable: !1
    });
    L.dispatchEvent(M);
  }
  function d(N, L, M, f) {
    switch (L) {
      case "DataURL": {
        let B = "data:";
        const w = u(M || "application/octet-stream");
        w !== "failure" && (B += a(w)), B += ";base64,";
        const g = new i("latin1");
        for (const E of N)
          B += c(g.write(E));
        return B += c(g.end()), B;
      }
      case "Text": {
        let B = "failure";
        if (f && (B = o(f)), B === "failure" && M) {
          const w = u(M);
          w !== "failure" && (B = o(w.parameters.get("charset")));
        }
        return B === "failure" && (B = "UTF-8"), y(N, B);
      }
      case "ArrayBuffer":
        return k(N).buffer;
      case "BinaryString": {
        let B = "";
        const w = new i("latin1");
        for (const g of N)
          B += w.write(g);
        return B += w.end(), B;
      }
    }
  }
  function y(N, L) {
    const M = k(N), f = D(M);
    let B = 0;
    f !== null && (L = f, B = f === "UTF-8" ? 3 : 2);
    const w = M.slice(B);
    return new TextDecoder(L).decode(w);
  }
  function D(N) {
    const [L, M, f] = N;
    return L === 239 && M === 187 && f === 191 ? "UTF-8" : L === 254 && M === 255 ? "UTF-16BE" : L === 255 && M === 254 ? "UTF-16LE" : null;
  }
  function k(N) {
    const L = N.reduce((f, B) => f + B.byteLength, 0);
    let M = 0;
    return N.reduce((f, B) => (f.set(B, M), M += B.byteLength, f), new Uint8Array(L));
  }
  return ps = {
    staticPropertyDescriptors: Q,
    readOperation: h,
    fireAProgressEvent: C
  }, ps;
}
var ws, mi;
function xg() {
  if (mi) return ws;
  mi = 1;
  const {
    staticPropertyDescriptors: e,
    readOperation: t,
    fireAProgressEvent: A
  } = Pg(), {
    kState: s,
    kError: r,
    kResult: n,
    kEvents: o,
    kAborted: a
  } = di(), { webidl: u } = $e(), { kEnumerableProperty: l } = Ue();
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
  }), ws = {
    FileReader: i
  }, ws;
}
var ms, yi;
function ys() {
  return yi || (yi = 1, ms = {
    kConstruct: Ve().kConstruct
  }), ms;
}
var Ds, Di;
function _g() {
  if (Di) return Ds;
  Di = 1;
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
  return Ds = {
    urlEquals: s,
    getFieldValues: r
  }, Ds;
}
var bs, bi;
function Vg() {
  if (bi) return bs;
  bi = 1;
  const { kConstruct: e } = ys(), { urlEquals: t, getFieldValues: A } = _g(), { kEnumerableProperty: s, isDisturbed: r } = Ue(), { webidl: n } = $e(), { Response: o, cloneResponse: a, fromInnerResponse: u } = UA(), { Request: l, fromInnerRequest: i } = nA(), { kState: c } = Tt(), { fetching: Q } = NA(), { urlIsHttpHttpsScheme: h, createDeferredPromise: C, readAllBytes: d } = it(), y = He;
  class D {
    /**
     * @see https://w3c.github.io/ServiceWorker/#dfn-relevant-request-response-list
     * @type {requestResponseList}
     */
    #e;
    constructor() {
      arguments[0] !== e && n.illegalConstructor(), n.util.markAsUncloneable(this), this.#e = arguments[1];
    }
    async match(L, M = {}) {
      n.brandCheck(this, D);
      const f = "Cache.match";
      n.argumentLengthCheck(arguments, 1, f), L = n.converters.RequestInfo(L, f, "request"), M = n.converters.CacheQueryOptions(M, f, "options");
      const B = this.#A(L, M, 1);
      if (B.length !== 0)
        return B[0];
    }
    async matchAll(L = void 0, M = {}) {
      n.brandCheck(this, D);
      const f = "Cache.matchAll";
      return L !== void 0 && (L = n.converters.RequestInfo(L, f, "request")), M = n.converters.CacheQueryOptions(M, f, "options"), this.#A(L, M);
    }
    async add(L) {
      n.brandCheck(this, D);
      const M = "Cache.add";
      n.argumentLengthCheck(arguments, 1, M), L = n.converters.RequestInfo(L, M, "request");
      const f = [L];
      return await this.addAll(f);
    }
    async addAll(L) {
      n.brandCheck(this, D);
      const M = "Cache.addAll";
      n.argumentLengthCheck(arguments, 1, M);
      const f = [], B = [];
      for (let U of L) {
        if (U === void 0)
          throw n.errors.conversionFailed({
            prefix: M,
            argument: "Argument 1",
            types: ["undefined is not allowed"]
          });
        if (U = n.converters.RequestInfo(U), typeof U == "string")
          continue;
        const S = U[c];
        if (!h(S.url) || S.method !== "GET")
          throw n.errors.exception({
            header: M,
            message: "Expected http/s scheme when method is not GET."
          });
      }
      const w = [];
      for (const U of L) {
        const S = new l(U)[c];
        if (!h(S.url))
          throw n.errors.exception({
            header: M,
            message: "Expected http/s scheme."
          });
        S.initiator = "fetch", S.destination = "subresource", B.push(S);
        const G = C();
        w.push(Q({
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
                  for (const ge of w)
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
      const E = await Promise.all(f), p = [];
      let I = 0;
      for (const U of E) {
        const S = {
          type: "put",
          // 7.3.2
          request: B[I],
          // 7.3.3
          response: U
          // 7.3.4
        };
        p.push(S), I++;
      }
      const m = C();
      let b = null;
      try {
        this.#t(p);
      } catch (U) {
        b = U;
      }
      return queueMicrotask(() => {
        b === null ? m.resolve(void 0) : m.reject(b);
      }), m.promise;
    }
    async put(L, M) {
      n.brandCheck(this, D);
      const f = "Cache.put";
      n.argumentLengthCheck(arguments, 2, f), L = n.converters.RequestInfo(L, f, "request"), M = n.converters.Response(M, f, "response");
      let B = null;
      if (L instanceof l ? B = L[c] : B = new l(L)[c], !h(B.url) || B.method !== "GET")
        throw n.errors.exception({
          header: f,
          message: "Expected an http/s scheme when method is not GET"
        });
      const w = M[c];
      if (w.status === 206)
        throw n.errors.exception({
          header: f,
          message: "Got 206 status"
        });
      if (w.headersList.contains("vary")) {
        const S = A(w.headersList.get("vary"));
        for (const G of S)
          if (G === "*")
            throw n.errors.exception({
              header: f,
              message: "Got * vary field value"
            });
      }
      if (w.body && (r(w.body.stream) || w.body.stream.locked))
        throw n.errors.exception({
          header: f,
          message: "Response body is locked or disturbed"
        });
      const g = a(w), E = C();
      if (w.body != null) {
        const G = w.body.stream.getReader();
        d(G).then(E.resolve, E.reject);
      } else
        E.resolve(void 0);
      const p = [], I = {
        type: "put",
        // 14.
        request: B,
        // 15.
        response: g
        // 16.
      };
      p.push(I);
      const m = await E.promise;
      g.body != null && (g.body.source = m);
      const b = C();
      let U = null;
      try {
        this.#t(p);
      } catch (S) {
        U = S;
      }
      return queueMicrotask(() => {
        U === null ? b.resolve() : b.reject(U);
      }), b.promise;
    }
    async delete(L, M = {}) {
      n.brandCheck(this, D);
      const f = "Cache.delete";
      n.argumentLengthCheck(arguments, 1, f), L = n.converters.RequestInfo(L, f, "request"), M = n.converters.CacheQueryOptions(M, f, "options");
      let B = null;
      if (L instanceof l) {
        if (B = L[c], B.method !== "GET" && !M.ignoreMethod)
          return !1;
      } else
        y(typeof L == "string"), B = new l(L)[c];
      const w = [], g = {
        type: "delete",
        request: B,
        options: M
      };
      w.push(g);
      const E = C();
      let p = null, I;
      try {
        I = this.#t(w);
      } catch (m) {
        p = m;
      }
      return queueMicrotask(() => {
        p === null ? E.resolve(!!I?.length) : E.reject(p);
      }), E.promise;
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#dom-cache-keys
     * @param {any} request
     * @param {import('../../types/cache').CacheQueryOptions} options
     * @returns {Promise<readonly Request[]>}
     */
    async keys(L = void 0, M = {}) {
      n.brandCheck(this, D);
      const f = "Cache.keys";
      L !== void 0 && (L = n.converters.RequestInfo(L, f, "request")), M = n.converters.CacheQueryOptions(M, f, "options");
      let B = null;
      if (L !== void 0)
        if (L instanceof l) {
          if (B = L[c], B.method !== "GET" && !M.ignoreMethod)
            return [];
        } else typeof L == "string" && (B = new l(L)[c]);
      const w = C(), g = [];
      if (L === void 0)
        for (const E of this.#e)
          g.push(E[0]);
      else {
        const E = this.#s(B, M);
        for (const p of E)
          g.push(p[0]);
      }
      return queueMicrotask(() => {
        const E = [];
        for (const p of g) {
          const I = i(
            p,
            new AbortController().signal,
            "immutable"
          );
          E.push(I);
        }
        w.resolve(Object.freeze(E));
      }), w.promise;
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#batch-cache-operations-algorithm
     * @param {CacheBatchOperation[]} operations
     * @returns {requestResponseList}
     */
    #t(L) {
      const M = this.#e, f = [...M], B = [], w = [];
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
          if (this.#s(g.request, g.options, B).length)
            throw new DOMException("???", "InvalidStateError");
          let E;
          if (g.type === "delete") {
            if (E = this.#s(g.request, g.options), E.length === 0)
              return [];
            for (const p of E) {
              const I = M.indexOf(p);
              y(I !== -1), M.splice(I, 1);
            }
          } else if (g.type === "put") {
            if (g.response == null)
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "put operation should have an associated response"
              });
            const p = g.request;
            if (!h(p.url))
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "expected http or https scheme"
              });
            if (p.method !== "GET")
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "not get method"
              });
            if (g.options != null)
              throw n.errors.exception({
                header: "Cache.#batchCacheOperations",
                message: "options must not be defined"
              });
            E = this.#s(g.request);
            for (const I of E) {
              const m = M.indexOf(I);
              y(m !== -1), M.splice(m, 1);
            }
            M.push([g.request, g.response]), B.push([g.request, g.response]);
          }
          w.push([g.request, g.response]);
        }
        return w;
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
    #s(L, M, f) {
      const B = [], w = f ?? this.#e;
      for (const g of w) {
        const [E, p] = g;
        this.#r(L, E, p, M) && B.push(g);
      }
      return B;
    }
    /**
     * @see https://w3c.github.io/ServiceWorker/#request-matches-cached-item-algorithm
     * @param {any} requestQuery
     * @param {any} request
     * @param {any | null} response
     * @param {import('../../types/cache').CacheQueryOptions | undefined} options
     * @returns {boolean}
     */
    #r(L, M, f = null, B) {
      const w = new URL(L.url), g = new URL(M.url);
      if (B?.ignoreSearch && (g.search = "", w.search = ""), !t(w, g, !0))
        return !1;
      if (f == null || B?.ignoreVary || !f.headersList.contains("vary"))
        return !0;
      const E = A(f.headersList.get("vary"));
      for (const p of E) {
        if (p === "*")
          return !1;
        const I = M.headersList.get(p), m = L.headersList.get(p);
        if (I !== m)
          return !1;
      }
      return !0;
    }
    #A(L, M, f = 1 / 0) {
      let B = null;
      if (L !== void 0)
        if (L instanceof l) {
          if (B = L[c], B.method !== "GET" && !M.ignoreMethod)
            return [];
        } else typeof L == "string" && (B = new l(L)[c]);
      const w = [];
      if (L === void 0)
        for (const E of this.#e)
          w.push(E[1]);
      else {
        const E = this.#s(B, M);
        for (const p of E)
          w.push(p[1]);
      }
      const g = [];
      for (const E of w) {
        const p = u(E, "immutable");
        if (g.push(p.clone()), g.length >= f)
          break;
      }
      return Object.freeze(g);
    }
  }
  Object.defineProperties(D.prototype, {
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
  const k = [
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
  return n.converters.CacheQueryOptions = n.dictionaryConverter(k), n.converters.MultiCacheQueryOptions = n.dictionaryConverter([
    ...k,
    {
      key: "cacheName",
      converter: n.converters.DOMString
    }
  ]), n.converters.Response = n.interfaceConverter(o), n.converters["sequence<RequestInfo>"] = n.sequenceConverter(
    n.converters.RequestInfo
  ), bs = {
    Cache: D
  }, bs;
}
var Rs, Ri;
function Wg() {
  if (Ri) return Rs;
  Ri = 1;
  const { kConstruct: e } = ys(), { Cache: t } = Vg(), { webidl: A } = $e(), { kEnumerableProperty: s } = Ue();
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
  }), Rs = {
    CacheStorage: r
  }, Rs;
}
var ks, ki;
function qg() {
  return ki || (ki = 1, ks = {
    maxAttributeValueSize: 1024,
    maxNameValuePairSize: 4096
  }), ks;
}
var Fs, Fi;
function Ti() {
  if (Fi) return Fs;
  Fi = 1;
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
      const C = c.charCodeAt(h++);
      if (C < 33 || // exclude CTLs (0-31)
      C > 126 || // non-ascii and DEL (127)
      C === 34 || // "
      C === 44 || // ,
      C === 59 || // ;
      C === 92)
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
      const [C, ...d] = h.split("=");
      Q.push(`${C.trim()}=${d.join("=")}`);
    }
    return Q.join("; ");
  }
  return Fs = {
    isCTLExcludingHtab: e,
    validateCookieName: t,
    validateCookiePath: s,
    validateCookieValue: A,
    toIMFDate: u,
    stringify: i
  }, Fs;
}
var Ts, Si;
function zg() {
  if (Si) return Ts;
  Si = 1;
  const { maxNameValuePairSize: e, maxAttributeValueSize: t } = qg(), { isCTLExcludingHtab: A } = Ti(), { collectASequenceOfCodePointsFast: s } = st(), r = He;
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
      const C = Number(c);
      u.maxAge = C;
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
      const C = c.toLowerCase();
      C.includes("none") && (h = "None"), C.includes("strict") && (h = "Strict"), C.includes("lax") && (h = "Lax"), u.sameSite = h;
    } else
      u.unparsed ??= [], u.unparsed.push(`${i}=${c}`);
    return o(a, u);
  }
  return Ts = {
    parseSetCookie: n,
    parseUnparsedAttributes: o
  }, Ts;
}
var Ss, Ui;
function Zg() {
  if (Ui) return Ss;
  Ui = 1;
  const { parseSetCookie: e } = zg(), { stringify: t } = Ti(), { webidl: A } = $e(), { Headers: s } = Yt();
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
  ]), Ss = {
    getCookies: r,
    deleteCookie: n,
    getSetCookies: o,
    setCookie: a
  }, Ss;
}
var Us, Ni;
function oA() {
  if (Ni) return Us;
  Ni = 1;
  const { webidl: e } = $e(), { kEnumerableProperty: t } = Ue(), { kConstruct: A } = Ve(), { MessagePort: s } = Mn;
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
    initMessageEvent(i, c = !1, Q = !1, h = null, C = "", d = "", y = null, D = []) {
      return e.brandCheck(this, r), e.argumentLengthCheck(arguments, 1, "MessageEvent.initMessageEvent"), new r(i, {
        bubbles: c,
        cancelable: Q,
        data: h,
        origin: C,
        lastEventId: d,
        source: y,
        ports: D
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
  ]), Us = {
    MessageEvent: r,
    CloseEvent: o,
    ErrorEvent: a,
    createFastMessageEvent: n
  }, Us;
}
var Ns, Mi;
function Jt() {
  if (Mi) return Ns;
  Mi = 1;
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
  return Ns = {
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
  }, Ns;
}
var Ms, Li;
function MA() {
  return Li || (Li = 1, Ms = {
    kWebSocketURL: /* @__PURE__ */ Symbol("url"),
    kReadyState: /* @__PURE__ */ Symbol("ready state"),
    kController: /* @__PURE__ */ Symbol("controller"),
    kResponse: /* @__PURE__ */ Symbol("response"),
    kBinaryType: /* @__PURE__ */ Symbol("binary type"),
    kSentClose: /* @__PURE__ */ Symbol("sent close"),
    kReceivedClose: /* @__PURE__ */ Symbol("received close"),
    kByteParser: /* @__PURE__ */ Symbol("byte parser")
  }), Ms;
}
var Ls, Gi;
function LA() {
  if (Gi) return Ls;
  Gi = 1;
  const { kReadyState: e, kController: t, kResponse: A, kBinaryType: s, kWebSocketURL: r } = MA(), { states: n, opcodes: o } = Jt(), { ErrorEvent: a, createFastMessageEvent: u } = oA(), { isUtf8: l } = ct, { collectASequenceOfCodePointsFast: i, removeHTTPWhitespace: c } = st();
  function Q(U) {
    return U[e] === n.CONNECTING;
  }
  function h(U) {
    return U[e] === n.OPEN;
  }
  function C(U) {
    return U[e] === n.CLOSING;
  }
  function d(U) {
    return U[e] === n.CLOSED;
  }
  function y(U, S, G = ($, ne) => new Event($, ne), v = {}) {
    const $ = G(U, v);
    S.dispatchEvent($);
  }
  function D(U, S, G) {
    if (U[e] !== n.OPEN)
      return;
    let v;
    if (S === o.TEXT)
      try {
        v = b(G);
      } catch {
        M(U, "Received invalid UTF-8 in text frame.");
        return;
      }
    else S === o.BINARY && (U[s] === "blob" ? v = new Blob([G]) : v = k(G));
    y("message", U, u, {
      origin: U[r].origin,
      data: v
    });
  }
  function k(U) {
    return U.byteLength === U.buffer.byteLength ? U.buffer : U.buffer.slice(U.byteOffset, U.byteOffset + U.byteLength);
  }
  function N(U) {
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
  function M(U, S) {
    const { [t]: G, [A]: v } = U;
    G.abort(), v?.socket && !v.socket.destroyed && v.socket.destroy(), S && y("error", U, ($, ne) => new a($, ne), {
      error: new Error(S),
      message: S
    });
  }
  function f(U) {
    return U === o.CLOSE || U === o.PING || U === o.PONG;
  }
  function B(U) {
    return U === o.CONTINUATION;
  }
  function w(U) {
    return U === o.TEXT || U === o.BINARY;
  }
  function g(U) {
    return w(U) || B(U) || f(U);
  }
  function E(U) {
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
  function p(U) {
    for (let S = 0; S < U.length; S++) {
      const G = U.charCodeAt(S);
      if (G < 48 || G > 57)
        return !1;
    }
    return !0;
  }
  const I = typeof process.versions.icu == "string", m = I ? new TextDecoder("utf-8", { fatal: !0 }) : void 0, b = I ? m.decode.bind(m) : function(U) {
    if (l(U))
      return U.toString("utf-8");
    throw new TypeError("Invalid utf-8 received.");
  };
  return Ls = {
    isConnecting: Q,
    isEstablished: h,
    isClosing: C,
    isClosed: d,
    fireEvent: y,
    isValidSubprotocol: N,
    isValidStatusCode: L,
    failWebsocketConnection: M,
    websocketMessageReceived: D,
    utf8Decode: b,
    isControlFrame: f,
    isContinuationFrame: B,
    isTextBinaryFrame: w,
    isValidOpcode: g,
    parseExtensions: E,
    isValidClientWindowBits: p
  }, Ls;
}
var Gs, vi;
function vs() {
  if (vi) return Gs;
  vi = 1;
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
      const C = Buffer.allocUnsafe(c + h);
      C[0] = C[1] = 0, C[0] |= 128, C[0] = (C[0] & 240) + u;
      C[h - 4] = i[0], C[h - 3] = i[1], C[h - 2] = i[2], C[h - 1] = i[3], C[1] = Q, Q === 126 ? C.writeUInt16BE(c, 2) : Q === 127 && (C[2] = C[3] = 0, C.writeUIntBE(c, 4, 6)), C[1] |= 128;
      for (let d = 0; d < c; ++d)
        C[h + d] = l[d] ^ i[d & 3];
      return C;
    }
  }
  return Gs = {
    WebsocketFrameSend: o
  }, Gs;
}
var Ys, Yi;
function Ji() {
  if (Yi) return Ys;
  Yi = 1;
  const { uid: e, states: t, sentCloseFrameState: A, emptyBuffer: s, opcodes: r } = Jt(), {
    kReadyState: n,
    kSentClose: o,
    kByteParser: a,
    kReceivedClose: u,
    kResponse: l
  } = MA(), { fireEvent: i, failWebsocketConnection: c, isClosing: Q, isClosed: h, isEstablished: C, parseExtensions: d } = LA(), { channels: y } = jt(), { CloseEvent: D } = oA(), { makeRequest: k } = nA(), { fetching: N } = NA(), { Headers: L, getHeadersList: M } = Yt(), { getDecodeSplit: f } = it(), { WebsocketFrameSend: B } = vs();
  let w;
  try {
    w = require("node:crypto");
  } catch {
  }
  function g(b, U, S, G, v, $) {
    const ne = b;
    ne.protocol = b.protocol === "ws:" ? "http:" : "https:";
    const ge = k({
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
      const Qe = M(new L($.headers));
      ge.headersList = Qe;
    }
    const ae = w.randomBytes(16).toString("base64");
    ge.headersList.append("sec-websocket-key", ae), ge.headersList.append("sec-websocket-version", "13");
    for (const Qe of U)
      ge.headersList.append("sec-websocket-protocol", Qe);
    return ge.headersList.append("sec-websocket-extensions", "permessage-deflate; client_max_window_bits"), N({
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
        const ye = Qe.headersList.get("Sec-WebSocket-Accept"), we = w.createHash("sha1").update(ae + e).digest("base64");
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
        Qe.socket.on("data", p), Qe.socket.on("close", I), Qe.socket.on("error", m), y.open.hasSubscribers && y.open.publish({
          address: Qe.socket.address(),
          protocol: re,
          extensions: X
        }), v(Qe, W);
      }
    });
  }
  function E(b, U, S, G) {
    if (!(Q(b) || h(b))) if (!C(b))
      c(b, "Connection was closed before it was established."), b[n] = t.CLOSING;
    else if (b[o] === A.NOT_SENT) {
      b[o] = A.PROCESSING;
      const v = new B();
      U !== void 0 && S === void 0 ? (v.frameData = Buffer.allocUnsafe(2), v.frameData.writeUInt16BE(U, 0)) : U !== void 0 && S !== void 0 ? (v.frameData = Buffer.allocUnsafe(2 + G), v.frameData.writeUInt16BE(U, 0), v.frameData.write(S, 2, "utf-8")) : v.frameData = s, b[l].socket.write(v.createFrame(r.CLOSE)), b[o] = A.SENT, b[n] = t.CLOSING;
    } else
      b[n] = t.CLOSING;
  }
  function p(b) {
    this.ws[a].write(b) || this.pause();
  }
  function I() {
    const { ws: b } = this, { [l]: U } = b;
    U.socket.off("data", p), U.socket.off("close", I), U.socket.off("error", m);
    const S = b[o] === A.SENT && b[u];
    let G = 1005, v = "";
    const $ = b[a].closingInfo;
    $ && !$.error ? (G = $.code ?? 1005, v = $.reason) : b[u] || (G = 1006), b[n] = t.CLOSED, i("close", b, (ne, ge) => new D(ne, ge), {
      wasClean: S,
      code: G,
      reason: v
    }), y.close.hasSubscribers && y.close.publish({
      websocket: b,
      code: G,
      reason: v
    });
  }
  function m(b) {
    const { ws: U } = this;
    U[n] = t.CLOSING, y.socketError.hasSubscribers && y.socketError.publish(b), this.destroy();
  }
  return Ys = {
    establishWebSocketConnection: g,
    closeWebSocketConnection: E
  }, Ys;
}
var Js, Hi;
function Kg() {
  if (Hi) return Js;
  Hi = 1;
  const { createInflateRaw: e, Z_DEFAULT_WINDOWBITS: t } = $A, { isValidClientWindowBits: A } = LA(), s = Buffer.from([0, 0, 255, 255]), r = /* @__PURE__ */ Symbol("kBuffer"), n = /* @__PURE__ */ Symbol("kLength");
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
  return Js = { PerMessageDeflate: o }, Js;
}
var Hs, Oi;
function jg() {
  if (Oi) return Hs;
  Oi = 1;
  const { Writable: e } = ot, t = He, { parserStates: A, opcodes: s, states: r, emptyBuffer: n, sentCloseFrameState: o } = Jt(), { kReadyState: a, kSentClose: u, kResponse: l, kReceivedClose: i } = MA(), { channels: c } = jt(), {
    isValidStatusCode: Q,
    isValidOpcode: h,
    failWebsocketConnection: C,
    websocketMessageReceived: d,
    utf8Decode: y,
    isControlFrame: D,
    isTextBinaryFrame: k,
    isContinuationFrame: N
  } = LA(), { WebsocketFrameSend: L } = vs(), { closeWebSocketConnection: M } = Ji(), { PerMessageDeflate: f } = Kg();
  class B extends e {
    #e = [];
    #t = 0;
    #s = !1;
    #r = A.INFO;
    #A = {};
    #n = [];
    /** @type {Map<string, PerMessageDeflate>} */
    #o;
    constructor(g, E) {
      super(), this.ws = g, this.#o = E ?? /* @__PURE__ */ new Map(), this.#o.has("permessage-deflate") && this.#o.set("permessage-deflate", new f(E));
    }
    /**
     * @param {Buffer} chunk
     * @param {() => void} callback
     */
    _write(g, E, p) {
      this.#e.push(g), this.#t += g.length, this.#s = !0, this.run(p);
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
          const E = this.consume(2), p = (E[0] & 128) !== 0, I = E[0] & 15, m = (E[1] & 128) === 128, b = !p && I !== s.CONTINUATION, U = E[1] & 127, S = E[0] & 64, G = E[0] & 32, v = E[0] & 16;
          if (!h(I))
            return C(this.ws, "Invalid opcode received"), g();
          if (m)
            return C(this.ws, "Frame cannot be masked"), g();
          if (S !== 0 && !this.#o.has("permessage-deflate")) {
            C(this.ws, "Expected RSV1 to be clear.");
            return;
          }
          if (G !== 0 || v !== 0) {
            C(this.ws, "RSV1, RSV2, RSV3 must be clear");
            return;
          }
          if (b && !k(I)) {
            C(this.ws, "Invalid frame type was fragmented.");
            return;
          }
          if (k(I) && this.#n.length > 0) {
            C(this.ws, "Expected continuation frame");
            return;
          }
          if (this.#A.fragmented && b) {
            C(this.ws, "Fragmented frame exceeded 125 bytes.");
            return;
          }
          if ((U > 125 || b) && D(I)) {
            C(this.ws, "Control frame either too large or fragmented");
            return;
          }
          if (N(I) && this.#n.length === 0 && !this.#A.compressed) {
            C(this.ws, "Unexpected continuation frame");
            return;
          }
          U <= 125 ? (this.#A.payloadLength = U, this.#r = A.READ_DATA) : U === 126 ? this.#r = A.PAYLOADLENGTH_16 : U === 127 && (this.#r = A.PAYLOADLENGTH_64), k(I) && (this.#A.binaryType = I, this.#A.compressed = S !== 0), this.#A.opcode = I, this.#A.masked = m, this.#A.fin = p, this.#A.fragmented = b;
        } else if (this.#r === A.PAYLOADLENGTH_16) {
          if (this.#t < 2)
            return g();
          const E = this.consume(2);
          this.#A.payloadLength = E.readUInt16BE(0), this.#r = A.READ_DATA;
        } else if (this.#r === A.PAYLOADLENGTH_64) {
          if (this.#t < 8)
            return g();
          const E = this.consume(8), p = E.readUInt32BE(0);
          if (p > 2 ** 31 - 1) {
            C(this.ws, "Received payload length > 2^31 bytes.");
            return;
          }
          const I = E.readUInt32BE(4);
          this.#A.payloadLength = (p << 8) + I, this.#r = A.READ_DATA;
        } else if (this.#r === A.READ_DATA) {
          if (this.#t < this.#A.payloadLength)
            return g();
          const E = this.consume(this.#A.payloadLength);
          if (D(this.#A.opcode))
            this.#s = this.parseControlFrame(E), this.#r = A.INFO;
          else if (this.#A.compressed) {
            this.#o.get("permessage-deflate").decompress(E, this.#A.fin, (p, I) => {
              if (p) {
                M(this.ws, 1007, p.message, p.message.length);
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
            if (this.#n.push(E), !this.#A.fragmented && this.#A.fin) {
              const p = Buffer.concat(this.#n);
              d(this.ws, this.#A.binaryType, p), this.#n.length = 0;
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
      const E = Buffer.allocUnsafe(g);
      let p = 0;
      for (; p !== g; ) {
        const I = this.#e[0], { length: m } = I;
        if (m + p === g) {
          E.set(this.#e.shift(), p);
          break;
        } else if (m + p > g) {
          E.set(I.subarray(0, g - p), p), this.#e[0] = I.subarray(g - p);
          break;
        } else
          E.set(this.#e.shift(), p), p += I.length;
      }
      return this.#t -= g, E;
    }
    parseCloseBody(g) {
      t(g.length !== 1);
      let E;
      if (g.length >= 2 && (E = g.readUInt16BE(0)), E !== void 0 && !Q(E))
        return { code: 1002, reason: "Invalid status code", error: !0 };
      let p = g.subarray(2);
      p[0] === 239 && p[1] === 187 && p[2] === 191 && (p = p.subarray(3));
      try {
        p = y(p);
      } catch {
        return { code: 1007, reason: "Invalid UTF-8", error: !0 };
      }
      return { code: E, reason: p, error: !1 };
    }
    /**
     * Parses control frames.
     * @param {Buffer} body
     */
    parseControlFrame(g) {
      const { opcode: E, payloadLength: p } = this.#A;
      if (E === s.CLOSE) {
        if (p === 1)
          return C(this.ws, "Received close frame with a 1-byte body."), !1;
        if (this.#A.closeInfo = this.parseCloseBody(g), this.#A.closeInfo.error) {
          const { code: I, reason: m } = this.#A.closeInfo;
          return M(this.ws, I, m, m.length), C(this.ws, m), !1;
        }
        if (this.ws[u] !== o.SENT) {
          let I = n;
          this.#A.closeInfo.code && (I = Buffer.allocUnsafe(2), I.writeUInt16BE(this.#A.closeInfo.code, 0));
          const m = new L(I);
          this.ws[l].socket.write(
            m.createFrame(s.CLOSE),
            (b) => {
              b || (this.ws[u] = o.SENT);
            }
          );
        }
        return this.ws[a] = r.CLOSING, this.ws[i] = !0, !1;
      } else if (E === s.PING) {
        if (!this.ws[i]) {
          const I = new L(g);
          this.ws[l].socket.write(I.createFrame(s.PONG)), c.ping.hasSubscribers && c.ping.publish({
            payload: g
          });
        }
      } else E === s.PONG && c.pong.hasSubscribers && c.pong.publish({
        payload: g
      });
      return !0;
    }
    get closingInfo() {
      return this.#A.closeInfo;
    }
  }
  return Hs = {
    ByteParser: B
  }, Hs;
}
var Os, Pi;
function Xg() {
  if (Pi) return Os;
  Pi = 1;
  const { WebsocketFrameSend: e } = vs(), { opcodes: t, sendHints: A } = Jt(), s = Do(), r = Buffer[Symbol.species];
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
          const C = {
            promise: null,
            callback: i,
            frame: h
          };
          this.#e.push(C);
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
  return Os = { SendQueue: n }, Os;
}
var Ps, xi;
function $g() {
  if (xi) return Ps;
  xi = 1;
  const { webidl: e } = $e(), { URLSerializer: t } = st(), { environmentSettingsObject: A } = it(), { staticPropertyDescriptors: s, states: r, sentCloseFrameState: n, sendHints: o } = Jt(), {
    kWebSocketURL: a,
    kReadyState: u,
    kController: l,
    kBinaryType: i,
    kResponse: c,
    kSentClose: Q,
    kByteParser: h
  } = MA(), {
    isConnecting: C,
    isEstablished: d,
    isClosing: y,
    isValidSubprotocol: D,
    fireEvent: k
  } = LA(), { establishWebSocketConnection: N, closeWebSocketConnection: L } = Ji(), { ByteParser: M } = jg(), { kEnumerableProperty: f, isBlobLike: B } = Ue(), { getGlobalDispatcher: w } = os(), { types: g } = rt, { ErrorEvent: E, CloseEvent: p } = oA(), { SendQueue: I } = Xg();
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
      if (v.length > 0 && !v.every((he) => D(he)))
        throw new DOMException("Invalid Sec-WebSocket-Protocol value", "SyntaxError");
      this[a] = new URL(ae.href);
      const Be = A.settingsObject;
      this[l] = N(
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
      if (e.argumentLengthCheck(arguments, 1, v), G = e.converters.WebSocketSendData(G, v, "data"), C(this))
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
        }, o.typedArray)) : B(G) && (this.#t += G.size, this.#A.add(G, () => {
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
      const $ = new M(this, v);
      $.on("drain", b), $.on("error", U.bind(this)), G.socket.ws = this, this[h] = $, this.#A = new I(G.socket), this[u] = r.OPEN;
      const ne = G.headersList.get("sec-websocket-extensions");
      ne !== null && (this.#r = ne);
      const ge = G.headersList.get("sec-websocket-protocol");
      ge !== null && (this.#s = ge), k("open", this);
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
      defaultValue: () => w()
    },
    {
      key: "headers",
      converter: e.nullableConverter(e.converters.HeadersInit)
    }
  ]), e.converters["DOMString or sequence<DOMString> or WebSocketInit"] = function(S) {
    return e.util.Type(S) === "Object" && !(Symbol.iterator in S) ? e.converters.WebSocketInit(S) : { protocols: e.converters["DOMString or sequence<DOMString>"](S) };
  }, e.converters.WebSocketSendData = function(S) {
    if (e.util.Type(S) === "Object") {
      if (B(S))
        return e.converters.Blob(S, { strict: !1 });
      if (ArrayBuffer.isView(S) || g.isArrayBuffer(S))
        return e.converters.BufferSource(S);
    }
    return e.converters.USVString(S);
  };
  function b() {
    this.ws[c].socket.resume();
  }
  function U(S) {
    let G, v;
    S instanceof p ? (G = S.reason, v = S.code) : G = S.message, k("error", this, () => new E("error", { error: S, message: G })), L(this, v);
  }
  return Ps = {
    WebSocket: m
  }, Ps;
}
var xs, _i;
function Vi() {
  if (_i) return xs;
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
  return xs = {
    isValidLastEventId: e,
    isASCIINumber: t,
    delay: A
  }, xs;
}
var _s, Wi;
function el() {
  if (Wi) return _s;
  Wi = 1;
  const { Transform: e } = ot, { isASCIINumber: t, isValidLastEventId: A } = Vi(), s = [239, 187, 191], r = 10, n = 13, o = 58, a = 32;
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
      let h = "", C = "";
      if (Q !== -1) {
        h = i.subarray(0, Q).toString("utf8");
        let d = Q + 1;
        i[d] === a && ++d, C = i.subarray(d).toString("utf8");
      } else
        h = i.toString("utf8"), C = "";
      switch (h) {
        case "data":
          c[h] === void 0 ? c[h] = C : c[h] += `
${C}`;
          break;
        case "retry":
          t(C) && (c[h] = C);
          break;
        case "id":
          A(C) && (c[h] = C);
          break;
        case "event":
          C.length > 0 && (c[h] = C);
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
  return _s = {
    EventSourceStream: u
  }, _s;
}
var Vs, qi;
function tl() {
  if (qi) return Vs;
  qi = 1;
  const { pipeline: e } = ot, { fetching: t } = NA(), { makeRequest: A } = nA(), { webidl: s } = $e(), { EventSourceStream: r } = el(), { parseMIMEType: n } = st(), { createFastMessageEvent: o } = oA(), { isNetworkError: a } = UA(), { delay: u } = Vi(), { kEnumerableProperty: l } = Ue(), { environmentSettingsObject: i } = it();
  let c = !1;
  const Q = 3e3, h = 0, C = 1, d = 2, y = "anonymous", D = "use-credentials";
  class k extends EventTarget {
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
    constructor(M, f = {}) {
      super(), s.util.markAsUncloneable(this);
      const B = "EventSource constructor";
      s.argumentLengthCheck(arguments, 1, B), c || (c = !0, process.emitWarning("EventSource is experimental, expect them to change at any time.", {
        code: "UNDICI-ES"
      })), M = s.converters.USVString(M, B, "url"), f = s.converters.EventSourceInitDict(f, B, "eventSourceInitDict"), this.#o = f.dispatcher, this.#i = {
        lastEventId: "",
        reconnectionTime: Q
      };
      const w = i;
      let g;
      try {
        g = new URL(M, w.settingsObject.baseUrl), this.#i.origin = g.origin;
      } catch (I) {
        throw new DOMException(I, "SyntaxError");
      }
      this.#t = g.href;
      let E = y;
      f.withCredentials && (E = D, this.#s = !0);
      const p = {
        redirect: "follow",
        keepalive: !0,
        // @see https://html.spec.whatwg.org/multipage/urls-and-fetching.html#cors-settings-attributes
        mode: "cors",
        credentials: E === "anonymous" ? "same-origin" : "omit",
        referrer: "no-referrer"
      };
      p.client = i.settingsObject, p.headersList = [["accept", { name: "accept", value: "text/event-stream" }]], p.cache = "no-store", p.initiator = "other", p.urlList = [new URL(this.#t)], this.#A = A(p), this.#a();
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
      const M = {
        request: this.#A,
        dispatcher: this.#o
      }, f = (B) => {
        a(B) && (this.dispatchEvent(new Event("error")), this.close()), this.#c();
      };
      M.processResponseEndOfBody = f, M.processResponse = (B) => {
        if (a(B))
          if (B.aborted) {
            this.close(), this.dispatchEvent(new Event("error"));
            return;
          } else {
            this.#c();
            return;
          }
        const w = B.headersList.get("content-type", !0), g = w !== null ? n(w) : "failure", E = g !== "failure" && g.essence === "text/event-stream";
        if (B.status !== 200 || E === !1) {
          this.close(), this.dispatchEvent(new Event("error"));
          return;
        }
        this.#r = C, this.dispatchEvent(new Event("open")), this.#i.origin = B.urlList[B.urlList.length - 1].origin;
        const p = new r({
          eventSourceSettings: this.#i,
          push: (I) => {
            this.dispatchEvent(o(
              I.type,
              I.options
            ));
          }
        });
        e(
          B.body.stream,
          p,
          (I) => {
            I?.aborted === !1 && (this.close(), this.dispatchEvent(new Event("error")));
          }
        );
      }, this.#n = t(M);
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
      s.brandCheck(this, k), this.#r !== d && (this.#r = d, this.#n.abort(), this.#A = null);
    }
    get onopen() {
      return this.#e.open;
    }
    set onopen(M) {
      this.#e.open && this.removeEventListener("open", this.#e.open), typeof M == "function" ? (this.#e.open = M, this.addEventListener("open", M)) : this.#e.open = null;
    }
    get onmessage() {
      return this.#e.message;
    }
    set onmessage(M) {
      this.#e.message && this.removeEventListener("message", this.#e.message), typeof M == "function" ? (this.#e.message = M, this.addEventListener("message", M)) : this.#e.message = null;
    }
    get onerror() {
      return this.#e.error;
    }
    set onerror(M) {
      this.#e.error && this.removeEventListener("error", this.#e.error), typeof M == "function" ? (this.#e.error = M, this.addEventListener("error", M)) : this.#e.error = null;
    }
  }
  const N = {
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
      value: C,
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
  return Object.defineProperties(k, N), Object.defineProperties(k.prototype, N), Object.defineProperties(k.prototype, {
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
  ]), Vs = {
    EventSource: k,
    defaultReconnectionTime: Q
  }, Vs;
}
var zi;
function Zi() {
  if (zi) return me;
  zi = 1;
  const e = tA(), t = yA(), A = AA(), s = mg(), r = rA(), n = No(), o = yg(), a = Dg(), u = Ye(), l = Ue(), { InvalidArgumentError: i } = u, c = Sg(), Q = DA(), h = ti(), C = Mg(), d = ri(), y = Zo(), D = Pr(), { getGlobalDispatcher: k, setGlobalDispatcher: N } = os(), L = as(), M = Fr(), f = Sr();
  Object.assign(t.prototype, c), me.Dispatcher = t, me.Client = e, me.Pool = A, me.BalancedPool = s, me.Agent = r, me.ProxyAgent = n, me.EnvHttpProxyAgent = o, me.RetryAgent = a, me.RetryHandler = D, me.DecoratorHandler = L, me.RedirectHandler = M, me.createRedirectInterceptor = f, me.interceptors = {
    redirect: Lg(),
    retry: Gg(),
    dump: vg(),
    dns: Yg()
  }, me.buildConnector = Q, me.errors = u, me.util = {
    parseHeaders: l.parseHeaders,
    headerNameToString: l.headerNameToString
  };
  function B(Be) {
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
      const { agent: we, dispatcher: X = k() } = Qe;
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
  me.setGlobalDispatcher = N, me.getGlobalDispatcher = k;
  const w = NA().fetch;
  me.fetch = async function(he, Qe = void 0) {
    try {
      return await w(he, Qe);
    } catch (ye) {
      throw ye && typeof ye == "object" && Error.captureStackTrace(ye), ye;
    }
  }, me.Headers = Yt().Headers, me.Response = UA().Response, me.Request = nA().Request, me.FormData = RA().FormData, me.File = globalThis.File ?? ct.File, me.FileReader = xg().FileReader;
  const { setGlobalOrigin: g, getGlobalOrigin: E } = ao();
  me.setGlobalOrigin = g, me.getGlobalOrigin = E;
  const { CacheStorage: p } = Wg(), { kConstruct: I } = ys();
  me.caches = new p(I);
  const { deleteCookie: m, getCookies: b, getSetCookies: U, setCookie: S } = Zg();
  me.deleteCookie = m, me.getCookies = b, me.getSetCookies = U, me.setCookie = S;
  const { parseMIMEType: G, serializeAMimeType: v } = st();
  me.parseMIMEType = G, me.serializeAMimeType = v;
  const { CloseEvent: $, ErrorEvent: ne, MessageEvent: ge } = oA();
  me.WebSocket = $g().WebSocket, me.CloseEvent = $, me.ErrorEvent = ne, me.MessageEvent = ge, me.request = B(c.request), me.stream = B(c.stream), me.pipeline = B(c.pipeline), me.connect = B(c.connect), me.upgrade = B(c.upgrade), me.MockClient = h, me.MockPool = d, me.MockAgent = C, me.mockErrors = y;
  const { EventSource: ae } = tl();
  return me.EventSource = ae, me;
}
var Al = Zi(), Qt;
(function(e) {
  e[e.OK = 200] = "OK", e[e.MultipleChoices = 300] = "MultipleChoices", e[e.MovedPermanently = 301] = "MovedPermanently", e[e.ResourceMoved = 302] = "ResourceMoved", e[e.SeeOther = 303] = "SeeOther", e[e.NotModified = 304] = "NotModified", e[e.UseProxy = 305] = "UseProxy", e[e.SwitchProxy = 306] = "SwitchProxy", e[e.TemporaryRedirect = 307] = "TemporaryRedirect", e[e.PermanentRedirect = 308] = "PermanentRedirect", e[e.BadRequest = 400] = "BadRequest", e[e.Unauthorized = 401] = "Unauthorized", e[e.PaymentRequired = 402] = "PaymentRequired", e[e.Forbidden = 403] = "Forbidden", e[e.NotFound = 404] = "NotFound", e[e.MethodNotAllowed = 405] = "MethodNotAllowed", e[e.NotAcceptable = 406] = "NotAcceptable", e[e.ProxyAuthenticationRequired = 407] = "ProxyAuthenticationRequired", e[e.RequestTimeout = 408] = "RequestTimeout", e[e.Conflict = 409] = "Conflict", e[e.Gone = 410] = "Gone", e[e.TooManyRequests = 429] = "TooManyRequests", e[e.InternalServerError = 500] = "InternalServerError", e[e.NotImplemented = 501] = "NotImplemented", e[e.BadGateway = 502] = "BadGateway", e[e.ServiceUnavailable = 503] = "ServiceUnavailable", e[e.GatewayTimeout = 504] = "GatewayTimeout";
})(Qt || (Qt = {}));
var Ki;
(function(e) {
  e.Accept = "accept", e.ContentType = "content-type";
})(Ki || (Ki = {}));
var ji;
(function(e) {
  e.ApplicationJson = "application/json";
})(ji || (ji = {})), Qt.MovedPermanently, Qt.ResourceMoved, Qt.SeeOther, Qt.TemporaryRedirect, Qt.PermanentRedirect, Qt.BadGateway, Qt.ServiceUnavailable, Qt.GatewayTimeout;
const { access: ZB, appendFile: KB, writeFile: jB } = dt.promises;
var Xi = function(e, t, A, s) {
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
const { chmod: XB, copyFile: $B, lstat: eC, mkdir: tC, open: AC, readdir: rl, rename: rC, rm: sl, rmdir: sC, stat: Ws, symlink: nC, unlink: oC } = mA.promises, Ut = process.platform === "win32";
mA.constants.O_RDONLY;
function nl(e) {
  return Xi(this, void 0, void 0, function* () {
    try {
      yield Ws(e);
    } catch (t) {
      if (t.code === "ENOENT")
        return !1;
      throw t;
    }
    return !0;
  });
}
function $i(e) {
  if (e = ol(e), !e)
    throw new Error('isRooted() parameter "p" cannot be empty');
  return Ut ? e.startsWith("\\") || /^[A-Z]:/i.test(e) : e.startsWith("/");
}
function ea(e, t) {
  return Xi(this, void 0, void 0, function* () {
    let A;
    try {
      A = yield Ws(e);
    } catch (r) {
      r.code !== "ENOENT" && console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${r}`);
    }
    if (A && A.isFile()) {
      if (Ut) {
        const r = ft.extname(e).toUpperCase();
        if (t.some((n) => n.toUpperCase() === r))
          return e;
      } else if (ta(A))
        return e;
    }
    const s = e;
    for (const r of t) {
      e = s + r, A = void 0;
      try {
        A = yield Ws(e);
      } catch (n) {
        n.code !== "ENOENT" && console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${n}`);
      }
      if (A && A.isFile()) {
        if (Ut) {
          try {
            const n = ft.dirname(e), o = ft.basename(e).toUpperCase();
            for (const a of yield rl(n))
              if (o === a.toUpperCase()) {
                e = ft.join(n, a);
                break;
              }
          } catch (n) {
            console.log(`Unexpected error attempting to determine the actual case of the file '${e}': ${n}`);
          }
          return e;
        } else if (ta(A))
          return e;
      }
    }
    return "";
  });
}
function ol(e) {
  return e = e || "", Ut ? (e = e.replace(/\//g, "\\"), e.replace(/\\\\+/g, "\\")) : e.replace(/\/\/+/g, "/");
}
function ta(e) {
  return (e.mode & 1) > 0 || (e.mode & 8) > 0 && process.getgid !== void 0 && e.gid === process.getgid() || (e.mode & 64) > 0 && process.getuid !== void 0 && e.uid === process.getuid();
}
var qs = function(e, t, A, s) {
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
function il(e) {
  return qs(this, void 0, void 0, function* () {
    if (Ut && /[*"<>|]/.test(e))
      throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
    try {
      yield sl(e, {
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
function Aa(e, t) {
  return qs(this, void 0, void 0, function* () {
    if (!e)
      throw new Error("parameter 'tool' is required");
    if (t) {
      const s = yield Aa(e, !1);
      if (!s)
        throw Ut ? new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`) : new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
      return s;
    }
    const A = yield al(e);
    return A && A.length > 0 ? A[0] : "";
  });
}
function al(e) {
  return qs(this, void 0, void 0, function* () {
    if (!e)
      throw new Error("parameter 'tool' is required");
    const t = [];
    if (Ut && process.env.PATHEXT)
      for (const r of process.env.PATHEXT.split(ft.delimiter))
        r && t.push(r);
    if ($i(e)) {
      const r = yield ea(e, t);
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
      const n = yield ea(ft.join(r, e), t);
      n && s.push(n);
    }
    return s;
  });
}
var ra = function(e, t, A, s) {
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
const GA = process.platform === "win32";
class cl extends Ln.EventEmitter {
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
    if (GA)
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
    return GA && this._isCmdFile() ? process.env.COMSPEC || "cmd.exe" : this.toolPath;
  }
  _getSpawnArgs(t) {
    if (GA && this._isCmdFile()) {
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
    return ra(this, void 0, void 0, function* () {
      return !$i(this.toolPath) && (this.toolPath.includes("/") || GA && this.toolPath.includes("\\")) && (this.toolPath = ft.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath)), this.toolPath = yield Aa(this.toolPath, !0), new Promise((t, A) => ra(this, void 0, void 0, function* () {
        this._debug(`exec tool: ${this.toolPath}`), this._debug("arguments:");
        for (const l of this.args)
          this._debug(`   ${l}`);
        const s = this._cloneExecOptions(this.options);
        !s.silent && s.outStream && s.outStream.write(this._getCommandString(s) + Et.EOL);
        const r = new bn(s, this.toolPath);
        if (r.on("debug", (l) => {
          this._debug(l);
        }), this.options.cwd && !(yield nl(this.options.cwd)))
          return A(new Error(`The cwd: ${this.options.cwd} does not exist!`));
        const n = this._getSpawnFileName(), o = og.spawn(n, this._getSpawnArgs(s), this._getSpawnOptions(this.options, n));
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
function gl(e) {
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
class bn extends Ln.EventEmitter {
  constructor(t, A) {
    if (super(), this.processClosed = !1, this.processError = "", this.processExitCode = 0, this.processExited = !1, this.processStderr = !1, this.delay = 1e4, this.done = !1, this.timeout = null, !A)
      throw new Error("toolPath must not be empty");
    this.options = t, this.toolPath = A, t.delay && (this.delay = t.delay);
  }
  CheckComplete() {
    this.done || (this.processClosed ? this._setResult() : this.processExited && (this.timeout = sg.setTimeout(bn.HandleTimeout, this.delay, this)));
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
var ll = function(e, t, A, s) {
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
function ul(e, t, A) {
  return ll(this, void 0, void 0, function* () {
    const s = gl(e);
    if (s.length === 0)
      throw new Error("Parameter 'commandLine' cannot be null or empty.");
    const r = s[0];
    return t = s.slice(1).concat(t || []), new cl(r, t, A).exec();
  });
}
fA.platform(), fA.arch();
var zs;
(function(e) {
  e[e.Success = 0] = "Success", e[e.Failure = 1] = "Failure";
})(zs || (zs = {}));
function at(e, t) {
  return (process.env[`INPUT_${e.replace(/ /g, "_").toUpperCase()}`] || "").trim();
}
function iA(e, t) {
  if (process.env.GITHUB_OUTPUT || "")
    return gg("OUTPUT", lg(e, t));
  process.stdout.write(Et.EOL), Kt("set-output", { name: e }, Zt(t));
}
function El(e) {
  process.exitCode = zs.Failure, Ql(e);
}
function sa(e) {
  Kt("debug", {}, e);
}
function Ql(e, t = {}) {
  Kt("error", Gn(t), e instanceof Error ? e.toString() : e);
}
function Zs(e, t = {}) {
  Kt("warning", Gn(t), e instanceof Error ? e.toString() : e);
}
function Xe(e) {
  process.stdout.write(e + Et.EOL);
}
function vA(e) {
  vn("group", e);
}
function YA() {
  vn("endgroup");
}
class na {
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
        process.stdout.write(`GITHUB_EVENT_PATH ${r} does not exist${fA.EOL}`);
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
var Oe = {}, aA = {}, oa;
function hl() {
  if (oa) return aA;
  oa = 1, Object.defineProperty(aA, "__esModule", { value: !0 }), aA.getProxyUrl = e, aA.checkBypass = t;
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
  return aA;
}
var ia;
function Bl() {
  if (ia) return Oe;
  ia = 1;
  var e = Oe && Oe.__createBinding || (Object.create ? (function(B, w, g, E) {
    E === void 0 && (E = g);
    var p = Object.getOwnPropertyDescriptor(w, g);
    (!p || ("get" in p ? !w.__esModule : p.writable || p.configurable)) && (p = { enumerable: !0, get: function() {
      return w[g];
    } }), Object.defineProperty(B, E, p);
  }) : (function(B, w, g, E) {
    E === void 0 && (E = g), B[E] = w[g];
  })), t = Oe && Oe.__setModuleDefault || (Object.create ? (function(B, w) {
    Object.defineProperty(B, "default", { enumerable: !0, value: w });
  }) : function(B, w) {
    B.default = w;
  }), A = Oe && Oe.__importStar || /* @__PURE__ */ (function() {
    var B = function(w) {
      return B = Object.getOwnPropertyNames || function(g) {
        var E = [];
        for (var p in g) Object.prototype.hasOwnProperty.call(g, p) && (E[E.length] = p);
        return E;
      }, B(w);
    };
    return function(w) {
      if (w && w.__esModule) return w;
      var g = {};
      if (w != null) for (var E = B(w), p = 0; p < E.length; p++) E[p] !== "default" && e(g, w, E[p]);
      return t(g, w), g;
    };
  })(), s = Oe && Oe.__awaiter || function(B, w, g, E) {
    function p(I) {
      return I instanceof g ? I : new g(function(m) {
        m(I);
      });
    }
    return new (g || (g = Promise))(function(I, m) {
      function b(G) {
        try {
          S(E.next(G));
        } catch (v) {
          m(v);
        }
      }
      function U(G) {
        try {
          S(E.throw(G));
        } catch (v) {
          m(v);
        }
      }
      function S(G) {
        G.done ? I(G.value) : p(G.value).then(b, U);
      }
      S((E = E.apply(B, w || [])).next());
    });
  };
  Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.HttpClient = Oe.HttpClientResponse = Oe.HttpClientError = Oe.MediaTypes = Oe.Headers = Oe.HttpCodes = void 0, Oe.getProxyUrl = Q, Oe.isHttps = L;
  const r = A(Tn), n = A(Sn), o = A(hl()), a = A(Pn()), u = Zi();
  var l;
  (function(B) {
    B[B.OK = 200] = "OK", B[B.MultipleChoices = 300] = "MultipleChoices", B[B.MovedPermanently = 301] = "MovedPermanently", B[B.ResourceMoved = 302] = "ResourceMoved", B[B.SeeOther = 303] = "SeeOther", B[B.NotModified = 304] = "NotModified", B[B.UseProxy = 305] = "UseProxy", B[B.SwitchProxy = 306] = "SwitchProxy", B[B.TemporaryRedirect = 307] = "TemporaryRedirect", B[B.PermanentRedirect = 308] = "PermanentRedirect", B[B.BadRequest = 400] = "BadRequest", B[B.Unauthorized = 401] = "Unauthorized", B[B.PaymentRequired = 402] = "PaymentRequired", B[B.Forbidden = 403] = "Forbidden", B[B.NotFound = 404] = "NotFound", B[B.MethodNotAllowed = 405] = "MethodNotAllowed", B[B.NotAcceptable = 406] = "NotAcceptable", B[B.ProxyAuthenticationRequired = 407] = "ProxyAuthenticationRequired", B[B.RequestTimeout = 408] = "RequestTimeout", B[B.Conflict = 409] = "Conflict", B[B.Gone = 410] = "Gone", B[B.TooManyRequests = 429] = "TooManyRequests", B[B.InternalServerError = 500] = "InternalServerError", B[B.NotImplemented = 501] = "NotImplemented", B[B.BadGateway = 502] = "BadGateway", B[B.ServiceUnavailable = 503] = "ServiceUnavailable", B[B.GatewayTimeout = 504] = "GatewayTimeout";
  })(l || (Oe.HttpCodes = l = {}));
  var i;
  (function(B) {
    B.Accept = "accept", B.ContentType = "content-type";
  })(i || (Oe.Headers = i = {}));
  var c;
  (function(B) {
    B.ApplicationJson = "application/json";
  })(c || (Oe.MediaTypes = c = {}));
  function Q(B) {
    const w = o.getProxyUrl(new URL(B));
    return w ? w.href : "";
  }
  const h = [
    l.MovedPermanently,
    l.ResourceMoved,
    l.SeeOther,
    l.TemporaryRedirect,
    l.PermanentRedirect
  ], C = [
    l.BadGateway,
    l.ServiceUnavailable,
    l.GatewayTimeout
  ], d = ["OPTIONS", "GET", "DELETE", "HEAD"], y = 10, D = 5;
  class k extends Error {
    constructor(w, g) {
      super(w), this.name = "HttpClientError", this.statusCode = g, Object.setPrototypeOf(this, k.prototype);
    }
  }
  Oe.HttpClientError = k;
  class N {
    constructor(w) {
      this.message = w;
    }
    readBody() {
      return s(this, void 0, void 0, function* () {
        return new Promise((w) => s(this, void 0, void 0, function* () {
          let g = Buffer.alloc(0);
          this.message.on("data", (E) => {
            g = Buffer.concat([g, E]);
          }), this.message.on("end", () => {
            w(g.toString());
          });
        }));
      });
    }
    readBodyBuffer() {
      return s(this, void 0, void 0, function* () {
        return new Promise((w) => s(this, void 0, void 0, function* () {
          const g = [];
          this.message.on("data", (E) => {
            g.push(E);
          }), this.message.on("end", () => {
            w(Buffer.concat(g));
          });
        }));
      });
    }
  }
  Oe.HttpClientResponse = N;
  function L(B) {
    return new URL(B).protocol === "https:";
  }
  class M {
    constructor(w, g, E) {
      this._ignoreSslError = !1, this._allowRedirects = !0, this._allowRedirectDowngrade = !1, this._maxRedirects = 50, this._allowRetries = !1, this._maxRetries = 1, this._keepAlive = !1, this._disposed = !1, this.userAgent = this._getUserAgentWithOrchestrationId(w), this.handlers = g || [], this.requestOptions = E, E && (E.ignoreSslError != null && (this._ignoreSslError = E.ignoreSslError), this._socketTimeout = E.socketTimeout, E.allowRedirects != null && (this._allowRedirects = E.allowRedirects), E.allowRedirectDowngrade != null && (this._allowRedirectDowngrade = E.allowRedirectDowngrade), E.maxRedirects != null && (this._maxRedirects = Math.max(E.maxRedirects, 0)), E.keepAlive != null && (this._keepAlive = E.keepAlive), E.allowRetries != null && (this._allowRetries = E.allowRetries), E.maxRetries != null && (this._maxRetries = E.maxRetries));
    }
    options(w, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("OPTIONS", w, null, g || {});
      });
    }
    get(w, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("GET", w, null, g || {});
      });
    }
    del(w, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("DELETE", w, null, g || {});
      });
    }
    post(w, g, E) {
      return s(this, void 0, void 0, function* () {
        return this.request("POST", w, g, E || {});
      });
    }
    patch(w, g, E) {
      return s(this, void 0, void 0, function* () {
        return this.request("PATCH", w, g, E || {});
      });
    }
    put(w, g, E) {
      return s(this, void 0, void 0, function* () {
        return this.request("PUT", w, g, E || {});
      });
    }
    head(w, g) {
      return s(this, void 0, void 0, function* () {
        return this.request("HEAD", w, null, g || {});
      });
    }
    sendStream(w, g, E, p) {
      return s(this, void 0, void 0, function* () {
        return this.request(w, g, E, p);
      });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(w) {
      return s(this, arguments, void 0, function* (g, E = {}) {
        E[i.Accept] = this._getExistingOrDefaultHeader(E, i.Accept, c.ApplicationJson);
        const p = yield this.get(g, E);
        return this._processResponse(p, this.requestOptions);
      });
    }
    postJson(w, g) {
      return s(this, arguments, void 0, function* (E, p, I = {}) {
        const m = JSON.stringify(p, null, 2);
        I[i.Accept] = this._getExistingOrDefaultHeader(I, i.Accept, c.ApplicationJson), I[i.ContentType] = this._getExistingOrDefaultContentTypeHeader(I, c.ApplicationJson);
        const b = yield this.post(E, m, I);
        return this._processResponse(b, this.requestOptions);
      });
    }
    putJson(w, g) {
      return s(this, arguments, void 0, function* (E, p, I = {}) {
        const m = JSON.stringify(p, null, 2);
        I[i.Accept] = this._getExistingOrDefaultHeader(I, i.Accept, c.ApplicationJson), I[i.ContentType] = this._getExistingOrDefaultContentTypeHeader(I, c.ApplicationJson);
        const b = yield this.put(E, m, I);
        return this._processResponse(b, this.requestOptions);
      });
    }
    patchJson(w, g) {
      return s(this, arguments, void 0, function* (E, p, I = {}) {
        const m = JSON.stringify(p, null, 2);
        I[i.Accept] = this._getExistingOrDefaultHeader(I, i.Accept, c.ApplicationJson), I[i.ContentType] = this._getExistingOrDefaultContentTypeHeader(I, c.ApplicationJson);
        const b = yield this.patch(E, m, I);
        return this._processResponse(b, this.requestOptions);
      });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(w, g, E, p) {
      return s(this, void 0, void 0, function* () {
        if (this._disposed)
          throw new Error("Client has already been disposed.");
        const I = new URL(g);
        let m = this._prepareRequest(w, I, p);
        const b = this._allowRetries && d.includes(w) ? this._maxRetries + 1 : 1;
        let U = 0, S;
        do {
          if (S = yield this.requestRaw(m, E), S && S.message && S.message.statusCode === l.Unauthorized) {
            let v;
            for (const $ of this.handlers)
              if ($.canHandleAuthentication(S)) {
                v = $;
                break;
              }
            return v ? v.handleAuthentication(this, m, E) : S;
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
              for (const ne in p)
                ne.toLowerCase() === "authorization" && delete p[ne];
            m = this._prepareRequest(w, $, p), S = yield this.requestRaw(m, E), G--;
          }
          if (!S.message.statusCode || !C.includes(S.message.statusCode))
            return S;
          U += 1, U < b && (yield S.readBody(), yield this._performExponentialBackoff(U));
        } while (U < b);
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
    requestRaw(w, g) {
      return s(this, void 0, void 0, function* () {
        return new Promise((E, p) => {
          function I(m, b) {
            m ? p(m) : b ? E(b) : p(new Error("Unknown error"));
          }
          this.requestRawWithCallback(w, g, I);
        });
      });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(w, g, E) {
      typeof g == "string" && (w.options.headers || (w.options.headers = {}), w.options.headers["Content-Length"] = Buffer.byteLength(g, "utf8"));
      let p = !1;
      function I(U, S) {
        p || (p = !0, E(U, S));
      }
      const m = w.httpModule.request(w.options, (U) => {
        const S = new N(U);
        I(void 0, S);
      });
      let b;
      m.on("socket", (U) => {
        b = U;
      }), m.setTimeout(this._socketTimeout || 3 * 6e4, () => {
        b && b.end(), I(new Error(`Request timeout: ${w.options.path}`));
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
    getAgent(w) {
      const g = new URL(w);
      return this._getAgent(g);
    }
    getAgentDispatcher(w) {
      const g = new URL(w), E = o.getProxyUrl(g);
      if (E && E.hostname)
        return this._getProxyAgentDispatcher(g, E);
    }
    _prepareRequest(w, g, E) {
      const p = {};
      p.parsedUrl = g;
      const I = p.parsedUrl.protocol === "https:";
      p.httpModule = I ? n : r;
      const m = I ? 443 : 80;
      if (p.options = {}, p.options.host = p.parsedUrl.hostname, p.options.port = p.parsedUrl.port ? parseInt(p.parsedUrl.port) : m, p.options.path = (p.parsedUrl.pathname || "") + (p.parsedUrl.search || ""), p.options.method = w, p.options.headers = this._mergeHeaders(E), this.userAgent != null && (p.options.headers["user-agent"] = this.userAgent), p.options.agent = this._getAgent(p.parsedUrl), this.handlers)
        for (const b of this.handlers)
          b.prepareRequest(p.options);
      return p;
    }
    _mergeHeaders(w) {
      return this.requestOptions && this.requestOptions.headers ? Object.assign({}, f(this.requestOptions.headers), f(w || {})) : f(w || {});
    }
    /**
     * Gets an existing header value or returns a default.
     * Handles converting number header values to strings since HTTP headers must be strings.
     * Note: This returns string | string[] since some headers can have multiple values.
     * For headers that must always be a single string (like Content-Type), use the
     * specialized _getExistingOrDefaultContentTypeHeader method instead.
     */
    _getExistingOrDefaultHeader(w, g, E) {
      let p;
      if (this.requestOptions && this.requestOptions.headers) {
        const m = f(this.requestOptions.headers)[g];
        m && (p = typeof m == "number" ? m.toString() : m);
      }
      const I = w[g];
      return I !== void 0 ? typeof I == "number" ? I.toString() : I : p !== void 0 ? p : E;
    }
    /**
     * Specialized version of _getExistingOrDefaultHeader for Content-Type header.
     * Always returns a single string (not an array) since Content-Type should be a single value.
     * Converts arrays to comma-separated strings and numbers to strings to ensure type safety.
     * This was split from _getExistingOrDefaultHeader to provide stricter typing for callers
     * that assign the result to places expecting a string (e.g., additionalHeaders[Headers.ContentType]).
     */
    _getExistingOrDefaultContentTypeHeader(w, g) {
      let E;
      if (this.requestOptions && this.requestOptions.headers) {
        const I = f(this.requestOptions.headers)[i.ContentType];
        I && (typeof I == "number" ? E = String(I) : Array.isArray(I) ? E = I.join(", ") : E = I);
      }
      const p = w[i.ContentType];
      return p !== void 0 ? typeof p == "number" ? String(p) : Array.isArray(p) ? p.join(", ") : p : E !== void 0 ? E : g;
    }
    _getAgent(w) {
      let g;
      const E = o.getProxyUrl(w), p = E && E.hostname;
      if (this._keepAlive && p && (g = this._proxyAgent), p || (g = this._agent), g)
        return g;
      const I = w.protocol === "https:";
      let m = 100;
      if (this.requestOptions && (m = this.requestOptions.maxSockets || r.globalAgent.maxSockets), E && E.hostname) {
        const b = {
          maxSockets: m,
          keepAlive: this._keepAlive,
          proxy: Object.assign(Object.assign({}, (E.username || E.password) && {
            proxyAuth: `${E.username}:${E.password}`
          }), { host: E.hostname, port: E.port })
        };
        let U;
        const S = E.protocol === "https:";
        I ? U = S ? a.httpsOverHttps : a.httpsOverHttp : U = S ? a.httpOverHttps : a.httpOverHttp, g = U(b), this._proxyAgent = g;
      }
      if (!g) {
        const b = { keepAlive: this._keepAlive, maxSockets: m };
        g = I ? new n.Agent(b) : new r.Agent(b), this._agent = g;
      }
      return I && this._ignoreSslError && (g.options = Object.assign(g.options || {}, {
        rejectUnauthorized: !1
      })), g;
    }
    _getProxyAgentDispatcher(w, g) {
      let E;
      if (this._keepAlive && (E = this._proxyAgentDispatcher), E)
        return E;
      const p = w.protocol === "https:";
      return E = new u.ProxyAgent(Object.assign({ uri: g.href, pipelining: this._keepAlive ? 1 : 0 }, (g.username || g.password) && {
        token: `Basic ${Buffer.from(`${g.username}:${g.password}`).toString("base64")}`
      })), this._proxyAgentDispatcher = E, p && this._ignoreSslError && (E.options = Object.assign(E.options.requestTls || {}, {
        rejectUnauthorized: !1
      })), E;
    }
    _getUserAgentWithOrchestrationId(w) {
      const g = w || "actions/http-client", E = process.env.ACTIONS_ORCHESTRATION_ID;
      if (E) {
        const p = E.replace(/[^a-z0-9_.-]/gi, "_");
        return `${g} actions_orchestration_id/${p}`;
      }
      return g;
    }
    _performExponentialBackoff(w) {
      return s(this, void 0, void 0, function* () {
        w = Math.min(y, w);
        const g = D * Math.pow(2, w);
        return new Promise((E) => setTimeout(() => E(), g));
      });
    }
    _processResponse(w, g) {
      return s(this, void 0, void 0, function* () {
        return new Promise((E, p) => s(this, void 0, void 0, function* () {
          const I = w.message.statusCode || 0, m = {
            statusCode: I,
            result: null,
            headers: {}
          };
          I === l.NotFound && E(m);
          function b(G, v) {
            if (typeof v == "string") {
              const $ = new Date(v);
              if (!isNaN($.valueOf()))
                return $;
            }
            return v;
          }
          let U, S;
          try {
            S = yield w.readBody(), S && S.length > 0 && (g && g.deserializeDates ? U = JSON.parse(S, b) : U = JSON.parse(S), m.result = U), m.headers = w.message.headers;
          } catch {
          }
          if (I > 299) {
            let G;
            U && U.message ? G = U.message : S && S.length > 0 ? G = S : G = `Failed request: (${I})`;
            const v = new k(G, I);
            v.result = m.result, p(v);
          } else
            E(m);
        }));
      });
    }
  }
  Oe.HttpClient = M;
  const f = (B) => Object.keys(B).reduce((w, g) => (w[g.toLowerCase()] = B[g], w), {});
  return Oe;
}
var aa = Bl(), Cl = function(e, t, A, s) {
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
function Il(e, t) {
  if (!e && !t.auth)
    throw new Error("Parameter token or opts.auth is required");
  if (e && t.auth)
    throw new Error("Parameters token and opts.auth may not both be specified");
  return typeof t.auth == "string" ? t.auth : `token ${e}`;
}
function dl(e) {
  return new aa.HttpClient().getAgent(e);
}
function fl(e) {
  return new aa.HttpClient().getAgentDispatcher(e);
}
function pl(e) {
  const t = fl(e);
  return (s, r) => Cl(this, void 0, void 0, function* () {
    return Al.fetch(s, Object.assign(Object.assign({}, r), { dispatcher: t }));
  });
}
function wl() {
  return process.env.GITHUB_API_URL || "https://api.github.com";
}
function JA() {
  return typeof navigator == "object" && "userAgent" in navigator ? navigator.userAgent : typeof process == "object" && process.version !== void 0 ? `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})` : "<environment undetectable>";
}
function ca(e, t, A, s) {
  if (typeof A != "function")
    throw new Error("method for before hook must be a function");
  return s || (s = {}), Array.isArray(t) ? t.reverse().reduce((r, n) => ca.bind(null, e, n, r, s), A)() : Promise.resolve().then(() => e.registry[t] ? e.registry[t].reduce((r, n) => n.hook.bind(null, r, s), A)() : A(s));
}
function ml(e, t, A, s) {
  const r = s;
  e.registry[A] || (e.registry[A] = []), t === "before" && (s = (n, o) => Promise.resolve().then(r.bind(null, o)).then(n.bind(null, o))), t === "after" && (s = (n, o) => {
    let a;
    return Promise.resolve().then(n.bind(null, o)).then((u) => (a = u, r(a, o))).then(() => a);
  }), t === "error" && (s = (n, o) => Promise.resolve().then(n.bind(null, o)).catch((a) => r(a, o))), e.registry[A].push({
    hook: s,
    orig: r
  });
}
function yl(e, t, A) {
  if (!e.registry[t])
    return;
  const s = e.registry[t].map((r) => r.orig).indexOf(A);
  s !== -1 && e.registry[t].splice(s, 1);
}
const ga = Function.bind, la = ga.bind(ga);
function Dl(e, t, A) {
  const s = la(yl, null).apply(
    null,
    [t]
  );
  e.api = { remove: s }, e.remove = s, ["before", "error", "after", "wrap"].forEach((r) => {
    const n = [t, r];
    e[r] = e.api[r] = la(ml, null).apply(null, n);
  });
}
function bl() {
  const e = {
    registry: {}
  }, t = ca.bind(null, e);
  return Dl(t, e), t;
}
var Rl = { Collection: bl }, kl = "0.0.0-development", Fl = `octokit-endpoint.js/${kl} ${JA()}`, Tl = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": Fl
  },
  mediaType: {
    format: ""
  }
};
function Sl(e) {
  return e ? Object.keys(e).reduce((t, A) => (t[A.toLowerCase()] = e[A], t), {}) : {};
}
function Ul(e) {
  if (typeof e != "object" || e === null || Object.prototype.toString.call(e) !== "[object Object]") return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null) return !0;
  const A = Object.prototype.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof A == "function" && A instanceof A && Function.prototype.call(A) === Function.prototype.call(e);
}
function ua(e, t) {
  const A = Object.assign({}, e);
  return Object.keys(t).forEach((s) => {
    Ul(t[s]) ? s in e ? A[s] = ua(e[s], t[s]) : Object.assign(A, { [s]: t[s] }) : Object.assign(A, { [s]: t[s] });
  }), A;
}
function Ea(e) {
  for (const t in e)
    e[t] === void 0 && delete e[t];
  return e;
}
function Ks(e, t, A) {
  if (typeof t == "string") {
    let [r, n] = t.split(" ");
    A = Object.assign(n ? { method: r, url: n } : { url: r }, A);
  } else
    A = Object.assign({}, t);
  A.headers = Sl(A.headers), Ea(A), Ea(A.headers);
  const s = ua(e || {}, A);
  return A.url === "/graphql" && (e && e.mediaType.previews?.length && (s.mediaType.previews = e.mediaType.previews.filter(
    (r) => !s.mediaType.previews.includes(r)
  ).concat(s.mediaType.previews)), s.mediaType.previews = (s.mediaType.previews || []).map((r) => r.replace(/-preview/, ""))), s;
}
function Nl(e, t) {
  const A = /\?/.test(e) ? "&" : "?", s = Object.keys(t);
  return s.length === 0 ? e : e + A + s.map((r) => r === "q" ? "q=" + t.q.split("+").map(encodeURIComponent).join("+") : `${r}=${encodeURIComponent(t[r])}`).join("&");
}
var Ml = /\{[^{}}]+\}/g;
function Ll(e) {
  return e.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function Gl(e) {
  const t = e.match(Ml);
  return t ? t.map(Ll).reduce((A, s) => A.concat(s), []) : [];
}
function Qa(e, t) {
  const A = { __proto__: null };
  for (const s of Object.keys(e))
    t.indexOf(s) === -1 && (A[s] = e[s]);
  return A;
}
function ha(e) {
  return e.split(/(%[0-9A-Fa-f]{2})/g).map(function(t) {
    return /%[0-9A-Fa-f]/.test(t) || (t = encodeURI(t).replace(/%5B/g, "[").replace(/%5D/g, "]")), t;
  }).join("");
}
function Ht(e) {
  return encodeURIComponent(e).replace(/[!'()*]/g, function(t) {
    return "%" + t.charCodeAt(0).toString(16).toUpperCase();
  });
}
function cA(e, t, A) {
  return t = e === "+" || e === "#" ? ha(t) : Ht(t), A ? Ht(A) + "=" + t : t;
}
function Ot(e) {
  return e != null;
}
function js(e) {
  return e === ";" || e === "&" || e === "?";
}
function vl(e, t, A, s) {
  var r = e[A], n = [];
  if (Ot(r) && r !== "")
    if (typeof r == "string" || typeof r == "number" || typeof r == "bigint" || typeof r == "boolean")
      r = r.toString(), s && s !== "*" && (r = r.substring(0, parseInt(s, 10))), n.push(
        cA(t, r, js(t) ? A : "")
      );
    else if (s === "*")
      Array.isArray(r) ? r.filter(Ot).forEach(function(o) {
        n.push(
          cA(t, o, js(t) ? A : "")
        );
      }) : Object.keys(r).forEach(function(o) {
        Ot(r[o]) && n.push(cA(t, r[o], o));
      });
    else {
      const o = [];
      Array.isArray(r) ? r.filter(Ot).forEach(function(a) {
        o.push(cA(t, a));
      }) : Object.keys(r).forEach(function(a) {
        Ot(r[a]) && (o.push(Ht(a)), o.push(cA(t, r[a].toString())));
      }), js(t) ? n.push(Ht(A) + "=" + o.join(",")) : o.length !== 0 && n.push(o.join(","));
    }
  else
    t === ";" ? Ot(r) && n.push(Ht(A)) : r === "" && (t === "&" || t === "?") ? n.push(Ht(A) + "=") : r === "" && n.push("");
  return n;
}
function Yl(e) {
  return {
    expand: Jl.bind(null, e)
  };
}
function Jl(e, t) {
  var A = ["+", "#", ".", "/", ";", "?", "&"];
  return e = e.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(s, r, n) {
      if (r) {
        let a = "";
        const u = [];
        if (A.indexOf(r.charAt(0)) !== -1 && (a = r.charAt(0), r = r.substr(1)), r.split(/,/g).forEach(function(l) {
          var i = /([^:\*]*)(?::(\d+)|(\*))?/.exec(l);
          u.push(vl(t, a, i[1], i[2] || i[3]));
        }), a && a !== "+") {
          var o = ",";
          return a === "?" ? o = "&" : a !== "#" && (o = a), (u.length !== 0 ? a : "") + u.join(o);
        } else
          return u.join(",");
      } else
        return ha(n);
    }
  ), e === "/" ? e : e.replace(/\/$/, "");
}
function Ba(e) {
  let t = e.method.toUpperCase(), A = (e.url || "/").replace(/:([a-z]\w+)/g, "{$1}"), s = Object.assign({}, e.headers), r, n = Qa(e, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const o = Gl(A);
  A = Yl(A).expand(n), /^http/.test(A) || (A = e.baseUrl + A);
  const a = Object.keys(e).filter((i) => o.includes(i)).concat("baseUrl"), u = Qa(n, a);
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
  return ["GET", "HEAD"].includes(t) ? A = Nl(A, u) : "data" in u ? r = u.data : Object.keys(u).length && (r = u), !s["content-type"] && typeof r < "u" && (s["content-type"] = "application/json; charset=utf-8"), ["PATCH", "PUT"].includes(t) && typeof r > "u" && (r = ""), Object.assign(
    { method: t, url: A, headers: s },
    typeof r < "u" ? { body: r } : null,
    e.request ? { request: e.request } : null
  );
}
function Hl(e, t, A) {
  return Ba(Ks(e, t, A));
}
function Ca(e, t) {
  const A = Ks(e, t), s = Hl.bind(null, A);
  return Object.assign(s, {
    DEFAULTS: A,
    defaults: Ca.bind(null, A),
    merge: Ks.bind(null, A),
    parse: Ba
  });
}
var Ol = Ca(null, Tl), Pt = {}, Ia;
function Pl() {
  if (Ia) return Pt;
  Ia = 1;
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
var xl = Pl();
const _l = /^-?\d+$/, da = /^-?\d+n+$/, Xs = JSON.stringify, fa = JSON.parse, Vl = /^-?\d+n$/, Wl = /([\[:])?"(-?\d+)n"($|([\\n]|\s)*(\s|[\\n])*[,\}\]])/g, ql = /([\[:])?("-?\d+n+)n("$|"([\\n]|\s)*(\s|[\\n])*[,\}\]])/g, zl = (e, t, A) => "rawJSON" in JSON ? Xs(
  e,
  (o, a) => typeof a == "bigint" ? JSON.rawJSON(a.toString()) : (Array.isArray(t) && t.includes(o), a),
  A
) : e ? Xs(
  e,
  (o, a) => typeof a == "string" && !!a.match(da) || typeof a == "bigint" ? a.toString() + "n" : (Array.isArray(t) && t.includes(o), a),
  A
).replace(
  Wl,
  "$1$2$3"
).replace(ql, "$1$2$3") : Xs(e, t, A), Zl = () => JSON.parse("1", (e, t, A) => !!A && A.source === "1"), Kl = (e, t, A, s) => typeof t == "string" && t.match(Vl) ? BigInt(t.slice(0, -1)) : typeof t == "string" && t.match(da) ? t.slice(0, -1) : t, jl = (e, t) => JSON.parse(e, (A, s, r) => {
  const n = typeof s == "number" && (s > Number.MAX_SAFE_INTEGER || s < Number.MIN_SAFE_INTEGER), o = r && _l.test(r.source);
  return n && o ? BigInt(r.source) : s;
}), pa = Number.MAX_SAFE_INTEGER.toString(), wa = pa.length, Xl = /"(?:\\.|[^"])*"|-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?[0-9]+)?/g, $l = /^"-?\d+n+"$/, eu = (e, t) => {
  if (!e) return fa(e, t);
  if (Zl()) return jl(e);
  const A = e.replace(
    Xl,
    (s, r, n, o) => {
      const a = s[0] === '"';
      if (a && !!s.match($l)) return s.substring(0, s.length - 1) + 'n"';
      const l = n || o, i = r && (r.length < wa || r.length === wa && r <= pa);
      return a || l || i ? s : '"' + s + 'n"';
    }
  );
  return fa(
    A,
    (s, r, n) => Kl(s, r)
  );
};
class HA extends Error {
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
var tu = "10.0.8", Au = {
  headers: {
    "user-agent": `octokit-request.js/${tu} ${JA()}`
  }
};
function ru(e) {
  if (typeof e != "object" || e === null || Object.prototype.toString.call(e) !== "[object Object]") return !1;
  const t = Object.getPrototypeOf(e);
  if (t === null) return !0;
  const A = Object.prototype.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof A == "function" && A instanceof A && Function.prototype.call(A) === Function.prototype.call(e);
}
var ma = () => "";
async function ya(e) {
  const t = e.request?.fetch || globalThis.fetch;
  if (!t)
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  const A = e.request?.log || console, s = e.request?.parseSuccessResponseBody !== !1, r = ru(e.body) || Array.isArray(e.body) ? zl(e.body) : e.body, n = Object.fromEntries(
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
    const h = new HA(Q, 500, {
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
    throw new HA(o.statusText, a, {
      response: i,
      request: e
    });
  }
  if (a === 304)
    throw i.data = await $s(o), new HA("Not modified", a, {
      response: i,
      request: e
    });
  if (a >= 400)
    throw i.data = await $s(o), new HA(nu(i.data), a, {
      response: i,
      request: e
    });
  return i.data = s ? await $s(o) : o.body, i;
}
async function $s(e) {
  const t = e.headers.get("content-type");
  if (!t)
    return e.text().catch(ma);
  const A = xl.safeParse(t);
  if (su(A)) {
    let s = "";
    try {
      return s = await e.text(), eu(s);
    } catch {
      return s;
    }
  } else return A.type.startsWith("text/") || A.parameters.charset?.toLowerCase() === "utf-8" ? e.text().catch(ma) : e.arrayBuffer().catch(
    /* v8 ignore next -- @preserve */
    () => new ArrayBuffer(0)
  );
}
function su(e) {
  return e.type === "application/json" || e.type === "application/scim+json";
}
function nu(e) {
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
function en(e, t) {
  const A = e.defaults(t);
  return Object.assign(function(r, n) {
    const o = A.merge(r, n);
    if (!o.request || !o.request.hook)
      return ya(A.parse(o));
    const a = (u, l) => ya(
      A.parse(A.merge(u, l))
    );
    return Object.assign(a, {
      endpoint: A,
      defaults: en.bind(null, A)
    }), o.request.hook(a, o);
  }, {
    endpoint: A,
    defaults: en.bind(null, A)
  });
}
var tn = en(Ol, Au);
var ou = "0.0.0-development";
function iu(e) {
  return `Request failed due to following response errors:
` + e.errors.map((t) => ` - ${t.message}`).join(`
`);
}
var au = class extends Error {
  constructor(e, t, A) {
    super(iu(A)), this.request = e, this.headers = t, this.response = A, this.errors = A.errors, this.data = A.data, Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
  name = "GraphqlResponseError";
  errors;
  data;
}, cu = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType",
  "operationName"
], gu = ["query", "method", "url"], Da = /\/api\/v3\/?$/;
function lu(e, t, A) {
  if (A) {
    if (typeof t == "string" && "query" in A)
      return Promise.reject(
        new Error('[@octokit/graphql] "query" cannot be used as variable name')
      );
    for (const o in A)
      if (gu.includes(o))
        return Promise.reject(
          new Error(
            `[@octokit/graphql] "${o}" cannot be used as variable name`
          )
        );
  }
  const s = typeof t == "string" ? Object.assign({ query: t }, A) : t, r = Object.keys(
    s
  ).reduce((o, a) => cu.includes(a) ? (o[a] = s[a], o) : (o.variables || (o.variables = {}), o.variables[a] = s[a], o), {}), n = s.baseUrl || e.endpoint.DEFAULTS.baseUrl;
  return Da.test(n) && (r.url = n.replace(Da, "/api/graphql")), e(r).then((o) => {
    if (o.data.errors) {
      const a = {};
      for (const u of Object.keys(o.headers))
        a[u] = o.headers[u];
      throw new au(
        r,
        a,
        o.data
      );
    }
    return o.data.data;
  });
}
function An(e, t) {
  const A = e.defaults(t);
  return Object.assign((r, n) => lu(A, r, n), {
    defaults: An.bind(null, A),
    endpoint: A.endpoint
  });
}
An(tn, {
  headers: {
    "user-agent": `octokit-graphql.js/${ou} ${JA()}`
  },
  method: "POST",
  url: "/graphql"
});
function uu(e) {
  return An(e, {
    method: "POST",
    url: "/graphql"
  });
}
var rn = "(?:[a-zA-Z0-9_-]+)", ba = "\\.", Ra = new RegExp(`^${rn}${ba}${rn}${ba}${rn}$`), Eu = Ra.test.bind(Ra);
async function Qu(e) {
  const t = Eu(e), A = e.startsWith("v1.") || e.startsWith("ghs_"), s = e.startsWith("ghu_");
  return {
    type: "token",
    token: e,
    tokenType: t ? "app" : A ? "installation" : s ? "user-to-server" : "oauth"
  };
}
function hu(e) {
  return e.split(/\./).length === 3 ? `bearer ${e}` : `token ${e}`;
}
async function Bu(e, t, A, s) {
  const r = t.endpoint.merge(
    A,
    s
  );
  return r.headers.authorization = hu(e), t(r);
}
var Cu = function(t) {
  if (!t)
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  if (typeof t != "string")
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  return t = t.replace(/^(token|bearer) +/i, ""), Object.assign(Qu.bind(null, t), {
    hook: Bu.bind(null, t)
  });
};
const ka = "7.0.6", Fa = () => {
}, Iu = console.warn.bind(console), du = console.error.bind(console);
function fu(e = {}) {
  return typeof e.debug != "function" && (e.debug = Fa), typeof e.info != "function" && (e.info = Fa), typeof e.warn != "function" && (e.warn = Iu), typeof e.error != "function" && (e.error = du), e;
}
const Ta = `octokit-core.js/${ka} ${JA()}`;
class pu {
  static VERSION = ka;
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
    const A = new Rl.Collection(), s = {
      baseUrl: tn.endpoint.DEFAULTS.baseUrl,
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
    if (s.headers["user-agent"] = t.userAgent ? `${t.userAgent} ${Ta}` : Ta, t.baseUrl && (s.baseUrl = t.baseUrl), t.previews && (s.mediaType.previews = t.previews), t.timeZone && (s.headers["time-zone"] = t.timeZone), this.request = tn.defaults(s), this.graphql = uu(this.request).defaults(s), this.log = fu(t.log), this.hook = A, t.authStrategy) {
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
      const n = Cu(t.auth);
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
const wu = "17.0.0", mu = {
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
var yu = mu;
const Nt = /* @__PURE__ */ new Map();
for (const [e, t] of Object.entries(yu))
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
const Du = {
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
    return o ? A[s] = Ru(
      e,
      t,
      s,
      n,
      o
    ) : A[s] = e.request.defaults(n), A[s];
  }
};
function bu(e) {
  const t = {};
  for (const A of Nt.keys())
    t[A] = new Proxy({ octokit: e, scope: A, cache: {} }, Du);
  return t;
}
function Ru(e, t, A, s, r) {
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
function Sa(e) {
  return {
    rest: bu(e)
  };
}
Sa.VERSION = wu;
var ku = "0.0.0-development";
function Fu(e) {
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
function sn(e, t, A) {
  const s = typeof t == "function" ? t.endpoint(A) : e.request.endpoint(t, A), r = typeof t == "function" ? t : e.request, n = s.method, o = s.headers;
  let a = s.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!a) return { done: !0 };
        try {
          const u = await r({ method: n, url: a, headers: o }), l = Fu(u);
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
function Ua(e, t, A, s) {
  return typeof A == "function" && (s = A, A = void 0), Na(
    e,
    [],
    sn(e, t, A)[Symbol.asyncIterator](),
    s
  );
}
function Na(e, t, A, s) {
  return A.next().then((r) => {
    if (r.done)
      return t;
    let n = !1;
    function o() {
      n = !0;
    }
    return t = t.concat(
      s ? s(r.value, o) : r.value.data
    ), n ? t : Na(e, t, A, s);
  });
}
Object.assign(Ua, {
  iterator: sn
});
function Ma(e) {
  return {
    paginate: Object.assign(Ua.bind(null, e), {
      iterator: sn.bind(null, e)
    })
  };
}
Ma.VERSION = ku, new na();
const nn = wl(), Tu = {
  baseUrl: nn,
  request: {
    agent: dl(nn),
    fetch: pl(nn)
  }
}, Su = pu.plugin(Sa, Ma).defaults(Tu);
function Uu(e, t) {
  const A = Object.assign({}, {}), s = Il(e, A);
  return s && (A.auth = s), A;
}
const on = new na();
function Nu(e, t, ...A) {
  const s = Su.plugin(...A);
  return new s(Uu(e));
}
const et = (e) => `\`${e}\``, Mu = (e, t) => `[${e}](${t})`, La = (e) => `<sub>${e}</sub>`, OA = (e) => `<sup>${e}</sup>`, PA = (e) => `**${e}**`;
async function Lu({
  token: e,
  commentSignature: t,
  repo: A,
  prNumber: s,
  body: r
}) {
  vA("Comment on PR"), r += `

${t}`;
  const n = Nu(e);
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
  })), YA();
}
let Ga = {};
const va = /* @__PURE__ */ new WeakMap(), Ya = {
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
class Gu {
  constructor(t, A) {
    A = Object.assign({
      units: "metric",
      precision: 1,
      locale: void 0
      // Default to the user's system locale
    }, Ga, A), va.set(this, A), Object.assign(Ya, A.customUnits);
    const s = t < 0 ? "-" : "";
    t = Math.abs(t);
    const r = Ya[A.units];
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
    const t = va.get(this);
    return t.toStringFn ? t.toStringFn.bind(this)() : `${this.value} ${this.unit}`;
  }
}
function tt(e, t) {
  return new Gu(e, t);
}
tt.defaultOptions = function(e) {
  Ga = e;
};
function vu(e) {
  return e.length;
}
function pt(e, t) {
  const A = t || {}, s = (A.align || []).concat(), r = A.stringLength || vu, n = [], o = [], a = [], u = [];
  let l = 0, i = -1;
  for (; ++i < e.length; ) {
    const d = [], y = [];
    let D = -1;
    for (e[i].length > l && (l = e[i].length); ++D < e[i].length; ) {
      const k = Yu(e[i][D]);
      if (A.alignDelimiters !== !1) {
        const N = r(k);
        y[D] = N, (u[D] === void 0 || N > u[D]) && (u[D] = N);
      }
      d.push(k);
    }
    o[i] = d, a[i] = y;
  }
  let c = -1;
  if (typeof s == "object" && "length" in s)
    for (; ++c < l; )
      n[c] = Ja(s[c]);
  else {
    const d = Ja(s);
    for (; ++c < l; )
      n[c] = d;
  }
  c = -1;
  const Q = [], h = [];
  for (; ++c < l; ) {
    const d = n[c];
    let y = "", D = "";
    d === 99 ? (y = ":", D = ":") : d === 108 ? y = ":" : d === 114 && (D = ":");
    let k = A.alignDelimiters === !1 ? 1 : Math.max(
      1,
      u[c] - y.length - D.length
    );
    const N = y + "-".repeat(k) + D;
    A.alignDelimiters !== !1 && (k = y.length + k + D.length, k > u[c] && (u[c] = k), h[c] = k), Q[c] = N;
  }
  o.splice(1, 0, Q), a.splice(1, 0, h), i = -1;
  const C = [];
  for (; ++i < o.length; ) {
    const d = o[i], y = a[i];
    c = -1;
    const D = [];
    for (; ++c < l; ) {
      const k = d[c] || "";
      let N = "", L = "";
      if (A.alignDelimiters !== !1) {
        const M = u[c] - (y[c] || 0), f = n[c];
        f === 114 ? N = " ".repeat(M) : f === 99 ? M % 2 ? (N = " ".repeat(M / 2 + 0.5), L = " ".repeat(M / 2 - 0.5)) : (N = " ".repeat(M / 2), L = N) : L = " ".repeat(M);
      }
      A.delimiterStart !== !1 && !c && D.push("|"), A.padding !== !1 && // Don’t add the opening space if we’re not aligning and the cell is
      // empty: there will be a closing space.
      !(A.alignDelimiters === !1 && k === "") && (A.delimiterStart !== !1 || c) && D.push(" "), A.alignDelimiters !== !1 && D.push(N), D.push(k), A.alignDelimiters !== !1 && D.push(L), A.padding !== !1 && D.push(" "), (A.delimiterEnd !== !1 || c !== l - 1) && D.push("|");
    }
    C.push(
      A.delimiterEnd === !1 ? D.join("").replace(/ +$/, "") : D.join("")
    );
  }
  return C.join(`
`);
}
function Yu(e) {
  return e == null ? "" : String(e);
}
function Ja(e) {
  const t = typeof e == "string" ? e.codePointAt(0) : 0;
  return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
function xA() {
}
function Ha() {
  return typeof WeakMap < "u" ? /* @__PURE__ */ new WeakMap() : Ju();
}
function Ju() {
  return {
    add: xA,
    delete: xA,
    get: xA,
    set: xA,
    has: function(e) {
      return !1;
    }
  };
}
var Hu = Object.prototype.hasOwnProperty, an = function(e, t) {
  return Hu.call(e, t);
};
function cn(e, t) {
  for (var A in t)
    an(t, A) && (e[A] = t[A]);
  return e;
}
var Ou = /^[ \t]*(?:\r\n|\r|\n)/, Pu = /(?:\r\n|\r|\n)[ \t]*$/, xu = /^(?:[\r\n]|$)/, _u = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/, Vu = /^[ \t]*[\r\n][ \t\r\n]*$/;
function Oa(e, t, A) {
  var s = 0, r = e[0].match(_u);
  r && (s = r[1].length);
  var n = "(\\r\\n|\\r|\\n).{0," + s + "}", o = new RegExp(n, "g");
  t && (e = e.slice(1));
  var a = A.newline, u = A.trimLeadingNewline, l = A.trimTrailingNewline, i = typeof a == "string", c = e.length, Q = e.map(function(h, C) {
    return h = h.replace(o, "$1"), C === 0 && u && (h = h.replace(Ou, "")), C === c - 1 && l && (h = h.replace(Pu, "")), i && (h = h.replace(/\r\n|\n|\r/g, function(d) {
      return a;
    })), h;
  });
  return Q;
}
function Wu(e, t) {
  for (var A = "", s = 0, r = e.length; s < r; s++)
    A += e[s], s < r - 1 && (A += t[s]);
  return A;
}
function qu(e) {
  return an(e, "raw") && an(e, "length");
}
function Pa(e) {
  var t = Ha(), A = Ha();
  function s(n) {
    for (var o = [], a = 1; a < arguments.length; a++)
      o[a - 1] = arguments[a];
    if (qu(n)) {
      var u = n, l = (o[0] === s || o[0] === wt) && Vu.test(u[0]) && xu.test(u[1]), i = l ? A : t, c = i.get(u);
      if (c || (c = Oa(u, l, e), i.set(u, c)), o.length === 0)
        return c[0];
      var Q = Wu(c, l ? o.slice(1) : o);
      return Q;
    } else
      return Pa(cn(cn({}, e), n || {}));
  }
  var r = cn(s, {
    string: function(n) {
      return Oa([n], !1, e)[0];
    }
  });
  return r;
}
var wt = Pa({
  trimLeadingNewline: !0,
  trimTrailingNewline: !0
});
if (typeof module < "u")
  try {
    module.exports = wt, Object.defineProperty(wt, "__esModule", { value: !0 }), wt.default = wt, wt.outdent = wt;
  } catch {
  }
var xa = typeof global == "object" && global && global.Object === Object && global, zu = typeof self == "object" && self && self.Object === Object && self, ht = xa || zu || Function("return this")(), bt = ht.Symbol, _a = Object.prototype, Zu = _a.hasOwnProperty, Ku = _a.toString, gA = bt ? bt.toStringTag : void 0;
function ju(e) {
  var t = Zu.call(e, gA), A = e[gA];
  try {
    e[gA] = void 0;
    var s = !0;
  } catch {
  }
  var r = Ku.call(e);
  return s && (t ? e[gA] = A : delete e[gA]), r;
}
var Xu = Object.prototype, $u = Xu.toString;
function eE(e) {
  return $u.call(e);
}
var tE = "[object Null]", AE = "[object Undefined]", Va = bt ? bt.toStringTag : void 0;
function xt(e) {
  return e == null ? e === void 0 ? AE : tE : Va && Va in Object(e) ? ju(e) : eE(e);
}
function _t(e) {
  return e != null && typeof e == "object";
}
var rE = "[object Symbol]";
function _A(e) {
  return typeof e == "symbol" || _t(e) && xt(e) == rE;
}
function sE(e, t) {
  for (var A = -1, s = e == null ? 0 : e.length, r = Array(s); ++A < s; )
    r[A] = t(e[A], A, e);
  return r;
}
var Bt = Array.isArray, Wa = bt ? bt.prototype : void 0, qa = Wa ? Wa.toString : void 0;
function za(e) {
  if (typeof e == "string")
    return e;
  if (Bt(e))
    return sE(e, za) + "";
  if (_A(e))
    return qa ? qa.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
var nE = /\s/;
function oE(e) {
  for (var t = e.length; t-- && nE.test(e.charAt(t)); )
    ;
  return t;
}
var iE = /^\s+/;
function aE(e) {
  return e && e.slice(0, oE(e) + 1).replace(iE, "");
}
function lA(e) {
  var t = typeof e;
  return e != null && (t == "object" || t == "function");
}
var Za = NaN, cE = /^[-+]0x[0-9a-f]+$/i, gE = /^0b[01]+$/i, lE = /^0o[0-7]+$/i, uE = parseInt;
function Ka(e) {
  if (typeof e == "number")
    return e;
  if (_A(e))
    return Za;
  if (lA(e)) {
    var t = typeof e.valueOf == "function" ? e.valueOf() : e;
    e = lA(t) ? t + "" : t;
  }
  if (typeof e != "string")
    return e === 0 ? e : +e;
  e = aE(e);
  var A = gE.test(e);
  return A || lE.test(e) ? uE(e.slice(2), A ? 2 : 8) : cE.test(e) ? Za : +e;
}
var ja = 1 / 0, EE = 17976931348623157e292;
function QE(e) {
  if (!e)
    return e === 0 ? e : 0;
  if (e = Ka(e), e === ja || e === -ja) {
    var t = e < 0 ? -1 : 1;
    return t * EE;
  }
  return e === e ? e : 0;
}
function hE(e) {
  var t = QE(e), A = t % 1;
  return t === t ? A ? t - A : t : 0;
}
function BE(e) {
  return e;
}
var CE = "[object AsyncFunction]", IE = "[object Function]", dE = "[object GeneratorFunction]", fE = "[object Proxy]";
function Xa(e) {
  if (!lA(e))
    return !1;
  var t = xt(e);
  return t == IE || t == dE || t == CE || t == fE;
}
var gn = ht["__core-js_shared__"], $a = (function() {
  var e = /[^.]+$/.exec(gn && gn.keys && gn.keys.IE_PROTO || "");
  return e ? "Symbol(src)_1." + e : "";
})();
function pE(e) {
  return !!$a && $a in e;
}
var wE = Function.prototype, mE = wE.toString;
function Mt(e) {
  if (e != null) {
    try {
      return mE.call(e);
    } catch {
    }
    try {
      return e + "";
    } catch {
    }
  }
  return "";
}
var yE = /[\\^$.*+?()[\]{}|]/g, DE = /^\[object .+?Constructor\]$/, bE = Function.prototype, RE = Object.prototype, kE = bE.toString, FE = RE.hasOwnProperty, TE = RegExp(
  "^" + kE.call(FE).replace(yE, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function SE(e) {
  if (!lA(e) || pE(e))
    return !1;
  var t = Xa(e) ? TE : DE;
  return t.test(Mt(e));
}
function UE(e, t) {
  return e?.[t];
}
function Vt(e, t) {
  var A = UE(e, t);
  return SE(A) ? A : void 0;
}
var ln = Vt(ht, "WeakMap"), NE = 9007199254740991, ME = /^(?:0|[1-9]\d*)$/;
function ec(e, t) {
  var A = typeof e;
  return t = t ?? NE, !!t && (A == "number" || A != "symbol" && ME.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
function tc(e, t) {
  return e === t || e !== e && t !== t;
}
var LE = 9007199254740991;
function un(e) {
  return typeof e == "number" && e > -1 && e % 1 == 0 && e <= LE;
}
function Ac(e) {
  return e != null && un(e.length) && !Xa(e);
}
var GE = Object.prototype;
function vE(e) {
  var t = e && e.constructor, A = typeof t == "function" && t.prototype || GE;
  return e === A;
}
function YE(e, t) {
  for (var A = -1, s = Array(e); ++A < e; )
    s[A] = t(A);
  return s;
}
var JE = "[object Arguments]";
function rc(e) {
  return _t(e) && xt(e) == JE;
}
var sc = Object.prototype, HE = sc.hasOwnProperty, OE = sc.propertyIsEnumerable, nc = rc(/* @__PURE__ */ (function() {
  return arguments;
})()) ? rc : function(e) {
  return _t(e) && HE.call(e, "callee") && !OE.call(e, "callee");
};
function PE() {
  return !1;
}
var oc = typeof exports == "object" && exports && !exports.nodeType && exports, ic = oc && typeof module == "object" && module && !module.nodeType && module, xE = ic && ic.exports === oc, ac = xE ? ht.Buffer : void 0, _E = ac ? ac.isBuffer : void 0, En = _E || PE, VE = "[object Arguments]", WE = "[object Array]", qE = "[object Boolean]", zE = "[object Date]", ZE = "[object Error]", KE = "[object Function]", jE = "[object Map]", XE = "[object Number]", $E = "[object Object]", eQ = "[object RegExp]", tQ = "[object Set]", AQ = "[object String]", rQ = "[object WeakMap]", sQ = "[object ArrayBuffer]", nQ = "[object DataView]", oQ = "[object Float32Array]", iQ = "[object Float64Array]", aQ = "[object Int8Array]", cQ = "[object Int16Array]", gQ = "[object Int32Array]", lQ = "[object Uint8Array]", uQ = "[object Uint8ClampedArray]", EQ = "[object Uint16Array]", QQ = "[object Uint32Array]", Pe = {};
Pe[oQ] = Pe[iQ] = Pe[aQ] = Pe[cQ] = Pe[gQ] = Pe[lQ] = Pe[uQ] = Pe[EQ] = Pe[QQ] = !0, Pe[VE] = Pe[WE] = Pe[sQ] = Pe[qE] = Pe[nQ] = Pe[zE] = Pe[ZE] = Pe[KE] = Pe[jE] = Pe[XE] = Pe[$E] = Pe[eQ] = Pe[tQ] = Pe[AQ] = Pe[rQ] = !1;
function hQ(e) {
  return _t(e) && un(e.length) && !!Pe[xt(e)];
}
function BQ(e) {
  return function(t) {
    return e(t);
  };
}
var cc = typeof exports == "object" && exports && !exports.nodeType && exports, uA = cc && typeof module == "object" && module && !module.nodeType && module, CQ = uA && uA.exports === cc, Qn = CQ && xa.process, gc = (function() {
  try {
    var e = uA && uA.require && uA.require("util").types;
    return e || Qn && Qn.binding && Qn.binding("util");
  } catch {
  }
})(), lc = gc && gc.isTypedArray, uc = lc ? BQ(lc) : hQ, IQ = Object.prototype, dQ = IQ.hasOwnProperty;
function fQ(e, t) {
  var A = Bt(e), s = !A && nc(e), r = !A && !s && En(e), n = !A && !s && !r && uc(e), o = A || s || r || n, a = o ? YE(e.length, String) : [], u = a.length;
  for (var l in e)
    dQ.call(e, l) && !(o && // Safari 9 has enumerable `arguments.length` in strict mode.
    (l == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    r && (l == "offset" || l == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    n && (l == "buffer" || l == "byteLength" || l == "byteOffset") || // Skip index properties.
    ec(l, u))) && a.push(l);
  return a;
}
function pQ(e, t) {
  return function(A) {
    return e(t(A));
  };
}
var wQ = pQ(Object.keys, Object), mQ = Object.prototype, yQ = mQ.hasOwnProperty;
function DQ(e) {
  if (!vE(e))
    return wQ(e);
  var t = [];
  for (var A in Object(e))
    yQ.call(e, A) && A != "constructor" && t.push(A);
  return t;
}
function hn(e) {
  return Ac(e) ? fQ(e) : DQ(e);
}
var bQ = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, RQ = /^\w*$/;
function Bn(e, t) {
  if (Bt(e))
    return !1;
  var A = typeof e;
  return A == "number" || A == "symbol" || A == "boolean" || e == null || _A(e) ? !0 : RQ.test(e) || !bQ.test(e) || t != null && e in Object(t);
}
var EA = Vt(Object, "create");
function kQ() {
  this.__data__ = EA ? EA(null) : {}, this.size = 0;
}
function FQ(e) {
  var t = this.has(e) && delete this.__data__[e];
  return this.size -= t ? 1 : 0, t;
}
var TQ = "__lodash_hash_undefined__", SQ = Object.prototype, UQ = SQ.hasOwnProperty;
function NQ(e) {
  var t = this.__data__;
  if (EA) {
    var A = t[e];
    return A === TQ ? void 0 : A;
  }
  return UQ.call(t, e) ? t[e] : void 0;
}
var MQ = Object.prototype, LQ = MQ.hasOwnProperty;
function GQ(e) {
  var t = this.__data__;
  return EA ? t[e] !== void 0 : LQ.call(t, e);
}
var vQ = "__lodash_hash_undefined__";
function YQ(e, t) {
  var A = this.__data__;
  return this.size += this.has(e) ? 0 : 1, A[e] = EA && t === void 0 ? vQ : t, this;
}
function Lt(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.clear(); ++t < A; ) {
    var s = e[t];
    this.set(s[0], s[1]);
  }
}
Lt.prototype.clear = kQ, Lt.prototype.delete = FQ, Lt.prototype.get = NQ, Lt.prototype.has = GQ, Lt.prototype.set = YQ;
function JQ() {
  this.__data__ = [], this.size = 0;
}
function VA(e, t) {
  for (var A = e.length; A--; )
    if (tc(e[A][0], t))
      return A;
  return -1;
}
var HQ = Array.prototype, OQ = HQ.splice;
function PQ(e) {
  var t = this.__data__, A = VA(t, e);
  if (A < 0)
    return !1;
  var s = t.length - 1;
  return A == s ? t.pop() : OQ.call(t, A, 1), --this.size, !0;
}
function xQ(e) {
  var t = this.__data__, A = VA(t, e);
  return A < 0 ? void 0 : t[A][1];
}
function _Q(e) {
  return VA(this.__data__, e) > -1;
}
function VQ(e, t) {
  var A = this.__data__, s = VA(A, e);
  return s < 0 ? (++this.size, A.push([e, t])) : A[s][1] = t, this;
}
function mt(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.clear(); ++t < A; ) {
    var s = e[t];
    this.set(s[0], s[1]);
  }
}
mt.prototype.clear = JQ, mt.prototype.delete = PQ, mt.prototype.get = xQ, mt.prototype.has = _Q, mt.prototype.set = VQ;
var QA = Vt(ht, "Map");
function WQ() {
  this.size = 0, this.__data__ = {
    hash: new Lt(),
    map: new (QA || mt)(),
    string: new Lt()
  };
}
function qQ(e) {
  var t = typeof e;
  return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
function WA(e, t) {
  var A = e.__data__;
  return qQ(t) ? A[typeof t == "string" ? "string" : "hash"] : A.map;
}
function zQ(e) {
  var t = WA(this, e).delete(e);
  return this.size -= t ? 1 : 0, t;
}
function ZQ(e) {
  return WA(this, e).get(e);
}
function KQ(e) {
  return WA(this, e).has(e);
}
function jQ(e, t) {
  var A = WA(this, e), s = A.size;
  return A.set(e, t), this.size += A.size == s ? 0 : 1, this;
}
function yt(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.clear(); ++t < A; ) {
    var s = e[t];
    this.set(s[0], s[1]);
  }
}
yt.prototype.clear = WQ, yt.prototype.delete = zQ, yt.prototype.get = ZQ, yt.prototype.has = KQ, yt.prototype.set = jQ;
var XQ = "Expected a function";
function Cn(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function")
    throw new TypeError(XQ);
  var A = function() {
    var s = arguments, r = t ? t.apply(this, s) : s[0], n = A.cache;
    if (n.has(r))
      return n.get(r);
    var o = e.apply(this, s);
    return A.cache = n.set(r, o) || n, o;
  };
  return A.cache = new (Cn.Cache || yt)(), A;
}
Cn.Cache = yt;
var $Q = 500;
function eh(e) {
  var t = Cn(e, function(s) {
    return A.size === $Q && A.clear(), s;
  }), A = t.cache;
  return t;
}
var th = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Ah = /\\(\\)?/g, rh = eh(function(e) {
  var t = [];
  return e.charCodeAt(0) === 46 && t.push(""), e.replace(th, function(A, s, r, n) {
    t.push(r ? n.replace(Ah, "$1") : s || A);
  }), t;
});
function In(e) {
  return e == null ? "" : za(e);
}
function Ec(e, t) {
  return Bt(e) ? e : Bn(e, t) ? [e] : rh(In(e));
}
function qA(e) {
  if (typeof e == "string" || _A(e))
    return e;
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Qc(e, t) {
  t = Ec(t, e);
  for (var A = 0, s = t.length; e != null && A < s; )
    e = e[qA(t[A++])];
  return A && A == s ? e : void 0;
}
function sh(e, t, A) {
  var s = e == null ? void 0 : Qc(e, t);
  return s === void 0 ? A : s;
}
function nh(e, t) {
  for (var A = -1, s = t.length, r = e.length; ++A < s; )
    e[r + A] = t[A];
  return e;
}
var oh = ht.isFinite, ih = Math.min;
function ah(e) {
  var t = Math[e];
  return function(A, s) {
    if (A = Ka(A), s = s == null ? 0 : ih(hE(s), 292), s && oh(A)) {
      var r = (In(A) + "e").split("e"), n = t(r[0] + "e" + (+r[1] + s));
      return r = (In(n) + "e").split("e"), +(r[0] + "e" + (+r[1] - s));
    }
    return t(A);
  };
}
function ch() {
  this.__data__ = new mt(), this.size = 0;
}
function gh(e) {
  var t = this.__data__, A = t.delete(e);
  return this.size = t.size, A;
}
function lh(e) {
  return this.__data__.get(e);
}
function uh(e) {
  return this.__data__.has(e);
}
var Eh = 200;
function Qh(e, t) {
  var A = this.__data__;
  if (A instanceof mt) {
    var s = A.__data__;
    if (!QA || s.length < Eh - 1)
      return s.push([e, t]), this.size = ++A.size, this;
    A = this.__data__ = new yt(s);
  }
  return A.set(e, t), this.size = A.size, this;
}
function Dt(e) {
  var t = this.__data__ = new mt(e);
  this.size = t.size;
}
Dt.prototype.clear = ch, Dt.prototype.delete = gh, Dt.prototype.get = lh, Dt.prototype.has = uh, Dt.prototype.set = Qh;
function hh(e, t) {
  for (var A = -1, s = e == null ? 0 : e.length, r = 0, n = []; ++A < s; ) {
    var o = e[A];
    t(o, A, e) && (n[r++] = o);
  }
  return n;
}
function Bh() {
  return [];
}
var Ch = Object.prototype, Ih = Ch.propertyIsEnumerable, hc = Object.getOwnPropertySymbols, dh = hc ? function(e) {
  return e == null ? [] : (e = Object(e), hh(hc(e), function(t) {
    return Ih.call(e, t);
  }));
} : Bh;
function fh(e, t, A) {
  var s = t(e);
  return Bt(e) ? s : nh(s, A(e));
}
function Bc(e) {
  return fh(e, hn, dh);
}
var dn = Vt(ht, "DataView"), fn = Vt(ht, "Promise"), pn = Vt(ht, "Set"), Cc = "[object Map]", ph = "[object Object]", Ic = "[object Promise]", dc = "[object Set]", fc = "[object WeakMap]", pc = "[object DataView]", wh = Mt(dn), mh = Mt(QA), yh = Mt(fn), Dh = Mt(pn), bh = Mt(ln), Rt = xt;
(dn && Rt(new dn(new ArrayBuffer(1))) != pc || QA && Rt(new QA()) != Cc || fn && Rt(fn.resolve()) != Ic || pn && Rt(new pn()) != dc || ln && Rt(new ln()) != fc) && (Rt = function(e) {
  var t = xt(e), A = t == ph ? e.constructor : void 0, s = A ? Mt(A) : "";
  if (s)
    switch (s) {
      case wh:
        return pc;
      case mh:
        return Cc;
      case yh:
        return Ic;
      case Dh:
        return dc;
      case bh:
        return fc;
    }
  return t;
});
var wc = ht.Uint8Array, Rh = "__lodash_hash_undefined__";
function kh(e) {
  return this.__data__.set(e, Rh), this;
}
function Fh(e) {
  return this.__data__.has(e);
}
function zA(e) {
  var t = -1, A = e == null ? 0 : e.length;
  for (this.__data__ = new yt(); ++t < A; )
    this.add(e[t]);
}
zA.prototype.add = zA.prototype.push = kh, zA.prototype.has = Fh;
function Th(e, t) {
  for (var A = -1, s = e == null ? 0 : e.length; ++A < s; )
    if (t(e[A], A, e))
      return !0;
  return !1;
}
function Sh(e, t) {
  return e.has(t);
}
var Uh = 1, Nh = 2;
function mc(e, t, A, s, r, n) {
  var o = A & Uh, a = e.length, u = t.length;
  if (a != u && !(o && u > a))
    return !1;
  var l = n.get(e), i = n.get(t);
  if (l && i)
    return l == t && i == e;
  var c = -1, Q = !0, h = A & Nh ? new zA() : void 0;
  for (n.set(e, t), n.set(t, e); ++c < a; ) {
    var C = e[c], d = t[c];
    if (s)
      var y = o ? s(d, C, c, t, e, n) : s(C, d, c, e, t, n);
    if (y !== void 0) {
      if (y)
        continue;
      Q = !1;
      break;
    }
    if (h) {
      if (!Th(t, function(D, k) {
        if (!Sh(h, k) && (C === D || r(C, D, A, s, n)))
          return h.push(k);
      })) {
        Q = !1;
        break;
      }
    } else if (!(C === d || r(C, d, A, s, n))) {
      Q = !1;
      break;
    }
  }
  return n.delete(e), n.delete(t), Q;
}
function Mh(e) {
  var t = -1, A = Array(e.size);
  return e.forEach(function(s, r) {
    A[++t] = [r, s];
  }), A;
}
function Lh(e) {
  var t = -1, A = Array(e.size);
  return e.forEach(function(s) {
    A[++t] = s;
  }), A;
}
var Gh = 1, vh = 2, Yh = "[object Boolean]", Jh = "[object Date]", Hh = "[object Error]", Oh = "[object Map]", Ph = "[object Number]", xh = "[object RegExp]", _h = "[object Set]", Vh = "[object String]", Wh = "[object Symbol]", qh = "[object ArrayBuffer]", zh = "[object DataView]", yc = bt ? bt.prototype : void 0, wn = yc ? yc.valueOf : void 0;
function Zh(e, t, A, s, r, n, o) {
  switch (A) {
    case zh:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      e = e.buffer, t = t.buffer;
    case qh:
      return !(e.byteLength != t.byteLength || !n(new wc(e), new wc(t)));
    case Yh:
    case Jh:
    case Ph:
      return tc(+e, +t);
    case Hh:
      return e.name == t.name && e.message == t.message;
    case xh:
    case Vh:
      return e == t + "";
    case Oh:
      var a = Mh;
    case _h:
      var u = s & Gh;
      if (a || (a = Lh), e.size != t.size && !u)
        return !1;
      var l = o.get(e);
      if (l)
        return l == t;
      s |= vh, o.set(e, t);
      var i = mc(a(e), a(t), s, r, n, o);
      return o.delete(e), i;
    case Wh:
      if (wn)
        return wn.call(e) == wn.call(t);
  }
  return !1;
}
var Kh = 1, jh = Object.prototype, Xh = jh.hasOwnProperty;
function $h(e, t, A, s, r, n) {
  var o = A & Kh, a = Bc(e), u = a.length, l = Bc(t), i = l.length;
  if (u != i && !o)
    return !1;
  for (var c = u; c--; ) {
    var Q = a[c];
    if (!(o ? Q in t : Xh.call(t, Q)))
      return !1;
  }
  var h = n.get(e), C = n.get(t);
  if (h && C)
    return h == t && C == e;
  var d = !0;
  n.set(e, t), n.set(t, e);
  for (var y = o; ++c < u; ) {
    Q = a[c];
    var D = e[Q], k = t[Q];
    if (s)
      var N = o ? s(k, D, Q, t, e, n) : s(D, k, Q, e, t, n);
    if (!(N === void 0 ? D === k || r(D, k, A, s, n) : N)) {
      d = !1;
      break;
    }
    y || (y = Q == "constructor");
  }
  if (d && !y) {
    var L = e.constructor, M = t.constructor;
    L != M && "constructor" in e && "constructor" in t && !(typeof L == "function" && L instanceof L && typeof M == "function" && M instanceof M) && (d = !1);
  }
  return n.delete(e), n.delete(t), d;
}
var eB = 1, Dc = "[object Arguments]", bc = "[object Array]", ZA = "[object Object]", tB = Object.prototype, Rc = tB.hasOwnProperty;
function AB(e, t, A, s, r, n) {
  var o = Bt(e), a = Bt(t), u = o ? bc : Rt(e), l = a ? bc : Rt(t);
  u = u == Dc ? ZA : u, l = l == Dc ? ZA : l;
  var i = u == ZA, c = l == ZA, Q = u == l;
  if (Q && En(e)) {
    if (!En(t))
      return !1;
    o = !0, i = !1;
  }
  if (Q && !i)
    return n || (n = new Dt()), o || uc(e) ? mc(e, t, A, s, r, n) : Zh(e, t, u, A, s, r, n);
  if (!(A & eB)) {
    var h = i && Rc.call(e, "__wrapped__"), C = c && Rc.call(t, "__wrapped__");
    if (h || C) {
      var d = h ? e.value() : e, y = C ? t.value() : t;
      return n || (n = new Dt()), r(d, y, A, s, n);
    }
  }
  return Q ? (n || (n = new Dt()), $h(e, t, A, s, r, n)) : !1;
}
function mn(e, t, A, s, r) {
  return e === t ? !0 : e == null || t == null || !_t(e) && !_t(t) ? e !== e && t !== t : AB(e, t, A, s, mn, r);
}
var rB = 1, sB = 2;
function nB(e, t, A, s) {
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
      if (!(c === void 0 ? mn(l, u, rB | sB, s, i) : c))
        return !1;
    }
  }
  return !0;
}
function kc(e) {
  return e === e && !lA(e);
}
function oB(e) {
  for (var t = hn(e), A = t.length; A--; ) {
    var s = t[A], r = e[s];
    t[A] = [s, r, kc(r)];
  }
  return t;
}
function Fc(e, t) {
  return function(A) {
    return A == null ? !1 : A[e] === t && (t !== void 0 || e in Object(A));
  };
}
function iB(e) {
  var t = oB(e);
  return t.length == 1 && t[0][2] ? Fc(t[0][0], t[0][1]) : function(A) {
    return A === e || nB(A, e, t);
  };
}
function aB(e, t) {
  return e != null && t in Object(e);
}
function cB(e, t, A) {
  t = Ec(t, e);
  for (var s = -1, r = t.length, n = !1; ++s < r; ) {
    var o = qA(t[s]);
    if (!(n = e != null && A(e, o)))
      break;
    e = e[o];
  }
  return n || ++s != r ? n : (r = e == null ? 0 : e.length, !!r && un(r) && ec(o, r) && (Bt(e) || nc(e)));
}
function gB(e, t) {
  return e != null && cB(e, t, aB);
}
var lB = 1, uB = 2;
function EB(e, t) {
  return Bn(e) && kc(t) ? Fc(qA(e), t) : function(A) {
    var s = sh(A, e);
    return s === void 0 && s === t ? gB(A, e) : mn(t, s, lB | uB);
  };
}
function QB(e) {
  return function(t) {
    return t?.[e];
  };
}
function hB(e) {
  return function(t) {
    return Qc(t, e);
  };
}
function BB(e) {
  return Bn(e) ? QB(qA(e)) : hB(e);
}
function CB(e) {
  return typeof e == "function" ? e : e == null ? BE : typeof e == "object" ? Bt(e) ? EB(e[0], e[1]) : iB(e) : BB(e);
}
function IB(e, t, A, s) {
  for (var r = -1, n = e == null ? 0 : e.length; ++r < n; ) {
    var o = e[r];
    t(s, o, A(o), e);
  }
  return s;
}
function dB(e) {
  return function(t, A, s) {
    for (var r = -1, n = Object(t), o = s(t), a = o.length; a--; ) {
      var u = o[++r];
      if (A(n[u], u, n) === !1)
        break;
    }
    return t;
  };
}
var fB = dB();
function pB(e, t) {
  return e && fB(e, t, hn);
}
function wB(e, t) {
  return function(A, s) {
    if (A == null)
      return A;
    if (!Ac(A))
      return e(A, s);
    for (var r = A.length, n = -1, o = Object(A); ++n < r && s(o[n], n, o) !== !1; )
      ;
    return A;
  };
}
var mB = wB(pB);
function yB(e, t, A, s) {
  return mB(e, function(r, n, o) {
    t(s, r, A(r), o);
  }), s;
}
function DB(e, t) {
  return function(A, s) {
    var r = Bt(A) ? IB : yB, n = t ? t() : {};
    return r(A, e, CB(s), n);
  };
}
var Tc = DB(function(e, t, A) {
  e[A ? 0 : 1].push(t);
}, function() {
  return [[], []];
}), yn = ah("round"), Dn, Sc;
function bB() {
  return Sc || (Sc = 1, Dn = function(e, t) {
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
            var C = Q > 1 && (c === "/" || c === void 0) && (h === "/" || h === void 0);
            C ? (s += "((?:[^/]*(?:/|$))*)", l++) : s += "([^/]*)";
          }
          break;
        default:
          s += u;
      }
    return (!a || !~a.indexOf("g")) && (s = "^" + s + "$"), new RegExp(s, a);
  }), Dn;
}
var RB = bB(), kB = /* @__PURE__ */ ug(RB);
function Uc(e, t) {
  if (!e)
    return [[], t];
  const A = kB(e, { extended: !0 });
  return Tc(t, (s) => A.test(s.path));
}
function FB(e) {
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
function Nc(e) {
  return e.length === 1 && e[0].property === "size" ? "" : ` (${e.map((t) => t.label).join(" / ")})`;
}
const Mc = {
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
function Lc(e) {
  return e.split(",").map((t) => t.trim()).filter((t) => Mc.hasOwnProperty(t)).map((t) => Mc[t]);
}
const Ct = (e, t) => e.map(({ property: A }) => t(A)).join(" / ");
function Gc(e, t, A) {
  e.sort((s, r) => r[t] - s[t] || s.path.localeCompare(r.path)), A === "asc" && e.reverse();
}
const TB = (e) => (e < 1e-3 ? e = yn(e, 4) : e < 0.01 ? e = yn(e, 3) : e = yn(e, 2), e.toLocaleString(void 0, {
  style: "percent",
  maximumSignificantDigits: 3
}));
function KA(e, t, A) {
  const s = e[A] - t[A];
  return {
    delta: s,
    percent: TB(s / t[A])
  };
}
function vc(e, t) {
  return {
    size: KA(e, t, "size"),
    sizeGzip: KA(e, t, "sizeGzip"),
    sizeBrotli: KA(e, t, "sizeBrotli")
  };
}
function Yc(e, t, A, s) {
  for (const r of A.files) {
    const n = s ? s(r.path) : r.path;
    e[n] || (e[n] = {
      path: r.path,
      label: r.label
    });
    const o = e[n];
    o[t] = r, o.head && o.base && (o.diff = vc(o.head, o.base));
  }
}
function SB(e, t, {
  sortBy: A,
  sortOrder: s,
  hideFiles: r,
  ignoreThreshold: n = 100,
  stripHash: o
} = {}) {
  const a = {}, u = FB(o);
  Yc(a, "head", e, u), Yc(a, "base", t, u);
  const l = Object.values(a);
  Gc(l, A, s);
  const [i, c] = Uc(r, l), [Q, h] = Tc(
    c,
    (C) => C.diff && C.diff.size && Math.abs(C.diff.size.delta) < n
  );
  return {
    head: e,
    base: t,
    diff: {
      ...vc(e, t),
      tarballSize: KA(e, t, "tarballSize")
    },
    files: {
      changed: h,
      unchanged: Q,
      hidden: i
    }
  };
}
const UB = (e) => e < 0 ? "\u2193" : e > 0 ? "\u2191" : "", hA = ({ delta: e, percent: t }) => e ? t + UB(e) : "", NB = 20;
function Jc({
  headPkgData: e,
  basePkgData: t,
  sortBy: A,
  sortOrder: s,
  hideFiles: r,
  unchangedFiles: n,
  displaySize: o,
  ignoreThreshold: a,
  autoCollapse: u,
  stripHash: l,
  title: i,
  includeTarball: c = !0
}) {
  const Q = SB(e, t, {
    sortBy: A,
    sortOrder: s,
    hideFiles: r,
    ignoreThreshold: a,
    stripHash: l
  });
  iA("regressionData", Q);
  const { changed: h, unchanged: C, hidden: d } = Q.files, y = Lc(o), D = Nc(y), k = [
    ...h,
    ...n === "show" ? C : []
  ], N = (E) => [
    E.label,
    E.base && E.base.size ? Ct(y, (p) => et(tt(E.base[p]))) : "\u2014",
    E.head && E.head.size ? Ct(
      y,
      (p) => (E.base && E.base[p] ? OA(hA(E.diff[p])) : "") + et(tt(E.head[p]))
    ) : "\u2014"
  ], L = [
    [
      `${PA("Total")} ${n === "show" ? "" : La("_(Includes all files)_")}`,
      Ct(y, (E) => et(tt(Q.base[E]))),
      Ct(y, (E) => OA(hA(Q.diff[E])) + et(tt(Q.head[E])))
    ],
    ...c ? [[
      PA("Tarball size"),
      et(tt(Q.base.tarballSize)),
      OA(hA(Q.diff.tarballSize)) + et(tt(Q.head.tarballSize))
    ]] : []
  ], M = u && k.length > NB;
  let f, B = "";
  if (M) {
    f = pt([
      ["File", `Before${D}`, `After${D}`],
      ...L
    ], {
      align: ["", "r", "r"]
    });
    const E = pt([
      ["File", `Before${D}`, `After${D}`],
      ...k.map(N)
    ], {
      align: ["", "r", "r"]
    });
    B = `<details><summary>Show files (${k.length} files)</summary>

${E}
</details>`;
  } else
    f = pt([
      ["File", `Before${D}`, `After${D}`],
      ...k.map(N),
      ...L
    ], {
      align: ["", "r", "r"]
    });
  let w = "";
  n === "collapse" && C.length > 0 && (w = pt([
    ["File", `Size${D}`],
    ...C.map((E) => [
      E.label,
      Ct(y, (p) => et(tt(E.base[p])))
    ])
  ], {
    align: ["", "r"]
  }), w = `<details><summary>Unchanged files</summary>

${w}
</details>`);
  let g = "";
  return d.length > 0 && (g = pt([
    ["File", `Before${D}`, `After${D}`],
    ...d.map((E) => [
      E.label,
      E.base && E.base.size ? Ct(y, (p) => et(tt(E.base[p]))) : "\u2014",
      E.head && E.head.size ? Ct(
        y,
        (p) => (E.base && E.base[p] ? OA(hA(E.diff[p])) : "") + et(tt(E.head[p]))
      ) : "\u2014"
    ])
  ], {
    align: ["", "r", "r"]
  }), g = `<details><summary>Hidden files</summary>

${g}
</details>`), wt`
	### ${i || "\u{1F4CA} Package size report"}&nbsp;&nbsp;&nbsp;<kbd>${hA(Q.diff.size) || "No changes"}</kbd>

	${f}

	${B}

	${w}

	${g}
	`;
}
const MB = 20;
function Hc({
  headPkgData: e,
  hideFiles: t,
  displaySize: A,
  sortBy: s,
  sortOrder: r,
  autoCollapse: n,
  title: o,
  includeTarball: a = !0
}) {
  const u = Lc(A), l = Nc(u);
  Gc(e.files, s, r);
  const [i, c] = Uc(t, e.files), Q = (k) => [
    k.label,
    Ct(u, (N) => et(tt(k[N])))
  ], h = [
    [
      PA("Total"),
      Ct(u, (k) => et(tt(e[k])))
    ],
    ...a ? [[
      PA("Tarball size"),
      et(tt(e.tarballSize))
    ]] : []
  ], C = n && c.length > MB;
  let d, y = "";
  if (C) {
    d = pt([
      ["File", `Size${l}`],
      ...h
    ], {
      align: ["", "r"]
    });
    const k = pt([
      ["File", `Size${l}`],
      ...c.map(Q)
    ], {
      align: ["", "r"]
    });
    y = `<details><summary>Show files (${c.length} files)</summary>

${k}
</details>`;
  } else
    d = pt([
      ["File", `Size${l}`],
      ...c.map(Q),
      ...h
    ], {
      align: ["", "r"]
    });
  let D = "";
  return i.length > 0 && (D = pt([
    ["File", `Size${l}`],
    ...i.map((k) => [
      k.label,
      Ct(u, (N) => et(tt(k[N])))
    ])
  ], {
    align: ["", "r"]
  }), D = `<details><summary>Hidden files</summary>

${D}
</details>`), wt`
	### ${o || "\u{1F4CA} Package size report"}

	${d}

	${y}

	${D}
	`;
}
async function gt(e, t) {
  let A = "", s = "";
  const r = Date.now(), n = await ul(e, null, {
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
async function LB(e) {
  try {
    await gt(`git fetch origin ${e} --depth=1`);
  } catch (A) {
    throw new Error(`Failed to git fetch ${e} ${A.message}`);
  }
  const { exitCode: t } = await gt(`git diff --quiet origin/${e}`, { ignoreReturnCode: !0 });
  return t !== 0;
}
async function GB({ cwd: e } = {}) {
  dt.existsSync("node_modules") && (Xe("Cleaning node_modules"), await il(Fn.join(e, "node_modules")));
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
async function vB(e) {
  const { exitCode: t } = await gt(`git ls-files --error-unmatch ${e}`, { ignoreReturnCode: !0 });
  return t === 0;
}
let Oc = !1;
async function Pc({
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
        Zs("Error reading package.json", u);
      }
      a && a.scripts && a.scripts.build && (Xe("Build script found in package.json"), A = "npm run build");
    }
    if (A) {
      await GB({ cwd: s }).catch((u) => {
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
  Oc || (Xe("Installing pkg-size globally"), await gt("npm i -g pkg-size"), Oc = !0), Xe("Getting package size");
  const r = await gt("pkg-size --json", { cwd: s }).catch((a) => {
    throw new Error(`Failed to determine package size: ${a.message}`);
  });
  sa(JSON.stringify(r, null, 4));
  const n = {
    ...JSON.parse(r.stdout),
    ref: t,
    size: 0,
    sizeGzip: 0,
    sizeBrotli: 0
  };
  await Promise.all(n.files.map(async (a) => {
    n.size += a.size, n.sizeGzip += a.sizeGzip, n.sizeBrotli += a.sizeBrotli;
    const u = await vB(a.path);
    a.isTracked = u, a.label = u ? Mu(et(a.path), `${t.repo.html_url}/blob/${t.ref}/${a.path}`) : et(a.path);
  })), Xe("Cleaning up"), await gt("git reset --hard");
  const { stdout: o } = await gt("git clean -dfx");
  return sa(o), n;
}
function YB(e) {
  if (!e)
    return [];
  const t = [];
  for (const A of String(e).split(/\r?\n/)) {
    const s = A.trim();
    if (!s || s.startsWith("#"))
      continue;
    const r = s.indexOf(":");
    let n, o;
    r > -1 ? (n = s.slice(0, r).trim(), o = s.slice(r + 1).trim()) : (o = s, n = s), o = o.replace(/\/+$/, ""), o && (n || (n = o), t.push({ label: n, prefix: o }));
  }
  return t;
}
function JB(e, t) {
  return t ? e === t ? !0 : e.startsWith(`${t}/`) : !1;
}
function Wt(e, t) {
  const A = e.files.filter((o) => JB(o.path, t));
  let s = 0, r = 0, n = 0;
  for (const o of A)
    s += o.size || 0, r += o.sizeGzip || 0, n += o.sizeBrotli || 0;
  return {
    ...e,
    files: A,
    size: s,
    sizeGzip: r,
    sizeBrotli: n
  };
}
function HB(e, t, A) {
  const {
    displaySize: s,
    sortBy: r,
    sortOrder: n,
    hideFiles: o,
    autoCollapse: a
  } = t;
  if (!A || A.length === 0)
    return Hc({
      headPkgData: e,
      displaySize: s,
      sortBy: r,
      sortOrder: n,
      hideFiles: o,
      autoCollapse: a
    });
  const u = A.map(({ label: l, prefix: i }) => Hc({
    headPkgData: Wt(e, i),
    displaySize: s,
    sortBy: r,
    sortOrder: n,
    hideFiles: o,
    autoCollapse: a,
    title: `\u{1F4CA} Package size report \u2014 ${l}`,
    includeTarball: !1
  }));
  return u.push(`**Tarball size:** ${e.tarballSize} bytes`), u.join(`

---

`);
}
function OB(e, t, A, s) {
  const {
    displaySize: r,
    sortBy: n,
    sortOrder: o,
    hideFiles: a,
    unchangedFiles: u,
    ignoreThreshold: l,
    autoCollapse: i,
    stripHash: c
  } = A;
  if (!s || s.length === 0)
    return Jc({
      headPkgData: e,
      basePkgData: t,
      displaySize: r,
      sortBy: n,
      sortOrder: o,
      hideFiles: a,
      unchangedFiles: u,
      ignoreThreshold: l,
      autoCollapse: i,
      stripHash: c
    });
  const Q = s.map(({ label: D, prefix: k }) => Jc({
    headPkgData: Wt(e, k),
    basePkgData: Wt(t, k),
    displaySize: r,
    sortBy: n,
    sortOrder: o,
    hideFiles: a,
    unchangedFiles: u,
    ignoreThreshold: l,
    autoCollapse: i,
    stripHash: c,
    title: `\u{1F4CA} Package size report \u2014 ${D}`,
    includeTarball: !1
  })), h = e.tarballSize, C = t.tarballSize, d = h - C, y = d === 0 ? `**Tarball size:** ${h} bytes (no change)` : `**Tarball size:** ${h} bytes (was ${C} bytes, ${d > 0 ? "+" : ""}${d})`;
  return Q.push(y), Q.join(`

---

`);
}
async function PB({
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
  stripHash: c,
  paths: Q
}) {
  vA("Build HEAD");
  const h = await Pc({
    refData: e.head,
    buildCommand: t
  });
  iA("headPkgData", h), YA();
  const C = {
    unchangedFiles: r,
    hideFiles: n,
    sortBy: o,
    sortOrder: a,
    displaySize: u,
    ignoreThreshold: l,
    autoCollapse: i,
    stripHash: c
  };
  if (s === "head-only")
    return Q && Q.length > 0 && iA("pathsReports", Q.map(({ label: D, prefix: k }) => ({
      label: D,
      prefix: k,
      head: Wt(h, k)
    }))), A !== "false" ? HB(h, C, Q) : !1;
  const { ref: d } = e.base;
  let y;
  return await LB(d) ? (Xe("HEAD is different from BASE. Triggering build."), vA("Build BASE"), y = await Pc({
    checkoutRef: d,
    refData: e.base,
    buildCommand: t
  }), YA()) : (Xe("HEAD is identical to BASE. Skipping base build."), y = {
    ...h,
    ref: e.base
  }), iA("basePkgData", y), Q && Q.length > 0 && iA("pathsReports", Q.map(({ label: D, prefix: k }) => ({
    label: D,
    prefix: k,
    head: Wt(h, k),
    base: Wt(y, k)
  }))), A !== "false" ? OB(h, y, C, Q) : !1;
}
const xc = La("\u{1F916} This report was automatically generated by [pkg-size-action](https://github.com/pkg-size/action/)");
(async () => {
  const { GITHUB_TOKEN: e } = process.env;
  Vc(e, 'Environment variable "GITHUB_TOKEN" not set. Required for accessing and reporting on the PR.');
  const { pull_request: t } = on.payload, A = await PB({
    pr: t,
    buildCommand: at("build-command"),
    commentReport: at("comment-report"),
    mode: at("mode") || "regression",
    unchangedFiles: at("unchanged-files") || "collapse",
    hideFiles: at("hide-files"),
    sortBy: at("sort-by") || "delta",
    sortOrder: at("sort-order") || "desc",
    displaySize: at("display-size") || "uncompressed",
    ignoreThreshold: Number(at("ignore-threshold") || 100),
    autoCollapse: at("auto-collapse") !== "false",
    stripHash: (() => {
      const s = at("strip-hash");
      return s === "false" ? "" : s || "[.-]([0-9a-zA-Z_-]{8,})[.-]";
    })(),
    paths: YB(at("paths"))
  });
  await gt(`git checkout -f ${on.sha}`), A && (t.head.repo && t.head.repo.full_name !== t.base.repo.full_name ? (vA("\u{1F4CB} Size Report (fork PR \u2014 copy to post as a comment)"), Xe(`${A}

${xc}`), YA(), Zs(
    `This PR is from a fork. GitHub Actions restricts write access for fork PRs, so the size report could not be posted as a comment automatically.
To share the report, copy the content from the "Size Report" group above and post it as a comment on the PR.`
  )) : await Lu({
    token: e,
    commentSignature: xc,
    repo: on.repo,
    prNumber: t.number,
    body: A
  }));
})().catch((e) => {
  El(e.message), Zs(e.stack);
});
