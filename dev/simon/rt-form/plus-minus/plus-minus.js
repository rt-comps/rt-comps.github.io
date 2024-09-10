// ================================================================
// === plus-minus

// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

// Define the element usin the template in the associated .html file
customElements.define(
    compName,
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

            // Check for custom colours.  1st colour is used for background and 2nd (if specified) for foreground
            const colors = this.attributes['colors'];
            if (colors) {
                // Get custom colour(s)
                const [custBgCol, custCol] = colors.value.split(',');
                // Get handle to container (only DIV in SR)
                const _div = this.#_sR.querySelector('div');
                // Apply custom colours to DIV
                _div.style.color = custCol || '';
                _div.style.backgroundColor = custBgCol || '';
            }

            const externalStyle = rtForm ? rtForm.getStyle(this, compName) : null;
            if (externalStyle) this.#_sR.querySelector('#container').insertAdjacentElement('beforebegin', externalStyle.cloneNode(true));

            // Add onClick events to plus and minus
            this.#_sR.querySelector('#plus').addEventListener('click', () => this.#buttonPressed(1));
            this.#_sR.querySelector('#minus').addEventListener('click', () => this.#buttonPressed(-1));
        }

        connectedCallback() {
            setTimeout(() => {
                // Change quantity number position if specified
                const pos = getComputedStyle(this).getPropertyValue('--OF-PM-POS');
                console.log(pos)
                if (pos.toLowerCase() === 'left')
                    this.#_sR.querySelector('div').insertAdjacentElement('afterbegin', this.#_sR.querySelector('slot'));
                if (pos.toLowerCase() === 'right')
                    this.#_sR.querySelector('div').insertAdjacentElement('beforeend', this.#_sR.querySelector('slot'));
            });
        }
        //+++ End Of Lifecycle Events

        //--- #buttonPressed
        // Respond to plus or minus being pressed to create an event to bubble up to parent
        #buttonPressed(value) {
            this.$dispatch({ name: 'updatecount', detail: { change: value } });
        }
    }
);