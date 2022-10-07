export const currentTime = Date.now();
export let time = currentTime;

/**
 * Format time depends on seconds
 * @param seconds
 * @returns string
 */
export const format = (time) => {
    const seconds = Math.round((time - currentTime) / 1000);

    const hour = ('0' + Math.floor(seconds / 3600)).slice(-2);
    const minute = ('0' + Math.floor((seconds % 3600) / 60)).slice(-2);
    const second = ('0' + Math.floor(((seconds % 3600) % 60))).slice(-2);
    return `${hour}:${minute}:${second}`
};
setInterval(() => {
    time = Date.now();
}, 1000)

