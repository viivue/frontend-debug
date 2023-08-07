export function setupEventsFire(context){
    fireRaf(context);
    fireScroll(context);
    fireResize(context);
}

function fireRaf(context){
    // update using rAF
    const onUpdate = () => {
        // fire an event
        context.events.fire('onRaf');
        window.requestAnimationFrame(onUpdate);
    };
    window.requestAnimationFrame(onUpdate);
}


function fireScroll(context){
    window.addEventListener('scroll', () => {
        context.events.fire('onScroll');
    });
}

function fireResize(context){
    window.addEventListener('resize', () => {
        context.events.fire('onResize');
    });
}