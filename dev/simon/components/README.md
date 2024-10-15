# Components Directory #

This directory is intended to hold all components.

Each component is expected to be loaded as a module (`import()`) and to reside in its own directory that has the following structure (as a minimum)

    elementName/  
    |- index.js  
    |- elementName.html  
    |- elementName.js

---

## index.js

This file is used to load any global modules plus any components that this component uses.

If it can reasonably be expected that the `rt.mjs` module has been loaded and there are no dependancies then this file can be as simple as
```js
rtlib.loadComponent(import.meta.url);
```
For higher level components, it will probably be necessary to load the modules so the code could look more like
```js
// Async function to load base modules into global scope
async function loadGlobalMods(basePath) {
    // List modules to load and a global-scope labels for access
    const modules = [
        { label: 'rtlib', file: 'rt.mjs' },
        { label: 'rtBC', file: 'rt_baseclass.mjs' },
        { label: 'rtForm', file: 'rt_form.mjs' }
    ];
    // Simultaneously load modules into global scope, if not already present
    return Promise.all(modules.map((module) => { 
        if (typeof window[module.label] === 'undefined') 
         import(`${basePath}/modules/${module.file}`)
          .then((result) => window[module.label] = result);
    }));
}

// Main code starts here
// Store this file url as array
const splitURL = import.meta.url.split('/');

// Load any modules in to global scope, dependencies and then load component
loadGlobalMods(splitURL.slice(0, -3).join('/'))
 .then(() => {
  const moduleName = splitURL.slice(-2)[0];
  // Timer start (information only)
  console.time(`loadModules for ${moduleName}`);
  // List of dependancies
  //  components will be loaded in parallel, so load order cannot be depended on.
  const components = ['rt-orderform', 'rt-datepicker'];

  // Load all required top-level components
  Promise.all(components.map((componentName) => import(`../${componentName}/index.js`))).then(() => {
    // Stop timer
    console.timeEnd(`loadModules for ${moduleName}`);
    // Load this component
    rtlib.loadComponent(import.meta.url);
  });
 });
```
## elementName.html

## elementName.js


