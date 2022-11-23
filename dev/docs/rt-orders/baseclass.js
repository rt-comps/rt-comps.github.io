// ================================================================
// get BaseClass from PARENT directory name
// get component name from directory name
let [BaseClass, componentName] = import.meta.url.split("/").slice(-3);
// ================================================================

// ================================================================
class BaseClassHTMLElement extends HTMLElement {
  // ---------------------------------------------------------------- $createElement
  $createElement(
    {
      tag = "div",
      innerHTML = "",
      classes = [],
      attrs = {},
      Elements = [],
      ...props
    } = {},
    // advanced configuration:
    {
      root = this.shadowRoot || this, //!! default root is shadowRoot
      insertroot = "append", //!! default  append (or: prepend)
      insertchildren = "append", //!! append (or: prepend) children
    } = {}
  ) {
    tag = document.createElement(tag);
    //this.setAttributes(attrs, el);
    Object.keys(attrs).map((key) => tag.setAttribute(key, attrs[key]));
    classes.length && tag.classList.add(...classes);
    Object.assign(tag, props);
    innerHTML && (tag.innerHTML = innerHTML);
    tag[insertchildren](...Elements.flat());
    root && root[insertroot](tag);
    return tag;
  }
  // ----------------------------------------------------------------
}
// ================================================================
customElements.define(
  componentName,
  class extends BaseClassHTMLElement {
    // ---------------------------------------------------------------- Attr
    Attr(name, defaultValue = "") {
      return this.getAttribute(name) || defaultValue;
    }
    Attr2NumberArray(attr) {
      // String "250,200,200" to Array [250,200,200]
      return this.$attr(attr)
        .split(",")
        .map(
          (x) => Number(x) || console.error(attr, "contains illegal number", x)
        );
    }
    // ---------------------------------------------------------------- $
    // format value as Euro NL currency string
    $euro(value) {
      return Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "eur",
      }).format(value);
    }
    // ---------------------------------------------------------------- getTemplate
    getTemplate(template_id = this.nodeName) {
      let template = document.getElementById(template_id);
      if (template) return template.content.cloneNode(true);
      else {
        console.warn("Template not found:", template_id);
        return document.createElement("span");
      }
    }
    // ---------------------------------------------------------------- pricelist
    pricelist(prices_attr, count, discountTotal = false) {
      // return price for count (items)
      // 1 and 2 buy for 13.00
      // 3 buy for 11.00
      // 4 buy for 10.00
      // read price(s) "1300,1300,1100,1000"
      let pricesArray = this.prices; // from order-item.js
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
    // ----------------------------------------------------------------
    $dispatch({
      name = "order", // EventName
      detail = {}, // event.detail
      // override options PER option:
      bubbles = true, // default, bubbles up the DOM
      composed = true, // default, escape shadowRoots
      cancelable = true, // default, cancelable event bubbling
      // optional overwrite whole options settings, or use already specified options
      options = {
        bubbles,
        composed,
        cancelable,
      },
      eventbus = this, // default dispatch from current this element or use something like eventbus:document
      once = false, // default .dispatchEvent option to execute a Listener once
      silent = false, // default log to console, so each dispatch can be execute quietly with silent:true
    }) {
      console.warn("%c EventName:", "background:yellow", name, [detail]);
      eventbus.dispatchEvent(
        new CustomEvent(name, {
          ...options, //
          detail,
        }),
        once // default false
      );
    }

    // ----------------------------------------------------------------
  }
);
console.log("Loaded: BaseClass", BaseClass);
