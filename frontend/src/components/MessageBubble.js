const MessageBubble = ({ message, isOwnMessage }) => {
  // ✅ Safely extract message properties
  const username = message?.username || 'Unknown';
  const text = message?.text || message?.message || '';
  const timestamp = message?.timestamp || message?.createdAt;

  // Format timestamp if available
  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwnMessage
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold mb-1 opacity-70">
            {username}
          </p>
        )}
        <p className="text-sm break-words">{text}</p>
        {timestamp && (
          <p className={`text-xs mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {formatTime(timestamp)}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;