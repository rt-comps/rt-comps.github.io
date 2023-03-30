// ================================================================
// === order-form class definition

// Recover component name from URL
const [compName] = rtlib.parseURL(import.meta.url);

// Define the component
customElements.define(compName,
  class extends rtBC.RTBaseClass {
    //+++ Lifecycle Events
    //--- constructor
    constructor() {

      const _sR = super().attachShadow({ mode: "open" })
      _sR.append(this.$getTemplate());

      //### Retrive form sizes and define defaults
      const attributes = this.attributes;
      _sR.querySelector('#container').style.width = attributes['form-width'] ? attributes['form-width'].value : '1000px';
      // _sR.querySelector('#container').style.height = attributes['form-height'] ? attributes['form-height'].value : '600px';
      const cartWidth = attributes['cart-width'] ? attributes['cart-width'].value : '350px';
      const _cart = _sR.querySelector('#cart');
      _cart.style.flex = `0 0 ${cartWidth}`;
      _cart.style.maxWidth = cartWidth;


      //### Event Listeners
      //___ updatemenu - Change data to chosen product
      this.addEventListener('updatemenu', (e) => this.updateData(e));

      //___ updatecount - Change button style based on count
      _sR.querySelector('#menu-container')
        .addEventListener('updatecount', (e) => this.displayAddButton(e));
      _sR.querySelector('#cart')
        .addEventListener('updatecount', (e) => this.displayOrderButton(e));

      //___ add-items_click - Add the currently selected items to the cart
      _sR.querySelector('#add-but')
        .addEventListener('click', () => this.addToCart());
      //___ place-order_click - Send completed order to appliaction
      _sR.querySelector('#place-but')
        .addEventListener('click', () => this.dispatchOrder());
    }

    //--- connectedCallback
    connectedCallback() {
      this.initialiseMenu();
      // Make <order-form> visible - all style should be active by this point
      this.style.display = 'inline-block';
    }
    //+++ End of Lifecycle Events


    //--- processMenuItems
    // Create the pictoral menu at the top of the order form based on form HTML
    initialiseMenu() {
      // Recover image path from setting in HTML
      const imgPath = this.querySelector("form-config span#imgpath").innerHTML;

      // Collect all <item-data> elements
      const nodes = [...this.querySelectorAll('item-data')];
      // ...then create a new <menu-item> element for each, assigned to 'menu-items' slot  
      this.append(...nodes.map(element => {
        let elementAttrs = { id: element.id, slot: 'menu-items', style: 'justify-self: center' };
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

      const lastOrder = localStorage.getItem('lastOrder');
      if (lastOrder) {
        // Rebuild last order in cart!!!!

        console.log(`Last Order: ${lastOrder}`)
      };
    }

    //--- updateData
    // Display requested data (updatemenu event) or clear data
    updateData(e) {
      // Clear any previous slot settings
      this.querySelectorAll('item-data').forEach((element) => {
        element.removeAttribute('slot');
      });
      // Hide button
      const _button = this.shadowRoot.querySelector('#add-but');
      _button.style.display = 'none';
      // Hide overlay
      const _overlay = this.shadowRoot.querySelector('#details-container');
      _overlay.style.visibility = 'hidden';
      if (e) {
        e.stopPropagation()
        // Assign chosen data to slot
        if (e.detail.id) {
          this.querySelector(`item-data#${e.detail.id}`).setAttribute('slot', 'active-data');
          // Display button & overlay (remove hiding)
          _button.removeAttribute('style');
          _overlay.removeAttribute('style');
        }
        // Update button appearance
        this.displayAddButton();
      };
    }

    //--- displayAddButton
    // Determine appearance of 'Add To Order' button
    displayAddButton(e) {
      if (e) e.stopPropagation();
      const node = this.shadowRoot.querySelector('#details');
      const buttonNode = node.querySelector('#add-but');

      if (this.querySelectorAll('item-data[slot] item-line[count]').length === 0) {
        buttonNode.style.backgroundColor = 'rgb(128, 128, 128)';
        buttonNode.innerHTML = 'Close';
      } else {
        buttonNode.removeAttribute('style');
        buttonNode.innerHTML = 'Add To Order';
      }
    }

    //--- displayOrderButton
    // Determine appearance of 'Place Order' button
    displayOrderButton(e) {
      if (e) e.stopPropagation();
      const node = this.shadowRoot.querySelector('#cart');
      const buttonNode = node.querySelector('#place-but');

      if (this.querySelectorAll('line-item[slot="cart"][count]').length === 0)
        buttonNode.style.display = 'none';
      else buttonNode.removeAttribute('style');
    }

    //--- addToCart
    // Add any line items with count > 0 to cart
    addToCart() {
      // Get array of any <item-line> nodes in active <item-data> with a count > 0 
      const activeItemLines = [...this.querySelectorAll('[slot="active-data"] item-line[count]')];
      // Check if there is anything to do
      if (activeItemLines.length > 0) {
        // Add a new <line-item> to cart for each element of the array
        this.append(...activeItemLines.map((node) => {
          // Construct new element's description
          const itemHTML = `<div>${node.parentNode.parentNode.querySelector('item-title').innerHTML}</div><div>- ${node.parentNode.getAttribute('value')}</div><div>- ${node.innerHTML}</div>`;
          // Get item count
          const itemCount = node.getAttribute('count');
          // Create the new element
          const newEl = this.$createElement({
            tag: 'line-item',
            innerHTML: itemHTML,
            attrs: {
              slot: 'cart',
              count: itemCount,
              unit: node.getAttribute('prijs')
            }
          })
          // <item-line> has been processed so count to zero
          node.updateCount({ detail: { change: (0 - parseInt(itemCount)) } });
          // Send the new element to .append()
          return newEl
        }))
        // Update appearance of buttons
        this.displayAddButton();
        this.displayOrderButton();
      }
      // Whether closing or adding, data is removed
      this.updateData();
    }

    //--- dispatchOrder
    // Convert "cart" HTML to an array of objects 
    //  and dispatch outside form for handling by application
    dispatchOrder() {
      // Collect any items in cart and place in array
      const lineItems = [...this.querySelectorAll('line-item[count]')];
      // If any line items, process each and remove it from cart
      if (lineItems.length > 0) {
        // Create an event object
        const outputObj = {
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
        }
        // Save the last order on the user's local storage
        localStorage.setItem('lastOrder', JSON.stringify(outputObj.detail.orderdetails));
        // Dispatch the event
        this.$dispatch(outputObj);
      }
      this.displayOrderButton();
    }
  }
);