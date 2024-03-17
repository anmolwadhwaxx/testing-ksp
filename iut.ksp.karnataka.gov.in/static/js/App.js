import React, {
    useState
} from 'react'
import AppRouter from './AppRouter'
import './styles/global.scss';
import './styles/font-awesome.min.css';
import {
    API_BASE_URL
} from "./config"
import AccessRestricted from './components/layouts/AccessRestricted';

const getWindowDimensions = () => {
    const {
        innerWidth: width,
        innerHeight: height
    } = window;
    return {
        width,
        height
    };
}

const App = () => {
    const URL = `https://${window.location.hostname}/api/`;

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    console.log(windowDimensions);

    // const URL = API_BASE_URL;

    return windowDimensions.width > 800 ? < AppRouter API_BASE_URL = {
        URL
    }
    /> : <AccessRestricted / >
}

export default App