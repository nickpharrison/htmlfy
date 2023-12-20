/* Testing. */
import { prettify } from './src/prettify'
const html = `<form id="fury-prompt-3"     >     <!-- 
      
This is a comment. --><!-- This is a second comment. --><label for="fury-email-0">

What's your email?</label><input id="fury-email-0" type="email" title="We need your email for verification." name="email" required><!--         This is another comment. --><label for="fury-fruits-1">What fruits do you like?</label><fieldset><input id="fury-fruits-1-0" type="checkbox" name="fruits" value="apples"><label for="fury-fruits-1-0">Apples</label><br><div><!--      This is an embedded comment. --></div><input id="fury-fruits-1-1" type="checkbox" name="fruits" value="grapes"><label for="fury-fruits-1-1">Grapes</label><br></fieldset>     

</form>`

const stuff = prettify(html, { tab_size: 16.7 })
console.log(stuff)
