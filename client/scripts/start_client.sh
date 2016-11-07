#!/bin/bash

# color settings
blue='\033[0;34m'
cyan='\033[0;36m'
bold='\033[1m'
reset='\033[0m'

# start client.js
echo "${blue}${bold}*** Starting client.js ***${reset}";
nohup node ../client.js > ../../log/client_output.log &

echo "${blue}${bold}*** Starting iPerf Servers ***${reset}";
iperf -s -D
iperf -s -u -D

echo "${cyan}${bold}*** Done ***${reset}"
