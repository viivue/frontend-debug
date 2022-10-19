import {getElementProperty} from "./utils";

let ip = '';

/**
 * Get browser IP from API
 * @returns {*}
 */
const getBrowserIp = async() => {
    try{
        const response = await fetch('https://api.ipify.org/?format=json');
        if(!response.ok){
            ip = 'Failed to get current IP!';
            return;
        }
        const {ip: fetchIp} = await response.json();
        ip = fetchIp;
    }catch(e){
        ip = 'Failed to get current IP!';
    }
};


/**
 * Get and return browser user-agent
 * @returns {string}
 */
const getBrowserUserAgent = () => navigator.userAgent;

window.getElementProperty = getElementProperty;

export const browserObj = {
    getIpAddress: () => {
        if(!ip){
            getBrowserIp();
            return undefined;
        }
        return ip;
    },
    getUserAgent: getBrowserUserAgent(),
    getHTMLClass: `<button onclick="getElementProperty('html', 'class', alert)">HTML class</button>`,
    getBodyClass: `<button onclick="getElementProperty('body', 'class', alert)">Body class</button>`,
};