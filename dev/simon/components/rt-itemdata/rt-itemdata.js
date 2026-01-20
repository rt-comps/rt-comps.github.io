// ================================================================
// get component name from directory name
const [compName] = rtlib.parseCompURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        #_sR;

        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template previously placed in document.head
            super()
            this.#_sR = this.attachShadow({ mode: "open" });
            this.#_sR.append(this.$getTemplate())
        }

        //--- connectedCallback
        connectedCallback() {
            // Look for and pull in external style definition
            if (typeof rtForm !== 'undefined') rtForm.getStyle(this, rtForm.findNode(this));
            // Slot basic data
            setTimeout(() => {
                // Slot in item data
                const title = this.querySelector('item-title');
                if (title) title.setAttribute('slot', 'title');
                const desc = this.querySelector('item-desc');
                if (desc) desc.setAttribute('slot', 'desc');
            }, 0)
        }
        //+++ End Of Lifecycle Events
    }
);
