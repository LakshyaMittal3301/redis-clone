const net = require("net");

const PORT = 6379;
const LOCALHOST = "127.0.0.1";

function sendPongResponse(socket){
    socket.write('+PONG\r\n');
}

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((socket) => {
  // Handle connection
  socket.on('data', (data) => {
    console.log(data);
    sendPongResponse(socket);
  });
});

server.listen(PORT, LOCALHOST, () => {
    console.log(`Server Listening on ${LOCALHOST}/${PORT}`);
});
