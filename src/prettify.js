import { closify } from './closify.js'
import { entify } from './entify.js'
import { minify } from './minify.js'
import { mergeConfig } from './utils.js'

/**
 * @type {import('types').DefaultConfig}
 */
const CONFIG = {
  tab_size: 2
}

/**
 * Validate any passed-in config options and merge with CONFIG.
 * 
 * @param {import('fnhtml').Config} config
 * @returns {import('types').ValidatedConfig}
 */
const validateConfig = (config) => {
  let tab_size = config.tab_size

  if (!tab_size) return CONFIG

  tab_size = Math.floor(tab_size)
  
  if (tab_size < 1 || tab_size > 16) throw 'Tab size out of range. Expecting 1 to 16.'
  
  config.tab_size = tab_size

  return mergeConfig(CONFIG, config)

}

/**
 * @type {{ line: string[] }}
 */
const convert = {
  line: []
}

/**
 * Isolate tags, content, and comments.
 * 
 * @param {string} html
 * @returns {string}
 * @example <div>Hello World!</div> => 
 *  [#-# : 0 : <div> : #-#]
 *  Hello World!
 *  [#-# : 1 : </div> : #-#]
 */
const enqueue = (html) => {
  convert.line = []
  let i = -1

  html = html.replace(/<[^>]*>/g, (match) => {
    convert.line.push(match)
    i++

    return `\n[#-# : ${i} : ${match} : #-#]\n`
  })

  return html
}

/**
 * Preprocess the HTML.
 * 
 * @param {string} html
 * @returns {string}
 */
const preprocess = (html) => {
  html = closify(html)
  html = minify(html)
  html = entify(html)
  html = enqueue(html)

  return html
}

/**
 * 
 * @param {string} html 
 * @param {number} step 
 * @returns {string}
 */
const process = (html, step) => {
  /* Track current number of indentations needed */
  let indents = ''

  /* Process lines and indent. */
  convert.line.forEach((source, index) => {
    html = html
      .replace(/\n+/g, '\n') /* Replace consecutive line returns with singles */
      .replace(`[#-# : ${index} : ${source} : #-#]`, (match) => {
        let subtrahend = 0
        const prevLine = `[#-# : ${index - 1} : ${convert.line[index - 1]} : #-#]`

        /**
         * Arbitratry character, to keep track of the string's length.
         */
        indents += '0'
        
        if (index === 0) subtrahend++

        /* We're processing a closing tag. */
        if (match.indexOf(`#-# : ${index} : </`) > -1) subtrahend++

        /* prevLine is a doctype declaration. */
        if (prevLine.indexOf('<!doctype') > -1) subtrahend++

        /* prevLine is a comment. */
        if (prevLine.indexOf('<!--') > -1) subtrahend++

        /* prevLine is a self-closing tag. */
        if (prevLine.indexOf('/> : #-#') > -1) subtrahend++

        /* prevLine is a closing tag. */
        if (prevLine.indexOf(`#-# : ${index - 1} : </`) > -1) subtrahend++

        /* Determine offset for line indentation. */
        const offset = indents.length - subtrahend

        /* Adjust for the next round. */
        indents = indents.substring(0, offset)

        /* Remove the prefix and suffix, leaving the content. */
        const result = match
          .replace(`[#-# : ${index} : `, '')
          .replace(' : #-#]', '')

        /* Pad the string with spaces and return. */
        return result.padStart(result.length + (step * offset))
      })
  })

  /* Remove line returns, tabs, and consecutive spaces within html elements or their content. */
  html = html.replace(/>[^<]*?[^><\/\s][^<]*?<\/|>\s+[^><\s]|<script[^>]*>\s+<\/script>|<(\w+)>\s+<\/(\w+)|<(\w+)[^>]*>\s<\/(\w+)>|<([\w\-]+)[^>]*[^\/]>\s+<\/([\w\-]+)>/g,
    match => match.replace(/\n|\t|\s{2,}/g, '')
  )

  return html.substring(1, html.length - 1)
}

/**
 * Format HTML with line returns and indentations.
 * 
 * @param {string} html 
 * @param {import('fnhtml').Config} config
 * @returns {string}
 */
export const prettify = (html, config) => {
  const validated_config = validateConfig(config)

  html = preprocess(html)
  html = process(html, validated_config.tab_size)

  return html
}
