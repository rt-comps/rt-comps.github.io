class RTBaseClass extends HTMLElement{$createElement({tag:e="div",innerHTML:t="",cssText:n="",classes:a=[],styles:s={},attrs:r={},append:l=[],prepend:c=[],...o}={}){let m="string"==typeof e?document.createElement(e):e;return n&&(m.style.cssText=n),Object.keys(r).map(e=>m.setAttribute(e,r[e])),Object.keys(s).map(e=>m.style[e]=s[e]),0<a.length&&m.classList.add(...a),t&&(m.innerHTML=t),m.prepend(...c.flat()),m.append(...l.flat()),Object.assign(m,o)}$attr(e,t=""){return this.getAttribute(e)||t}$attr2NumArray(t){return this.$attr(t).split(",").map(e=>Number(e)||console.error(t,"contains illegal number",e))}$euro(e){return Intl.NumberFormat("nl-NL",{style:"currency",currency:"eur"}).format(e)}$localeDate(e,t="nl-NL",n={}){return Intl.DateTimeFormat(t,n).format(e)}$getTemplate(e=this.nodeName){var t=document.getElementById(e);return t?t.content.cloneNode(!0):(console.warn("Template not found:",e),document.createElement("span"))}$dispatch({name:e="name_not_provided",detail:t={},bubbles:n=!0,composed:a=!0,cancelable:s=!0,options:r={bubbles:n,composed:a,cancelable:s,detail:t},eventbus:l=this}){l.dispatchEvent(new CustomEvent(e,r))}}export{RTBaseClass};