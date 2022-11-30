// ================================================================
// get component name from directory name
let [componentName] = import.meta.url.split("/").slice(-2);
// ================================================================
const BUTTON = "rt-button";
customElements.whenDefined("rt-button").then(() => {
  customElements.define(
    componentName,
    class extends customElements.get("rt-button") {
      connectedCallback() {
        this.style.width = "100%";
        this.style.display = "flex";
        this.style.justifyContent = "space-evenly";
        this.innerHTML =
          `<div class="ItemButtons"></div>` +
          `<button id="large" class="sizeButton sizeButton1">Normaal<br>(12 personen)</button>` +
          `<button id="small" class="sizeButton sizeButton2">Klein<br>(4-6 personen)</button>` +
          `</div>`;
        this.querySelector(".sizeButton1").onclick = (evt) =>
          this.switchsize(evt.target.id);
        this.querySelector(".sizeButton2").onclick = (evt) =>
          this.switchsize(evt.target.id);
      }
      switchsize(piesize) {
        this.$dispatch({ name: "piesize", detail: piesize });
      }
    }
  );
});
