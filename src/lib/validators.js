// Shared react-hook-form validators.

// Rejects a value made up ENTIRELY of special characters / whitespace — the value
// must contain at least one letter or number (any language, via Unicode props).
// Empty is allowed here so the separate `required` rule owns emptiness.
//
// Use as a react-hook-form `validate`:  register('title', { required: '…', validate: notOnlySpecial })
export const notOnlySpecial = (value) =>
  !value || /[\p{L}\p{N}]/u.test(value) || 'Cannot contain only special characters';

// Absolute http(s) URL. Empty is allowed (optional field); `required` owns emptiness.
export const isUrl = (value) => {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:' ? true : 'Enter a valid URL (https://…)';
  } catch {
    return 'Enter a valid URL (https://…)';
  }
};

// Accepts an absolute http(s) URL OR a root-relative path (e.g. "/about-us").
// Used for fields like a meta-mapping page URL that store a path, not a full URL.
export const isUrlOrPath = (value) => {
  if (!value) return true;
  if (/^\/[^\s]*$/.test(value)) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:' ? true : 'Enter a valid URL or path (e.g. https://… or /about-us)';
  } catch {
    return 'Enter a valid URL or path (e.g. https://… or /about-us)';
  }
};
