// ================================================================
// === <rt-allergen>
//
// ***Provide description of component function here***
// 
const [compName, compPath] = rtlib.parseCompURL(import.meta.url);

customElements.define(
    compName,
    class extends rtBC.RTBaseClass {
        //+++ Lifecycle Events
        //--- contructor
        constructor() {
            // Create and populate ShadowRoot
            super().attachShadow({ mode: "open" }).append(this.$getTemplate());

            // Slot element into footer slot in form
            this.setAttribute('slot', 'footer');
        }
 
        //--- connectedCallback
        connectedCallback() {
            // Check 'types' has been provided
            if (this.hasAttribute('types')) {
                // Get path for allergen images from menu data file if it has been specified
                let imgPath;
                if (rtForm) {
                    // Find <rt-orderform> node
                    const _orderRoot = rtForm.findNode(this);
                    // Has 'allergyimgpath' been provided?
                    if (_orderRoot) {
                        const _imgPath = _orderRoot.querySelector('form-config #allergyimgpath');
                        if (_imgPath) imgPath = _imgPath.textContent;
                    }
                }
                //- If allergyimgpath appears to be relative...
                if (imgPath && imgPath.indexOf('/') === 0) this.imgPath = `${compPath}${this.imgPath}`;
                //- If allergyimgpath not defined...
                if (!imgPath) imgPath = `${compPath}/static/allergenimg`;
                //- If the niether of the above match then assume allergyimgpath is absolute and leave unaltered

                // Create <al-allergen> nodes in LightDOM from comma separated values in 'types' attribute
                //- Convert comma separated list in attribute to array and filter to remove any falsey values, eg "" 
                const allergens = this.getAttribute('types').split(',').filter(el => el);
                //- Check that the value of 'types' was not an empty string
                if (allergens.length > 0) {
                    // Add an 'al-allergen' node for each entry in array
                    this.append(...allergens.map(el => {
                        return this.$createElement({
                            tag: 'al-allergen',
                            attrs: {
                                id: el,
                                imgpath: imgPath
                            }
                        })
                    }))
                } else console.error('Provided allergens list is empty')
            } else console.error('Allergen "types" attribute not provided')
        }
        //+++ End OF Lifecycle Events

        // Put private and public methods HERE

    }
);