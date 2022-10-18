import {getDataFromSessionStorage, saveToSessionStorage} from "./utils";

let currentTime = Date.now();
let urlObj = {},
    urlList = [],
    urlStorageObj = {},
    index = 0,
    lastAccess = false;

// Real time on particular page
const realTime = Date.now();


/**
 * Check if the page had accessed before
 * @returns boolean
 */
const isLastAccessPage = () => {
    urlStorageObj = getDataFromSessionStorage('FEDebugData');
    if(!urlStorageObj) return false;

    // Destructuring object from SessionStorage
    urlStorageObj.url = getUrl();
    urlList = urlStorageObj.urlList;

    // Does the page exist by checking includes
    urlObj = urlList.find(urlObj => !!(urlObj.url.includes(getUrl()) || getUrl().includes(urlObj.url)));

    // Has existed in Session Storage
    if(urlObj){
        // Absolutely Equivalent
        if(urlObj.urlRefs.find(url => url === getUrl()) === undefined){
            urlObj.urlRefs.push(getUrl());
        }

        // Get new domain (comparing with refs)
        urlObj.url = getDomain(urlObj.url, urlObj.urlRefs);

        // Replace new URL (with the exact URL)
        urlStorageObj.urlList = replaceUrlWithNewUrl(urlObj.url, urlStorageObj.urlList);

        // find Index to re-assign for total time before exiting
        index = urlList.findIndex(urlObj => !!(urlObj.url.includes(getUrl()) || getUrl().includes(urlObj.url)));
    }else{
        // create the new one
        index = urlList.length;
        urlObj = {
            url: getUrl(),
            urlRefs: [getUrl()],
            totalTime: 0,
        };
        urlStorageObj.urlList.push(urlObj);
    }
    return true;
};


/**
 * Check if the page had accessed before and re-assigned currentTime variable
 */
const checkLastAccessPage = () => {
    if(isLastAccessPage()){
        currentTime = Date.now() - urlObj.totalTime;
        lastAccess = true;
        return;
    }
    urlObj = {
        url: getUrl(),
        urlRefs: [getUrl()],
        totalTime: 0
    };
    urlStorageObj = {
        url: getUrl(),
        urlList: [urlObj],
    };
};


/**
 * Replace URL Array
 * @returns array
 */
const replaceUrlWithNewUrl = (url, urlList) => {
    const results = [{
        url,
        urlRefs: []
    }];
    let isReplace = false;
    let maxTime = 0;

    for(let i = 0; i < urlList.length; i++){
        const currentObj = urlList[i];
        if(!currentObj.url.includes(url)){
            results.push(currentObj);
            continue;
        }
        results[0].urlRefs = [...results[0].urlRefs, ...currentObj.urlRefs];
        maxTime = currentObj.totalTime > maxTime ? currentObj.totalTime : maxTime;
        isReplace = true;
    }

    if(!isReplace) return results.splice(1);
    results[0].totalTime = maxTime;
    return results;
};


/**
 * Check if the page had accessed before and re-assigned currentTime variable
 */
const handlePageExit = () => {
    urlStorageObj.urlList[index].totalTime = Date.now() - currentTime;
    saveToSessionStorage('FEDebugData', urlStorageObj);
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
    if(url.pathname === '/') return url.origin;
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
 * @returns string
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
 * @returns {*}
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

            const resultUrl = results.find(str => str === newStr);
            if(!resultUrl){
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
    if(referenceUrls.length === 0) return url;

    const hasExist = referenceUrls.find(urlArr => urlArr.includes(url));
    if(hasExist === undefined) return url;

    return getDiffDomainFromURL([url, ...referenceUrls])[0];
};