// ================================================================
// get component name from directory name
//const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);
const [compName] = rtlib.parseURL(import.meta.url);

customElements.define(
  compName,
  class extends rtlBC.RTBaseClass {
    //+++++ Lifecycle Events
    //--- constructor
    constructor() {
      // Attach contents of template - placed in document.head by rtlib.loadComponent()
      super().attachShadow({ mode: "open" }).append(this.$getTemplate());

      //###### Event Listeners
      // Click triggers an updateMenu event
      this.addEventListener('click', () => this.$dispatch({ name: 'updatemenu', detail: { id: this.id } }));
    }
    //--- End of constructor

    //--- connectedCallback
    connectedCallback() {
            // Set background image - if provided
            if (this.hasAttribute('bgimg')) this.shadowRoot.querySelector('div').style.backgroundImage = `url("${this.$attr('bgimg')}")`;
    }
    //--- End of connectedCallback
    //+++++ End of Lifecycle Events
  }
);
