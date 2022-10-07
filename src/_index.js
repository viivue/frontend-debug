import {uniqueId} from "@/utils";


/**
 * Private class
 */
class FrontEndDebug{
    constructor(){
        // validate
        this.debugContainer = $('#fe-debug');
        if(!this.validate()) return false;

        // data
        this.version = '0.0.1';
        this.lastScrollPosition = this.scroll().top;
        this.maxSpeed = 0;
        this.lastSpeed = 0;
        this.averageSpeed = 0;

        this.lastSpeedCount = 0;
        this.lastSpeedTotal = 0;

        this.memory = {};
        this.indicateTime = parseInt(this.getUrlParam('debug')) || parseInt(sessionStorage.getItem("FrontEndDebugIndicateTime")) || 500;
        sessionStorage.setItem("FrontEndDebugIndicateTime", this.indicateTime);

        this.stats = [
            {
                slug: 'scroll',
                label: 'Scroll: [value]',
                value: () => {
                    const direction = this.lastScrollPosition > this.scroll().top ? '⏫' : '⏬';
                    const progress = this.round(this.scroll().top / (document.body.clientHeight - this.viewport().h), 3);
                    return `${this.indicate(this.round(this.scroll().top), 'scrollAmount')} ${direction} ${this.indicate(progress, 'progress')}`;
                }
            },
            {
                separator: true,
                slug: 'speed',
                label: 'Speed: [value]',
                value: () => {
                    this.lastSpeed = Math.abs(this.lastScrollPosition - this.scroll().top);

                    // for avg. speed
                    this.lastSpeedCount++;
                    this.lastSpeedTotal += this.lastSpeed;

                    return this.indicate(this.round(this.lastSpeed), 'lastSpeed');
                }
            },
            {
                slug: 'average-speed',
                label: 'Avg. speed: [value]',
                value: () => {
                    // only update if changes
                    if(this.lastScrollPosition !== this.scroll().top){
                        this.averageSpeed = this.lastSpeedTotal / this.lastSpeedCount;
                    }

                    return this.indicate(this.round(this.averageSpeed), 'averageSpeed');
                }
            },
            {
                slug: 'max-speed',
                label: 'Max speed: [value]',
                value: () => {
                    this.maxSpeed = Math.max(this.maxSpeed, this.lastSpeed);
                    return this.indicate(this.round(this.maxSpeed), 'maxSpeed');
                }
            },
            {
                separator: true,
                slug: 'viewport',
                label: 'Viewport: [value]',
                value: () => `${this.indicate(this.viewport().w, 'viewportWidth')}/${this.indicate(this.viewport().h, 'viewportHeight')}`
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
        }
        window.requestAnimationFrame(onUpdate);
    }

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

    updateStats(){
        // loop through all stats
        for(const item of this.stats){
            this.debugContainer.find(`[data-fe-debug="${item.slug}"]`).html(item.label.replace('[value]', item.value()));
        }

        this.lastScrollPosition = this.scroll().top;
    }

    generateHTML(){
        $('body').prepend(`<div id="fe-debug"><div class="head"><span>Debug UI v${this.version}</span><button style="background-color:transparent">🔻</button></div></div>`);
        this.debugContainer = $('#fe-debug');

        // append stats
        for(const item of this.stats){
            const $stats = this.debugContainer.find(`[data-fe-debug="${item.slug}"]`);
            if(!$stats.length){
                // append new
                this.debugContainer.append(`<div style="display:none" data-fe-debug="${item.slug}">${item.label.replace('[value]', item.value())}</div>`);
                const $item = this.debugContainer.find(`[data-fe-debug="${item.slug}"]`);

                // apply styling
                if(typeof item.separator === 'boolean' && item.separator === true){
                    // separator with border top
                    $item.addClass('sep');
                }
            }
        }

        // apply styling
        this.debugContainer.css({
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
        this.debugContainer.find('.head').css({
            padding: '3px 10px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        });
        this.debugContainer.find('[data-fe-debug]').css({padding: '0 10px'});
        this.debugContainer.find('.head + [data-fe-debug]').css({paddingTop: '5px'});
        this.debugContainer.find('[data-fe-debug]:last-child').css({paddingBottom: '5px'});
        this.debugContainer.find('.sep').css({
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '5px',
            marginTop: '5px'
        });
        const $closeButton = this.debugContainer.find('.head button');
        $closeButton.css({
            backgroundColor: 'rgba(0,0,0,0)',
            color: '#fff',
            marginLeft: '10px',
            padding: '3px',
        });

        // dialog open
        const toggleDialog = () => {
            if(this.isDialogOpen === true || this.isDialogOpen === 'true'){
                this.debugContainer.find('[data-fe-debug]').show();
                $closeButton.text('🔻');
            }else{
                this.debugContainer.find('[data-fe-debug]').hide();
                $closeButton.text('🔺');
            }
            sessionStorage.setItem("FrontEndDebugOpen", this.isDialogOpen);
        }

        // on init
        this.isDialogOpen = sessionStorage.getItem("FrontEndDebugOpen") === null ? true : sessionStorage.getItem("FrontEndDebugOpen");
        toggleDialog();

        // on toggle
        $closeButton.on('click', () => {
            this.isDialogOpen = !this.isDialogOpen;
            toggleDialog();
        });
    }


    /**
     * Validate before init
     * @returns {boolean}
     */
    validate(){
        // stop debug
        const isStopDebug = this.getUrlParam('nodebug') !== null;
        if(isStopDebug){
            sessionStorage.removeItem("FrontEndDebug");
            return false;
        }

        const isDebug = this.getUrlParam('debug') !== null;
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

    /**
     * Scroll position
     * @returns {{top: number, left: number}}
     */
    scroll(){
        return {
            left: (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0),
            top: (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
        };
    }

    /**
     * Viewport size
     * @returns {{w: number, h: number}}
     */
    viewport(){
        return {
            w: (window.innerWidth || document.documentElement.clientWidth),
            h: (window.innerHeight || document.documentElement.clientHeight)
        };
    }

    round(number = 0, fractionDigits = 2){
        return parseFloat(number.toFixed(fractionDigits));
    }

    /**
     * Get parameter from URL
     * @param param
     * @param url
     * @returns {*}
     */
    getUrlParam(param, url = window.location.href){
        return new URL(url).searchParams.get(param);
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

window.FrontendDebug.init();