// ================================================================
// Functions used used by <rt-orderform> components

//--- findStyle
// Search up the DOM (light or shadow) for <style id="<component-name>">.
function findStyle(startNode, targetNodeName, startNodeName=startNode.nodeName) {
    // See if targetNode is in the current LightDOM
    const targetNode = startNode.closest(targetNodeName);

    // If found then return style node (null if style node doesn't exist)
    if (targetNode !== null) return targetNode.querySelector(`form-config style#${startNodeName.toLowerCase()}`)
    // If not found BUT root node is ShadowRoot then recurse out of ShadowDOM
    else if (startNode !== targetNode && startNode.getRootNode() instanceof ShadowRoot) return findStyle(startNode.getRootNode().host, targetNodeName, startNodeName)
    // If not found AND root node is not ShadowRoot then terminate as this means that the tergetNode was not found on this DOM branch!
    else return null;
}

//--- getStyle
// If <style id="<component-name>"> has been defined in the upstream DOM (light or shadow) then
// Cloned the node into the components shadow DOM after the default <style> node to supercede it.
function getStyle(node, topNode = 'rt-orderform') {
    // Set '???' to component node name of interest to debug errors
    //const debug = node.nodeName.toUpperCase() === 'RT-LINEITEM' ? true : false;
    //if (debug) console.log(something);
    // Look for 'topNode' in the current DOM
    const styleNode = findStyle(node, topNode);

    if (styleNode !== null) {
        console.log(`Found style node for ${node.nodeName}`);
        // Check if component has an existing style declaration
        const existingStyleNode = node.shadowRoot.querySelector('style');
        // Place 'external style' after existing style declaration
        if (existingStyleNode) existingStyleNode.insertAdjacentElement('afterend', styleNode.cloneNode(true));
        // ... Or place 'external style' before first element
        else node.shadowRoot.childNodes[0].insertAdjacentElement('beforebegin', styleNode.cloneNode(true));
    }
}

export { getStyle };