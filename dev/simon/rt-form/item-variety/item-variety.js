// ================================================================
// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        // Declare private class fields
        #_sR;       //Shadow Root
        #_lines;    //DIV containing <item-line>s
        #_caret;    //SPAN to display caret

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
            this.#_lines = this.#_sR.querySelector('#lines');
            // Create handle for caret toggling
            this.#_caret = this.#_sR.querySelector('#caret');

            // Set displayed title to combination of 'value' and 'desc' (if provided)
            this.#_sR.querySelector('#text').innerHTML = `${this.$attr('value')}${this.hasAttribute('desc') ? ' ' + this.$attr('desc') : ''}`;

            // Respond to user click to toggle variety items display
            this.#_sR.querySelector('#title').addEventListener('click', () => this.toggleItems());
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
                // Set 'hidden' to inverse of what is wanted
                this.#_lines.hidden = this.hasAttribute('default') ? true : false;
                // Set 'hidden' to correct value and set correct caret
                this.toggleItems();
            }
        }

        //--- toggleItems
        // Invert value of 'hidden' for <line-item>s and display the correct caret
        toggleItems(){
            // Invert current value
            this.#_lines.hidden = !this.#_lines.hidden;
            // Select the correct caret
            this.#_caret.innerHTML=this.#_lines.hidden?'&#9656':'&#9662';
            this.$dispatch({
                name: 'detailresize',
              });
        }
    }
);