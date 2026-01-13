// ===== Import all required modules and components

// Determine extra URL for unique dependancies
const compUrlArray = import.meta.url.split('/');
const comp = compUrlArray[compUrlArray.length - 2];

// Load unique sub-components
const options = {
  dependancies: [
    [comp, 'of-menuitem']
  ]
}

// Start the initialisation
try {
  // Load base module if not already loaded
  if (typeof rtlib === 'undefined') window.rtlib = await import(`${compUrlArray.slice(0, -3).join('/')}/modules/rt.mjs`)
  // Initialise component
  rtlib.init(import.meta.url, options);
} catch (e) {
  console.error(e);
  throw e
}