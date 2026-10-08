const net = require('net');

const hostname = '127.0.0.1'; // Listen on IPv4 localhost only
const port = 8080;

const server = net.createServer((socket) => {
  console.log('Client connected');
  socket.on('data', (data) => {
    console.log('Received:', data.toString());
    socket.write('Hello World\n');
  });
  socket.on('end', () => {
    console.log('Client disconnected');
  });
  socket.on('error', (err) => {
    console.log('Socket error:', err);
  });
});

server.listen(port, hostname, () => {
  console.log(`TCP Server listening on ${hostname}:${port}`);
});

server.on('error', (err) => {
  console.log('Server error:', err);
});