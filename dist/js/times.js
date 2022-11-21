"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = times;
function times(n, f) {
  for (let i = 0; i < n; i++) {
    f.call(this, i);
  }
}