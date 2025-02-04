[< Back](README.md)
# index.js

This file is used to initiating the loading of the component.

```js
// ===== Import all required modules and components

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

//--- MAIN
const options = {
    dependencies: [],
    additionalModules: []
}
initialise(import.meta.url, options);
```
It depends on the ***rtlib*** module so every file must contain an attempt to load the function before continuing
*Notes:* 
 - All aspects of `options` are optional (including `options` itself) and can be excluded.
 - If a component has no dependencies and is always a dependent of another component then it can be assumed that ***rtlib*** is loaded and initialisation can be achieved with
```js
rtlib.init(import.meta.url)
```  
