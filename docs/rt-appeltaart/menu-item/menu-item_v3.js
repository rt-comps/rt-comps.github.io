// ================================================================
// get component name from directory name
const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);

customElements.define(
  compName,
  class extends rtBase.RTBaseClass {
    // --- connectedCallback
    connectedCallback() {
      // Cause item click to trigger an updateMenu event
      this.addEventListener('click', () => {
        const updateMenu = new CustomEvent('updateMenu',{ 
          composed: true, // Allow the event to bubble out of shadow root
          detail: { id: this.id }
        });
        this.dispatchEvent(updateMenu);
      }
      );
      console.log('Got connected');
    }
  }
);
