const[compName]=rtlib.parseCompURL(import.meta.url);customElements.define(compName,class extends rtBC.RTBaseClass{static formAssociated=!0;#_sR;#_internals;#_eventBus;#_maxWeek;#_value;constructor(){if(super(),this.#_sR=this.attachShadow({mode:"open"}),this.#_sR.append(this.$getTemplate()),this.#_internals=this.attachInternals(),this.#_eventBus=this.#_sR.querySelector("#container"),this.#_maxWeek=this.hasAttribute("maxweek")?parseInt(this.getAttribute("maxweek"))-1:void 0,this.#_eventBus._week=0,this.#_eventBus._locale=this.getAttribute("locale")||void 0,this.#_sR.querySelector("#al").addEventListener("click",()=>this.arrowRespond(-1)),this.#_sR.querySelector("#ar").addEventListener("click",()=>this.arrowRespond(1)),this.addEventListener("datepicked",e=>this.dpRespond(e)),this.hasAttribute("invalid")){const t=this.getAttribute("invalid").split(",").map(Number);this.#_sR.querySelectorAll("dp-date").forEach(e=>{-1<t.indexOf(e.getAttribute("day")%7)&&e.setAttribute("invalid","")})}}formAssociatedCallback(){this.#_internals.form&&this.#_internals.form.addEventListener("formdata",e=>e.formData.set("picked-date",this.#_value))}formResetCallback(){this.clearChosen(),this.#_eventBus._week=0,this.$dispatch({name:"changeWeek",composed:!1,eventbus:this.#_eventBus})}arrowRespond(e){this.clearChosen(),this.#_eventBus._week+=e,this.#_eventBus._week<0&&(this.#_eventBus._week=0),this.#_maxWeek&&this.#_eventBus._week>this.#_maxWeek&&(this.#_eventBus._week=this.#_maxWeek),this.$dispatch({name:"changeWeek",composed:!1,eventbus:this.#_eventBus})}dpRespond(e){this.#_value=this.$localeDate(e.detail.date,this.#_eventBus._locale,{weekday:"short",month:"short",year:"numeric",day:"numeric"}),this.dispatchChoice(e.detail.day)}clearChosen(){this.dispatchChoice("-1"),this.#_value=null}dispatchChoice(e){this.$dispatch({name:"choiceMade",detail:{day:e},composed:!1,eventbus:this.#_eventBus})}get value(){return this.#_value}get name(){return this.getAttribute("name")}checkValidity(){return!!this.#_value}focus(){this.#_sR.querySelector("#container").focus()}});