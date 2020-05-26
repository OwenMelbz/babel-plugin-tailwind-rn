const css = require('css');
const cssToReactNative = require('css-to-react-native').default;
const fs = require('fs');
const postcss = require('postcss');
const tailwind = require('tailwindcss');
const config = require('tailwindcss/resolveConfig')

const remToPx = value => `${Number.parseFloat(value) * 16}px`;

const getStyles = rule => {
    const styles = rule.declarations
        .filter(({property, value}) => {
            // Skip line-height utilities without units
            if (property === 'line-height' && !value.endsWith('rem')) {
                return false;
            }

            return true;
        })
        .map(({property, value}) => {
            if (value.endsWith('rem')) {
                return [property, remToPx(value)];
            }

            return [property, value];
        });

    return cssToReactNative(styles);
};

const supportedUtilities = [
    // Flexbox
    /^flex/,
    /^items-/,
    /^content-/,
    /^justify-/,
    /^self-/,
    // Display
    'hidden',
    'overflow-hidden',
    'overflow-visible',
    'overflow-scroll',
    // Position
    'absolute',
    'relative',
    // Top, right, bottom, left
    /^(inset-0|inset-x-0|inset-y-0)/,
    /^(top|bottom|left|right)-0$/,
    // Z Index
    /^z-\d+$/,
    // Padding
    /^(p.?-\d+|p.?-px)/,
    // Margin
    /^-?(m.?-\d+|m.?-px)/,
    // Width
    /^w-(\d|\/)+|^w-px|^w-full/,
    // Height
    /^(h-\d+|h-px|h-full)/,
    // Min/Max width/height
    /^(min-w-|max-w-|min-h-0|min-h-full|max-h-full)/,
    // Font size
    /^text-/,
    // Font style
    /^(not-)?italic$/,
    // Font weight
    /^font-(hairline|thin|light|normal|medium|semibold|bold|extrabold|black)/,
    // Letter spacing
    /^tracking-/,
    // Line height
    /^leading-\d+/,
    // Text align, color, opacity
    /^text-/,
    // Text transform
    'uppercase',
    'lowercase',
    'capitalize',
    'normal-case',
    // Background color
    /^bg-(transparent|black|white|gray|red|orange|yellow|green|teal|blue|indigo|purple|pink)/,
    // Background opacity
    /^bg-opacity-/,
    // Border color, style, width, radius, opacity
    /^(border|rounded)/,
    // Opacity
    /^opacity-/,
    // Pointer events
    /^pointer-events-/
];

const isUtilitySupported = utility => {
    // Skip utilities with `currentColor` values
    if (['border-current', 'text-current'].includes(utility)) {
        return false;
    }

    for (const supportedUtility of supportedUtilities) {
        if (typeof supportedUtility === 'string' && supportedUtility === utility) {
            return true;
        }

        if (supportedUtility instanceof RegExp && supportedUtility.test(utility)) {
            return true;
        }
    }

    return false;
};

const build = source => {
    const {stylesheet} = css.parse(source);

    // Mapping of Tailwind class names to React Native styles
    const styles = {};

    for (const rule of stylesheet.rules) {
        if (rule.type === 'rule') {
            for (const selector of rule.selectors) {
                const utility = selector.replace(/^\./, '').replace('\\/', '/');

                if (isUtilitySupported(utility)) {
                    styles[utility] = getStyles(rule);
                }
            }
        }
    }

    // Additional styles that we're not able to parse correctly automatically
    styles.underline = {textDecorationLine: 'underline'};
    styles['line-through'] = {textDecorationLine: 'line-through'};
    styles['no-underline'] = {textDecorationLine: 'none'};

    return styles;
};

const source = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

postcss([tailwind])
.process(source, {from: undefined})
.then(({css}) => {
    const styles = build(css);
    fs.writeFileSync('node_modules/babel-plugin-tailwindcss-rn/dist/styles.json', JSON.stringify(styles, null, '\t'));
})
.catch(error => {
    console.error('> Error occurred while generating styles');
    console.error(error.stack);
    process.exit(1);
});

fs.writeFileSync(
    'node_modules/babel-plugin-tailwindcss-rn/dist/screens.json',
    JSON.stringify(config().theme.screens, null, '\t')
)

module.exports = ({ types: t }) => {
    return {
        name: 'tailwindcss-rn',
        visitor: {
            // JSXAttribute(path, state) {
            //     if (path.node.name.name === 'className') {
            //         state.shouldImport = true
            //     }
            // },
            // Program: {
            //     exit(path, state) {
            //         if (state.shouldImport) {
            //             path.unshiftContainer('body', t.importDeclaration([], t.stringLiteral('babel-plugin-tailwindcss-rn/dist/useTailwind')))
            //         }
            //     }
            // },
            JSXOpeningElement(path) {
                let classNameAttribute = null
                let existingStyleAttribute = null

                path.get('attributes').forEach((attribute) => {
                    if (!attribute.node.name) {
                        return
                    }

                    if (attribute.node.name.name === 'style') {
                        existingStyleAttribute = attribute.node
                    }

                    if (
                        attribute.node.name.name === 'className' ||
                        attribute.node.name.name === 'tailwind'
                    ) {
                        classNameAttribute = attribute.node.value.value
                        attribute.remove()
                    }
                })

                if (!classNameAttribute) {
                    return
                }

                const expression = t.callExpression(t.identifier('useTailwind'), [
                    t.stringLiteral(classNameAttribute),
                ])

                if (existingStyleAttribute) {
                    existingStyleAttribute.value.expression.properties.push(
                        t.spreadElement(expression),
                    )

                    return
                }

                path.node.attributes.push(
                    t.JSXAttribute(
                        t.JSXIdentifier('style'),
                        t.jsxExpressionContainer(expression),
                    ),
                )
            },
        },
    }
}
