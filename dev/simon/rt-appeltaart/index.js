// ===== Import all required modules and components

// --- loadGlobalMods()
// Load base modules into global scope
async function loadGlobalMods() {
  // Assumes that modules are accesible at the same location.
  const basePath = import.meta.url.split('/').slice(0, -2).join('/');
  // RT function library
  window.rtlib = await import(`${basePath}/rt.js`);
  // RT BaseClass
  window.rtBC = await import(`${basePath}/rt_baseclass.js`);
  // Place current version in global variable
  window.formVer = '5'
}

// First load shared modules in to global scope then load components
loadGlobalMods().then(() => {
  moduleName = import.meta.url.split('/').slice(-2)[0];
  // Timer start (information only)
  console.time(`loadModules for ${moduleName}`);

  // List of dependancies
  //  components will be loaded in parallel, so load order cannot be depended on.
  const components = ['ate-form'];

  // Load all required top-level components
  Promise.all(components.map((componentName) => import(`./${componentName}/index.js`))).then(() => {
    // Stop timer
    console.timeEnd(`loadModules for ${moduleName}`);
  });
})