// ================================================================
// get component name from directory name
const [compName,compVerRaw] = import.meta.url.split("/").slice(-2);

/*
// ================================================================
const compVer=compVerRaw.split('.')[0].substring(compName.length+1);
*/

customElements.define(
  compName,
  class extends rtBase.RTBaseHTMLElement {
    // --- connectedCallback
    connectedCallback(count = this.count) {
      this.style.display = "block";
      if (count > 10 || count < 1) count = 0;
      this.setAttribute("count", count);

      // attr is the correct value
      let button = (x, id, ibtn) =>
        `<button id="${id}" class="${ibtn}" onclick="this.parentNode.count${x}">${x[0]}</button>`;
      this.innerHTML =
        button(
          "--",
          "min",
          "minus"
        ) /* comment out this line to remove minus button*/ +
        button("++", "plus", "plusus") +
        `<count> ${count} </count>` +
        (count ? " " + this.$euro(this.cost) : "") +
        ` ${this.$attr("title")} ` +
        ` ${this.$euro(this.price)} `;
      // if count = 0 hide min button
      //  ${count || ""}  ${this.$euro(this.price)} ` +
      // subtotal if count>0
      //setTimeout(() => this.closest("order-form").total); // trigger total update
    }
    // --- count
    get count() {
      return ~~this.getAttribute("count");
    }
    set count(p) {
      this.connectedCallback(p);
    }

    // --- price
    get prices() {
      return this.$attr2NumArray("price");
    }
    get price() {
      return this.$priceList("price", this.count);
    }

    // --- cost
    get cost() {
      return this.count * this.price;
    }
  }
);
