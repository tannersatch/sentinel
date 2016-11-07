import sys, os, time, datetime, itertools, json, requests

def main():
	results = sys.argv

	d = datetime.datetime.now()
	date = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime())
	doc_num = d.strftime("%Y%m%d%H%M%S")
	print results
# Send Data
	def sendData():
		entry = { }

		# Client
		entry["client_sid"] = results[10]
		entry["client_hostname"] = results[15]
		entry["client_ip"] = results[2]
		entry["client_mac_address"] = results[11]
		entry["client_building"] = results[21]
		entry["client_room"] = results[22]
		entry["client_router"] = results[16]
		entry["client_vlan"] = results[17]
		entry["client_switch"] = results[18]
		entry["client_switchport"] = results[19]
		entry["client_jack"] = results[24]
		entry["client_pair"] = results[23]
		entry["client_department"] = results[20]

		# Server
		entry["server_sid"] = results[4]
		entry["server_hostname"] = ""
		entry["server_ip"] = results[4]
		entry["server_mac_address"] = "Test MAC address"
		entry["server_building"] = ""
		entry["server_room"] = ""
		entry["server_router"] = ""
		entry["server_vlan"] = "VLAN Filler"
		entry["server_switch"] = ""
		entry["server_switchport"] = "Unknown Port"
		entry["server_jack"] = "Unknown Jack"
		entry["server_pair"] = ""
		entry["server_department"] = ""

		# General
		entry["timestamp"] = date
		entry["ticket_number"] = "Ticket String"
		entry["network_type"] = results[25]
		entry["test_type"] = "test type"
		entry["iperf_protocol"] = "TCP"
		entry["iperf_interval"] = results[7]
		entry["iperf_transferred_bytes"] = int(results[8])
		entry["iperf_bits_per_second"] = int(results[9])

		json_data = json.dumps(entry)
		print json_data
		url = '**YOUR URL HERE**'
		r = requests.post(url , data=json_data, verify=True)

	sendData()

if __name__ == "__main__":
	main()
