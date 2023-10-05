const[compName]=rtlib.parseURL(import.meta.url);customElements.define(compName,class extends rtBC.RTBaseClass{constructor(){const _sR=super().attachShadow({mode:"open"});_sR.append(this.$getTemplate());const attributes=this.attributes;_sR.querySelector("#container").style.width=attributes["form-width"]?attributes["form-width"].value:"1000px";const cartWidth=attributes["cart-width"]?attributes["cart-width"].value:"350px";const _cart=_sR.querySelector("#cart");_cart.style.flex=`0 0 ${cartWidth}`;_cart.style.maxWidth=cartWidth;this.addEventListener("updatemenu",e=>this.updateData(e));_sR.querySelector("#menu-container").addEventListener("updatecount",e=>this.displayAddButton(e));_sR.querySelector("#cart").addEventListener("updatecount",e=>this.displayOrderButton(e));_sR.querySelector("#add-but").addEventListener("click",()=>this.addToCart());_sR.querySelector("#place-but").addEventListener("click",()=>this.dispatchOrder())}connectedCallback(){this.initialiseMenu();this.style.display="inline-block"}initialiseMenu(){const imgPath=this.querySelector("form-config span#imgpath").innerHTML;const nodes=[...this.querySelectorAll("item-data")];this.append(...nodes.map(element=>{let elementAttrs={id:element.id,slot:"menu-items",style:"justify-self: center"};let imgNode=element.querySelector("img");if(imgNode)elementAttrs.bgimg=`${imgPath}/${imgNode.getAttribute("file")}`;return this.$createElement({tag:"menu-item",innerHTML:`${element.querySelector("item-title").innerHTML}`,attrs:elementAttrs})}));const lastOrder=localStorage.getItem("lastOrder");if(lastOrder){console.log(`Last Order: ${lastOrder}`)}}updateData(e){this.querySelectorAll("item-data").forEach(element=>{element.removeAttribute("slot")});const _button=this.shadowRoot.querySelector("#add-but");_button.style.display="none";const _overlay=this.shadowRoot.querySelector("#details-container");_overlay.style.visibility="hidden";if(e){e.stopPropagation();if(e.detail.id){this.querySelector(`item-data#${e.detail.id}`).setAttribute("slot","active-data");_button.removeAttribute("style");_overlay.removeAttribute("style")}this.displayAddButton()}}displayAddButton(e){if(e)e.stopPropagation();const node=this.shadowRoot.querySelector("#details");const buttonNode=node.querySelector("#add-but");if(this.querySelectorAll("item-data[slot] item-line[count]").length===0){buttonNode.style.backgroundColor="rgb(128, 128, 128)";buttonNode.innerHTML="Close"}else{buttonNode.removeAttribute("style");buttonNode.innerHTML="Add To Order"}}displayOrderButton(e){if(e)e.stopPropagation();const node=this.shadowRoot.querySelector("#cart");const buttonNode=node.querySelector("#place-but");if(this.querySelectorAll('line-item[slot="cart"][count]').length===0)buttonNode.style.display="none";else buttonNode.removeAttribute("style")}addToCart(){const activeItemLines=[...this.querySelectorAll('[slot="active-data"] item-line[count]')];if(activeItemLines.length>0){this.append(...activeItemLines.map(node=>{const itemHTML=`<div>${node.parentNode.parentNode.querySelector("item-title").innerHTML}</div><div>- ${node.parentNode.getAttribute("value")}</div><div>- ${node.innerHTML}</div>`;const itemCount=node.getAttribute("count");const newEl=this.$createElement({tag:"line-item",innerHTML:itemHTML,attrs:{slot:"cart",count:itemCount,unit:node.getAttribute("prijs")}});node.updateCount({detail:{change:0-parseInt(itemCount)}});return newEl}));this.displayAddButton();this.displayOrderButton()}this.updateData()}dispatchOrder(){const lineItems=[...this.querySelectorAll("line-item[count]")];if(lineItems.length>0){const outputObj={name:"neworder",detail:{orderdetails:lineItems.map(node=>{const newItem={item:node.innerHTML,count:parseInt(node.shadowRoot.querySelector("#count").innerHTML),unit:node.getAttribute("unit")};node.remove();return newItem})}};localStorage.setItem("lastOrder",JSON.stringify(outputObj.detail.orderdetails));this.$dispatch(outputObj)}this.displayOrderButton()}});