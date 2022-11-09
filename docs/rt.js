// ./components/rt.js

// ================================================================
export const html = (strings, ...values) =>
String.raw({ raw: strings }, ...values);

// ================================================================
export function defineComponent(url, classDefinition) {}
// ================================================================
export function dispatch({ name, root = document }) {
  root.dispatchEvent(new CustomEvent(name, { detail }));
}

// ================================================================
async function loadTemplate(componentName, url) {
  try {
    let response = await fetch(url);
    if (response.ok) {
      let html = await response.text(); // wait for text stream to be read
      //console.warn("load template",componentName, dom.querySelector("template"));
      document.head.insertAdjacentHTML("beforeend", html);
      console.warn("load template", componentName);
    }
  } catch (e) {
    console.log(e);
  }
}


// ================================================================
// Load a new component.
// Expects...
// URL of compoment (required)
// Base Filename of component files (optional)
// 
export function loadComponent(url, filename = false) {
  console.log(`in loadComponent for ${url} - ${filename}`);

  // Determine base path
  // While import() interprets relative paths as relative to the module path,
  // fetch() connsiders relative paths as relative to the browser location!
  // For this reason, relative paths cannot be used.

  // get component name from directory name
  const [hostName, parentDir, compDir] = url.split("/").slice(2);
  console.log(`Loading Comp ${parentDir} : ${compDir}`);
  
  // If filename not provided then assume filename matches directory name
  const compFile = filename || compDir;

  const baseFilePath = `https://${hostName}/${parentDir}/${compDir}/${compFile}`;
  
  /*{
    // devComponent string
    let devComponent = "dev-" + compFile;
    
    // get filename from localStorage
    let storageFileName = localStorage.getItem(devComponent);
    
    // override compFile
    if (storageFileName) {
      compFile = storageFileName;
      console.warn(compDir, "localStorage override: " + compFile);
    } else if (location.href.includes(devComponent)) {
      let paramFileName = new URLSearchParams(location.search).get(
        devComponent
        );
        compFile = paramFileName || devComponent;
        console.warn(compDir, "URL override: " + compFile);
      }
    }*/
        
    // import the components HTML files into a <template> in the document.head
    loadTemplate(compFile, `${baseFilePath}.html`);
    
    //! todo import js_module AFTER html is loaded
    setTimeout(() => {
      let js_module = `${baseFilePath}.js`;
      import(js_module)
      .then((module) => {
        console.log("loaded", js_module);
        //if export default defined in module file then:
        //module.default();
      })
      .catch((err) => {
        console.error("failed import", js_module, err);
      });
    }, 100);
}