import { useEffect, useRef } from 'react';
import { useChatContext } from '../context/ChatContext';
import MessageBubble from './MessageBubble';

const ChatMessages = () => {
  const { messageHistory, username } = useChatContext();
  const messagesEndRef = useRef(null);

  // ✅ Safely handle messageHistory - ensure it's always an array
  const messages = Array.isArray(messageHistory) ? messageHistory : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={msg._id || msg.id || index}
            message={msg}
            isOwnMessage={msg.username === username}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;