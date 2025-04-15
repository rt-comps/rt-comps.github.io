// ================================================================
// get component name from directory name
const [compName] = rtlib.parseCompURL(import.meta.url);

customElements.define(
  compName,
  class extends rtBC.RTBaseClass {
    // Allow this element to participate in forms
    static formAssociated = true;
    // Declare private class fields
    #_sR;
    #_internals;
    #_times;

    //+++++ Lifecycle Events
    //--- constructor
    constructor() {
      super()
      // Attach contents of template - placed in document.head by rtlib.loadComponent()
      this.#_sR = this.attachShadow({ mode: "open" });
      this.#_sR.append(this.$getTemplate());

      // Expose form elements to parent form
      this.#_internals = this.attachInternals();

      // Useful node
      this.#_times = this.#_sR.querySelector('#pu-times');

      // Render Shadow DOM elements based on provided HTML
      this.#render();

      //###### Event Listeners
      // Update times when location selected
      this.#_sR.querySelector('#pickup').addEventListener('change', (e) => this.#updateLoc(e));
    }

    //--- connectedCallBack
    connectedCallBack() {
      // Look for and pull in external style definition only when component is connected to a form element
      if (typeof rtForm !== 'undefined' && rtForm.findNode(this, 'form')) rtForm.getStyle(this, rtForm.findNode(this));
    }

    //--- formAssociatedCallback
    // triggered when component is added to (or removed from) a form
    formAssociatedCallback() {
      // Only do something if this is an association
      if (this.#_internals.form) {
        // Attach a listener to update the form values for this component when form is submitted
        this.#_internals.form.addEventListener('formdata', (e) => {
          const location = this.#_sR.querySelector('input[name="location"]:checked');
          const time = this.#_sR.querySelector('input[name="time-slot"]:checked');
          e.formData.append(`pickup-location`, location ? location.value : '');
          e.formData.append(`pickup-time`, time ? time.value : '');
        });
      }
    }

    //--- formResetCallback
    // respond to the enclosing form being reset
    formResetCallback() {
      const checked = [...this.#_sR.querySelectorAll('input:checked')];
      checked.forEach(el => el.checked = false);
      this.#_times.style.display = 'none';
    }
    //+++++ End of Lifecycle Events

    //--- #render
    // Populate the shadow DOM
    #render() {
      // Find all location entries
      const nodes = [...this.querySelectorAll('pu-loc')];
      // Check there is something to do
      if (nodes.length) {
        const _createRadioLabel = (name, value) =>
          this.$createElement({
            tag: 'label',
            append: [
              this.$createElement({
                tag: 'input',
                type: 'radio',
                name,
                value,
                required: true
              }),
              this.$createElement({
                tag: 'span',
                innerHTML: `&nbsp;${value}`
              })
            ]
          });

        // Create location radio buttons
        this.#_sR.querySelector('fieldset#pickup').append(...nodes.map(element => _createRadioLabel('location', element.id)));

        // Create time slot radio button sets
        this.#_sR.querySelector('fieldset#pu-times').append(...nodes.map(element => {
          // Declare return value
          let newEl;
          // Get timeslots for radio buttons
          const innerNodes = [...element.querySelectorAll('time-slot')];
          // Process time slot info into array of nodes
          if (innerNodes.length) {
            const toAppend = [...innerNodes.map(el => _createRadioLabel('time-slot', el.innerHTML))];
            // Create the <div> to hold this location's time slots and append time slot data nodes
            newEl = this.$createElement({
              tag: 'div',
              id: `rad-${element.id}`,
              hidden: true,
              append: toAppend
            })
          }
          // Return complete node to map function
          return newEl;
        }));
      }
    }

    //--- #updateLoc
    // Update pickup times when user selects location
    #updateLoc(e) {
      // Unhide 'times' on the first time a location is chosen
      if (this.#_times.style.display === 'none') this.#_times.style.display = '';
      // Cycle through possible child nodes, unhide the correct one and hide all the others
      const allNodes = [...this.shadowRoot.querySelectorAll('fieldset div')];
      allNodes.forEach(element => {
        if (element.id === `rad-${e.target.value}`) element.hidden = false;
        else element.hidden = true;
      })
      // uncheck any previously checked radio buttons
      const isChecked = this.shadowRoot.querySelector('input[name="time-slot"]:checked')
      if (isChecked) isChecked.checked = false;
    }

    //### Expose some standard form element properties and methods
    //--- checkValidity
    // Ensure a value has been chosen
    checkValidity() {
      const flags = new Map([
        ['valid', true]
      ]);

      ['location', 'time-slot'].forEach(field => {
        if (flags.get('valid')) {
          if (!this.#_sR.querySelector(`input[name="${field}"]:checked`)) {
            flags.set('valid', false);
            flags.set('field', `pickup-location: ${field}`);
          }
        }
      })
      return flags
    }

    //--- focus
    // Push focus to correct element
    focus(field) {
      if (field.replace(/^pickup-location: /,'') === 'location') this.#_sR.querySelector('#fs-pickup').focus({ focusVisible: true });
      else this.#_sR.querySelector('#fs-time').focus({ focusVisible: true });
    }
  }
);

