[< Back](README.md)
# index.js

This file is used to initiating the loading of this module.  

- The following should be used for any top-level component with dependencies
```js
// Load base modules into global scope
function loadGlobalMods(basePath) {
  // Define modules to load
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

// Load any missing modules in to global scope
// ...then initiate dependency loading
// ...finally, load component
loadGlobalMods(import.meta.url.split('/').slice(0, -3).join('/'))
  .then(() => {
    // List of dependencies
    const components = ['rt-dep1', 'rt-dep2'];
    // Trigger the Loading of all dependencies then load this component
    Promise.all(components.map((component) => import(`../${component}/index.js`)
      .catch(e => console.error(`${e.message} ${moduleName.toUpperCase()} could not find ${component.toUpperCase()}`)))
    ).then(() => rtlib.loadComponent(import.meta.url))
  });
```
- For top-level components with no dependencies then this can be simplified to
```js
// Load base modules into global scope
function loadGlobalMods(basePath) {
  // Define modules to load
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

// Load any missing modules in to global scope
// ...then load component
loadGlobalMods(import.meta.url.split('/').slice(0, -3).join('/'))
  .then(() => rtlib.loadComponent(import.meta.url));
```
- For sub-components it can reasonably be expected that the `rt.mjs` & `rt_baseclass.mjs` modules have been loaded and so, as there are no dependancies, this file can be as simple as
```js
rtlib.loadComponent(import.meta.url);
```  

