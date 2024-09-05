customElements.define("chess-board", class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }
})

customElements.define("chess-cell", class extends HTMLElement {
    constructor(){
        super();
        
    }
})