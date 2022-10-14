import {append, setCSS} from "./utils";

/**
 * Generate FE Debug HTML
 */
export function generateHTML(context){
    /**
     * Wrapper HTML
     */

    append(document.querySelector('body'), `<div id="fe-debug"><div class="head"><span>${context.packageInfo.prettyName} v${context.packageInfo.version}</span><button style="background-color:transparent">🔻</button></div></div>`);
    context.debugContainer = document.querySelector('#fe-debug');

    // append stats
    for(const item of context.stats){
        const stats = context.debugContainer.querySelectorAll(`[data-fe-debug="${item.slug}"]`);
        if(!stats.length){
            // append new
            append(context.debugContainer, `<div style="display:none" data-fe-debug="${item.slug}">${item.label.replace('[value]', item.value())}</div>`);
            const itemEl = context.debugContainer.querySelector(`[data-fe-debug="${item.slug}"]`);

            // apply styling
            if(typeof item.separator === 'boolean' && item.separator === true){
                // separator with border top
                itemEl.classList.add('sep');
            }
        }
    }

    /**
     * Styling
     */

    // apply styling
    setCSS(context.debugContainer, {
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
        minWidth: '175px',
        maxWidth: '300px'
    });
    context.debugContainer.querySelectorAll('.head').forEach(node => {
        setCSS(node, {
            padding: '3px 10px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        });
    });
    context.debugContainer.querySelectorAll('[data-fe-debug]').forEach(node => {
        setCSS(node, {padding: '0 10px'});
    });
    context.debugContainer.querySelectorAll('.head + [data-fe-debug]').forEach(node => {
        setCSS(node, {paddingTop: '5px'});
    });
    context.debugContainer.querySelectorAll('[data-fe-debug]:last-child').forEach(node => {
        setCSS(node, {paddingBottom: '5px'});
    });
    context.debugContainer.querySelectorAll('.sep').forEach(node => {
        setCSS(node, {
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '5px',
            marginTop: '5px'
        });
    });


    /**
     * Toggle dialog
     */

    const closeButton = context.debugContainer.querySelector('.head button');
    setCSS(closeButton, {
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#fff',
        marginLeft: '10px',
        padding: '3px',
    });


    // dialog open
    const toggleDialog = () => {
        if(context.isDialogOpen === true || context.isDialogOpen === 'true'){
            context.debugContainer.querySelectorAll('[data-fe-debug]').forEach(node => setCSS(node, {display: 'block',}));
            closeButton.textContent = '🔻';
        }else{
            context.debugContainer.querySelectorAll('[data-fe-debug]').forEach(node => setCSS(node, {display: 'none',}));
            closeButton.textContent = '🔺';
        }
        sessionStorage.setItem("FrontEndDebugOpen", context.isDialogOpen);
    };

    // on init
    context.isDialogOpen = sessionStorage.getItem("FrontEndDebugOpen") === null ? true : sessionStorage.getItem("FrontEndDebugOpen");
    toggleDialog();

    // on toggle
    const head = context.debugContainer.querySelector('.head');
    setCSS(head, {'cursor': 'pointer'});
    head.addEventListener('click', () => {
        context.isDialogOpen = !context.isDialogOpen;
        toggleDialog();
    });
}