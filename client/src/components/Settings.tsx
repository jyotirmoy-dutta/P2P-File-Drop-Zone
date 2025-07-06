import React, { useState } from 'react';
import { Theme } from '../types';

interface SettingsProps {
  theme: Theme;
  onThemeToggle: () => void;
}

export function Settings({ theme, onThemeToggle }: SettingsProps) {
  const [settings, setSettings] = useState({
    autoAcceptTransfers: false,
    downloadPath: 'Downloads',
    maxFileSize: 1024, // MB
    enableNotifications: true,
    enableSound: true,
    showTransferProgress: true,
    autoConnect: true,
    connectionTimeout: 30, // seconds
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 w-full">
      {/* General Settings */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-center sm:text-left">General Settings</h3>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          {/* Theme Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="font-medium">Theme</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose between light and dark mode
              </p>
            </div>
            <button
              onClick={onThemeToggle}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Auto Connect */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="font-medium">Auto Connect</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Automatically connect to the network on startup
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoConnect}
                onChange={(e) => handleSettingChange('autoConnect', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Connection Timeout */}
          <div>
            <label className={`block text-sm font-medium mb-2 text-center sm:text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Connection Timeout (seconds)
            </label>
            <input
              type="number"
              value={settings.connectionTimeout}
              onChange={(e) => handleSettingChange('connectionTimeout', parseInt(e.target.value))}
              min="5"
              max="120"
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <p className={`text-xs mt-1 text-center sm:text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              How long to wait before considering a connection failed
            </p>
          </div>
        </div>
      </div>

      {/* Transfer Settings */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-center sm:text-left">Transfer Settings</h3>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          {/* Auto Accept Transfers */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="font-medium">Auto Accept Transfers</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Automatically accept incoming file transfers
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoAcceptTransfers}
                onChange={(e) => handleSettingChange('autoAcceptTransfers', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Max File Size */}
          <div>
            <label className={`block text-sm font-medium mb-2 text-center sm:text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Maximum File Size (MB)
            </label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
              min="1"
              max="10240"
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <p className={`text-xs mt-1 text-center sm:text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Maximum file size allowed for transfers (1-10240 MB)
            </p>
          </div>

          {/* Download Path */}
          <div>
            <label className={`block text-sm font-medium mb-2 text-center sm:text-left ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Download Path
            </label>
            <input
              type="text"
              value={settings.downloadPath}
              onChange={(e) => handleSettingChange('downloadPath', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            <p className={`text-xs mt-1 text-center sm:text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Default folder for downloaded files
            </p>
          </div>

          {/* Show Transfer Progress */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="font-medium">Show Transfer Progress</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Display progress bars during file transfers
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showTransferProgress}
                onChange={(e) => handleSettingChange('showTransferProgress', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-center sm:text-left">Notification Settings</h3>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          {/* Enable Notifications */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="font-medium">Enable Notifications</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Show desktop notifications for transfer events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Enable Sound */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="font-medium">Enable Sound</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Play sounds for transfer events
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSound}
                onChange={(e) => handleSettingChange('enableSound', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* About */}
      <div className={`rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-center sm:text-left">About</h3>
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="text-center sm:text-left">
              <p className="font-medium">P2P File Drop Zone</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Version 1.0.0
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <p className="font-medium">Features</p>
              <ul className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} list-disc list-inside space-y-1`}>
                <li>Peer-to-peer file transfer using WebRTC</li>
                <li>End-to-end encryption</li>
                <li>LAN discovery and connection</li>
                <li>Drag and drop interface</li>
                <li>Transfer progress tracking</li>
                <li>Transfer history</li>
                <li>Dark/light theme support</li>
              </ul>
            </div>
            
            <div className="text-center sm:text-left">
              <p className="font-medium">Security</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                All file transfers are encrypted end-to-end and never pass through external servers.
                Files are transferred directly between peers on your local network.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 