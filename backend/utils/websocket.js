const WebSocket = require('ws');
const websocketController = require('../controllers/websocketController');
const initializeWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });
  wss.on('connection', (ws) => {
    websocketController.handleConnection(ws);
    ws.on('message', (data) => { websocketController.handleMessage(ws, data); });
    ws.on('close', () => { websocketController.handleDisconnection(ws); });
    ws.on('error', (error) => { websocketController.handleError(error); });
  });
  return wss;
};
module.exports = initializeWebSocket;