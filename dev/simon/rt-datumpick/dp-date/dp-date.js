// ================================================================
// === dp-date class definition

// Recover component name from URL
const [compName] = rtlib.parseURL(import.meta.url);


customElements.define(compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- constructor
        constructor() {
            const _sR = super().attachShadow({ mode: "open" })
            _sR.append(this.$getTemplate());

            // Initialise local properties
            this.$week = 0;     // Weeks relative to current week
            this.$date = 0;     // Current date value for this component
            this.$month = 0;    // Current month value for this component

            // Determine day string for this instance, using 'day' attribute
            _sR.querySelector('#day').innerHTML = (this.hasAttribute('day') ? rtlib.getDay(parseInt(this.getAttribute('day')) % 7) : 'ERROR');
            // Display intitial date text
            this.render();

            //*** Listener
            //--- for 'onClick' - dispatch 'datepicked' outside the shadow root
            _sR.querySelector('#container').addEventListener('click', () => this.pickDate());
        }

        //--- connectedCallback
        connectedCallback() {
            //*** Listeners
            // Placed here to ensure 'parentNode' is not null
            if (this.parentNode) this.parentNode.addEventListener('changeWeek', (e) => this.changeWeek(e));
        }

        //--- attributeChangedCallback
        // Ensures component responds to an 'invalid' attribute being assigned during parent component loading
        static get observedAttributes() { return ['invalid'] };
        attributeChangedCallback() { this.render(); }
        //+++ End of Lifecycle Events

        //--- getMonth
        // Provide the correct

        //--- render
        // Calculate the correct date text and state for this component
        render() {
            if (this.hasAttribute('day')) {
                const _sR = this.shadowRoot;
                // Determine today's date
                const today = new Date();
                // A useful value
                const dateId = parseInt(this.getAttribute('day'));
                // Determine if date is possible and render in grey if not
                _sR.querySelector('#container').style.color = ((this.hasAttribute('invalid') || (this.$week === 0 && (today.getDay() > dateId))) ? "#CCCCCC" : "#000000");
                // Modify "today" to the correct date for the button in a way that handles a month boundary when required
                today.setDate(today.getDate() + (7 * this.$week) + (dateId - today.getDay()));
                // Update day & date properties
                this.$date = today.getDate();
                this.$month = today.getMonth();
                // Render date
                _sR.querySelector('#date').innerHTML = `${this.$date} ${rtlib.getMonth(this.$month)}`
            }
        }

        //--- changeWeek
        // Update the week when arrow pressed
        changeWeek(e) {
            // Recover week change value from event detail
            this.$week += e.detail.change;
            // Limit lowest value to zero
            if (this.$week < 0) this.$week = 0;
            // Adhere to upper limit - if set
            if (this.parentNode.$maxWeek && this.$week > this.parentNode.$maxWeek) this.$week = this.parentNode.$maxWeek;
            // Recalculate text fields
            this.render();
        }

        //--- pickDate
        // Send composed event with current date and month data if date is valid
        pickDate() {
            if (this.shadowRoot.querySelector('#container').style.color == "rgb(0, 0, 0)") {
                this.$dispatch({
                    name: 'datepicked',
                    detail: { date: this.$date, month: this.$month, day: this.getAttribute('day') }
                })
            }
        }
    }
);