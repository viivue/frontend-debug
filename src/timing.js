import {getDiffTime, getRealTime} from "./upTime";

export function initTiming(context){
    context.addStat({
        separator: true,
        slug: 'on-this-page',
        label: 'On this page: [value]',
        value: () => `${getRealTime(Date.now())}`,
    });

    context.addStat({
        slug: 'time',
        label: 'Uptime: [value]',
        value: () => `${getDiffTime(Date.now())}`,
    });
}