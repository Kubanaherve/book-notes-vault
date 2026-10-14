import { state } from './storage.js';
import { validateRecord, repeatedWordRegex } from './validators.js';
import { renderTable, updateStats, announce } from './ui.js';

// We need to know if the user is editing an existing book. 
// If this is null, it means they are adding a brand new book.
let currentEditId = null; 

// Run this as soon as the HTML finishes loading
document.addEventListener('DOMContentLoaded', async () => {
  console.log("App loaded. Refreshing the screen...");

  // Fetch seed data if localStorage is empty
  if (state.records.length === 0) {
    try {
      const response = await fetch('./seed.json');
      const seedData = await response.json();
      state.records = seedData;
      // Save it to localStorage so it persists
      localStorage.setItem('bookVault:data', JSON.stringify(seedData));
    } catch (error) {
      console.error("Failed to load seed data:", error);
    }
  }

  refreshUI();
 
  // Try to load user settings if they already exist in local storage
  if (state.settings) {
    const goalInput = document.getElementById('page-goal');
    const unitToggle = document.getElementById('unit-toggle');
    
    if (goalInput && state.settings.goal) {
      goalInput.value = state.settings.goal;
    }
    
    if (unitToggle && state.settings.unit) {
      unitToggle.value = state.settings.unit;
    }
  }
});

// ---------------------------------------------------------
// Form Handling (Adding and Editing Books)
// ---------------------------------------------------------
const form = document.getElementById('record-form');

if (form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop the page from refreshing
    
    // 1. Grab all the values the user typed in
    const newBook = {
      title: document.getElementById('title').value.trim(),
      author: document.getElementById('author').value.trim(),
      pages: document.getElementById('pages').value,
      tag: document.getElementById('tag').value.trim(),
      dateAdded: document.getElementById('dateAdded').value
    };

    // 2. Clear out any old error messages before we check again
    const errorSpans = document.querySelectorAll('.error-message');
    errorSpans.forEach(span => {
      span.textContent = '';
    });

    const allInputs = document.querySelectorAll('input');
    allInputs.forEach(input => {
      input.classList.remove('invalid-input', 'aria-invalid');
    });

    // 3. Run our custom validation rules
    const formErrors = validateRecord(newBook);
    
    // Check for the repeated words regex rule from the rubric
    if (repeatedWordRegex.test(newBook.author)) {
      console.warn("Heads up: Repeated words found in the author's name.");
    }

    // 4. If we found errors, show them and stop saving
    if (Object.keys(formErrors).length > 0) {
      for (const key in formErrors) {
        const errorSpan = document.getElementById(key + '-error');
        if (errorSpan) {
          errorSpan.textContent = formErrors[key];
        }
        
        const inputField = document.getElementById(key);
        if (inputField) {
          inputField.classList.add('invalid-input');
          inputField.setAttribute('aria-invalid', 'true');
        }
      }
      
      announce("Please fix the errors in the form.", "assertive");
      return; 
    }

    // 5. If everything is correct, save it to the vault
    if (currentEditId) {
      // Update the existing book
      newBook.id = currentEditId;
      if (state.updateRecord) {
        state.updateRecord(currentEditId, newBook);
      }
      
      currentEditId = null; // Reset the edit tracker
      document.getElementById('cancel-edit').classList.add('hidden');
      announce("Book updated successfully.", "assertive");
    } else {
      // Add a brand new book with a unique ID
      newBook.id = 'book_' + Date.now(); 
      if (state.addRecord) {
        state.addRecord(newBook);
      }
      announce("New book added to the vault.", "assertive");
    }

    // Clean up the form and update the dashboard
    event.target.reset();
    refreshUI();
  });
}

// Cancel the edit mode if the user changes their mind
const cancelEditBtn = document.getElementById('cancel-edit');
if (cancelEditBtn) {
  cancelEditBtn.addEventListener('click', () => {
    if (form) {
      form.reset();
    }
    
    currentEditId = null;
    cancelEditBtn.classList.add('hidden');
    
    // Clean up any red error borders left behind
    document.querySelectorAll('.error-message').forEach(span => span.textContent = '');
    document.querySelectorAll('input').forEach(input => {
      input.classList.remove('invalid-input');
      input.removeAttribute('aria-invalid');
    });
  });
}

// ---------------------------------------------------------
// Table Actions (Clicking Edit or Delete inside the table)
// ---------------------------------------------------------
const tableBody = document.getElementById('records-body');

