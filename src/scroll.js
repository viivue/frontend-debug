let windowScrollY = window.scrollY,
    timeout;

window.scrollBottom = (v) => {
    let time = 25;
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

export const scrollObject = {
    top: `<button onclick="scrollTop()">Scroll</button>`,
    bottom: (v) => `<button onclick="scrollBottom(${v})">Scroll</button>`
};