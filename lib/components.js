import { createElement, Component } from 'react';
import { StateContext } from './context';
import { useStateProvider } from './hooks';
import { shallowCompare } from './shallow-compare';

export function SimpleStateProvider ({ initialState, reducers, middleware, children }) {
  return createElement(
    StateContext.Provider,
    { value: useStateProvider({ initialState, reducers, middleware }) },
    children
  );
}

export function SimpleStateConsumer ({ mapState, mapDispatch, children, ConnectStateComponent = ConnectState }) {
  return createElement(
    StateContext.Consumer,
    null,
    ({ state, dispatch }) => createElement(
      ConnectStateComponent,
      { state, dispatch, mapState, mapDispatch },
      children
    )
  );
}

export class ConnectState extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

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