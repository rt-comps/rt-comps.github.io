const[compName]=rt.parseURL(import.meta.url);customElements.define(compName,class extends rtBase.RTBaseClass{constructor(){super().attachShadow({mode:"open"}).append(this.$getTemplate()),this.shadowRoot.querySelector("#delete").addEventListener("click",()=>this.remove()),this.addEventListener("updatecount",e=>this.render(e))}connectedCallback(){this.render()}render(e){const t=this.shadowRoot,r=parseInt(this.$attr("unit"));let s=parseInt(t.querySelector("#count").innerHTML);if(e)switch(e.stopPropagation(),s+=e.detail.change,!0){case s>10:s=10;break;case s<0:s=0}else s=parseInt(this.$attr("count")),t.querySelector("#unit").innerHTML=`${this.$euro(r/100)}`;t.querySelector("#count").innerHTML=`${s}`,t.querySelector("#total").innerHTML=`${this.$euro(s*r/100)}`}});