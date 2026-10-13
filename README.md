# 📚 Book & Notes Vault

A lightweight, browser-based app for organizing books, textbooks, and academic notes in one place.

Built with **HTML, CSS, and Vanilla JavaScript**. No frameworks, no databases, no installation required.

**🌐 Live Demo:** [Add your GitHub Pages link here]
**🎥 Video Walkthrough:** [Add your unlisted YouTube or Google Drive link here]
**💻 Repository:** [Add your GitHub repository link here]

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Regular Expressions](#regular-expressions)
- [Dashboard](#dashboard)
- [Data Storage and Backup](#data-storage-and-backup)
- [Reading Time Estimate](#reading-time-estimate)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Sample Data](#sample-data)
- [Deployment](#deployment)
- [Responsive Design and Accessibility](#responsive-design-and-accessibility)
- [What I Learned](#what-i-learned)
- [Development Milestones](#development-milestones)
- [Author](#author)

---

## Overview

Students use many different learning materials across their courses. Keeping track of titles, authors, page counts, and categories quickly becomes difficult.

**Book & Notes Vault** provides a simple place to manage that information. Users can add, edit, delete, search, and sort records, and view statistics about their collection. Records are saved in the browser's `localStorage`, so they remain available after a page refresh.

### Goals

- Help students organize reading materials and academic notes.
- Make searching fast, including with regular expressions.
- Help users track reading progress.
- Keep data in the browser, with JSON import and export for backups.
- Work well on both desktop and mobile devices.

---

## Features

| Feature | Description |
|---|---|
| **Add Records** | Create books and academic notes with their details. |
| **Edit Records** | Update the information of an existing record. |
| **Delete Records** | Remove records that are no longer needed. |
| **Regex Search** | Search records using regular expression patterns. |
| **Search Highlighting** | Highlight matching text in search results. |
| **Sorting** | Organize records by the available sort options. |
| **Dashboard** | View statistics about the collection. |
| **Reading Progress** | Track how far along you are in each record. |
| **Reading Time Estimate** | Estimate reading time from page count and reading speed. |
| **Local Storage** | Save records in the browser with `localStorage`. |
| **JSON Export** | Download all records as a JSON file. |
| **JSON Import** | Load records from a JSON file. |
| **Responsive Design** | Adapts to phones, tablets, and desktops. |

---

## Getting Started

No installation is needed. You can run the app in either of these ways.

### Option 1: Open the File Directly

1. Download or clone the repository.
2. Open the project folder.
3. Double-click `index.html` to open it in your browser.

### Option 2: Run a Local Server

Use this option if the app needs to be served over HTTP.

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

If Python is not installed, any local development server will work.

---

## How to Use

### Add a Record

1. Find the form for adding a book or note.
2. Enter the required information.
3. Submit the form.
4. Confirm that the new record appears in your collection.

### Search

1. Enter a term or a supported regex pattern in the search field.
2. Review the matching records. Matches are highlighted.
3. Clear the search to see the full collection again.

### Sort

1. Open the sorting options.
2. Select the order you prefer.

### Edit a Record

1. Find the record and select its edit option.
2. Update the information.
3. Save your changes.

### Delete a Record

1. Find the record and select its delete option.
2. Confirm the deletion if prompted.

### Export and Import

- **Export:** Use the export option to download your collection as a `.json` file.
- **Import:** Use the import option to choose a `.json` file and load its records.

> **Tip:** Export a backup before importing new data.

---

## Regular Expressions

Regular expressions (regex) are patterns that describe text. The app uses them for input validation and for search.

### Validation Rules

| Rule | Pattern | Purpose |
|---|---|---|
| **1. Title and Author** | `/^\S(?:.*\S)?$/` | Rejects leading or trailing whitespace. |
| **2. Numbers** | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Accepts non-negative numbers with up to two decimal places. |
| **3. Date (YYYY-MM-DD)** | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Checks the date format. It does not confirm that the date exists (for example, `2026-02-31` passes). |
| **4. Tags** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Allows letters, single spaces, and hyphens. |
| **5. Repeated Word** | `/\b(\w+)\s+\1\b/i` | Detects a word repeated immediately, such as "book book". |

### Search Examples

| Pattern | What It Finds |
|---|---|
| `/Clean/i` | "Clean" in any letter case. |
| `/\bCode\b/i` | "Code" as a whole word. |
| `/^Data/` | Text that starts with "Data". |
| `/\b(\w+)\s+\1\b/i` | Repeated words. |
| `/[0-9]{3,}/` | Three or more consecutive digits. |

---

## Dashboard

The dashboard summarizes your collection, so you don't have to count it manually. Depending on the records you've saved, it can show:

- Total number of books and notes
- Total pages across the collection
- Reading progress
- Number of records in each category
- Estimated total reading time

Statistics update automatically when you add, edit, or delete a record.

*Example: five books with 100 pages each gives a total of 500 pages.*

---

## Data Storage and Backup

Records are stored in the browser's `localStorage`. This means:

- ✅ Records persist across page refreshes in the same browser.
- ✅ No database server is required.
- ⚠️ Data stays in the browser where it was saved and does not sync across devices.
- ⚠️ Clearing browser data will delete saved records.

**Recommendation:** Export your records regularly as a JSON backup.

---

## Reading Time Estimate

The app estimates how long a book will take using:

```
Reading time = Number of pages ÷ Pages read per hour
```

**Example:** A 120-page book read at 30 pages per hour takes 120 ÷ 30 = **4 hours**.

This is only an estimate. Actual time depends on the difficulty of the material and the reader's speed.

---

## Project Structure

```
Book-Notes-Vault/
│
├── index.html          # Main page structure
├── tests.html          # Test page for implemented features
├── seed.json           # Sample records
├── README.md           # Project documentation
├── .gitignore
│
├── styles/
│   └── styles.css      # Application styling
│
├── scripts/
│   ├── main.js         # Connects the main features
│   ├── storage.js      # Saves and loads records (localStorage)
│   ├── state.js        # Manages application state
│   ├── ui.js           # Updates the interface
│   ├── validators.js   # Input validation functions
│   └── search.js       # Search functions
│
└── assets/
    └── images/         # Image assets
```

---

## Testing

The `tests.html` page is used to check the main features. Test areas include:

| Area | What to Check |
|---|---|
| Add Record | A valid record can be added. |
| Edit Record | An existing record can be updated. |
| Delete Record | A record can be removed. |
| Validation | Invalid input is rejected. |
| Regex Search | Matching records appear in the results. |
| Search Highlighting | Matching text is highlighted. |
| Sorting | Records appear in the selected order. |
| Local Storage | Records remain after a refresh. |
| JSON Export | Records download as a JSON file. |
| JSON Import | A valid JSON file loads correctly. |
| Dashboard | Statistics match the saved records. |
| Responsive Design | The layout works at different screen sizes. |
| Keyboard Navigation | Interactive elements can be reached with the keyboard. |

---

## Sample Data

The `seed.json` file contains sample records for testing and demonstration. It includes fields such as title, author, category or tags, page count, and reading progress.

---

## Deployment

The app is published with **GitHub Pages**.

1. Push the project files to the GitHub repository.
2. Open **Settings** → **Pages**.
3. Select the branch and folder to publish from.
4. Save and wait for the site to deploy.
5. Open the published link and confirm the app works.

---

## Responsive Design and Accessibility

The layout adapts to different screen widths. The main reference sizes are:

- **Mobile:** around 360 px
- **Tablet:** around 768 px
- **Desktop:** around 1024 px and wider

These are reference sizes, not strict requirements.

Design priorities:

- Clear layout and readable text
- Descriptive labels for forms and buttons
- Feedback when users take actions
- Keyboard-accessible interactive elements

---

## What I Learned

- Organizing files in a web project
- Building forms and handling user input
- Adding, editing, and deleting records with JavaScript
- Saving data with `localStorage`
- Using regular expressions for validation and search
- Working with JSON data
- Updating the interface when data changes
- Testing features and fixing bugs
- Making a page responsive
- Publishing a site with GitHub Pages

---

## Development Milestones

| Milestone | Focus |
|---|---|
| **M1** | Project setup and basic HTML structure |
| **M2** | Page design with CSS |
| **M3** | Record management (create, edit, delete) |
| **M4** | Data storage with `localStorage` |
| **M5** | Regex search and input validation |
| **M6** | Dashboard, sorting, and JSON import/export |
| **M7** | Testing, documentation, and deployment |

---

## Author

**KUBANA Herve Friend**
African Leadership University (ALU)
GitHub: [@Kubanaherve](https://github.com/Kubanaherve)
