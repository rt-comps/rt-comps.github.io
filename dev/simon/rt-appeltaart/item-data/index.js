// ===== Load component plus any dependancies
// Start timer
const moduleName = import.meta.url.split('/').slice(-2)[0];
console.time(`loadModules for ${moduleName}`);

// List of dependencies
const components = ['item-variety'];

// Load all dependencies
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
  ).then(() => {
    console.timeEnd(`loadModules for ${moduleName}`);
    // Load this component, with optional preferred version specified
    rtlib.loadComponent(import.meta.url, '3');
  }); 