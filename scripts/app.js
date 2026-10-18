import { state } from './state.js';
import {
  validateRecord,
  isValidImportedRecord
} from './validators.js';
import {
  compileRegex,
  matchesRecord
} from './search.js';
import {
  exportJSON,
  exportCSV
} from './storage.js';
import {
  renderTable,
  updateStats,
  announce
} from './ui.js';

// Application runtime variables
let currentEditId = null;
let currentInlineEditId = null;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch seed data if localStorage is empty
  if (!state.records || state.records.length === 0) {
    try {
      const response = await fetch('./seed.json');
      if (response.ok) {
        const seedData = await response.json();
        if (Array.isArray(seedData) && seedData.length > 0) {
          state.replaceRecords(seedData);
        }
      }
    } catch (error) {
      console.warn('Could not auto-load seed data from network/disk:', error);
    }
  }

  // 2. Initialize Settings values in the DOM
  const goalInput = document.getElementById('page-goal');
  const unitToggle = document.getElementById('unit-toggle');
  if (goalInput && state.settings?.goal) {
    goalInput.value = state.settings.goal;
  }
  if (unitToggle && state.settings?.unit) {
    unitToggle.value = state.settings.unit;
  }

  // 3. Initialize Light/Dark Theme
  initTheme();

  // 4. Initial UI render
  refreshUI();

  // 5. Register Service Worker for offline-first capability (Stretch)
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('Service Worker skipped:', err);
    });
  }
});

// ---------------------------------------------------------
// Theme Toggle Functionality (Stretch)
// ---------------------------------------------------------
function initTheme() {
  const savedTheme = localStorage.getItem('bookVault:theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(activeTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      localStorage.setItem('bookVault:theme', nextTheme);
      announce(`Switched to ${nextTheme} theme.`);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    const icon = themeToggle.querySelector('.theme-icon');
    const label = themeToggle.querySelector('.theme-label');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  }
}

// ---------------------------------------------------------
// Form Validation & Record Saving (Add / Edit)
// ---------------------------------------------------------
const form = document.getElementById('record-form');

if (form) {
  // Real-time validation feedback on user input
  const inputFields = ['title', 'author', 'pages', 'tag', 'dateAdded'];
  inputFields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (!input) return;

    input.addEventListener('input', () => {
      clearFieldError(fieldId);
    });

    input.addEventListener('blur', () => {
      validateSingleField(fieldId);
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    const bookData = {
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      pages: document.getElementById('pages').value.trim(),
      tag: document.getElementById('tag').value.trim(),
      dateAdded: document.getElementById('dateAdded').value.trim()
    };

    // Run comprehensive validation
    const errors = validateRecord(bookData);

    // Clear old errors
    clearAllErrors();

    if (Object.keys(errors).length > 0) {
      displayFormErrors(errors);
      announce('Please fix the errors in the form before submitting.', 'assertive');
      return;
    }

    if (currentEditId) {
      // Update existing record
      state.updateRecord(currentEditId, bookData);
      announce(`Updated "${bookData.title}" successfully.`);
      cancelFormEdit();
    } else {
      // Add brand new record
      state.addRecord(bookData);
      announce(`Added "${bookData.title}" to your vault.`);
      form.reset();
      clearAllErrors();
    }

    refreshUI();
  });
}

function validateSingleField(fieldId) {
  const input = document.getElementById(fieldId);
  if (!input) return;

  const currentValues = {
    title: document.getElementById('title')?.value || '',
    author: document.getElementById('author')?.value || '',
    pages: document.getElementById('pages')?.value || '',
    tag: document.getElementById('tag')?.value || '',
    dateAdded: document.getElementById('dateAdded')?.value || ''
  };

  const errors = validateRecord(currentValues);
  if (errors[fieldId]) {
    setFieldError(fieldId, errors[fieldId]);
  } else {
    clearFieldError(fieldId);
  }
}

function setFieldError(fieldId, message) {
  const errorSpan = document.getElementById(`${fieldId}-error`);
  const input = document.getElementById(fieldId);
  if (errorSpan) errorSpan.textContent = message;
  if (input) {
    input.classList.add('invalid-input');
    input.setAttribute('aria-invalid', 'true');
  }
}

function clearFieldError(fieldId) {
  const errorSpan = document.getElementById(`${fieldId}-error`);
  const input = document.getElementById(fieldId);
  if (errorSpan) errorSpan.textContent = '';
  if (input) {
    input.classList.remove('invalid-input');
    input.removeAttribute('aria-invalid');
  }
}

