import { minifyTextareaContent } from "./specials"

/**
 * Creates a single-line HTML string
 * by removing line returns, tabs, and relevant spaces.
 * 
 * @param {string} html
 * @returns A minified HTML string.
 */
export const minify = (html) => {
  html = minifyTextareaContent(html)

  /* All other minification. */
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
