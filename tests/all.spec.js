import { closify } from '../src/closify.js'
import { entify } from '../src/entify.js'
import { minify } from '../src/minify.js'
import { prettify } from '../src/prettify.js'
import { expect, test } from 'vitest'

const ugly_html = `<form id="3"     >     <!-- 
      
This is a comment. --><!-- This is a second comment. --><label for="email-0">

What's your email?</label><input id="email-0" type="email" 
title="We need your email for verification." name="email" required><!--    This is another comment. -->
<label for="1">What fruits do you like?</label><fieldset id="1">
<input id="fruits-1-0" type="checkbox" name="fruits" value="apples">
<label for="fruits-1-0"  >Apples<  /label><br><div><!--      This is an embedded comment. --></div>
<input id="fruits-1-1" type="checkbox" name="fruits" value="grapes">
<label for="fruits-1-1">Grapes</label><br></fieldset>
<br>
</form>`

const entify_html = `<textarea  >

Did   you know that 3 >   2?

This is another paragraph.   


</textarea><textarea class="  more  stuff  ">    </textarea>`

const pretty_html = `<form id="3">
  <!-- This is a comment. -->
  <!-- This is a second comment. -->
  <label for="email-0">What's your email?</label>
  <input id="email-0" type="email" title="We need your email for verification." name="email" required />
  <!-- This is another comment. -->
  <label for="1">What fruits do you like?</label>
  <fieldset id="1">
    <input id="fruits-1-0" type="checkbox" name="fruits" value="apples" />
    <label for="fruits-1-0">Apples</label>
    <br />
    <div>
      <!-- This is an embedded comment. -->
    </div>
    <input id="fruits-1-1" type="checkbox" name="fruits" value="grapes" />
    <label for="fruits-1-1">Grapes</label>
    <br />
  </fieldset>
  <br />
</form>`

const closify_html = `<form id="3">
<!-- This is a comment. -->
<!-- This is a second comment. --><br><input><br><input></form>`

const config_html = `<form id="3">
<!-- This is a comment. -->
<!-- This is a second comment. --><div><br /><input /><br /><input /><div></div></div></form>`

const script_html = `<script>
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')
</script>
`

const css_html = `
<main><div>Hello World</div></main>
<style>
  body {
    width: 100
  }
</style>`

const code_html = `
<pre><code>// This is my code
Please()
{
  leave it alone
}
</code></pre>
`

// @ts-ignore
const testConfig = async (config) => {
  return await prettify(config_html, config)
}

test('Prettify', () => {
  expect(prettify(ugly_html)).toBe(pretty_html)
})

test('Prettify with HTML check', () => {
  expect(prettify('No HTML')).toBe('No HTML')
})

test('Minify', () => {
  expect(minify(pretty_html)).toBe(
    `<form id="3"><!-- This is a comment. --><!-- This is a second comment. --><label for="email-0">What's your email?</label><input id="email-0" type="email" title="We need your email for verification." name="email" required /><!-- This is another comment. --><label for="1">What fruits do you like?</label><fieldset id="1"><input id="fruits-1-0" type="checkbox" name="fruits" value="apples" /><label for="fruits-1-0">Apples</label><br /><div><!-- This is an embedded comment. --></div><input id="fruits-1-1" type="checkbox" name="fruits" value="grapes" /><label for="fruits-1-1">Grapes</label><br /></fieldset><br /></form>`
  )
})

test('Minify with HTML check', () => {
  expect(minify('No HTML', true)).toBe('No HTML')
})

test('Entify', () => {
  expect(entify(entify_html)).toBe(
    `<textarea  >&#10;&#10;Did&nbsp;&nbsp;&nbsp;you&nbsp;know&nbsp;that&nbsp;3&nbsp;&gt;&nbsp;&nbsp;&nbsp;2?&#10;&#10;This&nbsp;is&nbsp;another&nbsp;paragraph.&nbsp;&nbsp;&nbsp;&#10;&#10;&#10;</textarea><textarea class="  more  stuff  ">&nbsp;&nbsp;&nbsp;&nbsp;</textarea>`
  )
})

test('Entify with plain text', () => {
  expect(entify('Plain text')).toBe('Plain text')
})

test('Entify with minify', () => {
  expect(entify(entify_html, true)).toBe(
    `<textarea>&#10;&#10;Did&nbsp;&nbsp;&nbsp;you&nbsp;know&nbsp;that&nbsp;3&nbsp;&gt;&nbsp;&nbsp;&nbsp;2?&#10;&#10;This&nbsp;is&nbsp;another&nbsp;paragraph.&nbsp;&nbsp;&nbsp;&#10;&#10;&#10;</textarea><textarea class="more stuff">&nbsp;&nbsp;&nbsp;&nbsp;</textarea>`
  )
})

test('Closify', () => {
  expect(closify(closify_html)).toBe(
`<form id="3">
<!-- This is a comment. -->
<!-- This is a second comment. --><br /><input /><br /><input /></form>`
  )
})

test('Closify with HTML check', () => {
  expect(closify('No HTML', true)).toBe('No HTML')
})

test('Ignore script tag', () => {
  expect(prettify(script_html, { ignore: [ 'script' ] })).toBe(
`<script>
  document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')
</script>`
  )
})

test('Ignore style tag', () => {
  expect(prettify(css_html, { ignore: [ 'style' ]})).toBe(
`<main>
  <div>Hello World</div>
</main>
<style>
  body {
    width: 100
  }
</style>`
  )
})

test('Ignore nested tags', () => {
  expect(prettify(code_html, { ignore: [ 'pre', 'code' ]})).toBe(
`<pre><code>// This is my code
Please()
{
  leave it alone
}
</code></pre>`
  )
})

test('Strict config', () => {
  expect(prettify(config_html, { strict: true })).toBe(
`<form id="3">
  <div>
    <br>
    <input>
    <br>
    <input>
    <div></div>
  </div>
</form>`
  )
})

test('Tab size config', () => {
  expect(prettify(config_html, { tab_size: 4 })).toBe(
`<form id="3">
    <!-- This is a comment. -->
    <!-- This is a second comment. -->
    <div>
        <br />
        <input />
        <br />
        <input />
        <div></div>
    </div>
</form>`
  )
})

test('Catches invalid ignore config', async () => {
  await expect(testConfig({ ignore: [ 'script', 1 ]})).rejects.toThrow('Ignore config must be an array of strings.')
})
