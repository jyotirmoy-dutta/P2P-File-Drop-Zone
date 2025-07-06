import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileTransfer } from './components/FileTransfer';
import { PeerList } from './components/PeerList';
import { TransferHistory } from './components/TransferHistory';
import { Settings } from './components/Settings';
import { useP2PConnection } from './hooks/useP2PConnection';
import { useFileTransfer } from './hooks/useFileTransfer';
import { useTransferHistory } from './hooks/useTransferHistory';
import { useTheme } from './hooks/useTheme';
import { FileInfo, TransferStatus, Peer } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'transfer' | 'peers' | 'history' | 'settings'>('transfer');
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const { theme, toggleTheme } = useTheme();
  const { peers, myPeerId, isConnected, connect, disconnect } = useP2PConnection();
  const { transfers, sendFiles, acceptTransfer, rejectTransfer, cancelTransfer } = useFileTransfer();
  const { history, addToHistory } = useTransferHistory();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const fileInfos: FileInfo[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: 'pending' as TransferStatus
    }));
    
    setSelectedFiles(prev => [...prev, ...fileInfos]);
  }, []);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  // Remove selected file
  const removeSelectedFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Clear all selected files
  const clearSelectedFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  // Send files to peer
  const handleSendFiles = useCallback(async (targetPeerId: string) => {
    if (selectedFiles.length === 0) return;
    
    try {
      await sendFiles(targetPeerId, selectedFiles);
      clearSelectedFiles();
    } catch (error) {
      console.error('Failed to send files:', error);
    }
  }, [selectedFiles, sendFiles, clearSelectedFiles]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`border-b flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0 space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600 text-center sm:text-left">P2P File Drop Zone</h1>
              <div className={`px-2 py-1 rounded-full text-xs ${
                isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              
              {!isConnected ? (
                <button
                  onClick={connect}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={disconnect}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`border-b flex-shrink-0 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-8 overflow-x-auto">
            {[
              { id: 'transfer', label: 'File Transfer', icon: '📁' },
              { id: 'peers', label: 'Peers', icon: '👥' },
              { id: 'history', label: 'History', icon: '📋' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : `border-transparent ${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`
                }`}
              >
                <span className="mr-1 sm:mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-4 sm:py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'transfer' && (
          <div className="space-y-6">
            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800'
                    : 'border-gray-300 bg-white'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-4xl sm:text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium mb-2">Drop files here or click to select</h3>
              <p className={`text-sm px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Drag and drop files to start a transfer, or click the button below
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
              >
                Select Files
              </button>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <h3 className="text-lg font-medium text-center sm:text-left">Selected Files ({selectedFiles.length})</h3>
                    <button
                      onClick={clearSelectedFiles}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="space-y-3">
                    {selectedFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <span className="text-2xl flex-shrink-0">📄</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{file.name}</p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSelectedFile(file.id)}
                          className="text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* File Transfer Component */}
            <FileTransfer
              selectedFiles={selectedFiles}
              peers={peers}
              transfers={transfers}
              onSendFiles={handleSendFiles}
              onAcceptTransfer={acceptTransfer}
              onRejectTransfer={rejectTransfer}
              onCancelTransfer={cancelTransfer}
              theme={theme}
            />
          </div>
        )}

        {activeTab === 'peers' && (
          <PeerList peers={peers} myPeerId={myPeerId} theme={theme} />
        )}

        {activeTab === 'history' && (
          <TransferHistory history={history} theme={theme} />
        )}

        {activeTab === 'settings' && (
          <Settings theme={theme} onThemeToggle={toggleTheme} />
        )}
        </div>
      </main>
    </div>
  );
}

export default App; 