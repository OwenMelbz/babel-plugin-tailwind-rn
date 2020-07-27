"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _reactNative = require("react-native");

var _styles = _interopRequireDefault(require("./styles.json"));

var _screens = _interopRequireDefault(require("./screens.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function debounce(func, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;

    var later = function later() {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function getWidth() {
  if (_reactNative.Dimensions) {
    return _reactNative.Dimensions.get('window').width;
  }

  return window.innerWidth;
}

function bindResize(callback) {
  if (_reactNative.Dimensions) {
    return _reactNative.Dimensions.addEventListener('change', callback);
  }

  return window.addEventListener('resize', callback);
}

function unbindResize(callback) {
  if (_reactNative.Dimensions) {
    return _reactNative.Dimensions.removeEventListener('change', callback);
  }

  return window.removeEventListener('resize', callback);
}

function getStyles(string) {
  var width = getWidth();
  var classes = string.split(' ');
  var style = {};
  classes.forEach(function (name) {
    style = _objectSpread(_objectSpread({}, style), _styles["default"][name]);

    if (name.includes(':')) {
      var _name$split = name.split(':'),
          _name$split2 = _slicedToArray(_name$split, 2),
          size = _name$split2[0],
          utility = _name$split2[1];

      var breakpoint = Number.parseInt(_screens["default"][size]);

      if (width >= breakpoint) {
        style = _objectSpread(_objectSpread({}, style), _styles["default"][utility]);
      }
    }
  });
  return style;
}

var TailwindProvider = function TailwindProvider(WrappedComponent) {
  return function (props) {
    var _useState = (0, _react.useState)(getWidth()),
        _useState2 = _slicedToArray(_useState, 2),
        width = _useState2[0],
        setWidth = _useState2[1];

    (0, _react.useEffect)(function () {
      function update() {
        setWidth(getWidth());
      }

      var debounced = debounce(update, 200);
      bindResize(debounced);
      return function () {
        return unbindResize(debounced);
      };
    });
    return /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      windowWidth: width
    }));
  };
};

var _default = TailwindProvider;
exports["default"] = _default;
global.useTailwind = getStyles;