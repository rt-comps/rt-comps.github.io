// ================================================================
// === ate-form
//
// This is a container for a form so does not have a template but instead loads the form contents from a definition file
// Note: Template file must be provided for loadComponent() function
// Note2: Form must be loaded into shadowDOM for it to be rendered
//
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
        // 
        // Both fetch() and response.text() are async functions
        getMenu() {
            const url = 'menu.html';
            try {
                fetch(url)
                    .then((response) => {
                        // Once response has been received, check for error
                        if (!response.ok) throw `Failed to load ${url} with status ${response.status}`;
                        return response.text()
                    })
                    .then((htmlText) => {
                        // Once response.text() is available then append to shadow DOM
                        const frag = document.createRange().createContextualFragment(htmlText);
                       this.#_sR.appendChild(frag);
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