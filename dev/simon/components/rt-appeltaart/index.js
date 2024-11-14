// ===== Import all required modules and components

//--- loadGlobalMods()
// Load base modules into global scope
async function loadGlobalMods(basePath, addModules = []) {
  // Define modules to load
  const modules = [
    { label: 'rtlib', file: 'rt.mjs' },
    { label: 'rtBC', file: 'rt_baseclass.mjs' }
  ];
  addModules.forEach(newMod => modules.push(newMod));
  // Load any missing modules
  return Promise.all(modules.map(async (module) => {
    // Attempt to load module when not present
    if (typeof window[module.label] === 'undefined') {
      try {
        window[module.label] = await import(`${basePath}/modules/${module.file}`);
      } catch (e) {
        throw `module "${module.label}" failed to load`;
      }
    }
    return window[module.label];
  }));
}

// Load any missing modules in to global scope, then dependencies and finally load this component
async function init(module, deps = [], mods = []) {
  // Attempt to load any missing modules
  try {
    await loadGlobalMods(module.split('/').slice(0, -3).join('/'), mods)
  } catch (e) {
    // Stop further loading if any modules fail to load
    console.error(e);
    return
  }

  // Timer start (informational)
  const moduleName = module.split('/').slice(-2)[0];
  console.time(`loadModules for ${moduleName}`);

  // Trigger the Loading of all dependencies
  await Promise.all(deps.map(async (component) => {
    try {
      await import(`../${component}/index.js`);
    } catch (e) {
      console.warn(`Component "${moduleName}" could not load dependency "${component}" so stopping!!`);
      return
    }
  }));

  // Stop timer
  console.timeEnd(`loadModules for ${moduleName}`);

  // Load this component
  rtlib.loadComponent(module);
}

async function initialise(comp) {
  const dependencies = ['rt-orderform', 'rt-datepicker']
  const additionalModules = [
    { label: 'rtForm', file: 'rt_form.mjs' }
  ];
  try {
    window.rtlib = await import(`${comp.split('/').slice(0, -3).join('/')}/modules/rt.mjs`)
    rtlib.init(comp, dependencies, additionalModules);
  } catch (e) {
    console.warn(e);
  }
}
//--- MAIN
initialise(import.meta.url);

