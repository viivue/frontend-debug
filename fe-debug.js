;(function($, window, document, undefined){
    class FrontEndDebug{
        constructor(){
            // validate
            this.debugContainer = $('#fe-debug');
            if(!this.validate()) return false;

            // data
            this.lastScrollPosition = this.scroll().top;
            this.maxSpeed = 0;
            this.lastSpeed = 0;
            this.averageSpeed = 0;

            this.lastSpeedCount = 0;
            this.lastSpeedTotal = 0;

            this.stats = [
                {
                    slug: 'scroll-amount',
                    label: 'Scroll amount: [value]',
                    value: () => this.round(this.scroll().top)
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

                        return this.round(this.lastSpeed);
                    }
                },
                {
                    slug: 'average-speed',
                    label: 'Avg. speed: [value]',
                    value: () => {
                        this.averageSpeed = this.lastSpeedTotal / this.lastSpeedCount;
                        return this.round(this.averageSpeed);
                    }
                },
                {
                    slug: 'max-speed',
                    label: 'Max speed: [value]',
                    value: () => {
                        this.maxSpeed = Math.max(this.maxSpeed, this.lastSpeed);
                        return this.round(this.maxSpeed);
                    }
                },
                {
                    separator: true,
                    slug: 'viewport',
                    label: 'Viewport: [value]',
                    value: () => `${this.viewport().w}/${this.viewport().h}`
                },

                {
                    slug: 'document',
                    label: 'Document: [value]',
                    value: () => `${document.body.clientWidth}/${document.body.clientHeight}`
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

        updateStats(){
            // exit if scroll position not moving
            if(this.lastScrollPosition === this.scroll().top) return;

            // loop through all stats
            for(const item of this.stats){
                this.debugContainer.find(`[data-fe-debug="${item.slug}"]`).html(item.label.replace('[value]', item.value()));
            }

            this.lastScrollPosition = this.scroll().top;
        }

        generateHTML(){
            $('body').prepend('<div id="fe-debug"></div>');
            this.debugContainer = $('#fe-debug');

            // append stats
            for(const item of this.stats){
                const $stats = this.debugContainer.find(`[data-fe-debug="${item.slug}"]`);
                if(!$stats.length){
                    // append new
                    this.debugContainer.append(`<div data-fe-debug="${item.slug}">${item.label.replace('[value]', item.value())}</div>`);
                    const $item = this.debugContainer.find(`[data-fe-debug="${item.slug}"]`);

                    // apply styling
                    if(typeof item.separator === 'boolean' && item.separator === true){
                        // separator with border top
                        $item.css({
                            borderTop: '1px solid rgba(255,255,255,0.3)',
                            paddingTop: '3px',
                            marginTop: '3px'
                        });
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
                padding: '10px',
                borderRadius: '0 10px 0 0',
                backdropFilter: 'blur(5px)',
            });
        }


        /**
         * Validate before init
         * @returns {boolean}
         */
        validate(){
            // stop debug
            const isStopDebug = window.location.search.indexOf('stopdebug') !== -1;
            if(isStopDebug){
                sessionStorage.removeItem("FrontEndDebug");
                return false;
            }

            const isDebug = window.location.search.indexOf('debug') !== -1;
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
                        console.warn('FrontEndDebug enabled via session storage. Close tab or add ?stopdebug to clear session.');
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
    }

    new FrontEndDebug();
})(jQuery, window, document);