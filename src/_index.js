import {getUrlParam, scroll, round, viewport, setCSS} from "./utils";
import {generateHTML} from "./layout";
import {getDiffTime, getRealTime} from "./upTime";
import {browserObj, initBrowser} from "./browser";
import {initScroll, scrollObject} from "./scroll";
import {getAddressBarHeight} from "./address-bar";
import {initSizing} from "@/sizing";
import {initTiming} from "@/timing";

const packageInfo = require('../package.json');

/**
 * Private class
 */
class FrontEndDebug{
    constructor(){
        // validate
        this.debugContainer = document.querySelectorAll('#fe-debug');
        if(!this.validate()) return false;

        // data
        this.packageInfo = packageInfo;
        this.lastScrollPosition = scroll().top;

        this.memory = {};
        this.indicateTime = parseInt(getUrlParam('debug')) || parseInt(sessionStorage.getItem("FrontEndDebugIndicateTime")) || 500;
        sessionStorage.setItem("FrontEndDebugIndicateTime", this.indicateTime);


        this.stats = [];

        initScroll(this);
        initSizing(this);
        initTiming(this);
        initBrowser(this);

        // HTML
        generateHTML(this);

        // update using rAF
        const onUpdate = () => {
            this.updateStats();
            this.lastScrollPosition = scroll().top;
            window.requestAnimationFrame(onUpdate);
        };
        window.requestAnimationFrame(onUpdate);


        // button style
        this.debugContainer.querySelectorAll('[data-fe-debug] button').forEach(node => {
            setCSS(node, {
                backgroundColor: 'transparent',
                color: '#fff',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
                margin: 0,
                fontSize: '12px',
                width: 'auto',
                minWidth: 'unset'
            });
        });
    }

    add(obj){
        this.stats.push(obj);
    }

    /**
     * Indicate
     * Detect and return old/new value between each frame reset (rAF)
     */
    indicate(value, key){
        const newValue = value => `<span style="color:#96cdff">${value}</span>`;

        if(typeof this.memory[key] === 'undefined'){
            // create new
            this.memory[key] = {};
        }else{
            // found
            if(this.memory[key].value === value){
                // same value
                return this.memory[key].isNew ? newValue(value) : value;
            }
        }


        // update value
        this.memory[key].value = value;
        this.memory[key].isNew = true;

        // setTimeout
        clearTimeout(this.memory[key].timeout);
        this.memory[key].timeout = setTimeout(() => {
            this.memory[key].isNew = false;
        }, this.indicateTime);

        return newValue(value);
    }

    /**
     * Update stats of each value when frame reset
     */
    updateStats(){
        this.stats.forEach((item, index, arr) => {
            const value = item.value();

            this.debugContainer.querySelectorAll(`[data-fe-debug="${item.slug}"]`).forEach(node => {
                if(value === item.oldValue) return;

                // Render new value
                node.innerHTML = item.label.replace('[value]', value);

                // assign value for the next checking
                item.oldValue = value;
            });

            /* If stat doesn't need to update and already has value => remove */
            if(item.isNotChange && value) arr.splice(index);
        });

        this.lastScrollPosition = scroll().top;
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