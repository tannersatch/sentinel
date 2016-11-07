require('dotenv').config({path: '../.env'})
const fs = require('fs');
const https = require('https');
const express = require('express');
const io_module = require('socket.io');
const exec = require('child_process').exec;

const http = express();
const app = express();

const PORT = process.env.PORT || 8080;
const SSL_PORT = process.env.SSL_PORT || 8081;

// redirect http to https
http.get('*:' + PORT, function(req, res){
	res.redirect('https://' + process.env.HOST_URL + ':' + ssl_port);
})

const options = {
	key: fs.readFileSync('ssl/private.key'),
	cert: fs.readFileSync('ssl/certificate.cert'),
}

// start secure server
const server = https.createServer(options, app).listen(SSL_PORT, function (){
	console.log("Server listening on port " + SSL_PORT)
})

const io = io_module.listen(server);
var connections = {};

io.on('connection', function(socket) {

	// on connection to ODroid, register it in the connections object
	socket.on('register', function(data) {
		var sid = JSON.stringify(data.sid.replace('\n', ''), null, 4);
		console.log('ODroid Registered, SID: ' + data.sid + " IP: " + data.ip_addr);

		connections[sid] = socket;
	})

	// receive the uptime data
	socket.on('uptime_output', function(data) {
		var sid = JSON.stringify(data.sid, null, 4);
		console.log('ODroid uptime (' + data.sid + '): ' + data.uptime);

		// write the results to a log file to parse and send to kibana
		fs.writeFile('../results/uptimeResults.txt', data.uptime, function(err) {
			if (err) console.error(err);
			console.log('Uptime results output to log file');
		})
	})

	// receive the iperf data (TCP)
	socket.on('iperf_output', function(data) {
		var sid = JSON.stringify(data.sid, null, 4);
		// clean up the output so it works as arguments for the python parsing script
		var iperf_data = data.iperf + ',' + data.sid + ',' + data.ip_addr + ',' + data.mac_addr + ',' + data.wifi_ip_addr + ',' + data.wifi_mac_addr + ',' + data.host + ',' + data.router + ',' + data.vlan + ',' + data.switchName + ',' + data.switchPort + ',' + data.dept + ',' + data.bldg + ',' + data.room + ',' + data.pair + ',' + data.jack + ',' + data.network_type;
		iperf_data = iperf_data.replace(/\n/g, "");
		iperf_data = iperf_data.replace(/\,/g, " ");
		console.log('ODroid iPerf ouput (' + data.sid + '): ' + iperf_data);

		// parse the data and send to elasticsearch/kibana
		exec('python parsing/iperfParse.py ' + iperf_data, function(err, stdout, stderr) {
			if (err) process.stdout.write('Error occurred while parsing iperf JSON.  Error = ' + err);
			console.log(stdout);
			console.log(stderr);
		})
	})

	// receive the iperf data (UDP)
	socket.on('iperf_udp_output', function(data) {
		var sid = JSON.stringify(data.sid, null, 4);
		// clean up the output so it works as arguments for the python parsing script
		var iperf_data = data.iperf + ',' + data.sid + ',' + data.ip_addr + ',' + data.mac_addr + ',' + data.wifi_ip_addr + ',' + data.wifi_mac_addr + ',' + data.host + ',' + data.router + ',' + data.vlan + ',' + data.switchName + ',' + data.switchPort + ',' + data.dept + ',' + data.bldg + ',' + data.room + ',' + data.pair + ',' + data.jack + ',' + data.network_type;
		iperf_data = iperf_data.replace(/\n/g, ",");
		iperf_data = iperf_data.replace(/\,/g, " ");
		console.log('ODroid iPerf UDP ouput (' + data.sid + '): ' + data.iperf);

		// parse the data and send to eleasticsearch/kibana
		exec('python parsing/iperfUdpParse.py ' + iperf_data, function(err, stdout, stderr) {
			if (err) process.stdout.write('Error occurred while parsing iperf JSON.  Error = ' + err);
			console.log(stdout);
			console.log(stderr);
		})
	})

	// receive the iperf probe to probe data
	socket.on('iperf_client', function(data) {
		var sid = JSON.stringify(data.sid, null, 4);
		console.log('ODroid iPerf ouput (' + data.sid + '): ' + data.iperf);

		// write the results to a log file to parse and send to kibana
		fs.writeFile('../results/iperfProbeResults.txt', data.iperf + ', ' + data.sid + ', ' + data.host, function(err) {
			if (err) console.error(err);
			console.log('iPerf results output to log file');

			exec('python parsing/iperfParse.py', function(err, stdout, stderr) {
				if (err) process.stdout.write('Error occurred while parsing iperf JSON.  Error = ' + err);
				console.log(stdout);
				console.log(stderr);
			})
		})
	})

	// receive selenium2 data (External Sites)
	socket.on('selenium_output', function(data) {
		var sid = JSON.stringify(data.sid, null, 4);
		console.log('ODroid Selenium2 ouput: ' + data.selenium);

		// write the results to a log file to parse and send to kibana
		fs.writeFile('../results/seleniumResults2.txt', data.selenium + ', ' + data.sid, function(err) {
			if (err)console.error(err);
			console.log('Selenium2 results output to log file!');
		})
	})

	// receive git update data
	socket.on('git_output', function(data) {
		console.log('ODroit Git Update output: ' + data.update_git);
	})

	//receieve update data
	socket.on('update_output', function(data) {
		console.log('ODroid Update ouput: ' + data.update);
	})

	// recieve reboot data
	socket.on('reboot_output', function(data) {
		console.log('Odrout reboot output: ' + data.reboot);
	})

	// var ip = socket.request.handshake.address
	var ip = socket.handshake.address;
	console.log('IP: ' + ip.address);
	console.log('ODroid Connected');

	socket.on('disconnect', function(data) {
		var i = connections.getKeyByValue(socket);
		console.log('ODroid Disconnected, SID: ' + i);
		delete connections[i];
	})
})

