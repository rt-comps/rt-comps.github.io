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
        return this.priceList("price", this.count);
      }
      
      // --- cost
      get cost() {
        return this.count * this.price;
      }
      
      // ------- pricelist
      priceList(prices_attr, count, discountTotal = false) {
        // return price for count (items)
        // 1 and 2 buy for 13.00
        // 3 buy for 11.00
        // 4 buy for 10.00
        // read price(s) "1300,1300,1100,1000"
        let pricesArray = this.prices;
        let lastPrice = pricesArray.slice(-1)[0];
        // make enough array items, store discountTotal OR  LAST price
        let prices = new Array(11).fill(discountTotal || lastPrice); // lowestprice
        // Arrays start 0; overwrite prices Array with defined prices
        pricesArray.map((price, idx) => {
          // +1 so count parameter doesn't start at 0
          return (prices[idx + 1] = price);
        });
        //return price at index
        return prices[count] * (discountTotal || 0.01); // percentage or /100
      }
    }
    );
    