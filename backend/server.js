const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const connectDB = require('./config/database');



const webSocketController = require('./controllers/webSocketController');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// WebSocket connection handling
wss.on('connection', (ws) => {
  webSocketController.handleConnection(ws);

  ws.on('message', (data) => {
    webSocketController.handleMessage(ws, data);
  });

  ws.on('close', () => {
    webSocketController.handleDisconnection(ws);
  });

  ws.on('error', (error) => {
    webSocketController.handleError(error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', onlineUsers: webSocketController.getOnlineUsersCount() });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});