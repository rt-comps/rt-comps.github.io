const moduleName=import.meta.url.split("/").slice(-2)[0];console.time(`loadModules for ${moduleName}`);const components=["menu-item","item-data","line-item","pickup-locations","form-field"];Promise.all(components.map(componentName=>import(`../${componentName}/index.js`))).then(()=>{console.timeEnd(`loadModules for ${moduleName}`);rtlib.loadComponent(import.meta.url)});
