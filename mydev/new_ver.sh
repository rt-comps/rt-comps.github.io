#! /bin/zsh
# Increment local version and create new files

# +++ Contants
# Name of project - either 1st param else default value
proj=${1:-'rt-appeltaart'}
# Project path relative to script
projPath="/Users/simon/Documents/MyDocs/Code/ROADS/rt-comps.github.io"
# stgPath="$projPath/tmp/$proj"
srcPath="$projPath/dev/simon/$proj"
# dstPath="$projPath/docs/"

# +++ Flight check
# Look for current version in project index.js
foundProj=${$(grep appelTaart "$srcPath/index.js" 2>/dev/null):-'Not Found'}
# Quit if not found
if [[ $foundProj == 'Not Found' ]]
then
    printf "Project: \"$proj\" $foundProj\n"
    exit
fi

# Get currently active version
currentVer=${${foundProj#*\'}%\'*}
# Increment version
newVer=${$(($currentVer + 1))}

# Update version in project index.js
sed -i '' "s/appelTaartVer.*/appelTaartVer\ \=\ '$newVer'/" "$srcPath/index.js"

# --- Copy existing files to new version files
# Search for all project component directories
printf "Finding component directories\n\n"
for compDir in $(find "$srcPath" -mindepth 1 -type d)
do
    # copy all previous file to new files with updated version
    for file in $(find "$compDir" -type f -name "*_v$currentVer*")
    do
        cp "$file" "${file/_v$currentVer/_v$newVer}"
    done
done
