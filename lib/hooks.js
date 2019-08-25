import { useContext, useReducer, useCallback } from 'react';
import { StateContext } from './context';

export function useSimpleState (mapState, mapDispatch) {
  const { state, dispatch } = useContext(StateContext);
  return [
    mapState ? mapState(state) : state,
    mapDispatch ? mapDispatch(dispatch) : dispatch
  ];
}

function reduceState (reducers, state, action) {
  return reducers.reduce((nextState, reducer) => reducer(nextState, action) || nextState, state);
}

export function useStateProvider ({ initialState, reducers, middleware = [] }) {
  // fix the "reducer fires twices occassionally bug", that took a long time to figure out!
  const memoizedReducer = useCallback((state, action) => reduceState(reducers, state, action), [initialState])
  const [state, _dispatch] = useReducer(memoizedReducer, initialState);

  function dispatch (action) {
    if (typeof action === 'function') {
      return action(dispatch, state);
    }

    const continueUpdate = middleware.reduce((result, middleware) => {
      return result !== null ? middleware(action, state, () => reduceState(reducers, state, action)) : result;
    }, undefined);

    if (continueUpdate !== null) {
      _dispatch(action);
    }
  }

  return { state, dispatch };
}