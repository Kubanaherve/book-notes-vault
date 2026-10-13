export function compileRegex(input, isCaseInsensitive = true) {
  try {
    const flags = isCaseInsensitive ? 'i' : '';
    return input ? new RegExp(input, flags) : null;
  } catch (error) {
    return null; // Fail gracefully if regex is malformed
  }
}

export function highlight(text, regex) {
  if (!regex) return text;
  const str = String(text);
  return str.replace(regex, match => `<mark>${match}</mark>`);
}
