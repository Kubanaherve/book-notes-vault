# � Book & Notes Vault

A simple web application for organizing books and academic notes.

| Project Details | Information |
|---|---|
| Project Name | Book & Notes Vault |
| Developer | KUBANA Herve Friend |
| GitHub Username | @Kubanaherve |
| Institution | African Leadership University (ALU) |
| Selected Theme | Book & Notes Vault |
| Technologies | HTML, CSS, Vanilla JavaScript |
| Deployment | GitHub Pages |

**Live Website:** [Add your GitHub Pages link here]

**Demo Video:** [Add your unlisted YouTube or Google Drive link here]

**GitHub Repository:** [Add your repository link here]

---

## 1. About My Project

I built Book & Notes Vault to help students organize their books, textbooks, and academic notes in one place.

Students use different learning materials for their courses. Keeping track of titles, authors, page counts, and categories can become difficult. This application provides a simple way to manage that information.

Users can add books, edit their details, delete records, search for specific books, and view information about their collection. The application uses the browser's localStorage to save records, allowing users to access their collection again after refreshing the page.

I used HTML to structure the application, CSS to design the interface, and Vanilla JavaScript to implement its functionality. The project does not require a JavaScript framework or a database server.

2. My Main Goals

* Make it easier for students to organize their reading materials.
* Allow users to search for books and notes quickly.
* Help users keep track of their reading progress.
* Make it possible to add, edit, and delete records.
* Save records in the browser so they are still available after refreshing the page.
* Allow users to import and export their records using JSON files.
* Make the application simple to use on both computers and mobile devices.

⸻

3. Main Features

The application includes the following features:

* Add Records: Users can add books and academic notes with their details.
* Edit Records: Users can update information about existing records.
* Delete Records: Users can remove records they no longer need.
* Search: Users can search for records using regular expressions (regex).
* Search Highlighting: Matching text is highlighted in the search results.
* Sorting: Users can organize records according to available sorting options.
* Dashboard: Users can view statistics about their collection.
* Local Storage: Records are saved in the browser using localStorage.
* JSON Export: Users can download their records as a JSON file.
* JSON Import: Users can import records from a JSON file.
* Reading Progress: Users can track their reading progress.
* Reading Time Estimate: Users can estimate reading time using the number of pages and a reading speed.
* Responsive Design: The interface adjusts to different screen sizes.

⸻

4. Regular Expressions (Regex)

I used regular expressions to validate information and help users search through their records.

Regular expressions are patterns used to check whether text matches a particular format.

Validation Rules

The application uses the following regex patterns for different validation tasks.

Rule 1: Title and Author Validation

/^\S(?:.*\S)?$/

This checks that the text does not start or end with whitespace. It helps prevent titles and author names from containing unnecessary spaces at the beginning or end.

Rule 2: Number Validation

/^(0|[1-9]\d*)(\.\d{1,2})?$/

This checks for non-negative numbers, including decimal numbers with up to two decimal places. It can be used for fields that accept numerical values.

Rule 3: Date Format Validation

/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

This checks whether a date follows the YYYY-MM-DD format. It checks the format but does not confirm that every date is a valid calendar date.

Rule 4: Tag Validation

/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/

This allows tags containing letters, spaces, or hyphens. It does not allow numbers or most special characters.

Rule 5: Repeated Word Detection

/\b(\w+)\s+\1\b/i

This detects a word that is repeated immediately after itself, such as “book book”. The i flag makes the check case-insensitive.

These patterns are examples of the validation rules used in the project. They should match the actual validation logic implemented in the application.

Search Examples

Users can also use regex patterns to find specific records.

Pattern	What It Does
/Clean/i	Finds text containing “Clean”, regardless of letter case.
/\bCode\b/i	Finds the word “Code” as a whole word.
/^Data/	Finds text that starts with “Data”.
/\b(\w+)\s+\1\b/i	Finds a repeated word.
/[0-9]{3,}/	Finds text containing three or more consecutive digits.

⸻

5. Dashboard and Statistics

The dashboard helps users understand their collection without having to count everything manually.

Depending on the records saved in the application, the dashboard can display information such as:

