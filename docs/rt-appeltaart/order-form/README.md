This is the top-level web component for an order form to provide ordering functionality for the Appeltaart Imporium.

The goal was to design a dynamic form that could be populated by adding data via HTML.
Additionally, it was decided that any computed data should reside in the DOM as well.

The component expects the following HTML structure to be used

<order-form style="display: none;">
    <form-config>
        <span id="paramName">paramValue</span>
    </form-config>
    <item-data id="productName1">
        <item-title>Product Name</item-title>
        <item-desc>Description of product</item-desc>
        <img class="icon" file="imageFilename">
        <item-variety value="varietyDescription" desc="extendedDescription">
            <item-line prijs="princInCents">TypeName</item-line>
            <item-line prijs="">...</item-line>
        </item-variety>
        <item-variety value="other" desc="thing">
        ...
        </item-variety>  
    </item-data>
    ...
    <item-data id="productNameN">
    ...
    </item-data>
</order-form>

Note that the whole form is set "display:none" to begin with.  This is done to hide any 'random' text from the user until the components have fully loaded, at which point the form is set to "display:inline-block"

While loading the component will create an icon for each <item-data> entry using the <item-title> and <img class="icon"> values.

When an icon is clicked, the form will display all the data for that product to the user, allowing them to choose multiple items to add to the "shopping cart".

When one or more products are added to the "shopping cart", a new element is added to the DOM for each product type chosen so the shopping cart exists in the DOM, utilising the DOM as the primary data storage method.

When the order is placed then all the data held in the "shopping cart" section of the DOM can be wrapped up in an array of objects and sent as an event outside the form for further processing.