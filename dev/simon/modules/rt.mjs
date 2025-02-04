// ================================================================
const html = (strings, ...values) =>
  String.raw({ raw: strings }, ...values);

// ================================================================
// Split a URL in to component name and base path
// 
// Returns ["<componentName>","<filePath>"]
// 
function parseCompURL(url) {
  // Split URL into array using / as delimiter
  // 'http://test:5500/mypath/component/filename' => ['http','',test:5500','mypath','component','filename']
  const urlArray = url.split('/');
  // Only return something if passed a string that has some meaning, ie more than the just the FQDN
  if (urlArray.length > 4) {
    return [urlArray[urlArray.length - 2], urlArray.slice(0, urlArray.length - 1).join('/')];
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
}

// ================================================================
// Load a new component.
//
// url      : URL of calling file - assumed it is in component directory
// version  : Numeric version of code to use
// 
async function loadComponent(url, version = false) {
  // Parse URL in to useful values
  const [compDir, basePath] = parseCompURL(url);
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
}

// ================================================================
// Load modules in to global scope
//
// basePath   : URL where 'modules' directory can be found
// addModules : Additional modules to load
// 
async function loadMods(basePath, addModules = []) {
  // Define modules to load
  //  Default module(s) to load
  const modules = [
    { label: 'rtBC', file: 'rt_baseclass.mjs' }
  ];
  //  Additional modules to load list
  addModules.forEach(newMod => modules.push(newMod));

  // Initiate the loading any missing modules
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
async function init(comp, deps = [], mods = []) {
  // Attempt to load any missing modules
  try {
    await loadMods(comp.split('/').slice(0, -3).join('/'), mods)
  } catch (e) {
    // Stop further loading if any modules fail to load
    throw e;
  }

  // Timer start (informational)
  const compName = comp.split('/').slice(-2)[0];
  console.time(`load Modules for ${compName}`);

  // Trigger the Loading of all dependencies
  await Promise.all(deps.map(async (depComp) => {
    try {
      await import(`../components/${depComp}/index.js`);
    } catch (e) {
      throw `Component "${compName}" could not load dependency "${depComp}" so stopping!!`;
    }
  }));

  // Stop timer
  console.timeEnd(`load Modules for ${compName}`);

  // Load this component
  try {
    await loadComponent(comp);
  } catch (e) {
    throw e
  }
}

export { html, parseCompURL, loadComponent, loadMods, init };