// ================================================================
const html = (strings, ...values) =>
  String.raw({ raw: strings }, ...values);

// ================================================================
// Split a URL in to base path, component and file names
// 
// Returns ["<componentName>","<filePath>"]
// if getFile is set then returns "<filePath>/<baseFilename>"
// 
function parseURL(url, getFile = false) {
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
  // return the value from the end of this chain
  try {
    const response = await fetch(url);
    if (!response.ok) throw `Failed to load ${url} with status ${response.status}`;
    const htmlText = await response.text();
    document.head.insertAdjacentHTML('beforeend', htmlText)
  } catch (e) {
    throw e;
  }

  // return fetch(url)
  //   .then((response) => {
  //     if (!response.ok) throw `Failed to load ${url} with status ${response.status}`;
  //     return response.text()
  //   })
  //   .then((htmlText) => document.head.insertAdjacentHTML('beforeend', htmlText));
}

// ================================================================
// Load a new component.
//
// url      : URL of calling file - assumed it is in component directory
// version  : Numeric version of code to use
// 
async function loadComponent(url, version = false) {
  // Parse URL in to useful values
  const [compDir, basePath] = parseURL(url);
  // Filename is directory name plus version string (if provided)
  const compFile = `${compDir}${version ? '_v' + version : ''}`;
  // Build file path (excluding file extension)
  const baseFile = `${basePath}/${compFile}`;
  // Import the components HTML file into the document.head
  // then load the component code
  try {
    await loadTemplate(`${baseFile}.html`);
    const js_module = `${baseFile}.js`;
    await import(js_module);
  } catch (e) {
    throw e;
  }
  // loadTemplate(`${baseFile}.html`)
  //   .then(() => {
  //     const js_module = `${baseFile}.js`;
  //     import(js_module)
  //       .catch((err) => console.error("failed import", js_module, err));
  //   })
}

// ================================================================
// Load modules in to global scope
//
// basePath   : URL where 'modules' directory can be found
// addModules : Additional modules to load
// 
async function loadMods(basePath, addModules = []) {
  // Define modules to load
  // Default modules to load
  const modules = [
    { label: 'rtlib', file: 'rt.mjs' },
    { label: 'rtBC', file: 'rt_baseclass.mjs' }
  ];
  // Additional modules to load
  addModules.forEach(newMod => modules.push(newMod));
  // Load any missing modules
  return Promise.all(modules.map(async (module) => {
    // Attempt to load module when not present
    if (typeof window[module.label] === 'undefined') {
      try {
        window[module.label] = await import(`${basePath}/modules/${module.file}`);
      } catch (e) {
        throw `module "${module.label}" failed to load`;
      }
    }
    return window[module.label];
  }));
}

// ================================================================
// Initialise a component.
//
// module : URL of calling file
// deps   : Componenets that are dependencies
// mods   : Additional Modules 
// 
async function init(module, deps = [], mods = []) {
  // Attempt to load any missing modules
  try {
    await loadMods(module.split('/').slice(0, -3).join('/'), mods)
  } catch (e) {
    // Stop further loading if any modules fail to load
    throw e;
  }

  // Timer start (informational)
  const moduleName = module.split('/').slice(-2)[0];
  console.time(`loadModules for ${moduleName}`);

  // Trigger the Loading of all dependencies
  await Promise.all(deps.map(async (component) => {
    try {
      await import(`../components/${component}/index.js`);
    } catch (e) {
      throw `Component "${moduleName}" could not load dependency "${component}" so stopping!!`;
    }
  }));

  // Stop timer
  console.timeEnd(`loadModules for ${moduleName}`);

  // Load this component
  try {
    await loadComponent(module);
  } catch(e){
    throw e
  }
}

export { html, parseURL, loadComponent, loadMods, init };