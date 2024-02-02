const net = require("net");
const { parse } = require("path");

const PORT = 6379;
const LOCALHOST = "127.0.0.1";
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

function executeCommand(data, socket){
    let {command, args} = parser(data);
    switch(command){
        case 'ping': 
            ping(socket);
            break;
        case 'echo':
            echo(args[0], socket);
            break;
        case 'set':
            set(args[0], args[1], socket);
            break;
        case 'get':
            get(args[0], socket);
            break;
    }
}

function ping(socket){
    socket.write(parseSimpleString('PONG'));
}

function echo(message, socket){
    socket.write(parseSimpleString(message));
}

function set(key, value, socket){
    dataStore.set(key, value)
    socket.write(parseSimpleString("OK"));
}

function get(key, socket){
    value = dataStore.get(key);
    socket.write(parseSimpleString(value));
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
