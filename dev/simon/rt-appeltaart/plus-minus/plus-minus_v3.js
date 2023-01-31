// ================================================================
// === plus-minus

// get component name from directory name
const [compName] = rt.parseURL(import.meta.url);

// Define the element usin the template in the associated .html file
customElements.define(
    compName,
    class extends rtBase.RTBaseClass {
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template placed in document.head
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());

            // Add onClick events to plus and minus
            this.shadowRoot.querySelector('#plus').addEventListener('click', () => this.buttonPressed(1));
            this.shadowRoot.querySelector('#minus').addEventListener('click', () => this.buttonPressed(-1));
        }
        //+++ End Of Lifecycle Events

        //--- buttonPressed
        // Respond to plus or minus being pressed to create an event to bubble up to parent
        buttonPressed(value) {
            this.$dispatch({ name: 'updatecount', detail: { change: value } });
        }
    }
);