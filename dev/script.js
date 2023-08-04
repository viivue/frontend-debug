// style
import '@viivue/atomic-css';
import 'honcau';
//import './style.scss';

// source script
import '@/_index';
import {addClass, removeClass} from "@/utils";

// import package info
const packageInfo = require('../package.json');

/**
 * Update HTML
 */
// update title
const title = `${packageInfo.prettyName} v${packageInfo.version}`;
document.title = `${title} - ${packageInfo.description}`;
document.querySelector('[data-title]').innerHTML = title;
document.querySelector('[data-description]').innerHTML = packageInfo.description;


// test update body class
let testIndex = 0, bodyEl = document.querySelector('body');
setInterval(() => {
    removeClass(bodyEl, `test-class-${testIndex}`);

    testIndex += 1;
    addClass(bodyEl, `test-class-${testIndex}`);
}, 3000);