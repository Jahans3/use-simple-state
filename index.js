import { Children, createElement, createContext, useReducer, useContext } from 'react';

const StateContext = createContext(null);

export function useSimple (mapState = s => s, mapDispatch = d => d) {
  const { state, dispatch } = useContext(StateContext);
  return [mapState === null ? state : mapState(state), mapDispatch(dispatch)];
}

export function SimpleStateProvider ({ initialState, reducers, middleware, children }) {
  return createElement(
    StateContext.Provider,
    { value: useStateProvider({ initialState, reducers, middleware }) },
    Children.only(children)
  );
}

function useStateProvider ({ initialState, reducers, middleware = [] }) {
  const [state, _dispatch] = useReducer((state, action) => {
    return reducers.reduce((state, reducer) => reducer(action, state) || state, state);
  }, initialState);

  function dispatch (action) {
    const continueUpdate = middleware.reduce((result, middleware) => {
      return result !== null ? middleware(action, state) : result;
    }, undefined);

    if (continueUpdate !== null) {
      _dispatch(action);
    }
  }

  return { state, dispatch };
}
