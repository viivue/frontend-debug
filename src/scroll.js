import {round, scroll, viewport} from "./utils";

let windowScrollY = window.scrollY,
    timeout;

window.scrollBottom = (v) => {
    let time = 25;
    if(timeout) clearInterval(timeout);
    timeout = setInterval(() => {
        windowScrollY = window.scrollY;
        if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) clearTimeout(timeout);

        window.scrollBy({
            left: 0,
            top: v,
        });
    }, time);
};

window.addEventListener('scroll', () => {
    if(window.scrollY < windowScrollY){
        clearInterval(timeout);
    }
});

const scrollObject = {
    scroll: (v, title) => `<button onclick="scrollBottom(${v})">${title}</button>`,
};


export function initScroll(context){
    let maxSpeed = 0;
    let lastSpeed = 0;
    let averageSpeed = 0;

    let lastSpeedCount = 0;
    let lastSpeedTotal = 0;


    context.addRecord({
        slug: 'scroll',
        label: 'Scroll: [value]',
        ref: {
            'scrollAmount': () => round(scroll().top),
            'direction': () => context.lastScrollPosition > scroll().top ? '⏫' : '⏬',
            'progress': () => round(scroll().top / (document.body.clientHeight - viewport().h), 3)
        },
        value: `{scrollAmount} {direction} {progress}`,
        on: ['scroll']
    });

    context.addRecord({
        separator: true,
        slug: 'speed',
        label: 'Speed: [value]',
        ref: {
            'speed': () => {
                lastSpeed = Math.abs(context.lastScrollPosition - scroll().top);

                // for avg. speed
                lastSpeedCount++;
                lastSpeedTotal += lastSpeed;

                return round(lastSpeed);
            }
        },
        value: `{speed}`,
        on: ['scroll']
    });

    context.addRecord({
        slug: 'average-speed',
        label: 'Avg. speed: [value]',
        ref: {
            'avg-speed': () => {
                // only update if changes
                if(context.lastScrollPosition !== scroll().top){
                    averageSpeed = lastSpeedTotal / lastSpeedCount;
                }

                return round(averageSpeed);
            }
        },
        value: '{avg-speed}',
        on: ['raf']
    });

    context.addRecord({
        slug: 'max-speed',
        label: 'Max speed: [value]',
        ref: {
            'max': () => {
                maxSpeed = Math.max(maxSpeed, lastSpeed);
                return round(maxSpeed);
            }
        },
        value: '{max}',
        on: ['scroll']
    });

    context.addRecord({
        separator: true,
        slug: 'scroll-bottom',
        label: 'Scroll to bottom: [value]',
        value: () => `${scrollObject.scroll(2, 'Slow')} - ${scrollObject.scroll(10, 'Normal')} - ${scrollObject.scroll(20, 'Fast')}`,
    });
}