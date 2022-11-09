// import all the components in this directory structure
// components will be loaded in parallel, so loaded order can be different

console.time("loadModules");

// await for BaseClass to be defined
let baseclassModule = await import(`./baseclass.js`);

// is there any value in baseclassModule??
console.log("Loaded: BaseClass", baseclassModule);

// define all child Components based on this BaseClass
let components = ["order-item-container","order-button", "order-form", "order-item"];

Promise.all(
  components.map((componentName) => import(`./${componentName}/index.js`))
).then((modules) => {
  console.timeEnd("loadModules");
  //modules.forEach((module) => console.log("loaded", modules));
});
