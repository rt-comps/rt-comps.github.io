// ================================================================
// === item-line

// get component name from directory name
const [compName] = rtlib.parseCompURL(import.meta.url);

// Define the element usin the template in the associated .html file
customElements.define(compName,
    class extends rtBC.RTBaseClass {
        /// ### PRIVATE CLASS FIELDS
        #_sR;       // Shadow Root node
        #_menuNode  // Top level node 
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Initialise 'this'
            super();
            // Attach shadowDOM and store reference in private field
            this.#_sR = this.attachShadow({ mode: "open" });
            // Attach contents of template - placed in document.head by LoadComponent()
            this.#_sR.append(this.$getTemplate());

            // Set maximum value
            this.maxCount = 10;

            //### Event Listeners
            // Respond to 
            this.addEventListener('updatecountline', (e) => this.#updateCount(e));
        }

        //--- connectedCallback
        connectedCallback() {
            // Look for and pull in external style definition
            if (typeof rtForm !== 'undefined') {
                this.#_menuNode = rtForm.findNode(this);
                if (this.#_menuNode) rtForm.getStyle(this, this.#_menuNode);
            }
            // Display price in Euro
            this.#_sR.querySelector('#prijs').innerHTML = `${this.$euro((parseInt(this.$attr('prijs')) / 100))}`;
        }
        //+++ End of Lifecycle Events

        //--- updateCount
        // Respond to plus or minus event update count as required
        #updateCount(e) {
            if (e instanceof Event) {
                e.stopImmediatePropagation();

                // Get current node of count
                const _count = this.#_sR.querySelector('span#count');
                // Declare new value
                let newCount;
                if (e.detail.replace) {
                    // Set new value  to replaced value
                    newCount = e.detail.change;
                } else {
                    // Set new value to the adjusted value
                    newCount = parseInt(_count.textContent) + e.detail.change;
                }
                // Check boundaries
                switch (true) {
                    case (newCount > this.maxCount):
                        newCount = this.maxCount;
                        break;
                    case (newCount < 0):
                        newCount = 0;
                }
                // Write back new value
                _count.textContent = `${newCount}`;
                /// Check if newCount matches value in the cart
                // Get current cart contents in JSON 
                const currentCart = JSON.stringify(this.#_menuNode._cartExposed)
                // Is prodid already in cart?
                const inCart = currentCart.includes(this.$attr('prodid'));
                // Is prodid in cart with matching count
                const objMatch = currentCart.includes(JSON.stringify({ prodID: this.$attr('prodid'), count: newCount }));
                // Determine when an entry has been updated
                switch (true) {
                    case (newCount > 0 && !inCart):
                    case (inCart && !objMatch):
                    case (newCount === 0 && inCart):
                        this.setAttribute('updated', '');
                        break;
                    default:
                        this.removeAttribute('updated');
                }
                // Handle style change and count attribute for zero/non-zero values
                if (newCount > 0) {
                    // Highlight line and make count available in LightDOM
                    this.#_sR.querySelector('#container').style.fontWeight = 'bold';
                    this.setAttribute('count', `${newCount}`);
                } else {
                    // Undo above
                    this.#_sR.querySelector('#container').style.fontWeight = '';
                    this.removeAttribute('count');
                }
                // Determine whether 'Update' button in dialog should be visible
                this.$dispatch({ name: 'updatecount' })
            }
        }
        //--- End of updateCount
    }
);