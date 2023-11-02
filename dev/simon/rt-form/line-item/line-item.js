// ================================================================
// === line-item (displayed in cart)
const [compName, compPath] = rtlib.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        #_sR
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template previously placed in document.head
            super()
            this.#_sR = this.attachShadow({ mode: "open" });
            this.#_sR.append(this.$getTemplate());

            //### Listeners
            // Remove this item when 'delete' button pressed
            this.#_sR.querySelector('#delete').addEventListener('click', () => {
                this.$dispatch({
                    name: 'cartmod',
                    detail: {
                        prodID: this.getAttribute('prodid'),
                        action: 'remove'
                    }
                });
                this.remove();
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
            const unit = parseInt(this.$attr('unit'));
            let count = parseInt(this.#_sR.querySelector('#count').innerHTML);
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
                this.$dispatch({
                    name: 'cartmod',
                    detail: {
                        prodID: this.getAttribute('prodid'),
                        count: e.detail.change,
                        action: 'update'
                    }
                });
            } else {
                // If triggered by connectedCallback then initialise the elements
                count = parseInt(this.$attr('count'));
                this.#_sR.querySelector('#unit').innerHTML = `${(this.$euro(unit / 100))}`;
            }
            this.#_sR.querySelector('#count').innerHTML = `${count}`;
            // Update <line-item> count attribute
            if (count > 0) this.setAttribute('count', count);
            else this.removeAttribute('count');
            this.#_sR.querySelector('#total').innerHTML = `${(this.$euro((count * unit) / 100))}`;
            // Publish delete icon
            this.#_sR.querySelector('img').src = `${compPath}/imgs/trashicon.jpeg`;
        }
    }
);