// ================================================================
// === line-item (displayed in cart)
const [compName, basePath] = rtlib.parseCompURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        #_sR
        #_counter

        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template previously placed in document.head
            super()
            this.#_sR = this.attachShadow({ mode: "open" });
            this.#_sR.append(this.$getTemplate());

            this.#_counter = this.#_sR.querySelector('rt-plusminus');
            //### Event Listeners
            // Remove this item when 'delete' button pressed
            this.#_sR.querySelector('#delete').addEventListener('click', this.#deleteMe);
            // Respond to +/- button press
            this.addEventListener('updatecount', this.#update);
        }

        //--- connectedCallback
        connectedCallback() {
            // Look for and pull in external style definition
            if (typeof rtForm !== 'undefined') rtForm.getStyle(this, rtForm.findNode(this));

            // update total price on count change
            setTimeout(() => { this.#render() }, 0);
        }
        //+++ End OF Lifecycle Events

        //--- #deleteMe
        // Respond to click on delete icon
        #deleteMe() {
            // Set count to zero
            this.count = 0;
            // Signal that value has changed
            this.#update();
        }

        //--- #render
        // Initialise
        #render() {
            const unit = parseInt(this.$attr('unit'));
            const count = parseInt(this.count);

            this.#_sR.querySelector('#unit').innerHTML = `${(this.$euro(unit / 100))}`;
            this.#_sR.querySelector('#total').innerHTML = `${(this.$euro((count * unit) / 100))}`;
            this.#_sR.querySelector('img').src = `${basePath}/components/${compName}/imgs/trashcan.jpeg`;
        }

        //--- #update
        #update(e) {
            // When called from an event then stop bubbling
            if (e instanceof Event) e.stopImmediatePropagation();
            // Recalculate line values
            this.#render();
            // Dispatch event to update #_cartContents
            this.$dispatch({
                name: 'cartmod',
                detail: {
                    prodID: this.$attr('prodid'),
                    count: parseInt(this.count)
                }
            });
        }

        //+++ Getters/Setters
        // Modify 'count' attribute of plus-minus component
        get count() { return this.#_counter.$attr('count') }
        set count(c) { this.#_counter.$attr('count', c) }

    });