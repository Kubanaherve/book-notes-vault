
Code is separated by responsibility to make it easier to read, test, and maintain.

---

## 10. How to Run the Application

No framework, database, or build step is required.

### Option 1: Open the File

1. Download or clone the repository.
2. Open the folder.
3. Open `index.html` in a modern browser.

If the browser blocks JavaScript modules when opened this way, use Option 2.

### Option 2: Local Server

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

---

## 11. How to Use the Application

1. **Open the app** locally or on the GitHub Pages site.
2. **Add a book** by filling in the form and submitting it.
3. **Search** by typing a word or regex pattern. Turn on case-insensitive mode if needed.
4. **Sort** by title, date added, or page count.
5. **Edit or delete** a record using its action buttons. Confirm deletions when asked.
6. **Check the dashboard** for totals, top tag, recent activity, and the reading cap. Switch between pages and minutes as needed.
7. **Export** your data from Settings and keep the file safe.
8. **Import** a backup file. If it is invalid, read the error, fix the file, and try again.

---

## 12. Testing

### Automated Tests (`tests.html`)

Open `tests.html` in the browser to run the regex tests. They cover:

- Titles and authors with valid and invalid whitespace
- Page counts with valid and invalid formats
- Valid date formats and impossible calendar dates
- Tags with valid and invalid characters
- Repeated-word detection
- Invalid search patterns

### Manual Tests

| Test | Expected Result |
|---|---|
| Add a book | The record appears in the collection |
| Enter invalid data | An error explains the problem |
| Edit a book | The updated details appear |
| Delete a book | The record is removed after confirmation |
| Sort records | Records appear in the selected order |
| Search for a match | Matching records appear and are highlighted |
| Enter an invalid regex | An error appears without crashing |
| Refresh the page | Saved records remain |
| Export JSON | A backup file downloads |
| Import valid JSON | Data loads successfully |
| Import invalid JSON | An error appears and existing data is kept |
| Exceed the reading cap | The dashboard shows and announces the overage |
| Change the unit | Displayed values update correctly |
| Use only the keyboard | All main features work |
| Resize the browser | The layout adapts |

---

## 13. Sample Data

`seed.json` contains at least 10 valid records for demonstration and testing. The sample includes:

- Books with small and large page counts
- Different tags
- Several dates, including a leap-year date
- Multi-word titles
- Author names that trigger repeated-word detection
- Varied timestamps, so sorting can be demonstrated

Invalid data is kept separate and used only to show error handling.

---

## 14. GitHub Pages Deployment

1. Push the project to the GitHub repository.
2. Open **Settings → Pages**.
3. Select the correct branch and folder.
4. Save and wait for publishing to finish.
5. Open the site and test the main features, including saving, CSS, and JavaScript.

---

## 15. Demo Video

The demo is 2–3 minutes long and covers:

| Time | Content |
|---|---|
| 0:00–0:20 | Project purpose |
| 0:20–0:40 | Main page and dashboard |
| 0:40–1:00 | Keyboard navigation |
| 1:00–1:25 | Adding or editing a book, with validation |
| 1:25–1:45 | Regex search and an invalid pattern |
| 1:45–2:05 | JSON export and import |
| 2:05–2:30 | Responsive layout, reading cap, or unit conversion |

---

## 16. Development Process

| Milestone | Focus |
|---|---|
| **M1** | Specification and wireframes |
| **M2** | HTML and CSS |
| **M3** | Forms and regex validation |
| **M4** | Rendering, sorting, and search |
| **M5** | Dashboard and reading cap |
| **M6** | Persistence and JSON import/export |
| **M7** | Accessibility, documentation, and deployment |

---

## 17. Submission Checklist

**Features**
- [ ] About section with purpose and contact information
- [ ] Dashboard shows the required statistics
- [ ] Add, edit, and delete work
- [ ] Sorting by title, date, and page count
- [ ] Regex search handles invalid patterns
- [ ] Matches are highlighted safely
- [ ] Reading cap and unit conversion work

**Data**
- [ ] Records have unique IDs and timestamps
- [ ] Data is saved in `localStorage` and survives a refresh
- [ ] JSON export produces a valid backup
- [ ] Invalid imports leave existing data unchanged
- [ ] All five regex rules are implemented and tested
- [ ] `seed.json` has at least 10 records
- [ ] `tests.html` runs successfully

**Accessibility and Design**
- [ ] Semantic HTML throughout
- [ ] Every form field has a label
- [ ] Skip link works
- [ ] Focus indicators are visible
- [ ] Live regions announce important changes
- [ ] Full keyboard navigation works
- [ ] Layout works at 360 px, 768 px, and 1024 px
- [ ] Contrast is adequate
- [ ] At least one CSS transition or animation

**Submission**
- [ ] Code is organized into clear files
- [ ] Commit history reflects the work
- [ ] GitHub Pages site works
- [ ] Live website link is in this README
- [ ] Demo video is 2–3 minutes and accessible
- [ ] All links are tested

---

## 18. What I Learned

- Building a web app with HTML, CSS, and JavaScript, without a framework
- Using regular expressions for validation and search
- Managing application state and updating the page
- Saving data with `localStorage`
- Working with JSON data and validating it before use
- Designing accessible forms and interfaces
- Making a layout responsive
- Testing and deploying with GitHub Pages

---

## Developer

**KUBANA Herve Friend**
African Leadership University (ALU)
GitHub: [@Kubanaherve](https://github.com/Kubanaherve)
