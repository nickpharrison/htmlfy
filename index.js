/* Testing. */
import { entify } from './src/entify'
import { minify } from './src/minify'
import { prettify } from './src/prettify'
const html = `<form id="3"     >     <!-- 
      
This is a comment. --><!-- This is a second comment. --><label for="email-0">

What's your email?</label><input id="email-0" type="email" 
title="We need your email for verification." name="email" required><!--    This is another comment. -->
<label for="1">What fruits do you like?</label><fieldset id="1">
<input id="fruits-1-0" type="checkbox" name="fruits" value="apples">
<label for="fruits-1-0"  >Apples<  /label><br><div><!--      This is an embedded comment. --></div>
<input id="fruits-1-1" type="checkbox" name="fruits" value="grapes">
<label for="fruits-1-1">Grapes</label><br></fieldset>     

</form><textarea  >

  Did   you know that 3 >   2?

This is another paragraph.   


 </textarea><textarea class="  more  stuff  ">    </textarea>`

const stuff = prettify(html)
//const stuff = entify(html, true)
//const stuff = minify(html)
console.log(stuff)
