import {getUrlParam, scroll, round, viewport, setCSS} from "./utils";
import {generateHTML} from "./layout";
import {getDiffTime, getRealTime} from "./upTime";
import {browserObj} from "./browser";
import {scrollObject} from "./scroll";
import {getAddressBarHeight} from "./address-bar";

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
        this.maxSpeed = 0;
        this.lastSpeed = 0;
        this.averageSpeed = 0;

        this.lastSpeedCount = 0;
        this.lastSpeedTotal = 0;

        this.memory = {};
        this.indicateTime = parseInt(getUrlParam('debug')) || parseInt(sessionStorage.getItem("FrontEndDebugIndicateTime")) || 500;
        sessionStorage.setItem("FrontEndDebugIndicateTime", this.indicateTime);

        this.addressBarSize = 0;

        this.stats = [
            {
                slug: 'scroll',
                label: 'Scroll: [value]',
                value: () => {
                    const direction = this.lastScrollPosition > scroll().top ? '⏫' : '⏬';
                    const progress = round(scroll().top / (document.body.clientHeight - viewport().h), 3);
                    return `${this.indicate(round(scroll().top), 'scrollAmount')} ${direction} ${this.indicate(progress, 'progress')}`;
                }
            },
            {
                separator: true,
                slug: 'speed',
                label: 'Speed: [value]',
                value: () => {
                    this.lastSpeed = Math.abs(this.lastScrollPosition - scroll().top);

                    // for avg. speed
                    this.lastSpeedCount++;
                    this.lastSpeedTotal += this.lastSpeed;

                    return this.indicate(round(this.lastSpeed), 'lastSpeed');
                }
            },
            {
                slug: 'average-speed',
                label: 'Avg. speed: [value]',
                value: () => {
                    // only update if changes
                    if(this.lastScrollPosition !== scroll().top){
                        this.averageSpeed = this.lastSpeedTotal / this.lastSpeedCount;
                    }

                    return this.indicate(round(this.averageSpeed), 'averageSpeed');
                }
            },
            {
                slug: 'max-speed',
                label: 'Max speed: [value]',
                value: () => {
                    this.maxSpeed = Math.max(this.maxSpeed, this.lastSpeed);
                    return this.indicate(round(this.maxSpeed), 'maxSpeed');
                }
            },
            {
                separator: true,
                slug: 'viewport',
                label: 'Viewport: [value]',
                value: () => `${this.indicate(viewport().w, 'viewportWidth')}/${this.indicate(viewport().h, 'viewportHeight')}`
            },

            {
                slug: 'document',
                label: 'Document: [value]',
                value: () => `${this.indicate(document.body.clientWidth, 'clientWidth')}/${this.indicate(document.body.clientHeight, 'clientHeight')}`
            },
            {
                slug: 'address-bar',
                label: 'Address bar: [value]',
                value: () => {
                    const newAddressBarHeight = getAddressBarHeight();
                    if(newAddressBarHeight > this.addressBarSize){
                        this.addressBarSize = newAddressBarHeight;
                    }

                    return this.addressBarSize;
                }
            },
            // {
            //     separator: true,
            //     slug: 'time',
            //     label: 'Uptime: [value]',
            //     value: () => `${getDiffTime(Date.now())}`,
            // },
            {
                separator: true,
                slug: 'on-this-page',
                label: 'On this page: [value]',
                value: () => `${getRealTime(Date.now())}`,
            },
            // {
            //     separator: true,
            //     slug: 'IP',
            //     label: 'IP: [value]',
            //     value: () => browserObj.getIpAddress(),
            //     isNotChange: true,
            // },
            {
                separator: true,
                slug: 'user-agent',
                label: 'UserAgent: [value]',
                value: () => browserObj.getUserAgent,
                isNotChange: true,
            },
            {
                slug: 'HTML-class',
                label: 'HTML class: [value]',
                value: () => browserObj.getHTMLClass,
                isNotChange: true,
            },
            {
                slug: 'body-class',
                label: 'Body class: [value]',
                value: () => browserObj.getBodyClass,
                isNotChange: true,
            },
            {
                separator: true,
                slug: 'scroll-bottom',
                label: 'Scroll to bottom: [value]',
                value: () => `${scrollObject.scroll(2, 'Slow')} - ${scrollObject.scroll(10, 'Normal')} - ${scrollObject.scroll(20, 'Fast')}`,
                isNotChange: true,
            }
        ];

        // HTML
        generateHTML(this);

        // update using rAF
        const onUpdate = () => {
            this.updateStats();
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