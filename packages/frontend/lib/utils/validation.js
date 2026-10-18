export const tagInputSanitizer = {
  /**
   * Get tags entered as JSON or as comma-separated values
   * @param {string} value - Entered tags
   * @returns {string[]} Tags
   */
  customSanitizer: (value) => {
    try {
      // Entered using progressively enhanced tag input, for example:
      // `["foo", "bar"]`
      return JSON.parse(value);
    } catch {
      // Entered using comma separated values, for example:
      // `foo, bar`

      // Convert string to Array
      let tags = value.split(",");

      // Trim whitespace
      tags = tags.map((tag) => String(tag).trim());

      // Remove empty values
      tags = tags.filter((tag) => tag !== "");

      // Remove duplicate values
      tags = [...new Set(tags)];

      // Return sanitized array
      return tags;
    }
  },
};
