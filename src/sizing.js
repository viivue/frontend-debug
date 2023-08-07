import {viewport} from "./utils";
import {getAddressBarHeight} from "./address-bar";

// todo: view/document not return to default state with indicate()
export function initSizing(context){
    context.addRecord({
            separator: true,
            slug: 'viewport',
            label: 'Viewport: [value]',
            value: () => `${context.indicate(viewport().w, 'viewportWidth', 'viewport')}/${context.indicate(viewport().h, 'viewportHeight', 'viewport')}`,
            on: ['resize']
        }
    );

    context.addRecord({
        slug: 'document',
        label: 'Document: [value]',
        value: () => `${context.indicate(document.body.clientWidth, 'clientWidth', 'document')}/${context.indicate(document.body.clientHeight, 'clientHeight', 'document')}`,
        on: ['resize']
    });

    let addressBarSize = 0;
    context.addRecord({
        slug: 'address-bar',
        label: 'Address bar: [value]',
        value: () => {
            const newAddressBarHeight = getAddressBarHeight();
            if(newAddressBarHeight > addressBarSize){
                addressBarSize = newAddressBarHeight;
            }

            // todo: update on scroll
            return addressBarSize;
        },
        on: ['resize']
    });
}