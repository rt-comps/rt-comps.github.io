A component that displays a row of data in the cart and allows the quantity to be altered and the line to be removed from the cart

Attributes:
- Required:
    - unit
        - The unit price of the type in cents
    - count
        - The initial number of items chosen. This is reflected to the ShadowDOM, where any can **changes occur**
- Optional: None

Events:
- Dispatched: None
- Listened:
    - "line-delete_click"
        - Delete the coponent instance if delete button clicked
    - "updatecount"
        - Respond to event from plus/minus button press

Dependancies: 
- plus-minus

Notes:
The item description is formed from the name, variety and type of the item chosen.