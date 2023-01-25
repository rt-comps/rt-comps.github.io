// ================================================================
export const html = (strings, ...values) =>
String.raw({ raw: strings }, ...values);
// ================================================================
//export function defineComponent(url, classDefinition) {}
// ================================================================
//export function dispatch({ name, root = document }) {
//  root.dispatchEvent(new CustomEvent(name, { detail }));
//}

// ================================================================
// Extract hostname, component name and path from URL
export function parseURL(url){
  // Split URL into array using / as delimiter
  // 'http://test:5500/mypath/component/filename' => ['http','',test:5500','mypath','component','filename']
  const urlArray = url.split('/');
  // Recover component name - will be second from last element
  const compName = urlArray[urlArray.length -2];
  // Recover absolute path - everything before second to last element
  const basePath = urlArray.slice(0, urlArray.length-2).join('/');
  // Recover hostname:port - is this used?
  const hostName = urlArray.slice(0, 3).join('/');

  return [compName,basePath,hostName];
}

// ================================================================
// Add a template to document.head for a component to use when instantiating
// URL must be absolute
async function loadTemplate(url) {
  try {
    let response = await fetch(url);
    if (response.ok) {
      let html = await response.text(); // wait for text stream to be read
      // Insert the template HTML in to the document.head
      document.head.insertAdjacentHTML("beforeend", html);
    }
  } catch (e) {
    console.log(`failed to load ${url}`);
    console.log(e);
  }
}

// ================================================================
// Load a new component.
//
// url      : URL of calling file - assume it is in component directory
// version  : Numeric version of code to use
// 
export function loadComponent(url, version = false) {
  // Parse URL in to useful values
  const [ compDir, basePath ] = parseURL(url);
  // Get filename by adding version string to directory name if version string provided
  const compFile = `${compDir}${version ? '_v'+version : ''}`;
  // Build file path (excluding file extension)
  //  const baseFilePath = `https://${hostName}/${parentDir}/${compDir}/${compFile}`;
  const baseFile = `${basePath}/${compDir}/${compFile}`;
  
  // Import the components HTML files into a <template> in the document.head
  //  loadTemplate uses fetch() so absolute URL must be provided
  loadTemplate(`${baseFile}.html`);
  
  //! todo import js_module AFTER html is loaded
  setTimeout(() => {
    const js_module = `${baseFile}.js`;
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