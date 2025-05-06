// ===== Import all required modules and components

try {
  // Load base module if not already loaded
  if (typeof rtlib === 'undefined') window.rtlib = await import(`${import.meta.url.split('/').slice(0, -3).join('/')}/modules/rt.mjs`)
  // Initialise component
  rtlib.init(import.meta.url);
} catch (e) {
  console.warn(e);
}

