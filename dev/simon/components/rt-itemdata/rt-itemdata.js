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
        }
        
        //--- connectedCallback
        connectedCallback() {
            // Look for and pull in external style definition
            if (typeof rtForm !== 'undefined') rtForm.getStyle(this);
            // Slot basic data
            setTimeout(() => {
                this.querySelector('item-title').setAttribute('slot', 'title');
                this.querySelector('item-desc').setAttribute('slot', 'desc');
            })
        }
        //+++ End Of Lifecycle Events
    }
);
