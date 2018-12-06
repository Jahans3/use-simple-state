import { createElement, Children, Component } from 'react';
import { StateContext } from './context';
import { useStateProvider } from './hooks';
import { shallowCompare } from './shallow-compare';

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

class ConnectState extends Component {
  state;

  static getDerivedStateFromProps ({ state, mapState = s => s }) {
    return mapState(state);
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this.state, nextState);
  }

  render () {
    return this.props.children({
      state: this.state,
      dispatch: this.props.mapDispatch ? this.props.mapDispatch(this.props.dispatch) : this.props.dispatch
    });
  }
}