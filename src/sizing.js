import {viewport} from "./utils";
import {getAddressBarHeight} from "./address-bar";

// todo: view/document not return to default state with indicate()
export function initSizing(context){
    context.addStat({
            separator: true,
            slug: 'viewport',
            label: 'Viewport: [value]',
            value: () => `${context.indicate(viewport().w, 'viewportWidth')}/${context.indicate(viewport().h, 'viewportHeight')}`
        }
    );

    context.addStat({
        slug: 'document',
        label: 'Document: [value]',
        value: () => `${context.indicate(document.body.clientWidth, 'clientWidth')}/${context.indicate(document.body.clientHeight, 'clientHeight')}`
    });

    let addressBarSize = 0;
    context.addStat({
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