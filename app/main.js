const net = require("net");

const PORT = 6379;
const LOCALHOST = "127.0.0.1";

function parser(data){
    let arrayRequest = data.split('\r\n');
    
    let args = [];
    for(let i = 4; i < arrayRequest.listen; i+=2)
        args.push(arrayRequest[i]);

    return {
        command: arrayRequest[2],
        args: args
    };
}

function ping(socket){
    socket.write('+PONG\r\n');
}

function echo(message, socket){
    socket.write(message);
}

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        let {command, args} = parser(data.toString());
        switch(command){
            case 'ping': 
                ping(socket);
                break;
            case 'echo':
                echo(args[0], socket);
                break;
        }
  });

});

server.listen(PORT, LOCALHOST, () => {
    console.log(`Server Listening on ${LOCALHOST}:${PORT}`);
});
