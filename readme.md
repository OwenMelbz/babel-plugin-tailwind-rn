# React Native Tailwind CSS

When a babel plugin, and react hook has a baby. You end up with this! A way that allows you to use Tailwind CSS within your React Native project via the familiar `className` property!

<img src="https://raw.githubusercontent.com/OwenMelbz/babel-plugin-tailwind-rn/318682dcbe9ccb391b76e60ada5590c9153e9b17/screenshot.png" alt="screenshot" />

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

If you make a change to the `tailwind.config.js` you will need to cancel your metro bundler and boot it up again

# Example Project

You can download an example project which uses Expo to see how it works

https://github.com/OwenMelbz/tailwind-rn-example

## Disclaimer

Code heavily influenced from: https://github.com/vadimdemedes/tailwind-rn as well as some glorious copy/paste of the class validation utilities!

Also thanks to Brad from Discord... I don't know who you are, or where you came from. But thanks for Babel support!
