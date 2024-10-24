// ===== Import all required modules and components

// --- loadGlobalMods()
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
      console.log(`Loading ${module.file} in ${import.meta.url.split('/').slice(-2)[0]}`);
      window[module.label] = await import(`${basePath}/modules/${module.file}`)
        .catch(e => Promise.reject(`Failed to load '${module.file}' into '${module.label}'`));
    } else return true;
  }));
}

//--- MAIN
// Load any missing modules in to global scope, dependencies and then load component
loadGlobalMods(import.meta.url.split('/').slice(0, -3).join('/'))
  .then(() => {
    // ===== Load component plus any dependancies
    // Timer start (information only) (informational)
    const moduleName = import.meta.url.split('/').slice(-2)[0];
    console.time(`loadModules for ${moduleName}`);
    // List of dependencies
    //const components = ['menu-item', 'item-data', 'line-item', 'pickup-locations', 'form-field'];
    const components = ['rt-menuitem', 'rt-itemdata', 'rt-lineitem', 'rt-pickup-locations', 'rt-form-field'];

    // Trigger the Loading of all dependencies then load this component
    Promise.all(components.map((component) => import(`../${component}/index.js`)
      .catch(e => console.error(`${e.message} ${moduleName.toUpperCase()} could not find ${component.toUpperCase()}`)))
    ).then(() => {
      // Stop timer
      console.timeEnd(`loadModules for ${moduleName}`);
      // Load this component, with optional version
      rtlib.loadComponent(import.meta.url);
    })
  });  
