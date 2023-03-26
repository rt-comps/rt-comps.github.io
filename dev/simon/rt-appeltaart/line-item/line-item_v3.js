// ================================================================
// === line-item (displayed in cart)
const [compName] = rtlib.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtlBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template previously placed in document.head
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());

            //### Listeners
            // Remove this item when 'delete' button pressed
            this.shadowRoot.querySelector('#delete').addEventListener('click', () => {
                const eventBus = this.parentNode.shadowRoot.querySelector('#cart');
                this.remove();
                this.$dispatch({name:'updatecount', eventbus: eventBus});
            });
            // Update total price on count change
            this.addEventListener('updatecount', (e) => this.render(e));
        }

        //--- connectedCallback
        connectedCallback() {
            this.render();
        }
        //+++ End OF Lifecycle Events

        //--- render
        // Update 
        render(e) {
            const _sR = this.shadowRoot;
            const unit = parseInt(this.$attr('unit'));
            let count = parseInt(_sR.querySelector('#count').innerHTML);
            // When called from an event then update the count
            if (e) {
                //e.stopPropagation();
                count += e.detail.change;
                switch (true) {
                    case (count > 10):
                        count = 10;
                        break;
                    case (count < 0):
                        count = 0;
                }
            } else {
                // If triggered by connectedCallback then initialise the elements
                count = parseInt(this.$attr('count'));
                _sR.querySelector('#unit').innerHTML = `${(this.$euro(unit / 100))}`;
            }
            _sR.querySelector('#count').innerHTML = `${count}`;
            // Update <line-item> count attribute
            if (count > 0) this.setAttribute('count', count);
            else this.removeAttribute('count');
            _sR.querySelector('#total').innerHTML = `${(this.$euro((count * unit) / 100))}`;
        }
    }
);