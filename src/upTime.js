import {getDataFromSessionStorage, saveToSessionStorage} from "@/utils";

let currentTime = Date.now();
let urlObj;

// Real time on particular page
const realTime = Date.now();

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
 * Get time on this page (refresh when reloaded the page)
 * @returns string
 */
export const getRealTime = (current, previous = realTime) => {
    return format(current, previous);
};


/**
 * Check if the page had accessed before
 * @returns boolean
 */
const isLastAccessPage = () => {
    const urlObjStorage = getDataFromSessionStorage('FEDebugData');
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
        return;
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
    saveToSessionStorage('FEDebugData', {
        ...urlObj,
        totalTime: Date.now() - currentTime
    });
});
