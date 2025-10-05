const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
router.get('/messages', messageController.getMessages);
router.get('/messages/user/:username', messageController.getMessagesByUser);
router.get('/health', (req, res) => { const wsController = require('../controllers/websocketController'); res.json({ status: 'ok', onlineUsers: wsController.getOnlineUsersCount(), timestamp: new Date() }); });
module.exports = router;