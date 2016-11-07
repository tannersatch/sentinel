#!/bin/bash

# color settings
blue='\033[0;34m'
cyan='\033[0;36m'
bold='\033[1m'
reset='\033[0m'

echo "${blue}${bold}*** Updating Probe ***${reset}";

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get dist-upgrade -y
sudo apt-get autoremove
sudo apt-get clean

echo "${cyan}${bold}*** Update Complete ***${reset}";
