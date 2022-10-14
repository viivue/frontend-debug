import {getElementProperty} from "./utils";

export const browserObj = {};

/**
 * Get browser IP from API
 * @returns {*}
 */
const getBrowserIp = async() => {
    try{
        const response = await fetch('https://api.ipify.org/?format=json');
        if(!response.ok)
            return false;
        return await response.json();
    }catch(e){
        return false;
    }
};


/**
 * Get and return browser information
 * @returns {*}
 */
const getBrowserInformation = async() => {
    // Get HTML class
    browserObj.htmlClass = `<button onclick="getElementProperty('html', 'class', alert)">HTML class</button>`;

    // Get Body class
    browserObj.bodyClass = `<button onclick="getElementProperty('body', 'class', alert)">Body class</button>`;

    // Get browser userAgent
    browserObj.userAgent = navigator.userAgent;

    // Assign function to window object
    window.getElementProperty = getElementProperty;

    // Get browser IP
    const ipObj = await getBrowserIp();
    if(!ipObj){
        browserObj.ip = 'Failed to get current IP!';
        return;
    }
    browserObj.ip = ipObj.ip;
};

window.addEventListener('load', getBrowserInformation);