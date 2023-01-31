// ================================================================
// get component name from directory name
//const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);
const [compName] = rt.parseURL(import.meta.url);

customElements.define(
  compName,
  class extends rtBase.RTBaseClass {
    //+++++ Lifecycle Events
    //--- constructor
    constructor() {
      // Attach contents of template - placed in document.head by rt.loadComponent()
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
