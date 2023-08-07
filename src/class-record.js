import {append} from "./utils";

export class Record{
    constructor(context, options){
        this.options = {
            slug: undefined, // required, unique
            label: '', // 'Scroll: [value]',
            value: () => {
            }, // function to update value
            on: [], // when to update value: raf, scroll

            ...options
        };
        if(!this.options.slug){
            console.warn(`Missing slug`);
            return;
        }
        this.key = this.options.slug;


        // append record node
        const stats = context.debugContainer.querySelectorAll(`[data-fe-debug="${this.options.slug}"]`);
        if(!stats.length){
            // append new
            append(context.debugContainer, `<div style="display:none" data-fe-debug="${this.options.slug}">${this.options.label.replace('[value]', this.options.value())}</div>`);
            const itemEl = context.debugContainer.querySelector(`[data-fe-debug="${this.options.slug}"]`);

            // apply styling
            if(typeof this.options.separator === 'boolean' && this.options.separator === true){
                // separator with border top
                itemEl.classList.add('sep');
            }

            this.node = itemEl;
        }


        // run update by events
        this.options.on.forEach(type => {
            context.on(type, () => {
                this.updateStats();
            });
        });
    }

    resetValue(){
        console.log('reset', this.key, this)
    }

    /**
     * Update stats of each value when frame reset
     */
    updateStats(){
        // Render new value
        this.node.innerHTML = this.options.label.replace('[value]', this.options.value());

        /* If stat doesn't need to update and already has value => remove */
        //if(this.options.isNotChange && value) arr.splice(index);
    }
}