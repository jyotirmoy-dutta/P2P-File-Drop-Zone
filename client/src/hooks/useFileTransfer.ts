import { useState, useCallback } from 'react';
import { FileInfo, Transfer, TransferStatus } from '../types';

export function useFileTransfer() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());

  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to peer via signaling server
        console.log('Sending ICE candidate to peer:', peerId);
      }
    };

    // Handle data channel
    pc.ondatachannel = (event) => {
      const dataChannel = event.channel;
      handleDataChannel(dataChannel, peerId);
    };

    setPeerConnections(prev => new Map(prev).set(peerId, pc));
    return pc;
  }, []);

  const handleDataChannel = useCallback((dataChannel: RTCDataChannel, peerId: string) => {
    dataChannel.onopen = () => {
      console.log('Data channel opened with peer:', peerId);
    };

    dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleDataChannelMessage(message, dataChannel, peerId);
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };

    dataChannel.onclose = () => {
      console.log('Data channel closed with peer:', peerId);
    };
  }, []);

  const handleDataChannelMessage = useCallback((message: any, dataChannel: RTCDataChannel, peerId: string) => {
    switch (message.type) {
      case 'file-transfer-start':
        handleFileTransferStart(message, dataChannel, peerId);
        break;
      
      case 'file-chunk':
        handleFileChunk(message, dataChannel, peerId);
        break;
      
      case 'file-transfer-complete':
        handleFileTransferComplete(message, peerId);
        break;
      
      default:
        console.log('Unknown data channel message type:', message.type);
    }
  }, []);

  const handleFileTransferStart = useCallback((message: any, dataChannel: RTCDataChannel, peerId: string) => {
    const transfer: Transfer = {
      id: message.transferId,
      fromPeerId: peerId,
      toPeerId: 'me', // Will be replaced with actual peer ID
      files: message.files.map((file: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: new File([], file.name), // Placeholder
        status: 'pending' as TransferStatus
      })),
      status: 'transferring',
      createdAt: new Date(),
      progress: 0,
      totalSize: message.files.reduce((sum: number, file: any) => sum + file.size, 0),
      transferredSize: 0
    };

    setTransfers(prev => [...prev, transfer]);
  }, []);

  const handleFileChunk = useCallback((message: any, dataChannel: RTCDataChannel, peerId: string) => {
    // Handle incoming file chunks
    setTransfers(prev => prev.map(transfer => {
      if (transfer.id === message.transferId) {
        return {
          ...transfer,
          transferredSize: transfer.transferredSize + message.chunkSize,
          progress: Math.round((transfer.transferredSize + message.chunkSize) / transfer.totalSize * 100)
        };
      }
      return transfer;
    }));
  }, []);

  const handleFileTransferComplete = useCallback((message: any, peerId: string) => {
    setTransfers(prev => prev.map(transfer => {
      if (transfer.id === message.transferId) {
        return {
          ...transfer,
          status: 'completed' as TransferStatus,
          completedAt: new Date(),
          progress: 100
        };
      }
      return transfer;
    }));
  }, []);

  const sendFiles = useCallback(async (targetPeerId: string, files: FileInfo[]) => {
    const pc = createPeerConnection(targetPeerId);
    
    // Create data channel
    const dataChannel = pc.createDataChannel('fileTransfer');
    
    dataChannel.onopen = async () => {
      console.log('Data channel opened, starting file transfer');
      
      const transferId = Math.random().toString(36).substr(2, 9);
      const transfer: Transfer = {
        id: transferId,
        fromPeerId: 'me', // Will be replaced with actual peer ID
        toPeerId: targetPeerId,
        files,
        status: 'transferring',
        createdAt: new Date(),
        progress: 0,
        totalSize: files.reduce((sum, file) => sum + file.size, 0),
        transferredSize: 0
      };

      setTransfers(prev => [...prev, transfer]);

      // Send transfer start message
      dataChannel.send(JSON.stringify({
        type: 'file-transfer-start',
        transferId,
        files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
      }));

      // Send files in chunks
      for (const file of files) {
        await sendFileInChunks(file, dataChannel, transferId);
      }

      // Send transfer complete message
      dataChannel.send(JSON.stringify({
        type: 'file-transfer-complete',
        transferId
      }));
    };

    // Create and send offer
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    // Send offer via signaling server (this would be implemented in the signaling hook)
    console.log('Sending offer to peer:', targetPeerId);
  }, [createPeerConnection]);

  const sendFileInChunks = useCallback(async (file: FileInfo, dataChannel: RTCDataChannel, transferId: string) => {
    const chunkSize = 16384; // 16KB chunks
    const fileReader = new FileReader();
    let offset = 0;

    return new Promise<void>((resolve, reject) => {
      fileReader.onload = (e) => {
        const chunk = e.target?.result as ArrayBuffer;
        dataChannel.send(JSON.stringify({
          type: 'file-chunk',
          transferId,
          fileName: file.name,
          chunk: Array.from(new Uint8Array(chunk)),
          chunkSize: chunk.byteLength,
          offset
        }));

        offset += chunk.byteLength;

        if (offset < file.size) {
          // Read next chunk
          const slice = file.file.slice(offset, offset + chunkSize);
          fileReader.readAsArrayBuffer(slice);
        } else {
          resolve();
        }
      };

      fileReader.onerror = reject;

      // Start reading first chunk
      const slice = file.file.slice(0, chunkSize);
      fileReader.readAsArrayBuffer(slice);
    });
  }, []);

  const acceptTransfer = useCallback((transferId: string) => {
    setTransfers(prev => prev.map(transfer => {
      if (transfer.id === transferId) {
        return { ...transfer, status: 'transferring' as TransferStatus };
      }
      return transfer;
    }));
  }, []);

  const rejectTransfer = useCallback((transferId: string, reason?: string) => {
    setTransfers(prev => prev.map(transfer => {
      if (transfer.id === transferId) {
        return { ...transfer, status: 'failed' as TransferStatus };
      }
      return transfer;
    }));
  }, []);

  const cancelTransfer = useCallback((transferId: string) => {
    setTransfers(prev => prev.map(transfer => {
      if (transfer.id === transferId) {
        return { ...transfer, status: 'cancelled' as TransferStatus };
      }
      return transfer;
    }));
  }, []);

  return {
    transfers,
    sendFiles,
    acceptTransfer,
    rejectTransfer,
    cancelTransfer
  };
} 