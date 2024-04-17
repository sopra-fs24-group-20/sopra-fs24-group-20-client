const io = require('socket.io-client');
const { Server } = require('socket.io');

// Mock Socket.io server URL
const SERVER_URL = 'http://localhost:3000';

// Initialize mock Socket.io server
const ioServer = new Server();

// Define event handlers for the server
ioServer.on('connection', (socket) => {
  console.log('Client connected');

  // Handle 'message' event from client
  socket.on('message', (data) => {
    console.log('Received message from client:', data);
    // Respond to client with a message
    socket.emit('message', 'Hello from server');
  });

  // Handle 'disconnect' event
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start listening on port 3000
const server = ioServer.listen(3000, () => {
  console.log('Mock Socket.io server running on port 3000');
});

// Connect to the mock Socket.io server
const socket = io(SERVER_URL);

// Event handler for 'connect' event
socket.on('connect', () => {
  console.log('Connected to mock server');

  // Simulate sending a message to the server
  socket.emit('message', 'Hello from client');
});

// Event handler for 'message' event
socket.on('message', (data) => {
  console.log('Received message from server:', data);
});

// Event handler for 'disconnect' event
socket.on('disconnect', () => {
  console.log('Disconnected from mock server');
});
