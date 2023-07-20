import {createEl} from "./utils";

/**
 * Get address bar height and update variable v0.0.1
 * https://stackoverflow.com/a/64836824/6453822
 */
export const getAddressBarHeight = () => {
    const pseudoDiv = createEl({tag: 'div', className: 'pseudo-address-bar-detector'});
    document.body.appendChild(pseudoDiv);

    Object.assign(pseudoDiv.style, {
        height: '100vh',
        width: 0,
        position: 'absolute',
        pointerEvents: 'none'
    });

    const actualHeight = window.innerHeight;
    const elementHeight = pseudoDiv.clientHeight;
    const barHeight = elementHeight - actualHeight;

    // remove from DOM
    pseudoDiv.remove();

    return barHeight;
}