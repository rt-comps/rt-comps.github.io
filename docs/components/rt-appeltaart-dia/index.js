const moduleName=import.meta.url.split("/").slice(-2)[0];if(console.time("loadModules for "+moduleName),customElements.get("rt-orderform"))throw new Error("rt-orderform already defined!!");const components=["../rt-form","../rt-datumpick"];Promise.all(components.map(o=>import(`../${o}/index.js`))).then(()=>{console.timeEnd("loadModules for "+moduleName),rtlib.loadComponent(import.meta.url)});