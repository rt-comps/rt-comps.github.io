import * as fs from 'fs';

try {
    // ### Derive some constants
    //  Get current working directory of this executable
    const workingDir = process.argv[1].slice(0, process.argv[1].lastIndexOf('/'));
    //  Ensure script has been called from within project directory else throw error
    if (workingDir.indexOf('github.io') < 0) throw new Error('No project directory found.  Ensure script is run from within project directory structure', { cause: 'custom' });
    //  Files are placed in 'components' dev directory
    const dstPath = workingDir.replace('/Node', '/components');
    //  Recover name of new component
    const compName = process.argv[2];

    // ### Pre-Flight Checks
    //Exit if no parameter provided
    if (!compName)
        throw new Error('No component name specified.', { cause: 'custom' });
    if (fs.existsSync(`${dstPath}/${compName}`))
        throw new Error(`Component with name ${compName.toUpperCase()} already exists`, { cause: 'custom' })
    // ### End of Pre-Flight Checks

    const templates = fs.readdirSync(`${workingDir}/templates`);
    const newDir = `${dstPath}/${compName}`
    fs.mkdirSync(newDir);
    templates.forEach(filename => {
        console.log(filename.replace('comp', compName));
        const contents = fs.readFileSync(`${workingDir}/templates/${filename}`, 'utf8');
        fs.writeFileSync(`${newDir}/${filename.replace('comp', compName)}`, contents, 'utf8');
        //      console.log(contents);
        //        if (filename.indexOf('comp') > -1) filename
    })
    //    console.log(fs.readdirSync(newDir));

} catch (e) {
    console.log((e.cause && e.cause === 'custom') ? e.message : e);
}