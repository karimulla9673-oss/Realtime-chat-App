const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const connectDB = require('./config/database');



const webSocketController = require('./controllers/websocketController');


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


const corsOptions = {
    origin: [
         // For local development
        'https://realtime-chat-app-2-8dei.onrender.com', // Your deployed frontend
        // Add any other frontend URLs you might have
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// Middleware

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