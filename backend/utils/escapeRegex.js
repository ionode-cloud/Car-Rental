/**
 * Safely escape RegExp special characters to prevent syntax crashes and ReDoS
 * @param {string} string - Raw user input string
 * @returns {string} - Escaped string safe for new RegExp()
 */
export const escapeRegex = (string = '') => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default escapeRegex;
