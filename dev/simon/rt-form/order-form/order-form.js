// ================================================================
// === order-form class definition

// Recover component name from URL
const [compName] = rtlib.parseURL(import.meta.url);

// Define the component
customElements.define(compName,
  class extends rtBC.RTBaseClass {
    // Declare private class fields
    #_sR;
    #_form;

    //+++ Lifecycle Events
    //--- constructor
    constructor() {
      // Initialise 'this'
      super();
      // Attach shadowDOM
      this.#_sR = this.attachShadow({ mode: "open" });
      // Attach contents of template placed in document.head
      this.#_sR.append(this.$getTemplate());

      //### Retrive form sizes and define defaults
      const attributes = this.attributes;
      this.#_sR.querySelector('#container').style.width = attributes['form-width'] ? attributes['form-width'].value : '1000px';
      const cartWidth = attributes['cart-width'] ? attributes['cart-width'].value : '350px';
      const _cart = this.#_sR.querySelector('#cart');
      _cart.style.flex = `0 0 ${cartWidth}`;
      _cart.style.maxWidth = cartWidth;
      this.id = 'eventBus';

      //### Event Listeners
      //___ updatemenu - Respond to product choice
      this.addEventListener('updatemenu', (e) => this.updateItemData(e));
      //___ orderaccept - Reset the form
      this.addEventListener('orderaccept', () => this.accepted());
      //___ updatecount - Respond to +/- presses when choosing items
      this.#_sR.querySelector('#menu-container').addEventListener('updatecount', (e) => this.displayDetailButton(e));
      //___ cartmod - Respond to +/- presses to items in cart
      this.#_sR.querySelector('#cart').addEventListener('cartmod', (e) => this.modifyCart(e));
      //___ add-items_click - Add the currently selected items to the cart
      this.#_sR.querySelector('#add-but').addEventListener('click', () => this.addToCart());
      //___ place-order_click - Send completed order to out of form
      this.#_sR.querySelector('#further-but').addEventListener('click', () => this.continueOrder());
      //___ recover-order_click - Fill cart with the items from the last order
      this.#_sR.querySelector('#recover-but').addEventListener('click', () => this.recoverOrder());
      this.#_sR.querySelector('#sub-but').addEventListener('click', () => this.dispatchOrder());
    }

    //--- connectedCallback
    connectedCallback() {
      this.initialiseMenu();
      // Make <order-form> visible - all style should be active by this point
      this.style.display = 'inline-block';
    }
    //+++ End of Lifecycle Events


    //--- initialiseMenu
    // Performs the following actions
    // - Create the pictoral menu at the top of the order form based on form HTML
    // - Restore cart if there were previously items present
    // - Move form HTML into the shadowDOM
    // - Prepopulate form if saved details found
    initialiseMenu() {
      /// Create pictorial menu
      // Recover image path from setting in HTML
      const imgPath = this.querySelector("form-config span#imgpath").innerHTML;

      // Collect all <item-data> elements
      const nodes = [...this.querySelectorAll('item-data')];
      // ...then create a new <menu-item> element for each, assigned to 'menu-items' slot  
      this.append(...nodes.map(element => {
        let elementAttrs = { id: `mi-${element.id}`, slot: 'menu-items', style: 'justify-self: center' };
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

      /// Restore cart
      if (localStorage.getItem('currentOrder')) this.updateCart();
      this.displayCartButtons();

      /// Move user's form to shadowDOM
      const srcNode = this.querySelector('div[slot="user-details"]');
      this.#_form = this.#_sR.querySelector('form#details-form');
      this.#_form.append(...srcNode.children);

    }

    //--- updateItemData
    // Display requested data (updatemenu event) or clear data (called manually)
    updateItemData(e) {
      // Handle event if present
      let newData;
      if (e) {
        e.stopPropagation();
        newData = e.detail.id;
      }

      // Clear any previous slot settings
      this.querySelectorAll('item-data').forEach((element) => {
        element.removeAttribute('slot');
      });

      // Set correct data (if any) and handle display of details overlay
      const _details = this.#_sR.querySelector('#details-container');
      if (newData) {
        this.querySelector(`item-data#${newData}`).setAttribute('slot', 'active-data');
        _details.style.visibility = 'visible';
        // Set button appearance
        this.displayDetailButton();
      } else {
        _details.style.visibility = '';
      }
    }

    //--- displayDetailButton
    // Determine appearance of button for details overlay
    displayDetailButton(e) {
      if (e) e.stopPropagation();
      // Get button node
      const buttonNode = this.shadowRoot.querySelector('#add-but');
      // Determine button appearance based on whether anything has been selected for addition
      if (this.querySelectorAll('item-data[slot] item-line[count]').length === 0) {
        // When no selection, button is grey and says 'cancel'
        buttonNode.classList.remove('buttonadd');
        // buttonNode.style.backgroundColor = 'rgb(128, 128, 128)';
        buttonNode.innerHTML = 'Annuleren';
      } else {
        // When something selected, button reverts to style and says 'Add'
        buttonNode.classList.add('buttonadd');
        // buttonNode.removeAttribute('style');
        buttonNode.innerHTML = 'Toevoegen';
      }
    }

    //--- displayCartButtons
    // Manage which buttons in the cart are displayed
    displayCartButtons(fiddle = false) {
      const buttons = {
        order: this.#_sR.getElementById('sub-but'),
        further: this.#_sR.getElementById('further-but'),
        last: this.#_sR.getElementById('recover-but')
      }
      // Start by hiding all buttons
      for (const button in buttons) if (buttons.hasOwnProperty(button)) buttons[button].style.display = 'none';

      //Choose which button to display
      let newBut;
      switch (true) {
        case ((this.querySelectorAll('line-item[slot="cart"][count]').length === 0 || fiddle) && localStorage.getItem('lastOrder') !== null):
          newBut = 'last';
          break;
        case this.#_sR.querySelector('#form-container').style.visibility === 'visible':
          newBut = 'order';
          break;
        case (this.querySelectorAll('line-item[slot="cart"][count]').length !== 0):
          newBut = 'further';
          break;
        default:
          newBut = null;
      }
      // Display the correct button - if there is one
      if (newBut) buttons[newBut].style.display = '';
    }

    //--- updateCart
    // Recreate the cart from the currentOrder local storage item
    updateCart() {
      // Delete any current cart contents
      const currentCartContents = [...this.querySelectorAll('line-item')];
      currentCartContents.forEach((node) => node.remove());

      // Recover order from local stortage
      const localData = JSON.parse(localStorage.getItem('currentOrder'));
      // Initialise order total
      let orderTotal = 0;
      if (localData) {
        // Append a new node for each element of the stored array
        this.append(...localData.map((lineData) => {
          // Build node's innerHTML
          //  Get item-line node corresponding to ProdID
          const itemLine = this.querySelector(`item-line[prodid="${lineData.prodID}"]`);
          //  Get enclosing item-variety
          const itemVar = itemLine.parentElement;
          //  Get enclosing item-data 
          const itemName = itemVar.parentElement;
          //  Construct cart text by combining data from item-line and enclosing item-variety & item-data
          const itemText = `${itemName.querySelector('item-title').innerText}<br/>${itemVar.getAttribute('value')} ${itemVar.getAttribute('desc')}<br/>${itemLine.innerText}`;

          // Get unit price for item-line 
          const unitPrice = itemLine.getAttribute('prijs');
          // Add this line value to order total
          orderTotal += parseInt(unitPrice) * lineData.count;

          // create new node for appending
          return this.$createElement({
            tag: 'line-item',
            innerHTML: itemText,
            attrs: {
              slot: 'cart',
              prodid: lineData.prodID,
              count: lineData.count,
              unit: unitPrice
            }
          });
        }
        ));
      };

      // Display order total if there is something in the cart
      this.#_sR.querySelector('#total').innerHTML = this.$euro(orderTotal / 100);

      // Re-determine if cart button visibilty should change
      this.displayCartButtons();
    }

    //--- updateCurOrderStor
    // Update the value of the currentOrder local storage item and rebuild cart
    updateCurOrderStor(itemObj) {
      // itemObj must contain an action property
      if (itemObj.action) {
        // Parse from currently stored value array from JSON or empty array if item doesn't exist
        const currentItems = JSON.parse(localStorage.getItem('currentOrder')) || [];
        // Let's assume this is a new value
        let notFound = true;

        // If currentItems is not an empty array then search for an element to change
        if (currentItems) {
          const maxVal = currentItems.length;
          // Search through array for element to change
          for (let i = 0; i < maxVal; i++) {
            // Find the correct element
            if (itemObj.prodID === currentItems[i].prodID) {
              // Add new value to existing menu item
              if (itemObj.count) currentItems[i].count += itemObj.count;
              // Remove element if deleted or new item count is zero
              if (itemObj.action === 'remove' || currentItems[i].count === 0) currentItems.splice(i, 1);
              // Terminate search on first match
              notFound = false;
              break;
            }
          }
        }
        // If no existing entry found this must be new item to add to the array
        if (notFound) {
          // Remove the 'action'property from the object
          delete itemObj.action;
          // Add the object to the array
          currentItems.push(itemObj);
        }

        // Update local storage
        //  Save the current order to local storage
        if (currentItems.length > 0) localStorage.setItem('currentOrder', JSON.stringify(currentItems));
        //  Or delete storage item
        else localStorage.removeItem('currentOrder');

        this.updateCart();
      }
    }

    //--- modifyCart
    // Catch event and send details on for cart modification
    modifyCart(e) {
      e.stopPropagation();
      this.updateCurOrderStor(e.detail);
    }

    //--- addToCart
    // Add a new element to currentOrder for any item-line with count > 0 and rebuild cart
    addToCart() {
      // Get array of any <item-line> nodes in active <item-data> with a count > 0 
      const activeItemLines = [...this.querySelectorAll('[slot="active-data"] item-line[count]')];

      if (activeItemLines) activeItemLines.forEach(node => {
        // Update the currentorder storage item
        this.updateCurOrderStor({
          prodID: node.getAttribute('prodid'),
          count: parseInt(node.getAttribute('count')),
          action: 'update'
        });
        // Remove the item-line count attribute by setting to zero
        node.updateCount({ detail: { change: (0 - parseInt(node.getAttribute('count'))) } });
      });

      // Whether closing or adding, current item data is cleared
      this.updateItemData();
    }

    //--- continueOrder
    continueOrder() {
      /// Prepopulate form if saved details found
      const details = localStorage.getItem('userDeets');
      if (details) {
        // Set 'savefields' boolean
        this.#_form.querySelector('#savefields').checked = true;
        // Get stored details
        const deetsObj = JSON.parse(details);
        // Repopulate details in to form
        for (const [key, value] of Object.entries(deetsObj)) {
          this.#_form.querySelector(`[name=${key}]`).value = value;
        }
      }

      // Unhide form
      this.#_sR.querySelector('#form-container').style.visibility = 'visible';
      // Update button visibility in cart
      this.displayCartButtons();
    }

    //--- recoverOrder
    // Reload the last order dispatched
    recoverOrder() {
      // Fill the currentOrder storage item with the contents from lastOrder
      if (localStorage.getItem('lastOrder')) localStorage.setItem('currentOrder', localStorage.getItem('lastOrder'))
      // Rebuild cart
      this.updateCart();
    }

    //--- dispatchOrder
    // Catch the form submit event and ensure required values have been provided
    dispatchOrder() {
      // Continue if form found
      if (this.#_form) {
        //### Check form data validity
        // Set fail flag
        let firstFail = false;

        // Collect all possible field types
        const nodes = this.#_form.querySelectorAll('form-field, pickup-locations, date-picker');
        // Check validity of each field type and set focus to first field to fail check
        for (const el of nodes) {
          if (!el.checkValidity()) {
            if (!firstFail) {
              el.focus();
              firstFail = true;
            }
          }
        }

        // Disptach order if all checks pass
        if (!firstFail) {
          //### Dispatch order and reset form
          // Collect the current form data
          const formValues = new FormData(this.#_form);
          // Dispatch an event containing the order details
          this.$dispatch({
            name: 'neworder',
            detail: {
              person: Object.fromEntries(formValues.entries()),
              order: JSON.parse(localStorage.getItem('currentOrder'))
            }
          });

        }
      }
      else console.warn('Form submission failed: form not found');
    }

    //--- accepted
    // Reset the component once order has been accepted
    accepted() {
      // Hide the details form
      this.#_sR.querySelector('#form-container').style.visibility = '';
      // Set last order on the user's local storage to current order
      localStorage.setItem('lastOrder', localStorage.getItem('currentOrder'));
      // Clear the cart
      localStorage.removeItem('currentOrder');
      this.updateCart();
      //  Reset the buttons
      this.displayCartButtons();
      // Check if user has chosen to save their details
      const saveFields = this.#_sR.querySelector('#savefields');
      // If yes then put details in object and store as JSON string
      if (saveFields && saveFields.checked) {
        const fields = [...this.#_sR.querySelectorAll(`#details-form form-field,textarea`)];
        const output = fields.reduce((acc, el) => ({ ...acc, [el.name]: el.value }), {});
        localStorage.setItem('userDeets', JSON.stringify(output));
        // If no then clear any existing data
      } else localStorage.removeItem('userDeets');

      this.#_form.reset();

      console.log('Form Submitted!');
    }
  }
);