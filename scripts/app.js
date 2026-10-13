import { state } from './state.js';
import { validateRecord, repeatedWordRegex } from './validators.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('page-goal').value = state.settings.goal;
  document.getElementById('unit-toggle').value = state.settings.unit;
});

document.getElementById('record-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const record = {
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    pages: document.getElementById('pages').value,
    tag: document.getElementById('tag').value,
    dateAdded: document.getElementById('dateAdded').value
  };

  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('input').forEach(el => el.classList.remove('invalid-input'));

  const errors = validateRecord(record);
  
  if (repeatedWordRegex.test(record.author)) {
    console.warn("Warning: Repeated words detected in Author name.");
  }

  if (Object.keys(errors).length > 0) {
    for (const [key, msg] of Object.entries(errors)) {
      document.getElementById(`${key}-error`).textContent = msg;
      document.getElementById(key).classList.add('invalid-input');
    }
    return;
  }

  state.addRecord(record);
  e.target.reset();
});
document.getElementById('records-body').addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    if (confirm("Are you sure you want to delete this record?")) {
      state.deleteRecord(e.target.dataset.id);
      announce("Record deleted.", "assertive");
      refreshUI();
    }
  }
  
  if (e.target.classList.contains('btn-edit')) {
    const record = state.records.find(r => r.id === e.target.dataset.id);
    if (record) {
      document.getElementById('title').value = record.title;
      document.getElementById('author').value = record.author;
      document.getElementById('pages').value = record.pages;
      document.getElementById('tag').value = record.tag;
      document.getElementById('dateAdded').value = record.dateAdded;
      
      editingId = record.id;
      document.getElementById('cancel-edit').classList.remove('hidden');
      window.scrollTo({ top: document.getElementById('form-section').offsetTop, behavior: 'smooth' });
    }
  }
});

document.getElementById('cancel-edit').addEventListener('click', () => {
  document.getElementById('record-form').reset();
  editingId = null;
  document.getElementById('cancel-edit').classList.add('hidden');
});
