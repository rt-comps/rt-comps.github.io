// ===== Import all required modules and components

// --- loadGlobalMods()
// Load base modules into global scope
async function loadGlobalMods(basePath) {

  console.log(basePath)
  // Define modules to load
  // [
  //    { label: <moduleName>, file: <moduleURL> },
  //    ...
  // ]
  const modules = [
    { label: 'rtlib', file: 'rt.mjs' },
    { label: 'rtBC', file: 'rt_baseclass.mjs' },
    { label: 'rtForm', file: 'rt_form.mjs' }
  ]
  // Simultaneously load modules into global scope, if not already present
  return Promise.all(modules.map((module) => { if (typeof window[module.label] === 'undefined') import(`${basePath}/modules/${module.file}`).then((result) => window[module.label] = result) }))
}

// --- Main
// Store this file url as array
const splitURL = import.meta.url.split('/');

// Load any modules in to global scope, dependencies and then load component
loadGlobalMods(splitURL.slice(0, -3).join('/')).then(() => {
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
})