function clearAllErrors() {
  document.querySelectorAll('.error-message').forEach(span => {
    span.textContent = '';
  });
  document.querySelectorAll('input, select').forEach(el => {
    el.classList.remove('invalid-input');
    el.removeAttribute('aria-invalid');
  });
}

function displayFormErrors(errors) {
  for (const field in errors) {
    setFieldError(field, errors[field]);
  }
  const firstErrorField = Object.keys(errors)[0];
  const el = document.getElementById(firstErrorField);
  if (el) el.focus();
}

// Cancel Edit Button
const cancelEditBtn = document.getElementById('cancel-edit');
if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => {
    cancelFormEdit();
    announce('Edit cancelled.');
  });
}

function cancelFormEdit() {
  currentEditId = null;
  if (form) form.reset();
  clearAllErrors();
  if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
  const saveBtn = document.getElementById('save-record-btn');
  if (saveBtn) saveBtn.textContent = 'Save Entry';
}

// ---------------------------------------------------------
// Table Actions (Edit, Delete, Inline Edit)
// ---------------------------------------------------------
const tableBody = document.getElementById('records-body');
if (tableBody) {
  tableBody.addEventListener('click', event => {
    const target = event.target;
    const recordId = target.dataset.id || target.closest('[data-id]')?.dataset.id;
    if (!recordId) return;

    // Delete record action
    if (target.classList.contains('btn-delete')) {
      const record = state.records.find(r => r.id === recordId);
      const title = record ? `"${record.title}"` : 'this record';
      if (confirm(`Are you sure you want to delete ${title}?`)) {
        state.deleteRecord(recordId);
        announce(`Deleted ${title}.`, 'assertive');
        refreshUI();
      }
      return;
    }

    // Standard Form Edit action
    if (target.classList.contains('btn-edit')) {
      const record = state.records.find(r => r.id === recordId);
      if (!record) return;

      currentEditId = record.id;
      currentInlineEditId = null; // Close any inline edit

      document.getElementById('title').value = record.title;
      document.getElementById('author').value = record.author;
      document.getElementById('pages').value = record.pages;
      document.getElementById('tag').value = record.tag;
      document.getElementById('dateAdded').value = record.dateAdded;

      if (cancelEditBtn) cancelEditBtn.classList.remove('hidden');
      const saveBtn = document.getElementById('save-record-btn');
      if (saveBtn) saveBtn.textContent = 'Update Entry';

      clearAllErrors();

      const formSection = document.getElementById('form-section');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          document.getElementById('title')?.focus();
        }, 300);
      }
      announce(`Editing "${record.title}". The form has been populated.`);
      return;
    }

    // Save inline edit action
    if (target.classList.contains('btn-save-inline')) {
      const titleInput = document.getElementById(`inline-title-${recordId}`);
      const authorInput = document.getElementById(`inline-author-${recordId}`);
      const pagesInput = document.getElementById(`inline-pages-${recordId}`);
      const tagInput = document.getElementById(`inline-tag-${recordId}`);
      const dateInput = document.getElementById(`inline-date-${recordId}`);

      const candidate = {
        title: titleInput ? titleInput.value.trim() : '',
        author: authorInput ? authorInput.value.trim() : '',
        pages: pagesInput ? pagesInput.value.trim() : '',
        tag: tagInput ? tagInput.value.trim() : '',
        dateAdded: dateInput ? dateInput.value.trim() : ''
      };

      const errors = validateRecord(candidate);
      if (Object.keys(errors).length > 0) {
        const firstMessage = Object.values(errors)[0];
        alert(`Validation error: ${firstMessage}`);
        return;
      }

      state.updateRecord(recordId, candidate);
      currentInlineEditId = null;
      announce(`Saved changes to "${candidate.title}".`);
      refreshUI();
      return;
    }

    // Cancel inline edit action
    if (target.classList.contains('btn-cancel-inline')) {
      currentInlineEditId = null;
      announce('Inline edit cancelled.');
      refreshUI();
      return;
    }
  });

  // Keyboard shortcut inside inline editing row: Enter or Ctrl+Enter saves, Esc cancels
  tableBody.addEventListener('keydown', event => {
    if (event.key === 'Escape' && currentInlineEditId) {
      currentInlineEditId = null;
      announce('Inline edit cancelled.');
      refreshUI();
      return;
    }
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey) && currentInlineEditId) {
      const saveBtn = tableBody.querySelector(`.btn-save-inline[data-id="${currentInlineEditId}"]`);
      if (saveBtn) saveBtn.click();
    }
  });
}

