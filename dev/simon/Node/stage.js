// ----------------------------
// ### Node script to deploy a project to staging
//
// Usage: node <pathToScript>/stage.js [stagingType] [componentName] [componentName]
// 
// Code is taken from the specified component (Default: all components & modules) and moved to docs dir of staging repo
// The "staging type" defines how files are presented on staging
// 1    -   Copy files "as is" to staging (default if not specified)
// 2    -   Copy minified versions to staging
// 3    -   Copy full files with production substitutions
// 4    -   Full production version
//
// Specify 'modules' to deploy changes to files in modules directory.
// All module files will be updated
//
// After running this script, a commit must be done manually - gonna automate!
//
// Dependencies:
// - uglify-js
// - html-minifier
// > npm install --save uglify-js html-minifier
// ----------------------------

// ### Load modules 
// Get FileSystem access functions
import {
    copyFile as fs_copyFile,
    mkdir as fs_mkdir,
    readdir as fs_readdir,
    readFile as fs_readFile,
    stat as fs_stat,
    writeFile as fs_writeFile
} from 'fs/promises';
// Allow external commands
import { spawnSync as cp_spawn } from 'child_process';
// Minifiers
import { minify as uglify } from 'uglify-js';
import { minify as mini } from 'html-minifier-next';

// ### Define constants
// Repo names
const projName = 'rt-comps';
const stageProj = `${projName}-stg`;
//  'html-minifier' options
const miniOpt = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true
}
//  Options for removing directories
const rmOpts = { recursive: true, force: true };
//  Default paths to search for components
const pathList = [
    'components',
    'modules'
]
//  Map to hold any process flags
const flags = new Map();
//  Flag names
const stgType = 'stgType'

