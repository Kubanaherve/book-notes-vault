# 📚 Book & Notes Vault

A responsive, accessible, offline-friendly web app for organizing books, textbooks, and academic notes. Built with vanilla HTML, CSS, and JavaScript, with no frameworks.

| | |
|---|---|
| **Developer** | KUBANA Herve Friend |
| **Institution** | African Leadership University (ALU) |
| **GitHub** | [@Kubanaherve](https://github.com/Kubanaherve) |
| **Theme** | Book & Notes Vault (Catalog, Pages, Tags, Search) |
| **Stack** | HTML5, CSS3, Vanilla JavaScript (ES modules) |
| **Storage** | `localStorage` with JSON import/export |
| **Deployment** | GitHub Pages |

**🌐 Live Website:** [ADD GITHUB PAGES LINK]
**🎬 Demo Video (2–3 min, unlisted):** [ADD YOUTUBE OR DRIVE LINK]
**📦 Repository:** [ADD REPOSITORY LINK]

---

## Table of Contents

1. [About](#about)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Data Model](#data-model)
6. [Forms and Validation](#forms-and-validation)
7. [Regex Catalog](#regex-catalog)
8. [Search and Highlighting](#search-and-highlighting)
9. [Dashboard and Goals](#dashboard-and-goals)
10. [Units and Conversions](#units-and-conversions)
11. [Import and Export](#import-and-export)
12. [Keyboard Map](#keyboard-map)
13. [Accessibility](#accessibility)
14. [Responsive Design](#responsive-design)
15. [Testing](#testing)
16. [Deployment](#deployment)
17. [Development Milestones](#development-milestones)
18. [Limitations and Future Work](#limitations-and-future-work)
19. [Contact](#contact)

---

## About

Students use many books, textbooks, and notes across their courses. Tracking titles, authors, page counts, tags, and reading progress quickly becomes difficult.

Book & Notes Vault puts that information in one place. Users can add, edit, delete, search, sort, and filter their records. The app estimates reading time, tracks progress against a reading goal, and saves everything in the browser so records remain after a refresh. Users can back up their data as JSON and restore it later.

### Goals

- Organize books and academic notes in one place.
- Search records quickly with regular expressions.
- Track reading progress against a personal goal.
- Keep data across sessions without a server.
- Make the app usable with a keyboard, a screen reader, and on a phone.

---

## Features

- **Add records:** Books and notes with title, author, pages, tag, and date added.
- **Inline edit:** Update any row without leaving the table.
- **Confirmed delete:** Remove a record after a confirmation prompt.
- **Regex search:** Live search with a case-insensitive toggle, safe compilation, and error feedback.
- **Match highlighting:** Matches are wrapped in `<mark>` elements.
- **Sorting:** By date added, title (A↕Z), and pages (↑↓).
- **Dashboard:** Total records, total pages, top tag, last-7-days trend, and reading-goal status.
- **Reading goal:** A numeric target with remaining or overage messages announced to screen readers.
- **Units:** Pages and minutes, with conversion between minutes and hours.
- **Persistence:** Auto-save to `localStorage` after every change.
- **JSON import and export:** Validated before any data is loaded.
- **Settings:** Reading speed, daily goal, and display options.
- **Responsive layout:** A table on desktop and cards on mobile.

---

## Getting Started

### Option 1: Open the file directly

```bash
git clone https://github.com/Kubanaherve/Book-Notes-Vault.git
cd Book-Notes-Vault
```

Open `index.html` in a browser.

### Option 2: Run a local server (recommended)

Some browsers restrict module scripts when a page is opened from disk, so a local server is the most reliable option.

```bash
# Python 3
python -m http.server 8000
```

Then open <http://localhost:8000>.

### Run the tests

Open <http://localhost:8000/tests.html>. The page runs the assertions and shows pass/fail results. All tests should pass before you use the app.

---

## Project Structure

```text
Book-Notes-Vault/
├── index.html          # Semantic page structure and landmarks
├── tests.html          # In-browser test runner
├── seed.json           # 10+ sample records (edge cases included)
├── README.md
├── .gitignore
├── styles/
│   └── styles.css      # Mobile-first styles, breakpoints, animations
├── scripts/
│   ├── main.js         # Entry point; wires events to modules
│   ├── state.js        # In-memory state and CRUD operations
│   ├── storage.js      # localStorage load/save and JSON import/export
│   ├── validators.js   # Regex validation rules and error messages
│   ├── search.js       # Safe regex compiler, matching, highlighting
│   └── ui.js           # Rendering, sorting, dashboard, live messages
└── assets/
    └── images/         # Icons and illustrations
```

| File | Responsibility |
|---|---|
| `main.js` | Starts the app and connects user actions to the modules. |
| `state.js` | Holds records and exposes add, update, delete, and sort functions. |
| `storage.js` | Reads and writes `localStorage`. Handles JSON import and export. |
| `validators.js` | Defines the regex rules and returns readable error messages. |
| `search.js` | Compiles user patterns safely and highlights matches. |
| `ui.js` | Renders the table, cards, dashboard, and live announcements. |

---

## Data Model

Every record uses this shape:

```json
{
  "id": "rec_0001",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "pages": 464,
  "tag": "Software",
  "dateAdded": "2026-09-29",
  "createdAt": "2026-09-29T08:15:00.000Z",
  "updatedAt": "2026-09-29T08:15:00.000Z"
}
```

| Field | Type | Rules |
|---|---|---|
| `id` | string | Unique. Generated as `rec_` followed by a zero-padded counter. |
| `title` | string | Required. No leading or trailing spaces. Internal double spaces are collapsed. |
| `author` | string | Required. Same rules as `title`. |
| `pages` | number | Required. Non-negative, up to two decimal places. |
| `tag` | string | Required. Letters, spaces, or hyphens only. |
| `dateAdded` | string | Required. Format `YYYY-MM-DD`, and must be a real calendar date. |
| `createdAt` | ISO string | Set once when the record is created. |
| `updatedAt` | ISO string | Changed on every edit. |

---

## Forms and Validation

Validation runs on each field as the user types (on `input`) and again on submit. Each error appears beside its field and is announced through an ARIA live region. Submit is blocked until all fields are valid.

| Field | Rule | Pattern |
|---|---|---|
| Title, author | Forbid leading and trailing spaces | `/^\S(?:.*\S)?$/` |
| Pages | Non-negative number, up to 2 decimals | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` |
| Date added | `YYYY-MM-DD` format, then calendar check in JS | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` |
| Tag | Letters, spaces, or hyphens | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` |
| Title (advanced) | Rejects a repeated word such as "Data Data" | `/\b(\w+)\s+\1\b/i` (back-reference) |
| Title (advanced) | Flags titles that contain the word "notes" | `/^(?=.*\bnotes?\b)/i` (lookahead) |

The date pattern checks the format only. The JavaScript code then confirms the date exists (for example, it rejects `2026-02-30`).

---

## Regex Catalog

Users can type these patterns into the search field. The **Case-insensitive** toggle adds the `i` flag. Patterns that fail to compile show an error and leave the table unchanged.

| Pattern | What it finds | Example match |
|---|---|---|
| `/Clean/i` | Text containing "clean", any case | "Clean Code", "clean architecture" |
| `/\bCode\b/i` | "Code" as a whole word | "Clean Code" (not "Codex") |
| `/^Data/` | Titles starting with "Data" | "Data Structures" |
| `/\b(\w+)\s+\1\b/i` | Repeated word (back-reference) | "Intro Intro to Algorithms" |
| `/\b[A-Z]\w+\s+[A-Z]\w+\b/` | Two capitalized words in a row | "Robert Martin" |
| `/\b(?:97[89]-?)?\d{9}[\dX]\b/` | ISBN-10 or ISBN-13 (no hyphens) | "9780132350884" |
| `/\b(\w{3,})\b(?=.*\b\1\b)/i` | Words that appear more than once in a record (back-reference with lookahead) | "Notes on Notes" |
| `/^(?=.*\bnotes?\b)/i` | Records whose title includes "notes" (lookahead) | "Chemistry Notes" |
| `/[0-9]{3,}/` | Three or more consecutive digits | "Edition 2026" |
| `/\.\d{2}\b/` | A decimal ending in two digits | "pages 464.50" |

---

## Search and Highlighting

- **Safe compilation:** Patterns go through a wrapper that returns `null` on invalid input instead of throwing an error.

```js
  export function compileRegex(input, flags = 'i') {
    try {
      return input ? new RegExp(input, flags) : null;
    } catch {
      return null;
    }
  }
```

- **Live search:** Results update as the user types, after a short debounce.
- **Highlighting:** Matches are wrapped in `<mark>`. Highlighting only changes the visual output. The underlying text is not changed.
- **Empty and error states:** The app states when no records match and when a pattern is invalid. It never fails silently.
- **Sorting:** Sorting applies to the filtered results.

---

## Dashboard and Goals

The dashboard summarizes the collection:

- Total records (books and notes)
- Total pages
- Top tag
- Last-7-days trend (a CSS bar chart, built from `dateAdded`)
- Reading-goal progress (pages read against the daily goal)

### Goal messages

The goal is a numeric cap set in Settings. The app announces the status through an ARIA live region:

- **Under goal:** `role="status"` (polite). Example: "120 pages remaining to reach your goal."
- **Over goal:** `aria-live="assertive"`. Example: "Goal exceeded by 15 pages."

---

## Units and Conversions

The vault works in **pages** and **minutes**. The reading speed is set in Settings, in pages per hour.

Reading time = pages ÷ (pages per hour) × 60 minutes

Example: a 120-page book at 30 pages per hour takes 120 ÷ 30 = 4 hours (240 minutes).

Conversions available in the UI:

| From | To | Formula |
|---|---|---|
| Minutes | Hours | minutes ÷ 60 |
| Hours | Minutes | hours × 60 |
| Pages | Estimated minutes | pages ÷ pages per hour × 60 |

Estimates depend on the material. Dense textbooks take longer than novels.

---

## Import and Export

### Export

1. Select **Export JSON**.
2. The app downloads `book-notes-vault-YYYY-MM-DD.json`.

### Import

1. Select **Import JSON** and choose a file.
2. The app validates the file before loading it:
   - The root value must be an array.
   - Every record must contain all required fields with the correct types.
   - Every `id` must be unique.
   - Dates and tags must pass the same regex rules used in the form.
3. If the file is valid, the app asks whether to **merge** with or **replace** the current data.
4. If the file is malformed, the app lists the errors (record number and field) and imports nothing.

Malformed JSON is caught with `try/catch`, and the user sees a readable message. The app never overwrites data with a partial or invalid import.

**Tip:** Export a backup before importing new data.

---

## Keyboard Map

The app is fully usable without a mouse.

| Key | Action |
|---|---|
| `Tab` / `Shift+Tab` | Move between interactive elements |
| `Enter` / `Space` | Activate buttons and links |
| `Esc` | Cancel an edit or close a dialog |
| `Enter` (in a row) | Start inline edit |
| `Ctrl+Enter` (in edit mode) | Save the edit |
| `Delete` (on a selected row) | Open the delete confirmation |
| `/` | Move focus to the search field |
| `Alt+A` | Jump to the Add form |
| `Alt+D` | Jump to the Dashboard |
| `Alt+R` | Jump to the Records table |
| `Alt+S` | Jump to Settings |

**Skip link:** The first Tab press on any page shows a "Skip to main content" link.

---

## Accessibility

- **Landmarks:** `<header>`, `<nav>`, `<main>`, `<section>` (one per page area), and `<footer>`.
- **Headings:** One `<h1>` per page, followed by `<h2>` for sections and `<h3>` for subsections, with no skipped levels.
- **Labels:** Every input has a visible `<label>` bound with `for` and `id`. Help text is linked with `aria-describedby`.
- **Errors:** Inline messages are linked with `aria-describedby`, and invalid fields use `aria-invalid="true"`.
- **Live regions:** Status messages use `role="status"` (polite). Goal overages and critical errors use `aria-live="assertive"`.
- **Focus:** A visible focus ring (3px outline, high contrast) appears on every interactive element. It is never removed.
- **Color contrast:** Text meets WCAG AA (4.5:1 for body text, 3:1 for large text and UI controls). Status is never conveyed by color alone; each state also has text or an icon.
- **Motion:** Transitions are short, and `prefers-reduced-motion` disables them.
- **Images:** All meaningful images have `alt` text. Decorative images use `alt=""`.
- **Tables:** Sortable headers use `aria-sort` and are real `<button>` elements inside `<th>`.

---

## Responsive Design

The layout is mobile-first and uses Flexbox with media queries at three breakpoints:

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile | ~360px and up | Single column. Records display as cards. Navigation is a stacked menu. |
| Tablet | ~768px and up | Two-column dashboard. Form and list sit side by side where space allows. |
| Desktop | ~1024px and up | Full records table. Persistent sidebar navigation. |

Tested at 360px, 768px, and 1024px in Chrome and Firefox DevTools, and on a physical Android phone.

---

## Testing

`tests.html` runs small assertions against the modules. Each test prints a pass or fail result.

| Area | What is checked |
|---|---|
| Add | A valid record is created with a unique `id` and timestamps. |
| Edit | An existing record updates, and `updatedAt` changes. |
| Delete | A record is removed after confirmation. |
| Validation | Each regex rule accepts valid input and rejects invalid input. |
| Regex search | Valid patterns return matches. Invalid patterns return `null` without throwing. |
| Highlighting | Matches are wrapped in `<mark>`, and text is not altered. |
| Sorting | Records sort correctly by date, title, and pages. |
| Storage | Records survive a simulated reload. |
| Import | Valid files load. Malformed files are rejected with clear errors. |
| Export | Output round-trips back to the same records. |
| Dashboard | Totals and goal status match the saved records. |

### Regex edge cases to try manually

- `Clean Clean` in the title should fail the repeated-word rule.
- `  Leading space` should fail the title rule.
- `2026-02-30` should fail the date check.
- `Data-Science 101` should fail the tag rule because of the digits.
- Search `/(/` should show an error message, not crash.

---

## Deployment

The app is deployed with GitHub Pages.

1. Push the project to the `main` branch.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Choose `main` and `/ (root)`, then save.
5. Open the published URL and check every page and feature.

**Live link:** [ADD GITHUB PAGES LINK]

---

## Development Milestones

| Milestone | Focus | Status |
|---|---|---|
| M1 | Spec, wireframes, data model, accessibility plan | ✅ |
| M2 | Semantic HTML, base CSS, mobile-first layout | ✅ |
| M3 | Forms, regex validation, `tests.html` | ✅ |
| M4 | Rendering, sorting, regex search, highlighting | ✅ |
| M5 | Dashboard, goal cap, ARIA live updates | ✅ |
| M6 | Persistence, JSON import/export, settings | ✅ |
| M7 | Polish, accessibility audit, README, demo video | ✅ |

---

## Limitations and Future Work

- **Single browser:** `localStorage` is specific to one browser on one device. Export a backup to move data.
- **Clearing site data:** Clearing browser storage deletes all records. Export regularly.
- **No sync:** Records are not shared between devices.
- **Estimates only:** Reading times are estimates.

Possible improvements:

- Offline support with a service worker
- Light and dark theme toggle (saved to storage)
- CSV export with proper escaping
- Cover images and ISBN lookup

---

## Contact

- **Name:** KUBANA Herve Friend
- **Institution:** African Leadership University (ALU)
- **GitHub:** [@Kubanaherve](https://github.com/Kubanaherve)
- **Email:** [h.kubana@alustudent.com]

---

*Built as a learning project for regex, responsive layout, accessibility, and client-side data handling.*
