import {getDataFromSessionStorage, saveToSessionStorage} from "./utils";

let currentTime = Date.now();
let urlObj;

// Real time on particular page
const realTime = Date.now();


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


/**
 * Check if the page had accessed before and re-assigned currentTime variable
 */
const handlePageExit = () => {
    saveToSessionStorage('FEDebugData', {
        ...urlObj,
        totalTime: Date.now() - currentTime
    });
};
window.addEventListener('load', checkLastAccessPage);
window.addEventListener('beforeunload', handlePageExit);


/**
 * Format time depends on seconds
 * @returns string
 * @param currentDate
 * @param previousDate
 */
export const getDiffTime = (currentDate, previousDate = currentTime) => {
    const seconds = Math.round((currentDate - previousDate) / 1000);

    const hour = ('0' + Math.floor(seconds / 3600)).slice(-2);
    const minute = ('0' + Math.floor((seconds % 3600) / 60)).slice(-2);
    const second = ('0' + Math.floor(((seconds % 3600) % 60))).slice(-2);
    return `${hour}:${minute}:${second}`;
};

/**
 * Get time on this page (refresh when reloaded the page)
 * @returns string
 */
export const getRealTime = (currentDate, previousDate = realTime) => {
    return getDiffTime(currentDate, previousDate);
};