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

export const scrollObject = {
    scroll: (v, title) => `<button onclick="scrollBottom(${v})">${title}</button>`,
};