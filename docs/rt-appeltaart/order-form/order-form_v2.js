// ================================================================
// get BaseClass from module
import * as rtBase from "../../rt_baseclass.js";

// get component name from URL directory name
const [compName,compVerRaw] = import.meta.url.split("/").slice(-2);
// ================================================================
const compVer=compVerRaw.split('.')[0].substring(compName.length+1);
// *** DEBUG CODE ***
console.warn(`loading ${compName}, ${compVer}`);

customElements.define(
  compName,
  class extends rtBase.RTBaseHTMLElement { // Get RTBaseHTMLElement definition from module
    // --- constructor
    constructor() {
      // Attach contents of template placed in document.head
      super().attachShadow({ mode: "open" }).append(this.$getTemplate());
    }
    
    // --- connectedCallback
    // Once connected, dependancies should be available to allow the element to be built
    connectedCallback() {
      this.process_menuJSON();
    }
    
    // --- process_menuJSON
    // Build the form from the contents of a JSON file specified in the "orders" attribute
    process_menuJSON() {
      // Check attribute is present
      let menuJSON = this.getAttribute("menu");
      if (menuJSON) {
        // Get the JSON file
        fetch(`./${menuJSON}`)
        // Convert file contents to object
        .then((res) => res.json())
        // Append an element for each category
        .then(({ config, categories }) => {
          this.append(
            ...Object.keys(categories).map((key) => {
              return this.addMenuItemContainer({
                config,
                category: categories[key],
              });
            })
            );
          });
          // Send error message to console if attribute not found or empty
        } else console.error(`Attribute "menu" not provided for ${compName} element!`);
      }
      
      // --- addMenuItemContainer
      // Create a container element for a menu category
      addMenuItemContainer({ config, category }) {
        const { id, title, description, img, items, small, large } = category;
        let container = this.$createElement({
          tag: "order-item-container",
          attrs: { piesize: "large" },
          Elements: [
            this.$createElement({ tag: "span", slot: "title" }),
            this.addMenuItems("items", items),
            this.addMenuItems("smallpie", small),
            this.addMenuItems("largepie", large),
            this.$createElement({ tag: "span", slot: "description" }),
          ],
        });
        // set background image
        if (img) container.style = `background-image: url(${config.imgpath}${img});background-size:cover;background-position:center;`;
        
        return container;
      }
      
      // --- addMenuItems
      addMenuItems(slot, items) {
        if (items) {
          return this.$createElement({
            tag: "span",
            slot,
            Elements: items.map(({ id, title, price }) => {
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
      // --- total
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
        } // get total */
      });
      