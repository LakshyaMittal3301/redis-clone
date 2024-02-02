const net = require("net");

const PORT = 6379;
const LOCALHOST = "127.0.0.1";

function sendPongResponse(socket){
    socket.write('+PONG\r\n');
}

console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {

    socket.on('data', (data) => {
        sendPongResponse(socket);
  });

});

server.listen(PORT, LOCALHOST, () => {
    console.log(`Server Listening on ${LOCALHOST}/${PORT}`);
});