if (tableBody) {
  tableBody.addEventListener('click', function(event) {
    const clickedElement = event.target;
    const recordId = clickedElement.dataset.id;

    // If they clicked a delete button...
    if (clickedElement.classList.contains('btn-delete')) {
      const confirmDelete = confirm("Are you sure you want to delete this book?");
      if (confirmDelete) {
        if (state.deleteRecord) {
          state.deleteRecord(recordId);
        }
        announce("Book deleted.", "assertive");
        refreshUI();
      }
    }
    
    // If they clicked an edit button...
    if (clickedElement.classList.contains('btn-edit')) {
      const records = state.records || [];
      const bookToEdit = records.find(book => book.id === recordId);
      
      if (bookToEdit) {
        // Put the book's details back into the input boxes
        document.getElementById('title').value = bookToEdit.title;
        document.getElementById('author').value = bookToEdit.author;
        document.getElementById('pages').value = bookToEdit.pages;
        document.getElementById('tag').value = bookToEdit.tag;
        document.getElementById('dateAdded').value = bookToEdit.dateAdded;
        
        currentEditId = bookToEdit.id;
        document.getElementById('cancel-edit').classList.remove('hidden');
        
        // Scroll the page up so they can see the form
        const formSection = document.getElementById('form-section');
        if (formSection) {
          window.scrollTo({ top: formSection.offsetTop, behavior: 'smooth' });
        }
      }
    }
  });
}

// ---------------------------------------------------------
// Settings, Import, and Export
// ---------------------------------------------------------
const saveGoalBtn = document.getElementById('save-goal');
if (saveGoalBtn) {
  saveGoalBtn.addEventListener('click', () => {
    const goal = Number(document.getElementById('page-goal').value);
    if (goal > 0) {
      if (state.updateGoal) {
        state.updateGoal(goal);
      }
      announce("Reading goal updated.");
      refreshUI();
    }
  });
}

const unitToggle = document.getElementById('unit-toggle');
if (unitToggle) {
  unitToggle.addEventListener('change', (event) => {
    if (state.updateUnit) {
      state.updateUnit(event.target.value);
    }
    refreshUI();
  });
}

// Export the user's collection to a JSON file
const exportBtn = document.getElementById('export-btn');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const records = state.records || [];
    
    if (records.length === 0) {
      alert("Your vault is empty. Nothing to export.");
      return;
    }
    
    try {
      // Create a downloadable file in the browser
      const dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute("href", dataString);
      downloadLink.setAttribute("download", "my-vault-backup.json");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove(); // Clean it up after clicking
      announce("Export finished successfully.");
    } catch (error) {
      console.error("Oops, export failed:", error);
      announce("Failed to export the file.", "assertive");
    }
  });
}
// Import a JSON file back into the vault
const importFileInput = document.getElementById('import-file');
if (importFileInput) {
  importFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Basic check to make sure it's the right kind of file
        if (Array.isArray(importedData) && importedData.every(item => item.id && item.title)) {
          state.records = importedData;
          
          if (state.saveRecords) {
            state.saveRecords();
          } else {
            localStorage.setItem('vaultRecords', JSON.stringify(importedData));
          }
          
          refreshUI();
          announce("Backup imported successfully.");
        } else {
          throw new Error("File format is incorrect.");
        }
      } catch (err) {
        alert("We couldn't import this file. Make sure it's a valid JSON backup.");
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Let them select the same file again later if needed
  });
}

// ---------------------------------------------------------
// Live Search and Sorting
// ---------------------------------------------------------
const searchBox = document.getElementById('search-input');
const searchCaseBox = document.getElementById('search-case');
const sortDropdown = document.getElementById('sort-select');

// Update the table as the user types
if (searchBox) searchBox.addEventListener('input', refreshUI);
if (searchCaseBox) searchCaseBox.addEventListener('change', refreshUI);

if (sortDropdown) {
  sortDropdown.addEventListener('change', (event) => {
    const sortChoice = event.target.value;
    if (!state.records) return;
    
    // Sort the array based on what the user picked
    state.records.sort((a, b) => {
      if (sortChoice === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else if (sortChoice === 'pages-desc') {
        return b.pages - a.pages; // High to low
      } else if (sortChoice === 'dateAdded-asc') {
        return new Date(a.dateAdded) - new Date(b.dateAdded); // Oldest first
      } else {
        return new Date(b.dateAdded) - new Date(a.dateAdded); // Newest first (default)
      }
    });
    
    refreshUI();
  });
}

function refreshUI() {
  let filterRegex = null;
  const searchBox = document.getElementById('search-input');
  const searchCaseBox = document.getElementById('search-case');

  // Grab and compile the regex search pattern
  if (searchBox && searchBox.value.trim() !== '') {
    try {
      const isCaseInsensitive = searchCaseBox ? searchCaseBox.checked : true;
      const flags = isCaseInsensitive ? 'i' : '';
      filterRegex = new RegExp(searchBox.value.trim(), flags);
      
      searchBox.classList.remove('invalid-input');
      searchBox.removeAttribute('aria-invalid');
    } catch (e) {
      searchBox.classList.add('invalid-input');
      searchBox.setAttribute('aria-invalid', 'true');
    }
  }

  // Pass the state and the regex pattern to your ui.js functions
  renderTable(state.records, filterRegex);
  updateStats(state.records);
}









