import {
  loadRecords,
  saveRecords,
  loadSettings,
  saveSettings
} from './storage.js';

/**
 * Global application state object managing records, settings, and CRUD operations
 */
export const state = {
  records: loadRecords(),
  settings: loadSettings(),

  /**
   * Save current records to localStorage
   * @returns {boolean}
   */
  saveRecords() {
    return saveRecords(this.records);
  },

  /**
   * Save current settings to localStorage
   * @returns {boolean}
   */
  saveSettings() {
    return saveSettings(this.settings);
  },

  /**
   * Add a new record with a unique ID and timestamps
   * @param {Object} record - Book or note data
   * @returns {boolean} Success status
   */
  addRecord(record) {
    const now = new Date().toISOString();
    const newRecord = {
      ...record,
      id: record.id || createRecordId(),
      createdAt: record.createdAt || now,
      updatedAt: now
    };

    this.records.push(newRecord);
    return this.saveRecords();
  },

  /**
   * Update an existing record by ID
   * @param {string} id - Record ID
   * @param {Object} updatedFields - Fields to update
   * @returns {boolean} Success status
   */
  updateRecord(id, updatedFields) {
    const index = this.records.findIndex(r => r.id === id);
    if (index === -1) return false;

    const oldRecord = this.records[index];
    this.records[index] = {
      ...oldRecord,
      ...updatedFields,
      id: oldRecord.id,
      createdAt: oldRecord.createdAt,
      updatedAt: new Date().toISOString()
    };

    return this.saveRecords();
  },

  /**
   * Delete a record by ID
   * @param {string} id - Record ID
   * @returns {boolean} Success status
   */
  deleteRecord(id) {
    const initialLength = this.records.length;
    this.records = this.records.filter(r => r.id !== id);
    if (this.records.length === initialLength) return false;
    return this.saveRecords();
  },

  /**
   * Update reading goal cap
   * @param {number|string} goal 
   * @returns {boolean} Success status
   */
  updateGoal(goal) {
    const numericGoal = Number(goal);
    if (numericGoal > 0) {
      this.settings.goal = numericGoal;
      return this.saveSettings();
    }
    return false;
  },

  /**
   * Update reading display unit ('pages' | 'minutes')
   * @param {string} unit 
   * @returns {boolean} Success status
   */
  updateUnit(unit) {
    this.settings.unit = unit === 'minutes' ? 'minutes' : 'pages';
    return this.saveSettings();
  },

  /**
   * Replace entire records collection with imported dataset
   * @param {Array} records 
   * @returns {boolean}
   */
  replaceRecords(records) {
    const previous = this.records;
    this.records = [...records];
    if (!this.saveRecords()) {
      this.records = previous;
      return false;
    }
    return true;
  },

  /**
   * Merge imported records into the existing collection
   * @param {Array} importedRecords 
   * @returns {boolean}
   */
  mergeRecords(importedRecords) {
    const existingIds = new Set(this.records.map(r => r.id));
    const merged = importedRecords.map(rec => {
      if (existingIds.has(rec.id)) {
        return {
          ...rec,
          id: createRecordId()
        };
      }
      existingIds.add(rec.id);
      return { ...rec };
    });

    this.records.push(...merged);
    return this.saveRecords();
  }
};

/**
 * Generate a unique record ID in the format rec_YYYYMMDD_XXXX
 * @returns {string} Unique ID
 */
export function createRecordId() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `rec_${timestamp}_${randomPart}`;
}