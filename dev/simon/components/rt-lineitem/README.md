# Component: *line-item*
A component that is designed for displaying a row of data in the cart.

The quantity value is alterable within the cart and any changes will be reflected stored cart contents immediately.

The element can remove itself from the DOM.  This will also cause the item to be removed from the stored cart contents.

---
### Component Dependancies: 
- plus-minus

---
### Attributes:
- Required:  

|Attribute| | Description|
| :--- | --- | :--- |  
|unit|-|The unit price of the item in cents|
|count|-|The initial number of items chosen. This is reflected to the ShadowDOM|
- Optional: *None*

---
### Events:
- Dispatched: *None*  
  
- Listened:

|Name||Description|
| :--- | --- | :--- |
|line-delete_click|-|Delete the component instance if delete button clicked|
|updatecount|-|Respond to event from plus/minus button press|
---
### File Dependecies:  
- rt_baseclass.js  
- rt.js  
- rt_form.js (optional - required to enable external style override)

---
### Style Defaults:  
```css        
hr {        
    width: 100%;
}

#container {
    display: grid;
    grid-template-columns: 70px auto 70px 30px;
    column-gap: 0.75em;
}

#count {
    flex-basis: 100%;
    text-align: center;
}

#desc {
    font-size: 0.83em;
}

#total {
    text-align: right;
}
```
---
### Template:  
```html
<div id="container">
    <rt-plusminus>
            <span id="count">0</span>
    </rt-plusminus>
    <span id="unit" style="display:none"></span>
    <span id="desc">
        <slot></slot>
    </span>
    <span id="total"></span>
    <!-- Placeholder for delete icon -->
    <span id="delete"><img width="25px" /></span>
</div>
<hr />
```
