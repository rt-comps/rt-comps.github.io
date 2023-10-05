// ================================================================
// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

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
      this.render();

      //###### Event Listeners
      // Update times when location selected
      this.#_sR.querySelector('#pickup').addEventListener('change', (e) => this.updateLoc(e));
    }

    //--- formAssociatedCallback
    // triggered when component is added to (or removed from) a form
    formAssociatedCallback() {
      // Only do something if this is an association
      if (this.#_internals.form) {
        // Attach a listener to update the form values for this component when form is submitted
        this.#_internals.form.addEventListener('formdata', (e) => {
          const name = this.getAttribute('name');
          // Handle no checked radio buttons - should not be needed because of validation check?
          const location = this.#_sR.querySelector('input[name="location"]:checked');
          const time = this.#_sR.querySelector('input[name="time-slot"]:checked');
          e.formData.append(`${name}-location`, location ? location.value : '');
          e.formData.append(`${name}-time`, time ? time.value : '');
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

    //--- render
    // Populate the shadow DOM
    render() {
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

    //--- updateLoc
    // Update pickup times when user selects location
    updateLoc(e) {
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
      return (this.#_sR.querySelector('input[name="location"]:checked') && this.#_sR.querySelector('input[name="time-slot"]:checked')) ? true : false;
    }
    //--- focus
    // Push focus to correct element
    focus() {
      console.log('focusing');
      const times = this.#_sR.querySelector('#pu-times');
      console.log(times.style.display ? true : false)
      console.log(this.#_sR.querySelector('#fs-time'));
      if (times.style.display) {
        console.log('focusing up');
        this.#_sR.querySelector('#fs-pickup').focus();}
      else {
        console.log('focusing down');
        this.#_sR.querySelector('#fs-time').focus();}
    }
  }
);

