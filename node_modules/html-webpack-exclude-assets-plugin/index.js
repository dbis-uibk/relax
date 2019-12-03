'use strict';
var assert = require('assert');

function HtmlWebpackExcludeAssetsPlugin (options) {
  assert.equal(options, undefined, 'The HtmlWebpackExcludeAssetsPlugin does not accept any options');
  this.PluginName = 'HtmlWebpackExcludeAssetsPlugin';
}

HtmlWebpackExcludeAssetsPlugin.prototype.apply = function (compiler) {
  if ('hooks' in compiler) {
    // v4 approach:
    compiler.hooks.compilation.tap(this.PluginName, this.applyCompilation.bind(this));
  } else {
    // legacy approach:
    // Hook into the html-webpack-plugin processing
    compiler.plugin('compilation', this.applyCompilation.bind(this));
  }
};

HtmlWebpackExcludeAssetsPlugin.prototype.applyCompilation = function applyCompilation (compilation) {
  var self = this;
  if ('hooks' in compilation) {
    // If our target hook is not present, throw a descriptive error
    if (!compilation.hooks.htmlWebpackPluginAlterAssetTags) {
      throw new Error('The expected HtmlWebpackPlugin hook was not found! Ensure HtmlWebpackPlugin is installed and' +
        ' was initialized before this plugin.');
    }
    compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(this.PluginName, registerCb);
  } else {
    compilation.plugin('html-webpack-plugin-alter-asset-tags', registerCb);
  }
  function registerCb (htmlPluginData, callback) {
    var excludeAssets = htmlPluginData.plugin.options.excludeAssets;
    // Skip if the plugin configuration didn't set `excludeAssets`
    if (!excludeAssets) {
      if (callback) {
        return callback(null, htmlPluginData);
      } else {
        return Promise.resolve(htmlPluginData);
      }
    }

    if (excludeAssets.constructor !== Array) {
      excludeAssets = [excludeAssets];
    }

    // Skip invalid RegExp patterns
    var excludePatterns = excludeAssets.filter(function (excludePattern) {
      return excludePattern.constructor === RegExp;
    });

    var result = self.processAssets(excludePatterns, htmlPluginData);
    if (callback) {
      callback(null, result);
    } else {
      return Promise.resolve(result);
    }
  }
};

HtmlWebpackExcludeAssetsPlugin.prototype.isExcluded = function (excludePatterns, assetPath) {
  return excludePatterns.filter(function (excludePattern) {
    return excludePattern.test(assetPath);
  }).length > 0;
};

HtmlWebpackExcludeAssetsPlugin.prototype.processAssets = function (excludePatterns, pluginData) {
  var self = this;
  var body = [];
  var head = [];

  pluginData.head.forEach(function (tag) {
    if (!tag.attributes || !self.isExcluded(excludePatterns, tag.attributes.src || tag.attributes.href)) {
      head.push(tag);
    }
  });

  pluginData.body.forEach(function (tag) {
    if (!tag.attributes || !self.isExcluded(excludePatterns, tag.attributes.src || tag.attributes.href)) {
      body.push(tag);
    }
  });

  return { head: head, body: body, plugin: pluginData.plugin, chunks: pluginData.chunks, outputName: pluginData.outputName };
};

module.exports = HtmlWebpackExcludeAssetsPlugin;
