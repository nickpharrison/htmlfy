/**
 * Format textarea content, including enforcement of entities.
 * 
 * TODO - move textarea minify to minify.js
 * 
 * @param {string} html
 * @returns {string}
 */
export const entify = (html) => {
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

  /* Match an entire textarea element and entify relevant characters. */
  html = html.replace(/<textarea[^>]*>((.|\n)*?)<\/textarea>/g, (match, capture) => {
    return match.replace(capture, (match) => {
      return match
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#47;')
        .replace(/"/g, '&#34;')
        .replace(/'/g, '&#39;')
        .replace(/\n/g, '&#13;')
        .replace(/%/g, '&#37;')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;')
        .replace(/\s/g, '&nbsp;')
    })
  })

  return html
}
