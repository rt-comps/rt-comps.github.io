// ================================================================
// get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

customElements.define(
  compName,
  class extends rtBC.RTBaseClass {
    //+++++ Lifecycle Events
    //--- constructor
    constructor() {
      // Attach contents of template - placed in document.head byrtlib.loadComponent()
      super().attachShadow({ mode: "open" }).append(this.$getTemplate());

      //###### Event Listeners
      // Tell form that menu-item has been chosen
      this.addEventListener('click', () => this.$dispatch({
        name: 'updatemenu',
        detail: { id: this.id.slice(3) }
      }));
    }

    //--- connectedCallback
    connectedCallback() {
      // Look for and pull in external style definition (if found)
      if (rtForm) rtForm.getStyle(this, compName);

      // Set background image - if provided
      if (this.hasAttribute('bgimg')) this.shadowRoot.querySelector('#menu-item-img').style.backgroundImage = `url("${this.$attr('bgimg')}")`;
    }
    //+++++ End of Lifecycle Events
  }
);