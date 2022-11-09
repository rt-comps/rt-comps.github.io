// ===== Import all required top-level components 
//  components will be loaded in parallel, so load order cannot be depended on.
console.time(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
console.log(import.meta.url.split('/'));
console.log(import.meta.url.split('/').slice(2));
const [hostPath,compPath]=import.meta.url.split('/').slice(2);
const basePath=`https://${hostPath}/${compPath}`;
// List all required top-level components
const components = ["order-form"];

// Load all required top-level components
Promise.all(
  components.map((componentName) => import(`${basePath}/${componentName}/index.js`))
).then((modules) => {
  console.timeEnd(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
  //modules.forEach((module) => console.log("loaded", modules));
});
