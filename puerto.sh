#!/bin/bash
declare -a array

# lsof -t -i:3001
array+=("$(lsof -t -i:3000)")

ARR+=("$(ls -d */)")

echo ${array[0]}
echo ${array[1]}

kill -9 ${array[0]}
npm run dev