/**
 * Safe Regex Search and Accessible Match Highlighting Module
 */

/**
 * Escapes HTML characters in a string to prevent XSS and broken DOM rendering
 * @param {string} str 
 * @returns {string} Escaped HTML string
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Safely compiles a user-provided regex pattern string
 * @param {string} input - User regex pattern
 * @param {boolean} isCaseInsensitive - Whether to apply the 'i' flag
 * @returns {RegExp|null} Compiled RegExp instance or null on error/empty
 */
export function compileRegex(input, isCaseInsensitive = true) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const flags = isCaseInsensitive ? 'i' : '';
    return new RegExp(trimmed, flags);
  } catch (error) {
    return null; // Gracefully handle malformed expressions
  }
}

/**
 * Wraps matching parts of text inside an accessible <mark> tag without breaking HTML
 * @param {string} text - Raw text to highlight
 * @param {RegExp|null} regex - Pattern to search for
 * @returns {string} HTML string with <mark> tags around matches
 */
export function highlight(text, regex) {
  if (text === null || text === undefined) return '';
  const escapedText = escapeHtml(text);
  if (!regex) return escapedText;

  try {
    // Ensure global flag is set for replacing all occurrences
    let flags = regex.flags || '';
    if (!flags.includes('g')) {
      flags += 'g';
    }
    const globalRegex = new RegExp(regex.source, flags);

    return escapedText.replace(globalRegex, match => {
      // Don't mark zero-length matches (e.g. ^ or $)
      if (!match) return match;
      return `<mark>${match}</mark>`;
    });
  } catch (error) {
    return escapedText;
  }
}

/**
 * Checks if any searchable field in a record matches a given regex
 * @param {Object} record - Book or note record
 * @param {RegExp|null} regex - Compiled regex pattern
 * @returns {boolean} True if matches or if regex is null
 */
export function matchesRecord(record, regex) {
  if (!regex) return true;
  if (!record) return false;

  const fieldsToSearch = [
    record.title,
    record.author,
    record.tag,
    String(record.pages || ''),
    record.dateAdded
  ];

  return fieldsToSearch.some(field => field && regex.test(String(field)));
}
