// ================================================================
// === rt-orderform class definition

// Recover component name from URL
const [compName, basePath] = rtlib.parseCompURL(import.meta.url);

// Define the component
customElements.define(compName,
  class extends rtBC.RTBaseClass {
    /// ### PRIVATE CLASS FIELDS
    #_sR;           // shadowRoot node
    #_menu;         // Menu node
    #_details;      // Product Details node
    #_form;         // Form node
    #_cart;         // Cart node
    #_cartContents; // Map with current contents of the cart

    // +++ Lifecycle Events
    //--- constructor
    constructor() {
      // Initialise 'this'
      super();
      // Attach shadowDOM and store in private field
      this.#_sR = this.attachShadow({ mode: "open" });
      // Attach contents of template placed in document.head by LoadComponent()
      this.#_sR.append(this.$getTemplate());

      const _this = this;
      // Set this component as the 'eventbus' - used for handling event communications between components
      this.id = 'eventBus';

      // Store some useful nodes in private fields
      this.#_form = this.#_sR.querySelector('form#user-form');
      this.#_details = this.#_sR.querySelector('#product-details');
      this.#_menu = this.#_sR.querySelector('#menu-items-container');
      this.#_cart = this.#_sR.querySelector('#cart');

      // Load locally stored cart contents - '|| {}' catches any JSON.parse() error
      const cartContents = JSON.parse(localStorage.getItem('currentOrder')) || {};
      // Store cart in private field
      this.#_cartContents = new Map(Object.entries(cartContents));


      // this.addEventListener('initdetails', () => console.log('Event happened'))


      //##### Event Listeners
      //___ initdetails - Display product information when product chosen
      // Use event object to pass 'this' node 
      const initDeetsFunc = {
        handleEvent: this.#detailsInitItemValues,
        orderNode: this
      }
      this.addEventListener('initdetails', initDeetsFunc);

      /// Responding to +/- clicks
      //___ updatecountitem - Determine button appearance based on changes made to itemLines
      this.#_menu.addEventListener('updatecountitem', (e) => {
        e.stopPropagation();
        this.#detailsButtonDisplay()
      });
      //___ cartmod - Respond to +/- presses in a <rt-lineitem> and re-render cart
      this.#_cart.addEventListener('cartmod', (e) => this.#orderModifyCurrent(e));

      /// Button Actions
      ///- Product Details
      //___ close dialog
      this.#_sR.querySelector('#product-details-close').addEventListener('click', initDeetsFunc);
      //___ add-items_click - Add the currently selected items to the cart
      // Use event object to pass 'this' node 
      const deetsButFunc = {
        handleEvent: this.#detailsButtonClick,
        orderNode: this
      }
      // this.#_sR.querySelector('#prod-add-but').addEventListener('click', deetsButFunc);
      this.#_sR.querySelector('#prod-add-but').addEventListener('click', deetsButFunc);
      ///- Cart
      //___ place-order_click - Dispatch completed order to enclosing code
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
        this.#_form.reset();
      });
    }

    //--- connectedCallback
    connectedCallback() {
      if (typeof rtForm !== 'undefined') rtForm.getStyle(this, rtForm.findNode(this));
      // Inform containing code that 
      this.$dispatch({ name: 'formready' });
    }

    //+++ End of Lifecycle Events


    /// ### Private Methods

    //--- #cartButtonsDisplay
    // The cart has two 'button' DIVs that can be displayed
    // This function determines which (if any) button should be displayed
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
      const cartEmpty = this.querySelectorAll('rt-lineitem').length === 0;

      // Determine correct button to show
      switch (true) {
        // Is cart empty and previous order stored?
        case (cartEmpty && localStorage.getItem('lastOrder') !== null):
          newBut = 'last';
          break;
        // Does cart have contents and for is not being displayed?
        case (!cartEmpty && this.#_sR.querySelector('#form-container').style.display === 'none'):
          newBut = 'further';
          break;
        default:
          newBut = null;
      }

      // Display the correct button - if there should be one
      if (newBut) buttons.get(newBut).style.display = '';
    }

    //--- #cartCurOrderUpdate
    // The current order information is stored as a Map in this.#_cartContents and is also mirrored as a JSON string in a local Storage object ('currentOrder')
    // When a change is made to the order then this.#_cartContents is updated, the Storage object is rewritten and the cart rebuilt from the Storage object.
    #cartCurOrderUpdate(item) {
      /*
      parameter 'item is expect to be a Map of structure
        [
          ['prodID', <String>], - The product to update
          ['count', <Number>]   - The new count
        ]
      */
      // Check item is as expected
      if (!(item instanceof Map && item.has('prodID') && item.has('count'))) {
        console.error('#cartCurOrderUpdate() : "item" not in expected form');
        return
      }
      // No changes made yet
      const flags = new Map([
        ['updated', false],
        ['found', false]
      ]);
      const prodID = item.get('prodID');
      const count = item.get('count')
      // Check if there is anything in the cart that needs searching
      if (this.#_cartContents.size > 0) {
        // Search Map for existing cart entries for this product
        if (this.#_cartContents.has(prodID)) {
          // for (const currentItem of this.#_cartContents) {
          // Found a match?
          // if (item.get('prodID') === currentItem.prodID) {
          flags.set('found', true);
          // Has the value changed?
          // if (item.get('count') !== currentItem.count) {
          if (count !== this.#_cartContents.get(prodID)) {
            // If new value is 0 then remove item from cart
            // if (item.get('count') === 0) this.#_cartContents.splice(this.#_cartContents.indexOf(currentItem), 1);
            if (count === 0) this.#_cartContents.delete(prodID);
            // else modify the value
            // else currentItem.count = item.get('count');
            else this.#_cartContents.set(prodID, count);
            // Cart update has been made
            flags.set('updated', true);
          }
          // // Match found so quite search
          // break;
        }
        // }
      }

      // No match found so, if count > 0, add new item to cart
      // if (!flags.get('found') && item.get('count') > 0) {
      if (!flags.get('found') && count > 0) {
        // Add the modified object to the array
        this.#_cartContents.set(prodID, count);
        flags.set('updated', true);
      };

      // Does local storage need updating?
      return flags.get('updated');
    }

    //--- #cartRebuild
    // Recreate the cart from the currentOrder local storage item
    #cartRebuild() {
      // console.log('rebuilding...')
      // Delete all current cart contents
      const currentCartContents = [...this.querySelectorAll('rt-lineitem')];
      currentCartContents.forEach((node) => node.remove());

      // Initialise order total
      let orderTotal = 0;
      if (this.#_cartContents.size) {
        // Initialise array of new nodes
        const newNodes = [];
        // Cycle through cart entries
        this.#_cartContents.forEach((count, prodID) => {
          // Build node's innerHTML
          //  Get rt-itemline node corresponding to ProdID
          const itemLine = this.querySelector(`rt-itemline[prodid="${prodID}"]`);
          //  Get enclosing rt-itemvariety
          const itemVar = itemLine.parentElement;
          //  Get enclosing <rt-itemdata> 
          const itemName = itemVar.parentElement;
          //  Construct cart text by combining data from rt-itemline and enclosing <rt-itemvariety> & <rt-itemdata>
          const itemText = `${itemName.querySelector('item-title').innerText}<br/>${itemVar.getAttribute('value')} ${itemVar.getAttribute('desc')}<br/>${itemLine.innerText}`;

          // Get unit price for rt-itemline 
          const unitPrice = itemLine.getAttribute('prijs');
          // Add this line value to order total
          orderTotal += parseInt(unitPrice) * count;

          // create new node for appending
          newNodes.push(this.$createElement({
            tag: 'rt-lineitem',
            innerHTML: itemText,
            attrs: {
              slot: 'cart',
              prodid: prodID,
              // count: lineData.count,
              unit: unitPrice
            }
          }));
        });

        // Add the new nodes to the DOM
        this.append(...newNodes);
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

    #cartTotal() {
      let cartTotal = 0;
      this.querySelectorAll('rt-lineitem').forEach((node) => {
        cartTotal += parseInt(node.$attr('unit')) * parseInt(node.count);
      });
      this.#_sR.querySelector('#order-total-amount').innerHTML = this.$euro(cartTotal / 100);
    }

    //--- #detailsButtonClicked()
    #detailsButtonClick(e) {
      if (e) {
        e.stopPropagation();
        const node = e.target;
        // Check we got expected node
        if (node.id === 'prod-add-but') {
          // Apply all new values to cart if button enabled
          if (!node.classList.contains('button-dis')) this.orderNode.#detailsUpdateCart();
        }
      }
    }

    //--- #detailsButtonDisplay
    // Determine appearance of button for details overlay
    #detailsButtonDisplay() {
      // Is button hiding enabled?
      const hide = getComputedStyle(this).getPropertyValue('--OF-HIDE-UPDATE');
      // Get class list for button element
      const buttonClasses = this.shadowRoot.querySelector('#prod-add-but').classList

      // Does anything in dialog have a new value relative to the cart contents?
      const lineItems = this.querySelectorAll('rt-itemdata[slot] rt-itemline[updated]');
      // Alter button appearance
      if (lineItems.length > 0) {
        buttonClasses.remove('button-dis')
        if (hide) buttonClasses.remove('button-hide')
      } else {
        buttonClasses.add('button-dis')
        if (hide) buttonClasses.add('button-hide')
      }
    }

    //--- #detailsInitItemValues
    // Display #product-details dialog with requested data.
    // Close dialog if called manually with no parameter
    #detailsInitItemValues(e) {
      // If called from event then initialise and display else close 
      if (e instanceof Event) {
        // Stop event propagation and reset value of orderNode
        e.stopPropagation();
        // 'this' will be the event Object and should contain the node for the order form
        const orderNode = this.orderNode;

        if (orderNode) {
          // Initialise and display dialog if ID is sent
          if (e.detail.id) {
            const newItem = e.detail.id;
  
            // Clear any previous slot settings
            orderNode.querySelectorAll('rt-itemdata').forEach(el => el.removeAttribute('slot'));
  
            // Get node for selected data
            const newData = orderNode.querySelector(`rt-itemdata#${newItem}`)
            // Slot new data
            newData.setAttribute('slot', 'active-data');
            // Get all item lines for this product
            newData.querySelectorAll('rt-itemline').forEach(item => {
              // Search for item in the cart, if found then use found count else set to zero.
              item.count = orderNode.#_cartContents.has(item.$attr('prodid')) ? orderNode.#_cartContents.get(item.$attr('prodid')) : 0;
              // Setting highlighting based on line count
              item.render();
            });
            // Set details button to disabled
            orderNode.#detailsButtonDisplay();
            // Display the dialog
            orderNode.#_details.showModal();
          } else orderNode.#_details.close();
        }
      }
      // console.log(this)
      // Close the dialog if function called manually or Event has no value for ID
    }

    //--- #detailsUpdateCart
    // Check for itemLine elements of the currently active product that have changed and update cart as appropriate
    #detailsUpdateCart() {
      // Initialise flags
      const flags = new Map([
        ['changed', false]
      ])

      // Get any updated lines (should be > 0)
      const updatedLines = this.querySelectorAll('[slot="active-data"] rt-itemline[updated]');
      // Shouldn't be able to click button if zero elements returned so this check is just for sanity
      if (updatedLines.length > 0) {
        updatedLines.forEach(node => {
          // Update the currentorder Storage object if there is 1 or more the new values 
          if (this.#cartCurOrderUpdate(new Map([
            ['prodID', node.$attr('prodid')],
            ['count', parseInt(node.count)]
          ])) && !flags.get('changed')) flags.set('changed', true);
          // Mark node as processed
          node.removeAttribute('updated');
        });

        // Has anything changed?
        if (flags.get('changed')) {
          // If cart not empty then convert the current order Map to a JSON-encoded object and store in local Storage object
          if (this.#_cartContents.size > 0) localStorage.setItem('currentOrder', JSON.stringify(Object.fromEntries(this.#_cartContents)));
          // If cart empty then delete Storage object
          else localStorage.removeItem('currentOrder');
          // Rebuild cart using latest data
          this.#cartRebuild();
        }
      }
      // Close the dialog
      this.#detailsInitItemValues();
    }

    //--- #formShow
    // show == true - hide product menu / display user-defined form
    // show == falsy - hide user-define form / display product menu
    #formShow(show) {
      this.#_menu.querySelector('#menu').style.display = show ? 'none' : '';
      this.#_menu.querySelector('#form-container').style.display = show ? '' : 'none';
      this.#cartButtonsDisplay();
    }

    //--- #formValidate
    // Determine if the form has been completed as required
    #formValidate() {
      // Declare flag
      const flags = new Map([
        ['failed', false]
      ])
      // Continue if form found
      if (this.#_form) {
        // Collect all possible field types
        const nodes = this.#_form.querySelectorAll('rt-form-field[required], rt-pickup-locations');
        // Check validity of each field type and set focus to first field to fail check
        for (const el of nodes) {
          // Run checkValidity() for element
          const result = el.checkValidity();
          // Stop on first failure and set focus to failed element
          if (!result.get('valid')) {
            const field = result.get('field');
            el.focus(field);
            flags.set('failed', true);
            flags.set('field', field);
            break;
          }
        }
      }
      // Return validity status
      return flags
    }

    //--- #orderContinue
    // Display the form and pre-populate fields if previous data found
    #orderContinue() {
      /// Prepopulate form if saved details found
      const details = localStorage.getItem('user-details');
      if (details) {
        // Set 'savefields' boolean
        this.#_form.querySelector('#savefields').checked = true;
        // Repopulate details in to form from stored details
        new Map(Object.entries(JSON.parse(details))).forEach((value, key) => this.#_form.querySelector(`[name=${key}]`).value = value)
      }
      // Bring form to front
      this.#formShow(true);
    }

    //--- #orderDispatch
    // Catch the form submit event
    #orderDispatch() {
      // Disptach order if all checks pass
      const valid = this.#formValidate();
      if (!valid.get('failed')) {
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
      } else console.warn(`Form submission not valid - ${valid.get('field')}`);
    }

    //--- #orderInitialise
    // Performs the following actions
    // - Create the pictoral menu at the top of the order form based on form HTML
    // - Restore cart if there were previously items present
    // - Move form HTML into the shadowDOM
    // - Prepopulate form if saved details found
    #orderInitialise() {
      // Move user-form data into place.  Forms do not function correctly if content is slotted!
      const detailsForm = this.querySelector('div[slot="user-form"]');
      if (detailsForm) {
        this.#_sR.querySelector('form#user-form').append(detailsForm);
      } else {
        console.error('User details form is missing!!');
        this.#_sR.querySelector('#menu-items-container').append(document.createRange().createContextualFragment('<h1 style="color: red;">User details form is missing from data file!!</h1>'))
        return
      }

      /// Create pictorial menu
      // Recover image path from setting in HTML
      const imgPath = this.querySelector("form-config span#imgpath").textContent;
      // Collect all <rt-itemdata> elements
      const nodes = [...this.querySelectorAll('rt-itemdata')];
      // ...then create a new <rt-menuitem> element for each, assigned to 'menu-items' slot  
      this.append(...nodes.map(element => {
        let elementAttrs = {
          id: `mi-${element.id}`,
          slot: 'menu-items'
        };
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
        // Add cart toggle when cart-title clicked
        this.#_cart.querySelector('#cart-title').addEventListener('click', () => this.#cartToggle());
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

      // Add 'X' image to details dialog
      this.#_sR.querySelector('#product-details-close img').src = `${basePath}/components/${compName}/img/close-blk.png`;
      // Ensure menu items are visible
      this.#_menu.querySelector('#menu').style.display = '';

      /// Restore cart contents
      this.#cartRebuild();
    }

    //--- #orderModifyCurrent
    // Catch event and send details on for cart modification
    #orderModifyCurrent(e) {
      e.stopPropagation();
      this.#cartCurOrderUpdate(new Map([
        ['prodID', e.detail.prodID],
        ['count', e.detail.count]
      ]));
      // Save the current order data to local Storage object
      if (this.#_cartContents.size > 0) localStorage.setItem('currentOrder', JSON.stringify(Object.fromEntries(this.#_cartContents)));
      // If this.#_cartContents is empty then delete Storage object
      else localStorage.removeItem('currentOrder');
      this.#cartTotal();
    }

    //--- #orderRecover
    // Reload the last order dispatched
    #orderRecover() {
      // Fill the currentOrder storage item with the contents from lastOrder
      if (localStorage.getItem('lastOrder')) localStorage.setItem('currentOrder', localStorage.getItem('lastOrder'))
      // Rebuild cart
      this.#cartRebuild();
    }

    ///+++ Getters
    // Expose #_cartContents for reading
    get cartContents() { return this.#_cartContents }

    ///+++ PUBLIC METHODS

    //--- accepted
    // Reset the component once order has been accepted
    // This is only called from the wrapping code
    accepted() {
      // Set last order on the user's local storage to current order
      localStorage.setItem('lastOrder', localStorage.getItem('currentOrder'));
      // Clear the cart
      localStorage.removeItem('currentOrder');
      this.#_cartContents.clear();
      this.#cartRebuild();
      // Reset display
      this.#formShow(false);
      // Save user details if chosen
      const saveFields = this.#_sR.querySelector('#savefields');
      // If yes then put details in object and store as JSON string
      if (saveFields && saveFields.checked) {
        // Collect field nodes
        const fields = [...this.#_sR.querySelectorAll(`#formfields :is(rt-form-field, textarea)`)];
        console.log(fields)
        // Create Map of values from array of nodes
        const output = fields.reduce((acc, el) => acc.set(el.name, el.value), new Map());
        // JSON can't store a Map so store as object 
        localStorage.setItem('user-details', JSON.stringify(Object.fromEntries(output)));
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

        const response = await fetch(url)
        // Do not attempt to parse file if server resonse is not 200
        if (!response.ok) throw new Error("Datafile URL is not valid", { cause: 'invalid' });

        const htmlText = await response.text();
        // Create document fragment from file text
        const frag = document.createRange().createContextualFragment(htmlText);
        // Append fragment to lightDOM 
        this.appendChild(frag);
        // Build order form from data in lightDOM and in local storage
        this.#orderInitialise();
      } catch (e) {
        console.error(e);
        let output;
        switch (e.cause) {
          case 'nofile':
            output = '<h1 style="color: red;">Datafile URL not provided</h1>';
            break;
          case 'invalid':
            output = '<h1 style="color: red;">Datafile URL is not valid</h1>';
            break;
        }
        const frag = document.createRange().createContextualFragment(output);
        this.#_sR.querySelector('#menu-items-container').appendChild(frag);
      }
      // Unhide the menu
      this.style.display = 'inline-block';
    }
  }
);

