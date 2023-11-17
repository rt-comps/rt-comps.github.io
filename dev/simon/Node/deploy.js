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

// ### Load modules 
// Allow FileSystem access
const fs = require('fs');
const { minify } = require('uglify-js');
// Minifiers
const uglify = require('uglify-js').minify;
const mini = require('html-minifier').minify;
// html-minifier options
const miniOpt = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true
}

try {
    // ### Local Functions
    // --- walk
    // Recursively find all the files in the given path
    // This gets past the fact that 'recursive' option of readdir() does not seem to work 
    function walk(path, result = []) {
        // List all entries in this path
        fs.readdirSync(path, { withFileTypes: true }).forEach(
            // Add each list item to the array with path
            (item) => {
                // If item is directory then walk this new directory
                if (item.isDirectory()) walk(`${path}/${item.name}`, result)
                // If item is a file then ad to list
                else result.push(`${path.replace(devPath, '')}/${item.name}`)
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

    // ### Define some paths
    // Read in project name, if provided
    const comp = process.argv[2] || 'rt-appeltaart';
    // Assume script is called from within project dir structure and determine the
    // base path from that
    const execPath = process.cwd();
    if (execPath.indexOf('github.io') < 0) throw new Error('No project directory not found.  Ensure script is run from within project directory structure', { cause: 'custom' });
    const basePath = execPath.slice(0, execPath.indexOf('github.io') + 9);
    const devPath = `${basePath}/dev/simon`;
    const srcPath = `${devPath}/${comp}`;
    const stgPath = `${devPath}/tmp`;
    const dstPath = `${basePath}/docs`;

    // ### Pre-flight checks
    // Check that the component can be found  
    if (!fs.existsSync(srcPath)) throw new Error(`Component ${comp.toUpperCase()} not found!`, { cause: 'custom' });
    // Check if a previous attempt failed
    if (fs.existsSync(stgPath)) throw new Error(`Staging DIR already exists!\nSomething must have gone wrong previously\nExiting...`, { cause: 'custom' });

    // ### Main Code

    // Create array of files to process
    const files = walk(srcPath);
    // Process all files in array
    for (const file of files) {
        // Create staging path required for this file if it has not been previously created
        const filePath = `${stgPath}${file.slice(0, file.lastIndexOf('/'))}`;
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
        // Process file based on type
        const fileType = file.substring(file.lastIndexOf('.') + 1);
        switch (fileType) {
            // Use uglify-js with default settings for JS
            case 'js':
                // Find any required constant substitutions when moving dev to prod
                // Get original file contents <string>
                let contents = fs.readFileSync(`${devPath}${file}`, 'utf8');
                // Check if any required substitions are present
                if (contents.indexOf('ForProd:') > -1) contents = constSub(contents);
                // Minify and save to staging
                fs.writeFileSync(`${stgPath}${file}`, uglify(contents).code);
                break;
            // Use html-minifier for HTML
            case 'html':
            case 'htm':
                fs.writeFileSync(`${stgPath}${file}`, mini(fs.readFileSync(`${devPath}${file}`, 'utf8'), miniOpt));
                break;
            // Ignore these file types
            case 'md':
                break;
            // Copy all other file types
            default:
                fs.copyFileSync(`${devPath}${file}`, `${stgPath}${file}`);
        }
    }

    const rmOpts = { recursive: true, force: true };
    // Move files from stage to 'docs' folder
    fs.rmSync(`${dstPath}/${comp}`, rmOpts);
    fs.renameSync(`${stgPath}/${comp}`, `${dstPath}/${comp}`);
    // // Tidy up
    fs.rmSync(stgPath, rmOpts);
} catch (e) {
    if (e.cause && e.cause === 'custom') console.log(e.message);
    else console.log(e)
}
