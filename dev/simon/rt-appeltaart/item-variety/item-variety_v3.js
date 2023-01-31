// ================================================================
// get component name from directory name
const [compName] = rt.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBase.RTBaseClass {
        //+++ Lifecycle events
        // --- Contructor
        constructor() {
            // Attach contents of template placed in document.head
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());
        }

        // --- connectedCallback
        connectedCallback() {
                // Set displayed title to combination of 'value' and 'desc' (if provided)
                this.shadowRoot.querySelector('#title').innerHTML=
                `${this.$attr('value')}${this.hasAttribute('desc')?' '+this.$attr('desc'):''}`;
        }
        //+++ End Of Lifecycle events
    }
);
