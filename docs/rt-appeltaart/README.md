This folder contains files for web components used for the Appeltaart Imporium website.

README.md   -   This file
index.js    -   Loads the standard Roads function library and base class into the global context.
            -   Initatiates the loading of top-level web components

It also contains folders that define any web components that are specific to this application.
Each component uses the same file structure

comp-name/
    |-> README.md
    |-> index.js
    |-> comp-name_vX.html
    |-> comp-name.vX.js

Where "comp-name" is the name of the HTML tag and "X" is a component version number.
For any value of "X" there should be a corresponding .html and .js files.

README.md           -   A text file that holds overview documentation
index.js            -   Used to primarily load a specified version ("X") of the component.  
                        It is also used to load any components on which this component depends
comp-name_vX.html   -   Contains an HTML template for the component ShadowDOM that will be attached to the 
                        page HEAD.
                        The template is defined with an "id" equal to the comp name in upper case. 
comp-name_vX.js     -   The Class definition of the component