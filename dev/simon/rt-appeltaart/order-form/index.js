// ===== Load component plus any dependancies
// Start timer (informational)
const moduleName = import.meta.url.split('/').slice(-2)[0];
console.time(`loadModules for ${moduleName}`);

// List of dependencies
const components = ['menu-item','item-data','line-item'];

// Trigger the Loading of all dependencies then load this component
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
  ).then(() => {
    // Stop timer
    console.timeEnd(`loadModules for ${moduleName}`);
    // Load this component, with optional version
rtlib.loadComponent(import.meta.url, appelTartVer);
  });  