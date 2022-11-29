/*
// +++ Import library functions
// Check if dev
const sharedModPath = `${import.meta.url.indexOf('/docs/')>-1?import.meta.url.split('/').slice(0,4).join('/'):'//rt-comps.github.io'}`
// Load module dynamically
const rt = await import(`${sharedModPath}/rt.js`);
*/

rt.loadComponent(import.meta.url);
