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
      // Click triggers an updateMenu event
      this.addEventListener('click', () => this.$dispatch({
        name: 'updatemenu',
        detail: { id: this.id.slice(3) }
      }));
    }

    //--- connectedCallback
    connectedCallback() {
      // Set background image - if provided
      if (this.hasAttribute('bgimg')) this.shadowRoot.querySelector('#img').style.backgroundImage = `url("${this.$attr('bgimg')}")`;
    }
    //+++++ End of Lifecycle Events
  }
);