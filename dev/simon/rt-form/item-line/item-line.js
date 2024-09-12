// ================================================================
// === item-line

// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

// Define the element usin the template in the associated .html file
customElements.define(compName,
    class extends rtBC.RTBaseClass {
        /// ### PRIVATE CLASS FIELDS
        #_sR;   // Shadow Root node

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
            //___ updateCount
            this.addEventListener('updatecount', (e) => this.#updateCount(e));
        }
        
        //--- connectedCallback
        connectedCallback() {
            // Look for and pull in external style definition
            if (rtForm) rtForm.getStyle(this, compName);
    
            this.#_sR.querySelector('#prijs').innerHTML = `${this.$euro((parseInt(this.$attr('prijs')) / 100))}`;
        }
        //+++ End of Lifecycle Events

        //--- updateCount
        // Respond to plus or minus event update count as required
        #updateCount(e) {
            const _count = this.#_sR.querySelector('#count');
            let currentCount;
            if (_count) {
                if (e.detail.replace) {
                    currentCount = e.detail.change;
                } else {
                    // Get the current value
                    currentCount = parseInt(_count.innerHTML);
                    // Adjust the value
                    currentCount += e.detail.change;
                    // Check boundaries
                    if (currentCount > this.maxCount || currentCount < 0) currentCount = 0;
                }
                // Write back new value
                _count.innerHTML = `${currentCount}`;
                this.setAttribute('count', currentCount)
                // Handle style change for zero/non-zero
                if (currentCount > 0) {
                    // Highlight line and make count available in LightDOM
                    this.#_sR.querySelector('#container').style.fontWeight = 'bold';
                } else {
                    // Undo above
                    this.#_sR.querySelector('#container').style.fontWeight = '';
                }
            };
        }
        //--- End of updateCount
    }
);