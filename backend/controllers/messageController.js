const Message = require('../models/Message');
exports.getMessages = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = await Message.find().sort({ timestamp: -1 }).limit(limit);
    res.json({ success: true, count: messages.length, data: messages.reverse() });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
exports.createMessage = async (messageData) => {
  try {
    const newMessage = new Message({ username: messageData.username, text: messageData.text, timestamp: new Date() });
    const savedMessage = await newMessage.save();
    return savedMessage;
  } catch (error) { console.error('Error creating message:', error); throw error; }
};
exports.getMessagesByUser = async (req, res) => {
  try {
    const { username } = req.params;
    const messages = await Message.find({ username }).sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
exports.deleteOldMessages = async (daysOld = 30) => {
  try {
    const dateThreshold = new Date(); dateThreshold.setDate(dateThreshold.getDate() - daysOld);
    const result = await Message.deleteMany({ timestamp: { $lt: dateThreshold } });
    return result;
  } catch (error) { console.error('Error deleting old messages:', error); throw error; }
};