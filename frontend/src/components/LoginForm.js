import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

const LoginForm = () => {
  const [inputUsername, setInputUsername] = useState('');
  const { login } = useChatContext();

  const handleLogin = () => {
    if (inputUsername.trim()) {
      login(inputUsername.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <MessageCircle className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome to ChatApp
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your username to start chatting
        </p>
        <div className="mb-4">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
        >
          Join Chat
        </button>
      </div>
    </div>
  );
};

export default LoginForm;