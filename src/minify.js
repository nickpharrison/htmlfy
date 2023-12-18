/**
 * Creates a single-line string
 * by removing line returns, tabs, and relevant spaces.
 * 
 * @param {string} el
 * @returns string
 */
export const minify = (el) => {
  return el
    .replace(/\n|\t/g, '')
    .replace(/[a-z]+="\s*"/ig, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .replace(/\s>/g, '>')
    .replace(/>\s/g, '>')
    .replace(/\s</g, '<')
    .replace(/class=["']\s/g, (match) => match.replace(/\s/g, ''))
}
