require('dotenv').config({path: '../.env'})
const io = require('socket.io-client');
const exec = require('child_process').exec;

const HOST = process.env.HOST_URL;
const PORT = process.env.SSL_PORT || 8081;

const socket = io('https://' + HOST + ':' + PORT);

var client_info = {
	sid: '',
	ip_addr: '',
	mac_addr: '',
	wifi_ip_addr: '',
	wifi_mac_addr: '',
	host: '',
	router: '',
	vlan: '',
	switchName: '',
	switchPort: '',
	dept: '',
	bldg: '',
	room: '',
	pair: '',
	jack: '',
	network_type: ''
}

// on connection, send serial number to the server
socket.on('connect', function() {
	console.log('Connected');

	// get the info about this probe
	exec('sh get_client_info.sh', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred while retrieving client info. Error received == ' + err);
		console.log(stdout);
		console.log(stderr);
		var tmp = stdout.trim();
		tmp = tmp.split("\n");
		client_info.ip_addr = tmp[0];
		client_info.mac_addr = tmp[1];
		client_info.wifi_ip_addr = tmp[2];
		client_info.wifi_mac_addr = tmp[3];
		client_info.host = tmp[4];
		client_info.sid = tmp[5];
		client_info.network_type = "Wired";
		if(client_info.wifi_ip_addr != "Not_Connected") {
			client_info.ip_addr = client_info.wifi_ip_addr;
			client_info.mac_addr = client_info.wifi_mac_addr;
			client_info.network_type = "Wireless";
		}

		//**if you have a way to get these dynamically you can save them here**
		client_info.vlan = ''
		client_info.router = ''
		client_info.switchName = ''
		client_info.switchPort = ''
		client_info.dept = ''
		client_info.bldg = ''
		client_info.room = ''
		client_info.pair = ''
		client_info.jack = ''

		// send all the information to the server
		socket.emit('register', client_info);
	})
})

socket.on('disconnect', function() {
	console.log('Disconnected');
})

// return the device uptime to the server
socket.on('uptime', function(data) {
	console.log('Getting uptime...', data);

	exec('uptime', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred while getting uptime. Error received == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.uptime = stdout
		socket.emit('uptime_output', client_info);
		client_info.uptime = undefined
	})
})

// run iperf (TCP), and return the results to the server
socket.on('exec-iperf', function() {
	console.log('Running iPerf...');

	// the '-y C' makes it output the data in the following order:
	// timestamp,source_address,source_port,destination_address,destination_port,interval,transferred_bytes,bits_per_second
	exec('iperf -c ' + HOST + ' -y C', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred while running iPerf. Error recieved == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.iperf = stdout
		socket.emit('iperf_output', client_info);
		client_info.iperf = undefined
	})
})

// run iperf (UDP), and return the results to the server
socket.on('exec-iperf-udp', function(data) {
	console.log('Running iPerf UDP...', data);

	// UDP, set bandwidth (-u -b 10m)
	exec('iperf -c ' + HOST + ' -u -b 40m -y C', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred while running iPerf. Error recieved == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.iperf = stdout
		socket.emit('iperf_udp_output', client_info);
		client_info.iperf = undefined
	})
})

// run external sites selenium script and return the results to the server
socket.on('exec-selenium', function() {
	console.log('Running Selenium');

	exec('python scripts/SiteTest.py ', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred in process (Possible change to website GUI)! Error received == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.selenium = stdout
		socket.emit('selenium_output', client_info);
		client_info.selenium = undefined
	})
})

// run the git update script on this device
socket.on('update-client-git', function() {
	console.log('Updating client git repo...');

	exec('sh scripts/update_git.sh', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred updating git repo. Error received == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.update_git = stdout
		socket.emit('git_output', client_info);
		client_info.update_git = undefined
	})
})

// run the update script on this device
socket.on('update-client', function() {
	console.log('Updating client...');

	exec('echo odroid | sudo -S sh scripts/update_client.sh', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred running update. Error received == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.update = stdout
		socket.emit('update_output', client_info);
		client_info.update = undefined
	})
})

// reboot this device
socket.on('reboot', function() {
	console.log('Rebooting...');

	exec('echo odroid | sudo -S sudo reboot', function(err, stdout, stderr) {
		if (err) process.stdout.write('Error occurred in reboot. Error received == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.reboot = stdout
		socket.emit('reboot_output', client_info);
		client_info.reboot = undefined
	})
})

// run iperf as Client for probe-probe, and return the results to the server
socket.on('iperf-client', function(data) {
	console.log('Running iPerf (client) between probes...', data);

	exec('iperf -c ' + data.ip + ' -y C', function(err, stdout, stderr) { // UDP, set bandwidth (-u -b 10m)
		if (err) process.stdout.write('Error occurred while running iPerf. Error recieved == ' + err);
		console.log(stdout);
		console.log(stderr);

		client_info.iperf = stdout
		socket.emit('iperf_client', client_info);
		client_info.iperf = undefined
	})
})
