// Browser storage keys for records and user settings
const RECORDS_KEY = 'bookVault:data';
const SETTINGS_KEY = 'bookVault:settings';

// Default user settings
const DEFAULT_SETTINGS = {
  goal: 1000,
  unit: 'pages'
};

/**
 * Load all saved records from localStorage
 * @returns {Array} Array of saved book records
 */
export function loadRecords() {
  try {
    const saved = localStorage.getItem(RECORDS_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load records from storage:', error);
    return [];
  }
}

/**
 * Persist records array to localStorage
 * @param {Array} records 
 * @returns {boolean} Success status
 */
export function saveRecords(records) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    return true;
  } catch (error) {
    console.error('Failed to save records to storage:', error);
    return false;
  }
}

/**
 * Load user settings from localStorage
 * @returns {Object} Settings object { goal, unit }
 */
export function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(saved);
    return {
      goal: Number(parsed.goal) > 0 ? Number(parsed.goal) : DEFAULT_SETTINGS.goal,
      unit: parsed.unit === 'minutes' ? 'minutes' : 'pages'
    };
  } catch (error) {
    console.error('Failed to load settings from storage:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Persist user settings to localStorage
 * @param {Object} settings 
 * @returns {boolean} Success status
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings to storage:', error);
    return false;
  }
}

/**
 * Download collection data as a formatted JSON file
 * @param {Array} data 
 */
export function exportJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  link.download = `book-vault-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Export collection data as an RFC 4180 compliant CSV file (Stretch feature)
 * @param {Array} records 
 */
export function exportCSV(records) {
  if (!records || records.length === 0) return;
  const headers = ['id', 'title', 'author', 'pages', 'tag', 'dateAdded', 'createdAt', 'updatedAt'];
  const rows = records.map(record => {
    return headers.map(key => {
      const val = record[key] !== undefined && record[key] !== null ? String(record[key]) : '';
      return `"${val.replace(/"/g, '""')}"`;
    }).join(',');
  });
  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  link.download = `book-vault-backup-${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}