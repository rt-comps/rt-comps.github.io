
	//  if <order-forms count="10"> then disable + button.
	//	if <order-forms count="(less then)10"> then enable buttons.
  try {
    console.log(
      `%c init Roads Technology Components <order-forms> <order-items> `,
      "background:firebrick;color:gold"
    );
    class OrdersHTMLElement extends HTMLElement {
      $(v) {
        return Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "eur",
        }).format(v);
      }
      pricelist(atr, cnt, discountTotal = false) {
        let p = this.Attr(atr).split(",");
        let prices = new Array(11).fill(discountTotal || p[p.length - 1]); // lowestprice
        p.map((v, i) => (prices[i + 1] = v)); // Arrays start 0; overwrite prices Array with defined prices
        return prices[cnt] * (discountTotal || 0.01); // percentage or /100
      }
      Attr(n) {
        return this.getAttribute(n) || "";
      }
    }
    customElements.define(
      "order-forms",
      class extends OrdersHTMLElement {
        get total() {
          let itemCount = 0;
          let itemSummary = "Besteld:\n";
          let totalCost = [...this.querySelectorAll("order-items")].reduce(
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
          // put summary in <textarea> or any other class labeled element
          let summaryTextarea = this.querySelector(".itemSummary");
          if (summaryTextarea.nodeName == "TEXTAREA")
            summaryTextarea.value = itemSummary;
          else if (summaryTextarea) summaryTextarea.innerHTML = itemSummary;
          else console.warn("No .itemSummary defined");
						
          // DISCOUNT EXPERIMENT
          // 50:.9,100,.8
          // total>50?.9:total>100?.8:1
          // `total`
          // <order-discount total="50" discount="90%"></order-discount>
          //console.log(eval("total>50?.9:total>100?.8:1"));
          //if(total>10) total = total *.8;
          //total = this.pricelist("discount", itemcount, total);

          let totalElement = this.querySelector(".orderTotal");
          if (totalElement) totalElement.innerHTML = this.$(totalCost);
          else console.warn("No .orderTotal defined");
          return totalCost;
        }
      }
    );
    customElements.define(
      "order-items",
      class extends OrdersHTMLElement {
        get count() {
           return ~~this.getAttribute("count");
        }
        connectedCallback(count = this.count) {
          this.style.display = "block";
   		  if( count > 10 || count < 1) count = 0;
          this.setAttribute("count", count);			
			
			
		 // attr is the correct value
          let button = (x,id,ibtn) =>
            `<button id="${id}" class="${ibtn}" onclick="this.parentNode.count${x}">${x[0]}</button>`;
          this.innerHTML =            
			/*button("--","min","minus") + */ /*if  count = 0 hide button("--") and hide count*/
            button("++","plus","plusus") +
			`<count> ${count} </count>` +
			(count ? " " + this.$(this.cost) : "")+
			` ${this.Attr("title")} ` +
			` ${this.$(this.price)} ` ;
			// if count = 0 hide min button
			//  ${count || ""}  ${this.$(this.price)} ` +
			// subtotal if count>0
          setTimeout(() => this.closest("order-forms").total); // trigger total update			
			}
        set count(p) {
          this.connectedCallback(p);
        }		   
        get price() {
          return this.pricelist("price", this.count);
        }
        get cost() {
          return this.count * this.price;
        }
      }
    ); 
  } catch (e) {
    console.error("<order-forms><order-items> error:\n", e);
  }