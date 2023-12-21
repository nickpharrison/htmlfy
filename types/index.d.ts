declare module 'fnhtml' {
  export interface Config {
    tab_size?: number
  }

  /**
   * Ensure void elements are "self-closing".
   *
   * @param {string} html The HTML string to evaluate.
   * @returns An HTML string where void elements are formatted as self-closing.
   * @example <br> => <br />
   */
  export function closify(html: string): string

  /**
   * Creates a single-line HTML string
   * by removing line returns, tabs, and relevant spaces.
   * 
   * @param html The HTML string to minify.
   * @returns A minified HTML string.
   */
  export function minify(html: string): string

  /**
   * Format HTML with line returns and indentations.
   * 
   * @param html The HTML string to prettify.
   * @param config A configuration object.
   * @returns A well-formed HTML string.
   */
  export function prettify(html: string, config: Config): string
}
