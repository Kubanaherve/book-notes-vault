// 1. Description/Title: forbid leading/trailing spaces, collapse doubles
export const titleRegex = /^\S(?:.*\S)?$/;

// 2. Numeric Field: integers or up to 2 decimal places
export const numericRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// 3. Date (YYYY-MM-DD)
export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 4. Category/Tag: Letters, spaces, hyphens
export const tagRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// 5. Advanced Regex: Detect repeated words (e.g., duplicated author surnames)
export const repeatedWordRegex = /\b(\w+)\s+\1\b/i;

export function validateRecord(record) {
  const errors = {};
  if (!titleRegex.test(record.title)) errors.title = "Invalid title. No leading/trailing spaces.";
  if (!titleRegex.test(record.author)) errors.author = "Invalid author name.";
  if (!numericRegex.test(record.pages)) errors.pages = "Must be a valid positive number.";
  if (!tagRegex.test(record.tag)) errors.tag = "Tags can only contain letters, spaces, and hyphens.";
  if (!dateRegex.test(record.dateAdded)) errors.dateAdded = "Must be YYYY-MM-DD.";
  return errors;
}
