"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/web.dom-collections.iterator.js");
var WebGL = _interopRequireWildcard(require("./webgl"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function GL(canvas, options, vert, frag) {
  this.init(canvas, options, vert, frag);
}
GL.prototype = {
  canvas: null,
  gl: null,
  program: null,
  width: 0,
  height: 0,
  init(canvas, options, vert, frag) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.gl = WebGL.getContext(canvas, options);
    this.program = this.createProgram(vert, frag);
    this.useProgram(this.program);
  },
  createProgram(vert, frag) {
    let program = WebGL.createProgram(this.gl, vert, frag);
    return program;
  },
  useProgram(program) {
    this.program = program;
    this.gl.useProgram(program);
  },
  createTexture(source, i) {
    return WebGL.createTexture(this.gl, source, i);
  },
  createUniform(type, name) {
    for (var _len = arguments.length, v = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      v[_key - 2] = arguments[_key];
    }
    WebGL.createUniform(this.gl, this.program, type, name, ...v);
  },
  activeTexture(i) {
    WebGL.activeTexture(this.gl, i);
  },
  updateTexture(source) {
    WebGL.updateTexture(this.gl, source);
  },
  draw() {
    WebGL.setRectangle(this.gl, -1, -1, 2, 2);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
};
var _default = GL;
exports.default = _default;