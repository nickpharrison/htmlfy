/**
 * Minify textarea element content.
 * 
 * @param {string} html 
 * @returns {string}
 */
export const minifyTextareaContent = (html) => {
  /**
   * Within textarea content, trim the following:
   * - leading line return plus any number of spaces
   * - multiple leading line returns, even if no spaces
   * - multiple combos of line return + spaces
   * 
   * Does not trim lone leading spaces, nor a single line return.
   */
  html = html.replace(/(<textarea[^>]*>)\n\s+/g, '$1')

  /* Within textarea content, trim trailing spaces */
  html = html.replace(/\s+<\/textarea>/g, '</textarea>')

  return html
}