import React, { useState } from 'react';
import { TransferHistoryItem, Theme } from '../types';

interface TransferHistoryProps {
  history: TransferHistoryItem[];
  theme: Theme;
}

export function TransferHistory({ history, theme }: TransferHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredHistory = history.filter(item => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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

  const totalSent = history.filter(item => item.type === 'sent').length;
  const totalReceived = history.filter(item => item.type === 'received').length;
  const totalCompleted = history.filter(item => item.status === 'completed').length;

  return (
    <div className="space-y-6 w-full">
      {/* Statistics */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-center sm:text-left">Transfer Statistics</h3>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalSent}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Files Sent</p>
            </div>
            
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-green-600">{totalReceived}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Files Received</p>
            </div>
            
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{totalCompleted}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-center sm:text-left">Transfer History</h3>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <label className={`block text-sm font-medium mb-2 text-center sm:text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Transfers</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
              </select>
            </div>
            
            <div className="flex-1 min-w-0">
              <label className={`block text-sm font-medium mb-2 text-center sm:text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="transferring">Transferring</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* History List */}
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map(item => (
                <div key={item.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{getStatusIcon(item.status)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-center sm:text-left">
                          {item.type === 'sent' ? 'Sent to' : 'Received from'} Peer {item.peerId}
                        </p>
                        <p className={`text-sm text-center sm:text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.files.length} file(s) • {formatFileSize(item.files.reduce((sum, file) => sum + file.size, 0))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-right w-full sm:w-auto">
                      <p className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* File List */}
                  <div className="space-y-2">
                    {item.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
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
                  
                  {item.completedAt && (
                    <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Completed: {formatDate(item.completedAt)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 sm:py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-4xl sm:text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No Transfer History</h3>
              <p className="px-4">Your file transfer history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 