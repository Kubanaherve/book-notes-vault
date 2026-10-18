import {
  titleRegex,
  numericRegex,
  dateRegex,
  tagRegex,
  repeatedWordRegex,
  lookaheadNotesRegex,
  isRealDate,
  validateRecord,
  isValidImportedRecord
} from '../scripts/validators.js';
import { compileRegex, highlight } from '../scripts/search.js';
import { state } from '../scripts/state.js';

const results = document.getElementById('test-results');

function assert(description, condition) {
  const li = document.createElement('li');
  const status = condition ? '<span class="pass">PASS</span>' : '<span class="fail">FAIL</span>';
  li.innerHTML = `${status} - ${description}`;
  if (results) {
    results.appendChild(li);
  }
  return condition;
}

// Group 1: Title Validation (Forbid leading/trailing spaces, collapse doubles)
assert('Title validation accepts valid clean title ("Clean Code")', titleRegex.test('Clean Code'));
assert('Title validation rejects leading spaces (" Clean Code")', !titleRegex.test(' Clean Code'));
assert('Title validation rejects trailing spaces ("Clean Code ")', !titleRegex.test('Clean Code '));

// Group 2: Numeric Validation (Pages: non-negative integers or up to 2 decimal places)
// Rubric formula: ^(0|[1-9]\d*)(\.\d{1,2})?$
assert('Numeric validation accepts whole numbers ("45")', numericRegex.test('45'));
assert('Numeric validation accepts two decimals ("12.50")', numericRegex.test('12.50'));
assert('Numeric validation accepts single decimal ("3.5")', numericRegex.test('3.5'));
assert('Numeric validation rejects negative numbers ("-5")', !numericRegex.test('-5'));
assert('Numeric validation rejects alphabetic strings ("abc")', !numericRegex.test('abc'));
assert('Numeric validation rejects 3 decimal places ("12.345")', !numericRegex.test('12.345'));

// Group 3: Date Validation (Strict YYYY-MM-DD + Calendar validity)
assert('Date regex accepts valid format ("2026-10-13")', dateRegex.test('2026-10-13'));
assert('Date regex rejects reverse format ("13-10-2026")', !dateRegex.test('13-10-2026'));
assert('Date calendar check accepts leap year ("2024-02-29")', isRealDate('2024-02-29'));
assert('Date calendar check rejects impossible date ("2026-02-30")', !isRealDate('2026-02-30'));
assert('Date calendar check rejects April 31st ("2026-04-31")', !isRealDate('2026-04-31'));

// Group 4: Category / Tag (Letters, spaces, hyphens)
assert('Tag validation accepts hyphenated terms ("Software-Engineering")', tagRegex.test('Software-Engineering'));
assert('Tag validation accepts spaced terms ("Computer Science")', tagRegex.test('Computer Science'));
assert('Tag validation rejects terms with numbers ("Web2")', !tagRegex.test('Web2'));
assert('Tag validation rejects special punctuation ("Study@Home")', !tagRegex.test('Study@Home'));

// Group 5: Advanced Regex (Back-reference for duplicate consecutive words)
assert('Back-reference regex detects repeated words ("Thomas Thomas")', repeatedWordRegex.test('Thomas Thomas'));
assert('Back-reference regex detects repeated words case-insensitively ("Data data")', repeatedWordRegex.test('Data data'));
assert('Back-reference regex ignores distinct words ("Robert Martin")', !repeatedWordRegex.test('Robert Martin'));

// Group 6: Advanced Regex (Lookahead for notes keyword)
assert('Lookahead regex finds "notes" keyword ("Lecture Notes on Algorithms")', lookaheadNotesRegex.test('Lecture Notes on Algorithms'));
assert('Lookahead regex ignores titles without "notes" ("Discrete Mathematics")', !lookaheadNotesRegex.test('Discrete Mathematics'));

// Group 7: Safe Regex Compiler
const validCompiled = compileRegex('^Intro', true);
assert('compileRegex compiles valid pattern without error', validCompiled instanceof RegExp);
const invalidCompiled = compileRegex('[a-z(', true);
assert('compileRegex fails gracefully and returns null on malformed regex', invalidCompiled === null);

// Group 8: Match Highlighting with Accessible <mark>
const highlighted = highlight('Introduction to Algorithms', compileRegex('Algorithms', true));
assert('highlight wraps matched substring in <mark>', highlighted.includes('<mark>Algorithms</mark>'));
const escapedHighlight = highlight('<b>Dangerous</b>', compileRegex('Dangerous', true));
assert('highlight escapes HTML to prevent injection', escapedHighlight.includes('&lt;b&gt;'));

// Group 9: Record Validation and Import
const validSample = {
  title: 'Clean Architecture',
  author: 'Robert C. Martin',
  pages: '432',
  tag: 'Software-Design',
  dateAdded: '2025-01-15'
};
assert('validateRecord returns zero errors on complete valid record', Object.keys(validateRecord(validSample)).length === 0);

const invalidSample = {
  title: ' Clean Architecture ',
  author: '',
  pages: 'abc',
  tag: 'Tag123',
  dateAdded: '2026-02-30'
};
const foundErrors = validateRecord(invalidSample);
assert('validateRecord catches title whitespace', Boolean(foundErrors.title));
assert('validateRecord catches empty author', Boolean(foundErrors.author));
assert('validateRecord catches non-numeric pages', Boolean(foundErrors.pages));
assert('validateRecord catches invalid tag characters', Boolean(foundErrors.tag));
assert('validateRecord catches impossible calendar date', Boolean(foundErrors.dateAdded));

// Group 10: State CRUD Operations
const testRecord = {
  title: 'Test Vault Entry',
  author: 'Unit Tester',
  pages: '100',
  tag: 'Testing',
  dateAdded: '2026-01-01'
};
state.addRecord(testRecord);
const added = state.records.find(r => r.title === 'Test Vault Entry');
assert('state.addRecord creates record with unique id and createdAt', added && Boolean(added.id) && Boolean(added.createdAt));

if (added) {
  state.updateRecord(added.id, { pages: '150' });
  const updated = state.records.find(r => r.id === added.id);
  assert('state.updateRecord updates field and refreshes updatedAt', updated && updated.pages === '150' && Boolean(updated.updatedAt));

  state.deleteRecord(added.id);
  const deleted = state.records.find(r => r.id === added.id);
  assert('state.deleteRecord removes record from collection', !deleted);
}
