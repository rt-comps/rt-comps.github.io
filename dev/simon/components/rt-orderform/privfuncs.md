[< Back](README.md)
# Private Methods

These methods are only available within the code of the component class.

The first word of the method indicates the focus for that method.

- 'cart...' - The shopping cart
- 'details...' - The product details dialog
- 'form...' - The user details form
- 'order...' - The overall order form

---
### #cartButtonsDisplay() ---
Determine what buttons should be displayed at the bottom of the shopping cart when the page is loaded, changes are made to the cart contents or the User Details form is opened.

**Return Value:** *Undefined*

---
### #cartCurOrderStorUpdate(item)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*item*|{Map}|-|Order item that needs changing in cart|

Check item against the current cart contents and adds, updates or deletes the item in the cart if required.

**Return Value:** *Boolean*
 - *True* - cart was modified
 - *False* - no change was made
---
### #cartRebuild() 
Deletes the current contents of the displayed cart and rebuilds from the values stored in *#_cartContents* private field.

Should be called if ***#cartCurOrderStorUpdate()*** returns *True*

**Return Value:** *Undefined*

---
### #cartToggle()
Only active when screen width triggers mobile CSS.  

Each call causes the cart display to toggle between open (displayed) or closed.

**Return Value:** *Undefined*

---
### #detailsButtonDisplay() ---
Determines if the **Update** button of the product details dialog should be enabled.
  - Enabled
    - When: Any rt-itemlist component has a *updated* property
    - Appearance is specified in the *.button* CSS entry.  
  - Disabled
    - When: No rt-itemlist components have an *updated* property
    - Appearance is modified as per the *.button-dis* CSS class.
    - If the CSS variable *--OF-HIDE-UPDATE* is set then the button will also be hidden

**Return Value:** *Undefined*

---
### #detailsInitItemValues(e) ---
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*e*|{Event}|-|Expected to be an **initmenu** custom event|

This function controls the display of the Product Details dialog.

When triggered by an *Event* then an *id* corresponding to a product in the menu is expected as part of that event.  If this happens then the following happens
  - The product data (*rt-itemdata*) is slotted into the dialog
  - The value in each *rt-itemline* is set to the value currently in cart (via **updatecountline** event)
  - The dialog is opened in modal mode

If this function is called manually (or the event does not contain the expected data) then it will unslot any slotted data and close the Product Details dialog

**Return Value:** *Undefined*

---
### #detailsUpdateCart() 
Intended to be called by clicking on the 'Update' button of the Product Details dialog only.

Attempts to update the cart with all rt-itemlines in the dialog with an *updated* property then close said dialog.

For each component with the property set, the object stored in *#_cartContents* is modified with the new value.

Once all updates have been made to the cart object:
- If cart has contents: Copies a JSON serialise copy of object to the *currentOrder* local storage object.
- If cart is empty: Deletes tThe *currentOrder* local storage object.
- Cart is rebuilt from the latest value of *#_cartContents*

**Return value:** *Undefined*

---
### #formShow(show)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*show*|{Boolean}|-|*True* if user details form should be shown|

Switches display from menu to form (or vice versa) and updates button visibility in the cart

**Return Value:** *Undefined*

---
### #formValidate(show)
Calls the checkValidity() method of all form elements and returns either pass or fail

**Return Value:** *Boolean*
- *True* - All fields passed validation
- *False* - One or more fields failed validation
---
### #orderContinue()
Replaces the menu with a form for specifying pickup information and user details

If the user has previously saved their details then these are recovered from the *user-details* local storage object and used to populate the form.

**Return Value:** *Undefined*

---
### #orderDispatch()
When order complete is chosen then the form is validated and then, if all is good, a *neworder* event is dispatched containing the order line items and the recipent's details.

Validation will highlight any invalid fields

**Return Value:** *Undefined*

---
### #orderInitialise()
The main function of this method is to build the menu of the order form from the data presented in the HTML(XML)
**Return Value:** *Undefined*

---
### #orderRecover()

**Return Value:** *Undefined*

---