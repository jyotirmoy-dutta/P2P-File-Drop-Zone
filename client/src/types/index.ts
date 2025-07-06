export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  status: TransferStatus;
  progress?: number;
  error?: string;
}

export type TransferStatus = 'pending' | 'transferring' | 'completed' | 'failed' | 'cancelled' | 'paused';

export interface Peer {
  id: string;
  ip: string;
  connectedAt: Date;
  room?: string;
}

export interface Transfer {
  id: string;
  fromPeerId: string;
  toPeerId: string;
  files: FileInfo[];
  status: TransferStatus;
  createdAt: Date;
  completedAt?: Date;
  progress: number;
  totalSize: number;
  transferredSize: number;
}

export interface TransferHistoryItem {
  id: string;
  type: 'sent' | 'received';
  peerId: string;
  files: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  status: TransferStatus;
  createdAt: Date;
  completedAt?: Date;
}

export interface WebRTCMessage {
  type: string;
  [key: string]: any;
}

export interface SignalingMessage extends WebRTCMessage {
  fromPeerId?: string;
  targetPeerId?: string;
}

export interface FileTransferRequest {
  type: 'transfer-request';
  fromPeerId: string;
  files: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  transferId: string;
}

export interface FileTransferResponse {
  type: 'transfer-accept' | 'transfer-reject';
  fromPeerId: string;
  transferId: string;
  reason?: string;
}

export interface WebRTCOffer {
  type: 'offer';
  fromPeerId: string;
  offer: RTCSessionDescriptionInit;
}

export interface WebRTCAnswer {
  type: 'answer';
  fromPeerId: string;
  answer: RTCSessionDescriptionInit;
}

export interface ICECandidate {
  type: 'ice-candidate';
  fromPeerId: string;
  candidate: RTCIceCandidateInit;
}

export type Theme = 'light' | 'dark';

export interface Settings {
  theme: Theme;
  autoAcceptTransfers: boolean;
  downloadPath: string;
  maxFileSize: number;
  enableNotifications: boolean;
} 