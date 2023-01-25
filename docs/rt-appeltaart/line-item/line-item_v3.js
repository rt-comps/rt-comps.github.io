// ================================================================
// === line-item (displayed in cart)
const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);

customElements.define(
    compName,
    class extends rtBase.RTBaseClass {
        // --- Contructor
        constructor() {
            // Attach contents of template previously placed in document.head
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());

            // --- Listeners
            // Remove this item when 'delete' button pressed
            this.shadowRoot.querySelector('#delete').addEventListener('click', () => this.remove());
            // Update total price on count change
            this.addEventListener('updateCount', (e) => this.render(e));
        }

        // --- connectedCallback
        connectedCallback() {
            setTimeout(() => this.render());
        }

        // --- render
        render(e) {
            const _sR = this.shadowRoot;
            const unit = parseInt(this.getAttribute('unit'));
            let count = parseInt(_sR.querySelector('#count').innerHTML);
            // When called from an event then update the count
            if (e) {
                e.stopPropagation();
                count += e.detail.change;
                switch (true) {
                    case (count > 10):
                        count = 10;
                        break;
                    case (count < 0):
                        count = 0;
                }
            } else count = parseInt(this.getAttribute('count'));
            _sR.querySelector('#count').innerHTML = `${count}`
            _sR.querySelector('#unit').innerHTML = `${(this.$euro(unit / 100))}`
            _sR.querySelector('#total').innerHTML = `${(this.$euro((count * unit) / 100))}`
        }
    }
);