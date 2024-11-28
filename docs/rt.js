export const html=(strings,...values)=>String.raw({raw:strings},...values);export function parseCompURL(url,getFile=false){const urlArray=url.split("/");if(urlArray.length>4){const compName=urlArray[urlArray.length-2];const basePath=urlArray.slice(0,urlArray.length-1).join("/");if(!getFile)return[compName,basePath];else{const rawFN=urlArray[urlArray.length-1];const fileName=rawFN.indexOf("_v")>-1?rawFN.substring(0,rawFN.indexOf(".")):compName;return`${basePath}/${fileName}`}}}async function loadTemplate(url){try{return fetch(url).then(response=>{if(!response.ok)throw`Failed to load ${url} with status ${response.status}`;return response.text()}).then(htmlText=>{document.head.insertAdjacentHTML("beforeend",htmlText)})}catch(err){console.warn(err)}}export function loadComponent(url,version=false){const[compDir,basePath]=parseCompURL(url);const compFile=`${compDir}${version?"_v"+version:""}`;const baseFile=`${basePath}/${compFile}`;loadTemplate(`${baseFile}.html`).then(()=>{const js_module=`${baseFile}.js`;import(js_module).catch(err=>console.error("failed import",js_module,err))})}
