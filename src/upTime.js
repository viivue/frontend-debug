import {getDataFromLocalStorage, saveToLocalStorage} from "@/utils";

let currentTime = Date.now();
let urlObj;


/**
 * Format time depends on seconds
 * @returns string
 * @param current
 * @param previous
 */
export const format = (current, previous = currentTime) => {
    const seconds = Math.round((current - previous) / 1000);

    const hour = ('0' + Math.floor(seconds / 3600)).slice(-2);
    const minute = ('0' + Math.floor((seconds % 3600) / 60)).slice(-2);
    const second = ('0' + Math.floor(((seconds % 3600) % 60))).slice(-2);
    return `${hour}:${minute}:${second}`;
};


/**
 * Check if the page had accessed before
 * @returns boolean
 */
const isLastAccessPage = () => {
    const urlObjStorage = getDataFromLocalStorage('FEDebugData');
    if(!urlObjStorage) return false;

    urlObj = urlObjStorage;
    return true;
};


/**
 * Check if the page had accessed before and re-assigned currentTime variable
 */
const checkLastAccessPage = () => {
    if(isLastAccessPage()){
        currentTime = Date.now() - urlObj.totalTime;
    }
    const urlInstance = new URL(location.href);
    urlObj = {
        host: urlInstance.host,
        hostname: urlInstance.hostname,
        href: urlInstance.href,
        origin: urlInstance.origin,
        pathname: urlInstance.pathname
    };
};
window.addEventListener('load', checkLastAccessPage);
window.addEventListener('beforeunload', () => {
    saveToLocalStorage('FEDebugData', {
        ...urlObj,
        totalTime: Date.now() - currentTime
    })
});
