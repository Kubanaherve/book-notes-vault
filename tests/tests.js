const results = document.getElementById('test-results');

function assert(description, condition) {
  const li = document.createElement('li');
  const status = condition ? '<span class="pass">PASS</span>' : '<span class="fail">FAIL</span>';
  li.innerHTML = `${status} - ${description}`;
  results.appendChild(li);
}

// 1. Title/Description: Forbid leading/trailing spaces and collapse doubles
const titleRegex = /^\S(?:.*\S)?$/;
assert('Title validation accepts normal strings ("Clean Code")', titleRegex.test('Clean Code'));
assert('Title validation rejects leading spaces (" Clean Code")', !titleRegex.test(' Clean Code'));
assert('Title validation rejects trailing spaces ("Clean Code ")', !titleRegex.test('Clean Code '));

// 2. Numeric (Pages): Accepts integers and up to 2 decimal places
const numRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
assert('Numeric validation accepts whole numbers ("45")', numRegex.test('45'));
assert('Numeric validation accepts decimals ("12.50")', numRegex.test('12.50'));
assert('Numeric validation rejects negative numbers ("-5")', !numRegex.test('-5'));
assert('Numeric validation rejects letters ("abc")', !numRegex.test('abc'));

// 3. Date: Strict YYYY-MM-DD
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
assert('Date validation accepts valid calendar dates ("2026-10-13")', dateRegex.test('2026-10-13'));
assert('Date validation rejects malformed dates ("13-10-2026")', !dateRegex.test('13-10-2026'));

// 4. Category/Tag: Letters, spaces, and hyphens only
const tagRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
assert('Tag validation accepts hyphenated words ("Software-Engineering")', tagRegex.test('Software-Engineering'));
assert('Tag validation rejects numbers ("Web2")', !tagRegex.test('Web2'));

// 5. Advanced (Back-reference): Detect duplicate words
const dupRegex = /\b(\w+)\s+\1\b/i;
assert('Advanced Regex detects duplicate consecutive words ("Thomas Thomas")', dupRegex.test('Thomas Thomas'));
assert('Advanced Regex ignores normal consecutive words ("Robert Martin")', !dupRegex.test('Robert Martin'));
