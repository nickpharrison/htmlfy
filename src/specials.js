/**
 * Minify textarea element content.
 * 
 * @param {string} html 
 * @returns {string}
 */
export const minifyLeadingAndTrailingTextareaContent = (html) => {
  /**
   * Trim any combination of leading line returns and/or spaces
   */
  html = html
    .replace(/(<textarea[^>]*>)\n+/g, '$1')
    .replace(/(<textarea[^>]*>)\n\s+/g, '$1')
    .replace(/(<textarea[^>]*>)\s+\n/g, '$1')

  /* Trim trailing spaces */
  html = html.replace(/\s+<\/textarea>/g, '</textarea>')

  return html
}