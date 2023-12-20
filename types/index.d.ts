declare module 'htmlpm' {
  export interface Config {
    tab_size?: number
  }

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
