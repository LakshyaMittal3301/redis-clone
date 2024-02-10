const net = require('net');
const readline = require('readline');
const { dataType } = require('./datatypes')
const {parseResponse, createResponseObject } = require('./parser');
const { send } = require('process');

const PORT = 6380; // Replace with your desired port number
const HOST = '127.0.0.1';

const client = new net.Socket();
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function parseInput(data){
	let arr = data.split(' ');
	let res = [];
	for(const arg of arr){
		res.push(createResponseObject(arg, dataType.bulkString));
	}
	return parseResponse(createResponseObject(res, dataType.array));
}

// Connect to the server
client.connect(PORT, HOST, () => {
	console.log(`Connected to server on ${HOST}:${PORT}`);

	// Start taking user input
	function sendDataToServer(){
		rl.question('Enter command ', (input) => {
			// Send user input to the server
			input = input.toLowerCase();
			if(input === 'exit') {
				client.end();
				rl.close();
			}else{
				let dataToSend = parseInput(input);
				client.write(dataToSend);
				sendDataToServer();
			}
		});
	}

	sendDataToServer();
});

// Handle data received from the server
client.on('data', (data) => {
	console.log(`Received data from server: ${data}`);
});

// Handle the connection being closed
client.on('close', () => {
	console.log('Connection closed');
});

// Handle errors
client.on('error', (err) => {
	console.error(`Error: ${err.message}`);
});
