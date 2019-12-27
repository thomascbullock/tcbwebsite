#!/bin/bash

cd /home/tcbweb1/tcbwebsite

GIT_NO_RESULT="Already up to date."
GIT_RESULT="$(git pull)"

echo $GIT_NO_RESULT
echo $GIT_RESULT

if [ "$GIT_RESULT" != "$GIT_NO_RESULT" ]
then
    sudo systemctl reload nodeapp
fi