// ================================================================
// Functions used used by <rt-orderform> components

//--- getStyle
// Search if <style id="<component-name>"> has been defined in the upstream DOM (light or shadow).
// If found then the node is cloned into the components shadow DOM to supercede the default styles.
function getStyle(node) {
    // Set '???' to component node name of interest to deug errors
    const debug = node.nodeName.toUpperCase() === '???' ? true : false;
    // Is <rt-orderform> in the current Light DOM
    const formNode = node.closest('rt-orderform');
    if (debug) {
        console.log(formNode);
        console.log(node.getRootNode());
        console.log(node.getRootNode().host);
        setTimeout(()=> {
            console.log('After Timeout');
            console.log(node.getRootNode());
            const formNode2 = node.closest('rt-orderform');
            console.log(node.getRootNode().host)
        }, 1000)
    }
    if (formNode !== null) {
        // Terminate any iteration once the <rt-orderform> node has been found in Light DOM
        // Has a <style> element been defined in the datafile for this component
        const styleNode = formNode.querySelector(`style#${node.nodeName.toLowerCase()}`);
        // If found then recover style element else do nothing
        if (styleNode) {
            // Check if component has an existing style declaration
            const existingStyleNode = node.shadowRoot.querySelector('style');
            // Place 'external style' after existing style declaration
            if (existingStyleNode) existingStyleNode.insertAdjacentElement('afterend', styleNode.cloneNode(true));
            // ... Or place 'external style' before first element
            else node.shadowRoot.childNodes[0].insertAdjacentElement('beforebegin', styleNode.cloneNode(true));
        }
    } else if (node.getRootNode() instanceof ShadowRoot) {
        // If not found and root node is shadowRoot then continue search from shadowRoot's host element
        return getStyle(node.getRootNode().host);
    } else console.log(`getStyle() - Something unexpected happened for ${node.nodeName.toUpperCase()}`);
}

export { getStyle };