// ---------------------------------------------------------
// Live Regex Search and Multi-Criteria Sorting
// ---------------------------------------------------------
const searchInput = document.getElementById('search-input');
const searchCase = document.getElementById('search-case');
const searchError = document.getElementById('search-error');
const sortSelect = document.getElementById('sort-select');

if (searchInput) searchInput.addEventListener('input', refreshUI);
if (searchCase) searchCase.addEventListener('change', refreshUI);
if (sortSelect) sortSelect.addEventListener('change', refreshUI);

// Sortable Table Headers
document.querySelectorAll('.th-sort-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.sortKey;
    const currentSort = sortSelect?.value || 'dateAdded-desc';

    let newSort = `${key}-asc`;
    if (currentSort === `${key}-asc`) {
      newSort = `${key}-desc`;
    }

    if (sortSelect) {
      sortSelect.value = newSort;
    }
    updateHeaderSortAttributes(newSort);
    refreshUI();
  });
});

function updateHeaderSortAttributes(activeSort) {
  document.querySelectorAll('.th-sort-btn').forEach(btn => {
    const key = btn.dataset.sortKey;
    const th = btn.closest('th');
    if (!th) return;

    if (activeSort === `${key}-asc`) {
      th.setAttribute('aria-sort', 'ascending');
    } else if (activeSort === `${key}-desc`) {
      th.setAttribute('aria-sort', 'descending');
    } else {
      th.setAttribute('aria-sort', 'none');
    }
  });
}

/**
 * Main UI Refresh coordinator: filters, sorts, and renders the view
 */
export function refreshUI() {
  let searchRegex = null;
  const rawSearch = searchInput ? searchInput.value.trim() : '';

  // Safe Regex Compilation with accessible error reporting
  if (rawSearch !== '') {
    const isCaseInsensitive = searchCase ? searchCase.checked : true;
    try {
      searchRegex = new RegExp(rawSearch, isCaseInsensitive ? 'i' : '');
      if (searchInput) {
        searchInput.classList.remove('invalid-input');
        searchInput.removeAttribute('aria-invalid');
      }
      if (searchError) {
        searchError.textContent = '';
      }
    } catch (error) {
      searchRegex = null;
      if (searchInput) {
        searchInput.classList.add('invalid-input');
        searchInput.setAttribute('aria-invalid', 'true');
      }
      if (searchError) {
        searchError.textContent = `Invalid regex: ${error.message}`;
      }
    }
  } else {
    if (searchInput) {
      searchInput.classList.remove('invalid-input');
      searchInput.removeAttribute('aria-invalid');
    }
    if (searchError) {
      searchError.textContent = '';
    }
  }

  // Filter records
  const records = state.records || [];
  let filtered = records.filter(record => matchesRecord(record, searchRegex));

  // Sort records
  const sortChoice = sortSelect ? sortSelect.value : 'dateAdded-desc';
  filtered.sort((a, b) => {
    switch (sortChoice) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'pages-desc':
        return Number(b.pages) - Number(a.pages);
      case 'pages-asc':
        return Number(a.pages) - Number(b.pages);
      case 'dateAdded-asc':
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      case 'dateAdded-desc':
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  updateHeaderSortAttributes(sortChoice);
  renderTable(filtered, searchRegex, currentInlineEditId);
  updateStats(state.records);
}

// ---------------------------------------------------------
// Settings & Reading Calculator
// ---------------------------------------------------------
const saveGoalBtn = document.getElementById('save-goal');
if (saveGoalBtn) {
  saveGoalBtn.addEventListener('click', () => {
    const goalInput = document.getElementById('page-goal');
    const newGoal = Number(goalInput?.value);
    if (newGoal > 0) {
      state.updateGoal(newGoal);
      announce(`Reading goal set to ${newGoal} pages.`);
      refreshUI();
    } else {
      alert('Please enter a reading goal greater than 0.');
    }
  });
}

const unitSelect = document.getElementById('unit-toggle');
if (unitSelect) {
  unitSelect.addEventListener('change', event => {
    state.updateUnit(event.target.value);
    announce(`Reading display unit set to ${event.target.value}.`);
    refreshUI();
  });
}

// Reading Time Calculator (Conversions: Pages <-> Minutes / Hours)
const convertBtn = document.getElementById('convert-btn');
const convertPagesInput = document.getElementById('convert-pages');
const convertResult = document.getElementById('conversion-result');

function runReadingCalculator() {
  if (!convertPagesInput || !convertResult) return;
  const pages = Number(convertPagesInput.value);

  if (isNaN(pages) || pages <= 0) {
    convertResult.textContent = 'Please enter a positive number of pages.';
    return;
  }

  // 1 page = 2 minutes standard reading rate
  const totalMinutes = Math.round(pages * 2);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;

  let message = `${pages} pages ≈ ${totalMinutes} minutes`;
  if (hours > 0) {
    message += ` (${hours} hr${hours > 1 ? 's' : ''}${remainingMins > 0 ? ` ${remainingMins} min` : ''})`;
  }
  message += ' at 2 minutes per page.';

  convertResult.textContent = message;
  announce(message);
}

if (convertBtn) {
  convertBtn.addEventListener('click', runReadingCalculator);
}
if (convertPagesInput) {
  convertPagesInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runReadingCalculator();
    }
  });
}

