'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PopperTargetHelper = function PopperTargetHelper(props, context) {
  context.popperManager.setTargetNode((0, _utils.getTarget)(props.target));
  return null;
};

PopperTargetHelper.contextTypes = {
  popperManager: _propTypes2.default.object.isRequired
};

PopperTargetHelper.propTypes = {
  target: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func, _utils.DOMElement]).isRequired
};

exports.default = PopperTargetHelper;