// ===== Import all required modules and components

//--- MAIN
// Determine extra URL for unique dependencies
const compUrlArray = import.meta.url.split('/');
const comp = compUrlArray[compUrlArray.length - 2];

// Load unique sub-components
const options = {
  dependencies: [
    [comp, 'of-menuitem']
  ]
}

// Start the initialisation
try {
  // Load base module if not already loaded
  if (typeof rtlib === 'undefined') window.rtlib = await import(`${import.meta.url.split('/').slice(0, -3).join('/')}/modules/rt.mjs`)
  // Initialise component
  rtlib.init(import.meta.url, options);
} catch (e) {
  console.error(e);
  throw e
}