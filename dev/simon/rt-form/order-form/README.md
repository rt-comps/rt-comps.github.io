This is the top-level web component for an order form to provide ordering functionality for the Appeltaart Imporium.

Attributes:
- Required: None
- Optional: None

Events:
- Dispatched:
    - "updatemenu"
        - Sends no ID when order is processed to clear the #item-data area
    - "neworder"
        - Sends the contents of #cart-contents, an array of objects, for processing outside the form
- Listened: 
    - "updatemenu"
        - Fill the #item-data area with the data from <item-data> with the provided ID
    - "add-to-cart_click"
        - Move selected items in #item-data area to #cart-contents and reset counts in #item-data
    - "process-order_click"
        - Clear #item-data area ("updatemenu"), send order for processing ("neworder") and clear #cart-contents

Dependancies: 
- menu-item
- item-data
- line-item

Notes:
The goal was to design a dynamic form that could be populated by adding data via HTML.
Additionally, it was decided that any computed data should reside in the DOM as well.

and expects the following HTML structure to be used

<order-form style="display: none;">
    <form-config>
        <span id="paramName">paramValue</span>
    </form-config>
    <item-data id="productName1">
        <item-title>Product Name</item-title>
        <img class="icon" file="imageFilename">
    </item-data>
    ...
    <item-data id="productNameN">
        ...
    </item-data>
</order-form>

NB The form should be set to "display:none" to hide any 'random' text from the user until the components have fully loaded.
Once the form population has completed then the form is set to "display:inline-block".
