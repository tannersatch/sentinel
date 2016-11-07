#!/bin/bash

# color settings
blue='\033[0;34m'
cyan='\033[0;36m'
bold='\033[1m'
reset='\033[0m'

echo "${blue}${bold}*** Updating Git Repository ***${reset}";

cd ../../
git pull

sudo pkill iperf
sudo pkill node

sh client/scripts/start_client.sh

echo "${cyan}${bold}*** Update Complete ***${reset}";
