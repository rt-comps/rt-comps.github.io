[<Back](README.md)
# Public Methods

These methods are available to code outside of the component class

---
#### accepted()
Should called by the enclosing code when an order has been successfully sent.  
- Copies the contents of the *currentOrder* Storage objecct to the *lastOrder* one.
- If selected, the current user details are saved to the *user-details* Storage object.
- Clears all of the order form's current details.
---
#### loadMenu(url)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*url*|{String}|-|The URL of the datafile|

Reads the data file (see Data File [section](datafile.md)) specified and appends the contents to the component's LightDOM.  If a Data File is not specified or there is a problem loading it then error text is added to the order form instead.

---