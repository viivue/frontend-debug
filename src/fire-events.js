export function setupEventsFire(context){
    fireRaf(context);

    window.addEventListener('scroll', () => {
        context.events.fire('onScroll');
    });

    window.addEventListener('resize', () => {
        context.events.fire('onResize');
    });

    window.addEventListener('load', () => {
        context.events.fire('onLoad');
    });
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