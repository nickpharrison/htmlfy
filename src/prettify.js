import { closing } from './closing.js'
import { entity } from './entity.js'
import { minify } from './minify.js'

/**
 * @type {{ line: string[] }}
 */
const convert = {
  line: []
}

/**
 * Prep html elements and comments for processing.
 * 
 * @example <div>Hello World!</div> => 
 *  [#-# : 0 : <div> : #-#]
 *  Hello World!
 *  [#-# : 1 : </div> : #-#]
 * @param {string} el
 * @returns string
 */
const line = (el) => {
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
 * 
 * @param {string} el 
 * @param {number} step 
 * @returns string
 */
const tidy = (el, step) => {
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
         * Arbitratry character, since we're not using actual tabs.
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

        /* Determine number of steps for line indention. */
        const offset = indents.length - subtrahend

        /* We're processing a comment. */
        //if (match.indexOf('<!--') > -1) match = match.replace('<!-- [#!# :', `<!-- [#!# %${offset}% :`)

        /* Adjust for the next round */
        indents = indents.substring(0, offset)
        console.log('data for index', index, indents, subtrahend, offset)
        const result = match.replace(`[#-# : ${index} : `, '').replace(' : #-#]', '')

        return result.padStart(result.length + (step * offset))
      })
  })

  /* Remove line returns, tabs, and consecutive spaces within html elements or their content. */
  el = el.replace(/>[^<]*?[^><\/\s][^<]*?<\/|>\s+[^><\s]|<script[^>]*>\s+<\/script>|<(\w+)>\s+<\/(\w+)|<(\w+)[^>]*>\s<\/(\w+)>|<([\w\-]+)[^>]*[^\/]>\s+<\/([\w\-]+)>/g,
    (match) => {
      console.log('removed stuff', match)
      return match.replace(/\n|\t|\s{2,}/g, '')
    }
  )

  /* Restore and minify comments. */
  // convert.comment.forEach((source, index) => {
  //   el = el.replace(new RegExp(`<!--[^>]*${index} : #!#] -->`, 'g'), 
  //     source.replace(/\n|\t/g, '').replace(/\s{2,}/g, ' '))
  // })

  return el.substring(1, el.length - 1)
}

/**
 * 
 * @param {string} el 
 * @param {Object} options={}
 * @param {number} options.tab_size=2 
 * @returns string
 */
export const prettify = (el, options) => {
  el = closing(el)
  el = entity(el)
  el = minify(el)
  el = line(el)
  el = tidy(el, options.tab_size)

  return el
}
