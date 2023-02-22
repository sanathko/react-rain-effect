"use strict";

require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es.number.to-fixed.js");
var _react = _interopRequireWildcard(require("react"));
var _weatherUtils = require("./js/weather-utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const Weather = props => {
  const {
    type,
    temperature,
    textureOverrides = {},
    showTime = false
  } = props;
  (0, _react.useEffect)(() => {
    (0, _weatherUtils.loadTextures)(textureOverrides);
    // when component unmounts
    return () => {
      (0, _weatherUtils.cleanWeather)();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function calculateTemp() {
    return temperature ? Number(temperature).toFixed(0) : 0;
  }
  function getCurrentTime() {
    let now = new Date();
    let options = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return now.toLocaleString('en-us', options);
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "demo-1"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "container1"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "slideshow"
  }, /*#__PURE__*/_react.default.createElement("canvas", {
    width: "1",
    height: "1",
    id: "container-weather"
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "slide",
    id: "slide-1",
    "data-weather": type
  }, showTime && /*#__PURE__*/_react.default.createElement("div", {
    className: "slide__element slide__element--date"
  }, getCurrentTime()), temperature > 0 && /*#__PURE__*/_react.default.createElement("div", {
    className: "slide__element slide__element--temp"
  }, calculateTemp(), /*#__PURE__*/_react.default.createElement("sup", {
    className: "celcius"
  }, "C")))), /*#__PURE__*/_react.default.createElement("p", {
    className: "nosupport"
  }, "Sorry, but your browser does not support WebGL!")));
};
var _default = Weather;
exports.default = _default;