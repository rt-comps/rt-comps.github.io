A component that provides +/-1 functionality when + and - buttons are clicked

Attributes:
- Required: None
- Optional: None

Events:
- Dispatched: 
    - "updatecount"
        - Send the provided value
- Listened:
    - "plus_click"
        - Dispatch "updatecount" with a value of 1
    - "minus_click"
        - Dispatch "updatecount" with a value of -1

Dependancies: None

Notes: None