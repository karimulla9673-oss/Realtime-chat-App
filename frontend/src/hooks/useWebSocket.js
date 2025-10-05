import { useEffect, useRef, useState, useCallback } from 'react';
import { useChatContext } from '../context/ChatContext';

const useWebSocket = () => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const {
    username,
    isLoggedIn,
    addMessage,
    setMessageHistory,
    setOnlineUsers,
  } = useChatContext();

  // ✅ Get WebSocket URL with proper fallback
  const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';

  // ✅ Memoize the message handler to prevent recreating it
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.type === 'history') {
        setMessageHistory(data.messages);
      } else if (data.type === 'message') {
        addMessage(data.message);
      } else if (data.type === 'users') {
        setOnlineUsers(data.count);
      }
    } catch (error) {
      console.error('⚠️ Error parsing message:', error);
    }
  }, [addMessage, setMessageHistory, setOnlineUsers]);

  useEffect(() => {
    if (!isLoggedIn || !username) {
      return;
    }

    // Prevent multiple simultaneous connection attempts
    if (isConnectingRef.current) {
      return;
    }

    // Reset reconnect attempts when starting fresh
    reconnectAttemptsRef.current = 0;

    const connect = () => {
      // Stop if max attempts reached
      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.error('🚫 Max reconnection attempts reached');
        isConnectingRef.current = false;
        return;
      }

      // Prevent multiple connections
      if (isConnectingRef.current) {
        return;
      }

      isConnectingRef.current = true;

      // Close any existing connection
      if (wsRef.current) {
        wsRef.current.close();
      }

      console.log(`🔌 Connecting to ${WS_URL}...`);
      const websocket = new WebSocket(WS_URL);

      websocket.onopen = () => {
        console.log('✅ Connected to server');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
        websocket.send(JSON.stringify({ type: 'join', username }));
      };

      websocket.onmessage = handleMessage;

      websocket.onerror = (error) => {
        console.error('⚠️ WebSocket error:', error);
        isConnectingRef.current = false;
      };

      websocket.onclose = (event) => {
        console.log('❌ Disconnected from server', event.code, event.reason);
        setIsConnected(false);
        isConnectingRef.current = false;

        // Only attempt reconnection if not a clean close and haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `🔄 Reconnection attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS} in ${RECONNECT_DELAY}ms`
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        }
      };

      wsRef.current = websocket;
    };

    // Initial connection
    connect();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (wsRef.current) {
        // Set to max attempts to prevent reconnection during cleanup
        reconnectAttemptsRef.current = MAX_RECONNECT_ATTEMPTS;
        wsRef.current.onclose = null; // Remove onclose handler to prevent reconnection
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
      
      isConnectingRef.current = false;
    };
  }, [isLoggedIn, username, WS_URL, handleMessage]);

  // ✅ Send message helper - memoized to prevent recreating
  const sendMessage = useCallback((text) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message',
          text,
          username,
        })
      );
      return true;
    }
    console.warn('⚠️ WebSocket is not connected');
    return false;
  }, [username]);

  return { 
    sendMessage, 
    isConnected, 
    reconnectAttempts: reconnectAttemptsRef.current 
  };
};

export default useWebSocket;