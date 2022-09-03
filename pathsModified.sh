#!/bin/bash
filesModified=`git show --pretty="" --name-status`
ARRAY=()
while read line
do
  [[ "${line}" != '' ]] && ARRAY+=("${line}")
done <<< "${filesModified}"

mkdir pathsModified

for file in "${ARRAY[@]}"
do
  case "$file" in 
   *app-backend*)
    echo >> pathsModified/app-backend.txt
    ANALAYSE_BFF = true
    echo "---------------------------------------------------------------------------"
    echo "Modificações foram Feitas no app-backend!"
    echo "---------------------------------------------------------------------------"
    ;;
  esac

  case "$file" in 
   *app-mobile*)
    echo >> pathsModified/app-mobile.txt
    ANALAYSE_MOBILE = true
    echo "---------------------------------------------------------------------------"
    echo "Modificações foram Feitas no app-mobile!"
    echo "---------------------------------------------------------------------------"
    ;;
  esac

done