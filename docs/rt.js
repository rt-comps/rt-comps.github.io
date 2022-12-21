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
// Extract hostname, component name and path from URL
export function parseURL(url){
  // Split URL unto array using / as delimiter
  // 'http://test:5500/mypath/component/filename' => ['http','',test:5500','mypath','component','filename']
  const urlArray = url.split('/');
  // Recover hostname:port component
  const hostName = `${urlArray[0]}//${urlArray[2]}`;
  // Recover component name (via folder)
  const compName = urlArray[urlArray.length -2];
  // Recover path
  // Extract path between hostname and component name - if present
  const basePath = (urlArray.length > 4)? urlArray.slice(3,-2).join('/') : '';
  
  //console.warn([compName,basePath,hostName]);
  return [compName,basePath,hostName];
}

// ================================================================
// Add a template to document.head for a component to use when instantiating
// URL should be absolute
// componentName is required but can be arbitrary text.
async function loadTemplate(componentName, url) {
  try {
    let response = await fetch(url);
    if (response.ok) {
      let html = await response.text(); // wait for text stream to be read
      //console.warn("load template",componentName, dom.querySelector("template"));
      document.head.insertAdjacentHTML("beforeend", html);
    }
  } catch (e) {
    console.log(`failed to load ${url}`);
    console.log(e);
  }
}

// ================================================================
// Load a new component.
// Expects...
// URL of compoment (required)
// File version (optional)
// 
export function loadComponent(url, version = false) {
  // Parse URL in to useful values
  const [ compDir, parentDir, hostName ] = parseURL(url);
  // If version not provided then use directory name
  const compFile = `${compDir}${version ? '_'+version : ''}`;
  // Build file path (excluding file extension)
  //  const baseFilePath = `https://${hostName}/${parentDir}/${compDir}/${compFile}`;
  const baseFilePath = `${hostName}/${parentDir}/${compDir}/${compFile}`;
  
  // Import the components HTML files into a <template> in the document.head
  //  loadTemplate uses fetch() so absolute URL must be provided
  loadTemplate(compFile, `${baseFilePath}.html`);
  
  //! todo import js_module AFTER html is loaded
  setTimeout(() => {
    const js_module = `${baseFilePath}.js`;
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