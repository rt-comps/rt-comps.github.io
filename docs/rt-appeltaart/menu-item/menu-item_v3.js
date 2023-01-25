// ================================================================
// get component name from directory name
const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);

customElements.define(
  compName,
  class extends rtBase.RTBaseClass {
    //+++++ Built-In Functions
    //----- constructor
    constructor() {
      // Attach contents of template - placed in document.head by rt.loadComponent()
      super().attachShadow({ mode: "open" }).append(this.$getTemplate());

      // ###### Event Listeners
      // Click triggers an updateMenu event
      this.addEventListener('click', () => this.$dispatch({ name: 'updateMenu', detail: { id: this.id } }));
    }
    //----- End of constructor

    //----- connectedCallback
    connectedCallback() {
      // Set background image - if provided
      const bgImg = this.getAttribute('bgimg');
      if (bgImg) this.shadowRoot.querySelector('div').style.backgroundImage=`url("${bgImg}")`;

    }
  }
);
