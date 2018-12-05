# <img src="https://raw.githubusercontent.com/Jahans3/use-simple-state/master/uss-logo.png" width="250">

A simple, lightweight (*1kb*), dependency-free state manager for React, built using hooks.

*Note: lists react@16.7.0-alpha.2 as a peer dependency. Once 16.7 ships this will be updated to use `^react@16.7.0`*

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
    <SimpleStateProvider initialState={initialState} reducers={[countReducer]}>
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

## Caveat
Hooks don't yet provide a way for us to bail out of rendering, *although the React team have indicated that this functionality
will be available once hooks are fully released*.

In the meantime I've provided a `SimpleConsumer` to consume our state using the old context API. This means our connected components won't re-render on
every state change, but rather will only update when the specific part of the store they're subscribed to changes.

```js
import { SimpleConsumer } from 'use-simple-state';

export default function Counter () {
  const [state, dispatch] = useSimple();
  return (
    <SimpleConsumer mapState={({ count }) => ({ count })}>
      {({ state, dispatch }) => (
        <>
          <h1>Count: {state.count}</h1>
          <button onClick={() => dispatch(addOne())}> +1 </button>
          <button onClick={() => dispatch(minusOne())}> -1 </button>
        </>
      )}
    </SimpleConsumer>
  );
}
```

## Async Actions
Comes with built-in support for asynchronous actions by providing an API similar to `redux-thunk`.

If a function is passed to `dispatch` it will be called with `dispatch` and `state` as parameters. This allows us to handle async tasks, like the following example of an action used to authenticate a user:

```js
// Some synchronous actions
const logInRequest = () => ({ type: 'LOG_IN_REQUEST' });
const logInSuccess = ({ user }) => ({ type: 'LOG_IN_SUCCESS', payload: user });
const logInError = ({ error }) => ({ type: 'LOG_IN_ERROR', payload: error });

// Our asynchronous action
const logIn = ({ email, password }) => async (dispatch, state) => {
  dispatch(logInRequest());
  try {
    const user = await api.authenticateUser({ email, password });
    dispatch(logInSuccess({ user }));
  } catch (error) {
    dispatch(logInError({ error }));
  }
};

// Dispatch logIn like any other action
dispatch(logIn({ email, password }));
```

*Note: `dispatch` will return the result of any async actions, opening up possibilities like chaining promises from `dispatch`*:

```js
dispatch(logIn({ email, password })).then(() => {
  // Do stuff...
});
```

## API
### `useSimple`
A custom [React hook](https://reactjs.org/docs/hooks-intro.html) that lets us access our state and `dispatch` function from inside components.

```js
useSimple(mapState?: Function, mapDispatch?: Function): Array<mixed>
```

###### Usage:
```js
const [state, dispatch] = useSimple();
```

Returns an array containing a `state` object and a `dispatch` function.

`useSimple` has two optional parameters: `mapState` and `mapDispatch`:

##### `mapState`
If `mapState` is passed, it will be used to compute the output state and the result will be passed to the first element of the array returned by `useSimple`.

```js
mapState(state: Object): *
```

###### Usage
```js
const mapState = state => state.countA + state.countB;
const [computedState, dispatch] = useSimple(mapState);
```

*Note: `null` can also be passed if you want to use `mapDispatch` but have no use for a `mapState` function.*

##### `mapDispatch`
`mapDispatch` can be used to pre-wrap actions in `dispatch`. If `mapDispatch` is passed, the result will be given as the second element of the array returned by `useSimple`.

```js
mapDispatch(dispatch: Function): *
```

###### Usage
```js
const mapDispatch = dispatch => ({
  dispatchA: () => dispatch(actionA()),
  dispatchB: () => dispatch(actionB()),
  dispatchC: () => dispatch(actionC())
});
const [state, computedDispatch] = useSimple(null, mapDispatch);

computedDispatch.dispatchA();

```

### `SimpleStateProvider`
A React component that wraps an app's root component and makes state available to our React app.

###### Usage
```js
const Root = () => (
  <StateProvider state={initialState} reducers={[reducer]} middleware={[middleware]}>
    <App/>
  </StateProvider>
);
```

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

An array of middleware functions.

Middleware functions are used to handle side effects in our app.

A middleware function is given two parameters: `state` and `action`.

If any middleware returns `null`, the triggering `action` will be blocked from reaching our `reducers` and the state will not be updated.

###### Usage
```js
function myMiddleware (action, state) {
  if (action.type === 'ADD') {
    console.log(`${state.count} + ${action.payload} = ${state.count + action.payload}`);
  }
}
