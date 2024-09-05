// ================================================================
// Extend the RTBaseClass class with methods commonly used by
// Form

class FormBaseClass extends RTBaseClass {

    //--- $getStyle
    // Get any style defined in datafile for a component 
    $getStyle(node, name) {
        if (node.nodeName === 'ORDER-FORM') {
            return node.querySelector(`form-config style#${name}`)
        } else { }
    }
}

export { FormBaseClass };