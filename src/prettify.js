import { specials } from './specials.js'
import { minify } from './minify.js'

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
 * @param {string} el
 * @returns string
 */
const enqueue = (el) => {
  convert.line = []
  let i = -1

  el = el.replace(/<[^>]*>/g, (match) => {
    convert.line.push(match)
    i++

    return `\n[#-# : ${i} : ${match} : #-#]\n`
  })

  return el
}

/**
 * Preprocess the HTML.
 * 
 * @param {string} el
 * @returns string
 */
const preprocess = (el) => {
  el = specials(el)
  el = minify(el)
  el = enqueue(el)

  return el
}

/**
 * 
 * @param {string} el 
 * @param {number} step 
 * @returns string
 */
const process = (el, step) => {
  /* Track current number of indentions needed */
  let indents = ''

  console.log('processing', el)
  console.log('convert line', convert.line)

  /* Process lines and indent. */
  convert.line.forEach((source, index) => {
    console.log('current line is', source, index)
    el = el
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

        /* Determine offset for line indention. */
        const offset = (indents.length - subtrahend) * step

        /* Adjust for the next round. */
        indents = indents.substring(0, offset)
        console.log('data for index', index, indents, subtrahend, offset)

        /* Remove the prefix and suffix, leaving the content. */
        const result = match
          .replace(`[#-# : ${index} : `, '')
          .replace(' : #-#]', '')

        /* Pad the string with spaces and return. */
        return result.padStart(result.length + offset)
      })
  })

  /* Remove line returns, tabs, and consecutive spaces within html elements or their content. */
  el = el.replace(/>[^<]*?[^><\/\s][^<]*?<\/|>\s+[^><\s]|<script[^>]*>\s+<\/script>|<(\w+)>\s+<\/(\w+)|<(\w+)[^>]*>\s<\/(\w+)>|<([\w\-]+)[^>]*[^\/]>\s+<\/([\w\-]+)>/g,
    (match) => {
      console.log('removed stuff', match)
      return match.replace(/\n|\t|\s{2,}/g, '')
    }
  )

  return el.substring(1, el.length - 1)
}

/**
 * Format HTML with line returns and indentions.
 * 
 * @param {string} el 
 * @param {Object} options={ tab_size: 2 }
 * @param {number=} options.tab_size=2
 * @returns string
 */
export const prettify = (el, options = { tab_size: 2 }) => {
  el = preprocess(el)
  el = process(el, options.tab_size ?? 2)

  return el
}
