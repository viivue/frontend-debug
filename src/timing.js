import {getDiffTime, getRealTime} from "./upTime";

export function initTiming(context){
    context.add({
        separator: true,
        slug: 'on-this-page',
        label: 'On this page: [value]',
        value: () => `${getRealTime(Date.now())}`,
    });

    context.add({
        slug: 'time',
        label: 'Uptime: [value]',
        value: () => `${getDiffTime(Date.now())}`,
    });
}