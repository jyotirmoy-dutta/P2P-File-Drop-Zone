import React, { useState } from 'react';
import { FileInfo, Peer, Transfer, Theme } from '../types';

interface FileTransferProps {
  selectedFiles: FileInfo[];
  peers: Peer[];
  transfers: Transfer[];
  onSendFiles: (peerId: string) => void;
  onAcceptTransfer: (transferId: string) => void;
  onRejectTransfer: (transferId: string, reason?: string) => void;
  onCancelTransfer: (transferId: string) => void;
  theme: Theme;
}

export function FileTransfer({
  selectedFiles,
  peers,
  transfers,
  onSendFiles,
  onAcceptTransfer,
  onRejectTransfer,
  onCancelTransfer,
  theme
}: FileTransferProps) {
  const [selectedPeer, setSelectedPeer] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'cancelled':
        return 'text-gray-600';
      case 'transferring':
        return 'text-blue-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '⏹️';
      case 'transferring':
        return '📤';
      case 'paused':
        return '⏸️';
      default:
        return '⏳';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 w-full">
      {/* Send Files Section */}
      {selectedFiles.length > 0 && peers.length > 0 && (
        <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-center sm:text-left">Send Files to Peer</h3>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedPeer}
                onChange={(e) => setSelectedPeer(e.target.value)}
                className={`w-full sm:flex-1 px-3 py-2 border rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select a peer...</option>
                {peers.map(peer => (
                  <option key={peer.id} value={peer.id}>
                    {peer.id} ({peer.ip})
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => selectedPeer && onSendFiles(selectedPeer)}
                disabled={!selectedPeer}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
              >
                Send Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Transfers */}
      {transfers.length > 0 && (
        <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-center sm:text-left">Active Transfers ({transfers.length})</h3>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {transfers.map(transfer => (
                <div key={transfer.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(transfer.status)}</span>
                      <div>
                        <p className="font-medium text-center sm:text-left">
                          {transfer.status === 'transferring' ? 'Transferring...' : 
                           transfer.status === 'completed' ? 'Transfer Complete' :
                           transfer.status === 'failed' ? 'Transfer Failed' :
                           transfer.status === 'cancelled' ? 'Transfer Cancelled' :
                           'Transfer Pending'}
                        </p>
                        <p className={`text-sm text-center sm:text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {transfer.files.length} file(s) • {formatFileSize(transfer.totalSize)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                      {transfer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onAcceptTransfer(transfer.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onRejectTransfer(transfer.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {transfer.status === 'transferring' && (
                        <button
                          onClick={() => onCancelTransfer(transfer.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {transfer.status === 'transferring' && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{formatFileSize(transfer.transferredSize)} / {formatFileSize(transfer.totalSize)}</span>
                        <span>{transfer.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${transfer.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* File List */}
                  <div className="space-y-2">
                    {transfer.files.map(file => (
                      <div key={file.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span>📄</span>
                          <span className="truncate">{file.name}</span>
                        </div>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Transfer Info */}
                  <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between text-xs">
                      <span>From: {transfer.fromPeerId}</span>
                      <span>To: {transfer.toPeerId}</span>
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Started: {transfer.createdAt.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Transfers Message */}
      {transfers.length === 0 && selectedFiles.length === 0 && (
        <div className={`text-center py-8 sm:py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="text-4xl sm:text-6xl mb-4">📤</div>
          <h3 className="text-lg font-medium mb-2">No Active Transfers</h3>
          <p className="px-4">Select files and choose a peer to start transferring files.</p>
        </div>
      )}
    </div>
  );
} 