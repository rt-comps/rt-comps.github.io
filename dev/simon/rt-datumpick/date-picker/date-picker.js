// ================================================================
// === date-picker class definition

// Recover component name from URL
const [compName] = rtlib.parseURL(import.meta.url);

// Define custom element
customElements.define(compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- constructor
        constructor() {
            const _sR = super().attachShadow({ mode: "open" })
            _sR.append(this.$getTemplate());

            // Useful nodes
            const $_eventBus = _sR.querySelector('#container')

            // Local properties
            if (this.hasAttribute('maxweek')) $_eventBus.$maxWeek = parseInt(this.getAttribute('maxweek')) - 1;

            // Define custom events for arrow clicks 
            const decWeek = {
                name: 'changeWeek',
                detail: { change: -1 },
                composed: false,
                eventbus: $_eventBus
            };
            const incWeek = {
                name: 'changeWeek',
                detail: { change: 1 },
                composed: false,
                eventbus: $_eventBus
            };

            //### Event Listners
            _sR.querySelector('#al').addEventListener('click', () => this.arrowRespond(decWeek));
            _sR.querySelector('#ar').addEventListener('click', () => this.arrowRespond(incWeek));
            this.addEventListener('datepicked', (e) => this.dpRespond(e));

            if (this.hasAttribute('invalid')) {
                // Convert 'invalid' parameter value to array of integers
                const invalidDays = this.getAttribute('invalid').split(',').map(Number);
                // Get all <dp-date> nodes
                const dateNodes = _sR.querySelectorAll('dp-date');
                // Set all invalid days, allowing for more that 1 week of days in picker
                dateNodes.forEach(node => { if (invalidDays.indexOf((node.getAttribute('day')) % 7) > -1) { node.setAttribute('invalid', ''); } });
            }
        }
        //+++ End of Lifecycle Events

        //--- arrowRespond
        // Clear highlighting and change week
        arrowRespond(event) {
            const days = [...this.shadowRoot.querySelectorAll('dp-date:not([invalid])')];
            days.forEach(el => {
                el.shadowRoot.querySelector('#container').classList.remove('chosen');
            })
            this.$dispatch(event);
        }
        
        //--- dpRespond
        // Highlight the chosen date
        dpRespond(e) {
            const days = [...this.shadowRoot.querySelectorAll('dp-date:not([invalid])')];
            days.forEach(el => {
                const cont = el.shadowRoot.querySelector('#container');
                if (el.getAttribute('day') === e.detail.day) cont.classList.add('chosen');
                else cont.classList.remove('chosen');
            })
        }
    }
);
