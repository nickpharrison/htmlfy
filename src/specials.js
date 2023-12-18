const void_elements = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 
  'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr'
]

/**
 * Special processing for textareas and void elements.
 * 
 * @param {string} el
 * @returns string
 */
export const specials = (el) => {
  /**
   * Within textarea content, trim the following:
   * - leading line return plus any number of spaces
   * - multiple leading line returns, even if no spaces
   * - multiple combos of line return + spaces
   * 
   * Does not trim lone leading spaces, nor a single line return.
   */
  el = el.replace(/(<textarea[^>]*>)\n\s+/g, '$1')

  /* Within textarea content, trim trailing spaces */
  el = el.replace(/\s+<\/textarea>/g, '</textarea>')

  /* Match an entire textarea element and URL encode the below content characters. */
  el = el.replace(/<textarea[^>]*>((.|\n)*?)<\/textarea>/g, (match, capture) => {
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

  /**
   * Ensure void elements are "self-closing".
   * 
   * @example <br> => <br />
   */
  el = el.replace(/<([a-zA-Z\-0-9]+)[^>]*>/g, (match, name) => {
    if (void_elements.indexOf(name) > -1) {
      return (`${match.substring(0, match.length - 1)} />`).replace(/\/\s\//g, '/')
    }

    return match.replace(/[\s]?\/>/g, `></${name}>`)
  })

  return el
}
