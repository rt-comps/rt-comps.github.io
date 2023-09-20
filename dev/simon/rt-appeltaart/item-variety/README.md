A component that displays of data for all product types (<item-line>s) of a given product variety

Attributes:
- Required: 
    - value
        - A value that should be unique within the product variety
- Optional: 
    - desc
        - Further text to describe this variety

Events:
- Dispatched: None
- Listened: None

Dependancies: 
- item-line

Notes: 
Expects HTML of the following form

<item-variety value="varietyDescription" desc="extendedDescription">
    <item-line prijs="xxxx">varietyType1</item-line>
        ...
    <item-line prijs="yyyy">varietyTypeN</item-line>
</item-variety>