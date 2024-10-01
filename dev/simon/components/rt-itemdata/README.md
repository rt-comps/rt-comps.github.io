A component that handles the display of data for a product

Attributes:
- Required:
    - id
        - Must be unique for the rt-orderform
- Optional: None

Events:
- Dispatched: None
- Listened: None

Dependancies: 
- item-variety

Notes:
HTML of the following form is expected

<item-data id="productName1">
    <item-title>Product Name</item-title>
    <item-desc>Description of product</item-desc>
    <img class="icon" file="imageFilename">
    <item-variety value="varietyDescription" desc="extendedDescription">
        ...
    </item-variety>
    ...
    <item-variety value="other" desc="thing">
        ...
    </item-variety>  
</item-data>

NB if multiple <item-title> and/or <item-desc> are provided then the component may render incorrectly.