// ================================================================
// === ate-form
const [compName] = rtlib.parseURL(import.meta.url);

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
            this.#_sR.append(this.$getTemplate());

            // Get the menu file
            this.getMenu();
            
            // Catch form output event and display final order details
            this.addEventListener('neworder', (e) => this.dispatchOrder(e));            
        }
        
        //--- connectedCallback
        connectedCallback() {
        }
        //+++ End OF Lifecycle Events

        //--- getMenu
        // Retrieve the menu from a 'menu.html' file.  The file needs to be adjacent to the page containg the <ati-form> element 
        getMenu() {
            const url = 'menu.html';
            try {
//                return fetch(url)
                fetch(url)
                    .then((response) => {
                        if (!response.ok) throw `Failed to load ${url} with status ${response.status}`;
                        return response.text()
                    })
                    .then((htmlText) => {
                        // Load content in to shadow DOM - doesn't work if imported in to light DOM?
                       this.#_sR.querySelector('div').insertAdjacentHTML('afterbegin', htmlText)
                        // this.insertAdjacentHTML('afterbegin', htmlText)
                    });
            } catch (e) {
                console.warn(e);
            }
        }

        //--- dispatchOrder
        // Catch the neworder event from <order-form> and process it as required
        dispatchOrder(e) {
            // Catch order and prevent further bubbling
            if (e) e.stopPropagation();
            // Process order
            if (e.detail) {
                // Define API request parameters
                const handler = 'http://localhost:5100/mydev/API/sendmail.php';
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
                        document.querySelector('#Debug').innerHTML = text;
                        if (text.slice(-2) === 'OK' && text.slice(-3) !== 'NOK') {
                            this.#_sR.querySelector('order-form').accepted();
                        } else {
                            alert('Order submission failed');
                            console.warn(text);
                        }
                    });
            }

        }

    }
);