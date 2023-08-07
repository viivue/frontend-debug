import {viewport} from "./utils";
import {getAddressBarHeight} from "./address-bar";

export function initSizing(context){
    context.addRecord({
            separator: true,
            slug: 'viewport',
            label: 'Viewport: [value]',
            ref: {
                'viewportWidth': () => viewport().w,
                'viewportHeight': () => viewport().h,
            },
            value: `{viewportWidth}/{viewportHeight}`,
            on: ['resize', 'load']
        }
    );

    context.addRecord({
        slug: 'document',
        label: 'Document: [value]',
        ref: {
            'clientWidth': () => document.body.clientWidth,
            'clientHeight': () => document.body.clientHeight,
        },
        value: `{clientWidth}/{clientHeight}`,
        on: ['resize', 'load']
    });

    let addressBarSize = 0;
    context.addRecord({
        slug: 'address-bar',
        label: 'Address bar: [value]',
        ref: {
            'addressBarSize': () => {
                const newAddressBarHeight = getAddressBarHeight();
                if(newAddressBarHeight !== addressBarSize){
                    addressBarSize = newAddressBarHeight;
                }

                return addressBarSize;
            }
        },
        value: `{addressBarSize}`,
        on: ['load', 'scroll', 'resize']
    });
}