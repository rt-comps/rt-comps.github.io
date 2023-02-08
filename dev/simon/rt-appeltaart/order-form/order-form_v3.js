// ================================================================
// === order-form class definition

// Recover component name from URL
const [compName] = rt.parseURL(import.meta.url);

// Define the component
customElements.define(compName,
  class extends rtBase.RTBaseClass {
    //+++ Lifecycle Events
    //--- constructor
    constructor() {

      const _sR = super().attachShadow({ mode: "open" })
      _sR.append(this.$getTemplate());

      //### Event Listeners
      //___ updatemenu - Change data to chosen product
      this.addEventListener('updatemenu', (e) => this.updateData(e));

      //___ updatecount - Change button style based on count
      const _itemData = _sR.querySelector('#item-data-container');
      _itemData.addEventListener('updatecount', (e) => this.enableButton(_itemData, e));
      const _cart = _sR.querySelector('#cart');
      _cart.addEventListener('updatecount', (e) => this.enableButton(_cart, e));

      //___ add-items_click - Add the currently selected items to the cart
      _sR.querySelector('#add-items-button').addEventListener('click', () => this.addToCart());
      //___ place-order_click - Send completed order to appliaction
      _sR.querySelector('#place-order-button').addEventListener('click', () => this.dispatchOrder());
    }

    //--- connectedCallback
    connectedCallback() {
      this.processMenuItems();
      // Make <order-form> visible - all style should be active by this point
      this.style.display = 'inline-block';
    }
    //+++ End of Lifecycle Events


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
      // Check whether button should be active
      this.enableButton(this.shadowRoot.querySelector('#item-data-container'), e);
    }

    //--- enableButton
    // Decided whether a button should be enabled
    enableButton(node, e) {
      // If triggered by event then stop event
      if (e) e.stopPropagation();

      // Button specific values
      let searchText = '', buttonNode = '';
      // Set button specific values
      switch (node.id) {
        case 'item-data-container':
          searchText = 'item-data[slot] item-line[count]';
          buttonNode = node.querySelector('#add-items-button');
          break;
        case 'cart':
          searchText = 'line-item[slot="cart"][count]';
          buttonNode = node.querySelector('#place-order-button')
          break;
        default:
          // Stop if node.id is unknown or undefined
          return;
      }

      // Decide if a button should be enabled
      if (this.querySelectorAll(searchText).length === 0) {
        // Disable button by adding inline style
        buttonNode.style.backgroundColor = 'rgb(128, 128, 128)';
      }
      else {
        // Enable button by removing inline style
        buttonNode.removeAttribute('style');
      }
    }

    //--- addToCart
    // Add any line items with count > 0 to cart
    addToCart() {
      // Check if button is 'enabled'
      if (this.shadowRoot.querySelector('#add-items-button').hasAttribute('style')) return;
      // Get all <item-line> elements in active <item-data> with a count > 0 
      const activeItemLines = [...this.querySelectorAll('[slot="active-data"] item-line[count]')];
      // Add a new <line-item> to cart
      //  Spread node list to array (inner '...'), 
      //  return a array of new elements (.map) 
      //  then spread this array to append these elements to <order-form> (outer '...') 
      this.append(...activeItemLines.map((node) => {
        // Construct new elements text
        const itemText = `${node.parentNode.parentNode.querySelector('item-title').innerHTML} - ${node.parentNode.getAttribute('value')} - ${node.innerHTML}`;
        // Get item count
        const itemCount = node.getAttribute('count');
        // Create the new element
        const newEl = this.$createElement({
          tag: 'line-item',
          innerHTML: itemText,
          attrs: {
            slot: 'cart',
            count: itemCount,
            unit: node.getAttribute('prijs')
          }
        })
        // tidy up the <item-line>, ie reset count to zero
        node.updateCount({ detail: { change: (0 - parseInt(itemCount)) } });
        // Send the new element to .append()
        return newEl
      }))
      //      _button.style.backgroundColor = 'rgb(128, 128, 128)';
//      console.log(this.shadowRoot.querySelector('#item-data-container'));
      this.enableButton(this.shadowRoot.querySelector('#item-data-container'));
      this.enableButton(this.shadowRoot.querySelector('#cart'));
    }

    //--- dispatchOrder
    // Convert "cart" HTML to an array of objects 
    //  and dispatch outside form for handling by application
    dispatchOrder() {
      // Check if button is 'enabled'
      if (this.shadowRoot.querySelector('#place-order-button').hasAttribute('style')) return;

      // 'Close' data area
      this.$dispatch({ name: 'updatemenu' });
      // Collect all items in cart and place in array
      const lineItems = [...this.querySelectorAll('line-item[count]')];
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
      this.enableButton(this.shadowRoot.querySelector('#cart'));
    }
  }
);