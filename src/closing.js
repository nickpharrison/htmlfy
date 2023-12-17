const elements = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 
  'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr'
]

/**
 * Ensure void elements are "self-closing".
 * 
 * @example <br> => <br />
 * @param {string} el 
 * @returns string
 */
export const closing = (el) => {
  el = el.replace(/<([a-zA-Z\-0-9]+)[^>]*>/g, (match, name) => {
    if (elements.indexOf(name) > -1) {
      return (`${match.substring(0, match.length - 1)} />`).replace(/\/\s\//g, '/')
    }

    return match.replace(/[\s]?\/>/g, `></${name}>`)
  })

  return el
}
