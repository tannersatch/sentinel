#!/bin/bash

# color settings
blue='\033[0;34m'
cyan='\033[0;36m'
bold='\033[1m'
reset='\033[0m'

echo "${blue}${bold}*** Beginning Install Script ***${reset}";

# iperf installation
echo "${blue}${bold}*** Installing iPerf ***${reset}";
sudo apt-get install iperf -y

# nuttcp installation
echo "${blue}${bold}*** Installig nuttcp ***${reset}";
sudo apt-get install nuttcp -y

# Node.js Installation
echo "${blue}${bold}*** Installing Node.js ***${reset}";
sudo apt-get install nodejs -y

echo "${cyan}${bold}*** Install Complete ***${reset}";

