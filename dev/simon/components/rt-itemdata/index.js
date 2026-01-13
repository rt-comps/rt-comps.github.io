// ===== Import all required modules and components

// Define options
const options = {
  // Required components this component depends on
  dependancies: [
    'rt-itemvariety'
  ]
}

// Start the initialisation
try {
  // Load base module if not already loaded
  if (typeof rtlib === 'undefined') window.rtlib = await import(`${import.meta.url.split('/').slice(0, -3).join('/')}/modules/rt.mjs`);
  // Initialise component
  rtlib.init(import.meta.url, options);
} catch (e) {
  console.error(e);
  throw e
}
