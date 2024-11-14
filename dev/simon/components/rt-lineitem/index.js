// ===== Import all required modules and components

//--- loadGlobalMods()
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

//--- MAIN
// Load any missing modules in to global scope, dependencies and then load component
loadGlobalMods(import.meta.url.split('/').slice(0, -3).join('/'))
  .then(() => {
    // Timer start (informational)
    const moduleName = import.meta.url.split('/').slice(-2)[0];
    console.time(`loadModules for ${moduleName}`);
    // List of dependancies
    const components = ['rt-plusminus'];
    // Load all required top-level components
    Promise.all(components.map((component) => import(`../${component}/index.js`)
      .catch(e => console.error(`${e.message} ${moduleName.toUpperCase()} could not find ${component.toUpperCase()}`)))
    ).then(() => {
      // Stop timer
      console.timeEnd(`loadModules for ${moduleName}`);
      // Load this component
      rtlib.loadComponent(import.meta.url);
    });
  });
 