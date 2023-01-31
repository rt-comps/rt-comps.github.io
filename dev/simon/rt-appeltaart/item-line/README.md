A component that displays the data for one type of a product variety and allows a quantity to be chosen

Attributes:
- Required: 
    - prijs
        - The price, in cents, for the given product type
- Optional: None

Events:
- Dispatched: None
- Listened:
    - "updatecount"
        - Respond to event from plus/minus button press

Dependancies:
- plus-minus

Notes:
This component is similar to <line-item> but the description only refers to the type
as product and variety are implied by location in the DOM

The text changes to BOLD when count != 0
