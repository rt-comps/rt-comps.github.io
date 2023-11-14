#! /bin/zsh
# Push minified files to live folder

# Check if there is anything to do
if [[ $(find ../../dev/simon -type f -name "*.min.js" | wc -l) -eq 0 ]]
then
    printf "\nNo files have changed ...nothing to do\n\n"
    exit
fi

# Take each minified file, remove excess spaces around "\n" and overwrite 'live' file 
for x in $(find ../../dev/simon -type f -name "*.min.*")
do
    printf "Moving: ${x}\n"
    printf "...to : ${${x/dev\/simon/docs}/.min}\n"
    printf "\n"
    sed 's/\\n */\\n/g' "$x" > "${${x/dev\/simon/docs}/.min}"
    rm "$x"
done
