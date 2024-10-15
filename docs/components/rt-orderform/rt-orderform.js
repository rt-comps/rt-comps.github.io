const[compName,compPath]=rtlib.parseURL(import.meta.url);customElements.define(compName,class extends rtBC.RTBaseClass{#_sR;#_menu;#_details;#_form;#_cart;#_cartContents;constructor(){super(),this.#_sR=this.attachShadow({mode:"open"}),this.#_sR.append(this.$getTemplate()),this.id="eventBus",this.#_form=this.#_sR.querySelector("#user-form"),this.#_details=this.#_sR.querySelector("#product-details"),this.#_menu=this.#_sR.querySelector("#menu-items-container"),this.#_cart=this.#_sR.querySelector("#cart"),this.#_cartContents=JSON.parse(localStorage.getItem("currentOrder"))||[],this.addEventListener("updatemenu",t=>this.#updateItemDataDialog(t)),this.#_menu.addEventListener("updatecount",t=>this.#displayDetailButton(t)),this.#_cart.addEventListener("cartmod",t=>this.#modifyCurrentOrder(t)),this.#_sR.querySelector("#product-details-close").addEventListener("click",()=>this.#updateItemDataDialog()),this.#_sR.querySelector("#prod-add-but").addEventListener("click",()=>this.#addToCart()),this.#_sR.querySelector("#further-but").addEventListener("click",()=>this.#continueOrder()),this.#_sR.querySelector("#recover-but").addEventListener("click",()=>this.#recoverOrder()),this.#_sR.querySelector("#submit-but").addEventListener("click",()=>this.#dispatchOrder()),this.#_sR.querySelector("#cancel-but").addEventListener("click",()=>{this.#showForm(!1),this.#_sR.querySelector("div#cart").style.display=""})}connectedCallback(){this.#initialiseAll(),setTimeout(()=>this.#_cart.classList.remove("init"),500),this.style.display="inline-block"}#displayCartButtons(t=!1){var e={further:this.#_sR.getElementById("further-but"),last:this.#_sR.getElementById("recover-but")};for(const a in e)e.hasOwnProperty(a)&&(e[a].style.display="none");let r;var i=0===this.querySelectorAll('rt-lineitem[slot="cart"][count]').length,s="none"===this.#_form.parentElement.style.display;switch(!0){case(i||t)&&null!==localStorage.getItem("lastOrder"):r="last";break;case s&&!i:r="further";break;default:r=null}r&&(e[r].style.display="")}#displayDetailButton(t){t&&t.stopPropagation();let e;e=0<this.querySelectorAll("rt-itemdata[slot] rt-itemline[count]").length?"":"none",this.shadowRoot.querySelector("#prod-add-but").style.display=e}#initialiseAll(){const i=this.querySelector("form-config span#imgpath").innerHTML;var t=[...this.querySelectorAll("rt-itemdata")];if(this.append(...t.map(t=>{var e={id:"mi-"+t.id,slot:"menu-items"},r=t.querySelector("img");return r&&(e.bgimg=i+"/"+r.getAttribute("file")),this.$createElement({tag:"rt-menuitem",innerHTML:""+t.querySelector("item-title").innerHTML,attrs:e})})),window.matchMedia("(max-width: 430px)").matches){const e=this.#_cart.querySelector("#cart-title");e.addEventListener("click",()=>this.#toggleCart()),setTimeout(()=>{var t=getComputedStyle(this.#_cart),t=2*parseInt(t.paddingTop)+2*parseInt(t.borderLeftWidth),t=(parseFloat(e.getBoundingClientRect().height)+t).toFixed(0)+"px";this.#_cart.style.setProperty("--MINIMIZED-CART",t),this.#toggleCart()},200)}this.#_sR.querySelector("#product-details-close img").src=compPath+"/img/close-blk.png",this.#_menu.querySelector("#menu").style.display="",localStorage.getItem("currentOrder")&&this.#updateCart(),this.#displayCartButtons();t=this.querySelector('div[slot="user-details"]');t?this.#_form.append(...t.children):console.warn("No details form provided")}#showForm(t){this.#_menu.querySelector("#menu").style.display=t?"none":"",this.#_menu.querySelector("#form-container").style.display=t?"":"none",this.#displayCartButtons()}#toggleCart(){var t=this.#_cart.classList;t.contains("mini")?t.remove("mini"):t.add("mini")}#updateCart(){[...this.querySelectorAll("rt-lineitem")].forEach(t=>t.remove());let i=0;this.#_cartContents.length&&this.append(...this.#_cartContents.map(t=>{var e=this.querySelector(`rt-itemline[prodid="${t.prodID}"]`),r=e.parentElement,r=`${r.parentElement.querySelector("item-title").innerText}<br/>${r.getAttribute("value")} ${r.getAttribute("desc")}<br/>`+e.innerText,e=e.getAttribute("prijs");return i+=parseInt(e)*t.count,this.$createElement({tag:"rt-lineitem",innerHTML:r,attrs:{slot:"cart",prodid:t.prodID,count:t.count,unit:e}})})),this.#_sR.querySelector("#order-total-amount").innerHTML=this.$euro(i/100),this.#displayCartButtons()}#updateCurOrderStor(t){let e=!0;if(t.action){if(0<this.#_cartContents.length)for(const r of this.#_cartContents)if(t.prodID===r.prodID){"remove"!==t.action&&0!==t.count||this.#_cartContents.splice(this.#_cartContents.indexOf(r),1),t.count&&(r.count=t.count),e=!1;break}e&&(delete t.action,this.#_cartContents.push(t)),0<this.#_cartContents.length?localStorage.setItem("currentOrder",JSON.stringify(this.#_cartContents)):localStorage.removeItem("currentOrder"),this.#updateCart()}}#updateItemDataDialog(t){let e;if(t&&(t.stopPropagation(),e=t.detail.id),this.querySelectorAll("rt-itemdata").forEach(t=>{t.removeAttribute("slot")}),e){var t=this.querySelector("rt-itemdata#"+e),r=(t.setAttribute("slot","active-data"),[...this.querySelectorAll('rt-lineitem[slot="cart"]')].reduce((t,e)=>(t[0].push(e.$attr("prodid")),t[1].push(e.$attr("count")),t),[[],[]]));for(const s of[...t.querySelectorAll("rt-itemvariety rt-itemline")]){var i=r[0].indexOf(s.$attr("prodid"));-1<i?s.$dispatch({name:"updatecount",detail:{change:r[1][i],replace:!0}}):0<s.$attr("count")&&s.$dispatch({name:"updatecount",detail:{change:"0",replace:!0}})}this.#_details.showModal(),this.#displayDetailButton()}else this.#_details.close();this.#displayCartButtons()}#validateForm(){let t=!1;if(this.#_form)for(const e of this.#_form.querySelectorAll("form-field, pickup-locations, date-picker"))e.checkValidity()||t||(e.focus(),t=!0);else t=!1;return!t}#addToCart(){var t=[...this.querySelectorAll('[slot="active-data"] rt-itemline[count]')];t&&t.forEach(t=>{this.#updateCurOrderStor({prodID:t.$attr("prodid"),count:parseInt(t.$attr("count")),action:"update"}),"0"===t.$attr("count")&&t.removeAttribute("count")}),this.#updateItemDataDialog()}#continueOrder(){var t=localStorage.getItem("user-details");if(t){this.#_form.querySelector("#savefields").checked=!0;var e,r,t=JSON.parse(t);for([e,r]of Object.entries(t))this.#_form.querySelector(`[name=${e}]`).value=r}this.#showForm(!0),this.#_sR.querySelector("div#cart").style.display="none"}#dispatchOrder(){var t;this.#validateForm()?(t=new FormData(this.#_form),this.$dispatch({name:"neworder",detail:{person:Object.fromEntries(t.entries()),order:this.#_cartContents}})):console.warn("Form submission not valid")}#modifyCurrentOrder(t){t.stopPropagation(),this.#updateCurOrderStor(t.detail)}#recoverOrder(){localStorage.getItem("lastOrder")&&localStorage.setItem("currentOrder",localStorage.getItem("lastOrder")),this.#updateCart()}accepted(){localStorage.setItem("lastOrder",localStorage.getItem("currentOrder")),localStorage.removeItem("currentOrder"),this.#updateCart(),this.#showForm(!1);var t=this.#_sR.querySelector("#savefields");t&&t.checked?(t=[...this.#_sR.querySelectorAll("#details-form form-field,textarea")].reduce((t,e)=>({...t,[e.name]:e.value}),{}),localStorage.setItem("user-details",JSON.stringify(t))):localStorage.removeItem("user-details"),this.#_form.reset(),console.log("Form Submitted!")}});