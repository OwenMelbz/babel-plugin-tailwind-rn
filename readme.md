# React Native Tailwind CSS v2

When a babel plugin, and react hook has a baby. You end up with this! A way that allows you to use Tailwind CSS within your React Native project via the familiar `className` property!

<img src="https://raw.githubusercontent.com/OwenMelbz/babel-plugin-tailwind-rn/318682dcbe9ccb391b76e60ada5590c9153e9b17/screenshot.png" alt="screenshot" />

# Changes since v1

The architecture around v1 focused on using hooks within each component, however React doesn't support a dynamic number of hooks, which means if the number or rows, views etc changed it would throw an error.

The internals for the react side of v2 have been changed to an HOC which stores the state only once, then passes it down to each component by wrapping your layout level component (often the `App`) with our `useTailwind` function.

# Installation

- `yarn add babel-plugin-tailwind-rn`

- `babel.config.js` add the plugin `tailwind-rn` e.g. `plugins: ['tailwind-rn']`

# Usage

When Metro/Webpack boots up, it runs your apps javascript through babel.

We hook into this process converting your `className="text-xl"` props into `style={useTailwind("text-xl")}`

This means we're able to add listeners on the resize events and dynamically update your styles based off the responsive Tailwind classes.

To provide your components with the correct classes, you'll need to wrap your `App` with our HOC, this is your root-most component.

```js
import useTailwind from 'babel-plugin-tailwind-rn/dist/useTailwind'

function App() {
    return <Text>My Tailwind App!</Text>
}

export default useTailwind(App)
```

Then use the normal react syntax!

```jsx
function App() {
    return <Text className="text-md lg:text-xl">My Tailwind App!</Text>
}
```

# Important Notes

## Updating Config

Metro uses heavy caching to speed up your builds, this means it holds your tailwind config in memory on the device/simulator.

Once you've made changes to your `tailwind.config.js` You need to clear the metro cache, often with `shift + r` which reloads with fresh cache.

However that only refreshes the webpack cache, you now need to exit the RN app on the simulator/device, and then relaunch the app. Metro allows you to push `i` or `a` to launch it again.

# Example Project

You can download an example project which uses Expo to see how it works

https://github.com/OwenMelbz/tailwind-rn-example

## Disclaimer

Code heavily influenced from: https://github.com/vadimdemedes/tailwind-rn as well as some glorious copy/paste of the class validation utilities!

Also thanks to Brad from Discord... I don't know who you are, or where you came from. But thanks for Babel support!
