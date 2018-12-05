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

export function SimpleConsumer ({ mapState, mapDispatch, children }) {
  return createElement(
    StateContext.Consumer,
    null,
    ({ state, dispatch }) => createElement(
      ConnectState,
      { state, dispatch, mapState, mapDispatch },
      Children.only(children)
    )
  )
}

function shallowCompare (state, nextState) {
  if ((typeof state !== 'object' || state === null || typeof nextState !== 'object' || nextState === null)) {
    return false;
  }

  return Object.entries(state).reduce((shouldUpdate, [key, value]) => nextState[key] !== value ? true : shouldUpdate, false);
}

class ConnectState extends React.Component {
  state = this.props.mapState(this.props.state);

  shouldComponentUpdate (nextProps) {
    const hasChanged = shallowCompare(this.state, this.props.mapState(nextProps.state));

    if (hasChanged) {
      this.setState(this.props.mapState(nextProps.state));
      return true;
    }

    return false;
  }

  render () {
    return this.props.children({
      state: this.state,
      dispatch: this.props.mapDispatch ? this.props.mapDispatch(this.props.dispatch) : this.props.dispatch
    });
  }
}

function useStateProvider ({ initialState, reducers, middleware = [] }) {
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
