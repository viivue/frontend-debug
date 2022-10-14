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
    if(!urlObj.urlList.find(url => url === getUrl()))
        urlObj.urlList.push(getUrl());
    urlObj.url = getDomain(urlObj.url, urlObj.urlList);

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
    urlObj = {
        url: getUrl(),
        urlList: [getUrl()],
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

/**
 * Get URL string
 * @returns string
 */
const getUrl = () => {
    const url = new URL(location.href);
    return url.origin + url.pathname + '/';
};


/**
 * Add slash to the last character
 * @param arr
 * @returns array
 */
const addSlashToURL = (arr) => {
    return arr.map(str => {
        if(str.slice(-1) === '/') return str;
        return str + '/';
    });
};


/**
 * Get the same string from 2 strings
 * @param firstString
 * @param secondString
 * @returns array
 */
const getSameString = (firstString, secondString) => {
    const fStrArray = firstString.split('/');
    const sStrArray = secondString.split('/');

    let newStr = '';

    for(let i = 0; i < Math.min(fStrArray.length, sStrArray.length); i++){
        const word = fStrArray[i];
        if(word !== sStrArray[i]) return newStr;
        newStr += word + '/';
    }
    return newStr.slice(0, -1);
};


/**
 * Get different from domain list
 * @param urlArray
 * @returns array
 */
const getDiffDomainFromURL = (urlArray) => {
    if(!urlArray) return;
    if(urlArray.length === 1) return urlArray;

    const newUrlArray = addSlashToURL(urlArray);
    const results = [];

    let i = 0, j = 0;
    while(i < newUrlArray.length - 1){
        const str1 = newUrlArray[i];
        j = i + 1;
        while(j < newUrlArray.length){
            const str2 = newUrlArray[j++];
            const newStr = getSameString(str1, str2);

            // not contains the result of compare string  and not a valid URL
            if(!newStr || newUrlArray.find(str => str === newStr) === undefined)
                continue;

            const resultIdx = results.find(str => str === newStr);
            if(!resultIdx){
                const idx = results.findIndex(str => str.includes(newStr) || newStr.includes(str));

                // not exist yet
                if(idx === -1){
                    results.push(newStr);
                    continue;
                }

                // already exist
                if(results[idx].includes(newStr)){
                    results[idx] = newStr;
                }
            }
        }
        i++;
    }
    return results;
};


/**
 * Get home-domain from domain list
 * @param url
 * @param referenceUrls
 * @returns string
 */
const getDomain = (url, referenceUrls = []) => {
    if(!url) return '';
    if(!referenceUrls) return url.split('/')[0] + '/';

    return getDiffDomainFromURL([url, ...referenceUrls])[0];
};