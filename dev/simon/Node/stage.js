// ----------------------------
// ### Node script to deploy a project
//
// Usage: node <pathToScript>/deploy.js [componentName] [componentName]
// 
// Code is taken from the specified component (Default: all components & modules),
// minified and component dir(s) in 'doc' directory over-written.
// Specify 'modules' to deploy changes to files in modules directory
//
// After running this script, a commit must be done manually
//
// Dependencies:
// - uglify-js
// - html-minifier
// > npm install --save uglify-js html-minifier
// ----------------------------

// ### Load modules 
// Allow FileSystem access
import * as fs from 'fs';

// ### Define constants
//  Where files are expected to be found in devPath
const pathList = [
    'components',
    'modules'
]
//  Options for removing directories
const rmOpts = { recursive: true, force: true };


// ### Local Functions

// --- walk
// Recursively find all the files in the given path
// This is needed because the 'recursive' option of readdir() does not seem to work 
function walk(path, result = []) {
    // List all items in this path and respond as needed
    fs.readdirSync(path, { withFileTypes: true })
        .forEach(
            (item) => {
                // If item is directory then walk this new directory
                if (item.isDirectory()) walk(`${path}/${item.name}`, result)
                // If item is a file then add to list
                else result.push(`${path}/${item.name}`)
            }
        );
    return result;
}

// --- constSub
// Make substitions of constants required when moving from dev to prod environments
//  Substitutions are define in the source file as follows (JSON format)
//      ForProd: { "<nameOfConstant": "<valueOfConstant", ... }
//  "ForProd:" can be used multiple times in a file and each instance can define 1+ properties
function constSub(contents) {
    // Find all substitutions provided in file and merge in to single object
    const subs = contents.match(/ForProd\:.*/g).reduce((acc, el) => {
        // Merge extracted object into final object
        return { ...acc, ...JSON.parse(el.slice(9)) };
    }, {})
    // Perform substitutions
    for (const sub in subs) {
        const strReplace = typeof subs[sub] === 'string' ? `'${subs[sub]}'` : subs[sub];
        // Search for constant assignment statement
        const strMatch = contents.match(new RegExp(`${sub} =.*`, 'g'));
        // If found then 
        if (strMatch) contents = contents.replace(strMatch[0], `${sub} = ${strReplace};`);
        else console.warn(`Unable to find "${sub}" in content`);
    }
    return contents;
}

// ### Start work
try {
    // ### Derive some constants
    //  Get current working directory
    const workingDir = process.cwd();
    //  Ensure script has been called from within project directory
    if (!workingDir.includes('github.io')) throw new Error('No project directory not found.  Ensure script is run from within project directory structure', { cause: 'custom' });
    //  Files are output to 'docs' directory of project
    const dstPath = `${workingDir.slice(0, workingDir.indexOf('github.io') + 9)}/docs/stage`;
    //  Get the path of this executable
    const execPath = process.argv[1];
    //  Assume component directories are at same level as 'Node' directory (where this script is placed)
    const devPath = execPath.slice(0, execPath.indexOf('/Node'));
    //  Read in any project name(s) provided
    let paramList = process.argv.slice(2);
    //  If no component is specified then deploy all files in 'components' and 'modules' directories
    if (paramList.length === 0 || (paramList.length === 1 && !paramList[0])) paramList = [...pathList];
    //  Convert parameter list to relative paths
    const compList = paramList.map(param => `${pathList.includes(param) ? '' : 'components/'}${param}`);

    // ### Pre-flight checks
    // Before doing anything, check that the ALL specified components/directories can be found
    compList.forEach(comp => { if (!fs.existsSync(`${devPath}/${comp}`)) throw new Error(`Component ${comp.split('/').pop().toUpperCase()} not found!\n\nPre-flight check failed!`, { cause: 'custom' }); });

    // ### Main Code - run for each component
    compList.forEach(comp => {
        // Create array of files to process, paths relative to devPath
        const files = walk(`${devPath}/${comp}`).map(el => el.slice(devPath.length + 1))
        // Process all files in array

        for (const file of files) {
            // Create required path in staging for this file, if it has not been previously created
            const filePath = `${dstPath}/${file.slice(0, file.lastIndexOf('/'))}`;
            if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
            // Process file based on type (type == file extension)
            const fileType = file.slice(file.lastIndexOf('.') + 1);
            if (fileType === 'md') continue;
            fs.copyFileSync(`${devPath}/${file}`, `${dstPath}/${file}`);
        }
    })
} catch (e) {
    console.log((e.cause && e.cause === 'custom') ? e.message : e);
}
