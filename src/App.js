import { useState } from 'react';
import Weather from './Weather';
// import './css/demo.css';
// import './css/style1.css';

// we can import custom backgrounds and then override the existing ones with those using textureOverrides prop
// import TextureRainFg from './background/background01.jpg';
// import TextureRainBg from './background/background01.jpg';


function App() {
    // VALID values for texture overrides - rainFg,rainBg,stormLightningFg,stormLightningBg,falloutFg,falloutBg,sunFg,sunBg,drizzleFg,drizzleBg
    // rain, storm, fallout, drizzle, sunny
    // const textureOverrides = {'rainFg': TextureRainFg, 'rainBg': TextureRainBg}
    // const textureOverrides = {'falloutFg': TextureRainFg, 'falloutBg': TextureRainBg}

    const [weatherState, setWeatherState] = useState('sunny')

    function handleClick(event, condition) {
        event.preventDefault();
        console.log('condition ', condition);
        setWeatherState(condition)
    }
  return (
    <>
        {weatherState === 'rain' && <Weather type="rain"/>}
        {weatherState === 'drizzle' && <Weather type="drizzle"/>}
        {weatherState === 'sunny' && <Weather type="sunny"/>}
        {weatherState === 'storm' && <Weather type="storm"/>}
        {weatherState === 'fallout' && <Weather type="fallout"/>}

        <nav className="slideshow__nav">
            <button className="nav-item" onClick={e => handleClick(e, 'rain')} ><i className="icon icon--rainy"></i><span>10/24</span></button>
            <button className="nav-item" onClick={e => handleClick(e, 'drizzle')} ><i className="icon icon--drizzle"></i><span>10/25</span></button>
            <button className="nav-item" onClick={e => handleClick(e, 'sunny')} ><i className="icon icon--sun"></i><span>10/26</span></button>
            <button className="nav-item" onClick={e => handleClick(e, 'storm')} ><i className="icon icon--storm"></i><span>10/28</span></button>
            <button className="nav-item" onClick={e => handleClick(e, 'fallout')}><i className="icon icon--radioactive"></i><span>10/27</span></button>
        </nav>
    </>
  );
}

export default App;