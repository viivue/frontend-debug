import {uniqueId} from "@/utils";


/**
 * Private class
 */
class FrontendDebug{
    constructor(options){
        this.id = uniqueId();
        this.options = {
            el: undefined,
            ...options
        };

        this.options.el.innerHTML = 'Hello!';
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
        const selector = options.selector || '[data-frontend-debug]';

        // init with selector
        document.querySelectorAll(selector).forEach(el => {
            window.FrontendDebugController.add(new FrontendDebug({el, ...options}));
        });
    },
    // Get instance object by ID
    get: id => window.FrontendDebugController.get(id)
};

window.FrontendDebug.init();