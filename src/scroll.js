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


    context.add({
        slug: 'scroll',
        label: 'Scroll: [value]',
        value: () => {
            const direction = context.lastScrollPosition > scroll().top ? '⏫' : '⏬';
            const progress = round(scroll().top / (document.body.clientHeight - viewport().h), 3);
            return `${context.indicate(round(scroll().top), 'scrollAmount')} ${direction} ${context.indicate(progress, 'progress')}`;
        }
    });

    context.add({
        separator: true,
        slug: 'speed',
        label: 'Speed: [value]',
        value: () => {
            lastSpeed = Math.abs(context.lastScrollPosition - scroll().top);

            // for avg. speed
            lastSpeedCount++;
            lastSpeedTotal += lastSpeed;

            return context.indicate(round(lastSpeed), 'lastSpeed');
        }
    });

    context.add({
            slug: 'average-speed',
            label: 'Avg. speed: [value]',
            value: () => {
                // only update if changes
                if(context.lastScrollPosition !== scroll().top){
                    averageSpeed = lastSpeedTotal / lastSpeedCount;
                }

                return context.indicate(round(averageSpeed), 'averageSpeed');
            }
        }
    );

    context.add({
        slug: 'max-speed',
        label: 'Max speed: [value]',
        value: () => {
            maxSpeed = Math.max(maxSpeed, lastSpeed);
            return context.indicate(round(maxSpeed), 'maxSpeed');
        }
    });

    context.add({
        separator: true,
        slug: 'scroll-bottom',
        label: 'Scroll to bottom: [value]',
        value: () => `${scrollObject.scroll(2, 'Slow')} - ${scrollObject.scroll(10, 'Normal')} - ${scrollObject.scroll(20, 'Fast')}`,
        isNotChange: true,
    });
}