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

            _sR.querySelector('#title').addEventListener('click', () => this.toggleDisplay(_sR.querySelector('#lines')));
        }

        // --- connectedCallback
        connectedCallback() {
            const _sR = this.shadowRoot;
            // Set displayed title to combination of 'value' and 'desc' (if provided)
            _sR.querySelector('#title').innerHTML =
                `${this.$attr('value')}${this.hasAttribute('desc') ? ' ' + this.$attr('desc') : ''}`;
            if (this.hasAttribute('default')) _sR.querySelector('#lines').removeAttribute('style');
        }
        //+++ End Of Lifecycle events

        toggleDisplay (_target) {
            if (_target.hasAttribute('style')) _target.removeAttribute('style');
            else _target.style.display = 'none';
        }
    }
);