* Total number of books and notes.
* Total pages in the collection.
* Reading progress.
* Number of records in different categories.
* Estimated reading time.

The dashboard gets its information from the records stored in the application.

For example, if a user has five books with 100 pages each, the total number of pages is 500.

The statistics change when users add, edit, or delete records.

⸻

6. Data Storage

The application uses the browser’s localStorage to save records.

This means users can refresh the page and still access their saved information in the same browser.

The application does not require a separate database server.

However, localStorage has some limitations:

* Data is normally available only in the browser where it was saved.
* Clearing browser data may remove saved records.
* Records are not automatically synchronized between different devices.
* Users can export their records as a backup.

JSON Import and Export

The application supports JSON files for transferring records.

Exporting records:

1. Open the application.
2. Select the export option.
3. Download the JSON file.
4. Keep the file somewhere safe as a backup.

Importing records:

1. Open the application.
2. Select the import option.
3. Choose a JSON file.
4. Follow the application’s instructions to complete the import.

Users should keep a backup of important records before importing new data.

⸻

7. Reading Progress and Time Estimation

The application helps users organize their reading and understand how much time they may need to finish a book.

The reading time estimate can be calculated using the number of pages and the average reading speed.

For example, if a book has 120 pages and a user reads 30 pages per hour:

Reading time = 120 ÷ 30 = 4 hours.

This is only an estimate. Actual reading time depends on the difficulty of the material and the user’s reading speed.

If the application includes a reading limit, the dashboard can also help users compare their reading progress with that limit.

⸻

8. Design and Accessibility

I designed the application to be simple and easy to understand.

The main design goals are:

* Keep the interface clear and organized.
* Use readable text and understandable labels.
* Make important actions easy to find.
* Provide feedback when users interact with the application.
* Make the layout work on different screen sizes.
* Support keyboard navigation where implemented.

I also considered accessibility when organizing the interface. Buttons, forms, labels, and other interactive elements should be understandable and usable.

⸻

9. Responsive Design

The application is designed to work on different screen sizes, including computers, tablets, and mobile phones.

The layout adjusts to the available screen width so users can manage their records on different devices.

The main screen sizes considered during development are:

* Mobile: Around 360 pixels wide.
* Tablet: Around 768 pixels wide.
* Desktop: Around 1024 pixels wide and above.

These are reference screen sizes rather than strict device requirements.

⸻

10. Project Structure

The project uses HTML, CSS, and Vanilla JavaScript.

The files are organized to separate the page structure, styling, application logic, data storage, and validation.

The project structure may look like this:

Book-Notes-Vault/
│
├── index.html
├── tests.html
├── seed.json
├── README.md
├── .gitignore
│
├── styles/
│   └── styles.css
│
├── scripts/
│   ├── main.js
│   ├── storage.js
│   ├── state.js
│   ├── ui.js
│   ├── validators.js
│   └── search.js
│
└── assets/
    └── images/

Each file has a specific purpose:

* index.html contains the main page structure.
* tests.html contains the project’s test page.
* seed.json contains sample records.
* README.md explains the project and how to use it.
* styles.css contains the application’s styling.
* main.js connects the main application features.
* storage.js handles saving and loading records.
* state.js manages application state.
* ui.js handles interface updates.
* validators.js contains validation functions.
* search.js contains search-related functions.
* assets/images/ stores image assets used by the project.

The exact structure should match the files in the final GitHub repository.

⸻

11. How to Run the Application

The application uses standard web technologies and does not require a framework.

Option 1: Open the HTML File

1. Download or clone the project repository.
2. Open the project folder.
3. Open index.html in a web browser.
4. Start using the application.

Option 2: Use a Local Server

If the application needs to be served locally, Python can be used to start a simple web server.

Open a terminal in the project folder and run:

python -m http.server 8000

Then open the following address in your browser:

http://localhost:8000

If Python is not installed, another local development server can be used.

⸻

12. How to Use the Application

Adding a Record

1. Open the application.
2. Find the form for adding a book or note.
3. Enter the required information.
4. Submit the form.
5. Check that the new record appears in the collection.

Searching for Records

