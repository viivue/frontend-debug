import {viewport} from "./utils";
import {getAddressBarHeight} from "./address-bar";

export function initSizing(context){
    context.add(
        {
            separator: true,
            slug: 'viewport',
            label: 'Viewport: [value]',
            value: () => `${context.indicate(viewport().w, 'viewportWidth')}/${context.indicate(viewport().h, 'viewportHeight')}`
        }
    );

    context.add({
        slug: 'document',
        label: 'Document: [value]',
        value: () => `${context.indicate(document.body.clientWidth, 'clientWidth')}/${context.indicate(document.body.clientHeight, 'clientHeight')}`
    });

    let addressBarSize = 0;
    context.add({
        slug: 'address-bar',
        label: 'Address bar: [value]',
        value: () => {
            const newAddressBarHeight = getAddressBarHeight();
            if(newAddressBarHeight > addressBarSize){
                addressBarSize = newAddressBarHeight;
            }

            // todo: update on scroll
            return addressBarSize;
        }
    });
}