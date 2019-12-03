'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     MIT License http://www.opensource.org/licenses/mit-license.php
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Author Tobias Koppers @sokra
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _neoAsync = require('neo-async');

var _neoAsync2 = _interopRequireDefault(_neoAsync);

var _RawSource = require('webpack-sources/lib/RawSource');

var _RawSource2 = _interopRequireDefault(_RawSource);

var _ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

var _ModuleFilenameHelpers2 = _interopRequireDefault(_ModuleFilenameHelpers);

var _cacache = require('cacache');

var _cacache2 = _interopRequireDefault(_cacache);

var _findCacheDir = require('find-cache-dir');

var _findCacheDir2 = _interopRequireDefault(_findCacheDir);

var _serializeJavascript = require('serialize-javascript');

var _serializeJavascript2 = _interopRequireDefault(_serializeJavascript);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CompressionPlugin = function () {
  function CompressionPlugin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CompressionPlugin);

    var _options$asset = options.asset,
        asset = _options$asset === undefined ? '[path].gz[query]' : _options$asset,
        test = options.test,
        include = options.include,
        exclude = options.exclude,
        _options$algorithm = options.algorithm,
        algorithm = _options$algorithm === undefined ? 'gzip' : _options$algorithm,
        _options$filename = options.filename,
        filename = _options$filename === undefined ? false : _options$filename,
        _options$compressionO = options.compressionOptions,
        compressionOptions = _options$compressionO === undefined ? {} : _options$compressionO,
        _options$cache = options.cache,
        cache = _options$cache === undefined ? false : _options$cache,
        _options$threshold = options.threshold,
        threshold = _options$threshold === undefined ? 0 : _options$threshold,
        _options$minRatio = options.minRatio,
        minRatio = _options$minRatio === undefined ? 0.8 : _options$minRatio,
        _options$deleteOrigin = options.deleteOriginalAssets,
        deleteOriginalAssets = _options$deleteOrigin === undefined ? false : _options$deleteOrigin;


    this.options = {
      asset,
      test,
      include,
      exclude,
      algorithm,
      filename,
      compressionOptions,
      cache,
      threshold,
      minRatio,
      deleteOriginalAssets
    };

    if (typeof algorithm === 'string') {
      // eslint-disable-next-line global-require
      var zlib = require('zlib');
      this.options.algorithm = zlib[this.options.algorithm];

      if (!this.options.algorithm) {
        throw new Error('Algorithm not found in zlib');
      }

      this.options.compressionOptions = {
        level: options.level || 9,
        flush: options.flush,
        chunkSize: options.chunkSize,
        windowBits: options.windowBits,
        memLevel: options.memLevel,
        strategy: options.strategy,
        dictionary: options.dictionary
      };
    }
  }

  _createClass(CompressionPlugin, [{
    key: 'apply',
    value: function apply(compiler) {
      var _this = this;

      var emit = function emit(compilation, callback) {
        var _options = _this.options,
            cache = _options.cache,
            threshold = _options.threshold,
            minRatio = _options.minRatio,
            assetName = _options.asset,
            filename = _options.filename,
            deleteOriginalAssets = _options.deleteOriginalAssets;

        var cacheDir = cache === true ? (0, _findCacheDir2.default)({ name: 'compression-webpack-plugin' }) : cache;

        var assets = compilation.assets;
        // eslint-disable-next-line consistent-return

        _neoAsync2.default.forEach(Object.keys(assets), function (file, cb) {
          if (!_ModuleFilenameHelpers2.default.matchObject(_this.options, file)) {
            return cb();
          }

          var asset = assets[file];
          var input = asset.source();

          if (!Buffer.isBuffer(input)) {
            input = Buffer.from(input);
          }

          var originalSize = input.length;

          if (originalSize < threshold) {
            return cb();
          }

          return Promise.resolve().then(function () {
            if (cache) {
              var cacheKey = (0, _serializeJavascript2.default)({
                // Invalidate cache after upgrade `zlib` module (build-in in `nodejs`)
                node: process.version,
                'compression-webpack-plugin': _package2.default.version,
                'compression-webpack-plugin-options': _this.options,
                path: compiler.outputPath ? `${compiler.outputPath}/${file}` : file,
                hash: _crypto2.default.createHash('md4').update(input).digest('hex')
              });

              return _cacache2.default.get(cacheDir, cacheKey).then(function (result) {
                return result.data;
              }, function () {
                return Promise.resolve().then(function () {
                  return _this.compress(input);
                }).then(function (data) {
                  return _cacache2.default.put(cacheDir, cacheKey, data).then(function () {
                    return data;
                  });
                });
              });
            }

            return _this.compress(input);
          }).then(function (result) {
            if (result.length / originalSize > minRatio) {
              return cb();
            }

            var parse = _url2.default.parse(file);
            var sub = {
              file,
              path: parse.pathname,
              query: parse.query || ''
            };

            var newAssetName = assetName.replace(/\[(file|path|query)\]/g, function (p0, p1) {
              return sub[p1];
            });

            if (typeof filename === 'function') {
              newAssetName = filename(newAssetName);
            }

            assets[newAssetName] = new _RawSource2.default(result);

            if (deleteOriginalAssets) {
              delete assets[file];
            }

            return cb();
          }).catch(cb);
        }, callback);
      };

      if (compiler.hooks) {
        var plugin = { name: 'CompressionPlugin' };
        compiler.hooks.emit.tapAsync(plugin, emit);
      } else {
        compiler.plugin('emit', emit);
      }
    }
  }, {
    key: 'compress',
    value: function compress(input) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var _options2 = _this2.options,
            algorithm = _options2.algorithm,
            compressionOptions = _options2.compressionOptions;


        algorithm(input, compressionOptions, function (error, result) {
          if (error) {
            return reject(error);
          }

          return resolve(result);
        });
      });
    }
  }]);

  return CompressionPlugin;
}();

exports.default = CompressionPlugin;