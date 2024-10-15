# Components Directory #

This directory is intended to hold all components.

Each component is expected to be loaded as a module (`import()`) and to reside in its own directory that has the following structure (as a minimum)
```
components/
|- elementName/  
|  |- index.js  
|  |- elementName.html  
|  |- elementName.js
modules/
```
Where ***elementName*** is the name of the custom tag.  
` `  
` `  
The following sections describe the structure of each of these files  
` `  
` `  

---

## index.js

This file is used to initiating the loading of this module.  

For higher level components, it will likely be necessary to load the base modules so the code could like
```js
// Async function to load base modules into global scope
async function loadGlobalMods(basePath) {
    // List modules to load and a global-scope labels for access
    const modules = [
        { label: 'rtlib', file: 'rt.mjs' },
        { label: 'rtBC', file: 'rt_baseclass.mjs' }
    ];
    // Simultaneously load modules into global scope, if not already present
    return Promise.all(modules.map((module) => { 
        if (typeof window[module.label] === 'undefined') 
         import(`${basePath}/modules/${module.file}`)
          .then((result) => window[module.label] = result);
    }));
}

// Load any modules in to global scope, dependencies and then load component
loadGlobalMods(import.meta.url.split('/').slice(0, -3).join('/'))
 .then(() => {
  // List of dependancies
  //  components will be loaded in parallel, so load order cannot be depended on.
  const components = ['rt-dep1', 'rt-dep2'];

  // Load all dependencies
  Promise.all(components.map((componentName) => import(`../${componentName}/index.js`)))
   .then(() => {
    // Load this component
    rtlib.loadComponent(import.meta.url);
  });
 });
```
This code initiates the loading of components that this component is dependent on before actually loading the component itself.  
` `  
` `  
If it can reasonably be expected that the `rt.mjs` & `rt_baseclass.mjs` modules have been loaded and there are no dependancies then this file can be as simple as
```js
rtlib.loadComponent(import.meta.url);
```  
` `  
` `  

---

## elementName.html
This file contains a template for the code destined for the Shadow DOM.  The file should exist even if it is empty.

Typically, a file will contain something like
```html
&lt;template id="ELEMENTNAME">
    &lt;!-- Some HTML content -->
&lt;/template>
```  
` `  
` `  

---

## elementName.js
This is the actual definition of your component.

Typically, this file will have a base structure of
```js
// Get component name from directory name
const [compName] = rtlib.parseURL(import.meta.url);

// Define the element usin the template in the associated .html file
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
const [compName] = rtlib.parseURL(import.meta.url);

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
