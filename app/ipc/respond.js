"use strict";

function reply(data) {
  return { ok: true, data };
}

function replyError(error) {
  console.error(error);
  return { ok: false, error: error.message || String(error) };
}

module.exports = { reply, replyError };
