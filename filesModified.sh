#!/bin/bash
mkdir filesToAnalyse
mkdir pathsModified

filesModified=`git show --pretty="" --name-status`

ARRAY=()
while read line
do
  [[ "${line}" != '' ]] && ARRAY+=("${line}")
done <<< "${filesModified}"

for file in "${ARRAY[@]}"
do
  cp $file ./filesToAnalyse

  case "$file" in 
   *app-backend*)
    echo >> pathsModified/app-backend.txt
    echo "---------------------------------------------------------------------------"
    echo "Modificações foram Feitas no app-backend!"
    echo "---------------------------------------------------------------------------"
    ;;
  esac

  case "$file" in 
   *app-mobile*)
    echo >> pathsModified/app-mobile.txt
    echo "---------------------------------------------------------------------------"
    echo "Modificações foram Feitas no app-mobile!"
    echo "---------------------------------------------------------------------------"
    ;;
  esac

done

echo "---------------------------------------------Arquivos Modificados pela branch--------------------------------------------"
ls ./filesToAnalyse
echo "---------------------------------------------Arquivos Modificados pela branch--------------------------------------------"
