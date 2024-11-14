// ===== Import all required modules and components

//--- loadGlobalMods()
// Load base modules into global scope
async function loadGlobalMods(basePath) {
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
  // Load any missing modules in to global scope then load component
  async function init() {
    await loadGlobalMods(import.meta.url.split('/').slice(0, -3).join('/'));
    rtlib.loadComponent(import.meta.url);
  }

  init();