// ---------------------------------------------------------
// JSON & CSV Backup Management
// ---------------------------------------------------------
const exportBtn = document.getElementById('export-btn');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    if (!state.records || state.records.length === 0) {
      alert('Your vault is empty. Add entries first before exporting.');
      return;
    }
    exportJSON(state.records);
    announce('JSON backup downloaded successfully.');
  });
}

const exportCsvBtn = document.getElementById('export-csv-btn');
if (exportCsvBtn) {
  exportCsvBtn.addEventListener('click', () => {
    if (!state.records || state.records.length === 0) {
      alert('Your vault is empty. Add entries first before exporting.');
      return;
    }
    exportCSV(state.records);
    announce('CSV spreadsheet downloaded successfully.');
  });
}

const importFileInput = document.getElementById('import-file');
const importMessage = document.getElementById('import-message');

if (importFileInput) {
  importFileInput.addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = JSON.parse(e.target.result);

        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('The backup file must be a non-empty array of records.');
        }

        // Validate every record in the imported array
        const invalidRecords = [];
        parsed.forEach((rec, idx) => {
          if (!isValidImportedRecord(rec)) {
            invalidRecords.push(idx + 1);
          }
        });

        if (invalidRecords.length > 0) {
          throw new Error(`Invalid record structure found in row(s): ${invalidRecords.slice(0, 5).join(', ')}${invalidRecords.length > 5 ? '...' : ''}`);
        }

        // Choose between Replace or Merge
        const shouldReplace = confirm(
          `Successfully verified ${parsed.length} records!\n\nClick OK to REPLACE your current collection, or Cancel to MERGE with existing entries.`
        );

        if (shouldReplace) {
          state.replaceRecords(parsed);
          announce(`Replaced vault with ${parsed.length} imported records.`);
        } else {
          state.mergeRecords(parsed);
          announce(`Merged ${parsed.length} records into your vault.`);
        }

        if (importMessage) {
          importMessage.textContent = `Successfully imported ${parsed.length} records.`;
          importMessage.className = 'import-message success';
        }

        refreshUI();
      } catch (error) {
        console.error('Import failed:', error);
        if (importMessage) {
          importMessage.textContent = `Import rejected: ${error.message}`;
          importMessage.className = 'import-message error';
        }
        announce(`Import failed: ${error.message}`, 'assertive');
        alert(`Could not import backup: ${error.message}`);
      }
    };

    reader.onerror = () => {
      if (importMessage) {
        importMessage.textContent = 'Could not read the chosen file. Please try again.';
        importMessage.className = 'import-message error';
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input so same file can be reloaded if needed
  });
}

// ---------------------------------------------------------
// Keyboard Navigation & Shortcuts
// ---------------------------------------------------------
window.addEventListener('keydown', event => {
  const activeElement = document.activeElement;
  const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');

  // '/' key: focus search box (when not already typing)
  if (event.key === '/' && !isTyping) {
    event.preventDefault();
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
    return;
  }

  // Alt + shortcuts
  if (event.altKey) {
    if (event.key === 'a' || event.key === 'A') {
      event.preventDefault();
      document.getElementById('title')?.focus();
      announce('Navigated to Add Entry form.');
    } else if (event.key === 'd' || event.key === 'D') {
      event.preventDefault();
      document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
      announce('Navigated to Dashboard.');
    } else if (event.key === 'r' || event.key === 'R') {
      event.preventDefault();
      document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' });
      announce('Navigated to Vault collection.');
    } else if (event.key === 's' || event.key === 'S') {
      event.preventDefault();
      document.getElementById('settings')?.scrollIntoView({ behavior: 'smooth' });
      announce('Navigated to Settings.');
    }
  }

  // Escape key: cancel edit or clear search
  if (event.key === 'Escape') {
    if (currentEditId) {
      cancelFormEdit();
      announce('Edit cancelled.');
    } else if (searchInput && document.activeElement === searchInput && searchInput.value) {
      searchInput.value = '';
      refreshUI();
      announce('Search cleared.');
    }
  }
});
