// ================================================================
// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Create shadowDOM
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());

            // Look for and pull in external style definition
            if (rtForm) rtForm.getStyle(this, compName);
        }

        //--- connectedCallback
        connectedCallback() {
            setTimeout(() => {
                this.querySelector('item-title').setAttribute('slot', 'title');
                this.querySelector('item-desc').setAttribute('slot', 'desc');
            })
        }
        //+++ End Of Lifecycle Events
    }
);
