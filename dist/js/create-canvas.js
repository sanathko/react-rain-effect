"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCanvas;
function createCanvas(width, height) {
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}