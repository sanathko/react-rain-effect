import React, { useEffect } from 'react';
import './css/demo.css';
import './css/style1.css';
import {loadTextures, cleanWeather } from './js/weather-utils';

const Weather = (props) => {
  const {type, temperature, textureOverrides = {}, showTime = false} = props;
  console.log('TYPE  ', props.type)
  useEffect(() => {
    loadTextures(textureOverrides);
    // when component unmounts
    return () => {
      cleanWeather();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
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

    return (
      <div className="demo-1">
        <div className="container1">
          <div className="slideshow">
            <canvas width="1" height="1" id="container-weather"></canvas>
            <div className="slide" id="slide-1" data-weather={type}>
              {showTime && <div className="slide__element slide__element--date">{getCurrentTime()}</div>}
              {temperature > 0 && <div className="slide__element slide__element--temp">{calculateTemp()}<sup className="celcius">C</sup></div>}
            </div>
          </div>
          <p className="nosupport">Sorry, but your browser does not support WebGL!</p>
        </div>
      </div>
    )
  
}

export default Weather;
