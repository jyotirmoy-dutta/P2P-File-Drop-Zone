import React from 'react';
import { Peer, Theme } from '../types';

interface PeerListProps {
  peers: Peer[];
  myPeerId: string | null;
  theme: Theme;
}

export function PeerList({ peers, myPeerId, theme }: PeerListProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 w-full">
      {/* My Peer Info */}
      {myPeerId && (
        <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-center sm:text-left">My Connection</h3>
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-center sm:text-left">Peer ID: {myPeerId}</p>
                <p className={`text-sm text-center sm:text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Connected and ready for transfers
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connected Peers */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <h3 className="text-lg font-medium text-center sm:text-left">Connected Peers ({peers.length})</h3>
            <div className={`px-2 py-1 rounded-full text-xs ${
              peers.length > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {peers.length > 0 ? 'Active' : 'No peers'}
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {peers.length > 0 ? (
            <div className="space-y-4">
              {peers.map(peer => (
                <div key={peer.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border space-y-3 sm:space-y-0 ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-center sm:text-left">Peer {peer.id}</p>
                      <p className={`text-sm text-center sm:text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        IP: {peer.ip}
                      </p>
                      <p className={`text-xs text-center sm:text-left ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Connected {formatTimeAgo(peer.connectedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                    {peer.room && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Room: {peer.room}
                      </span>
                    )}
                    
                    <button
                      className={`px-3 py-1 rounded text-sm ${
                        theme === 'dark' 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      Send Files
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 sm:py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-4xl sm:text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium mb-2">No Peers Connected</h3>
              <p className="px-4">Other users on the same network will appear here when they connect.</p>
              <p className="text-sm mt-2 px-4">Make sure they're running the same application.</p>
            </div>
          )}
        </div>
      </div>

      {/* Network Info */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium">Network Information</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Peers</p>
              <p className="text-2xl font-bold">{peers.length + (myPeerId ? 1 : 0)}</p>
            </div>
            
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Network Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Connection Type</p>
              <p className="text-lg">P2P WebRTC</p>
            </div>
            
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Security</p>
              <p className="text-lg">End-to-End Encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 