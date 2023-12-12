const[compName,compPath]=rtlib.parseURL(import.meta.url);customElements.define(compName,class extends rtBC.RTBaseClass{#_sR;#_menu;#_details;#_form;constructor(){super(),this.#_sR=this.attachShadow({mode:"open"}),this.#_sR.append(this.$getTemplate()),this.id="eventBus",this.#_form=this.#_sR.querySelector("#user-form"),this.#_details=this.#_sR.querySelector("#deets"),this.#_menu=this.#_sR.querySelector("#menu-container");var e=this.attributes,e=(this.#_sR.querySelector("#container").style.width=e["form-width"]?e["form-width"].value:"1000px",e["cart-width"]?e["cart-width"].value:"350px"),t=this.#_sR.querySelector("#cart");t.style.flex="0 0 "+e,t.style.maxWidth=e,this.addEventListener("updatemenu",e=>this.updateItemData(e)),this.addEventListener("detailresize",()=>this.resizeMenu()),this.#_menu.addEventListener("updatecount",e=>this.displayDetailButton(e)),t.addEventListener("cartmod",e=>this.modifyCurrentOrder(e)),this.#_sR.querySelector("#deets-close").addEventListener("click",()=>this.updateItemData()),this.#_sR.querySelector("#prod-add-but").addEventListener("click",()=>this.addToCart()),this.#_sR.querySelector("#further-but").addEventListener("click",()=>this.continueOrder()),this.#_sR.querySelector("#recover-but").addEventListener("click",()=>this.recoverOrder()),this.#_sR.querySelector("#submit-but").addEventListener("click",()=>this.dispatchOrder()),this.#_sR.querySelector("#cancel-but").addEventListener("click",()=>this.showForm(!1))}connectedCallback(){this.initialiseAll(),this.style.display="inline-block"}initialiseAll(){const i=this.querySelector("form-config span#imgpath").innerHTML;var e=[...this.querySelectorAll("item-data")],e=(this.append(...e.map(e=>{var t={id:"mi-"+e.id,slot:"menu-items",style:"justify-self: center"},r=e.querySelector("img");return r&&(t.bgimg=i+"/"+r.getAttribute("file")),this.$createElement({tag:"menu-item",innerHTML:""+e.querySelector("item-title").innerHTML,attrs:t})})),this.#_sR.querySelector("#deets-close img").src=compPath+"/img/close-blk.png",this.#_menu.querySelector("#menu").style.display="",localStorage.getItem("currentOrder")&&this.updateCart(),this.displayCartButtons(),this.querySelector('div[slot="user-details"]'));e?this.#_form.append(...e.children):console.warn("No details form provided")}updateItemData(e){let t;e&&(e.stopPropagation(),t=e.detail.id),this.querySelectorAll("item-data").forEach(e=>{e.removeAttribute("slot")}),t?(this.querySelector("item-data#"+t).setAttribute("slot","active-data"),this.#_details.show(),this.displayDetailButton()):(this.#_details.close(),this.resizeMenu()),this.displayCartButtons()}displayDetailButton(e){e&&e.stopPropagation();let t;t=0<this.querySelectorAll("item-data[slot] item-line[count]").length?"":"none",this.shadowRoot.querySelector("#prod-add-but").style.display=t}displayCartButtons(e=!1){var t={further:this.#_sR.getElementById("further-but"),last:this.#_sR.getElementById("recover-but")};for(const a in t)t.hasOwnProperty(a)&&(t[a].style.display="none");let r;var i=0===this.querySelectorAll('line-item[slot="cart"][count]').length,s="none"===this.#_form.parentElement.style.display&&!this.#_details.hasAttribute("open");switch(!0){case(i||e)&&null!==localStorage.getItem("lastOrder"):r="last";break;case s&&!i:r="further";break;default:r=null}r&&(t[r].style.display="")}updateCart(){[...this.querySelectorAll("line-item")].forEach(e=>e.remove());var e=JSON.parse(localStorage.getItem("currentOrder"));let i=0;e&&this.append(...e.map(e=>{var t=this.querySelector(`item-line[prodid="${e.prodID}"]`),r=t.parentElement,r=`${r.parentElement.querySelector("item-title").innerText}<br/>${r.getAttribute("value")} ${r.getAttribute("desc")}<br/>`+t.innerText,t=t.getAttribute("prijs");return i+=parseInt(t)*e.count,this.$createElement({tag:"line-item",innerHTML:r,attrs:{slot:"cart",prodid:e.prodID,count:e.count,unit:t}})})),this.#_sR.querySelector("#total").innerHTML=this.$euro(i/100),this.displayCartButtons()}updateCurOrderStor(r){if(r.action){var i=JSON.parse(localStorage.getItem("currentOrder"))||[];let t=!0;if(i){var s=i.length;for(let e=0;e<s;e++)if(r.prodID===i[e].prodID){r.count&&(i[e].count+=r.count),"remove"!==r.action&&0!==i[e].count||i.splice(e,1),t=!1;break}}t&&(delete r.action,i.push(r)),0<i.length?localStorage.setItem("currentOrder",JSON.stringify(i)):localStorage.removeItem("currentOrder"),this.updateCart()}}modifyCurrentOrder(e){e.stopPropagation(),this.updateCurOrderStor(e.detail)}addToCart(){var e=[...this.querySelectorAll('[slot="active-data"] item-line[count]')];e&&e.forEach(e=>{this.updateCurOrderStor({prodID:e.getAttribute("prodid"),count:parseInt(e.getAttribute("count")),action:"update"}),e.updateCount({detail:{change:0-parseInt(e.getAttribute("count"))}})}),this.updateItemData()}continueOrder(){var e=localStorage.getItem("userDeets");if(e){this.#_form.querySelector("#savefields").checked=!0;var t,r,e=JSON.parse(e);for([t,r]of Object.entries(e))this.#_form.querySelector(`[name=${t}]`).value=r}this.showForm(!0)}recoverOrder(){localStorage.getItem("lastOrder")&&localStorage.setItem("currentOrder",localStorage.getItem("lastOrder")),this.updateCart()}validateForm(){let e=!1;if(this.#_form)for(const t of this.#_form.querySelectorAll("form-field, pickup-locations, date-picker"))t.checkValidity()||e||(t.focus(),e=!0);else e=!1;return!e}dispatchOrder(){var e;this.validateForm()?(e=new FormData(this.#_form),this.$dispatch({name:"neworder",detail:{person:Object.fromEntries(e.entries()),order:JSON.parse(localStorage.getItem("currentOrder"))}})):console.warn("Form submission failed: form not found")}accepted(){localStorage.setItem("lastOrder",localStorage.getItem("currentOrder")),localStorage.removeItem("currentOrder"),this.updateCart(),this.showForm(!1);var e=this.#_sR.querySelector("#savefields");e&&e.checked?(e=[...this.#_sR.querySelectorAll("#details-form form-field,textarea")].reduce((e,t)=>({...e,[t.name]:t.value}),{}),localStorage.setItem("userDeets",JSON.stringify(e))):localStorage.removeItem("userDeets"),this.#_form.reset(),console.log("Form Submitted!")}resizeMenu(){this.#_menu.style.height="",this.#_details.getBoundingClientRect().height>this.#_menu.getBoundingClientRect().height&&(this.#_menu.style.height=Math.ceil(this.#_details.getBoundingClientRect().height)+5+"px")}showForm(e){this.#_menu.querySelector("#menu").style.display=e?"none":"",this.#_menu.querySelector("#form-container").style.display=e?"":"none",this.displayCartButtons()}});