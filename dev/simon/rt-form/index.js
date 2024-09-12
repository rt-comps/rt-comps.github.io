// ===== Import all required modules and components

// --- loadGlobalMods()
// Load base modules/classes into global scope if not already loaded
async function loadGlobalMods() {
  // Assumes that modules are accesible at the same location.
  const basePath = import.meta.url.split('/').slice(0, -2).join('/');
  // RT function library
  if (typeof rtlib === 'undefined') window.rtlib = await import(`${basePath}/rt.js`);
  // RT BaseClass
  if (typeof rtBC === 'undefined') window.rtBC = await import(`${basePath}/rt_baseclass.js`);
  // Form functions
  if (typeof rtForm === 'undefined') window.rtForm = await import(`${basePath}/rt_form.js`);
}

// First load shared modules in to global scope then load components
loadGlobalMods().then(() => {
  const moduleName = import.meta.url.split('/').slice(-2)[0];
  // Timer start (information only)
  console.time(`loadModules for ${moduleName}`);

  // List of dependancies
  //  components will be loaded in parallel, so load order cannot be depended on.
  const components = ['order-form'];

  // Load all required top-level components
  Promise.all(components.map((componentName) => import(`./${componentName}/index.js`))).then(() => {
    // Stop timer
    console.timeEnd(`loadModules for ${moduleName}`);
  });
})