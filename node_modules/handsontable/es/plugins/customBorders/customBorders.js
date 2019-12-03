var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BasePlugin from './../_base';
import { registerPlugin } from './../../plugins';
import { hasOwnProperty } from './../../helpers/object';
import { rangeEach } from './../../helpers/number';
import { CellRange, Selection } from './../../3rdparty/walkontable/src';
import Hooks from './../../pluginHooks';
import { arrayEach } from './../../helpers/array';
import * as C from './../../i18n/constants';
import bottom from './contextMenuItem/bottom';
import left from './contextMenuItem/left';
import noBorders from './contextMenuItem/noBorders';
import right from './contextMenuItem/right';
import top from './contextMenuItem/top';
import { createClassName, createDefaultCustomBorder, createSingleEmptyBorder, createEmptyBorders, extendDefaultBorder } from './utils';
/**
 * @plugin CustomBorders
 *
 * @description
 * This plugin enables an option to apply custom borders through the context menu (configurable with context menu key `borders`).
 *
 * To initialize Handsontable with predefined custom borders, provide cell coordinates and border styles in a form of an array.
 *
 * See [Custom Borders](http://docs.handsontable.com/demo-custom-borders.html) demo for more examples.
 *
 * @example
 * ```js
 * ...
 * customBorders: [
 *   {
 *    range: {
 *      from: {
 *        row: 1,
 *        col: 1
 *      },
 *      to: {
 *        row: 3,
 *        col: 4
 *      },
 *    },
 *    left: {},
 *    right: {},
 *    top: {},
 *    bottom: {},
 *   },
 * ],
 * ...
 *
 * // or
 * ...
 * customBorders: [
 *   { row: 2,
 *     col: 2,
 *     left: {
 *       width: 2,
 *       color: 'red',
 *     },
 *     right: {
 *       width: 1,
 *       color: 'green',
 *     },
 *     top: '',
 *     bottom: '',
 *   }.
 * ],
 * ...
 * ```
 * @private
 * @class CustomBorders
 */

