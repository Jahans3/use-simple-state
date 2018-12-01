# <img src="https://github.com/Jahans3/use-simple-state/blob/master/uss-logo.png" width="330">

A simple, dependency-free state manager for React using hooks.

Note: includes react@16.7.0-alpha.2 and react-dom@16.7.0-alpha.2 as peer dependencies. Once 16.7 ships this will be updated.

* [Installation](#installation)
* [Getting Started](#getting-started)
* [API](#api)

## Installation
Intall using yarn or npm:
```
yarn add use-simple-state
npm install use-simple-state --save
```

Ensure you have the correct peer dependencies (note that these will be updated when hooks are fully released):
```
yarn add react@16.7.0-alpha.2 react-dom@16.7.0-alpha.2
npm install react@16.7.0-alpha.2 react-dom@16.7.0-alpha.2 --save
```

## Getting Started
Before we get started, we first need an initial state, as well as actions and at least one reducer:

```js
const initialState = { count: 0 };

const addOne = () => ({ type: 'ADD_ONE' });
const minusOne = () => ({ type: 'MINUS_ONE' });

const countReducer = ({ type }, { count }) => {
  switch (type) {
    case 'ADD_ONE':
      return { count: count + 1 };
    case 'MINUS_ONE':
      return { count: count - 1 };
}
```

Lastly, we simply import `SimpleStateProvider`, pass our reducers and initial state, then wrap our app's root component:

```js
import React from 'react';
import { SimpleStateProvider } from 'use-simple-state';
import App from './App';

export default function Root () {
  return (
    <SimpleStateProvider initialState={initialState} reducers={[reducers]}>
      <App />
    </SimpleStateProvider>
  );
}
```

And that's it.

Now whenever we want to access or update our state, we just import the `useSimple` hook:

```js
import React from 'react';
import { useSimple } from 'use-simple-state';
import { addOne, minusOne } from './store';

export default function Counter () {
  const [state, dispatch] = useSimple();
  return (
    <>
      <h1>Count: {state.count}</h1>
      <button onClick={() => dispatch(addOne())}> +1 </button>
      <button onClick={() => dispatch(minusOne())}> -1 </button>
    </>
  );
}
```

See below for the full API.

## API
### useSimple
A custom [React hook](https://reactjs.org/docs/hooks-intro.html) that lets us access our state and disptcher from inside components.

```js
useSimple(mapState?: Function, mapDispatch?: Function): Array<mixed>
```

Has two optional parameters: `mapState` and `mapDispatch`:
##### `mapState`
If `mapState` is passed, it will be used to compute the output state and the result will be passed to the first element of the array returned by `useSimple`.

```js
mapState(state: Object): *
```

*Note: `null` can also be passed if you want to use `mapDispatch` but have no use for a `mapState` function.*

##### `mapDispatch`
`mapDispatch` can be used to pre-wrap actions in `dispatch`. If `mapDispatch` is passed, the result will be given as the second element of the array returned by `useSimple`.

```js
mapDispatch(dispatch: Function): *
```

### SimpleStateProvider
Wraps our root component and makes state available to our React app.

Has two mandatory props: `initialState` and `reducers`, as well as an optional prop: `middleware`

##### `initialState`
An object representing the initial state of our app.

##### `reducers`
An array of reducers.

Reducers take an action as well as the current state and use these to derive a new state. If a reducer returns `undefined` there will be no state update.

Reducers should have the following API:
```js
(action, state) => nextState
```

##### `middleware`
Middleware are functions used to handle side effects in our app.

A middleware function is given two parameters: `action` and `state`.

If any middleware returns `null`, the triggering `action` will be blocked from reaching our `reducers` and the state will not be updated.
