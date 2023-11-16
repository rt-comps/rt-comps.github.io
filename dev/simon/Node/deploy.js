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
    const pathOpt = { recursive: true };

    // Create array of files to process
    const files = walk(srcPath);
    // Process all files in array
    for (let file of files) {
        // Create staging path required for this file if it has not been previously created
        // const filePath = `${stgPath}${file.slice(0, file.lastIndexOf('/'))}`;
        // if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
        // Process file based on type
        const fileType = file.substring(file.lastIndexOf('.') + 1);
        switch (fileType) {
            // Use uglify-js with default settings for JS
            case 'js':
                // Find substitutions when moving dev to prod
                // Get file contents
                const contents = fs.readFileSync(`${devPath}${file}`, 'utf8');
                // Check if any required substitions
                if (contents.indexOf('ForProd') > -1) {
                    console.log(file);
                    // Find any occurences in file and merge in to single object
                    let subs = contents.match(/ForProd\:.*/g).reduce((acc,el)=>{

                        const temp = JSON.parse(element.slice(9));
                   
                    }, {})
                }

                // fs.writeFileSync(`${stgPath}${file}`, uglify(fs.readFileSync(`${devPath}${file}`, 'utf8')).code);
                break;
            // Use html-minifier for HTML
            case 'html':
            case 'htm':
                // fs.writeFileSync(`${stgPath}${file}`, mini(fs.readFileSync(`${devPath}${file}`, 'utf8'), miniOpt));
                break;
            // Ignore these file types
            case 'md':
                break;
            // Copy all other file types
            default:
            // fs.copyFileSync(`${devPath}${file}`, `${stgPath}${file}`);
        }
    }

    const rmOpts = { recursive: true, force: true };
    // Move files from stage to 'docs' folder
    // fs.rmSync(`${dstPath}/${comp}`, rmOpts);
    // fs.renameSync(`${stgPath}/${comp}`, `${dstPath}/${comp}`);
    // // Tidy up
    // fs.rmSync(stgPath, rmOpts);
} catch (e) {
    if (e.cause && e.cause === 'custom') console.log(e.message);
    else console.log(e)
}
