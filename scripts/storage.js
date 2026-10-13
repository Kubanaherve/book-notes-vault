const KEY = 'bookVault:data';
const SETTINGS_KEY = 'bookVault:settings';

export const loadRecords = () => JSON.parse(localStorage.getItem(KEY) || '[]');
export const saveRecords = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const loadSettings = () => JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{"goal": 1000, "unit": "pages"}');
export const saveSettings = (settings) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

export function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vault-backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

import { loadRecords, saveRecords, loadSettings, saveSettings } from './storage.js';

export const state = {
  records: loadRecords(),
  settings: loadSettings(),
  
  addRecord(record) {
    record.id = 'rec_' + Date.now();
    record.createdAt = new Date().toISOString();
    record.updatedAt = record.createdAt;
    this.records.push(record);
    saveRecords(this.records);
  },
  
  updateRecord(id, updatedFields) {
    const index = this.records.findIndex(r => r.id === id);
    if (index !== -1) {
      this.records[index] = { ...this.records[index], ...updatedFields, updatedAt: new Date().toISOString() };
      saveRecords(this.records);
    }
  },
  
  deleteRecord(id) {
    this.records = this.records.filter(r => r.id !== id);
    saveRecords(this.records);
  },

  updateGoal(goal) {
    this.settings.goal = goal;
    saveSettings(this.settings);
  },

  updateUnit(unit) {
    this.settings.unit = unit;
    saveSettings(this.settings);
  }
};