1. Find the search field.
2. Enter a search term or supported regex pattern.
3. View the matching records.
4. Clear or change the search to see other records.

Sorting Records

1. Find the sorting option.
2. Select the preferred sorting method.
3. View the records in the selected order.

Editing a Record

1. Find the record you want to change.
2. Select its edit option.
3. Update the information.
4. Save the changes.

Deleting a Record

1. Find the record you want to remove.
2. Select its delete option.
3. Confirm the action if the application asks for confirmation.

Exporting Records

Use the export option to download your collection as a JSON file.

Importing Records

Use the import option to select a JSON file and load its records into the application.

The available options and exact steps depend on the final interface.

⸻

13. Testing

Testing helps me check whether the application works as expected.

The project includes a tests.html page for testing the implemented functionality.

The main areas to test include:

Feature	What to Check
Add Record	A valid record can be added.
Edit Record	An existing record can be updated.
Delete Record	A record can be removed.
Validation	Invalid input is handled correctly.
Regex Search	Matching records appear in the results.
Search Highlighting	Matching text is highlighted where supported.
Sorting	Records appear in the selected order.
Local Storage	Saved records remain after refreshing the page.
JSON Export	Records can be exported to a JSON file.
JSON Import	A valid JSON file can be imported.
Dashboard	Statistics reflect the saved records.
Responsive Design	The interface remains usable on different screen sizes.
Keyboard Navigation	Interactive elements can be accessed using the keyboard.

These are the main test cases for the project. The results should be updated based on the tests actually performed.

⸻

14. Sample Data

The project uses a seed.json file to provide sample records for testing and demonstration.

The sample data helps demonstrate how the application works before users enter their own information.

The records can include details such as:

* Book or note title.
* Author.
* Category or tags.
* Number of pages.
* Reading progress.
* Other fields supported by the application.

The sample file should contain at least 10 records if required by the project assignment.

The structure of each record should follow the format expected by the application.

⸻

15. GitHub Pages Deployment

GitHub Pages can be used to publish the application online.

After deployment, users can open the website using its public link without downloading the project files.

The deployment process includes:

1. Uploading the project files to the GitHub repository.
2. Opening the repository settings.
3. Finding the Pages section.
4. Selecting the appropriate branch and folder.
5. Saving the deployment settings.
6. Opening the published website to check that it works.

The live website link will be added at the top of this README after deployment.

Live Website: [Add your GitHub Pages link here]

GitHub Repository: [Add your repository link here]

⸻

16. Demo Video

The demo video shows the Book & Notes Vault application and demonstrates its main features.

It provides a short overview of how users can manage records, search for books and notes, and use the other features available in the application.

Watch the Demo Video: [Add your unlisted YouTube or Google Drive link here]

⸻

17. What I Learned

While working on this project, I learned more about building a web application using HTML, CSS, and Vanilla JavaScript.

Some of the main things I practiced were:

* Organizing files in a web project.
* Creating forms and handling user input.
* Using JavaScript to add, edit, and delete records.
* Saving data with localStorage.
* Using regular expressions for validation and searching.
* Working with JSON data.
* Updating the interface when the data changes.
* Testing features and fixing errors.
* Making a web page responsive.
* Publishing a website using GitHub Pages.

This project helped me understand how different parts of a web application work together.

⸻

18. Development Process

I worked on the project in stages so I could build the main features and test them as I progressed.

The main development milestones were:

* M1: Project Setup — Organizing the files and creating the basic HTML structure.
* M2: Page Design — Styling the interface using CSS.
* M3: Record Management — Adding functionality to create, edit, and delete records.
* M4: Data Storage — Saving and loading records with localStorage.
* M5: Search and Validation — Adding regex search and input validation.
* M6: Extra Features — Working on the dashboard, sorting, and JSON import/export.
* M7: Testing and Deployment — Testing the application, preparing the documentation, and publishing the website.

The milestones describe the development stages. The final README should reflect the work completed in the submitted version.

⸻

19. Developer

Name: KUBANA Herve Friend

Institution: African Leadership University (ALU)

GitHub: @Kubanaherve

Project: Book & Notes Vault