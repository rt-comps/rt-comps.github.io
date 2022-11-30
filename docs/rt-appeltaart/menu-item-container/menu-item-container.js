// ================================================================

// get component name from directory name
const [compName,compVerRaw] = import.meta.url.split("/").slice(-2);
// ================================================================
const compVer=compVerRaw.split('.')[0].substring(compName.length+1);

customElements.define(
  compName,
  class extends rtBase.RTBaseHTMLElement { // Get RTBaseHTMLElement definition from module
    // ---------------------------------------------------------------- observedAttributes
    static get observedAttributes() {
      return ["piesize"];
    }
    // ---------------------------------------------------------------- constructor
    constructor() {
      super().attachShadow({ mode: "open" }).append(this.$getTemplate());
    }
    // ---------------------------------------------------------------- connectedCallback
    connectedCallback() {
      setTimeout(() => {
        this.setPieSize();
      });
      this.addEventListener("piesize", (evt) => {
        //! reset small/large orders to 0
        this.setAttribute("piesize", evt.detail);
      });
    }
    // ---------------------------------------------------------------- setPieSize
    setPieSize(size = this.getAttribute("piesize")) {
      // size = large || small
      let style = this.shadowRoot.querySelector("#piesize");
      style.innerHTML = `slot[name="${size}pie"] {display:initial!important}`;
    }
    // ---------------------------------------------------------------- attributeChangedCallback
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "piesize") {
        this.setPieSize(newValue);
      }
    }
    // ----------------------------------------------------------------
  }
);