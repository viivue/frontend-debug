export function fireRaf(context){
    // update using rAF
    const onUpdate = () => {
        // fire an event
        context.events.fire('onRaf');
        window.requestAnimationFrame(onUpdate);
    };
    window.requestAnimationFrame(onUpdate);
}


export function fireScroll(context){
    window.addEventListener('scroll', () => {
        context.events.fire('onScroll');
    });
}