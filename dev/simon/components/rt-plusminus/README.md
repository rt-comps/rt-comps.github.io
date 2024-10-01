# Component: *plus-minus* #
---
A component that provides +/- button count functionality

When using, any elements placed within the element in its Light DOM will be slotted relative to the buttons based on the value of *--OF-PM-POS* (if specified)



---

Attributes:
- Required: None
- Optional: None

---

Style Modifiers:
- **--OF-PM-POS**  
Change the position of the quantity relative to + & - buttons.  
'left': Quantity appears to left of arrows  
'right': Quantity appears to right of arrows  
Default: Quantity appears between arrows   

---

Events:
- Dispatched: 
    - "updatecount"
    \- Send a value to adjust a listening component's count

- Listened:
    - "plus_click"
       \- Dispatch "updatecount" with a value of 1
    - "minus_click"
        \- Dispatch "updatecount" with a value of -1

---

Component Dependencies:  
- None

---

File Dependecies:  
- rt_baseclass.js  
- rt.js  
- rt_form.js (only required to enable external style overrride)

---

Style Defaults:  

    div {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 3px;
        border-radius: 3px;
    }

    span#plus,
    span#minus {
        flex: 0 0 16px;
        padding: 0px 2px 0px 2px;
        margin: 1px;
        height: 20px;
        line-height: 20px;
        border: 1px solid black;
        border-radius: 5px;
        color: black;
        background-color: white;
        text-align: center;
    }

---

Template:  

    <div id="container">
        <span id="plus">+</span>
        <slot></slot>
        <span id="minus">-</span>
    </div>


---

Notes:  
Any styles in the Shadow DOM can be overridden by providing a `<style id="component-name-lowercase"></style>` element further up the flattened DOM tree.  
`rt-form.js` is a required depedency for this functionality.