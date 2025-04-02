// ================================================================
// === rt-orderform class definition

// Recover component name from URL
const [compName, compPath] = rtlib.parseCompURL(import.meta.url);

// Define the component
customElements.define(compName,
  class extends rtBC.RTBaseClass {
    /// ### PRIVATE CLASS FIELDS
    #_sR;           // shadowRoot node
    #_menu;         // Menu node
    #_details;      // Product Details node
    #_form;         // Form node
    #_cart;         // Cart node
    #_cartContents; // Object with current contents of the cart

    // +++ Lifecycle Events
    //--- constructor
    constructor() {
      // Initialise 'this'
      super();
      // Attach shadowDOM and store in private field
      this.#_sR = this.attachShadow({ mode: "open" });
      // Attach contents of template placed in document.head by LoadComponent()
      this.#_sR.append(this.$getTemplate());

      // Set this component as the 'eventbus' - used for handling event communications between components
      this.id = 'eventBus';

      // Store some useful nodes in private fields
      this.#_form = this.#_sR.querySelector('#user-form');
      this.#_details = this.#_sR.querySelector('#product-details');
      this.#_menu = this.#_sR.querySelector('#menu-items-container');
      this.#_cart = this.#_sR.querySelector('#cart');

      // If it exists, load any locally stored cart contents into memory (array of objects)
      this.#_cartContents = JSON.parse(localStorage.getItem('currentOrder')) || [];

      //-- Event Listeners
      //___ initmenu - Display product information when product chosen
      this.addEventListener('initmenu', (e) => this.#detailsInitItemValues(e));

      /// Responding to +/- clicks
      //___ updatecount - Determine button appearance based on changes made to itemLines
      this.#_menu.addEventListener('updatecount', (e) => {
        e.stopPropagation();
        this.#detailsButtonDisplay()
      });
      //___ cartmod - Respond to +/- presses in a <rt-lineitem> and re-render cart
      this.#_cart.addEventListener('cartmod', (e) => this.#orderModifyCurrent(e));

      /// Button Actions
      ///- Product Details
      //___ close dialog
      this.#_sR.querySelector('#product-details-close').addEventListener('click', () => this.#detailsInitItemValues());
      //___ add-items_click - Add the currently selected items to the cart
      this.#_sR.querySelector('#prod-add-but').addEventListener('click', (e) => {
        // Check that button is enabled before calling #detailsUpdateCart
        if (e.composedPath()[0].classList.contains('button-dis')) return
        this.#detailsUpdateCart()
      });
      ///- Cart
      //___ place-order_click - Send completed order to out of form
      this.#_sR.querySelector('#further-but').addEventListener('click', () => this.#orderContinue());
      //___ recover-order_click - Fill cart with the items from the last order
      this.#_sR.querySelector('#recover-but').addEventListener('click', () => this.#orderRecover());

      /// Form
      //___ Submit the order
      this.#_sR.querySelector('#submit-but').addEventListener('click', () => this.#orderDispatch());
      //___ Hide the form
      this.#_sR.querySelector('#cancel-but').addEventListener('click', () => {
        this.#formShow(false);
        this.#_sR.querySelector('div#cart').style.display = '';
      });
    }

    //--- connectedCallback
    connectedCallback() {
      if (typeof rtForm !== 'undefined') rtForm.getStyle(this)
      // Inform containing code that 
      this.$dispatch({ name: 'formready' });
    }

    //+++ End of Lifecycle Events


    /// ### Private Methods

    //--- #cartButtonsDisplay
    // Manage which buttons in the cart are displayed
    #cartButtonsDisplay() {
      // Store button elements in map
      const buttons = new Map([
        ['further', this.#_sR.getElementById('further-but')],
        ['last', this.#_sR.getElementById('recover-but')]
      ])

      // Start by hiding all buttons
      for (const [key, value] of buttons) {
        value.style.display = 'none'
      }

      // initialise as local global
      let newBut;
      // Is the cart empty?
      const cartEmpty = this.querySelectorAll('rt-lineitem[slot="cart"][count]').length === 0;
      // Determine correct button to show
      switch (true) {
        // Is cart empty and previous order stored?
        case (cartEmpty && localStorage.getItem('lastOrder') !== null):
          newBut = 'last';
          break;
        // Does cart have contents and for is not being displayed?
        case (!cartEmpty && this.#_form.parentElement.style.display === 'none'):
          newBut = 'further';
          break;
        default:
          newBut = null;
      }

      // Display the correct button - if there should be one
      if (newBut) buttons.get(newBut).style.display = '';
    }

    //--- #cartCurOrderStorUpdate
    // The current order information is stored in this.#_cartContents as an array of objects and is also mirrored as a JSON string in a local Storage object ('currentOrder')
    // When a change is made to the order then this.#_cartContents is updated, the Storage object is rewritten and the cart rebuilt from the Storage object.
    #cartCurOrderStorUpdate(itemObj) {
      /* 
      parameter 'itemObj' is expected in the form
        {
          prodID: <String>,   - The product to update
          count:  <Number>,   - The new count
        }
       */
      // Check itemObj is as expected
      if (!Object.hasOwn(itemObj, 'prodID') || !Object.hasOwn(itemObj, 'count') || typeof itemObj.prodID !== 'string' || typeof itemObj.count !== 'number') {
        console.error('#cartCurOrderStorUpdate: itemObj not in expected form');
        return
      }

      // No changes made yet
      const flags = {
        updated: false,
        found: false
      }

      // Check if there is a need to search the current cart
      if (this.#_cartContents.length > 0) {
        // If this.#_cartContents is not an empty array then search for existing cart entries for a match
        for (const currentItem of this.#_cartContents) {
          // Found a match?
          if (itemObj.prodID === currentItem.prodID) {
            flags.found = true;
            if (itemObj.count !== currentItem.count) {
              if (itemObj.count === 0) this.#_cartContents.splice(this.#_cartContents.indexOf(currentItem), 1);
              else currentItem.count = itemObj.count;
              // Cart update has been made so exit search
              flags.updated = true;
            }
            break;
          }
        }
      }

      // If no existing cart entry found this must be new item to add to the cart
      if (!flags.found && itemObj.count > 0) {
        // Add the modified object to the array
        this.#_cartContents.push(itemObj);
        flags.updated = true;
      }

      // Update local storage after change
      if (flags.updated) {
        //  Save the current order data to local Storage object
        if (this.#_cartContents.length > 0) localStorage.setItem('currentOrder', JSON.stringify(this.#_cartContents));
        //  If this.#_cartContents is empty then delete Storage object
        else localStorage.removeItem('currentOrder');
        // Rebuild cart using latest data
        this.#cartRebuild();
      }
    }

    //--- #cartRebuild
    // Recreate the cart from the currentOrder local storage item
    #cartRebuild() {
      // Delete all current cart contents
      const currentCartContents = [...this.querySelectorAll('rt-lineitem')];
      currentCartContents.forEach((node) => node.remove());

      // Initialise order total
      let orderTotal = 0;
      if (this.#_cartContents.length) {
        // Append a new node for each element of the stored array
        this.append(...this.#_cartContents.map((lineData) => {
          // Build node's innerHTML
          //  Get rt-itemline node corresponding to ProdID
          const itemLine = this.querySelector(`rt-itemline[prodid="${lineData.prodID}"]`);
          //  Get enclosing rt-itemvariety
          const itemVar = itemLine.parentElement;
          //  Get enclosing <rt-itemdata> 
          const itemName = itemVar.parentElement;
          //  Construct cart text by combining data from rt-itemline and enclosing <rt-itemvariety> & <rt-itemdata>
          const itemText = `${itemName.querySelector('item-title').innerText}<br/>${itemVar.getAttribute('value')} ${itemVar.getAttribute('desc')}<br/>${itemLine.innerText}`;

          // Get unit price for rt-itemline 
          const unitPrice = itemLine.getAttribute('prijs');
          // Add this line value to order total
          orderTotal += parseInt(unitPrice) * lineData.count;

          // create new node for appending
          return this.$createElement({
            tag: 'rt-lineitem',
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
      this.#cartButtonsDisplay();
    }

    //--- #cartToggle
    // Handle Cart visibilty in mobile version by toggling class 'mini'
    #cartToggle() {
      const classes = this.#_cart.classList;
      if (classes.contains('mini')) classes.remove('mini');
      else classes.add('mini');
    }

    //--- #detailsHasDataChanged
    // Determine if current value matches value in 'currentOrder' local storage object
    #detailsHasDataChanged(testData) {
      // Convert cart contents to JSON string
      const cart = JSON.stringify(this.#_cartContents);
      // If count is zero then should not be in cart
      if (testData.count === 0) return (cart.indexOf(testData.prodID) > -1)
      // If count is non-zero then check if the current value === cart value
      else return (cart.indexOf(JSON.stringify(testData)) === -1)
    }

    //--- #detailsInitItemValues
    // Display #product-details dialog with requested data.
    // Close dialog if called manually with no parameter
    #detailsInitItemValues(e) {
      // Declare in local global scope
      let newItem;
      // Handle event if present
      if (e instanceof Event) {
        e.stopPropagation();
        newItem = e.detail.id;
      }
      // Clear any previous slot settings
      this.querySelectorAll('rt-itemdata').forEach((element) => {
        element.removeAttribute('slot');
      });

      // If called manually then the process can clean up and stop here
      if (!newItem) {
        // Close the dialog if Event has no value for details.id
        this.#_details.close();
        // Ensure the correct button is visible in cart
        // this.#cartButtonsDisplay();
        return
      }

      // Get node for selected data
      const newData = this.querySelector(`rt-itemdata#${newItem}`)
      // Slot in requested product data
      newData.setAttribute('slot', 'active-data');

      // Convert this.#_cartContents to 2D array -> [ [productIDs], [itemcounts] ]
      const cartItems = this.#_cartContents.reduce((acc, cur) => {
        acc[0].push(cur.prodID);
        acc[1].push(cur.count);
        return acc;
      }, [[], []]);

      // Determine any relevent data already in cart for this product
      // Cycle through all itemLines for this product
      newData.querySelectorAll('rt-itemline').forEach((item) => {
        // Search for item in the cart?
        const itemIndex = cartItems[0].indexOf(item.$attr('prodid'));
        // If found then update displayed value
        if (itemIndex > -1) {
          item.$dispatch({ name: 'updatecountline', detail: { change: cartItems[1][itemIndex], replace: true } });
          // If not found and displayed value > 0 then reset to 0
        } else if (item.$attr('count') > 0) {
          item.$dispatch({ name: 'updatecountline', detail: { change: '0', replace: true } })
        }
      });

      // Display the dialog
      this.#_details.showModal();

      // Ensure the correct buttons are visible in cart
      // this.#cartButtonsDisplay();
    }

    //--- #detailsButtonDisplay
    // Determine appearance of button for details overlay
    #detailsButtonDisplay() {
      // Is button hiding enabled?
      const hide = getComputedStyle(this).getPropertyValue('--OF-HIDE-UPDATE');
      // Get class list for button element
      const buttonClasses = this.shadowRoot.querySelector('#prod-add-but').classList

      // Does anything in dialog have a new value relative to the cart contents?
      const lineItems = this.querySelectorAll('rt-itemdata[slot] rt-itemline');
      // Check there is something to process
      if (lineItems.length > 0) {
        // Set flag to stop processing elements on first change found
        let changed = false;
        lineItems.forEach(element => {
          // Use lazy evaluation to skip change check once a change has been found
          if (!changed && this.#detailsHasDataChanged({
            prodID: element.$attr('prodid'),
            count: element.hasAttribute('count') ? parseInt(element.$attr('count')) : 0
          })) {
            changed = true;
          }
        })
        // Change button display to reflect state of data in dialog compared to cart
        if (changed) {
          buttonClasses.remove('button-dis')
          if (hide) buttonClasses.remove('button-hide')
        } else {
          buttonClasses.add('button-dis')
          if (hide) buttonClasses.add('button-hide')
        }
      }
    }

    //--- #detailsUpdateCart
    // Update values in cart for all itemLine elements of the product currently slotted as active
    #detailsUpdateCart() {
      // Process all <rt-itemline> nodes in active <rt-itemdata> with a attribute 
      this.querySelectorAll('[slot="active-data"] rt-itemline').forEach(node => {
        // Update the currentorder Storage object with the new value
        this.#cartCurOrderStorUpdate({
          prodID: node.$attr('prodid'),
          count: node.hasAttribute('count') ? parseInt(node.$attr('count')) : 0
        });
        // A zero 'count' is needed to remove the item from cart but should not be processed on next invocation
        // if (node.$attr('count') === "0") node.removeAttribute('count');
      });

      // Whether closing or adding, clear the item data slot
      this.#detailsInitItemValues();
    }

    //--- #formShow
    // show == true - hide product menu / display user-defined form
    // show == false - hide user-define form / display product menu
    #formShow(show) {
      this.#_menu.querySelector('#menu').style.display = show ? 'none' : '';
      this.#_menu.querySelector('#form-container').style.display = show ? '' : 'none';
      this.#cartButtonsDisplay();
    }

    //--- #formValidate
    // Determine if the form has been completed as required
    #formValidate() {
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

    //--- #initialiseAll
    // Performs the following actions
    // - Create the pictoral menu at the top of the order form based on form HTML
    // - Restore cart if there were previously items present
    // - Move form HTML into the shadowDOM
    // - Prepopulate form if saved details found
    #initialiseAll() {
      /// Create pictorial menu
      // Recover image path from setting in HTML
      const imgPath = this.querySelector("form-config span#imgpath").textContent;
      // Collect all <rt-itemdata> elements
      const nodes = [...this.querySelectorAll('rt-itemdata')];
      // ...then create a new <rt-menuitem> element for each, assigned to 'menu-items' slot  
      this.append(...nodes.map(element => {
        let elementAttrs = { id: `mi-${element.id}`, slot: 'menu-items' };//, style: 'justify-self: center' };
        // Attempt to retrieve image
        let imgNode = element.querySelector('img')
        // Add bgimg attribute if img element found
        if (imgNode) elementAttrs.bgimg = `${imgPath}/${imgNode.getAttribute('file')}`
        // Append the new <rt-menuitem> element to the div
        return this.$createElement({
          tag: 'rt-menuitem',
          innerHTML: `${element.querySelector('item-title').innerHTML}`,
          attrs: elementAttrs
        })
      }));
      /// Only do this for smaller screens
      // Additional initialisation for mobile client
      if (window.matchMedia("(max-width: 430px)").matches) {
        const cartTitle = this.#_cart.querySelector('#cart-title');
        // Add cart toggle when cart-title clicked
        cartTitle.addEventListener('click', () => this.#cartToggle());
        // 200ms delay to ensure cart title has rendered (yuck!)
        setTimeout(() => {
          // Determine padding and border sizes
          const cartStyle = getComputedStyle(this.#_cart);
          const cartMod = (parseInt(cartStyle.paddingTop) * 2) + (parseInt(cartStyle.borderLeftWidth) * 2);
          // Determine size of cart-title and add adjustment for padding and borders
          const cartTitleSize = `${(parseFloat(cartTitle.getBoundingClientRect().height) + cartMod).toFixed(0)}px`;
          // Set CSS variable for minimized cart size - will cause 'expanding' transition
          this.#_cart.style.setProperty('--MINIMIZED-CART', cartTitleSize);
          // Unhide the cart div to see transition
          this.#_cart.classList.remove('init');
        }, 200);
      }

      // Add image to details dialog
      this.#_sR.querySelector('#product-details-close img').src = `${compPath}/img/close-blk.png`;

      this.#_menu.querySelector('#menu').style.display = '';

      /// Restore cart contents
      if (localStorage.getItem('currentOrder')) this.#cartRebuild();
      this.#cartButtonsDisplay();

      /// Move user's form to shadowDOM - as a form cannot be slotted apparently
      // const srcNode = this.querySelector('div#user-details');
      // if (srcNode) {
      //   this.#_form.append(...srcNode.children);
      // } else console.warn('No details form provided');
    }

    //--- #orderContinue
    // Display the form and pre-populate fields if previous data found
    #orderContinue() {
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
      // Bring form to front
      this.#formShow(true);
      // Hide the cart
      this.#_sR.querySelector('div#cart').style.display = 'none';
    }

    //--- #orderDispatch
    // Catch the form submit event
    #orderDispatch() {
      // Disptach order if all checks pass
      if (this.#formValidate()) {
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

    //--- #orderModifyCurrent
    // Catch event and send details on for cart modification
    #orderModifyCurrent(e) {
      e.stopPropagation();
      this.#cartCurOrderStorUpdate(e.detail);
    }

    //--- #orderRecover
    // Reload the last order dispatched
    #orderRecover() {
      // Fill the currentOrder storage item with the contents from lastOrder
      if (localStorage.getItem('lastOrder')) localStorage.setItem('currentOrder', localStorage.getItem('lastOrder'))
      // Rebuild cart
      this.#cartRebuild();
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
      this.#cartRebuild();
      // Reset display
      this.#formShow(false);
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

    //--- loadMenu
    // Recover the order form data from the enclosing component
    // This should not called until the enclosing component receives a 'formready' event
    async loadMenu(url) {
      // Check datafile 
      try {
        if (typeof url === 'undefined') throw new Error('No Datafile', { cause: 'nofile' })
        else {
          const response = await fetch(url)
          // Do not attempt to parse file if server resonse is not 200
          if (!response.ok) throw new Error("Datafile URL is not valid", { cause: 'invalid' });
          const htmlText = await response.text();
          // Create document fragment from file text
          const frag = document.createRange().createContextualFragment(htmlText);
          // Append fragment to lightDOM 
          this.appendChild(frag);
          // Build form from data in lightDOM and in local storage
          this.#initialiseAll();
          this.style.display = 'inline-block';
        }
      } catch (e) {
        console.error(e);
        let output;
        switch (e.cause) {
          case 'nofile':
            output = '<h1 style="color: red;">Datafile URL not provided</h1>';
            break;
          case 'invalid':
            output = '<h1 style="color: red;">Datafile URL not found</h1>';
            break;
        }
        const frag = document.createRange().createContextualFragment(output);
        this.appendChild(frag);
        return false
      }
    }
  }
);

