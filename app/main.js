const net = require("net");
const { parseResponse } = require('./parser');
const DBParser = require('./DBParser');
const fs = require('fs');
const path = require('path');

const { PORT, LOCALHOST, config } = require('./config');
const { 
    ping, 
    echo, 
    set,
    get,
    getConfig,
    keys
}  = require('./commands');


function inputParser(data){
    let arrayRequest = data.split('\r\n');
    let args = [];
    for(let i = 4; i < arrayRequest.length; i+=2)
    args.push(arrayRequest[i]);

return {
    command: arrayRequest[2],
    args: args
};
}

function executeCommand(data, socket){
    let {command, args} = inputParser(data);
    let res;
    switch(command){
        case 'ping': 
        res = ping(socket);
        break;
        case 'echo':
            res = echo(args[0], socket);
            break;
        case 'set':
            if(args.length == 2){
                res = set(dataStore, args[0], args[1]);
            } else {
                res = set(dataStore, args[0], args[1], args[2], args[3]);
            }
            break;
        case 'get':
            res = get(dataStore, args[0], socket);
            break;
        case 'config':
            res = getConfig(config, args[1]);
            break;
        case 'keys':
            res = keys(dataStore, args[0]);
            break;
    }
                    
    socket.write(parseResponse(res));
}

console.log("Logs from your program will appear here!");

let dataStore = new Map();

(function initialize(argList){
    if(argList.length == 0) return;
    
    config[argList[0].slice(2)] = argList[1];
    config[argList[2].slice(2)] = argList[3];
    
    const filePath = path.join(config['dir'], config['dbfilename']);
        
    let buffer;
    if(!fs.existsSync(filePath)) return;
    try{
        buffer = fs.readFileSync(filePath);
        console.log(`Successfully read the data`);
    }
    catch(err){
        console.log(`Error reading file in binary: ${err}`);
        return;
    }
    
    const dbParser = new DBParser(buffer);
    
    dataStore = dbParser.fillDataStore();
})(process.argv.slice(2));


const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        data = data.toString();
        executeCommand(data, socket);
  });
});

server.listen(PORT, LOCALHOST, () => {
    console.log(`Server Listening on ${LOCALHOST}:${PORT}`);
});
