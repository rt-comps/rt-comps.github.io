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

NB Use <order-form style="display:none"> to hide any 'random' text from the user until the components have fully loaded.
Once the form population has completed then the form is set to "display:inline-block".

The form appearance can be modified by defining any of these CSS variables in the data file.

--ORDER-FORM-WIDTH
    Define the overal width of the form (menu/form + cart)
    Default: 100%
--ORDER-FORM-FONTS
    A list of font families
    Default: "Segoe UI", Candara, "Bitstream Vera Sans", "DejaVu Sans", "Bitstream Vera Sans", "Trebuchet MS", Verdana, "Verdana Ref", sans-serif
--ORDER-FORM-FONT-SIZE
    Prefered font size
    Default: 16px
--ORDER-FORM-LINE-HEIGHT
    Prefered line height
    Default: 1.5
--ORDER-FORM-BORDER-RADIUS
    Fillet radius of box corners
    Default: 10px

--ORDER-FORM-CART-MIN
    Specifying this value will stop the cart width shrinking below the specified size
    Doesn't affect mobile view.
    Default: 0px (will always scale to 1fr)

--ORDER-FORM-DETAILS-BACKGROUND
    Background color for item details dialog
    Default: burlywood
--ORDER-FORM-DETAILS-COLOR
    Text color for item details dialog
    Default: black
--ORDER-FORM-DETAILS-BORDER
    Border specification for item details dialog
    Default: 1px solid black
--ORDER-FORM-DETAILS-RADIUS
    Border radius specification
    Default: 10px
--ORDER_FORM-DETAILS-PADDING
    Padding for item details dialog
    Default: 10px

