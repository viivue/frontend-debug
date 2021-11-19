;(function($, window, document, undefined){
    class FrontEndDebug{
        constructor(){
            if(!this.validate()) return false;

            this.generateHTML();
            const $window = $(window);
            const $wrapper = $('#fe-debug');
            let lastScrollPosition = this.scroll().top;

            const onUpdate = () => {
                window.requestAnimationFrame(onUpdate);
                const newPosition = this.scroll().top;
                if(lastScrollPosition === newPosition) return;
                const deviation = Math.abs(lastScrollPosition - newPosition);
                lastScrollPosition = newPosition;

                const scrollAmount = $window.scrollTop();
                $wrapper.find('[data-fe-debug="scroll-amount"]').text(this.scroll().top)
                $wrapper.find('[data-fe-debug="deviation"]').text(deviation);
            }

            window.requestAnimationFrame(onUpdate);


            console.log('FrontEndDebug enabled!');
        }

        generateHTML(){
            $('body').append('<div id="fe-debug">' +
                '<div>Scroll amount: <span data-fe-debug="scroll-amount"></span></div>' +
                '<div>Deviation: <span data-fe-debug="deviation"></span></div>' +
                '</div>');
        }

        /**
         * Validate before init
         * @returns {boolean}
         */
        validate(){
            return window.location.search.indexOf('debug') === -1;
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
    }

    new FrontEndDebug();
})(jQuery, window, document);