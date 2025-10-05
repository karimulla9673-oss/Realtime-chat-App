const Message = require('../models/Message');
const messageController = require('./messageController');
class WebSocketController {
  constructor() { this.clients = new Set(); }

  handleConnection(ws) { console.log('New client connected');
   this.clients.add(ws); 
   this.broadcastUserCount(); this.sendMessageHistory(ws); }

  async sendMessageHistory(ws) 
  { try
     { const messages = await Message.find().sort({ timestamp: 1 }).limit(50); ws.send(JSON.stringify({ type: 'history', messages: messages })); } 
     catch (error) { console.error('Error fetching messages:', error); } }
  async handleMessage(ws, data) { try { const parsed = JSON.parse(data); if (parsed.type === 'join') { ws.username = parsed.username; console.log(`${parsed.username} joined the chat`); this.broadcastUserCount(); } else if (parsed.type === 'message') { const savedMessage = await messageController.createMessage({ username: parsed.username, text: parsed.text }); this.broadcastMessage(savedMessage); } } catch (error) { console.error('Error handling message:', error); } }
  broadcastMessage(message) { const messageData = JSON.stringify({ type: 'message', message: message }); this.clients.forEach(client => { if (client.readyState === 1) { client.send(messageData); } }); }
  broadcastUserCount() { const count = this.clients.size; const data = JSON.stringify({ type: 'users', count: count }); this.clients.forEach(client => { if (client.readyState === 1) { client.send(data); } }); }
  handleDisconnection(ws) { console.log('Client disconnected'); this.clients.delete(ws); this.broadcastUserCount(); }
  handleError(error) { console.error('WebSocket error:', error); }
  getOnlineUsersCount() { return this.clients.size; }
}
module.exports = new WebSocketController();