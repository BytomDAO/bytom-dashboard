# Bytom Dashboard

## Development

#### Setup

Install Node.js:

```
brew install node
```

Install dependencies:

```
npm install
```

Start the development server with

```
npm start
```

By default, the development server uses the following environment variables
with default values to connect to a local Bytom Core instance:

```
API_URL=http://localhost:3000/api
PROXY_API_HOST=http://localhost:9889
```

#### Style Guide

We use `eslint` to maintain a consistent code style. To check the source
directory with `eslint`, run:

```
npm run lint src
```

### React + Redux

#### ES6

Babel is used to transpile the latest ES6 syntax into a format understood by
both Node.js and browsers. To get an ES6-compatible REPL (or run a one-off script)
you can use the `babel-node` command:

`$(npm bin)/babel-node`

#### Redux Actions

To inspect and debug Redux actions, we recommend the "Redux DevTools" Chrome
extension:

https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd


#### Creating new components

To generate a new component with a connected stylesheet, use the following
command:

```
npm run generate-component Common/MyComponent
```

The above command will create two new files in the `src/components` directory:

```
src/components/Common/MyComponent/MyComponent.jsx
src/components/Common/MyComponent/MyComponent.scss
```

with `MyComponent.scss` imported as a stylesheet into `MyComponent.jsx`.

Additionally, if there is an `index.js` file in `src/components/Common`, it
will appropriately add the newly created component to the index exports.
