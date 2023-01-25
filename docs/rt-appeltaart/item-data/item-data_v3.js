// ================================================================
// get component name from directory name
const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);

customElements.define(
    compName,
    class extends rtBase.RTBaseClass {
        // --- Contructor
        constructor() {
            // Attach contents of template placed in document.head
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());
        }

        // --- connectedCallback
        connectedCallback() {
            setTimeout(() => {
                this.querySelector('item-title').setAttribute('slot', 'title');
                this.querySelector('item-desc').setAttribute('slot', 'desc');
            })
        }
    }
);
