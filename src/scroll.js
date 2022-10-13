export const scrollObject = {
    top: `<button onclick="scrollTop()">Scroll</button>`,
    bottom: `<button onclick="scrollBottom()">Scroll</button>`
};

window.scrollTop = () => {
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
    });
}
window.scrollBottom = () => {
    window.scrollTo({
        left: 0,
        top: document.scrollingElement.scrollHeight || document.body.scrollHeight,
        behavior: 'smooth'
    });
}

