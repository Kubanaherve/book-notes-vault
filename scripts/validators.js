/**
 * Regex Validation Rules and Utilities for Book & Notes Vault
 */

// 1. Title/Description: Forbid leading and trailing spaces, internal content allowed
export const titleRegex = /^\S(?:.*\S)?$/;

// Helper to check for multiple consecutive spaces
export const doubleSpaceRegex = /\s{2,}/;

// 2. Numeric field (Pages): Non-negative number, allows integers and up to 2 decimal places
// Pattern from rubric: ^(0|[1-9]\d*)(\.\d{1,2})?$
export const numericRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// 3. Date: Strict YYYY-MM-DD pattern
export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 4. Category/Tag: Letters, single internal spaces, or hyphens
export const tagRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// 5. Advanced Regex: Back-reference to detect duplicate consecutive words
export const repeatedWordRegex = /\b(\w+)\s+\1\b/i;

// 6. Advanced Regex: Lookahead to find notes/study keywords
export const lookaheadNotesRegex = /^(?=.*\bnotes?\b)/i;

// 7. Optional ISBN pattern for book cataloging (ISBN-10 or ISBN-13 with optional hyphens)
export const isbnRegex = /^(?:97[89][- ]?)?\d{9}[\dX]$/i;

/**
 * Validates whether a date string is an authentic calendar date
 * (e.g., rejects 2026-02-30 or non-leap year Feb 29)
 * @param {string} dateString - YYYY-MM-DD
 * @returns {boolean}
 */
export function isRealDate(dateString) {
  if (!dateString || !dateRegex.test(dateString)) {
    return false;
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

/**
 * Validates a book or note record object
 * @param {Object} record - The record to validate
 * @returns {Object} Error messages mapped by field name, empty if valid
 */
export function validateRecord(record) {
  const errors = {};

  // Title validation
  const title = (record.title || '').trim();
  if (!title) {
    errors.title = 'Title is required.';
  } else if (!titleRegex.test(record.title)) {
    errors.title = 'Title must not start or end with whitespace.';
  } else if (doubleSpaceRegex.test(record.title)) {
    errors.title = 'Title must not contain multiple consecutive spaces.';
  } else if (repeatedWordRegex.test(record.title)) {
    errors.title = 'Title contains repeated consecutive words (e.g. "Clean Clean").';
  }

  // Author validation
  const author = (record.author || '').trim();
  if (!author) {
    errors.author = 'Author name is required.';
  } else if (!titleRegex.test(record.author)) {
    errors.author = 'Author name must not start or end with whitespace.';
  } else if (doubleSpaceRegex.test(record.author)) {
    errors.author = 'Author name must not contain multiple consecutive spaces.';
  }

  // Pages validation (rubric: ^(0|[1-9]\d*)(\.\d{1,2})?$)
  const pagesRaw = record.pages !== undefined && record.pages !== null ? String(record.pages).trim() : '';
  if (!pagesRaw) {
    errors.pages = 'Number of pages is required.';
  } else if (!numericRegex.test(pagesRaw)) {
    errors.pages = 'Pages must be a valid number (e.g., 250 or 45.50).';
  } else if (Number(pagesRaw) <= 0) {
    errors.pages = 'Pages must be greater than zero.';
  }

  // Tag validation
  const tag = (record.tag || '').trim();
  if (!tag) {
    errors.tag = 'Tag / Category is required.';
  } else if (!tagRegex.test(record.tag)) {
    errors.tag = 'Tags can only contain letters, single spaces, or hyphens (no numbers or symbols).';
  }

  // Date validation
  const dateAdded = (record.dateAdded || '').trim();
  if (!dateAdded) {
    errors.dateAdded = 'Date added is required.';
  } else if (!dateRegex.test(dateAdded)) {
    errors.dateAdded = 'Date must be formatted as YYYY-MM-DD.';
  } else if (!isRealDate(dateAdded)) {
    errors.dateAdded = 'Please enter a real calendar date (e.g., 2026-02-28).';
  }

  return errors;
}

/**
 * Validates an imported record from a JSON backup file
 * @param {Object} record - Candidate record
 * @returns {boolean} True if structurally and semantically valid
 */
export function isValidImportedRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return false;
  }

  if (
    typeof record.id !== 'string' ||
    !record.id.trim() ||
    typeof record.title !== 'string' ||
    typeof record.author !== 'string' ||
    typeof record.tag !== 'string'
  ) {
    return false;
  }

  const errors = validateRecord({
    title: record.title,
    author: record.author,
    pages: String(record.pages),
    tag: record.tag,
    dateAdded: record.dateAdded
  });

  return Object.keys(errors).length === 0;
}