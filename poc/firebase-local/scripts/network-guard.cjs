// Runtime egress firewall. CLI MOTD/telemetry, metadata and all remote APIs are
// refused BEFORE creating a socket. Package/binary installation is separate.
const http = require('node:http');
const https = require('node:https');
const net = require('node:net');
const tls = require('node:tls');
const allowed = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);
function check(host) {
  if (!allowed.has(String(host))) throw new Error('POC_EGRESS_BLOCKED: non-loopback network refused');
}
function checkRequest(args) {
  const first = args[0];
  if (typeof first === 'string' || first instanceof URL) check(new URL(first).hostname);
  else {
    const value = first || {};
    check(value.hostname || value.host || 'localhost');
    if (/^https?:\/\//.test(value.path || '')) check(new URL(value.path).hostname);
  }
  if (args[1] && typeof args[1] === 'object') {
    const value = args[1];
    if (value.hostname || value.host) check(value.hostname || value.host);
  }
}
for (const module of [http, https]) for (const key of ['request', 'get']) {
  const original = module[key];
  module[key] = function (...args) { checkRequest(args); return original.apply(this, args); };
}
const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const value = args[0];
  if (Array.isArray(value)) {
    const options = value[0];
    if (typeof options === 'object') { if (!options.path) check(options.host || 'localhost'); }
    else if (typeof value[1] === 'string') check(value[1]);
  } else if (typeof value === 'object') { if (!value.path) check(value.host || 'localhost'); }
  else if (typeof args[1] === 'string') check(args[1]);
  return connect.apply(this, args);
};
const secureConnect = tls.connect;
tls.connect = function (...args) {
  if (typeof args[0] === 'object') check(args[0].servername || args[0].host || 'localhost');
  else if (typeof args[1] === 'string') check(args[1]);
  return secureConnect.apply(this, args);
};
const originalFetch = globalThis.fetch;
globalThis.fetch = async function (input, ...args) {
  check(new URL(typeof input === 'string' || input instanceof URL ? input : input.url).hostname);
  return originalFetch(input, ...args);
};
