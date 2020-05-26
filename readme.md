# React Native Tailwind CSS

This is not production ready, is just a proof of concept currently.

# Installation

- `yarn add https://github.com/OwenMelbz/babel-plugin-tailwind-rn.git`

- `babel.config.js` add the plugin `tailwind-rn` e.g. `plugins: ['tailwind-rn']`

# Usage

We need to boot up the tailwind hook (until I figure out how to automate).

You do this by importing the hook into your entry file e.g. App.js

```js
import React from 'react';

// Add this!
import 'babel-plugin-tailwind-rn/dist/useTailwind'
```

Then use the normal react syntax!

```jsx
function App() {
	return <Text class="text-md lg:text-xl"></Text>
}
```