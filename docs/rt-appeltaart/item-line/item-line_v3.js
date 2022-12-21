// ================================================================
// === item-line

// get component name from directory name
const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);

// Define the element usin the template in the associated .html file
customElements.define(
    compName,
    class extends rtBase.RTBaseClass {
        // ----- Contructor
        constructor() {
            // Attach contents of template placed in document.head
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());

            // Add onClick events to plus and minus
            this.shadowRoot.querySelector('#plus').addEventListener('click', () => this.updateCount(1));
            this.shadowRoot.querySelector('#minus').addEventListener('click', () => this.updateCount(-1));
        }
        // -----

        // ----- connectedCallback
        connectedCallback() {
            setTimeout(() => {
                this.shadowRoot.querySelector('#prijs').innerHTML = `${this.$euro((parseInt(this.getAttribute('prijs')) / 100))}`;
            })
        }
        // -----

        // ----- updateCount
        // Respond to plus or minus being pressed and update count as required
        updateCount(value) {
            const _count = this.shadowRoot.querySelector('#count');
            if (_count) {
                // Get the current value
                let currentCount = parseInt(_count.innerHTML);
                // Adjust the value
                currentCount += value;
                // Check boundaries
                if (currentCount > 10 || currentCount < 0) currentCount = 0;
                // Write back new value
                _count.innerHTML = `${currentCount}`;
                // Highlight items that have a count > 0
                this.shadowRoot.querySelector('#container').style.fontWeight = currentCount ? 'bold' : '';
            };
        }
        // -----
    }
);