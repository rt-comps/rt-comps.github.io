# Component: *line-item* #

---

A component that is designed for displaying a row of data in a cart.

The quantity value can be altered and the component can remove itself from the DOM.

---

Attributes:
- Required:
    - unit
        - The unit price of the type in cents
    - count
        - The initial number of items chosen. This is reflected to the ShadowDOM, where any can **changes occur**
- Optional: None

---

Events:
- Dispatched: None  
  
- Listened:
    - "line-delete_click" - Delete the coMponent instance if delete button clicked
    - "updatecount" - Respond to event from plus/minus button press

---

Component Dependancies: 
- plus-minus

---

Notes:  
  
Any styles in the Shadow DOM can be overridden by providing a `<style id="component-name-lowercase"></style>` element further up the flattened DOM tree.  
  
`rt-form.js` is a required depedency for this functionality.
