// ================================================================
// Functions used used by Form components

//--- getStyle
// Search if style has been defined in the datafile
export function getStyle(node, name) {
    // Is <order-form> in the current Light DOM
    const formNode = node.closest('order-form');
    if (formNode !== null) {
        // If found then recover style (if it exists) - termination condition
        const styleNode = formNode.querySelector(`form-config > style#${name}`);
        return styleNode;
    } else if (node.getRootNode() instanceof ShadowRoot) {
        // If not found and root node is ShadowRoot then iterate
         return getStyle(node.getRootNode().host, name);
    } else console.log('getStlye() - Something unexpected happened');
}
