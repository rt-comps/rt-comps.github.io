// ================================================================
// === dp-date class definition

// Recover component name from URL
const [compName] = rtlib.parseCompURL(import.meta.url);

// Remove enclosing component from compName
customElements.define(compName.slice(compName.lastIndexOf('/') + 1),
    class extends rtBC.RTBaseClass {
        #_div;

        //+++ Lifecycle Events
        //--- constructor
        constructor() {
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());
            this.#_div = this.shadowRoot.querySelector('div');
            console.log(this.#_div)
        }

        connectedCallback() {
            // Set arrow text
            if (this.id === 'al') {
                this.#_div.innerHTML = '&lt;';
                this.#_div.style.borderRight = '1px solid black';
                this.#_div.style.paddingRight = '3px';
            } else this.#_div.innerHTML = '&gt;';
            // Get maxWeek value from parent
            console.log('this.parentNode._maxWeek: ', this.parentNode._maxWeek)
            console.log('this.parentNode._week: ',this.parentNode._week);
            this.#render();

            // Listen for events on the Event Bus (parent node)
            this.parentNode.addEventListener('changeWeek', this.#render);
        }

        #render() {
            // Change the colour of the arrows to reflect limits
            if ((this.id === 'al' && this.parentNode._week === 0) || (this.id === 'ar' && this.parentNode._week === this.parentNode._maxWeek)) this.#_div.classList.add('disabled');
            else this.#_div.classList.remove('disabled');
            // this.style.color = ((this.id === 'al' && this.$week === 0) || (this.id === 'ar' && this.$week === this.#_maxWeek)) ? '#CCCCCC' : '#000000';
        }

        // #changeWeek(e) {
        //     // Modify the week value, respecting limits
        //     this.$week += e.detail.change;
        //     console.log('week: ', this.$week);
        //     console.log('max week: ', this.#_maxWeek);
        //     if (this.$week < 0) this.$week = 0;
        //     if (this.$week > this.#_maxWeek) this.$week = this.#_maxWeek;
        //     this.#render();
        // }

    }
);
