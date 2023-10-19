A component that provides +1/-1 functionality when + and - buttons are clicked

Any enclosed elements will be placed between the + and - elements

Attributes:
- Required: None
- Optional: None

Events:
- Dispatched: 
    - "updatecount"
    Send a value to adjust a listening component's count

- Listened:
    - "plus_click"
        - Dispatch "updatecount" with a value of 1
    - "minus_click"
        - Dispatch "updatecount" with a value of -1

Component Dependancies: None

Notes: None