import { minifyLeadingAndTrailingTextareaContent } from "./specials"

/**
 * Enforce entity characters for textarea content.
 * 
 * @param {string} html
 * @param {boolean} [minify_content] Minifies the content of textarea elements. 
 * Defaults to `false`. Consider setting this to `true` if you're running `entify()` 
 * as a standalone function.
 * @returns {string}
 * @example <textarea>3 > 2</textarea> => <textarea>3 &gt; 2</textarea>
 */
export const entify = (html, minify_content = false) => {
  html = minifyLeadingAndTrailingTextareaContent(html)

  /** 
   * Protect entities, inside the textarea content,
   * from general minification.
   */
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
    })
  })

  /* Typical minification, but only for textareas. */
  if (minify_content) {
    html = html.replace(/<textarea[^>]*>((.|\n)*?)<\/textarea>/g, (match, capture) => {
      /* Replace things inside the textarea content. */
      match = match.replace(capture, (match) => {
        return match
          .replace(/\n|\t/g, '')
          .replace(/[a-z]+="\s*"/ig, '')
          .replace(/>\s+</g, '><')
          .replace(/\s+/g, ' ')
      })

      /* Replace things in the entire element */
      match = match
        .replace(/\s+/g, ' ')
        .replace(/\s>/g, '>')
        .replace(/>\s/g, '>')
        .replace(/\s</g, '<')
        .replace(/class=["']\s/g, (match) => match.replace(/\s/g, ''))
        .replace(/(class=.*)\s(["'])/g, '$1'+'$2')
      return match
    })
  }

  return html
}
