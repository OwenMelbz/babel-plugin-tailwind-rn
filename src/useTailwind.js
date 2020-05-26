import React, { useEffect, useState, Dimensions } from 'react';
import styles from 'babel-plugin-tailwindcss-rn/dist/styles.json';
import screens from 'babel-plugin-tailwindcss-rn/dist/screens.json';

function getWidth() {
    if (Dimensions) {
        return Dimensions.get('window').width;
    }

    if (window) {
        return window.innerWidth;
    }
}

function bindResize(callback) {
    if (Dimensions) {
        Dimensions.addEventListener('change', callback)
    }

    if (window) {
        window.addEventListener('resize', callback)
    }
}

function unbindResize(callback) {
    if (Dimensions) {
        Dimensions.removeEventListener('change', callback)
    }

    if (window) {
        window.removeEventListener('resize', callback)
    }
}

function getStyles(string) {
    const width = getWidth();
    const classes = string.split(' ');
    let style = {};

    classes.forEach(name => {
        style = {...style, ...styles[name]}

        if (name.indexOf(':') !== -1) {
            const [size, utility] = name.split(':')
            const breakpoint = parseInt(screens[size]);

            if (width >= breakpoint) {
                style = {...style, ...styles[utility]}
            }
        }
    });

    return style;
}

function useTailwind(string) {
    const [width, setWidth] = useState(getWidth());

    useEffect(() => {
        function update() {
            setWidth(getWidth());
        }

        bindResize();

        return () => unbindResize();
    });

    return getStyles(string)
}

if (!global) {
    console.error('Cannot find "global" namespace to attach to...');
} else {
    global.useTailwind = useTailwind
}
