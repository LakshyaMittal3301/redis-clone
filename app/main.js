const { createHash } = require("crypto");
const net = require("net");
const { parse } = require("path");

const PORT = 6379;
const LOCALHOST = "127.0.0.1";

const dataType = {
    simpleString : "simpleString",
    nullBulkString: "nullBulkString",
    bulkString: "bulkString",
    array: "array"
}

const config = {};

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

function parseBulkString(string){
    return `$${string.length}\r\n${string}`;
}

function parseArray(array){
    ret = `*${array.length}\r\n`;
    for(const element of array){
        ret += parseResponse(element);
    }
    return ret;
}

function createResposneObject(value, type){
    return {value, type};
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
            break;
        case dataType.bulkString:
            ret = parseBulkString(value);
            break;
        case dataType.array:
            ret = parseArray(value);
        break;

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
        case 'config':
            res = getConfig(args[1]);
            break;
    }

    socket.write(parseResponse(res));
}

function ping(){
    return createResposneObject('PONG', dataType.simpleString);
}

function echo(message){
    return createResposneObject(message, dataType.simpleString);
}

function set(key, value, arg, argVal){
    
    dataStore.set(key, value)
    
    if(arg == "px"){
        setTimeout(() => {
            dataStore.delete(key);
        }, argVal);
    }
    return createResposneObject("OK", dataType.simpleString);
}

function get(key){
    if(dataStore.has(key)){
        return createResposneObject(dataStore.get(key), dataType.simpleString);
    }else{
        return createResposneObject("", dataType.nullBulkString);
    }
}

function getConfig(arg){
    let arr = [createResposneObject(arg, dataType.bulkString), createResposneObject(config[arg], dataType.bulkString)];
    return createResposneObject(arr, dataType.array);
}

console.log("Logs from your program will appear here!");

(function processArgs(argList){
    if(argList.length == 0) return;
    
    config[argList[0].slice(2)] = argList[1];
    config[argList[2].slice(2)] = argList[3];

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
