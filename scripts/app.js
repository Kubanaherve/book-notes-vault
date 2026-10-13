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
