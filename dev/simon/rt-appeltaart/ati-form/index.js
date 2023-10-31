// ===== Load component plus any dependancies
// Start timer (informational)
const moduleName = import.meta.url.split('/').slice(-2)[0];
console.time(`loadModules for ${moduleName}`);

const url = 'menu.html';
try {
    fetch(url)
        .then((response) => {
            // Once response has been received, check for error
            if (!response.ok) throw `Failed to load ${url} with status ${response.status}`;
            return response.text()
        })
        // .then((htmlText) => {
        //     // Once response.text() is available then create a fragment and then append to shadow DOM
        //     // This produces a similar result to $getTemplate
        //     const frag = document.createRange().createContextualFragment(htmlText);
        //     this.#_sR.appendChild(frag);
        // });
} catch (e) {
    console.warn(e);
}

if (customElements.get('order-form')){
  throw new Error('order-form already defined!!');
}


// List of dependencies
const components = ['../rt-form', '../rt-datumpick'];

// Trigger the Loading of all dependencies then load this component
Promise.all(
  components.map((componentName) => import(`../${componentName}/index.js`))
).then(() => {
  // Stop timer
  console.timeEnd(`loadModules for ${moduleName}`);
  // Load this component
  rtlib.loadComponent(import.meta.url);
});  