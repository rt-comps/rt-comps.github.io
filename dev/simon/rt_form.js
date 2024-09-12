// ================================================================
// Functions used used by Form components

//--- getStyle
// Search if style has been defined in the datafile
export function getStyle(node, name) {
    // Is <order-form> in the current Light DOM
    const formNode = node.closest('order-form');
    if (formNode !== null) {
        // Terminate any iteration once the <order-form> node has been found
        // Does a <style> element exist for this component
        const styleNode = formNode.querySelector(`form-config > style#${name.toLowerCase()}`);
        // If found then recover style element (if it exists) else do nothing
        if (styleNode) {
            // Check if component has an existing style declaration
            const existingStyleNode = node.shadowRoot.querySelector('style');
            // Place 'external style' after existing style declaration
            if (existingStyleNode) existingStyleNode.insertAdjacentElement('afterend', styleNode.cloneNode(true));
            // ... Or place 'external style' before first element
            else node.shadowRoot.childNodes[0].insertAdjacentElement('beforebegin', styleNode.cloneNode(true));
        }
    } else if (node.getRootNode() instanceof ShadowRoot) {
        // If not found and root node is shadowRoot then iterateb to enclosing element
         return getStyle(node.getRootNode().host, name);
    } else console.log('getStlye() - Something unexpected happened');
}
