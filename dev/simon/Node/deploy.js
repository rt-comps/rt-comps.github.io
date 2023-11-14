// ----------------------------
// ### Node script to deploy a project
// 
// Code is taken from the specified project (Defaul: 'rt-appeltaart'),
// minified and files in 'doc' directory are over-written.
//
// Commit must be done manually
//
// uglify-js & html-minifier must be installed
// > npm install --save uglify-js html-minifier
// ----------------------------

let output;

// ### Load modules 
// Allow FileSystem access
const fs = require('fs');
// Minifiers
const uglify = require('uglify-js').minify;
const mini = require('html-minifier').minify;
// html-minifier options
const miniOpt = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true
}

// Read in project name, if provided
const proj = process.argv[2] || 'rt-appeltaart';
// Define some paths
const projPath = '../../..';
const devPath = `${projPath}/dev/simon`;
const srcPath = `${devPath}/${proj}`;
const stgPath = `${devPath}/tmp/${proj}`;
const dstPath = `${projPath}/docs`;

// --- walk
// Recursively find all the files in the path
// This gets past the fact that 'recursive' option of readdir() does not work 
function walk(path, result = []) {
    // List all entries in this path
    fs.readdirSync(path, { withFileTypes: true }).forEach(
        // Add each list item to the array with path
        (item) => {
            const thisRes = `${path}/${item.name}`;
            // If item is directory then walk this new directory rather than add to results
            if (item.isDirectory()) walk(`${path}/${item.name}`, result)
            else result.push(`${path.replace(devPath, '')}/${item.name}`)
        }
    );
    return result;
}
let err;

// Check that 
if (!fs.existsSync(srcPath)) err = `Project ${proj.toUpperCase()} not found!`;

if (fs.existsSync(stgPath)) err = `Staging DIR already exists!\nSomething must have gone wrong\nExiting...`;

if (err) console.log(err);
else {
    // Create the staging directory
    // fs.mkdirSync(stgPath, { recursive: true });
    // Create array of files to process
    const files = walk(srcPath);
    const count = files.length;
    // // Create new files in staging
    for (let x = 0; x < count; x++) {
        const fileType = files[x].substring(files[x].lastIndexOf('.') + 1);
        switch (fileType) {
            case 'js':
                break;
            case 'html':
            case 'htm':
                break;
            case 'md':
                break;
            default:
        }
        console.log(fileType);
    }
    //    console.log(typeof output);
    //    if (typeof output === 'object') console.log(Object.getOwnPropertyNames(output));
    console.log(files);
}
