import { TestHistoryItem, TestResult } from '@/types';

const STORAGE_KEY = 'mbti_test_history';
const MAX_HISTORY = 10;

export function loadHistory(): TestHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const history = JSON.parse(saved);
      return Array.isArray(history) ? history : [];
    }
  } catch (err) {
    console.error('加载历史记录失败:', err);
  }
  return [];
}

export function saveToHistory(result: TestResult): TestHistoryItem {
  const history = loadHistory();
  
  const newItem: TestHistoryItem = {
    ...result,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  
  history.unshift(newItem);
  
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('保存历史记录失败:', err);
  }
  
  return newItem;
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('清除历史记录失败:', err);
  }
}

export function deleteHistoryItem(itemId: string): void {
  const history = loadHistory();
  const filtered = history.filter(item => item.id !== itemId);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('删除历史记录失败:', err);
  }
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hour}:${minute}`;
  }
}

export function getHistoryStats(): { total: number; typeDistribution: Record<string, number> } {
  const history = loadHistory();
  const distribution: Record<string, number> = {};
  
  history.forEach(item => {
    distribution[item.type] = (distribution[item.type] || 0) + 1;
  });
  
  return {
    total: history.length,
    typeDistribution: distribution,
  };
}
