# Component: *itemline*
A component that displays the data for one line of a product variety in the product data dialog.

The value initially mirrors that in cart.  The valueis alterable but any changes will not be saved to the cart until the 'Aanpassen' button is clicked.  If the dialog is closed using the 'X' then any changes will be discarded.

If this item has a *count* > 0 then text is displayed in **BOLD**.

---
### Component Dependancies:
- rt-plusminus

---
### Attributes:
- Required: 

|Attribute| | Description|
| :--- | --- | :--- |  
|*prijs*|-|The unit price for the given product type in cents|
- Optional: *None*

---
### Events:
- Dispatched: *None*

- Listened:

|Name||Description|
| :--- | --- | :--- |
|*updatecount*|-|Respond to event from plus/minus button press|
---
### File Dependecies:  
- rt_baseclass.js  
- rt.js  
- rt_form.js (optional - required to enable external style overrride)

---
### Style Defaults:  
```css        
#container {
    display: grid;
    grid-template-columns: 70px 60px auto;
    column-gap: 5px;
    padding: 5px;
}

span {
    align-self: center;
}

span#prijs {
    text-align: right;
}

span#count {
    flex-basis: 100%;
    text-align: center;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
```
---
### Template:  
```html
<div id="container">
    <rt-plusminus>
            <span id="count">0</span>
    </rt-plusminus>
    <span id="prijs"></span>
    <span>
        <slot></slot>
    </span>
</div>
```
