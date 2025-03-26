// ================================================================
// get component name from directory name
const [compName] = rtlib.parseCompURL(import.meta.url);

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

            // Respond to user click to toggle variety items display - does not leave parent's Shadow DOM
            this.#_sR.querySelector('#title').addEventListener('click', () => this.$dispatch({ name: 'variety-toggle', detail: { value: this.getAttribute('value') }, composed: false }));
            // Listen to above dispatched event
            this.parentNode.addEventListener('variety-toggle', (e) => this.#toggleItems(e.detail.value));
        }

        //--- connectedCallback
        connectedCallback() {
            // Look for and pull in external style definition
            if (typeof rtForm !== 'undefined') rtForm.getStyle(this);

            // Delay listener attachment to ensure '#eventBus' is present
            setTimeout(() => {
                const eventBus = this.closest('#eventBus');
                if (eventBus) eventBus.addEventListener('initmenu', (e) => this.#initialiseDisplay(e));
                else console.error(`${this.tagName}: Element with id of "eventBus" not found`);
            }, 100);
        }
        //+++ End Of Lifecycle events

        //--- #initialiseDisplay
        // Ensure 'default' variety attribute is respected every time this menu item is chosen
        #initialiseDisplay(e) {
            // Only bother initialising display if this <item-data> chosen
            if (e.detail.id === this.parentNode.id) {
                // Set 'hidden' to correct value and set correct caret
                this.#toggleItems(this.hasAttribute('default') ? this.getAttribute('value') : '');
            }
        }

        //--- #toggleItems
        // Determine if this variety should be displayed
        #toggleItems(newValue) {
            // Set 'hidden' to false if this is the chosen variety
            this.#_lines.hidden = (newValue !== this.getAttribute('value'))
            // Select the correct caret based in the vlaue of 'hidden' 
            this.#_caret.innerHTML = this.#_lines.hidden ? '&#9656' : '&#9662';
            // this.$dispatch({
            //     name: 'detailresize',
            // });
        }
    }
);