[< Back](README.md)
sdfds
# elementName.js
This is the actual definition of your component.

Typically, this file will have a base structure of
```js
// Get component name from directory name
const [compName] = rtlib.parseCompURL(import.meta.url);

// Define the element using the template in the associated .html file
customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        /// ### PRIVATE CLASS FIELDS
        #_sR;   // shadowRoot node

        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Initialise 'this'
            super();
            // Attach shadowDOM and store reference in private field
            this.#_sR = this.attachShadow({ mode: "open" });
            // Attach contents of template - placed in document.head by LoadComponent()
            this.#_sR.append(this.$getTemplate());
        }
        //+++ End Of Lifecycle Events
    }
);
```
If you are not likely to use the `shadowRoot` a significant amount then you could abbreviate this to
```js
// Get component name from directory name
const [compName] = rtlib.parseCompURL(import.meta.url);

// Define the element usin the template in the associated .html file
customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Initialise 'this', attach shadow DOM and populate with template
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());
        }
        //+++ End Of Lifecycle Events
    }
);
```