// get object from value i.e. get sid from socket
Object.prototype.getKeyByValue = function(value) {
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			if (this[key] === value) return key;
		}
	}
}

// probe actions page
app.get('/actions', function(req, res) {
	var keys = [];
	for (var k in connections)
		keys.push(k.replace(/['"]+/g, ''));

	var page_data = "<h1>Sentinel Network Probes</h1><br>";
	for (var i = 0; i < keys.length-1; i++) {
		page_data += "Probe " + keys[i];
		page_data += " <a href=\"/uptime/" + keys[i] + "\">Get Uptime</a> "
		page_data += " <a href=\"/exec-iperf/" + keys[i] + "\">Run iPerf (TCP)</a> "
		page_data += " <a href=\"/exec-iperf-udp/" + keys[i] + "\">Run iPerf (UDP)</a>"
		page_data += " <a href=\"/exec-selenium/" + keys[i] + "\">Test End User Broswer Speed</a><br>"
	}

	res.send(page_data);
})

// probe admin page
app.get('/admin', function(req, res) {
	var keys = [];
	for (var k in connections)
		keys.push(k.replace(/['"]+/g, ''));

	var page_data = "<h1>Sentinel Network Probe Administration</h1><br>";
	for (var i = 0; i < keys.length-1; i++) {
		page_data += "Probe " + keys[i];
		page_data += " <a href=\"/update-client/" + keys[i] + "\">Update Probe</a> "
		page_data += " <a href=\"/update-client-git/" + keys[i] + "\">Update Code</a> "
		page_data += " <a href=\"/reboot/" + keys[i] + "\">Reboot Probe</a><br>"
	}

	res.send(page_data);
})

// request uptime from the ODroid
app.get('/uptime/:sid', function(req, res) {
	console.log('Getting ODroid Uptime');
	var sid = JSON.stringify(req.params.sid, null, 4);
	connections[sid].emit('uptime');
	res.send('Getting ODroid Uptime on ' + sid)
})

// run iperf on the ODroid
app.get('/exec-iperf/:sid', function(req, res) {
	console.log('Running iPerf...');
	var sid = JSON.stringify(req.params.sid, null, 4);
	connections[sid].emit('exec-iperf');
	res.send('Running iPerf on ' + sid)
})

// run iperf UDP on the ODroid
app.get('/exec-iperf-udp/:sid', function(req, res) {
	console.log('Running iPerf UDP...');
	var sid = JSON.stringify(req.params.sid, null, 4);
	connections[sid].emit('exec-iperf-udp');
	res.send('Running iPerf UDP on ' + sid)
})

// run the external sites selenium script on the ODroid
app.get('/exec-selenium/:sid/', function(req, res) {
	console.log('Running Selenium SitesTest...');
	var sid = JSON.stringify(req.params.sid, null, 4);
	connections[sid].emit('exec-selenium');
	res.send('Running Selenium SitesTest on ' + sid)
})

// run the update git repository script on the ODroid
app.get('/update-client-git/:sid', function(req, res) {
	console.log('Updating client git repo...');
	var sid = JSON.stringify(req.params.sid, null, 4);
	connections[sid].emit('update-client-git');
	res.send('Updating client git repo on ' + sid)
})

// run the update script on the ODroid
app.get('/update-client/:sid', function(req, res) {
	console.log('Updating client...');
	var sid = JSON.stringify(req.params.sid, null, 4);
	connections[sid].emit('update-client');
	res.send('Updating client on ' + sid)
})

// reboot the ODroid
app.get('/reboot/:sid', function(req, res) {
	console.log('Rebooting client...');
	var sid = JSON.stringify(req.params.sid, null, 4);
	connections[sid].emit('reboot');
	res.send('Rebooting client on ' + sid)
})

// sid of the client, ip of the server
app.get('/iperf-probe/:sid/:ip', function(req, res) {
	console.log('Running iPerf between probes...');
	var sid = JSON.stringify(req.params.sid, null, 4);
	var ip = JSON.stringify(req.param.ip, null, 4);
	console.log('Client SID: ' + sid);
	console.log('Server IP: ' + ip);
	connections[sid].emit('iperf-client', { ip: ip })
	res.send('Running iPerf between probes on ' + sid + ' and ' + ip)
})

app.get('*', function (req, res){
	res.send('You\'ve reached the Sentinel home page')
})
