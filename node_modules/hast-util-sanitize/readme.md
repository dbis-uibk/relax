# hast-util-sanitize [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Sanitize [HAST][].

## Installation

[npm][]:

```bash
npm install hast-util-sanitize
```

## Usage

```javascript
var h = require('hastscript')
var u = require('unist-builder')
var sanitize = require('hast-util-sanitize')
var toHTML = require('hast-util-to-html')

var tree = h('div', {onmouseover: 'alert("alpha")'}, [
  h(
    'a',
    {href: 'jAva script:alert("bravo")', onclick: 'alert("charlie")'},
    'delta'
  ),
  u('text', '\n'),
  h('script', 'alert("charlie")'),
  u('text', '\n'),
  h('img', {src: 'x', onerror: 'alert("delta")'}),
  u('text', '\n'),
  h('iframe', {src: 'javascript:alert("echo")'}),
  u('text', '\n'),
  h('math', h('mi', {'xlink:href': 'data:x,<script>alert("foxtrot")</script>'}))
])

var unsanitized = toHTML(tree)
var sanitized = toHTML(sanitize(tree))

console.log(unsanitized)
console.log(sanitized)
```

Unsanitized:

```html
<div onmouseover="alert(&#x22;alpha&#x22;)"><a href="jAva script:alert(&#x22;bravo&#x22;)" onclick="alert(&#x22;charlie&#x22;)">delta</a>
<script>alert("charlie")</script>
<img src="x" onerror="alert(&#x22;delta&#x22;)">
<iframe src="javascript:alert(&#x22;echo&#x22;)"></iframe>
<math><mi xlink:href="data:x,&#x3C;script&#x3E;alert(&#x22;foxtrot&#x22;)&#x3C;/script&#x3E;"></mi></math></div>
```

Sanitized:

```html
<div><a>delta</a>

<img src="x">

</div>
```

## API

### `sanitize(node[, schema])`

Sanitize the given [HAST][] tree.

###### Parameters

*   `node` ([`HASTNode`][hast]).
*   `schema` ([`Schema`][schema], optional).

###### Returns

[`HASTNode`][hast] — A new node.

### `Schema`

Configuration.  If not given, defaults to [GitHub][] style sanitation.
If any top-level key isn’t given, it defaults to GH’s style too.

For a thorough sample, see the packages [`github.json`][schema-github].

To extend the standard schema with a few changes, clone `github.json`
like so:

```js
var h = require('hastscript')
var merge = require('deepmerge')
var gh = require('hast-util-sanitize/lib/github')
var sanitize = require('hast-util-sanitize')

var schema = merge(gh, {attributes: {'*': ['className']}})

var tree = sanitize(h('div', {className: ['foo']}), schema)

// `tree` still has `className`.
console.log(tree)
```

###### `attributes`

Map of tag-names to allowed attributes (`Object.<Array.<string>>`).

The special `'*'` key sets attributes allowed on all elements.

One special value, namely `'data*'`, can be used to allow all `data`
properties.

```js
"attributes": {
  "a": [
    "href"
  ],
  "img": [
    "src",
    "longDesc"
  ],
  // ...
  "*": [
    "abbr",
    "accept",
    "acceptCharset",
    // ...
    "vspace",
    "width",
    "itemProp"
  ]
}
```

###### `tagNames`

List of allowed tag-names (`Array.<string>`).

```js
"tagNames": [
  "h1",
  "h2",
  "h3",
  // ...
  "strike",
  "summary",
  "details"
]
```

###### `protocols`

Map of protocols to support for attributes (`Object.<Array.<string>>`).

```js
"protocols": {
  "href": [
    "http",
    "https",
    "mailto"
  ],
  // ...
  "longDesc": [
    "http",
    "https"
  ]
}
```

###### `ancestors`

Map of tag-names to their required ancestral elements
(`Object.<Array.<string>>`).

```js
"ancestors": {
  "li": [
    "ol",
    "ul"
  ],
  // ...
  "tr": [
    "table"
  ]
}
```

###### `clobber`

List of allowed attribute-names which can clobber (`Array.<string>`).

```js
"clobber": [
  "name",
  "id"
]
```

###### `clobberPrefix`

Prefix (`string`) to use before potentially clobbering properties.

```js
"clobberPrefix": "user-content"
```

###### `strip`

Tag-names to strip from the tree (`Array.<string>`).

By default, unsafe elements are replaced by their content.  Some elements,
should however be entirely stripped from the tree.

```js
"strip": [
  "script"
]
```

###### `allowComments`

Whether to allow comment nodes (`boolean`, default: `false`).

```js
"allowComments": true
```

###### `allowDoctypes`

Whether to allow doctype nodes (`boolean`, default: `false`).

```js
"allowDoctypes": true
```

## Contribute

See [`contributing.md` in `syntax-tree/hast`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/hast-util-sanitize.svg

[travis]: https://travis-ci.org/syntax-tree/hast-util-sanitize

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-sanitize.svg

[codecov]: https://codecov.io/github/syntax-tree/hast-util-sanitize

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[hast]: https://github.com/syntax-tree/hast

[schema]: #schema

[github]: https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/sanitization_filter.rb

[schema-github]: lib/github.json

[contributing]: https://github.com/syntax-tree/hast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/hast/blob/master/code-of-conduct.md
