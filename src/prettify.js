import { specials } from './specials.js'
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
 * @param {import('htmlpm').Config} config
 * @returns {import('types').ValidatedConfig}
 */
const validateConfig = (config) => {
  let tab_size = config.tab_size
  console.log('tab size', tab_size)

  if (!tab_size) return mergeConfig(CONFIG, config)

  tab_size = Math.floor(tab_size)
  
  if (tab_size < 1 || tab_size > 16) throw 'Tab size out of range. Expecting 1 to 16.'
  
  config.tab_size = tab_size
  console.log('tab size now', config.tab_size)

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
 * @example <div>Hello World!</div> => 
 *  [#-# : 0 : <div> : #-#]
 *  Hello World!
 *  [#-# : 1 : </div> : #-#]
 * @param {string} html
 * @returns {string}
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
  html = specials(html)
  html = minify(html)
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

  console.log('processing', html)
  console.log('convert line', convert.line)

  /* Process lines and indent. */
  convert.line.forEach((source, index) => {
    console.log('current line is', source, index)
    html = html
      .replace(/\n+/g, '\n') /* Replace consecutive line returns with singles */
      .replace(`[#-# : ${index} : ${source} : #-#]`, (match) => {
        let subtrahend = 0
        console.log('matched', match)
        const prevLine = `[#-# : ${index - 1} : ${convert.line[index - 1]} : #-#]`
        console.log('previous line for index', index, prevLine)
        /**
         * Arbitratry character, to keep track of the string's length.
         * 
         * TODO - Replace this mechanism, if possible.
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
        console.log('data for index', index, indents, subtrahend, offset)

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
    (match) => {
      console.log('removed stuff', match)
      return match.replace(/\n|\t|\s{2,}/g, '')
    }
  )

  return html.substring(1, html.length - 1)
}

/**
 * Format HTML with line returns and indentations.
 * 
 * @param {string} html 
 * @param {import('htmlpm').Config} config
 * @returns {string}
 */
export const prettify = (html, config) => {
  console.log('tab is', config.tab_size)
  const validated_config = validateConfig(config)

  html = preprocess(html)
  html = process(html, validated_config.tab_size)

  return html
}
