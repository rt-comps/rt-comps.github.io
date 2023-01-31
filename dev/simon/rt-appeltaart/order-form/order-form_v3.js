// ================================================================
// === order-form class definition

// Recover component name from URL
const [compName] = rt.parseURL(import.meta.url);

// Define the component
customElements.define(compName,
  class extends rtBase.RTBaseClass {
    //+++++ Lifecycle Events
    //--- constructor
    constructor() {

      const _sR = super().attachShadow({ mode: "open" })
      _sR.append(this.$getTemplate());

      // ###### Event Listeners
      //___ updatemenu - Change data to chosen product
      this.addEventListener('updatemenu', (e) => this.updateData(e));
      //___ add-items_click - Add the currently selected items to the cart
      _sR.querySelector('#add-items-button').addEventListener('click', () => this.addToCart());
      //___ place-order_click - Send completed order to appliaction
      _sR.querySelector('#place-order-button').addEventListener('click', () => this.dispatchOrder());
    }
    //--- End of constructor

    //--- connectedCallback
    connectedCallback() {
      //      this.waitForSDOM();
      this.processMenuItems();
      // <order-form> should be defined with 'display: none' to hide any HTML text that could render while components 
      //  are loading.  By the time we get here it should be safe to change display mode...
      this.style.display = 'inline-block';
    }
    //--- End of connectedCallback
    //+++++ End of Lifecycle Events


    //--- processMenuItems
    // Create the pictoral menu at the top of the order form based on form HTML
    processMenuItems() {
      // Recover image path from setting in HTML
      const imgPath = this.querySelector("form-config span#imgpath").innerHTML;

      // Collect all <item-data> elements
      const nodes = [...this.querySelectorAll('item-data')];
      // ...then create a new <menu-item> element for each, assigned to 'menu-items' slot  
      this.append(...nodes.map(element => {
        let elementAttrs = { id: element.id, slot: 'menu-items' };
        // Attempt to retrieve image
        let imgNode = element.querySelector('img')
        // Add bgimg attribute if img element found
        if (imgNode) elementAttrs.bgimg = `${imgPath}/${imgNode.getAttribute('file')}`
        // Append the new <menu-item> element to the div
        return this.$createElement({
          tag: 'menu-item',
          innerHTML: `${element.querySelector('item-title').innerHTML}`,
          attrs: elementAttrs
        })
      }));
    }
    //--- End of processMenuItems

    //--- updateData
    // Respond to an updatemenu event
    updateData(e) {
      e.stopPropagation();
      // Clear any previous slot settings
      this.querySelectorAll('item-data').forEach((element) => {
        element.removeAttribute('slot');
      });
      // Assign chosen data to slot
      if (e.detail.id) this.querySelector(`item-data#${e.detail.id}`).setAttribute('slot', 'active-data');
    }
    //--- End of updateData

    //--- addToCart
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
        // If count == 0 then move on to next element and ignore rest of loop
        if (_itemCount.innerHTML === "0") continue;

        const itemText = `${curItem.parentNode.parentNode.querySelector('item-title').innerHTML} - ${curItem.parentNode.getAttribute('value')} - ${curItem.innerHTML}`
        this.append(this.$createElement({
          tag: 'line-item',
          innerHTML: itemText,
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
    //--- End of addToCart

    //--- dispatchOrder
    // Convert "cart" HTML to an array of objects 
    //  and dispatch outside form for handling by application
    dispatchOrder() {
      // 'Close' data area
      this.$dispatch({ name: 'updatemenu' });
      // Collect all items in cart and place in array
      const lineItems = [...this.querySelectorAll('line-item')];
      // If any line items, process each and remove it from cart
      if (lineItems.length > 0) {
        this.$dispatch({
          name: 'neworder',
          detail: {
            orderdetails: lineItems.map(node => {
              // Strip down node to simple object
              const newItem = {
                // Item decription
                item: node.innerHTML,
                // Final count value
                count: parseInt(node.shadowRoot.querySelector('#count').innerHTML),
                // Item unit cost
                unit: node.getAttribute('unit'),
              }
              // Remove the node from the cart
              node.remove();
              return newItem;
            })
          }
        });
      }
    }
    //--- End of dispatchOrder
  }
);