import {getDiffTime, getRealTime} from "./upTime";

export function initTiming(context){
    context.addRecord({
        separator: true,
        slug: 'on-this-page',
        label: 'On this page: [value]',
        value: () => `${getRealTime(Date.now())}`,
        on: ['raf']
    });

    context.addRecord({
        slug: 'time',
        label: 'Uptime: [value]',
        value: () => `${getDiffTime(Date.now())}`,
        on: ['raf']
    });
}