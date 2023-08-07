//let ip = '';

/**
 * Get browser IP from API
 * @returns {*}
 */
// const getBrowserIp = async() => {
//     try{
//         const response = await fetch('https://api.ipify.org/?format=json');
//         if(!response.ok){
//             ip = 'Failed to get current IP!';
//             return;
//         }
//         const {ip: fetchIp} = await response.json();
//         ip = fetchIp;
//     }catch(e){
//         ip = 'Failed to get current IP!';
//     }
// };


/**
 * Get and return browser user-agent
 * @returns {string}
 */
const browserObj = {
    // getIpAddress: () => {
    //     if(!ip){
    //         getBrowserIp();
    //         return undefined;
    //     }
    //     return ip;
    // },
    getUserAgent: navigator.userAgent,
    getHTMLClass: () => document.querySelector('html').getAttribute('class'),
    getBodyClass: () => document.querySelector('body').getAttribute('class'),
};


export function initBrowser(context){
    context.addRecord({
        separator: true,
        slug: 'user-agent',
        label: 'UserAgent: [value]',
        value: () => browserObj.getUserAgent,
    });

    context.addRecord({
        slug: 'HTML-class',
        label: 'HTML class: [value]',
        ref: {
            'html-class': () => document.querySelector('html').getAttribute('class')
        },
        value: '{html-class}',
        on: ['raf']
    });

    context.addRecord({
        slug: 'body-class',
        label: 'Body class: [value]',
        ref: {
            'body-class': () => document.querySelector('body').getAttribute('class')
        },
        value: '{body-class}',
        on: ['raf']
    });

    // context.addRecord({
    //     separator: true,
    //     slug: 'IP',
    //     label: 'IP: [value]',
    //     value: () => browserObj.getIpAddress(),
    //     isNotChange: true,
    // });
}