# Sentinel Network Probe

### Live end user experience network forensics tool

Initially a BYU IT Capstone Project (2015-2016).

Now an open source solution to enhance the availability, performance, and reliability of a network through network probes that replicate the end user experience.

----------
### Server Setup and Installation of Software Dependencies

Run the install_server.sh script
```bash
sudo sh server/scripts/install_server.sh
```

Run ```npm install``` in the server folder

Create an ssl directory in the server folder
Run the create-cert.js script
```bash
node create-cert.js
```
Copy the .env-template contents to a new .env file

Set the variables in .env:

- PORT
- SSL_PORT
- HOST_URL

Set the Elasticsearch url in the parsing scripts:

 - iperfParse.py
 - iperfUdpParse.py
 - uptimeParse.py

### Starting the Server
Run the start server script. This will start the node server, as well as iperf listeners for TCP and UDP connections
```bash
sh scripts/start_server.sh
```

### Client Setup and Installation of Software Dependencies

Run the client installation script as root
```bash
sudo sh client/scripts/install_client.sh
```

If you haven't already done so, copy the .env-template file contents to a new .env file and set the variables as mentioned above.

Run ```npm install``` in the client folder

### Starting the Client

Three options:

 1. ```node client.js```
 2. Run the start client script
 ```sh client/scripts/start_client.sh```
 3. Edit rc.local to run start_client.sh at startup (best for when the probes are deployed, allows plug and play capability to deploy)
