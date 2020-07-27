import React, { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import styles from './styles.json'
import screens from './screens.json'

function debounce(func, wait) {
  let timeout

  return function () {
    const context = this
    const args = arguments

    const later = function () {
      timeout = null
      func.apply(context, args)
    }

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)
  }
}

function getWidth() {
  if (Dimensions) {
    return Dimensions.get('window').width
  }

  return window.innerWidth
}

function bindResize(callback) {
  if (Dimensions) {
    return Dimensions.addEventListener('change', callback)
  }

  return window.addEventListener('resize', callback)
}

function unbindResize(callback) {
  if (Dimensions) {
    return Dimensions.removeEventListener('change', callback)
  }

  return window.removeEventListener('resize', callback)
}

function getStyles(string) {
  const width = getWidth()
  const classes = string.split(' ')
  let style = {}

  classes.forEach((name) => {
    style = { ...style, ...styles[name] }

    if (name.includes(':')) {
      const [size, utility] = name.split(':')
      const breakpoint = Number.parseInt(screens[size])

      if (width >= breakpoint) {
        style = { ...style, ...styles[utility] }
      }
    }
  })

  return style
}

const TailwindProvider = (WrappedComponent) => (props) => {
  const [width, setWidth] = useState(getWidth())

  useEffect(() => {
    function update() {
      setWidth(getWidth())
    }

    const debounced = debounce(update, 200)

    bindResize(debounced)

    return () => unbindResize(debounced)
  })

  return <WrappedComponent {...props} windowWidth={ width } />
}

export default TailwindProvider;

global.useTailwind = getStyles

