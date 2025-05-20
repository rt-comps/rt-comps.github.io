# Component: *plus-minus*

A component that provides +/- button count functionality

Anything placed in the component's LightDOM will be placed with the buttons, with exact placement being controlled by the CSS variable *--OF-PM-POS*.

**Note**: The component does not store the count value but dispatches and event to allow the enclosing component to handle the change

---
### Component Dependencies:  
- None

---
### Attributes:
- Required: None
- Optional: None

---
### Events:
- Dispatched: 
    - "updatecount"
    \- Send a value to adjust a listening component's count

- Listened:
    - "plus_click"
       \- Dispatch "updatecount" with a value of 1
    - "minus_click"
        \- Dispatch "updatecount" with a value of -1

---
### File Dependecies:  
- rt_baseclass.js  
- rt.js  
- rt_form.js (optional - required to enable external style overrride)

---
### Style Defaults:  
```css
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
```
#### CSS Variables:
- **--OF-PM-POS**  
Change the position of the **slot** relative to + & - buttons during inital rendering   
  - 'left': Quantity appears to left of arrows  
  - 'right': Quantity appears to right of arrows  
  - Default: Quantity appears between arrows   

---
### Template:  
```html
    <div id="container">
        <span id="plus">+</span>
        <slot></slot>
        <span id="minus">-</span>
    </div>
```
