# Component: *item-variety*

A component that collects and displays data for all available types of a given product variety.

---
### Component Dependancies: 
- rt-itemline

---
### Attributes:
- Required: 

|Attribute| | Description|
| :--- | --- | :--- |  
|*prijs*|-|The unit price for the given product type in cents|
- Optional: *None*

---

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