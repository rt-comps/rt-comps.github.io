// ===== Import all required top-level components 
//  components will be loaded in parallel, so load order cannot be depended on.
console.time(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
const basePath=`https://${import.meta.url.split('/')[2]}`;
console.log(import.meta.url.split('/'));
console.log(import.meta.url.split('/').slice(2));
const {testPath1,testPath2}=import.meta.url.split('/').slice(2);
console.log(`testPath1: ${testPath1}`);
console.log(`testPath2: ${testPath2}`);

// List all required top-level components
const components = ["order-form"];

// Load all required top-level components
Promise.all(
  components.map((componentName) => import(`${basePath}/${componentName}/index.js`))
).then((modules) => {
  console.timeEnd(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
  //modules.forEach((module) => console.log("loaded", modules));
});
