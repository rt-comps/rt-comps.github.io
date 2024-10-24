[< Back](README.md)
# index.js

This file is used to initiating the loading of this module.  

For top-level components, it will likely be necessary to load the base modules so the code could like
```js
// Async function to load base modules into global scope
async function loadGlobalMods(basePath) {
    // List modules to load and a global-scope labels for access
    const modules = [
        { label: 'rtlib', file: 'rt.mjs' },
        { label: 'rtBC', file: 'rt_baseclass.mjs' }
    ];
    // Load any missing modules
    return Promise.all(modules.map(async (module) => {
        if (typeof window[module.label] === 'undefined') {
        window[module.label] = await import(`${basePath}/modules/${module.file}`)
            .catch(e => Promise.reject(`Failed to load '${module.file}' into '${module.label}'`));
        } else return true;
    }));
}

// Load any missing modules in to global scope then dependencies and finally load component
loadGlobalMods(import.meta.url.split('/').slice(0, -3).join('/'))
    .then(() => {
        // List of dependancies
        const components = ['rt-dep1', 'rt-dep2'];
        // Load dependencies
        Promise.all(components.map((component) => import(`../${component}/index.js`)
            .catch(e => 
                console.error(`${e.message} ${moduleName.toUpperCase()} could not find ${component.toUpperCase()}`)))
        ).then(() => rtlib.loadComponent(import.meta.url)); // Load this component    
    });
```
This code initiates the loading of components that this component is dependent on before actually loading the component itself.  
  
If it can reasonably be expected that the `rt.mjs` & `rt_baseclass.mjs` modules have been loaded and there are no dependancies then this file can be as simple as
```js
rtlib.loadComponent(import.meta.url);
```  

