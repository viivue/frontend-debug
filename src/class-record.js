import {round, scroll, viewport} from "@/utils";

export class Record{
    constructor(context, options){
        this.context = context;
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


        // run update by events
        this.options.on.forEach(type => {
            context.on(type, () => {
                this.updateStats();
            });
        });
    }

    resetValue(){
        console.log('reset', this.key)
    }

    /**
     * Update stats of each value when frame reset
     */
    updateStats(item){
        item = this.options;
        const node = this.context.debugContainer.querySelector(`[data-fe-debug="${item.slug}"]`);

        // Render new value
        node.innerHTML = item.label.replace('[value]', item.value());

        /* If stat doesn't need to update and already has value => remove */
        //if(item.isNotChange && value) arr.splice(index);
    }
}