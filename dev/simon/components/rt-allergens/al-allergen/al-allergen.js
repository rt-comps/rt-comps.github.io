// ================================================================
// === <al-allergen>
//
// ***Provide description of component function here***

import { findNode } from "../../../modules/rt_form.mjs";

// 
const [compName, compPath] = rtlib.parseCompURL(import.meta.url);

customElements.define(
    compName.slice(compName.lastIndexOf('/') + 1),
    class extends rtBC.RTBaseClass {
        // Declare private class fields
        #_sR;
        #path;

        //+++ Lifecycle Events
        //--- Contructor
        constructor() {
            // Attach contents of template previously placed in document.head
            super()
            this.#_sR = this.attachShadow({ mode: "open" });
            this.#_sR.append(this.$getTemplate())

            //### Listeners
        }

        connectedCallback() {
            // Get image path from menu data file if it has been specified
            if (rtForm) {
                const _orderRoot = rtForm.findNode(this);
                if (_orderRoot) {
                    const _imgPath = _orderRoot.querySelector('form-config #allergyimgpath');
                    if (_imgPath) this.#path = _imgPath.textContent;
                }
            }
            // If path appears to be relative...
            if (this.#path && this.#path.indexOf('/') === 0) this.#path = `${compPath}${this.#path}`;
            // If path not defined...
            if (!this.#path) this.#path = `${compPath}/static/allergenimg`;
            // If the niether of the above match then assume path is absolute and leave unaltered

            // Create a new image object
            const _imgNode = new Image();
            // Catch when image did not load. Replace image URL with default image (must exist)
            _imgNode.onerror = () => {
                _imgNode.src = `${compPath}/components/${compName}/img/unknown.svg`
                _imgNode.title = `Image "${this.id}.svg" not Found`
            }
            // Attempt to load image
            _imgNode.src = `${this.#path}/${this.id}.svg`
            // Capitalise 1st letter for 'title' atribute
            _imgNode.title = this.id.replace(/^./, char => char.toUpperCase());
            // Add image to component
            this.#_sR.querySelector('#contents').append(_imgNode)
        }
        //+++ End OF Lifecycle Events
    }
);