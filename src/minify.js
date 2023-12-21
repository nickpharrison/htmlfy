/**
 * Creates a single-line HTML string
 * by removing line returns, tabs, and relevant spaces.
 * 
 * @param {string} html
 * @returns A minified HTML string.
 */
export const minify = (html) => {
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

  /* All other minification */
  return html
    .replace(/\n|\t/g, '')
    .replace(/[a-z]+="\s*"/ig, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/\s>/g, '>')
    .replace(/>\s/g, '>')
    .replace(/\s</g, '<')
    .replace(/class=["']\s/g, (match) => match.replace(/\s/g, ''))
}
