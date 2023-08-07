import {append} from "./utils";

export class Record{
    constructor(context, options){
        this.options = {
            slug: undefined, // required, unique
            label: '', // 'Scroll: [value]',
            ref: {}, // ref object: refKey => callback()
            value: '', // template string or function, use {refKey} to show value from ref
            on: [], // when to update value: raf, scroll
            highlight: true, // highlight when value changed

            ...options
        };
        if(!this.options.slug){
            console.warn(`Missing slug`);
            return;
        }
        this.key = this.options.slug;


        // value
        this.valueMemory = [];
        this.prevValue = this.getValue();
        this.updateTimeout = null;


        // append record node
        const stats = context.debugContainer.querySelectorAll(`[data-fe-debug="${this.options.slug}"]`);
        if(!stats.length){
            // append new
            append(context.debugContainer, `<div style="display:none" data-fe-debug="${this.options.slug}">${this.options.label.replace('[value]', this.getValue())}</div>`);
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
            context.on(type, () => this.updateStats({type}));
        });
    }

    /**
     * Update stats of each value when frame reset
     */
    updateStats({type}){
        let newValue = this.getValue();

        // raf only run when value changed
        const isValueChanged = newValue !== this.prevValue;
        if(!isValueChanged && type === 'raf'){
            return;
        }

        //console.log(type, this.key)
        clearTimeout(this.updateTimeout);

        // Render new value
        this.node.innerHTML = this.options.label.replace('[value]', newValue);
        this.prevValue = newValue;

        // reset value after a delay
        this.updateTimeout = setTimeout(() => {
            newValue = this.getValue(false);
            this.node.innerHTML = this.options.label.replace('[value]', newValue);
            this.prevValue = newValue;
        }, 500);
    }


    /**
     * Get value with or without highlight
     * @param highlight
     * @returns {*}
     */
    getValue(highlight = true){
        let newValue = this.options.value;

        // useRef
        if(this.options.ref){
            for(let [key, valueFn] of Object.entries(this.options.ref)){
                // get value from ref
                let value = typeof valueFn === 'function' ? valueFn() : valueFn;

                // highlight new value if is changed
                if(this.options.highlight && highlight && value !== this.valueMemory[key]){
                    value = `<span style="color:#96cdff">${value}</span>`;
                }

                // save current value
                this.valueMemory[key] = value;

                // replace value to ref
                newValue = newValue.replace(`{${key}}`, `${value}`);
            }
        }

        return newValue;
    }
}