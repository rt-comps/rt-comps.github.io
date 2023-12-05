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
    #_menu;

    //+++ Lifecycle Events
    //--- constructor
    constructor() {
      // Initialise 'this'
      super();
      // Attach shadowDOM and store in private field
      this.#_sR = this.attachShadow({ mode: "open" });
      // Attach contents of template placed in document.head
      this.#_sR.append(this.$getTemplate());

      // Set this component as the 'eventbus'
      this.id = 'eventBus';

      // Store some useful nodes in private fields
      this.#_form = this.#_sR.querySelector('#user-form');
      this.#_menu = this.#_sR.querySelector('#menu-container');

      //### Retrive form sizes and define defaults
      const attributes = this.attributes;
      this.#_sR.querySelector('#container').style.width = attributes['form-width'] ? attributes['form-width'].value : '1000px';
      const cartWidth = attributes['cart-width'] ? attributes['cart-width'].value : '350px';
      const _cart = this.#_sR.querySelector('#cart');
      _cart.style.flex = `0 0 ${cartWidth}`;
      _cart.style.maxWidth = cartWidth;

      //### Event Listeners
      //___ updatemenu - Display product information when product chosen
      this.addEventListener('updatemenu', (e) => this.updateItemData(e));

      /// Responding to +/- clicks
      //___ updatecount - Determine any detail overlay button appearance changes
      this.#_menu.addEventListener('updatecount', (e) => this.displayDetailButton(e));
      //___ cartmod - Respond to +/- presses in a <line-item> and re-render cart
      _cart.addEventListener('cartmod', (e) => this.modifyCurrentOrder(e));

      /// Button Actions
      ///- Cart
      //___ add-items_click - Add the currently selected items to the cart
      this.#_sR.querySelector('#prod-add-but').addEventListener('click', () => this.addToCart());
      //___ place-order_click - Send completed order to out of form
      this.#_sR.querySelector('#further-but').addEventListener('click', () => this.continueOrder());
      //___ recover-order_click - Fill cart with the items from the last order
      this.#_sR.querySelector('#recover-but').addEventListener('click', () => this.recoverOrder());
      ///- Form
      // Submit the order
      this.#_sR.querySelector('#submit-but').addEventListener('click', () => this.dispatchOrder());
      // Hide the form
      this.#_sR.querySelector('#cancel-but').addEventListener('click', () => this.hideForm());
    }

    //--- connectedCallback
    connectedCallback() {
      this.initialiseAll();
      // Make <order-form> visible - all style should be active by this point
      this.style.display = 'inline-block';
    }
    //+++ End of Lifecycle Events


    //--- initialiseAll
    // Performs the following actions
    // - Create the pictoral menu at the top of the order form based on form HTML
    // - Restore cart if there were previously items present
    // - Move form HTML into the shadowDOM
    // - Prepopulate form if saved details found
    initialiseAll() {
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

      /// Restore cart contents
      if (localStorage.getItem('currentOrder')) this.updateCart();
      this.displayCartButtons();

      /// Move user's form to shadowDOM - as a form cannot be slotted
      const srcNode = this.querySelector('div[slot="user-details"]');
      if (srcNode) {

        this.#_form.append(...srcNode.children);
      } else console.warn('No details form provided');
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
      const buttonNode = this.shadowRoot.querySelector('#prod-add-but');
      // Has anything been selected?
      if (this.querySelectorAll('item-data[slot] item-line[count]').length > 0) {
        // When something selected, button reverts to style and says 'Add'
        buttonNode.innerHTML = 'Toevoegen';
      } else {
        // When no selection, button is grey and says 'cancel'
        buttonNode.innerHTML = 'Annuleren';
      }
    }

    //--- displayCartButtons
    // Manage which buttons in the cart are displayed
    displayCartButtons(fiddle = false) {
      const buttons = {
        further: this.#_sR.getElementById('further-but'),
        last: this.#_sR.getElementById('recover-but')
      }
      // Start by hiding all buttons
      for (const button in buttons) if (buttons.hasOwnProperty(button)) buttons[button].style.display = 'none';

      // Choose which button to display
      let newBut;
      // Is the cart empty
      const cartEmpty = this.querySelectorAll('line-item[slot="cart"][count]').length === 0;
      switch (true) {
        case ((cartEmpty || fiddle) && localStorage.getItem('lastOrder') !== null):
          newBut = 'last';
          break;
        case this.#_sR.querySelector('#form-container').style.visibility !== 'visible' && !cartEmpty:
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
      // Delete all current cart contents
      const currentCartContents = [...this.querySelectorAll('line-item')];
      currentCartContents.forEach((node) => node.remove());

      // Recover current order details from local stortage
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

      // Display new order total
      this.#_sR.querySelector('#total').innerHTML = this.$euro(orderTotal / 100);

      // Re-determine if cart button visibilty should change
      this.displayCartButtons();
    }

    //--- updateCurOrderStor
    // The currentOrder local storage instance holds the order information (JSON string of array of objects)
    // When a change is made to the order then the currentOrder instance is updated as required 
    //  and the cart is rebuilt from the new contents of this instance
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

    //--- modifyCurrentOrder
    // Catch event and send details on for cart modification
    modifyCurrentOrder(e) {
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
        // Reset the <item-line> count attribute to zero
        node.updateCount({ detail: { change: (0 - parseInt(node.getAttribute('count'))) } });
      });

      // Whether closing or adding, current item data is cleared
      this.updateItemData();
    }

    //--- continueOrder
    // Display the form and pre-populate fields if previous data found
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
      // Resize menu-container DIV height to size of form
      this.#_menu.style.height = `${(Math.ceil(this.#_form.parentElement.getBoundingClientRect().height)) + 5}px`

      // Unhide form
      this.#_form.parentElement.style.visibility = 'visible';
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

    //--- validateForm
    // Determine if the form has been completed as required
    validateForm() {
      // Declare flag
      let firstFail = false;
      // Continue if form found
      if (this.#_form) {
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
      } else firstFail = false;

      // Return valid status
      return !firstFail;
    }

    //--- dispatchOrder
    // Catch the form submit event
    dispatchOrder() {
      // Disptach order if all checks pass
      if (this.validateForm()) {
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
      } else console.warn('Form submission failed: form not found');
    }

    //--- accepted
    // Reset the component once order has been accepted
    // This called from the wrapping order dispatch code
    accepted() {
      // Set last order on the user's local storage to current order
      localStorage.setItem('lastOrder', localStorage.getItem('currentOrder'));
      // Clear the cart
      localStorage.removeItem('currentOrder');
      this.updateCart();
      // Reset display
      this.hideForm();
      // Save user details if chosen
      const saveFields = this.#_sR.querySelector('#savefields');
      // If yes then put details in object and store as JSON string
      if (saveFields && saveFields.checked) {
        const fields = [...this.#_sR.querySelectorAll(`#details-form form-field,textarea`)];
        const output = fields.reduce((acc, el) => ({ ...acc, [el.name]: el.value }), {});
        localStorage.setItem('userDeets', JSON.stringify(output));
        // If no then clear any existing data
      } else localStorage.removeItem('userDeets');
      // Reset the form elements
      this.#_form.reset();
      //DEBUG
      console.log('Form Submitted!');
    }

    //--- hideForm
    // Hide form and reset menu-container DIV height
    // Any details already entered and the cart are unaffected
    hideForm() {
      // Reset menu-container DIV height to fit menu items
      this.#_menu.style.height = '';
      // Hide the form
      this.#_form.parentElement.style.visibility = '';
      // Scroll to top of page
      window.scrollTo(0,0);
      // Update buttons in the shopping cart
      this.displayCartButtons();
    }
  }
);