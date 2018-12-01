# <img src="https://raw.githubusercontent.com/Jahans3/use-simple-state/master/uss-logo.png" width="250">

A simple, lightweight (*1kb*), dependency-free state manager for React, built using hooks.

*Note: includes react@16.7.0-alpha.2 as a peer dependency. Once 16.7 ships this will be updated to use `^react@16.7.0`*

* [Installation](#installation)
* [Getting Started](#getting-started)
* [API](#api)

## Installation
Intall the package using yarn or npm:
```
yarn add use-simple-state
npm install use-simple-state --save
```

Ensure you have the correct version of `react` installed, as well the corresponding `react-dom` version (this step will be removed in a future release):
```
yarn add react@16.7.0-alpha.2 react-dom@16.7.0-alpha.2
npm install react@16.7.0-alpha.2 react-dom@16.7.0-alpha.2 --save
```

## Getting Started
Before we get started, we first need an initial state, as well as some actions and at least one reducer:

```js
const initialState = { count: 0 };

const addOne = () => ({ type: 'ADD_ONE' });
const minusOne = () => ({ type: 'MINUS_ONE' });

const countReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ONE':
      return { count: state.count + 1 };
    case 'MINUS_ONE':
      return { count: state.count - 1 };
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

## Async Actions
Comes with built-in support for asynchronous actions by providing a `redux-thunk`-like API.

If a function is passed to `dispatch` it will be called with `dispatch` and `state` as parameters. This allows us to handle async tasks, like the following example of an action used to authenticate a user:

```js
// Some synchronous actions
const logInRequest = () => ({ type: 'LOG_IN_REQUEST' });
const logInSuccess = ({ user }) => ({ type: 'LOG_IN_SUCCESS', payload: user });
const logInError = ({ error }) => ({ type: 'LOG_IN_ERROR', payload: error });

// Our asynchronous action
function logIn ({ email, password }) {
  return async (dispatch, state) => {
    dispatch(logInRequest());

    try {
      const user = await api.authenticateUser({ email, password })'
      dispatch(logInSuccess({ user }));
    } catch (error) {
      dispatch(logInError({ error }));
    }
  };
}

// Dispatch logIn like any other action
dispatch(logIn({ email, password }));
```

## API
### `useSimple`
A custom [React hook](https://reactjs.org/docs/hooks-intro.html) that lets us access our state and `dispatch` function from inside components.

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

### `SimpleStateProvider`
Wraps our root component and makes state available to our React app.

Has two mandatory props: `initialState` and `reducers`, as well as an optional prop: `middleware`

##### `initialState`
An object representing the initial state of our app.

##### `reducers`
An array of reducers.

Reducers take an action as well as the current state and use these to derive a new state. If a reducer returns `undefined` there will be no state update.

Reducers should have the following API:
```js
(state, action) => nextState
```

##### `middleware`
Middleware are functions used to handle side effects in our app.

A middleware function is given two parameters: `state` and `action`.

If any middleware returns `null`, the triggering `action` will be blocked from reaching our `reducers` and the state will not be updated.
