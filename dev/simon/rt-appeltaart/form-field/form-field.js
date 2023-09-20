// ================================================================
// === form-field class definition

// Recover component name from URL
const [compName] = rtlib.parseURL(import.meta.url);

// Define custom element
customElements.define(compName,
    class extends rtBC.RTBaseClass {
        // Allow this element to participate in forms
        static formAssociated = true;

        // Declare private class fields
        #_internals = null;
        #_input;

        //+++ Lifecycle Events
        //--- constructor
        constructor() {
            super();
            // Create and build Shadow DOM
            const _sR = this.attachShadow({ mode: "open" });
            _sR.append(this.$getTemplate());

            // Allow access to form 
            this.#_internals = this.attachInternals();

            // Useful Nodes
            this.#_input = _sR.querySelector('input');

            // Add asterisk to 'required' fields
            if (this.hasAttribute('required')) _sR.querySelector('span').innerHTML = '&nbsp*';

            // Use 'label' attribute for field label
            _sR.querySelector('label').insertAdjacentHTML('afterbegin', `${this.getAttribute('label') || 'Name Missing'}&nbsp;`);
        }
        //--- formAssociatedCallback
        // triggered when component is associated with (or dissociated from) a form
        formAssociatedCallback() {
            // If this is an association then add listener for formData request
            if (this.#_internals.form) {
               this.#_internals.form.addEventListener('formdata', (e) => e.formData.append(this.getAttribute('name'), this.#_input.value));
            }
        }
        //+++ End of Lifecycle Events

    }
);