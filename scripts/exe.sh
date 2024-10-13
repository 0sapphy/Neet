#!/bin/bash

read -p "Script: " script

if [ "$script" == "dev:esync" ];
  then

  node scripts/emojis.js
  node emojis.js

elif [ "$script" == "start" ];
  then
  npm run start
fi

bash exe.sh