// ### Local Functions

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
            const strMatch = contents.match(new RegExp(`${key} =.*`, 'g'));
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
    // ### Derive some more constants
    //  Was script run from main repo directory?
    const workingDir = process.cwd().split(`${projName}.github.io`);
    if (!(workingDir.length > 1)) throw new Error('Script must be run from within production project directory structure', { cause: 'custom' });
    //  Determine production repo dir
    const prodRepoPath = `${workingDir[0]}${projName}.github.io`;
    //  Determine staging repo dir
    const stgRepoPath = `${workingDir[0]}${stageProj}.github.io`;
    //  Options when spawning external commands
    const spawnOpts = {
        cwd: stgRepoPath,
        encoding: 'utf8'
    }

    //  Assume component directories are at same level as 'Node' directory (where this script is placed)
    const devPath = `${prodRepoPath}/dev/simon`;
    //  Files are output to 'docs' directory of staging repo
    const dstPath = `${stgRepoPath}/docs`;

    //  Read in any parameters provided
    let paramList = process.argv.slice(2);

    // Check if "staging type" has been provided (first param) - default to type 1
    switch (true) {
        // If no parameters then set use dafault paths then fall through
        case (paramList.length === 0):
            paramList = pathList;
        // If first param is NaN then set stage type to 1
        case (isNaN(parseInt(paramList[0]))):
            flags.set(stgType, 1);
            break;
        default:
            // Set flag to first param
            flags.set(stgType, parseInt(paramList[0]));
            // Remove first param from array
            paramList.shift();
            // If only "stage type" value was passed then use default paths
            if (paramList.length === 0) paramList = paramList.concat(pathList)
    }

    // Convert parameter list to component path list 
    const compList = paramList.map(el => {
        //Don't alter if in default pathList
        if (pathList.indexOf(el) > -1) return el
        else return (`components/${el}`)
    })

    // ### Pre-flight checks
    // Is "staging type" value sane?
    if (flags.get(stgType) < 1 || flags.get(stgType) > 4) throw new Error('Unrecognised value for "staging type"\nMust be in range 1...4', { cause: 'custom' })
    // Do all specified modules exist? Exit on first module dir not found
    await Promise.all(compList.map(async comp => {
        return fs_stat(`${devPath}/${comp}`).catch(() => { throw new Error(`Source directory for "${comp}" not found\nExiting...`, { cause: 'custom' }) })
    }))

    // ### Main Code
    // Ensure "docs" dir exists in destination path
    try {
        // Throws an error if "dstPath" does not exist
        await fs_stat(dstPath)
    } catch {
        await fs_mkdir(dstPath);
    }

    // Asynchronously process all specified components/modules and collect promises
    const waitForAll = compList.map(async comp => {
        // Recurse through component directy to generate an array of all directory entry objects
        const rawFileList = await fs_readdir(`${devPath}/${comp}`, { withFileTypes: true, recursive: true })
        // Filter out directory objects and convert remaining objects to relative file path strings
        const fileList = rawFileList.map(el => {
            if (!el.isDirectory()) return `${el.path}/${el.name}`
        })
            // Remove falsey entries (directories)
            .filter(el => el)
            // Convert absolute file paths to relative
            .map(el => el.slice(devPath.length + 1))


        // Asynchronously process all entries in fileList array
        const waitForFinish = fileList.map(async file => {
            // Create required path in staging for file, if it has not been previously created
            const filePath = `${dstPath}/${file.slice(0, file.lastIndexOf('/'))}`;
            try {
                await fs_stat(filePath)
            } catch {
                await fs_mkdir(filePath, { recursive: true })
            }
            // Process file based on extension
            // Get extension for this file
            const fileType = file.slice(file.lastIndexOf('.') + 1);
            switch (fileType) {
                // Ignore .md files
                case 'md':
                    break;
                // Use uglify-js with default settings for JS
                case 'js':
                case 'mjs':
                    if (flags.get(stgType) === 1) {
                        // Straight copy 
                        return fs_copyFile(`${devPath}/${file}`, `${dstPath}/${file}`);
                    } else {
                        // Get original file contents <string>
                        let contents = await fs_readFile(`${devPath}/${file}`, 'utf8');
                        // If substitutions has been requested then carry out the sub
                        if (flags.get(stgType) > 2) contents = constSub(contents);
                        // Create the production version of the file in staging without minifying
                        return fs_writeFile(`${dstPath}/${file}`, uglify(contents, 'utf8').code);
                    }
                // Use html-minifier for HTML - options defined above
                case 'html':
                case 'htm':
                    // Just copy file if stgType is odd
                    if (flags.get(stgType) % 2 === 1) return fs_copyFile(`${devPath}/${file}`, `${dstPath}/${file}`);
                    // html-minifier is async so need to handle promise
                    const result = await mini(await fs_readFile(`${devPath}/${file}`, 'utf8'), miniOpt);
                    return fs_writeFile(`${dstPath}/${file}`, result);
                // Copy all other file types
                default:
                    return fs_copyFile(`${devPath}/${file}`, `${dstPath}/${file}`);
            }
        })
        // Return a promise that will be resolved once all files for this component have been processed
        return Promise.all(waitForFinish)
    })
    // Wait for all files of all specified components to be processed
    await Promise.all(waitForAll)
    console.log('finished processing')

    // ### Commit changes and push to GitHub
    //   This code assumes you are working on a POSIX-compliant system with Git installed
    // Check for any untracked files and add them to Git
    if (cp_spawn('sh', ['-c', 'git ls-files --other | wc -l'], spawnOpts).stdout > 0) cp_spawn('sh', ['-c', 'git add -A .'], spawnOpts);

    // Commit and push new/updated/deleted files
    if (cp_spawn('sh', ['-c', 'git diff --name-only --cached | wc -l'], spawnOpts).stdout > 0) {
        console.log('commiting')
        cp_spawn('sh', ['-c', `git commit -m "Staging: type - ${flags.get(stgType)} ${new Date().toUTCString()}"`], spawnOpts)
        cp_spawn('sh', ['-c', 'git push'], spawnOpts)
    }

} catch (e) {
    console.log((e.cause && e.cause === 'custom') ? e.message : e);
}

