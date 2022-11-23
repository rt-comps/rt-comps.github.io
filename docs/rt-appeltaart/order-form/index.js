// ===== Load component plus any dependancies
// Import library functions
import * as rt from "./docs/rt.js";

console.log(rt);

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
  
  