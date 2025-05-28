[< Back](README.md)

# rtform.mjs

This file contains the following functions

### findNode(startNode, targetNodeName)

|Param|Type||Use|
| :--- | --- | --- | :--- |
|*startNode*|{DOMNode}|-|Node that search starts from|
|*targetNodeName*|{String}|-|The name of the node to look for (Default: 'rt-orderform')|

Recursively search up the DOM tree to find the **Node** with the specified name.

Recursion terminates when once of the conditions is met
 - The **Node** is found
 - The current Root Node is not a **ShadowRoot**. 

Returns the matching **Node** else **Null**

---
### getStyle(node,menuNode)

|Param|Type||Use|
| :--- | --- | --- | :--- |
|*node*|{DOMNode}|-|Component node|
|*menuNode*|{String}|-|Target node name (Default: 'rt-orderform')|

Looks for a STYLE **Node** with an *ID* matching the component type in the 
FORM_CONFIG **Node** of the datafile.

If found then it is appended to the **ShadowDOM** of the component to override any component default.

