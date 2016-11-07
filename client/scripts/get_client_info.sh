#!/bin/bash

# color settings
blue='\033[0;34m'
cyan='\033[0;36m'
bold='\033[1m'
reset='\033[0m'

# echo "${blue}${bold}*** Getting client IP address ***${reset}"

# Eth0 IP
WIRED="Not_Connected"
TMP1=`ifconfig eth0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'`
if [ "$TMP1" = "" ]
then
echo $WIRED
else
echo $TMP1
fi

# Eth0 MAC Acquisition
MAC="Not_Connected"
TMP2=`ifconfig eth0 2>/dev/null|awk '/HWaddr/ {print $5}'|sed 's/addr://'`
if [ "$TMP2" = "" ]
then
echo $MAC
else
echo $TMP2
fi

# WiFi

# WiFi IP 
WIRELESS="Not_Connected"
TMP3=`ifconfig wlan0 2>/dev/null|awk '/inet addr:/ {print $2}'|sed 's/addr://'` 
if [ "$TMP3" = "" ]
then
echo $WIRELESS
else
echo $TMP3
fi

# WiFi MAC
MAC2="Not_Connected"
TMP4=`ifconfig wlan0 2>/dev/null|awk '/HWaddr/ {print $5}'|sed 's/addr://'`
if [ "$TMP4" = "" ]
then
echo $MAC2
else
echo $TMP4
fi

# Hostname
hostname

# SID
cat /sys/block/mmcblk0/device/cid

# echo "${cyan}${bold}*** Done ***${reset}"
