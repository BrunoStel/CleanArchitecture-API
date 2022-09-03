#!/bin/bash
ARRAY=()
while read line
do
  [[ "${line}" != '' ]] && ARRAY+=("${line}")
done <<< "${FILES}"

for file in "${ARRAY[@]}"
do
  cp "$file" ./files
done
