const[compName]=rtlib.parseURL(import.meta.url);customElements.define(compName,class extends rtBC.RTBaseClass{static formAssociated=!0;#_internals=null;#_input;constructor(){super();var t=this.attachShadow({mode:"open",delegateFocus:!0});if(t.append(this.$getTemplate()),this.#_internals=this.attachInternals(),this.#_input=t.querySelector("input"),this.hasAttribute("required")&&(this.#_input.setAttribute("required",""),t.querySelector("span").innerHTML="&nbsp*"),this.hasAttribute("type")){var e=this.getAttribute("type");switch(e){case"tel":this.#_input.pattern="0[0-9]{9}";case"email":this.#_input.type=e;break;case"post":this.#_input.pattern="[0-9]{4} {0,1}[A-Za-z]{2}"}}t.querySelector("label").insertAdjacentHTML("afterbegin",`${this.getAttribute("label")||"Name Missing"}&nbsp;`),this.addEventListener("focus",()=>this.focus())}formAssociatedCallback(){this.#_internals.form&&this.#_internals.form.addEventListener("formdata",t=>t.formData.set(this.name,this.value))}formResetCallback(){this.#_input.value=null}get value(){return this.#_input.value}set value(t){this.#_input.value=t}get name(){return this.getAttribute("name")}checkValidity(){return this.#_input.checkValidity()}focus(){this.#_input.focus()}});