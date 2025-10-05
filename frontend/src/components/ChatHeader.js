import React from 'react';
import { MessageCircle, User } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

const ChatHeader = () => {
  const { username, onlineUsers } = useChatContext();

  return (
    <div className="bg-white rounded-t-2xl shadow-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MessageCircle className="w-8 h-8 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
          <p className="text-sm text-gray-500">{onlineUsers} online</p>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
        <User className="w-5 h-5 text-indigo-600" />
        <span className="font-semibold text-gray-700">{username}</span>
      </div>
    </div>
  );
};

export default ChatHeader;