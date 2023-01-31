// ================================================================
// === item-line (displayed in item-data)

// get component name from directory name
const [compName] = rt.parseURL(import.meta.url);

// Define the element usin the template in the associated .html file
customElements.define(compName,
    class extends rtBase.RTBaseClass {
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template placed in document.head
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());
            // Set maximum value
            this.maxCount = 10;

            //### Event Listeners
            //___ updateCount
            this.addEventListener('updatecount', (e) => this.updateCount(e));
        }

        //--- connectedCallback
        connectedCallback() {
            this.shadowRoot.querySelector('#prijs').innerHTML = `${this.$euro((parseInt(this.$attr('prijs')) / 100))}`;
        }
        //+++++ End of Lifecycle Events

        //--- updateCount
        // Respond to plus or minus event update count as required
        updateCount(e) {
            e.stopPropagation();

            const _count = this.shadowRoot.querySelector('#count');
            if (_count) {
                // Get the current value
                let currentCount = parseInt(_count.innerHTML);
                // Adjust the value
                currentCount += e.detail.change;
                // Check boundaries
                if (currentCount > this.maxCount || currentCount < 0) currentCount = 0;
                // Write back new value
                _count.innerHTML = `${currentCount}`;
                // Highlight items that have a count > 0
                this.shadowRoot.querySelector('#container').style.fontWeight = currentCount ? 'bold' : '';
            };
        }
        //--- End of updateCount
    }
);