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
// Make substitions for constants when required for moving from dev to prod environments
//  Substitutions are define in the source file as follows (JSON format)
//      ForProd: { "<nameOfConstant": "<valueOfConstant", ... }
//  "ForProd:" can be used multiple times in a file and each instance can define 1+ properties
function constSub(contents) {
    let subs;
    // Find all substitutions provided in file and merge in to a single object
    const toSub = contents.match(/ForProd\:.*/g);
    // Were any substitutions found?
    if (toSub) {
        // Collect all substitutions found in file into a Map
        if (toSub.length > 1) {
            // Reduce multiple Objects to single Map
            subs = toSub.reduce((acc, line) => {
                // convert JSON Object to Map
                const map = new Map(Object.entries(JSON.parse(line.slice(line.indexOf('{')))))
                // Merge newly extracted Map with the accumulator Map
                return new Map([...acc, ...map])
            }, new Map());
        } else {
            // reduce() will not run on a single entry array
            const line = toSub[0];
            subs = new Map(Object.entries(JSON.parse(line.slice(line.indexOf('{')))))
        }

        // Perform substitutions
        subs.forEach((value, key) => {
            // Search for parameter assignment to change (use RegExp to allow use of variable)
            const strMatch = contents.match(new RegExp(`${key} =.*`,'g'));
            // If parameter found then replace value for all instances 
            if (strMatch) {
                // Add quotes to any string value
                const strReplace = typeof value === 'string' ? `'${value}'` : value;
                contents = contents.replaceAll(strMatch[0], `${key} = ${strReplace};`)
            }
        });
    }
    // Always return file contents
    return contents
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
    // Cleanup any previous files
    if (fs.existsSync(dstPath)) fs.rmSync(dstPath, {recursive: true});
    
    // Process all files for provided components/modules
    compList.forEach(comp => {
        // Create array of files to process, paths relative to devPath
        const files = walk(`${devPath}/${comp}`).map(el => el.slice(devPath.length + 1))
        // Process all files in array
        for (const file of files) {
            const fileType = file.slice(file.lastIndexOf('.') + 1);
            // Do not process MarkDown files
            if (fileType === 'md') continue;
            // Create required path in staging for this file, if it has not been previously created
            const filePath = `${dstPath}/${file.slice(0, file.lastIndexOf('/'))}`;
            if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
            // Check if any required parameter substitions are present when moving from dev to stage
            if (fileType === 'js' | fileType === 'mjs') {
                // Get original file contents <string>
                let contents = fs.readFileSync(`${devPath}/${file}`, 'utf8');
                // If at least one substitution has been defined then carry out the sub
                if (contents.includes('ForProd:')) contents = constSub(contents);
                // Create the production version of the file in staging without minifying
                fs.writeFileSync(`${dstPath}/${file}`, contents);
            } else {
                fs.copyFileSync(`${devPath}/${file}`, `${dstPath}/${file}`);
            }
        }
    })
} catch (e) {
    console.log((e.cause && e.cause === 'custom') ? e.message : e);
}
