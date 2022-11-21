"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanWeather = cleanWeather;
exports.loadTextures = loadTextures;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.promise.js");
var _gsap = _interopRequireDefault(require("gsap"));
var _rainRenderer = _interopRequireDefault(require("./rain-renderer"));
var _raindrops = _interopRequireDefault(require("./raindrops"));
var _imageLoader = _interopRequireDefault(require("./image-loader"));
var _createCanvas = _interopRequireDefault(require("./create-canvas"));
var _times = _interopRequireDefault(require("./times"));
var _random = require("./random");
var _dropColor = _interopRequireDefault(require("../img/drop-color.png"));
var _dropAlpha = _interopRequireDefault(require("../img/drop-alpha.png"));
var _textureRainFg = _interopRequireDefault(require("../img/weather/texture-rain-fg.png"));
var _textureRainBg = _interopRequireDefault(require("../img/weather/texture-rain-bg.png"));
var _textureSunFg = _interopRequireDefault(require("../img/weather/texture-sun-fg.png"));
var _textureSunBg = _interopRequireDefault(require("../img/weather/texture-sun-bg.png"));
var _textureFalloutFg = _interopRequireDefault(require("../img/weather/texture-fallout-fg.png"));
var _textureFalloutBg = _interopRequireDefault(require("../img/weather/texture-fallout-bg.png"));
var _textureDrizzleFg = _interopRequireDefault(require("../img/weather/texture-drizzle-fg.png"));
var _textureDrizzleBg = _interopRequireDefault(require("../img/weather/texture-drizzle-bg.png"));
var _textureStormLightningFg = _interopRequireDefault(require("../img/weather/texture-storm-lightning-fg.png"));
var _textureStormLightningBg = _interopRequireDefault(require("../img/weather/texture-storm-lightning-bg.png"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let textureRainFg, textureRainBg, textureStormLightningFg, textureStormLightningBg, textureFalloutFg, textureFalloutBg, textureSunFg, textureSunBg, textureDrizzleFg, textureDrizzleBg, dropColor, dropAlpha;
let textureFg, textureFgCtx, textureBg, textureBgCtx;
let textureBgSize = {
  width: 384,
  height: 256
};
let textureFgSize = {
  width: 96,
  height: 64
};
let raindrops, renderer, canvas;
let parallax = {
  x: 0,
  y: 0
};
let weatherData = null;
let curWeatherData = null;
let blend = {
  v: 0
};
let intervalId = undefined;
function loadTextures(textureOverrides) {
  // if correct texture overrides are provided,then load them, otherwise use the existing ones
  for (const [key, value] of Object.entries(textureOverrides)) {
    switch (key) {
      case 'rainFg':
        _textureRainFg.default = (value, function () {
          throw new Error('"' + "TextureRainFg" + '" is read-only.');
        }());
        break;
      case 'rainBg':
        _textureRainBg.default = (value, function () {
          throw new Error('"' + "TextureRainBg" + '" is read-only.');
        }());
        break;
      case 'stormLightningFg':
        _textureStormLightningFg.default = (value, function () {
          throw new Error('"' + "TextureStormLightningFg" + '" is read-only.');
        }());
        break;
      case 'stormLightningBg':
        _textureStormLightningBg.default = (value, function () {
          throw new Error('"' + "TextureStormLightningBg" + '" is read-only.');
        }());
        break;
      case 'falloutFg':
        _textureFalloutFg.default = (value, function () {
          throw new Error('"' + "TextureFalloutFg" + '" is read-only.');
        }());
        break;
      case 'falloutBg':
        _textureFalloutBg.default = (value, function () {
          throw new Error('"' + "TextureFalloutBg" + '" is read-only.');
        }());
        break;
      case 'sunFg':
        _textureSunFg.default = (value, function () {
          throw new Error('"' + "TextureSunFg" + '" is read-only.');
        }());
        break;
      case 'sunBg':
        _textureSunBg.default = (value, function () {
          throw new Error('"' + "TextureSunBg" + '" is read-only.');
        }());
        break;
      case 'drizzleFg':
        _textureDrizzleFg.default = (value, function () {
          throw new Error('"' + "TextureDrizzleFg" + '" is read-only.');
        }());
        break;
      case 'drizzleBg':
        _textureDrizzleBg.default = (value, function () {
          throw new Error('"' + "TextureDrizzleBg" + '" is read-only.');
        }());
        break;
      default:
        console.error('Unknown texture override value provided: ', key);
    }
  }
  (0, _imageLoader.default)([{
    name: "dropAlpha",
    src: _dropAlpha.default
  }, {
    name: "dropColor",
    src: _dropColor.default
  }, {
    name: "textureRainFg",
    src: _textureRainFg.default
  }, {
    name: "textureRainBg",
    src: _textureRainBg.default
  }, {
    name: "textureStormLightningFg",
    src: _textureStormLightningFg.default
  }, {
    name: "textureStormLightningBg",
    src: _textureStormLightningBg.default
  }, {
    name: "textureFalloutFg",
    src: _textureFalloutFg.default
  }, {
    name: "textureFalloutBg",
    src: _textureFalloutBg.default
  }, {
    name: "textureSunFg",
    src: _textureSunFg.default
  }, {
    name: "textureSunBg",
    src: _textureSunBg.default
  }, {
    name: "textureDrizzleFg",
    src: _textureDrizzleFg.default
  }, {
    name: "textureDrizzleBg",
    src: _textureDrizzleBg.default
  }]).then(function (images) {
    textureRainFg = images.textureRainFg.img;
    textureRainBg = images.textureRainBg.img;
    textureFalloutFg = images.textureFalloutFg.img;
    textureFalloutBg = images.textureFalloutBg.img;
    textureStormLightningFg = images.textureStormLightningFg.img;
    textureStormLightningBg = images.textureStormLightningBg.img;
    textureSunFg = images.textureSunFg.img;
    textureSunBg = images.textureSunBg.img;
    textureDrizzleFg = images.textureDrizzleFg.img;
    textureDrizzleBg = images.textureDrizzleBg.img;
    dropColor = images.dropColor.img;
    dropAlpha = images.dropAlpha.img;
    init();
  });
}
function init() {
  canvas = document.querySelector('#container-weather');
  var dpi = window.devicePixelRatio;
  canvas.width = window.innerWidth * dpi;
  canvas.height = window.innerHeight * dpi;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  raindrops = new _raindrops.default(canvas.width, canvas.height, dpi, dropAlpha, dropColor, {
    trailRate: 1,
    trailScaleRange: [0.2, 0.45],
    collisionRadius: 0.45,
    dropletsCleaningRadiusMultiplier: 0.28
  });
  textureFg = (0, _createCanvas.default)(textureFgSize.width, textureFgSize.height);
  textureFgCtx = textureFg.getContext('2d');
  textureBg = (0, _createCanvas.default)(textureBgSize.width, textureBgSize.height);
  textureBgCtx = textureBg.getContext('2d');
  generateTextures(textureRainFg, textureRainBg);
  renderer = new _rainRenderer.default(canvas, raindrops.canvas, textureFg, textureBg, null, {
    brightness: 1.04,
    alphaMultiply: 6,
    alphaSubtract: 3,
    minRefraction: 128
    // minRefraction:256,
    // maxRefraction:512
  });

  setupEvents();
}
function setupEvents() {
  setupParallax();
  setupWeather();
  setupFlash();
}
function setupParallax() {
  document.addEventListener('mousemove', event => {
    let x = event.pageX;
    let y = event.pageY;
    _gsap.default.to(parallax, 1, {
      x: x / canvas.width * 2 - 1,
      y: y / canvas.height * 2 - 1,
      // ease:Quint.easeOut,
      onUpdate: () => {
        renderer.parallaxX = parallax.x;
        renderer.parallaxY = parallax.y;
      }
    });
  });
}
function setupFlash() {
  intervalId = setInterval(() => {
    if ((0, _random.chance)(curWeatherData.flashChance)) {
      flash(curWeatherData.bg, curWeatherData.fg, curWeatherData.flashBg, curWeatherData.flashFg);
    }
  }, 500);
}
function setupWeather() {
  setupWeatherData();
  window.addEventListener("hashchange", function (event) {
    updateWeather();
  });
  updateWeather();
}
function setupWeatherData() {
  var defaultWeather = {
    minR: 10,
    maxR: 40,
    rainChance: 0.35,
    rainLimit: 6,
    drizzle: 50,
    drizzleSize: [2, 4.5],
    raining: true,
    trailRate: 1,
    trailScaleRange: [0.2, 0.35],
    fg: textureRainFg,
    bg: textureRainBg,
    flashFg: null,
    flashBg: null,
    flashChance: 0
  };
  function weather(data) {
    return Object.assign({}, defaultWeather, data);
  }
  ;
  weatherData = {
    rain: weather({
      rainChance: 0.35,
      rainLimit: 6,
      drizzle: 50,
      raining: true,
      // trailRate:2.5,
      fg: textureRainFg,
      bg: textureRainBg
    }),
    storm: weather({
      minR: 20,
      maxR: 45,
      rainChance: 0.55,
      rainLimit: 6,
      drizzle: 80,
      drizzleSize: [2, 6],
      trailRate: 1,
      trailScaleRange: [0.15, 0.3],
      fg: textureRainFg,
      bg: textureRainBg,
      flashFg: textureStormLightningFg,
      flashBg: textureStormLightningBg,
      flashChance: 0.1
    }),
    fallout: weather({
      rainChance: 0.35,
      rainLimit: 6,
      drizzle: 20,
      trailRate: 4,
      fg: textureFalloutFg,
      bg: textureFalloutBg
    }),
    drizzle: weather({
      rainChance: 0.15,
      rainLimit: 2,
      drizzle: 10,
      fg: textureDrizzleFg,
      bg: textureDrizzleBg
    }),
    sunny: weather({
      rainChance: 0,
      rainLimit: 0,
      drizzle: 0,
      raining: false,
      fg: textureSunFg,
      bg: textureSunBg
    })
  };
}
function updateWeather() {
  var hash = window.location.hash;
  var currentSlide = null;
  // var currentNav = null;
  if (hash !== "") {
    currentSlide = document.querySelector(hash);
  }
  if (currentSlide == null) {
    currentSlide = document.querySelector(".slide");
    hash = "#" + currentSlide.getAttribute("id");
  }
  // currentNav = document.querySelector("[href='" + hash + "']");
  var data = weatherData[currentSlide.getAttribute('data-weather')];
  curWeatherData = data;
  raindrops.options = Object.assign(raindrops.options, data);
  raindrops.clearDrops();
  _gsap.default.fromTo(blend, 1, {
    v: 0
  }, {
    v: 1,
    onUpdate: () => {
      generateTextures(data.fg, data.bg, blend.v);
      renderer.updateTextures();
    }
  });
  var lastSlide = document.querySelector(".slide--current");
  if (lastSlide != null) lastSlide.classList.remove("slide--current");
  var lastNav = document.querySelector(".nav-item--current");
  if (lastNav != null) lastNav.classList.remove("nav-item--current");
  currentSlide.classList.add("slide--current");
  //currentNav.classList.add("nav-item--current");
}

function flash(baseBg, baseFg, flashBg, flashFg) {
  let flashValue = {
    v: 0
  };
  function transitionFlash(to) {
    let t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.025;
    return new Promise((resolve, reject) => {
      _gsap.default.to(flashValue, t, {
        v: to,
        // ease:Quint.easeOut,
        onUpdate: () => {
          generateTextures(baseFg, baseBg);
          generateTextures(flashFg, flashBg, flashValue.v);
          renderer.updateTextures();
        },
        onComplete: () => {
          resolve();
        }
      });
    });
  }
  let lastFlash = transitionFlash(1);
  (0, _times.default)((0, _random.random)(2, 7), i => {
    lastFlash = lastFlash.then(() => {
      return transitionFlash((0, _random.random)(0.1, 1));
    });
  });
  lastFlash = lastFlash.then(() => {
    return transitionFlash(1, 0.1);
  }).then(() => {
    transitionFlash(0, 0.25);
  });
}
function generateTextures(fg, bg) {
  let alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  textureFgCtx.globalAlpha = alpha;
  textureFgCtx.drawImage(fg, 0, 0, textureFgSize.width, textureFgSize.height);
  textureBgCtx.globalAlpha = alpha;
  textureBgCtx.drawImage(bg, 0, 0, textureBgSize.width, textureBgSize.height);
}
function cleanWeather() {
  //TODO enhance the cleanup function
  // raindrops.clean();
  clearInterval(intervalId);
  // textureRainFg = null;
  // textureRainBg = null;
  // textureStormLightningFg = null; 
  // textureStormLightningBg = null;
  // textureFalloutFg = null; 
  // textureFalloutBg = null;
  // textureSunFg = null; 
  // textureSunBg = null;
  // textureDrizzleFg = null; 
  // textureDrizzleBg = null;
  // dropColor = null; 
  // dropAlpha  = null;
  // textureFg = null;
  // textureFgCtx = null;
  // textureBg = null;
  // textureBgCtx = null;
  // textureBgSize  = null;
  // textureFgSize  = null;
  // raindrops = null;
  // renderer = null;
  // canvas = null;
  // parallax = null;
  weatherData = null;
  curWeatherData = null;
  // blend = null;
  intervalId = null;
}