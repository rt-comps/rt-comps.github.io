// ===== Import all required modules and components

async function initialise(comp, options = {}) {
    try {
        // Load base module if not already loaded
        if (typeof rtlib === 'undefined') window.rtlib = await import(`${import.meta.url.split('/').slice(0, -3).join('/')}/modules/rt.mjs`)
        // Initialise component
        rtlib.init(comp, options);
    } catch (e) {
        console.warn(e);
    }
}

//--- MAIN
const options = {
    dependencies: [],
    additionalModules: []
}
initialise(import.meta.url, options);
