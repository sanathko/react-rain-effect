"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chance = chance;
exports.random = random;
function random() {
  let from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let interpolation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (from == null) {
    from = 0;
    to = 1;
  } else if (from != null && to == null) {
    to = from;
    from = 0;
  }
  const delta = to - from;
  if (interpolation == null) {
    interpolation = n => {
      return n;
    };
  }
  return from + interpolation(Math.random()) * delta;
}
function chance(c) {
  return random() <= c;
}