// ===== Load component plus any dependancies
/*
// +++ Import library functions
// Check if dev
const sharedModPath = `${import.meta.url.indexOf('/docs/')>-1?import.meta.url.split('/').slice(0,4).join('/'):'//rt-comps.github.io'}`
// Load module dynamically
const rt = await import(`${sharedModPath}/rt.js`);
*/

// List of dependencies
const components = ["menu-item","menu-button"];

// Start timer
console.time(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
// Load all dependencies
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
  ).then(() => {
    console.timeEnd(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
    // Load this component, specifying preferred version
    rt.loadComponent(import.meta.url,"menu-item-container");
  });
  

