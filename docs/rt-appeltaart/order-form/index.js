// ===== Load component plus any dependancies
// +++ Import library functions
// Calculate absolute path, checking if dev
const sharedModPath = `${import.meta.url.indexOf('/docs/')>-1?import.meta.url.split('/').slice(0,4).join('/'):'//rt-comps.github.io'}`
// Load module dynamically
const rt = await import(`${sharedModPath}/rt.js`);

// List of dependencies
const components = ["menu-item-container"];
const moduleName = import.meta.url.split('/').slice(-2)[0];

// Start timer
console.time(`loadModules for ${moduleName}`);
// Load all dependencies
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
  ).then(() => {
    console.timeEnd(`loadModules for ${moduleName}`);
    // Load this component, with optional preferred version specified
    rt.loadComponent(import.meta.url, 'order-form_v2');
  });
  