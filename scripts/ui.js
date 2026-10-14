import { highlight } from './search.js';
import { state } from './state.js';

const tbody = document.getElementById('records-body');
const politeAnnouncer = document.getElementById('aria-polite');
const assertiveAnnouncer = document.getElementById('aria-assertive');

export function announce(message, type = 'polite') {
  if (type === 'assertive') {
    assertiveAnnouncer.textContent = message;
    setTimeout(() => assertiveAnnouncer.textContent = '', 3000);
  } else {
    politeAnnouncer.textContent = message;
    setTimeout(() => politeAnnouncer.textContent = '', 3000);
  }
}

export function renderTable(records, searchRegex) {
  tbody.innerHTML = '';
  const isMinutes = state.settings.unit === 'minutes';

  records.forEach(record => {
    const tr = document.createElement('tr');
    
    let displayPages = Number(record.pages);
    if (isMinutes) displayPages = (displayPages * 2) + " mins";
    
    tr.innerHTML = `
      <td data-label="Title">${highlight(record.title, searchRegex)}</td>
      <td data-label="Author">${highlight(record.author, searchRegex)}</td>
      <td data-label="Pages">${displayPages}</td>
      <td data-label="Tag">${highlight(record.tag, searchRegex)}</td>
      <td data-label="Date">${highlight(record.dateAdded, searchRegex)}</td>
      <td data-label="Actions" class="action-btns">
        <button class="btn-edit" data-id="${record.id}" aria-label="Edit ${record.title}">Edit</button>
        <button class="btn-delete" data-id="${record.id}" aria-label="Delete ${record.title}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


export function updateStats(records) {
  const total = records.length;
  const totalPages = records.reduce((sum, r) => sum + Number(r.pages), 0);
  
  const tags = records.map(r => r.tag);
  const tagCounts = tags.reduce((acc, tag) => { acc[tag] = (acc[tag] || 0) + 1; return acc; }, {});
  const topTag = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])[0] || 'N/A';

  document.getElementById('stat-total').textContent = total;
  
  const isMinutes = state.settings.unit === 'minutes';
  document.getElementById('stat-pages').textContent = isMinutes ? (totalPages * 2) + " mins" : totalPages;
  document.getElementById('stat-tag').textContent = topTag;

  const goal = Number(state.settings?.goal) || 0;
const tracker = document.querySelector('.cap-tracker');
const statusSpan = document.getElementById('goal-status');

if (tracker && statusSpan) {
  if (goal <= 0) {
    tracker.classList.remove('exceeded');
    statusSpan.textContent = 'Set a reading goal to start tracking.';
  } else if (totalPages > goal) {
    tracker.classList.add('exceeded');
    statusSpan.textContent = `${totalPages} / ${goal} (Exceeded by ${totalPages - goal})`;
  } else {
    tracker.classList.remove('exceeded');
    statusSpan.textContent = `${totalPages} / ${goal} (${goal - totalPages} remaining)`;
  }
}

}


