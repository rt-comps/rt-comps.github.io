# Order Form Component
This is the top-level web component for an order form.

The goal was to design a dynamic form that could be populated by adding data via HTML.
Additionally, it was decided that any computed data should reside in the Light DOM as well.

---

Attributes:
- Required: None
- Optional: None

---

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

---

Dependancies: 
- menu-item
- item-data
- line-item

---


The form expects the following HTML structure to be used

    <rt-orderform>
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
        <div slot="user-details">
           <!-- User form HTML -->
        </div>
    </rt-orderform>

NB Use `<rt-orderform style="display:none">` (or set in style sheet) to hide any 'random' text from the user until the components have fully loaded.  
The form will set `display:inline-block` on itself once initialisation has completed.

---

The form appearance can be modified by defining any of these CSS variables in the data file.

    --rt-orderform-WIDTH
Define the overal width of the form (menu/form + cart)  
Default: 100%  
  
    --rt-orderform-FONTS
A list of font families  
Default: "Segoe UI", Candara, "Bitstream Vera Sans", "DejaVu Sans", "Bitstream Vera Sans", "Trebuchet MS", Verdana, "Verdana Ref", sans-serif

    --rt-orderform-FONT-SIZE
Prefered font size  
Default: 16px

    --rt-orderform-LINE-HEIGHT
Prefered line height  
Default: 1.5

    --rt-orderform-BORDER-RADIUS
Fillet radius of box corners  
Default: 10px

    --rt-orderform-CART-MIN
Specifying this value will stop the cart width shrinking below the specified size  
No affect in mobile view.  
Default: 0px (will always scale to 1fr)


    --rt-orderform-DETAILS-BACKGROUND
Background color for item details dialog  
Default: burlywood

    --rt-orderform-DETAILS-COLOR
Text color for item details dialog  
Default: black

    --rt-orderform-DETAILS-BORDER
Border specification for item details dialog  
Default: 1px solid black

    --rt-orderform-DETAILS-RADIUS
Border radius specification  
Default: 10px

    --ORDER_FORM-DETAILS-PADDING
Padding for item details dialog  
Default: 10px

