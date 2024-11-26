[< Back](README.md)
# index.js

This file is used to initiating the loading of this module.

It depends on the ***rtlib*** module so every file contains the following `async` function that ensures the module has been loaded before continuing

```js
// ===== Import all required modules and components

// --- initialise
// An 'async' function to allow use of 'await' for module load
async function initialise(comp, options = {}) {
  try {
    // Load base module if not already loaded
    if (typeof rtlib === 'undefined') window.rtlib = await import(`${comp.split('/').slice(0, -3).join('/')}/modules/rt.mjs`)
    // Initialise component
    rtlib.init(comp, options.dependencies, options.additionalModules);
  } catch (e) {
    console.warn(e);
  }
}
```
The main code that follows depends on what the component requires but a component that utilises all the functionality may look like
```js 
//--- MAIN
const options = {
  // Required components this component depends on
  dependencies: [
    'rt-orderform',
    'rt-datepicker'
  ],
  // Modules desired in addition to base module and base class
  additionalModules: [
    {
      label: 'rtform',
      file: 'rt_form.mjs'
    }
  ]
}
// Start the initialisation
initialise(import.meta.url, options);
```
All properties of `options` and `options` itself are optional so the main code could be as simple as
```js
//--- MAIN
// Start the initialisation
initialise(import.meta.url);
``` 