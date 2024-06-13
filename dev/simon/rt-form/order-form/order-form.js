// ================================================================
// === order-form class definition

// Recover component name from URL
const [compName, compPath] = rtlib.parseURL(import.meta.url);

// Define the component
customElements.define(compName,
  class extends rtBC.RTBaseClass {
    /// ### PRIVATE CLASS FIELDS
    #_sR;           // Shadow Root node
    #_menu;         // Menu node
    #_details       // Product Details node
    #_form;         // Form node
    #_cart;         // Cart node
    #_cartContents  // The current contents of the cart

    // +++ Lifecycle Events
    //--- constructor
    constructor() {
      // Initialise 'this'
      super();
      // Attach shadowDOM and store in private field
      this.#_sR = this.attachShadow({ mode: "open" });
      // Attach contents of template placed in document.head by LoadComponent()
      this.#_sR.append(this.$getTemplate());

      // Set this component as the 'eventbus'
      this.id = 'eventBus';

      // Store some useful nodes in private fields
      this.#_form = this.#_sR.querySelector('#user-form');
      this.#_details = this.#_sR.querySelector('#product-details');
      this.#_menu = this.#_sR.querySelector('#menu-items-container');
      this.#_cart = this.#_sR.querySelector('#cart');

      // If it exists, load any locally stored cart contents into memory 
      this.#_cartContents = JSON.parse(localStorage.getItem('currentOrder')) || [];

      //-- Event Listeners
      //___ updatemenu - Display product information when product chosen
      this.addEventListener('updatemenu', (e) => this.#updateItemDataDialog(e));

      /// Responding to +/- clicks
      //___ updatecount - Determine any detail overlay button appearance changes
      this.#_menu.addEventListener('updatecount', (e) => this.#displayDetailButton(e));
      //___ cartmod - Respond to +/- presses in a <line-item> and re-render cart
      this.#_cart.addEventListener('cartmod', (e) => this.#modifyCurrentOrder(e));

      /// Button Actions
      ///- Product Details
      //___ close dialog
      this.#_sR.querySelector('#product-details-close').addEventListener('click', () => this.#updateItemDataDialog());
      //___ add-items_click - Add the currently selected items to the cart
      this.#_sR.querySelector('#prod-add-but').addEventListener('click', () => this.#addToCart());
      ///- Cart
      //___ place-order_click - Send completed order to out of form
      this.#_sR.querySelector('#further-but').addEventListener('click', () => this.#continueOrder());
      //___ recover-order_click - Fill cart with the items from the last order
      this.#_sR.querySelector('#recover-but').addEventListener('click', () => this.#recoverOrder());

      /// Form
      //___ Submit the order
      this.#_sR.querySelector('#submit-but').addEventListener('click', () => this.#dispatchOrder());
      //___ Hide the form
      this.#_sR.querySelector('#cancel-but').addEventListener('click', () => this.#showForm(false));
    }

    //--- connectedCallback
    connectedCallback() {
      this.#initialiseAll();
      // Remove class used for mobile version (wait for transition to occur)
      setTimeout(() => this.#_cart.classList.remove('init'), 500);
      // Make <order-form> visible - all style should be active by this point
      this.style.display = 'inline-block';
    }
    //+++ End of Lifecycle Events


    /// ### Private Methods

    //--- #displayCartButtons
    // Manage which buttons in the cart are displayed
    #displayCartButtons(fiddle = false) {
      const buttons = {
        further: this.#_sR.getElementById('further-but'),
        last: this.#_sR.getElementById('recover-but')
      }
      // Start by hiding all buttons
      for (const button in buttons) if (buttons.hasOwnProperty(button)) buttons[button].style.display = 'none';

      // Choose which button to display
      let newBut;
      // Is the cart empty?
      const cartEmpty = this.querySelectorAll('line-item[slot="cart"][count]').length === 0;
      // Is form overlay active?
      const noOverlay = this.#_form.parentElement.style.display === 'none';
      switch (true) {
        case ((cartEmpty || fiddle) && localStorage.getItem('lastOrder') !== null):
          newBut = 'last';
          break;
        case noOverlay && !cartEmpty:
          newBut = 'further';
          break;
        default:
          newBut = null;
      }
      // Display the correct button - if there is one
      if (newBut) buttons[newBut].style.display = '';
    }

    //--- #displayDetailButton
    // Determine appearance of button for details overlay
    #displayDetailButton(e) {
      if (e) e.stopPropagation();
      let newDisplay;
      // Does anything in dialog have a value?
      if (this.querySelectorAll('item-data[slot] item-line[count]').length > 0) {
        // When something selected, button reverts to style and says 'Add'
        newDisplay = '';
      } else {
        // When no selection, button disappears
        newDisplay = 'none';
      }
      this.shadowRoot.querySelector('#prod-add-but').style.display = newDisplay;
    }

    //--- #initialiseAll
    // Performs the following actions
    // - Create the pictoral menu at the top of the order form based on form HTML
    // - Restore cart if there were previously items present
    // - Move form HTML into the shadowDOM
    // - Prepopulate form if saved details found
    #initialiseAll() {
      /// Create pictorial menu
      // Recover image path from setting in HTML
      const imgPath = this.querySelector("form-config span#imgpath").innerHTML;
      // Collect all <item-data> elements
      const nodes = [...this.querySelectorAll('item-data')];
      // ...then create a new <menu-item> element for each, assigned to 'menu-items' slot  
      this.append(...nodes.map(element => {
        let elementAttrs = { id: `mi-${element.id}`, slot: 'menu-items' };//, style: 'justify-self: center' };
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
      /// Only do this for smaller screens
      // Additional initialisation for mobile client
      if (window.matchMedia("(max-width: 430px)").matches) {
        const cartTitle = this.#_cart.querySelector('#cart-title');
        // Add cart toggle when cart-title clicked
        cartTitle.addEventListener('click', () => this.#toggleCart());
        setTimeout(() => {
          // Determine padding and border sizes
          const cartStyle = getComputedStyle(this.#_cart);
          const cartMod = (parseInt(cartStyle.paddingTop) * 2) + (parseInt(cartStyle.borderLeftWidth) * 2);
          // Determine size of cart-title and add adjustment for padding and borders
          const cartTitleSize = `${(parseFloat(cartTitle.getBoundingClientRect().height) + cartMod).toFixed(0)}px`;
          // Set CSS variable for minimized size
          this.#_cart.style.setProperty('--MINIMIZED-CART', cartTitleSize);
          this.#toggleCart();
        }, 0);
      }

      // Add image to details dialog
      this.#_sR.querySelector('#product-details-close img').src = `${compPath}/img/close-blk.png`;

      this.#_menu.querySelector('#menu').style.display = '';

      /// Restore cart contents
      if (localStorage.getItem('currentOrder')) this.#updateCart();
      this.#displayCartButtons();

      /// Move user's form to shadowDOM - as a form cannot be slotted
      const srcNode = this.querySelector('div[slot="user-details"]');
      if (srcNode) {

        this.#_form.append(...srcNode.children);
      } else console.warn('No details form provided');
    }

    //--- #showForm
    // show == true - hide product menu / display user-defined form
    // show == false - hide user-define form / display product menu
    #showForm(show) {
      this.#_menu.querySelector('#menu').style.display = show ? 'none' : '';
      this.#_menu.querySelector('#form-container').style.display = show ? '' : 'none';
      this.#displayCartButtons();
    }

    //--- #toggleCart
    // Handle Cart visibilty in mobile version by toggling class 'mini'
    #toggleCart() {
      const classes = this.#_cart.classList;
      if (classes.contains('mini')) classes.remove('mini');
      else classes.add('mini');
    }

    //--- #updateCart
    // Recreate the cart from the currentOrder local storage item
    #updateCart() {
      // Delete all current cart contents
      const currentCartContents = [...this.querySelectorAll('line-item')];
      currentCartContents.forEach((node) => node.remove());

      // Initialise order total
      let orderTotal = 0;
      if (this.#_cartContents.length) {
        // Append a new node for each element of the stored array
        this.append(...this.#_cartContents.map((lineData) => {
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
      this.#_sR.querySelector('#order-total-amount').innerHTML = this.$euro(orderTotal / 100);

      // Re-determine if cart button visibilty should change
      this.#displayCartButtons();
    }

    //--- #updateCurOrderStor
    // The currentOrder local storage instance holds the order information (JSON string of array of objects)
    // When a change is made to the order then the currentOrder instance is updated as required 
    //  and the cart is rebuilt from the new contents of this instance
    #updateCurOrderStor(itemObj) {
      // Let's assume this is a new value
      let notFound = true;
      // itemObj must contain an action property
      if (itemObj.action) {
        // If this.#_cartContents is not an empty array then search for an element to change
        if (this.#_cartContents.length > 0) {
          for (const currentItem of this.#_cartContents) {
            if (itemObj.prodID === currentItem.prodID) {
              // Remove element if deleted or new item count is zero
              if (itemObj.action === 'remove' || itemObj.count === 0) this.#_cartContents.splice(this.#_cartContents.indexOf(currentItem), 1);
              // Add new value to existing menu item
              if (itemObj.count) currentItem.count = itemObj.count;
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
          this.#_cartContents.push(itemObj);
        }

        // Update local storage
        //  Save the current order to local storage
        if (this.#_cartContents.length > 0) localStorage.setItem('currentOrder', JSON.stringify(this.#_cartContents));
        //  Or delete storage item
        else localStorage.removeItem('currentOrder');

        // Rebuild cart using latest data
        this.#updateCart();
      }
    }

    //--- #updateItemDataDialog
    // Display requested data (updatemenu event) or clear data (called manually)
    #updateItemDataDialog(e) {
      // Handle event if present
      let newItem;
      if (e) {
        e.stopPropagation();
        newItem = e.detail.id;
      }
      // Clear any previous slot settings
      this.querySelectorAll('item-data').forEach((element) => {
        element.removeAttribute('slot');
      });

      // Present correct data in details dialog if called by listener
      if (newItem) {
        // Get node for selected data
        const newData = this.querySelector(`item-data#${newItem}`)
        // Slot in correct product data
        newData.setAttribute('slot', 'active-data');

        // Retrieve any relevent data already in cart
        // Convert cart content nodes to consistent 2D array of 'prodid' and 'count'
        const lineItems = [...this.querySelectorAll('line-item[slot="cart"]')].reduce((acc, cur) => {
          acc[0].push(cur.$attr('prodid'));
          acc[1].push(cur.$attr('count'));
          return acc;
        }, [[], []]);
        // Get item-lines
        const itemLines = [...newData.querySelectorAll('item-variety item-line')];

        // Search for any item-lines in cart and set item-line count to value in cart
        for (const dispLine of itemLines) {
          const prodIndex = lineItems[0].indexOf(dispLine.$attr('prodid'));
          if (prodIndex > -1) {
            // Match - Update line-item count to count in cart
            dispLine.$dispatch({ name: 'updatecount', detail: { change: lineItems[1][prodIndex], replace: true } });
          } else {
            // Unmatched -  Reset line count in dialog to zero if needed
            if (dispLine.$attr('count') > 0)
              dispLine.$dispatch({ name: 'updatecount', detail: { change: '0', replace: true } });
          }
        }

        // Display the dialog
        this.#_details.showModal();
        // Hide the button
        this.#displayDetailButton();
      } else {
        // Close the dialog
        this.#_details.close();
      }
      // Ensure the correct button is visible in cart
      this.#displayCartButtons();
    }

    //--- #validateForm
    // Determine if the form has been completed as required
    #validateForm() {
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


    /// Event ONLY methods

    //--- #addToCart
    // Add a new element to currentOrder for any item-line with count > 0 and rebuild cart
    #addToCart() {
      // Get array of any <item-line> nodes in active <item-data> with a count > 0 
      const activeItemLines = [...this.querySelectorAll('[slot="active-data"] item-line[count]')];

      if (activeItemLines) activeItemLines.forEach(node => {
        // Update the currentorder storage item
        this.#updateCurOrderStor({
          prodID: node.$attr('prodid'),
          count: parseInt(node.$attr('count')),
          action: 'update'
        });
        // A zero 'count' is needed to remove the item from cart but should not be processed on next invocation
        if (node.$attr('count') === "0") node.removeAttribute('count');
      });

      // Whether closing or adding, current item data is cleared
      this.#updateItemDataDialog();
    }

    //--- #continueOrder
    // Display the form and pre-populate fields if previous data found
    #continueOrder() {
      /// Prepopulate form if saved details found
      const details = localStorage.getItem('user-details');
      if (details) {
        // Set 'savefields' boolean
        this.#_form.querySelector('#savefields').checked = true;
        // Get stored details
        const productDetailsObj = JSON.parse(details);
        // Repopulate details in to form
        for (const [key, value] of Object.entries(productDetailsObj)) {
          this.#_form.querySelector(`[name=${key}]`).value = value;
        }
      }
      this.#showForm(true);
    }

    //--- #dispatchOrder
    // Catch the form submit event
    #dispatchOrder() {
      // Disptach order if all checks pass
      if (this.#validateForm()) {
        //### Dispatch order and reset form
        // Collect the current form data
        const formValues = new FormData(this.#_form);
        // Bubble a composed event containing the order details
        this.$dispatch({
          name: 'neworder',
          detail: {
            person: Object.fromEntries(formValues.entries()),
            order: this.#_cartContents
          }
        });
      } else console.warn('Form submission not valid');
    }

    //--- #modifyCurrentOrder
    // Catch event and send details on for cart modification
    #modifyCurrentOrder(e) {
      e.stopPropagation();
      this.#updateCurOrderStor(e.detail);
    }

    //--- #recoverOrder
    // Reload the last order dispatched
    #recoverOrder() {
      // Fill the currentOrder storage item with the contents from lastOrder
      if (localStorage.getItem('lastOrder')) localStorage.setItem('currentOrder', localStorage.getItem('lastOrder'))
      // Rebuild cart
      this.#updateCart();
    }


    /// ### PUBLIC METHODS

    //--- accepted
    // Reset the component once order has been accepted
    // This is only called from the wrapping code
    accepted() {
      // Set last order on the user's local storage to current order
      localStorage.setItem('lastOrder', localStorage.getItem('currentOrder'));
      // Clear the cart
      localStorage.removeItem('currentOrder');
      this.#updateCart();
      // Reset display
      this.#showForm(false);
      // Save user details if chosen
      const saveFields = this.#_sR.querySelector('#savefields');
      // If yes then put details in object and store as JSON string
      if (saveFields && saveFields.checked) {
        const fields = [...this.#_sR.querySelectorAll(`#details-form form-field,textarea`)];
        const output = fields.reduce((acc, el) => ({ ...acc, [el.name]: el.value }), {});
        localStorage.setItem('user-details', JSON.stringify(output));
        // If no then clear any existing data
      } else localStorage.removeItem('user-details');
      // Reset the form elements
      this.#_form.reset();
      //DEBUG
      console.log('Form Submitted!');
    }
  }
);

