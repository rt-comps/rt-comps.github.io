// ================================================================
// Extend the HTMLElement class with methods commonly used by
// Roads Technology

class RTBaseHTMLElement extends HTMLElement {
  // ------- $createElement
  // Wrapper for .createElement() to extend function flexibility
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
    // Create the new element
    let newEl = document.createElement(tag);
    // Set any provided attributes
    Object.keys(attrs).map((key) => newEl.setAttribute(key, attrs[key]));
    // Add CSS class names if provided
    classes.length && newEl.classList.add(...classes);
    // Copy any other provided properties in to element 
    Object.assign(newEl, props);
    // Set innerHTML if provided
    innerHTML && (newEl.innerHTML = innerHTML);
    // Add any elements provided in array using method provided in insertchildren
    newEl[insertchildren](...Elements.flat());
    // Add element to DOM element to root element using method provided in insertroot
    root && root[insertroot](newEl);

    return newEl;
  }

  // ------- $attr
  // Return the value of an attribute if it exists.  
  //  If the named attribute does not exist then return a specified default value or empty string
  $attr(name, defaultValue = "") {
    return this.getAttribute(name) || defaultValue;
  }

  // ------- $attr2NumArray
  // Convert a comma delimited text string of numbers into an array
  $attr2NumArray(attr) {
    // String "250,200,200" to Array [250,200,200]
    return this.$attr(attr)
      .split(",")
      .map(
        (x) => Number(x) || console.error(attr, "contains illegal number", x)
      );
  }

  // ------- $euro
  // format value as Euro NL currency string
  $euro(value) {
    return Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "eur",
    }).format(value);
  }

  // ------- $getTemplate
  // Returns an HTML node based on the contents of a named <template> section in the document.
  // Assumes that the <template> element was created previously
  $getTemplate(template_id = this.nodeName) {
    let template = document.getElementById(template_id);
    if (template) return template.content.cloneNode(true);
    else {
      console.warn("Template not found:", template_id);
      return document.createElement("span");
    }
  }

  // ------- $dispatch
  // Generalised event dispatch with options provided as an object
  $dispatch({
    name = "name_not_provided", // EventName
    // Option defaults
    detail = {}, // event.detail
    bubbles = true, // default, bubbles up the DOM
    composed = true, // default, escape shadowRoots
    cancelable = true, // default, cancelable event bubbling
    // optional overwrite whole options settings, or use already specified options
    options = {
      bubbles,
      composed,
      cancelable,
      detail
    },
    eventbus = this, // default dispatch from current this element or use something like eventbus:document
    once = false, // default .dispatchEvent option to execute a Listener once
    silent = false, // default log to console, so each dispatch can be execute quietly with silent:true
  }) {
    console.warn("%c EventName:", "background:yellow", name, [detail]);
    eventbus.dispatchEvent(new CustomEvent(name, options), once);
  }

}
export { RTBaseHTMLElement };