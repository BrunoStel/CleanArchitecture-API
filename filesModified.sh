#!/bin/bash
mkdir filesToAnalyse
mkdir filesToAnalyse/app-backend
mkdir filesToAnalyse/app-mobile
mkdir filesToAnalyse/admin-tool-backend
mkdir filesToAnalyse/admin-tool-frontend
mkdir pathsModified

verifyFileAlreadyExists(){
  if [ "$2" = "0" ]
  then
    fileNewName="$1-algo"
    cp $fileNewName ./filesToAnalyse/app-backend
  else
    cp $1 ./filesToAnalyse/app-backend
  fi
}

copieFiles(){
  filesModified=`git show --pretty="" --name-status | cut -c2-`

  ARRAY=()

  while read line
  do
    [[ "${line}" != '' ]] && ARRAY+=("${line}")
  done <<< "${filesModified}"

  for file in "${ARRAY[@]}"
  do
    case "$file" in 
    *app-backend*)
      find ./app-backend/$file >> /dev/null
      statusCode=$(echo $?)
      verifyFileAlreadyExists $file $statusCode
      ;;
      *app-mobile*)
      cp $file ./filesToAnalyse/app-mobile
      ;;
      *admin-tool-backend*)
      cp $file ./filesToAnalyse/admin-tool-backend
      ;;
      *admin-tool-frontend*)
      cp $file ./filesToAnalyse/admin-tool-frontend
      ;;
    esac
  done
}

directoriesToBeVerified(){
  if [["$BACKEND"]]
  then
    echo "---------------------------Modificações Foram feitas no APP BACKEND-------------------------------"
    echo >> pathsModified/app-backend.txt
    BACKEND=''
  fi

  if [["$MOBILE"]]
  then
    echo "---------------------------Modificações Foram feitas no APP MOBILE-------------------------------"
    echo >> pathsModified/app-mobile.txt
    MOBILE=''
  fi
}

copieFiles
directoriesToBeVerified

echo "---------------------------------------------Arquivos Modificados no app-backend--------------------------------------------"
ls ./filesToAnalyse/app-backend
echo "---------------------------------------------Arquivos Modificados no app-backend--------------------------------------------"

echo "---------------------------------------------Arquivos Modificados no app-mobile--------------------------------------------"
ls ./filesToAnalyse/app-mobile
echo "---------------------------------------------Arquivos Modificados no app-mobile--------------------------------------------"

echo "---------------------------------------------Arquivos Modificados no admin-tool-backend-------------------------------------------"
ls ./filesToAnalyse/admin-tool-backend
echo "---------------------------------------------Arquivos Modificados no admin-tool-backend--------------------------------------------"

echo "---------------------------------------------Arquivos Modificados no admin-tool-frontend--------------------------------------------"
ls ./filesToAnalyse/admin-tool-frontend
echo "---------------------------------------------Arquivos Modificados no admin-tool-frontend--------------------------------------------"
