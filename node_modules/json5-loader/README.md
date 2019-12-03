[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <img width="280" height="200" style=""
    src="https://cdn.rawgit.com/json5/json5-logo/master/json5-logo.svg">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" vspace="" hspace="25"
      src="https://worldvectorlogo.com/logos/webpack.svg">
  </a>
  <h1>JSON5 Loader</h1>
  <p>Webpack loader for parsing <code>json5</code> files into JavaScript objects.<p>
</div>

<h2 align="center">Install</h2>

```sh
$ npm install --save-dev json5-loader
```

<h2 align="center">Usage</h2>

You can use the loader either
 * by configuring the `json5-loader` in the `module.loaders` object of the webpack configuration, or
 * by directly using the `json5!` prefix to the require statement.

Suppose we have the following `json5` file
```js
// appData.json5
{
  env: 'production',
  passwordStregth: 'strong'
}
```

#### Usage with preconfigured loader

```js
// webpack.config.js
module.exports = {
  entry: './index.js',
  output: { /* ... */ },
  module: {
    loaders: [
      {
        // make all files ending in .json5 use the `json5-loader`
        test: /\.json5$/,
        loader: 'json5-loader'
      }
    ]
  }
}
```

```js
// index.js
var appConfig = require('./appData.json5')
// or, in ES6
// import appConfig from './appData.json5'

console.log(appConfig.env) // 'production'
```
#### Usage with require statement loader prefix
```js
var appConfig = require("json5-loader!./appData.json5")
// returns the content as json parsed object

console.log(appConfig.env) // 'production'
```

Don't forget to polyfill require if you want to use it in Node.js. See the webpack documentation.

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/sokra?v=3">
        <br />
        <a href="https://github.com/sokra">Tobias Koppers</a>
      </td>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/gdi2290?v=3">
        <br />
        <a href="https://github.com/gdi2290">PatrickJS</a>
      </td>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/Cellule?v=3">
        <br />
        <a href="https://github.com/Cellule">Michael Ferris</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/kmck?v=3">
        <br />
        <a href="https://github.com/kmck">Keith McKnight</a>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/radubrehar?v=3">
        <br />
        <a href="https://github.com/radubrehar">Radu Brehar</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/kentcdodds?v=3">
        <br />
        <a href="https://github.com/kentcdodds">Kent C. Dodds</a>
      </td>
      <td align="center">
        <img width="150" height="150"
        src="https://avatars.githubusercontent.com/stevelacy?v=3">
        <br />
        <a href="https://github.com/stevelacy">Steve Lacy</a>
      </td>
    <tr>
  <tbody>
</table>

<h2 align="center">LICENSE</h2>

MIT

[npm]: https://img.shields.io/npm/v/json-loader.svg
[npm-url]: https://npmjs.com/package/json-loader

[deps]: https://david-dm.org/webpack/json-loader.svg
[deps-url]: https://david-dm.org/webpack/json-loader

[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/webpack/webpack

[test]: http://img.shields.io/travis/webpack/json-loader.svg
[test-url]: https://travis-ci.org/webpack/json-loader

[cover]: https://coveralls.io/repos/github/webpack/json-loader/badge.svg?branch=master
[cover-url]: https://coveralls.io/github/webpack/json-loader?branch=master
