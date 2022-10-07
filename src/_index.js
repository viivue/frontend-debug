import {getUrlParam, scroll, round, setCSS, uniqueId, viewport, append} from "@/utils";

/**
 * Private class
 */
class FrontEndDebug{
    constructor(){
        // validate
        this.debugContainer = document.querySelectorAll('#fe-debug');
        if(!this.validate()) return false;

        // data
        this.version = '0.0.1';
        this.lastScrollPosition = scroll().top;
        this.maxSpeed = 0;
        this.lastSpeed = 0;
        this.averageSpeed = 0;

        this.lastSpeedCount = 0;
        this.lastSpeedTotal = 0;

        this.memory = {};
        this.indicateTime = parseInt(getUrlParam('debug')) || parseInt(sessionStorage.getItem("FrontEndDebugIndicateTime")) || 500;
        sessionStorage.setItem("FrontEndDebugIndicateTime", this.indicateTime);

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
            }
        ];

        // HTML
        this.generateHTML();

        // update using rAF
        const onUpdate = () => {
            this.updateStats();
            window.requestAnimationFrame(onUpdate);
        };
        window.requestAnimationFrame(onUpdate);
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
        // loop through all stats
        for(const item of this.stats){
            this.debugContainer.querySelectorAll(`[data-fe-debug="${item.slug}"]`).forEach(node => {
                node.innerHTML = item.label.replace('[value]', item.value());
            });
        }

        this.lastScrollPosition = scroll().top;
    }

    /**
     * Generate FE Debug HTML
     */
    generateHTML(){
        append(document.querySelector('body'), `<div id="fe-debug"><div class="head"><span>Debug UI v${this.version}</span><button style="background-color:transparent">🔻</button></div></div>`);
        this.debugContainer = document.querySelector('#fe-debug');

        // append stats
        for(const item of this.stats){
            const stats = this.debugContainer.querySelectorAll(`[data-fe-debug="${item.slug}"]`);
            if(!stats.length){
                // append new
                append(this.debugContainer, `<div style="display:none" data-fe-debug="${item.slug}">${item.label.replace('[value]', item.value())}</div>`)
                const itemEl = this.debugContainer.querySelector(`[data-fe-debug="${item.slug}"]`);

                // apply styling
                if(typeof item.separator === 'boolean' && item.separator === true){
                    // separator with border top
                    itemEl.classList.add('sep');
                }
            }
        }

        // apply styling
        setCSS(this.debugContainer, {
            position: 'fixed',
            bottom: '0',
            left: '0',
            zIndex: '9999999',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '12px',
            borderRadius: '0 10px 0 0',
            backdropFilter: 'blur(5px)',
            overflow: 'hidden',
            minWidth: '175px'
        });
        this.debugContainer.querySelectorAll('.head').forEach(node => {
            setCSS(node, {
                padding: '3px 10px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            });
        });
        this.debugContainer.querySelectorAll('[data-fe-debug]').forEach(node => {
            setCSS(node, {padding: '0 10px'});
        });
        this.debugContainer.querySelectorAll('.head + [data-fe-debug]').forEach(node => {
            setCSS(node, {paddingTop: '5px'});
        });
        this.debugContainer.querySelectorAll('[data-fe-debug]:last-child').forEach(node => {
            setCSS(node, {paddingBottom: '5px'});
        });
        this.debugContainer.querySelectorAll('.sep').forEach(node => {
            setCSS(node, {
                borderTop: '1px solid rgba(255,255,255,0.15)',
                paddingTop: '5px',
                marginTop: '5px'
            });
        });

        const closeButton = this.debugContainer.querySelectorAll('.head button');
        closeButton.forEach(node => {
            setCSS(node, {
                backgroundColor: 'rgba(0,0,0,0)',
                color: '#fff',
                marginLeft: '10px',
                padding: '3px',
            });
        });


        // dialog open
        const toggleDialog = () => {
            if(this.isDialogOpen === true || this.isDialogOpen === 'true'){
                this.debugContainer.querySelectorAll('[data-fe-debug]').forEach(node => setCSS(node, {display: 'block',}));
                closeButton.textContent = '🔻';
            }else{
                this.debugContainer.querySelectorAll('[data-fe-debug]').forEach(node => setCSS(node, {display: 'none',}));
                closeButton.textContent = '🔺';
            }
            sessionStorage.setItem("FrontEndDebugOpen", this.isDialogOpen);
        };

        // on init
        this.isDialogOpen = sessionStorage.getItem("FrontEndDebugOpen") === null ? true : sessionStorage.getItem("FrontEndDebugOpen");
        toggleDialog();

        // on toggle
        closeButton.forEach(node => node.addEventListener('click', () => {
            this.isDialogOpen = !this.isDialogOpen;
            toggleDialog();
        }));
    }


    /**
     * Validate before init
     * If the param is 'nodebug' => not show the debug.
     * If the param is 'debug' => show debug
     * and the next time access the page (without closing the current page), we don't need the param anymore to show the FE Debug
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


/**
 * Private class Controller
 * This class will hold instances of the library's objects
 */
class Controller{
    constructor(){
        this.instances = [];
    }

    add(slider){
        this.instances.push(slider);
    }

    get(id){
        return this.instances.filter(instance => instance.id === id)[0];
    }
}


/**
 * Public library data
 * access via window.FrontendDebugController
 */
window.FrontendDebugController = new Controller();


/**
 * Public library object
 * access via window.FrontendDebug
 */
window.FrontendDebug = {
    // init new instances
    init: (options = {}) => {
        new FrontEndDebug();
    },
    // Get instance object by ID
    get: id => window.FrontendDebugController.get(id)
};