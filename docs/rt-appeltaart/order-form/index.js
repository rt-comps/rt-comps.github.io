// ===== Load component plus any dependancies

// Import library functions
import * as rt from "../../rt.js";

// List dependencies
const components = ["order-item-container"/*,"order-button","order-item"*/];

console.time(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);

// Load all dependencies
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
).then((modules) => {
  console.timeEnd(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
  //modules.forEach((module) => console.log("loaded", modules));
});

console.log("about to load order-form_v2");

// Load this component, specifying preferred version
rt.loadComponent(import.meta.url, "order-form_v2");