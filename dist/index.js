"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var cssBuilder = require('css');

var cssToReactNative = require('css-to-react-native')["default"];

var fs = require('fs');

var postcss = require('postcss');

var tailwind = require('tailwindcss');

var config = require('tailwindcss/resolveConfig');
/*
 * All this crazy logic belongs to: https://github.com/vadimdemedes/tailwind-rn
 */


var remToPx = function remToPx(value) {
  return "".concat(Number.parseFloat(value) * 16, "px");
};

var getStyles = function getStyles(rule) {
  var styles = rule.declarations.filter(function (_ref) {
    var property = _ref.property,
        value = _ref.value;

    // Skip line-height utilities without units
    if (property === 'line-height' && !value.endsWith('rem')) {
      return false;
    }

    return true;
  }).map(function (_ref2) {
    var property = _ref2.property,
        value = _ref2.value;

    if (value.endsWith('rem')) {
      return [property, remToPx(value)];
    }

    return [property, value];
  });
  return cssToReactNative(styles);
};

var supportedUtilities = [// Flexbox
/^flex/, /^items-/, /^content-/, /^justify-/, /^self-/, // Display
'hidden', 'overflow-hidden', 'overflow-visible', 'overflow-scroll', // Position
'absolute', 'relative', // Top, right, bottom, left
/^(inset-0|inset-x-0|inset-y-0)/, /^(top|bottom|left|right)-0$/, // Z Index
/^z-\d+$/, // Padding
/^(p.?-\d+|p.?-px)/, // Margin
/^-?(m.?-\d+|m.?-px)/, // Width
/^w-(\d|\/)+|^w-px|^w-full/, // Height
/^(h-\d+|h-px|h-full)/, // Min/Max width/height
/^(min-w-|max-w-|min-h-0|min-h-full|max-h-full)/, // Font size
/^text-/, // Font style
/^(not-)?italic$/, // Font weight
/^font-(hairline|thin|light|normal|medium|semibold|bold|extrabold|black)/, // Letter spacing
/^tracking-/, // Line height
/^leading-\d+/, // Text align, color, opacity
/^text-/, // Text transform
'uppercase', 'lowercase', 'capitalize', 'normal-case', // Background color
/^bg-(transparent|black|white|gray|red|orange|yellow|green|teal|blue|indigo|purple|pink)/, // Background opacity
/^bg-opacity-/, // Border color, style, width, radius, opacity
/^(border|rounded)/, // Opacity
/^opacity-/, // Pointer events
/^pointer-events-/];

var isUtilitySupported = function isUtilitySupported(utility) {
  // Skip utilities with `currentColor` values
  if (['border-current', 'text-current'].includes(utility)) {
    return false;
  }

  var _iterator = _createForOfIteratorHelper(supportedUtilities),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var supportedUtility = _step.value;

      if (typeof supportedUtility === 'string' && supportedUtility === utility) {
        return true;
      }

      if (supportedUtility instanceof RegExp && supportedUtility.test(utility)) {
        return true;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return false;
};

var build = function build(source) {
  var _cssBuilder$parse = cssBuilder.parse(source),
      stylesheet = _cssBuilder$parse.stylesheet; // Mapping of Tailwind class names to React Native styles


  var styles = {};

  var _iterator2 = _createForOfIteratorHelper(stylesheet.rules),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var rule = _step2.value;

      if (rule.type === 'rule') {
        var _iterator3 = _createForOfIteratorHelper(rule.selectors),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var selector = _step3.value;
            var utility = selector.replace(/^\./, '').replace('\\/', '/');

            if (isUtilitySupported(utility)) {
              styles[utility] = getStyles(rule);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } // Additional styles that we're not able to parse correctly automatically

  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  styles.underline = {
    textDecorationLine: 'underline'
  };
  styles['line-through'] = {
    textDecorationLine: 'line-through'
  };
  styles['no-underline'] = {
    textDecorationLine: 'none'
  };
  return styles;
};
/*
 * Now we're back in babel land.
 */


var source = "\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";
var tailwindConfig = config();
tailwindConfig.target = 'ie11';
postcss([tailwind(tailwindConfig)]).process(source, {
  from: undefined
}).then(function (_ref3) {
  var css = _ref3.css;
  var styles = build(css);
  fs.writeFileSync("".concat(__dirname, "/styles.json"), JSON.stringify(styles, null, '\t'));
})["catch"](function (error) {
  // eslint-disable-next-line no-console
  console.error('> Error occurred while generating styles'); // eslint-disable-next-line no-console

  console.error(error.stack);
  process.exit(1);
});
fs.writeFileSync("".concat(__dirname, "/screens.json"), JSON.stringify(config().theme.screens, null, '\t'));

module.exports = function (_ref4) {
  var t = _ref4.types;
  return {
    name: 'tailwind-rn',
    visitor: {
      JSXOpeningElement: function JSXOpeningElement(path) {
        var classNameAttribute = null;
        var existingStyleAttribute = null;
        path.get('attributes').forEach(function (attribute) {
          if (!attribute.node.name) {
            return;
          }

          if (attribute.node.name.name === 'style') {
            existingStyleAttribute = attribute.node;
          }

          if (attribute.node.name.name === 'className' || attribute.node.name.name === 'tailwind') {
            classNameAttribute = attribute.node.value.value;
            attribute.remove();
          }
        });

        if (!classNameAttribute) {
          return;
        }

        var expression = t.callExpression(t.identifier('useTailwind'), [t.stringLiteral(classNameAttribute)]);

        if (existingStyleAttribute) {
          existingStyleAttribute.value.expression.properties.push(t.spreadElement(expression));
          return;
        }

        path.node.attributes.push(t.JSXAttribute(t.JSXIdentifier('style'), t.jsxExpressionContainer(expression)));
      }
    }
  };
};