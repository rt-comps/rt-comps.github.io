A component that displays the data for one type of a product variety and allows a quantity to be chosen

Enclosed elements provide the content for the RHS of the element

Attributes:
- Required: 
    - prijs
        - The price, in cents, for the given product type
- Optional: None

Events:
- Dispatched: none
- Listened:
    - "updatecount"
        - Respond to event from plus/minus button press

Component Dependancies:
- plus-minus

Notes:
This component is similar to <line-item> but the description is simpler as product and variety are implied by location of the element in the DOM

The text changes to BOLD when count != 0
