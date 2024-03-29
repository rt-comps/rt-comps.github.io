// ================================================================
// === plus-minus

// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

// Define the element usin the template in the associated .html file
customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template placed in document.head
            const _sR = super().attachShadow({ mode: "open" });
            _sR.append(this.$getTemplate());

            // Check for custom colours.  1st colour is used for background and 2nd (if specified) for foreground
            const colors = this.attributes['colors'];
            if (colors) {
                // Get custom colour(s)
                const [custBgCol,custCol] = colors.value.split(',');
                // Get handle to container (only DIV in SR)
                const _div = _sR.querySelector('div');
                // Apply custom colours to DIV
                _div.style.color = custCol ? custCol : '';
                _div.style.backgroundColor = custBgCol ? custBgCol : '';
            }

            // Add onClick events to plus and minus
            _sR.querySelector('#plus').addEventListener('click', () => this.buttonPressed(1));
            _sR.querySelector('#minus').addEventListener('click', () => this.buttonPressed(-1));
        }
        //+++ End Of Lifecycle Events

        //--- buttonPressed
        // Respond to plus or minus being pressed to create an event to bubble up to parent
        buttonPressed(value) {
            this.$dispatch({ name: 'updatecount', detail: { change: value } });
        }
    }
);