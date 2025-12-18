/**
 * Parse a comma-separated string into an array of trimmed values.
 * Useful for displaying tags/bubbles from a comma-separated string.
 * 
 * @param {string} str - The comma-separated string to parse
 * @returns {string[]} - Array of trimmed, non-empty values
 * 
 * @example
 * parseBubble("coding, design, photography")
 * // Returns: ["coding", "design", "photography"]
 */
export function parseBubble(str) {
  if (!str) return [];
  return str
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item);
}
