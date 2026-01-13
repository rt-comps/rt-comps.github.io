[< Back](README.md)

# rt.mjs
This file contains the following functions

--- 
### html(strings,values)
???

---
### parseCompURL(url)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*url*|{String}|-|URL of component file|

This function is primarily intended to work with loadComponent().

This function returns the name and URL of the enclosing directory of the file specified in the URL.

---
### loadTemplate(url)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*url*|{String}|-|URL of template file|

Load the specified template file in to the document HEAD.

---
### loadComponent(url, version)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*url*|{String}|-|URL of template file|
|*version*|{String}|-|Version to use (optional)|

Load the component code.

---
### loadMods(basePath, addModules)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*basePath*|{String}|-|URL of directory that contains the  *modules* directory|
|*addModules*|{Array}|-|Any modules that should be loaded in addition to the base modules (Default: empty array)|

Load any modules needed for the correct operation of a component into the global namespace.

*addModules* should be an array of objects, each having the form
```
{
    label: globalNamespaceName,
    file: moduleFileName
}
```
All Object values are treated as **String**

---
### init(module, deps, mods)
|Param|Type||Use|
| :--- | --- | --- | :--- |
|*module*|{String}|-|URL of component file|
|*deps*|{Array}|-|List of components needed by this component (Default: empty array)|
|*mods*|{Array}|-|List of additional modules needed by this component (Default: empty array)|

Initialise a new component and load any dependancies (components and/or modules)