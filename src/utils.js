/**
 * Debounce (ignore all, run the last)
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * @param func
 * @param timeout
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(func, timeout = 150){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}


/**
 * Debounce leading (run the first, ignore the rest)
 * https://www.freecodecamp.org/news/javascript-debounce-example/
 * @param func
 * @param timeout
 * @returns {(function(...[*]): void)|*}
 */
export function debounceLeading(func, timeout = 150){
    let timer;
    return (...args) => {
        if(!timer){
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
}


/**
 * Get array with unique values
 * https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
 * @param array
 * @returns {*}
 */
export function arrayUnique(array){
    function onlyUnique(value, index, self){
        return self.indexOf(value) === index;
    }

    return array.filter(onlyUnique);
}


/**
 * Sort array of integers
 * @param array
 * @param asc
 * @returns {*}
 */
export function arraySortInteger(array, asc = true){
    return array.sort(function(a, b){
        return asc ? a - b : b - a;
    });
}


/**
 * Set CSS
 * @param el
 * @param props
 */
export function setCSS(el, props){
    (el.length ? el : [el]).forEach(item => item && item.style ? Object.assign(item.style, props) : '');
}

export function hasClass(el, className){
    el.classList.contains(className);
}

export function addClass(el, className){
    (el.length ? el : [el]).forEach(item => item?.classList.add(className));
}

export function removeClass(el, className){
    (el.length ? el : [el]).forEach(item => item?.classList.remove(className));
}

/**
 * Console log
 * @param context
 * @param status
 * @param message
 */
export function log(context, status, ...message){
    if(context.options.dev){
        console?.[status](...message);
    }
}


/**
 * Generate unique ID
 */
export function uniqueId(prefix = ''){
    return prefix + (+new Date()).toString(16) +
        (Math.random() * 100000000 | 0).toString(16);
}


/**
 * Scroll position
 * @returns {{top: number, left: number}}
 */
export const scroll = () => {
    return {
        left: (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0),
        top: (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0)
    };
};

/**
 * Viewport size
 * @returns {{w: number, h: number}}
 */
export const viewport = () => {
    return {
        w: (window.innerWidth || document.documentElement.clientWidth),
        h: (window.innerHeight || document.documentElement.clientHeight)
    };
};

export const round = (number = 0, fractionDigits = 2) => {
    return parseFloat(number.toFixed(fractionDigits));
};

/**
 * Get parameter from URL
 * @param param
 * @param url
 * @returns {*}
 */
export const getUrlParam = (param, url = window.location.href) => {
    return new URL(url).searchParams.get(param);
};

/**
 * Append HTML
 * @param element
 * @param html
 * @returns {*}
 */
export const append = (element, html) => {
    element.insertAdjacentHTML('beforeend', html);
};


/**
 * Create DOM el
 * @param tag
 * @param className
 * @returns {HTMLDivElement}
 */
export const createEl = ({tag = 'div', className = ''}) => {
    const el = document.createElement(tag);

    if(className.length){
        el.classList.add(className);
    }

    return el;
};