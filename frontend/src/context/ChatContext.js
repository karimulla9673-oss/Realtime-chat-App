import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);

  // ✅ Ensure messageHistory is always an array
  const safeSetMessageHistory = useCallback((messages) => {
    setMessageHistory(Array.isArray(messages) ? messages : []);
  }, []);

  // ✅ Memoize functions to prevent recreating on every render
  const addMessage = useCallback((message) => {
    setMessageHistory((prev) => [...prev, message]);
  }, []);

  const login = useCallback((name) => {
    setUsername(name);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUsername('');
    setIsLoggedIn(false);
    setMessageHistory([]);
    setOnlineUsers(0);
  }, []);

  // ✅ Create a stable value object
  const value = {
    username,
    isLoggedIn,
    messageHistory,
    onlineUsers,
    addMessage,
    setMessageHistory,
    setOnlineUsers,
    login,
    logout,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;