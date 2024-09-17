# Component: _plus-minus_ #
---
A component that provides +/- button count functionality

When using, any elements placed within the element in Light DOM will be slotted relative to the buttons based on the value of *--OF-PM-POS* (if specified)

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
- rt_form.js (required if you wish to enable styling in form datafile)

---

Notes: None