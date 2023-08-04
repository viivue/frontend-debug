import {getElementProperty} from "./utils";
import {scrollObject} from "@/scroll";

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
const getHTMLClassElement = () => document.querySelector('html').getAttribute('class');
const getBodyClassElement = () => document.querySelector('body').getAttribute('class');

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
    getHTMLClass: getHTMLClassElement(),
    getBodyClass: getBodyClassElement(),
};


export function initBrowser(context){
    context.add({
        separator: true,
        slug: 'user-agent',
        label: 'UserAgent: [value]',
        value: () => browserObj.getUserAgent,
        isNotChange: true,
    });

    context.add({
        slug: 'HTML-class',
        label: 'HTML class: [value]',
        value: () => browserObj.getHTMLClass,
        isNotChange: true,
    });

    context.add({
        slug: 'body-class',
        label: 'Body class: [value]',
        value: () => browserObj.getBodyClass,
        isNotChange: true,
    });

    // context.add({
    //     separator: true,
    //     slug: 'IP',
    //     label: 'IP: [value]',
    //     value: () => browserObj.getIpAddress(),
    //     isNotChange: true,
    // });

    context.add({
        separator: true,
        slug: 'scroll-bottom',
        label: 'Scroll to bottom: [value]',
        value: () => `${scrollObject.scroll(2, 'Slow')} - ${scrollObject.scroll(10, 'Normal')} - ${scrollObject.scroll(20, 'Fast')}`,
        isNotChange: true,
    });
}