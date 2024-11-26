// ===== Import all required modules and components

// --- initialise
// An 'async' function to allow use of 'await' for module load
async function initialise(comp, options = {}) {
  try {
    // Load base module if not already loaded
    if (typeof rtlib === 'undefined') window.rtlib = await import(`${comp.split('/').slice(0, -3).join('/')}/modules/rt.mjs`)
    // Initialise component
    rtlib.init(comp, options.dependencies, options.additionalModules);
  } catch (e) {
    console.warn(e);
  }
}

//--- MAIN
const options = {
  // Required components this component depends on
  dependencies: [
    'rt-orderform',
    'rt-datepicker'
  ],
  // Modules desired in addition to base module and base class
  additionalModules: [
    {
      label: 'rtform',
      file: 'rt_form.mjs'
    }
  ]
}
// Start the initialisation
initialise(import.meta.url, options);
