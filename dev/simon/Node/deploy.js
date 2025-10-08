// ----------------------------
// ### Node script to deploy a project
//
// Usage: node <pathToScript>/deploy.js [componentName] [componentName]
// 
// Code is taken from 'stage' for the specified component(s) (Default: all components & modules),
// minified and then component dir(s) in 'doc' directory are over-written.
// If any components are specified then 'modules' must also be passed to update module files (all or none) 
//
// After running this script, a commit must be done manually
//
// Dependencies:
// - uglify-js
// - html-minifier-next
// > npm install --save uglify-js html-minifier-next
// ----------------------------

// ### Load modules 
// Allow FileSystem access
import * as fs from 'fs';
//const fs = require('fs');
// Minifiers
import { minify as uglify } from 'uglify-js';
import { minify as mini } from 'html-minifier-next';
//const uglify = require('uglify-js').minify;
//const mini = require('html-minifier').minify;

// ### Define constants
//  Where files are expected to be found in srcPath
const pathList = [
    'components',
    'modules'
]
//  'html-minifier' options
const miniOpt = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true
}
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

// ### Start work
try {
    // ### Derive some constants
    //  Get current working directory
    const workingDir = process.cwd();
    const checkTxt='\n\nPre-flight check failed!\n';
    //  Ensure script has been called from within project directory
    if (!workingDir.includes('github.io')) throw new Error('\nNo project directory not found.  Ensure script is run from within project directory structure\n', { cause: 'custom' });
    //  Files are output to 'docs' directory of project
    const dstPath = `${workingDir.slice(0, workingDir.indexOf('github.io') + 9)}/docs`;
    //  Get the path of this executable
    const execPath = process.argv[1];
    //  Components should exist in the '/docs/stage' directory
    const srcPath = `${dstPath}/stage`;
    // Check that source directory exists
    if (!fs.existsSync(srcPath)) throw new Error(`\n"stage" directory not found\n Was staging task run?${checkTxt}`, {cause: 'custom'})
    //  Determine source and staging dirs 
    const tmpPath = `${execPath.slice(0, execPath.indexOf('/Node'))}/tmp`;
    //  Read in any project name(s) provided
    let paramList = process.argv.slice(2);
    //  If no component is specified then deploy all files in 'components' and 'modules' directories
    if (paramList.length === 0) paramList = [...pathList];
    //  Convert parameter list to relative paths
    const compList = paramList.map(param => `${pathList.includes(param) ? '' : 'components/'}${param}`);

    // ### Pre-flight checks
    // Check if a previous attempt failed
    if (fs.existsSync(tmpPath)) throw new Error(`\nDeployment staging DIR already exists!\nSomething must have gone wrong previously${checkTxt}`, { cause: 'custom' });
    // Before doing anything, check that the ALL specified components/directories can be found
    compList.forEach(comp => { if (!fs.existsSync(`${srcPath}/${comp}`)) throw new Error(`\nComponent ${comp.split('/').pop().toUpperCase()} not found!${checkTxt}`, { cause: 'custom' }); });

    // ### Main Code - run for each component
    // Collect promise state for all components/modules
    const waitForAll = compList.map(comp => {
        // Create array of files to process, paths relative to srcPath
        const files = walk(`${srcPath}/${comp}`).map(el => el.slice(srcPath.length + 1))
        // Process all files in array
        const waitForFinish = files.map(file => {
            console.log(file)
            // Create required path in staging for this file, if it has not been previously created
            const filePath = `${tmpPath}/${file.slice(0, file.lastIndexOf('/'))}`;
            if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
            // Process file based on type (type == file extension)
            const fileType = file.slice(file.lastIndexOf('.') + 1);
            // process.exit()
            switch (fileType) {
                // Use uglify-js with default settings for JS
                case 'js':
                case 'mjs':
                    // Minify and save to staging
                    fs.writeFileSync(`${tmpPath}/${file}`, uglify(fs.readFileSync(`${srcPath}/${file}`, 'utf8')).code);
                    break;
                // Use html-minifier for HTML
                case 'html':
                case 'htm':
                    return mini(fs.readFileSync(`${srcPath}/${file}`, 'utf8'), miniOpt)
                        .then(result => fs.writeFileSync(`${tmpPath}/${file}`, result));
                // break;
                // Copy all other file types
                default:
                    fs.copyFileSync(`${srcPath}/${file}`, `${tmpPath}/${file}`);
            }
            return
        })

        // ### Replace files in production ('docs' folder)
        // Ensure that all html minifier tasks have completed before attempting to replace existing files for this component/modules
        return Promise.all(waitForFinish)
            .then(() => {
                // Remove existing files from 'docs' folder
                fs.rmSync(`${dstPath}/${comp}`, rmOpts);
                // Move new files to 'docs' folder
                fs.renameSync(`${tmpPath}/${comp}`, `${dstPath}/${comp}`);
            })
    })

    // ### Tidy up
    // Remove 'stage' & 'tmp' directories once all components/modules have been processed
    Promise.all(waitForAll)
        .then(() => {
            // remove 'stage' & 'tmp' directories
            fs.rmSync(tmpPath, rmOpts);
            fs.rmSync(srcPath, rmOpts);
        })
} catch (e) {
    console.log((e.cause && e.cause === 'custom') ? e.message : e);
}
