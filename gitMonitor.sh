#!/bin/bash

cd /home/tcbweb1/tcbwebsite

GIT_NO_RESULT="Already up to date."
GIT_RESULT="$(git pull)"

if [ "$GIT_RESULT" != "$GIT_NO_RESULT" ]
then
    sudo systemctl reload nodeapp
fi