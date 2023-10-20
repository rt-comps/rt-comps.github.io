// ================================================================
// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        // Declare private class fields
        #_sR;
        #_lines;

        //+++ Lifecycle events
        //--- Contructor
        constructor() {
            // Initialise 'this'
            super();
            // Attach shadowDOM
            this.#_sR = this.attachShadow({ mode: "open" });
            // Attach contents of template placed in document.head
            this.#_sR.append(this.$getTemplate());

            // Create handle to slotted content for toggling visibility
            this.#_lines = this.#_sR.querySelector('#lines')

            // Set displayed title to combination of 'value' and 'desc' (if provided)
            this.#_sR.querySelector('#title').innerHTML = `${this.$attr('value')}${this.hasAttribute('desc') ? ' ' + this.$attr('desc') : ''}`;

            // Respond to user click to toggle variety items display
            this.#_sR.querySelector('#title').addEventListener('click', () => this.#_lines.hidden = !this.#_lines.hidden);
        }

        //--- connectedCallback
        connectedCallback() {
            // Delay listener attachment to ensure '#eventBus' is present
            setTimeout(() => {
                const eventBus = this.closest('#eventBus');
                if (eventBus) eventBus.addEventListener('updatemenu', (e) => this.initialiseDisplay(e));
                else console.error(`${this.tagName}: Element with id of "eventBus" not found`);
            });
        }
        //+++ End Of Lifecycle events

        //--- initialiseDisplay
        // Ensure 'default' variety attribute is respected every time this menu item is chosen
        initialiseDisplay(e) {
            if (e.detail.id === this.parentNode.id) {
                this.#_lines.hidden = this.hasAttribute('default') ? false : true;
            }
        }
    }
);
