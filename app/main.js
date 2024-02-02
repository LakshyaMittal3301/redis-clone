const net = require("net");
const { parse } = require("path");

const PORT = 6379;
const LOCALHOST = "127.0.0.1";

const dataType = {
    simpleString : "simpleString",
    nullBulkString: "nullBulkString"
}

const dataStore = new Map();

function parser(data){
    let arrayRequest = data.split('\r\n');
    let args = [];
    for(let i = 4; i < arrayRequest.length; i+=2)
        args.push(arrayRequest[i]);

    return {
        command: arrayRequest[2],
        args: args
    };
}

function parseSimpleString(string){
    return `+${string}\r\n`;
}

function parseNullBulkString(string){
    return '$-1\r\n';
}

function parseResponse(res){
    let {value, type} = res;
    let ret;
    switch(type){
        case dataType.simpleString:
            ret = parseSimpleString(value);
            break;
        case dataType.nullBulkString:
            ret = parseNullBulkString(value);
    }

    return ret;
}

function executeCommand(data, socket){
    let {command, args} = parser(data);
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
                res = set(args[0], args[1]);
            } else {
                res = set(args[0], args[1], args[2], args[3]);
            }
            break;
        case 'get':
            res = get(args[0], socket);
            break;
    }

    socket.write(parseResponse(res));
}

function ping(){
    return {value: 'PONG', type: dataType.simpleString};
}

function echo(message){
    return {value: message, type: dataType.simpleString};
}

function set(key, value, arg, argVal){
    
    dataStore.set(key, value)
    
    if(arg == "px"){
        setTimeout(() => {
            dataStore.delete(key);
        }, argVal);
    }
    return {value: "OK", type: dataType.simpleString};
}

function get(key){
    if(dataStore.has(key)){
        return {value: dataStore.get(key), type: dataType.simpleString};
    }else{
        return {value: "", type: dataType.nullBulkString};
    }
    
}

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        data = data.toString();
        executeCommand(data, socket);

  });

});

server.listen(PORT, LOCALHOST, () => {
    console.log(`Server Listening on ${LOCALHOST}:${PORT}`);
});
