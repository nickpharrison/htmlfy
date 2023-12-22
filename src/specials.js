/**
 * Minify textarea element content.
 * 
 * @param {string} html 
 * @returns {string}
 */
export const minifyLeadingAndTrailingTextareaContent = (html) => {
  /**
   * Trim the following:
   * - leading line return
   * - leading line return + spaces
   * - leading spaces + line return(s) + spaces
   * - multiple leading line returns, even if no spaces
   * - multiple combos of line return and spaces
   */
  html = html
    .replace(/(<textarea[^>]*>)\n\s+/g, '$1')
    .replace(/(<textarea[^>]*>)\s+\n/g, '$1')

  /* Trim trailing spaces */
  html = html.replace(/\s+<\/textarea>/g, '</textarea>')

  return html
}