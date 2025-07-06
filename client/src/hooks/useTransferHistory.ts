import { useState, useEffect, useCallback } from 'react';
import { TransferHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'transfer-history';
const MAX_HISTORY_ITEMS = 100;

export function useTransferHistory() {
  const [history, setHistory] = useState<TransferHistoryItem[]>(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          completedAt: item.completedAt ? new Date(item.completedAt) : undefined
        }));
      } catch (error) {
        console.error('Error parsing transfer history:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = useCallback((item: Omit<TransferHistoryItem, 'id'>) => {
    const newItem: TransferHistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };

    setHistory(prev => {
      const updated = [newItem, ...prev];
      // Keep only the latest MAX_HISTORY_ITEMS
      return updated.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getHistoryByType = useCallback((type: 'sent' | 'received') => {
    return history.filter(item => item.type === type);
  }, [history]);

  const getHistoryByPeer = useCallback((peerId: string) => {
    return history.filter(item => item.peerId === peerId);
  }, [history]);

  const getHistoryByStatus = useCallback((status: string) => {
    return history.filter(item => item.status === status);
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryByType,
    getHistoryByPeer,
    getHistoryByStatus
  };
} 