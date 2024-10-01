// ================================================================
export const html = (strings, ...values) =>
  String.raw({ raw: strings }, ...values);

// ================================================================
// Split a URL in to base path, component and file names
// 
// Returns ["<componentName>","<filePath>"]
// if getFile is set then returns "<filePath>/<baseFilename>"
// 
export function parseURL(url, getFile = false) {
  // Split URL into array using / as delimiter
  // 'http://test:5500/mypath/component/filename' => ['http','',test:5500','mypath','component','filename']
  const urlArray = url.split('/');
  // Only return something if passed a string that has some meaning... 
  if (urlArray.length > 4) {
    // Parse component name - will be second to last element
    const compName = urlArray[urlArray.length - 2];
    // Parse absolute path - everything before last element (filename)
    const basePath = urlArray.slice(0, urlArray.length - 1).join('/');
    if (!getFile) return [compName, basePath];
    else {
      // Parse filename - last item
      const rawFN = urlArray[urlArray.length - 1];
      const fileName = (rawFN.indexOf('_v') > -1 ? rawFN.substring(0, rawFN.indexOf('.')) : compName);
      return (`${basePath}/${fileName}`);
    }
  }
}

// ================================================================
// Add a component's template to document.head
//
// url  : URL of template file.  Must be absolute
//
async function loadTemplate(url) {
  try {
    // return the value from the end of this chain
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw `Failed to load ${url} with status ${response.status}`;
        return response.text()
      })
      .then((htmlText) => document.head.insertAdjacentHTML('beforeend', htmlText));
  } catch (err) {
    console.warn(err);
  }
}

// ================================================================
// Load a new component.
//
// url      : URL of calling file - assumed it is in component directory
// version  : Numeric version of code to use
// 
export function loadComponent(url, version = false) {
  // Parse URL in to useful values
  const [compDir, basePath] = parseURL(url);
  // Filename is directory name plus version string (if provided)
  const compFile = `${compDir}${version ? '_v' + version : ''}`;
  // Build file path (excluding file extension)
  const baseFile = `${basePath}/${compFile}`;
  // Import the components HTML file into the document.head
  // then load the component code
  loadTemplate(`${baseFile}.html`)
    .then(() => {
      const js_module = `${baseFile}.js`;
      import(js_module)
        .catch((err) => console.error("failed import", js_module, err));
    })
}