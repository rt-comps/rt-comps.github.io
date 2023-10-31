const moduleName=import.meta.url.split("/").slice(-2)[0];console.time(`loadModules for ${moduleName}`);console.warn(document.location.href);const url="menu.html";try{fetch(url).then(response=>{if(!response.ok)throw`Failed to load ${url} with status ${response.status}`;return response.text()})}catch(e){console.warn(e)}if(customElements.get("order-form")){throw new Error("order-form already defined!!")}const components=["../rt-form","../rt-datumpick"];Promise.all(components.map(componentName=>import(`../${componentName}/index.js`))).then(()=>{console.timeEnd(`loadModules for ${moduleName}`);rtlib.loadComponent(import.meta.url)});
