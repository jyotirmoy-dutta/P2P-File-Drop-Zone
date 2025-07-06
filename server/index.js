import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Enable CORS
app.use(cors());
app.use(express.json());

// Store connected peers
const peers = new Map();
const rooms = new Map();

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  const peerId = generatePeerId();
  const clientIp = req.socket.remoteAddress;
  
  console.log(`New peer connected: ${peerId} from ${clientIp}`);
  
  // Store peer info
  peers.set(peerId, {
    ws,
    id: peerId,
    ip: clientIp,
    room: null,
    connectedAt: new Date()
  });
  
  // Send peer their ID
  ws.send(JSON.stringify({
    type: 'peer-id',
    peerId: peerId
  }));
  
  // Send list of available peers
  const availablePeers = Array.from(peers.values())
    .filter(p => p.id !== peerId)
    .map(p => ({ id: p.id, ip: p.ip }));
  
  ws.send(JSON.stringify({
    type: 'peers-list',
    peers: availablePeers
  }));
  
  // Handle messages
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      handleMessage(peerId, message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log(`Peer disconnected: ${peerId}`);
    const peer = peers.get(peerId);
    if (peer && peer.room) {
      leaveRoom(peerId, peer.room);
    }
    peers.delete(peerId);
    
    // Notify other peers
    broadcastToPeers({
      type: 'peer-disconnected',
      peerId: peerId
    }, peerId);
  });
  
  ws.on('error', (error) => {
    console.error(`WebSocket error for peer ${peerId}:`, error);
  });
});

// Handle different message types
function handleMessage(peerId, message) {
  const peer = peers.get(peerId);
  if (!peer) return;
  
  switch (message.type) {
    case 'offer':
      forwardToPeer(message.targetPeerId, {
        type: 'offer',
        fromPeerId: peerId,
        offer: message.offer
      });
      break;
      
    case 'answer':
      forwardToPeer(message.targetPeerId, {
        type: 'answer',
        fromPeerId: peerId,
        answer: message.answer
      });
      break;
      
    case 'ice-candidate':
      forwardToPeer(message.targetPeerId, {
        type: 'ice-candidate',
        fromPeerId: peerId,
        candidate: message.candidate
      });
      break;
      
    case 'transfer-request':
      forwardToPeer(message.targetPeerId, {
        type: 'transfer-request',
        fromPeerId: peerId,
        files: message.files,
        transferId: message.transferId
      });
      break;
      
    case 'transfer-accept':
      forwardToPeer(message.targetPeerId, {
        type: 'transfer-accept',
        fromPeerId: peerId,
        transferId: message.transferId
      });
      break;
      
    case 'transfer-reject':
      forwardToPeer(message.targetPeerId, {
        type: 'transfer-reject',
        fromPeerId: peerId,
        transferId: message.transferId,
        reason: message.reason
      });
      break;
      
    case 'join-room':
      joinRoom(peerId, message.roomId);
      break;
      
    case 'leave-room':
      leaveRoom(peerId, message.roomId);
      break;
      
    default:
      console.log(`Unknown message type: ${message.type}`);
  }
}

// Forward message to specific peer
function forwardToPeer(targetPeerId, message) {
  const targetPeer = peers.get(targetPeerId);
  if (targetPeer && targetPeer.ws.readyState === 1) {
    targetPeer.ws.send(JSON.stringify(message));
  }
}

// Broadcast to all peers except sender
function broadcastToPeers(message, excludePeerId = null) {
  peers.forEach((peer, peerId) => {
    if (peerId !== excludePeerId && peer.ws.readyState === 1) {
      peer.ws.send(JSON.stringify(message));
    }
  });
}

// Room management
function joinRoom(peerId, roomId) {
  const peer = peers.get(peerId);
  if (!peer) return;
  
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  
  peer.room = roomId;
  rooms.get(roomId).add(peerId);
  
  // Notify room members
  rooms.get(roomId).forEach(memberId => {
    if (memberId !== peerId) {
      forwardToPeer(memberId, {
        type: 'peer-joined-room',
        peerId: peerId,
        roomId: roomId
      });
    }
  });
}

function leaveRoom(peerId, roomId) {
  const peer = peers.get(peerId);
  if (!peer) return;
  
  const room = rooms.get(roomId);
  if (room) {
    room.delete(peerId);
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  }
  
  peer.room = null;
  
  // Notify remaining room members
  if (room) {
    room.forEach(memberId => {
      forwardToPeer(memberId, {
        type: 'peer-left-room',
        peerId: peerId,
        roomId: roomId
      });
    });
  }
}

// Generate unique peer ID
function generatePeerId() {
  return Math.random().toString(36).substr(2, 9);
}

// REST API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    peers: peers.size,
    rooms: rooms.size,
    uptime: process.uptime()
  });
});

app.get('/api/peers', (req, res) => {
  const peersList = Array.from(peers.values()).map(peer => ({
    id: peer.id,
    ip: peer.ip,
    connectedAt: peer.connectedAt,
    room: peer.room
  }));
  res.json(peersList);
});

app.get('/api/rooms', (req, res) => {
  const roomsList = Array.from(rooms.entries()).map(([roomId, members]) => ({
    id: roomId,
    members: Array.from(members)
  }));
  res.json(roomsList);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 P2P File Drop Zone - Signaling Server`);
  console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
  console.log(`🌐 HTTP server running on http://localhost:${PORT}`);
  console.log(`📊 Connected peers: ${peers.size}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  wss.close();
  server.close();
  process.exit(0);
}); 