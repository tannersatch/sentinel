import sys, os, time, itertools, json, requests

def main():

# get log file
	with open('../results/iperfResults.txt') as f:
		log = f.read()
	results = [x.strip() for x in log.split(',')]

# list of what each result contains
# results[0] = timestamp
# results[1] = source ip address
# results[2] = source port
# results[3] = destination ip address
# results[4] = destination port
# results[5] = ?
# results[6] = interval
# results[7] = transferred bytes
# results[8] = bits per second
# results[9] = sid

# Send Data
	def sendData():
    	entry = { }
    	entry["sid"] = results[9]
    	entry["hostname"] = ""
    	entry["source_ip"] = results[1]
    	entry["dest_ip"] = results[3]
		entry["mac_address"] = "Test MAC address"
		entry["iperf_timestamp"] = results[0]
		entry["iperf_interval"] = results[6]
		entry["iperf_transferred_bytes"] = results[7]
		entry["iperf_bits_per_second"] = results[8]
   		entry["source_switch"] = "test source switch"
    	entry["source_switchport"] = "test switchport"
    	entry["source_jack"] = "test jack"
    	entry["source_building"] = "test building"
    	entry["source_room"] = "test room"
		json_data = json.dumps(entry)
    	print json_data
    	url = '**YOUR URL HERE**'
    	r = requests.post(url , data=json_data, verify=True)

	sendData()

if __name__ == "__main__":
	main()
