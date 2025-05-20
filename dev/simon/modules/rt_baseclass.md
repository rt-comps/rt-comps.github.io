[< Back](README.md)

# rt_baseclass.mjs

This file provides methods that extend the HTMLElement class to provide some helpful functionality for web components

---
###  $attr(name, defaultValue = "")
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*name*|{String}|-|The name of attribute|
|*newValue*|{String}|-|The new value for the atribute|

Either reads the value of attribute *name* or, if *newValue* is provided, changes the attribute value to *newValue* 

**Returns**  
**undefined** - if a *newValue* is specified, the attribute value is also updated.  
**null** - if attribute does not exist.   
**String** - the value of this element's attribute.

---
###  $attr2NumArray(attr, delimiter = ',')
|Param|Type|Default||Use|
| :--- | --- | --- | --- | :--- |
|*attr*|{String}|undefined|-|The value to convert|
|*delimiter*|{String}|','|-|Value separater|

Returns an array of numbers from a string with the provided delimiter.  
E.g.
```js
this.$attr('test','1,2,3')
console.log(this.$attr2NumArray('test'))
// Output: [1,2,3]
```
---
###  $createElement(options)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*options*|{Object}|-|The options required|

Extends ```document.create()``` to allow all aspects of the new element to be defined in one go.


Returns a new element according to the provided *options* from the table below
|Property|Type|Default||Description|
| :--- | --- | --- | --- | :--- |
|*tag*|{String}|'div'|-|Tag name|
|*innerHTML*|{String}|''|-|Any HTML for the element|
|*attrs*|{Object}|{}|-|Attributes to add to the element|
|*classes*|{Array}|[]|-|Classes to apply to element|
|*styles*|{Object}|{}|-|CSS styles to apply programatically|
|*cssText*|{String}|''|-|CSS text for *style* attribute|
|*append*|{Array}|[]|-|Elements to add after of the elements contents|
|*prepend*|{Array}|[]|-|Elements to add before the element contents|
|*props*|{Object}|null|-|Add contained properties to the new element|

---
###  $dispatch(eventOptions)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*eventOptions*|{Object}|-|The options required|

A wrapper for *dispatchEvent()* that uses and object to define custom event behaviour

*eventOptions* can have the following properties 
|Property|Type|Default||Description|
| :--- | --- | --- | --- | :--- |
|*name*|{String}|'name_not_provided'|-|The name of the event|
|*details*|{Object}|{}|-|The value of event.details|
|*bubbles*|{Boolean}|True|-|Can event travel up DOM tree|
|*composed*|{Boolean}|True|-|Can event traverse ShadowRoot|
|*cencelable*|{Boolean}|True|-|Can event be cancelled|
|*options*|{Object}|Above defaults|-|Define *details*,*bubbles*,*composed* & *cancelable* in one parameter|
|*eventbus*|{Element}|this|-|Element where the event is dispatched|

---
###  $euro(value, locale = 'nl-NL') {
|Property|Type|Default||Description|
| :--- | --- | --- | --- | :--- |
|*value*|{Number\|String}|null|-|The value to format|
|*locale*|{String}|'nl-NL'|-|The locale to format to|

Returns the number representation in currency format correct for locale

---
###  $getTemplate(template_id = this.nodeName)
|Property|Type|Default||Description|
| :--- | --- | --- | --- | :--- |
|*template_id*|{String}|this.nodeName|-|The ID of the required template (upper case)|

Returns contents of the template for this component

---
###  $localeDate(date, locale = 'nl-NL', options = {})
|Property|Type|Default||Description|
| :--- | --- | --- | --- | :--- |
|*date*|{Date}||-|The date object to format|
|*locale*|{String}|'nl-NL'|-|The local used for formatting|
|*options*|{Object}|{}|-|Formatting options|

Returns a string representing the date in the format defined by *locale* & *options*
