// ===== Import all required modules and components

// --- loadGlobalMods()
// Load base modules in to global scope
async function loadGlobalMods(){
  // Assumes that modules are accesible at the same location.
  const basePath = import.meta.url.split('/').slice(0,-2).join('/');
  // Pull in modules and assign to global namespace
  window.rt = await import(`${basePath}/rt.js`);
  window.rtBase = await import(`${basePath}/rt_baseclass.js`);
}

// First load shared modules in to global scope then load components
loadGlobalMods().then(() => {
  //  components will be loaded in parallel, so load order cannot be depended on.
  console.time(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
  
  // List all required top-level components
  const components = ["order-form"];
  
  // Load all required top-level components
  Promise.all(
    components.map((componentName) => import(`./${componentName}/index.js`))
    ).then((modules) => {
      console.timeEnd(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
      //modules.forEach((module) => console.log("loaded", modules));
    });
  })