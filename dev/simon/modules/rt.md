[< Back](README.md)

# rt.mjs
This file contains the following functions

--- 
### html(strings,values)
???

---
### parseCompURL(url)
| --- | --- | --- | --- |
|*url*|{String}|-|URL of component file|

Parse the URL of a component file to return the component name and base path.

---
### loadTemplate(url)
|||||
| --- | --- | --- | --- |
|*url*|{String}|-|URL of template file|

Load the specified template file in to the document HEAD.

---
### loadComponent(url, version = false)
|||||
| --- | --- | --- | --- |
|*url*|{String}|-|URL of template file|
|*version*|{String}|-|Version to use (optional)|

Load the component code.

---
### loadMods(basePath, addModules = [])
|||||
| --- | --- | --- | --- |
|*basePath*|{String}|-|URL of directory that contains the  *modules* directory|
|*addModules*|{Array}|-|Any modules that should be loaded in addition to the base modules|

Load any modules needed for the correct operation of a component into the global namespace.

*addModules* should be an array of objects, each having the form
```
{
    label: globalNamespaceName,
    file: moduleFileName
}
```
Object values are treated as String

---
### init(module, deps = [], mods = [])
|||||
| --- | --- | --- | --- |
|*module*|{String}|-|URL of component file|
|*deps*|{Array}|-|List of components needed by this component|
|*mods*|{Array}|-|List of additional modules needed by this component|

Initialise a new component and load any dependencies (components and/or modules)