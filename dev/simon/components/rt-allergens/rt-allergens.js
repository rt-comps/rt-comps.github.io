// ================================================================
// === <rt-allergen>
//
// ***Provide description of component function here***
// 
const [compName] = rtlib.parseCompURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        // Private Fields
        #_sR;

        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // No shadowRoot required so just need 'this'
            super();
            this.#_sR = this.attachShadow({ mode: "open" });
            this.#_sR.append(this.$getTemplate())

            // Slot element into footer
            this.setAttribute('slot', 'footer');

            //### Listeners
        }

        connectedCallback() {
            // Check 'types' has been provided
            if (this.hasAttribute('types')) {
                // Convert comma separated list in attribute to array and filter to remove any falsey values, eg "" 
                const allergens = this.getAttribute('types').split(',').filter(el => el);
                //  Check that the value of 'types' was not an empty string
                if (allergens.length > 0) {
                    // Add an 'al-allergen' node for each entry in array
                    this.append(...allergens.map(el => {
                        return this.$createElement({
                            tag: 'al-allergen',
                            attrs: {
                                id: el,
                            }
                        })
                    }))
                } else console.error('Provided allergens list is empty')
            } else console.error('Allergen "types" attribute not provided')
        }
        //+++ End OF Lifecycle Events

        // Put private and public methods HERE

    }
);