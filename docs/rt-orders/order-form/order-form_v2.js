// ================================================================
// get BaseClass from PARENT directory name
// get component name from directory name
let [BaseClass, componentName] = import.meta.url.split("/").slice(-3);
// ================================================================

customElements.define(
  componentName,
  class extends customElements.get(BaseClass) {
    // ---------------------------------------------------------------- constructor
    constructor() {
      super().attachShadow({ mode: "open" }).append(this.getTemplate());
    }
    // ---------------------------------------------------------------- connectedCallback
    connectedCallback() {
      this.process_orderJSON();
    }
    // ---------------------------------------------------------------- process_orderJSON
    process_orderJSON() {
      let orderJSON = this.getAttribute("orders");
      if (orderJSON) {
        fetch(`./${orderJSON}`)
          .then((res) => res.json())
          .then(({ config, categories }) => {
            this.append(
              ...Object.keys(categories).map((key) => {
                return this.addOrderItemContainer({
                  config,
                  category: categories[key],
                });
              })
            );
          });
      }
    }
    // ---------------------------------------------------------------- addOrderItemContainer
    addOrderItemContainer({ config, category }) {
      let { id, title, description, img, items, small, large } = category;
      let container = this.$createElement({
        tag: "order-item-container",
        attrs: { piesize: "large" },
        append: [
          this.$createElement({ tag: "span", slot: "title" }),
          this.addOrderItems("items", items),
          this.addOrderItems("smallpie", small),
          this.addOrderItems("largepie", large),
          this.$createElement({ tag: "span", slot: "description" }),
        ],
      });
      // set background image
      container.style = `background-image: url(${config.imgpath}${img});background-size:cover;background-position:center;`;

      return container;
    }
    // ---------------------------------------------------------------- addOrderItems
    addOrderItems(slot, items) {
      if (items) {
        return this.$createElement({
          tag: "span",
          slot,
          append: items.map(({ id, title, price }) => {
            return this.$createElement({
              tag: "order-item",
              id,
              title,
              attrs: { price },
            });
          }),
        });
      } else {
        return "";
      }
    }
    // ---------------------------------------------------------------- total
    get total() {
      let itemCount = 0;
      let itemSummary = "Besteld:\n";
      let totalCost = [...this.querySelectorAll("order-item")].reduce(
        (total, item) => {
          let { count, cost } = item;
          if (cost) {
            itemCount += count;
            itemSummary += `${count}-${item.getAttribute("id")} € ${cost} `;
          }
          return (total += cost);
        },
        0
      );
      this.setAttribute("count", itemCount);
      itemSummary += `Totaal: ${totalCost}`;

      const warning = (txt) => {
        //console.warn(txt);
      };

      // put summary in <textarea> or any other class labeled element
      let summaryTextarea = this.querySelector(".itemSummary");
      if (summaryTextarea && summaryTextarea.nodeName == "TEXTAREA") {
        summaryTextarea.value = itemSummary;
      } else if (summaryTextarea) {
        summaryTextarea.innerHTML = itemSummary;
      } else {
        warning("No .itemSummary defined");
      }

      // DISCOUNT EXPERIMENT
      // 50:.9,100,.8
      // total>50?.9:total>100?.8:1
      // `total`
      // <order-discount total="50" discount="90%"></order-discount>
      //console.log(eval("total>50?.9:total>100?.8:1"));
      //if(total>10) total = total *.8;
      //total = this.pricelist("discount", itemcount, total);

      let totalElement = this.querySelector(".orderTotal");
      if (totalElement) {
        totalElement.innerHTML = this.$euro(totalCost);
      } else {
        warning("No .orderTotal defined");
      }
      return totalCost;
    } // get total
  } // end of class
); // define order-form
