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
            this.#_sR.querySelector('#container').addEventListener('updatecount', (e) => this.#update(e));
        }
        
        //--- connectedCallback
        connectedCallback() {
            // Look for and pull in external style definition
            if (rtForm) rtForm.getStyle(this);
    
            // update total price on count change
            this.#render();
        }
        //+++ End OF Lifecycle Events

        //--- #render
        // Initialise
        #render() {
            const unit = parseInt(this.$attr('unit'));
            const count = parseInt(this.$attr('count'));

            this.#_sR.querySelector('#unit').innerHTML = `${(this.$euro(unit / 100))}`;
            this.#_sR.querySelector('#count').innerHTML = `${count}`;
            this.#_sR.querySelector('#total').innerHTML = `${(this.$euro((count * unit) / 100))}`;
            this.#_sR.querySelector('img').src = `${compPath}/imgs/trashcan.jpeg`;
        }

        //--- #update
        #update(e) {            
            // When called from an event then update the count
            if (e) {
                e.stopImmediatePropagation();
                let count = parseInt(this.$attr('count'));

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
                        prodID: this.$attr('prodid'),
                        count,
                        action: (count > 0) ? 'update' : 'remove'
                    }
                });
            }
        }
    }
);