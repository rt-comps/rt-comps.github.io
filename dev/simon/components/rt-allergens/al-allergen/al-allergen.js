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
        //+++ Lifecycle Events
        //--- contructor
        constructor() {
            // Attach contents of template previously placed in document.head into ShadowDOM
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());
        }

        //--- connectedCallback
        connectedCallback() {
        // imgpath should hold a path to where all images reside
            const imgPath = this.getAttribute('imgpath')
            // Create a new image node
            const _imgNode = new Image();
            // Catch when image did not load. Replace image URL with default image (must exist)
            _imgNode.onerror = () => {
                // Default image resides with component
                _imgNode.src = `${compPath}/components/${compName}/img/unknown.svg`
                // Hover text identifies failed image file name
                _imgNode.title = `Image "${this.id}.svg" not Found`
            }
            // Attempt to load image (expected to be SVG)
            _imgNode.src = `${imgPath}/${this.id}.svg`
            // Capitalise 1st letter of hover text
            _imgNode.title = this.id.replace(/^./, char => char.toUpperCase());
            // Add image node to LightDOM
            this.append(_imgNode)
        }
        //+++ End OF Lifecycle Events
    }
);