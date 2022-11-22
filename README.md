# Displaying rain effect with in an HTML page using React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Inspired by - https://freebiesbug.com/code-stuff/rain-drops-effect-with-webgl/
Code is extended from https://github.com/codrops/RainEffect

## Install

Run the following command:
`npm install react-rain-effect` OR `yarn add react-rain-effect`

### Usage

`import { Weather } from 'react-rain-effect`

### How to use the component

`<Weather type="rain"/> `
`type properties allowed - rain, drizzle, sunny, storm, fallout`

`Other properties allowed `

| Name                 | Description      
| -----------          | -----------      
| temperature          | number (if provided , will show the temperature passed) otherwise hide it            
| textureOverrides     | optional object, if passed, will override the default textures for each  type ()             
|                      |    rainFg,rainBg,stormLightningFg, stormLightningBg, falloutFg,falloutBg,sunFg,sunBg, drizzleFg, drizzleBg             
| showTime             | boolean (if provided, will show the time asa a day time string)

### How to use textureOverrides (code example)
`   import TextureRainFg from './background/background01.jpg';`

`   const textureOverrides = {'falloutFg': TextureRainFg, 'falloutBg': TextureRainBg}`