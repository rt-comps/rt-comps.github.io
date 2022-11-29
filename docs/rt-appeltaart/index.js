// ===== Import all required top-level components
// Start by loading base modules in to global scope
import('../rt_load.js').then(()=> 
{
  //  components will be loaded in parallel, so load order cannot be depended on.
  console.time(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
  
  // List all required top-level components
  const components = ["order-form"];
  
  // Load all required top-level components
  Promise.all(
    components.map((componentName) => import(`./${componentName}/index.js`))
    ).then((modules) => {
      console.timeEnd(`loadModules for ${import.meta.url.split('/').slice(-2)[0]}`);
      //modules.forEach((module) => console.log("loaded", modules));
    });
  })