import { useEffect, useState } from 'react'
import { Dimensions } from 'react-native'
import styles from './styles.json'
import screens from './screens.json'

const getWidth = () => {
  if (Dimensions) {
    return Dimensions.get('window').width
  }

  return window.innerWidth
}

const bindResize = (callback) => {
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

function useTailwind(string) {
  const [, setWidth] = useState(getWidth())

  useEffect(() => {
    function update() {
      setWidth(getWidth())
    }

    bindResize(update)

    return () => unbindResize(update)
  })

  return getStyles(string)
}

global.useTailwind = useTailwind
