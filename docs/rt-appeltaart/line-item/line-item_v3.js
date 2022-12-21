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

            // Add Event listeners
            this.shadowRoot.querySelector('#delete').addEventListener('click', () => this.remove());
        }

        // --- connectedCallback
        connectedCallback() {
            setTimeout(() => {
                console.log('line-item connected');
                const _sR = this.shadowRoot;
                console.log(this);
                const count = parseInt(this.getAttribute('count'));
                const unit = parseInt(this.getAttribute('unit'));
                _sR.querySelector('#count').innerHTML = `${count}`
                _sR.querySelector('#unit').innerHTML = `${(this.$euro(unit / 100))}`
                _sR.querySelector('#total').innerHTML = `${(this.$euro((count * unit) / 100))}`
            })
        }

    }
);