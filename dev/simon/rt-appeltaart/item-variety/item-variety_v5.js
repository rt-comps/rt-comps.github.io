// ================================================================
// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle events
        // --- Contructor
        constructor() {
            // Attach contents of template placed in document.head
            const _sR = super().attachShadow({ mode: "open" });
            _sR.append(this.$getTemplate());
            this._lines = _sR.querySelector('#lines')

            // Respond to user click to toggle variety display
            _sR.querySelector('#title').addEventListener('click', () => this._lines.hidden = this._lines.hidden ? false : true);
        }

        // --- connectedCallback
        connectedCallback() {
            const _sR = this.shadowRoot;
            // this.findEventBus();
            // Set displayed title to combination of 'value' and 'desc' (if provided)
            _sR.querySelector('#title').innerHTML =
                `${this.$attr('value')}${this.hasAttribute('desc') ? ' ' + this.$attr('desc') : ''}`;
            // if (this.hasAttribute('default')) _sR.querySelector('#lines').removeAttribute('style');
            this.initialiseDisplay(_sR.querySelector('#lines'));
            this.closest('#eventBus').addEventListener('updatemenu', (e) => this.initialiseDisplay(this._lines, e));
        }
        //+++ End Of Lifecycle events


        initialiseDisplay(_target, e) {
            // Ensure 'default' attribute is respected every time the product info is opened
            if (!e || e.detail.id === this.parentNode.id) {
                // Set status of variety when a product is selected
                if (this.hasAttribute('default')) _target.hidden = false;
            }
        }
    }
);
