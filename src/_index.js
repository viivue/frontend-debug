import {EventsManager} from "@phucbm/os-util";
import {getUrlParam, scroll} from "./utils";
import {generateHTML, styling} from "./layout";
import {initBrowser} from "./browser";
import {initScroll} from "./scroll";
import {initSizing} from "./sizing";
import {initTiming} from "./timing";
import {styleButton} from "./styling";
import {setupEventsFire} from "./fire-events";
import {Record} from "./class-record";

const packageInfo = require('../package.json');

/**
 * Private class
 */
class FrontEndDebug{
    constructor(){
        // validate
        this.debugContainer = document.querySelectorAll('#fe-debug');
        if(!this.validate()) return false;

        // init events manager
        this.events = new EventsManager(this, {
            names: ['onRaf', 'onScroll', 'onResize', 'onLoad'] // register event names
        });

        // data
        this.packageInfo = packageInfo;
        this.lastScrollPosition = scroll().top; // todo: move to scroll.js if possible

        // store stats info
        this.stats = [];

        // HTML
        generateHTML(this);

        initScroll(this);
        initSizing(this);
        initTiming(this);
        initBrowser(this);

        // Styling
        styling(this);

        // fire events
        setupEventsFire(this);

        // assign event
        this.on('raf', () => {
            this.lastScrollPosition = scroll().top;
        });

        // default button style todo: remove this setTimeOut if possible
        setTimeout(() => {
            styleButton(this.debugContainer.querySelectorAll('[data-fe-debug] button'));
        }, 0);
    }

    /**
     * Assign late-events
     */
    on(eventName, callback){
        this.events.add(eventName, callback);
    }

    addRecord(options){
        this.stats.push(new Record(this, options));
    }

    getRecord(key){
        return this.stats.filter(rec => rec.key === key)[0];
    }


    /**
     * Validate before init
     * If the param is 'nodebug' => not show the debug.
     * If the param is 'debug' => show debug
     * and the next upTime access the page (without closing the current page), we don't need the param anymore to show the FE Debug
     * @returns {boolean}
     */
    validate(){
        // stop debug when the param is 'nodebug'
        const isStopDebug = getUrlParam('nodebug') !== null;
        if(isStopDebug){
            sessionStorage.removeItem("FrontEndDebug");
            return false;
        }

        const isDebug = getUrlParam('debug') !== null;
        const notInit = !this.debugContainer.length;
        const isPassed = isDebug && notInit;

        // passed
        if(isPassed){
            // session storage not assigned
            if(typeof sessionStorage.getItem("FrontEndDebug") === 'object'){
                // save status to session storage
                sessionStorage.setItem("FrontEndDebug", "on");
            }

            console.warn('FrontEndDebug enabled via URL param.');
            return true;
        }else{
            // not passed
            if(typeof sessionStorage.getItem("FrontEndDebug") === 'string'){
                // but has session
                if(sessionStorage.getItem("FrontEndDebug") === 'on'){
                    console.warn('FrontEndDebug enabled via session storage. Close tab or add ?nodebug to clear session.');
                    return true;
                }
            }
        }

        return false;
    }
}

window.FrontEndDebug = new FrontEndDebug();