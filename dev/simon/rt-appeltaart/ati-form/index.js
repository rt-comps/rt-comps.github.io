// ===== Load component plus any dependancies
// Start timer (informational)
const moduleName = import.meta.url.split('/').slice(-2)[0];
console.time(`loadModules for ${moduleName}`);

if (customElements.get('order-form')){
  console.warn('order-form already defined!!');
  stop();
}

// List of dependencies
const components = ['../rt-form', '../rt-datumpick'];

// Trigger the Loading of all dependencies then load this component
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
).then(() => {
  // Stop timer
  console.timeEnd(`loadModules for ${moduleName}`);
  // Load this component
  rtlib.loadComponent(import.meta.url);
});  