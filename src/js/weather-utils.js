import TweenLite from 'gsap';
import RainRenderer from "./rain-renderer";
import Raindrops from "./raindrops";
import loadImages from "./image-loader";
import createCanvas from "./create-canvas";
import times from './times';
import {random,chance} from './random';

import DropColor from '../img/drop-color.png';
import DropAlpha from '../img/drop-alpha.png';
import TextureRainFg from '../img/weather/texture-rain-fg.png';
import TextureRainBg from '../img/weather/texture-rain-bg.png';
import TextureSunFg from '../img/weather/texture-sun-fg.png';
import TextureSunBg from '../img/weather/texture-sun-bg.png';
import TextureFalloutFg from '../img/weather/texture-fallout-fg.png';
import TextureFalloutBg from '../img/weather/texture-fallout-bg.png';
import TextureDrizzleFg from '../img/weather/texture-drizzle-fg.png';
import TextureDrizzleBg from '../img/weather/texture-drizzle-bg.png';
import TextureStormLightningFg from '../img/weather/texture-storm-lightning-fg.png';
import TextureStormLightningBg from '../img/weather/texture-storm-lightning-bg.png';

let textureRainFg, textureRainBg,
  textureStormLightningFg, textureStormLightningBg,
  textureFalloutFg, textureFalloutBg,
  textureSunFg, textureSunBg,
  textureDrizzleFg, textureDrizzleBg,
  dropColor, dropAlpha;

let textureFg,
  textureFgCtx,
  textureBg,
  textureBgCtx;

let textureBgSize = {
  width:384,
  height:256
}
let textureFgSize = {
  width:96,
  height:64
}

let raindrops,
  renderer,
  canvas;

let parallax = {x:0,y:0};

let weatherData = null;
let curWeatherData = null;
let blend = {v:0};
let intervalId = undefined;

export function loadTextures(textureOverrides) {
  // if correct texture overrides are provided,then load them, otherwise use the existing ones
  for (const [key, value] of Object.entries(textureOverrides)) {
    switch (key) {
      case 'rainFg':
        TextureRainFg = value;
        break;
      case 'rainBg':
        TextureRainBg = value;
        break;
      case 'stormLightningFg':
        TextureStormLightningFg = value;
        break;
      case 'stormLightningBg':
        TextureStormLightningBg = value;
        break;
      case 'falloutFg':
        TextureFalloutFg = value;
        break;
      case 'falloutBg':
        TextureFalloutBg = value;
        break;
      case 'sunFg':
        TextureSunFg = value;
        break;
      case 'sunBg':
        TextureSunBg = value;
        break;
      case 'drizzleFg':
        TextureDrizzleFg = value;
        break;
      case 'drizzleBg':
        TextureDrizzleBg = value;
        break;                 
      default:
        console.error('Unknown texture override value provided: ', key);
    }
  }
  loadImages([
    { name:"dropAlpha", src: DropAlpha },
    { name:"dropColor", src: DropColor },
    { name:"textureRainFg", src: TextureRainFg },
    { name:"textureRainBg", src: TextureRainBg },
    { name:"textureStormLightningFg", src: TextureStormLightningFg },
    { name:"textureStormLightningBg", src: TextureStormLightningBg },
    { name:"textureFalloutFg", src:TextureFalloutFg },
    { name:"textureFalloutBg", src:TextureFalloutBg },
    { name:"textureSunFg", src: TextureSunFg },
    { name:"textureSunBg", src: TextureSunBg },
    { name:"textureDrizzleFg", src: TextureDrizzleFg },
    { name:"textureDrizzleBg", src: TextureDrizzleBg },
  ]).then(function (images){
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

  raindrops=new Raindrops(
    canvas.width,
    canvas.height,
    dpi,
    dropAlpha,
    dropColor,{
      trailRate:1,
      trailScaleRange:[0.2,0.45],
      collisionRadius : 0.45,
      dropletsCleaningRadiusMultiplier : 0.28,
    }
  );

  textureFg = createCanvas(textureFgSize.width,textureFgSize.height);
  textureFgCtx = textureFg.getContext('2d');
  textureBg = createCanvas(textureBgSize.width,textureBgSize.height);
  textureBgCtx = textureBg.getContext('2d');

  generateTextures(textureRainFg, textureRainBg);

  renderer = new RainRenderer(canvas, raindrops.canvas, textureFg, textureBg, null,{
    brightness:1.04,
    alphaMultiply:6,
    alphaSubtract:3,
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
  document.addEventListener('mousemove',(event)=>{
    let x=event.pageX;
    let y=event.pageY;

    TweenLite.to(parallax,1,{
      x:((x/canvas.width)*2)-1,
      y:((y/canvas.height)*2)-1,
      // ease:Quint.easeOut,
      onUpdate:()=>{
        renderer.parallaxX=parallax.x;
        renderer.parallaxY=parallax.y;
      }
    })
  });
}
function setupFlash() {
  intervalId = setInterval(()=>{
    if(chance(curWeatherData.flashChance)){
      flash(curWeatherData.bg,curWeatherData.fg,curWeatherData.flashBg,curWeatherData.flashFg);
    }
  },500);
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
  };

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
  raindrops.options=Object.assign(raindrops.options,data);
  raindrops.clearDrops();

  TweenLite.fromTo(blend,1,{
    v:0
  },{
    v:1,
    onUpdate:()=>{
      generateTextures(data.fg,data.bg,blend.v);
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
  let flashValue={v:0};
  function transitionFlash(to,t=0.025){
    return new Promise((resolve,reject)=>{
      TweenLite.to(flashValue,t,{
        v:to,
        // ease:Quint.easeOut,
        onUpdate:()=>{
          generateTextures(baseFg,baseBg);
          generateTextures(flashFg,flashBg,flashValue.v);
          renderer.updateTextures();
        },
        onComplete:()=>{
          resolve();
        }
      });
    });
  }

  let lastFlash=transitionFlash(1);
  times(random(2,7),(i)=>{
    lastFlash=lastFlash.then(()=>{
      return transitionFlash(random(0.1,1))
    })
  })
  lastFlash=lastFlash.then(()=>{
    return transitionFlash(1,0.1);
  }).then(()=>{
    transitionFlash(0,0.25);
  });
}
function generateTextures(fg, bg, alpha=1) {
  textureFgCtx.globalAlpha = alpha;
  textureFgCtx.drawImage(fg, 0, 0, textureFgSize.width, textureFgSize.height);

  textureBgCtx.globalAlpha = alpha;
  textureBgCtx.drawImage(bg, 0, 0, textureBgSize.width, textureBgSize.height);
}

export function cleanWeather(){
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