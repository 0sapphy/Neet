#!/bin/bash

read -p "Script: " script

if [ "$script" == "dev:esync" ];
  then

  node syncEmojis.js

elif [ "$script" == "start" ];
  then
  npm run start

fi

bash exe.sh