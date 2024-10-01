// ================================================================
// === dp-date class definition

// Recover component name from URL
const [compName] = rtlib.parseURL(import.meta.url);


customElements.define(compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- constructor
        constructor() {
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());
        }

        connectedCallback() {
            const node = this.shadowRoot.querySelector('div');
            // Set arrow text          
            this.shadowRoot.querySelector('div').innerHTML = this.id === 'al' ? '&lt;' : '&gt;';
            if (this.id === 'al') {
                node.innerHTML = '&lt;';
                node.style.borderRight = '1px solid black';
                node.style.paddingRight = '7px';
            } else node.innerHTML = '&gt;';
            // Set initial colour
            this.$week = 0;
            this.render();

            // Listen for events on the Event Bus (parent node)
            this.parentNode.addEventListener('changeWeek', (e) => this.changeWeek(e));
        }

        render() {
            // Change the colour of the arrows to reflect limits
            this.style.color = ((this.id === 'al' && this.$week === 0) || (this.id === 'ar' && this.$week === this.$maxWeek)) ? '#CCCCCC' : '#000000';
        }

        changeWeek(e) {
            // First time an arrow is pressed, pull value of $maxWeek from parentNode.
            if (!this.$maxWeek) this.$maxWeek = this.parentNode.$maxWeek;

            // Modify the week value, respecting limits
            this.$week += e.detail.change;
            if (this.$week < 0) this.$week = 0;
            if (this.$week > this.$maxWeek) this.$week = this.$maxWeek;
            this.render();
        }

    }
);
