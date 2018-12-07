import { useContext, useReducer } from 'react';
import { StateContext } from './context';

export function useSimple (mapState, mapDispatch) {
  const { state, dispatch } = useContext(StateContext);
  return [
    mapState ? mapState(state) : state,
    mapDispatch ? mapDispatch(dispatch) : dispatch
  ];
}

export function useStateProvider ({ initialState, reducers, middleware = [] }) {
  const [state, _dispatch] = useReducer((state, action) => {
    return reducers.reduce((state, reducer) => reducer(state, action) || state, state);
  }, initialState);

  function dispatch (action) {
    if (typeof action === 'function') {
      return action(dispatch, state);
    }

    const continueUpdate = middleware.reduce((result, middleware) => {
      return result !== null ? middleware(action, state) : result;
    }, undefined);

    if (continueUpdate !== null) {
      _dispatch(action);
    }
  }

  return { state, dispatch };
}