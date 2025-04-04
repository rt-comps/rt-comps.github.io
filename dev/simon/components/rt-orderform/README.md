# Order Form Component
This is the top-level web component for an order form.

The goal was to design a dynamic form that could be populated by adding data via an HTML/XML file whose URL is provided by the calling code.

When an order is submitted then a ***neworder*** event is generated that contains the order details.  The calling code is expected to listen for this event and provide all necessary processing.

It was a design decision to use the LightDOM of the component to store any computed data, eg menu elements, cart line items, etc.

---

## Attributes:
- Required: None
- Optional: None

---

## Component Dependancies: 
- menu-item
- item-data
- line-item
---
## Events:
- Dispatched:
    - ***formready***  
        Let the calling code know that the *rt-orderform* element is connected and ready to load menu data
    - ***neworder***  
        Sends the contents of *#cart-contents*, an array of objects, for processing outside the form
    - ***updatecountline***  
        Update the count fields of item data when initialising dialog, based on values in *#_cartContents* 


- Listened: 
    - ***initmenu***  
    Display the *#product-details* dialog and slot the *rt-itemdata* element corresponding to the value of details.id property of the Event object.
    - ***updatecount***  
    Toggle "Update" button display for *#product-details* dialog.  Button is displayed only when values differ from the values in the *#_cartContents*
    - ***cartmod***  
    Apply updates to *#_cartContents* and rebuild the cart when changes are made directly in the cart section of the order form

---
### [Public Methods](publicfuncs.md)
---
### [Private Methods](privfuncs.md)
---