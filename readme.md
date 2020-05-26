# React Native Tailwind CSS

This is not production ready, is just a proof of concept currently.

# Installation

- `yarn install git@github.com:OwenMelbz/babel-plugin-tailwind-rn.git`

- `babel.config.js` add the plugin `tailwind-rn` e.g. `plugins: ['tailwind-rn']`

- Import to your App.js `import 'babel-plugin-tailwindcss-rn/dist/useTailwind'` (hoping to automate this later)

# Usage

We need to boot up the tailwind hook (until I figure out how to automate).

You do this by importing the hook into your entry file e.g. App.js

```js
import React from 'react';

// Add this!
import 'babel-plugin-tailwindcss-rn/dist/useTailwind'
```

Then use the normal react syntax!

```jsx
function App() {
	return <Text class="text-md lg:text-xl"></Text>
}
```