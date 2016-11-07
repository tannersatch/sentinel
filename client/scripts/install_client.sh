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

# Selenium Installation
echo "${blue}${bold}*** Installing Selenium ***${reset}";
sudo apt-get install python-pip -y
sudo pip install selenium 
sudo pip install pyvirtualdisplay 
sudo apt-get install xvfb -y
sudo apt-get install python-netifaces -y
sudo apt-get install libxml2-dev libxslt1-dev python-dev -y
sudo apt-get install python-lxml -y
sudo pip install beautifulsoup4 
sudo pip install mechanize 
sudo apt-get install xserver-xephyr -y

# Node.js Installation
echo "${blue}${bold}*** Installing Node.js ***${reset}";
curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install --yes nodejs

echo "#!/bin/sh -e" > /etc/rc.local
echo "/home/odroid/sentinel/scripts/start_client.sh" >> /etc/rc.local
echo "exit 0" >> /etc/rc.local
echo "blacklist ina231_sensor" >> /etc/modprobe.d/blacklist-odroid.conf

# matplotlib installation (graph for selenium display)
#echo "${blue}${bold}*** Installing Matplotlab ***${reset}";
#sudo apt-get install python-matplotlib -y

# socket.io & modules installation
# echo "Installing socket.io...";
# cd ../socket
# sudo apt-get install npm
# sudo npm install socket.io
# sudo npm install socket.io-client
# sudo npm install request
# sudo npm install connect

echo "${cyan}${bold}*** Install Complete ***${reset}";

