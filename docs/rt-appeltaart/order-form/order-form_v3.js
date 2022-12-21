// ================================================================
// === order-form

// get component name from URL directory name
const [compName, compVerRaw] = import.meta.url.split("/").slice(-2);
const compVer = compVerRaw.split('.')[0].substring(compName.length + 1);

customElements.define(
  compName,
  class extends rtBase.RTBaseClass { // Get RTBaseClass definition from module
    // ----- constructor
    constructor() {
      // Attach contents of template placed in document.head
      super().attachShadow({ mode: "open" }).append(this.$getTemplate());

      // ###### Event Listeners
      // ___updateMenu - Change data to chosen product
      this.addEventListener('updateMenu', (e) => {
        // Prevent event from bubbling further up the DOM
        e.stopPropagation();
        // Update the data section with chosen product information
        this.updateData(e.detail.id);
      });
      // ___

      // ___ addToCart - Add the currently selected items to the cart
      this.shadowRoot.querySelector('#add-items-button').addEventListener('click', () => this.addToCart());
      // ___
    }
    // -----

    // ----- connectedCallback
    connectedCallback() {
      //Endure all required DOM has been parsed
      setTimeout(() => {
        // Build the product menu based on provided HTML
        this.processMenuItems();
        // <order-form> should be defined with 'display: none' to hide any HTML text that could render while components 
        //  are loading.  By the time we get here it should be safe to change display mode...
        this.style.display = 'inline-block';
      })
    }
    // -----

    // ----- processMenuItems
    // Create the pictoral menu at the top of the order form
    processMenuItems() {
      // Recover image path setting from HTML
      const imgPath = this.querySelector("form-config span#imgpath").innerHTML;

      // Retrieve <div id="prod-imgs>"
      const _imgDiv = this.shadowRoot.querySelector('#menu-items');
      // Get all <item-data> elements
      const nodes = this.querySelectorAll('item-data');

      // Create an element for each product withh a bachground image if provided
      nodes.forEach(element => {
        // Attempt to retrieve image
        let imgNode = element.querySelector('img')
        let imgStyle = {};
        if (imgNode) imgStyle = {
          backgroundImage: `url("${imgPath}/${imgNode.getAttribute('file')}")`,
        }
        // Append the new element to the div
        _imgDiv.append(this.$createElement({
          tag: 'menu-item',
          innerHTML: `${element.querySelector('item-title').innerHTML}`,
          attrs: { id: element.id },
          styles: imgStyle
        })
        );
      })
    }
    // -----

    // ----- updateData
    // Respond to an updateMenu event
    updateData(newID) {
      // Clear any previous slot settings
      this.querySelectorAll('item-data').forEach((element) => {
        element.removeAttribute('slot');
      });
      // Add chosen data to slot
      this.querySelector(`item-data#${newID}`).setAttribute('slot', 'active-data');
    }
    // -----

    // ------ addToCart
    // Add any line items with count > 0 to cart
    addToCart() {
      // Get all item-line elements in active item-data element
      const activeItemLines = this.querySelectorAll('[slot="active-data"] item-line');

      // Create a line-item for any elements with a count > 0
      for (let x = 0; x < activeItemLines.length; x++) {
        const curItem = activeItemLines[x];
        const _sR = curItem.shadowRoot;
        // Get the count for the item-line
        const _itemCount = _sR.querySelector('#count');
        // If count == 0 then move on to next element
        if (_itemCount.innerHTML === "0") continue;

        console.log(curItem);
        this.append(this.$createElement({
          tag: 'line-item',
          innerHTML: `${curItem.innerHTML}`,
          attrs: {
            slot: 'cart',
            count: `${_itemCount.innerHTML}`,
            unit: `${parseInt(curItem.getAttribute('prijs'))}`
          }
        }));

        // Reset count value to avoid any multi-press detritus
        _itemCount.innerHTML = '0';
        _sR.querySelector('#container').style.fontWeight = '';
      }
    }
    // -----
  }
);
