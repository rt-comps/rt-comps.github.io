// ===== Load component plus any dependancies
// Start timer
const moduleName = import.meta.url.split('/').slice(-2)[0];
console.time(`loadModules for ${moduleName}`);

// List of dependencies
const components = ["menu-item-container"];

// Load all dependencies
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
  ).then(() => {
    console.timeEnd(`loadModules for ${moduleName}`);
    // Load this component, with optional preferred version specified
    rt.loadComponent(import.meta.url, 'order-form_v2');
  });
  