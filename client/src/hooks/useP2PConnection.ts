import { useState, useEffect, useCallback } from 'react';
import { Peer, SignalingMessage } from '../types';

const SIGNALING_SERVER_URL = 'ws://localhost:3001';

export function useP2PConnection() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connect = useCallback(() => {
    try {
      const websocket = new WebSocket(SIGNALING_SERVER_URL);
      
      websocket.onopen = () => {
        console.log('Connected to signaling server');
        setIsConnected(true);
        setConnectionError(null);
      };

      websocket.onmessage = (event) => {
        try {
          const message: SignalingMessage = JSON.parse(event.data);
          handleSignalingMessage(message);
        } catch (error) {
          console.error('Error parsing signaling message:', error);
        }
      };

      websocket.onclose = () => {
        console.log('Disconnected from signaling server');
        setIsConnected(false);
        setMyPeerId(null);
        setPeers([]);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Failed to connect to signaling server');
        setIsConnected(false);
      };

      setWs(websocket);
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionError('Failed to create connection');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
    }
  }, [ws]);

  const sendMessage = useCallback((message: SignalingMessage) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }, [ws]);

  const handleSignalingMessage = useCallback((message: SignalingMessage) => {
    switch (message.type) {
      case 'peer-id':
        setMyPeerId(message.peerId);
        break;
      
      case 'peers-list':
        setPeers(message.peers.map(peer => ({
          ...peer,
          connectedAt: new Date()
        })));
        break;
      
      case 'peer-disconnected':
        setPeers(prev => prev.filter(p => p.id !== message.peerId));
        break;
      
      case 'peer-joined-room':
        // Handle peer joining room
        break;
      
      case 'peer-left-room':
        // Handle peer leaving room
        break;
      
      default:
        console.log('Unknown signaling message type:', message.type);
    }
  }, []);

  // Auto-reconnect on connection loss
  useEffect(() => {
    if (!isConnected && !ws) {
      const timer = setTimeout(() => {
        connect();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, ws, connect]);

  return {
    isConnected,
    myPeerId,
    peers,
    connectionError,
    connect,
    disconnect,
    sendMessage
  };
} 