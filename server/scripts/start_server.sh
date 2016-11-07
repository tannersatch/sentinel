#!/bin/bash

# color settings
blue='\033[0;34m'
cyan='\033[0;36m'
bold='\033[1m'
reset='\033[0m'

echo -e "${blue}${bold}*** Starting server.js ***${reset}"

sudo pm2 start /home/sentinel/socket/server.js
sudo pm2 start /usr/bin/iperf -n tcp_iperf -- -s
sudo PM2_HOME='.pm3' pm2 start /usr/bin/iperf -n udp_iperf -- -s -u -i 1

echo -e "${cyan}${bold}*** Done ***${reset}"
