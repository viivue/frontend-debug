import {getDiffTime, getRealTime} from "./upTime";

export function initTiming(context){
    context.addRecord({
        separator: true,
        slug: 'on-this-page',
        label: 'On this page: [value]',
        ref: {'on-page': () => `${getRealTime(Date.now())}`},
        value: '{on-page}',
        on: ['raf'],
        highlight: false
    });

    context.addRecord({
        slug: 'time',
        label: 'Uptime: [value]',
        ref: {'uptime': () => `${getDiffTime(Date.now())}`},
        value: `{uptime}`,
        on: ['raf'],
        highlight: false
    });
}