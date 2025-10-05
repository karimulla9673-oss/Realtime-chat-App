import React from 'react';
import { ChatProvider, useChatContext } from './context/ChatContext';
import useWebSocket from './hooks/useWebSocket';
import LoginForm from './components/LoginForm';
import ChatHeader from './components/ChatHeader';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';

// ✅ Separate component that uses the context
const ChatApp = () => {
  const { isLoggedIn } = useChatContext();
  
  // ✅ Call useWebSocket only once here
  const { sendMessage, isConnected } = useWebSocket();

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto h-screen flex flex-col p-4">
        <ChatHeader />
        <ChatMessages />
        <ChatInput sendMessage={sendMessage} isConnected={isConnected} />
      </div>
    </div>
  );
};

// ✅ Main App component that provides the context
const App = () => {
  return (
    <ChatProvider>
      <ChatApp />
    </ChatProvider>
  );
};

export default App;