const[compName]=rtlib.parseURL(import.meta.url);customElements.define(compName,class extends rtBC.RTBaseClass{#_sR;#_lines;#_caret;constructor(){super(),this.#_sR=this.attachShadow({mode:"open"}),this.#_sR.append(this.$getTemplate()),this.#_lines=this.#_sR.querySelector("#lines"),this.#_caret=this.#_sR.querySelector("#caret"),this.#_sR.querySelector("#text").innerHTML=""+this.$attr("value")+(this.hasAttribute("desc")?" "+this.$attr("desc"):""),this.#_sR.querySelector("#title").addEventListener("click",()=>this.$dispatch({name:"variety-toggle",detail:{value:this.getAttribute("value")},composed:!1})),this.parentNode.addEventListener("variety-toggle",t=>this.#toggleItems(t.detail.value))}connectedCallback(){rtForm&&rtForm.getStyle(this),setTimeout(()=>{var t=this.closest("#eventBus");t?t.addEventListener("updatemenu",t=>this.#initialiseDisplay(t)):console.error(this.tagName+': Element with id of "eventBus" not found')},100)}#initialiseDisplay(t){t.detail.id===this.parentNode.id&&this.#toggleItems(this.hasAttribute("default")?this.getAttribute("value"):"")}#toggleItems(t){this.#_lines.hidden=t!==this.getAttribute("value"),this.#_caret.innerHTML=this.#_lines.hidden?"&#9656":"&#9662"}});