var CustomBorders = function (_BasePlugin) {
  _inherits(CustomBorders, _BasePlugin);

  function CustomBorders(hotInstance) {
    _classCallCheck(this, CustomBorders);

    /**
     * Saved borders settings.
     *
     * @type {Array}
     */
    var _this = _possibleConstructorReturn(this, (CustomBorders.__proto__ || Object.getPrototypeOf(CustomBorders)).call(this, hotInstance));

    _this.savedBorderSettings = void 0;
    return _this;
  }

  /**
   * Check if the plugin is enabled in the handsontable settings.
   *
   * @returns {Boolean}
   */


  _createClass(CustomBorders, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return !!this.hot.getSettings().customBorders;
    }

    /**
     * Enable plugin for this Handsontable instance.
     */

  }, {
    key: 'enablePlugin',
    value: function enablePlugin() {
      var _this2 = this;

      if (this.enabled) {
        return;
      }

      this.addHook('afterContextMenuDefaultOptions', function (options) {
        return _this2.onAfterContextMenuDefaultOptions(options);
      });
      this.addHook('afterInit', function () {
        return _this2.onAfterInit();
      });

      _get(CustomBorders.prototype.__proto__ || Object.getPrototypeOf(CustomBorders.prototype), 'enablePlugin', this).call(this);
    }

    /**
     * Disable plugin for this Handsontable instance.
     */

  }, {
    key: 'disablePlugin',
    value: function disablePlugin() {
      this.clearBorders();

      _get(CustomBorders.prototype.__proto__ || Object.getPrototypeOf(CustomBorders.prototype), 'disablePlugin', this).call(this);
    }

    /**
     * Updates the plugin to use the latest options you have specified.
     */

  }, {
    key: 'updatePlugin',
    value: function updatePlugin() {
      this.disablePlugin();
      this.enablePlugin();

      this.changeBorderSettings();

      _get(CustomBorders.prototype.__proto__ || Object.getPrototypeOf(CustomBorders.prototype), 'updatePlugin', this).call(this);
    }

    /**
     * Get index of border from the settings.
     *
     * @param {String} className Class name as string.
     * @returns {Number}
     */

  }, {
    key: 'getSettingIndex',
    value: function getSettingIndex(className) {
      var index = -1;

      arrayEach(this.hot.selection.highlight.borders, function (selection, i) {
        if (selection.settings.className === className) {
          index = i;

          return false;
        }
      });

      return index;
    }

    /**
     * Insert WalkontableSelection instance into Walkontable settings.
     *
     * @param {Object} border Object with `row` and `col`, `left`, `right`, `top` and `bottom`, `className` and `border` ({Object} with `color`, `width` and `cornerVisible` property) properties.
     */

  }, {
    key: 'insertBorderIntoSettings',
    value: function insertBorderIntoSettings(border) {
      var coordinates = {
        row: border.row,
        col: border.col
      };
      var selection = new Selection(border, new CellRange(coordinates, coordinates, coordinates));
      var index = this.getSettingIndex(border.className);

      if (index >= 0) {
        this.hot.selection.highlight.borders[index] = selection;
      } else {
        this.hot.selection.highlight.borders.push(selection);
      }
    }

    /**
     * Prepare borders from setting (single cell).
     *
     * @param {Number} row Visual row index.
     * @param {Number} col Visual column index.
     * @param {Object} borderObj Object with `row` and `col`, `left`, `right`, `top` and `bottom` properties.
     */

  }, {
    key: 'prepareBorderFromCustomAdded',
    value: function prepareBorderFromCustomAdded(row, col, borderObj) {
      var border = createEmptyBorders(row, col);

      border = extendDefaultBorder(border, borderObj);
      this.hot.setCellMeta(row, col, 'borders', border);

      this.insertBorderIntoSettings(border);
    }

    /** *
     * Prepare borders from setting (object).
     *
     * @param {Object} rowObj Object with `range`, `left`, `right`, `top` and `bottom` properties.
     */

  }, {
    key: 'prepareBorderFromCustomAddedRange',
    value: function prepareBorderFromCustomAddedRange(rowObj) {
      var _this3 = this;

      var range = rowObj.range;

      rangeEach(range.from.row, range.to.row, function (rowIndex) {
        rangeEach(range.from.col, range.to.col, function (colIndex) {
          var border = createEmptyBorders(rowIndex, colIndex);
          var add = 0;

          if (rowIndex === range.from.row) {
            add += 1;

            if (hasOwnProperty(rowObj, 'top')) {
              border.top = rowObj.top;
            }
          }

          if (rowIndex === range.to.row) {
            add += 1;

            if (hasOwnProperty(rowObj, 'bottom')) {
              border.bottom = rowObj.bottom;
            }
          }

          if (colIndex === range.from.col) {
            add += 1;

            if (hasOwnProperty(rowObj, 'left')) {
              border.left = rowObj.left;
            }
          }

          if (colIndex === range.to.col) {
            add += 1;

            if (hasOwnProperty(rowObj, 'right')) {
              border.right = rowObj.right;
            }
          }

          if (add > 0) {
            _this3.hot.setCellMeta(rowIndex, colIndex, 'borders', border);
            _this3.insertBorderIntoSettings(border);
          }
        });
      });
    }

    /**
     * Remove borders divs from DOM.
     *
     * @param {String} borderClassName Border class name as string.
     */

  }, {
    key: 'removeBordersFromDom',
    value: function removeBordersFromDom(borderClassName) {
      var borders = this.hot.rootElement.querySelectorAll('.' + borderClassName + ':not(td)');

      rangeEach(0, borders.length - 1, function (index) {
        var parent = borders[index].parentNode;

        if (parent.parentNode) {
          parent.parentNode.removeChild(parent);
        }
      });
    }

    /**
     * Remove border (triggered from context menu).
     *
     * @param {Number} row Visual row index.
     * @param {Number} col Visual column index.
     */

  }, {
    key: 'removeAllBorders',
    value: function removeAllBorders(row, col) {
      var borderClassName = createClassName(row, col);

      this.removeBordersFromDom(borderClassName);
      this.hot.removeCellMeta(row, col, 'borders');
    }

    /**
     * Set borders for each cell re. to border position.
     *
     * @param {Number} row Visual row index.
     * @param {Number} col Visual column index.
     * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
     * @param {Boolean} remove True when remove borders, and false when add borders.
     */

  }, {
    key: 'setBorder',
    value: function setBorder(row, col, place, remove) {
      var bordersMeta = this.hot.getCellMeta(row, col).borders;

      if (!bordersMeta || bordersMeta.border === void 0) {
        bordersMeta = createEmptyBorders(row, col);
      }

      if (remove) {
        bordersMeta[place] = createSingleEmptyBorder();
      } else {
        bordersMeta[place] = createDefaultCustomBorder();
      }

      this.hot.setCellMeta(row, col, 'borders', bordersMeta);

      var borderClassName = createClassName(row, col);
      this.removeBordersFromDom(borderClassName);
      this.insertBorderIntoSettings(bordersMeta);

      this.hot.render();
    }

    /**
     * Prepare borders based on cell and border position.
     *
     * @param {Object} selected
     * @param {String} place Coordinate where add/remove border - `top`, `bottom`, `left`, `right` and `noBorders`.
     * @param {Boolean} remove True when remove borders, and false when add borders.
     */

  }, {
    key: 'prepareBorder',
    value: function prepareBorder(selected, place, remove) {
      var _this4 = this;

      arrayEach(selected, function (_ref) {
        var start = _ref.start,
            end = _ref.end;

        if (start.row === end.row && start.col === end.col) {
          if (place === 'noBorders') {
            _this4.removeAllBorders(start.row, start.col);
          } else {
            _this4.setBorder(start.row, start.col, place, remove);
          }
        } else {
          switch (place) {
            case 'noBorders':
              rangeEach(start.col, end.col, function (colIndex) {
                rangeEach(start.row, end.row, function (rowIndex) {
                  _this4.removeAllBorders(rowIndex, colIndex);
                });
              });
              break;

            case 'top':
              rangeEach(start.col, end.col, function (topCol) {
                _this4.setBorder(start.row, topCol, place, remove);
              });
              break;

            case 'right':
              rangeEach(start.row, end.row, function (rowRight) {
                _this4.setBorder(rowRight, end.col, place, remove);
              });
              break;

            case 'bottom':
              rangeEach(start.col, end.col, function (bottomCol) {
                _this4.setBorder(end.row, bottomCol, place, remove);
              });
              break;

            case 'left':
              rangeEach(start.row, end.row, function (rowLeft) {
                _this4.setBorder(rowLeft, start.col, place, remove);
              });
              break;
            default:
              break;
          }
        }
      });
    }

    /**
     * Create borders from settings.
     *
     * @private
     * @param {Array} customBorders Object with `row` and `col`, `left`, `right`, `top` and `bottom` properties.
     */

  }, {
    key: 'createCustomBorders',
    value: function createCustomBorders(customBorders) {
      var _this5 = this;

      rangeEach(0, customBorders.length - 1, function (index) {
        if (customBorders[index].range) {
          _this5.prepareBorderFromCustomAddedRange(customBorders[index]);
        } else {
          _this5.prepareBorderFromCustomAdded(customBorders[index].row, customBorders[index].col, customBorders[index]);
        }
      });

      this.hot.render();
      this.hot.view.wt.draw(true);
    }

    /**
     * Add border options to context menu.
     *
     * @private
     * @param {Object} defaultOptions Context menu items.
     */

  }, {
    key: 'onAfterContextMenuDefaultOptions',
    value: function onAfterContextMenuDefaultOptions(defaultOptions) {
      if (!this.hot.getSettings().customBorders) {
        return;
      }

      defaultOptions.items.push({
        name: '---------'
      }, {
        key: 'borders',
        name: function name() {
          return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_BORDERS);
        },
        disabled: function disabled() {
          return this.selection.isSelectedByCorner();
        },

        submenu: {
          items: [top(this), right(this), bottom(this), left(this), noBorders(this)]
        }
      });
    }

    /**
      * Clear borders.
      *
      * @private
      */

  }, {
    key: 'clearBorders',
    value: function clearBorders() {
      var _this6 = this;

      var bordersFromTable = this.hot.rootElement.querySelectorAll('td[class^="border"]');

      rangeEach(0, bordersFromTable.length - 1, function (index) {
        _this6.removeBordersFromDom(bordersFromTable[index].className);
      });
    }

    /**
     * Change borders from settings.
     *
     * @private
     */

  }, {
    key: 'changeBorderSettings',
    value: function changeBorderSettings() {
      var customBorders = this.hot.getSettings().customBorders;

      if (customBorders) {
        if (Array.isArray(customBorders)) {
          this.savedBorderSettings = customBorders;
          this.createCustomBorders(customBorders);
        } else if (customBorders !== void 0) {
          var borders = this.savedBorderSettings ? this.savedBorderSettings : customBorders;

          this.createCustomBorders(borders);
        }
      }
    }

    /**
     * `afterInit` hook callback.
     *
     * @private
     */

  }, {
    key: 'onAfterInit',
    value: function onAfterInit() {
      this.changeBorderSettings();
    }

    /**
     * Destroy plugin instance.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      _get(CustomBorders.prototype.__proto__ || Object.getPrototypeOf(CustomBorders.prototype), 'destroy', this).call(this);
    }
  }]);

  return CustomBorders;
}(BasePlugin);

registerPlugin('customBorders', CustomBorders);

export default CustomBorders;