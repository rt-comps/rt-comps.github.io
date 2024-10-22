// ================================================================
// === ati-form
//
// This is a container for an order form
// It provides functions for loading the menu HTML and responds to a new order being placed
// 
// Note: Template file exist, even though it is unnecessary, for rt.loadComponent() to function
// Note 2: Form HTML must be loaded into shadowDOM for it to be rendered
//
const [compName, compPath] = rtlib.parseURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        // Declare private class fields
        #_sR;

        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template previously placed in document.head
            super()
            this.#_sR = this.attachShadow({ mode: "open" });
            this.#_sR.append(this.$getTemplate())

            // Get the menu file
            // if (this.hasAttribute('datafile') && this.getAttribute('datafile')) {
            //     // Determing the path to the menu data file
            //     const dataFile = this.getAttribute('datafile');
            //     const regex = /^http[s]?:\/\//;
            //     const url = dataFile.match(regex) ? `${dataFile}` : `${compPath}/${dataFile}`;
            //     this.#_sR.querySelector('rt-orderform').loadMenu(url);
            // } else {
            //     const frag = document.createRange().createContextualFragment('<h1 style="color: red;">datafile attribute not provided</h1>');
            //     this.#_sR.appendChild(frag);
            // }

            // this.getMenu();

            // Catch form output event and display final order details
            this.addEventListener('neworder', (e) => this.#dispatchOrder(e));
            this.addEventListener('formready', (e) => this.#getMenu(e));
        }

        //--- connectedCallback
        // connectedCallback() {
        // }
        //+++ End OF Lifecycle Events

        //--- #getMenu
        // Tell form to retrieve the specified menu data file
        #getMenu(e) {
            if (e) e.stopPropagation();
            // Get the menu file
            if (this.hasAttribute('datafile') && this.getAttribute('datafile')) {
                // Determing the path to the menu data file
                const dataFile = this.getAttribute('datafile');
                const regex = /^http[s]?:\/\//;
                const url = dataFile.match(regex) ? `${dataFile}` : `${compPath}/${dataFile}`;
                this.#_sR.querySelector('rt-orderform').loadMenu(url);
            } else {
                const frag = document.createRange().createContextualFragment('<h1 style="color: red;">datafile attribute not provided</h1>');
                this.#_sR.appendChild(frag);
            }
        }

        //--- #dispatchOrder
        // Catch the neworder event from <rt-orderform> and process it as required
        #dispatchOrder(e) {
            // Catch order and prevent further bubbling
            if (e) e.stopPropagation();
            // Process order
            if (e.detail) {
                // Define API request parameters
                // ForProd: { "handler": "https://roads-technology.com/rtform/sendmail.php" }
                const handler = 'http://localhost:5100/dev/API/sendmail.php';
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        //uri: document.documentURI,
                        tag: 'item-line',
                        order: e.detail.order,
                        details: e.detail.person
                    })
                };

                // Make API request
                fetch(handler, options)
                    .then((response) => { if (response.ok) return response.text(); })
                    .then((text) => {
                        //document.querySelector('#Debug').innerHTML = text;
                        if (text.slice(-2) === 'OK' && text.slice(-3) !== 'NOK') {
                            this.#_sR.querySelector('rt-orderform').accepted();
                        } else {
                            alert('Order submission failed');
                            console.warn(text);
                        }
                    });
            }

        }

        show() {
            this.#_sR.querySelector('dialog').showModal();
        }

    }
);