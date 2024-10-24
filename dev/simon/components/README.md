# Components Directory #

This directory is intended to hold all components.

Each component is expected to be loaded as a module (`import()`) and to reside in its own directory that has the following structure (as a minimum)
```
/
|-components/
|  |- elementName/  
|  |  |- index.js  
|  |  |- elementName.html  
|  |  |- elementName.js
|-modules/
```
Where ***elementName*** is the name of the custom tag.  
&nbsp;  
The following pagess describe the structure of each of these files  
&nbsp;  
 - [index.js](index.md)
 - [elementName.html](html.md)
 - [elementName.js](js.md)
