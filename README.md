# 📚 Book & Notes Vault

An accessible, responsive, mobile-first vanilla HTML/CSS/JavaScript web application for cataloging textbooks, research papers, and academic notes. Built strictly with semantic HTML5, modern CSS3, and modular ES modules (zero frameworks).

| Detail | Specification |
|---|---|
| **Author / Developer** | KUBANA Herve Friend |
| **Institution** | African Leadership University (ALU) |
| **Email** | [h.kubana@alustudent.com](mailto:h.kubana@alustudent.com) |
| **GitHub** | [@Kubanaherve](https://github.com/Kubanaherve) |
| **Chosen Theme** | **Book & Notes Vault** (Catalog, Pages, Tags, Search) |
| **Technology Stack** | HTML5 (Semantic Landmarks), CSS3 (Flexbox/Grid/Glassmorphism), Vanilla JavaScript (ES Modules) |
| **Data Persistence** | `localStorage` with JSON & CSV import/export validation |
| **Deployment** | GitHub Pages |

---

## 🔗 Project Links

- **🌐 Live GitHub Pages Website:** [https://kubanaherve.github.io/book-notes-vault/](https://kubanaherve.github.io/book-notes-vault/)
- **📦 GitHub Repository:** [https://github.com/Kubanaherve/book-notes-vault](https://github.com/Kubanaherve/book-notes-vault)
- **🎬 Demo Video (2–3 min, unlisted):** [https://youtu.be/placeholder-demo-video]((https://youtu.be/WVAo99xZUfw)) 

---

## 📑 Table of Contents

1. [Overview & Purpose](#overview--purpose)
2. [Core Features](#core-features)
3. [Project Architecture & File Structure](#project-architecture--file-structure)
4. [Data Model](#data-model)
5. [Forms & Regex Validation](#forms--regex-validation)
6. [Regex Catalog & Edge Cases](#regex-catalog--edge-cases)
7. [Safe Regex Search & Accessible Highlighting](#safe-regex-search--accessible-highlighting)
8. [Dashboard, Goal Cap & ARIA Live Regions](#dashboard-goal-cap--aria-live-regions)
9. [Units & Reading Time Conversions](#units--reading-time-conversions)
10. [Persistence, JSON Validation & CSV Export](#persistence-json-validation--csv-export)
11. [Keyboard Navigation Map](#keyboard-navigation-map)
12. [Accessibility & Contrast Audit (a11y)](#accessibility--contrast-audit-a11y)
13. [Mobile-First Responsive Design](#mobile-first-responsive-design)
14. [Testing Suite & In-Browser Runner](#testing-suite--in-browser-runner)
15. [Demo Video Breakdown](#demo-video-breakdown)
16. [Deployment Guide](#deployment-guide)
17. [Development Milestones (M1–M7)](#development-milestones-m1m7)

---

## Overview & Purpose

Students and researchers regularly juggle diverse textbooks, papers, and lecture notes across courses. Without a unified system, monitoring reading goals, search-indexing topics, and tracking pages read becomes fragmented.

**Book & Notes Vault** provides an offline-capable, responsive, accessible workspace to catalog titles, authors, page counts, tags, and dates. It empowers users to:
- Perform live regex pattern queries with case-insensitive controls and safe error compiling.
- Visually inspect matched tokens highlighted in `<mark>` elements without compromising accessibility.
- Monitor a dynamic reading goal cap with polite and assertive screen reader alerts.
- Persist data in the browser, export backups to JSON or spreadsheet CSV, and validate imports before overwriting.

---

## Core Features

- **Semantic Page Structure:** Header, navigation, main sections, and direct-body footer.
- **About Section:** Project objectives, developer contact details, and repository shortcuts.
- **Live Regex Search:** Real-time query compilation wrapped in `try/catch`, case-sensitivity checkbox, and inline error announcements.
- **Accessible Text Highlighting:** Matched substrings wrapped in `<mark>` with strict HTML escaping to prevent XSS.
- **Multi-Criteria Sorting:** Sort by Date Added (Newest / Oldest), Title (A↕Z), and Page Counts (↑↓), available via dropdown or table header buttons.
- **Inline Table Row Editing:** Update any row directly in place or via the dedicated Add/Edit form.
- **Reading Goal Cap Tracking:** Dynamic progress bar accompanied by polite announcements when under goal and assertive announcements when exceeded.
- **7-Day Trend Chart:** Responsive CSS bar visualization of entries logged over the last 7 calendar days.
- **Unit Conversions:** Switch display between pages and estimated reading minutes (2 min/page); standalone reading time calculator.
- **Full Data Persistence:** Auto-save to `localStorage` across additions, updates, and deletions.
- **JSON & CSV Backups:** Export validated JSON or formatted CSV; validate structure, fields, and calendar dates before importing.
- **Keyboard-First Flow:** Skip-to-content link, logical tab stops, visible focus outlines, and global hotkeys.
- **Stretch Additions:** Light/Dark theme toggle (persisted) and Service Worker offline caching (`sw.js`).

---

## Project Architecture & File Structure

Clean modular repository adhering strictly to vanilla standards without dependencies:

```text
book-notes-vault/
├── index.html          # Semantic HTML5 app markup and ARIA landmarks
├── tests.html          # Root test runner suite
├── seed.json           # 11 diverse test records (edge dates, decimals, tricky strings)
├── sw.js               # Service Worker for offline-first caching (Stretch)
├── README.md           # Comprehensive project documentation
├── .gitignore          # Configured git ignore rules
├── assets/
│   └── graduation.jpg  # Welcome hero imagery with alt text
├── styles/
│   └── main.css        # Mobile-first styles, CSS variables, glassmorphism, animations
├── scripts/
│   ├── app.js          # App lifecycle, event wiring, and keyboard shortcuts
│   ├── state.js        # Central state store and CRUD operations
│   ├── storage.js      # localStorage persistence, JSON/CSV export routines
│   ├── validators.js   # Regex validation formulas and semantic checks
│   ├── search.js       # Safe RegExp compiler, string sanitizer, highlighter
│   └── ui.js           # DOM table rendering, inline editing, chart, ARIA announcements
└── tests/
    ├── tests.html      # Sub-directory test runner
    └── tests.js        # Assertion test suite (regex, CRUD, import validation)
```

---

## Data Model

Each book or note record follows this standardized schema:

```json
{
  "id": "rec_0001",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "pages": "464",
  "tag": "Software-Design",
  "dateAdded": "2026-09-29",
  "createdAt": "2026-09-29T08:15:00.000Z",
  "updatedAt": "2026-09-29T08:15:00.000Z"
}
```

| Field | Type | Validation Rules & Constraints |
|---|---|---|
| `id` | `string` | Unique identifier generated as `rec_` prefix + timestamp / hash. |
| `title` | `string` | Required. No leading or trailing spaces. Multiple spaces forbidden. |
| `author` | `string` | Required. Same rules as `title`. |
| `pages` | `string` / `number` | Required. Positive number; integers or up to 2 decimal places. |
| `tag` | `string` | Required. Letters, single spaces, or hyphens only. |
| `dateAdded` | `string` | Required. Strict `YYYY-MM-DD` format verified against real calendar dates. |
| `createdAt` | `string` (ISO) | Set once upon record creation. |
| `updatedAt` | `string` (ISO) | Automatically updated whenever the record is edited. |

---

## Forms & Regex Validation

Validation occurs in real-time as users type (on `input` and `blur`) and enforces comprehensive checks on `submit`:

| Form Field | Regex Pattern | Purpose & Error Condition |
|---|---|---|
| **Title** | `/^\S(?:.*\S)?$/` | Forbids leading and trailing whitespace. |
| **Title (Advanced)** | `/\b(\w+)\s+\1\b/i` | Back-reference detecting repeated consecutive words (e.g. "Clean Clean"). |
| **Author** | `/^\S(?:.*\S)?$/` | Forbids leading and trailing whitespace. |
| **Pages** | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Rubric numeric rule: non-negative integers or up to 2 decimals. Must be > 0. |
| **Category / Tag** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, hyphens, and single spaces only. Rejects numbers and symbols. |
| **Date Added** | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Strict `YYYY-MM-DD` pattern. |
| **Calendar Check** | `isRealDate(dateString)` in JS | Rejects nonexistent dates like `2026-02-30` or `2025-02-29` (non-leap year). |

---

## Regex Catalog & Edge Cases

The Vault search bar accepts standard characters and advanced regular expressions. Toggle **Case insensitive** to append or remove the `i` flag:

| Query Pattern | What It Matches | Example Match | Edge Case Notes |
|---|---|---|---|
| `^Introduction` | Matches records starting with "Introduction" | "Introduction to Algorithms" | Anchored to start of string |
| `\b(\w+)\s+\1\b` | Repeated consecutive words via back-reference | "Thomas Thomas" | Catches duplicate author names or titles |
| `^(?=.*\bnotes?\b)` | Lookahead assertion for titles containing "note" or "notes" | "Advanced Calculus Notes" | Positive lookahead check |
| `\b\d{3,4}\b` | Three-to-four digit numbers | "450", "1248" | Matches specific page counts |
| `\.\d{2}\b` | Decimals with exactly two digits | "45.50", "315.25" | Finds fractional page numbers |
| `^[A-Z][a-z]+-[A-Z][a-z]+` | Hyphenated capitalized tag names | "Computer-Science" | Matches compound categories |
| `[a-z(]` *(malformed)* | Unclosed character class or group | N/A | Handled safely by compiler without crash |

---

## Safe Regex Search & Accessible Highlighting

1. **Safe Compilation:** Patterns pass through `compileRegex(input, isCaseInsensitive)` which utilizes a `try/catch` block. Invalid regular expressions do not break application flow; they trigger an inline `role="status"` message: *"Invalid regex: ..."* and set `aria-invalid="true"`.
2. **Accessible Highlighting:** The `highlight(text, regex)` function escapes raw HTML (`&`, `<`, `>`, `"`) prior to evaluation, preventing injection attacks. Matched substrings are wrapped in `<mark>` elements. Zero-width matches are skipped to prevent infinite loops.

```javascript
export function compileRegex(input, isCaseInsensitive = true) {
  if (!input || !input.trim()) return null;
  try {
    return new RegExp(input.trim(), isCaseInsensitive ? 'i' : '');
  } catch (error) {
    return null;
  }
}
```

---

## Dashboard, Goal Cap & ARIA Live Regions

The dashboard calculates real-time metrics across your collection:
- **Total Books & Notes:** Overall count of saved records.
- **Total Reading:** Aggregate pages (or converted minutes).
- **Top Category / Tag:** Most frequently occurring tag.
- **7-Day Trend Chart:** Accessible CSS bar chart showing records added by calendar day.
- **Reading Goal Cap:**
  - **Under Target:** Live message set to `aria-live="polite"`: *"450 / 1000 pages. 550 pages remaining to reach goal."*
  - **Over Target:** Live message automatically switches to `aria-live="assertive"`: *"1200 / 1000 pages. Reading goal exceeded by 200 pages!"*

---

## Units & Reading Time Conversions

- **Unit Toggle in Settings:** Switch between **Pages** and **Minutes** (1 page = 2 minutes).
- **Reading Time Calculator:** Enter any page count into the calculator tool in Settings to calculate estimated minutes and hours:
  $$\text{Reading Time} = \text{Pages} \times 2 \text{ minutes}$$
  $$\text{Hours} = \lfloor \text{Minutes} / 60 \rfloor, \quad \text{Remaining Mins} = \text{Minutes} \pmod{60}$$

---

## Persistence, JSON Validation & CSV Export

- **Auto-Persistence:** All CRUD operations immediately sync with `localStorage` (`bookVault:data` and `bookVault:settings`).
- **JSON Export:** Downloads formatted JSON backup file named `book-vault-backup-YYYY-MM-DD.json`.
- **CSV Export (Stretch):** Downloads RFC 4180 compliant CSV spreadsheet with properly escaped quotes and commas.
- **JSON Import Validation:**
  - Root element must be a non-empty Array.
  - Every record is validated against `isValidImportedRecord(record)`.
  - Malformed files are rejected with specific row error feedback without altering current data.
  - Valid files offer a prompt to **Merge** or **Replace** the existing vault.

---

## Keyboard Navigation Map

The app is completely navigable via keyboard alone:

| Key Binding | Action / Focus Destination |
|---|---|
| `Tab` / `Shift + Tab` | Navigate forward / backward through all interactive elements |
| `Enter` / `Space` | Activate buttons, sort headers, and links |
| `/` | Focus and select the live regex search input |
| `Alt + A` | Jump directly to Add Entry form (focus on Title input) |
| `Alt + D` | Smoothly scroll to Dashboard section |
| `Alt + R` | Smoothly scroll to Vault records collection |
| `Alt + S` | Smoothly scroll to Settings section |
| `Esc` | Cancel current edit mode or clear active search filter |
| `Ctrl + Enter` (or `Cmd + Enter`) | Save changes when inside an inline editing row |

---

## Accessibility & Contrast Audit (a11y)

- **Landmarks:** Distinct `<header>`, `<nav>`, `<main>`, `<section>`, and page-level `<footer>` landmarks.
- **Heading Order:** Single `<h1>` in the About section followed sequentially by `<h2>` for major sections and `<h3>` for cards.
- **Color Contrast:** All foreground text on surfaces meets or exceeds WCAG AA standards ($>4.5:1$ for body, $>3:1$ for large text).
- **Focus Rings:** Unbroken 3px high-contrast outline on `:focus-visible` states.
- **ARIA Live Regions:** Dedicated `#aria-polite` (`role="status"`) and `#aria-assertive` (`role="alert"`) regions.
- **Motion Reduction:** Full `@media (prefers-reduced-motion: reduce)` support disabling transitions and animations.

---

## Mobile-First Responsive Design

Layout scales smoothly across 3 standard breakpoints:
- **Small Mobile (~360px):** Single column, touch-friendly hit targets ($\ge 44\text{px}$), stacked settings and form actions. Table automatically converts into discrete card components.
- **Tablet (~768px):** Two-column stat grid, horizontal navigation bar, split form layout.
- **Desktop (~1024px+):** Full multi-column view, persistent controls bar, table view with sortable columns and hover elevation.

---

## Testing Suite & In-Browser Runner

To run automated test assertions:
1. Open `tests.html` or `tests/tests.html` in your web browser.
2. The suite executes assertions covering:
   - Title whitespace constraints and duplicate space rejection.
   - Numeric decimal and whole-number parsing (`^(0|[1-9]\d*)(\.\d{1,2})?$`).
   - Strict `YYYY-MM-DD` formatting and leap-year calendar validation.
   - Category/tag regex validation.
   - Advanced regex back-references (`\b(\w+)\s+\1\b`) and lookaheads.
   - Safe regex compiler error resilience.
   - HTML-escaped match highlighting.
   - Complete state CRUD lifecycle (Add, Update, Delete).

---

## Demo Video Breakdown

The 2–3 minute unlisted demonstration covers:
1. **Introduction & Semantic Landmarks (0:00 – 0:30):** Header, navigation landmarks, theme toggle, and About section.
2. **Keyboard Navigation & Shortcuts (0:30 – 1:00):** Tabbing flow, skip link, `/` search focus, `Alt+A/D/R/S` navigation, and inline editing.
3. **Regex Search & Highlighting (1:00 – 1:30):** Live regex query matching, case-sensitivity toggle, `<mark>` wrapping, and syntax error safety.
4. **Form Validation & Edge Cases (1:30 – 2:00):** Empty fields, leading whitespace, duplicate words, invalid calendar dates (`2026-02-30`), and decimal page entries.
5. **Persistence, Import & Export (2:00 – 2:30):** `localStorage` persistence, JSON/CSV export, and malformed import error handling.
6. **Responsiveness (2:30 – 3:00):** DevTools view demonstrating mobile table-to-card transformation at 360px and 768px.

---

## Deployment Guide

The application is deployed on **GitHub Pages**:
1. Code pushed to `main` branch on GitHub.
2. Under **Settings → Pages**, source set to **Deploy from a branch** (`main`, `/ (root)`).
3. Access live deployment at: [https://kubanaherve.github.io/book-notes-vault/](https://kubanaherve.github.io/book-notes-vault/)

---

## Development Milestones (M1–M7)

| Milestone | Scope | Deliverables | Status |
|---|---|---|---|
| **M1** | Specification & Planning | Data model, accessibility plan, landmark architecture | Complete |
| **M2** | Semantic Structure & Base CSS | Semantic HTML5 layout, mobile-first CSS, flexbox/grid styling | Complete |
| **M3** | Forms & Regex Validation | 5+ regex rules (including back-reference and lookahead), inline error UI, `tests.html` | Complete |
| **M4** | Render, Sort & Regex Search | Multi-criteria sorting, safe compiler, case toggle, accessible `<mark>` highlight | Complete |
| **M5** | Stats & Goal Cap Logic | Total metrics, 7-day trend chart, polite/assertive ARIA live region | Complete |
| **M6** | Persistence & Settings | `localStorage`, JSON import validation, CSV export, unit conversions | Complete |
| **M7** | Polish & Accessibility Audit | Keyboard map, visible focus rings, theme toggle, service worker, README | Complete |
