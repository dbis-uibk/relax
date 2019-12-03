/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
var JSON5 = require('json5');
function Json5Plugin (source) {
  if (this.cacheable) {
    this.cacheable();
  }

  var value = undefined;

  try {
    value = JSON5.parse(source);
  } catch (e) {
    throw new Error('Error using JSON5 parsing')
  }

  this.values = [value];

  return 'module.exports = ' + JSON.stringify(value, null, '\t');
}
// es2015 modules support
Json5Plugin.default = Json5Plugin;

module.exports = Json5Plugin;
