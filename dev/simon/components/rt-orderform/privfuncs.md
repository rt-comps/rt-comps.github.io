[< Back](README.md)
# Private Methods

These methods are only available within the code of the component class

---
### #cartButtonsDisplay()
Determine what buttons should be displayed at the bottom of the shopping cart when the page is loaded, changes are made to the cart contents or the User Details form is opened.

#### Return value: Null
---
### #cartCurOrderStorUpdate(item)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*item*|{Map}|-|Item that |

Check item against the current cart contents and adds, updates or deletes the item in the cart if required.
#### Return value: Boolean - *True* if the cart was modified
---
### #cartRebuild() 
Deletes the current contents in the displayed cart and rebuilds from the values stored in *#_cartContents* private field.
#### Return value: Null
---
### #cartToggle()
Only used when screen width triggers mobile CSS.  

Each call toggles whether the cart is displayed or not.
#### Return value: Null
---
### #detailsButtonDisplay()
Determines how the Update button in the product details dialog should appear/function.
  - Enabled
    - When values in the dialog do not match those in the cart
    - Appearance is specified in the .button CSS entry.  
  - Disabled
    - When values in the dialog match the values in the cart
    - Appearance is modified as per the .button-dis CSS entry.
    - If the CSS variable --OF-HIDE-UPDATE is set then the button will be hidden

#### Return value: Null
---
### #detailsHasDataChanged(testData)

#### Return value: Null
---
### #detailsInitItemValues(e)

#### Return value: Null
---
### #detailsUpdateCart() 

#### Return value: Null
---
### #formShow()

#### Return value: Null
---
### #formValidate(show)

#### Return value: Null
---
### #initialiseAll()

#### Return value: Null
---

#### Return value: Null
---
### #orderContinue()

#### Return value: Null
---
### #orderDispatch()

#### Return value: Null
---
### #orderModifyCurrent(e)

#### Return value: Null
---
### #orderRecover()

#### Return value: Null
---