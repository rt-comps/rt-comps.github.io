[< Back](README.md)

# rtform.mjs

This file contains the following functions

### findStyle(startNode, targetNodeName, startNodeName)

|Param|Type||Use|
| :--- | --- | --- | :--- |
|*startNode*|{DOMNode}|-|Node that search starts from|
|*targetNodeName*|{String}|-|The name of the node to look for|
|*startNodeName*|{String}|-|The name of the initial node (Default: startNode.nodeName)| 

Recursively search up the DOM tree to find the specified target **node**.

Recursion terminates when once of the conditions is met
 - The **node** is found
 - *startNode* === *targetNode*
 - The current Root Node is not a Shadow Root. 

Returns the STYLE **node** found within the FORM-CONFIG **node** of the target **node** (if found) else **null**


**NOTE**: Currently not exported so only used by other functions in this module.

### getStyle(node,topNode)

|Param|Type||Use|
| :--- | --- | --- | :--- |
|*node*|{DOMNode}|-|Component node|
|*topNode*|{String}|-|Target node name (Default: 'rt-orderform')|

If additional style has been defined in the FORM_CONFIG **node** of *topNode*, ie a STYLE **node** with an ID corresponding to the specified component's name, then copy that STYLE **node** into the component's ShadowDOM as the last STYLE **node** so that it overrides any default style.

