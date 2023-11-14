#! /bin/zsh
# Minify files to and push to local live dir
# Non-destructive to development code
# Replaces local live dir (Very distructive)

# +++ Constants
# Name of project - either 1st param else default value
proj=${1:-'rt-appeltaart'}
# Project path relative to script
projPath="/Users/simon/Documents/MyDocs/Code/ROADS/rt-comps.github.io"
stgPath="$projPath/tmp/$proj"
devPath="$projPath/dev/simon"
srcPath="$devPath/$proj"
dstPath="$projPath/docs"
nodePath="/Users/simon/node_modules/.bin"

# +++ Flight check
# Quit if project folder not found
if [[ ! -e $srcPath ]]
then
    printf "Project: '$proj' Not Found\n"
    exit
fi

# If staging dir exists then something went wrong and something need to be done
if [[ -e $stgPath ]]
then
    printf "Directory: $stgPath already exists.\nDid something go wrong?\n"
    exit
fi 

# +++ All Good
# Create staging area
mkdir -p "$stgPath"

# Compress project index.js and output to staging 
$nodePath/uglifyjs "$srcPath/index.js" > "$stgPath/index.js"
# Compress global files and output stright to final location
for file in rt_baseclass.js rt.js
do
    $nodePath/uglifyjs "$devPath/$file" > "$dstPath/$file"
done

# Loop through all components in this project folder
for compSrcPath in $(find "$srcPath" -mindepth 1 -type d)
do
    # Determine staging folder name from source
    compStgPath="$stgPath/${compSrcPath##"$srcPath/"}"
    # Create identical path in staging
    [[ ! -e "$compStgPath" ]] && mkdir "$compStgPath"
    for srcFileFull in $(find "$compSrcPath" -type f)
    do
        filename=${srcFileFull##"$compSrcPath/"}
        printf "$compSrcPath: $filename\n"
        case "${filename##*.}" in
        # Process JS file
            "js")
                $nodePath/uglifyjs "$srcFileFull" > "$compStgPath/$filename"
                ;;
        # Process HTML file
            "html")
                $nodePath/html-minifier \
                --collapse-whitespace \
                --remove-comments \
                --minify-css true \
                "$srcFileFull" > "$compStgPath/$filename"
                ;;
        # Ignore these files
            "md")
                ;;
        # Copy other file types
            *)
                if [[ $filename == *"/"* ]]
                then
                    mkdir -p "$compStgPath/${filename%/*}"
                fi
                cp "$srcFileFull" "$compStgPath/$filename"
                ;;
        esac
    done
done

# Overwrite local 'live' version with new candidate
rm -rf "$dstPath/$proj"
mv "$stgPath" "$dstPath/"
