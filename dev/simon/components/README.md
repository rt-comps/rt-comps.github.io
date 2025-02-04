# Components Directory #

This directory is intended to hold all components.

Each component is expected to be loaded as a dynamic module (`import()`) and to reside in its own directory that has the following structure (as a minimum)
```
/
|-components/
|  |- componentName/  
|  |  |- index.js  
|  |  |- componentName.html  
|  |  |- componentName.js
|-modules/
```
Where ***componentName*** is the name of the custom tag.  
&nbsp;

The following pagess describe the structure of each of these files  
&nbsp;  
 - [index.js](index.md)
 - [componentName.html](html.md)
 - [componentName.js](js.md)
