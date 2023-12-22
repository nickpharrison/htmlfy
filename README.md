# fnhtml
Functions to format HTML. Mainly to prettify or minify.

`fnhtml` is a fork of [html-formatter](https://github.com/uznam8x/html-formatter/tree/master). Most of the processing logic has been preserved, and full credit for that goes to the original author. I've made the following major enhancements.

- Fully typed.
- Replaced `var` declarations.
- Converted to ES6.
- Optional "tab" sizes to prettify the HTML.
- Naming changes for functions, etc.

## Install

`npm install fnhtml`

## API

### Prettify
Turn single-line or ugly HTML into highly formatted HTML. This is a wrapper for all other functions, and then it adds indentation.

See [configuration](#configuration)for adjusting the tab size.

```js
import { prettify } from 'fnhtml'

const html = `<main class="hello   there world"><div>Welcome to fnhtml!  </div></main>`
console.log(prettify(html))
/*
<main class="hello there world">
  <div>
    Welcome to fnhtml!
  </div>
</main>
*/
```

### Minify
Turn well-formatted or ugly HTML into a single-line of HTML.

```js
import { minify } from 'fnhtml'

const html = 
`<main class="hello there world">
  <div>
    Welcome to fnhtml!
  </div>
</main>`
console.log(minify(html))
/*
<main class="hello there world"><div>Welcome to fnhtml!</div></main>
*/
```

### Closify
Ensure void elements are "self-closing".

```js
import { closify } from 'fnhtml'

const html = `<main class="hello there world"><div>Welcome to fnhtml!</div><br><input type="text"></main>`
console.log(closify(html))
/*
<main class="hello there world">
  <div>
    Welcome to fnhtml!
  </div>
  <br />
  <input type="text" />
</main>
*/
```

### Entify
Enforce entity characters for textarea content. By default, this also does basic minification on textareas before setting entities. When running this function as standalone, you'll likely want to pass `minify_content` as `true`, for full minification of the textarea. It does not process any other tags.

```js
import { entify } from 'fnhtml'

const html = `<main class="hello   there world"><div>Welcome to fnhtml!  </div></main><textarea  >

Did   you know that 3 >   2?

This is another paragraph.   


</textarea><textarea class="  more  stuff  ">    </textarea>`
console.log(entify(html, true))
/*
<main class="hello   there world"><div>Welcome to fnhtml!  </div></main><textarea>Did you know that 3 &gt; 2?&#13;&#13;This is another paragraph.</textarea><textarea class="more stuff"></textarea>
*/
```

## Configuration
Default config:
```js
{
  tab_size: 2
}
```

### Tab Size
`prettify` indents using spaces. If you'd like to custom this, then pass a configuration object as the second argument.

```js
import { prettify } from 'fnhtml'

const html = `<main class="hello   there world"><div>Welcome to fnhtml!  </div></main>`
console.log(prettify(html, { tab_size: 4 }))
/*
<main class="hello there world">
    <div>
        Welcome to fnhtml!
    </div>
</main>
*/
```
