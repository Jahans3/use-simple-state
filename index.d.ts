interface IAction {
  type: any;
  payload?: any;
}

type IReducer<State, Action = IAction> = (
  state: State,
  action: Action
) => State;

type IMiddleware<State, Action = IAction> = (
  action: Action,
  state: State
) => void | null;

type IDispatch<Action = IAction> = (action: Action) => void;
type IMappedDispatch = { [key: string]: () => void };

interface IProviderProps<State> {
  initialState: State;
  reducers: IReducer<State>[];
  middleware?: IMiddleware<State>[];
  children?: React.ReactElement | React.ReactElement[];
}

interface IConsumerProps<
  State = unknown,
  MappedState = State,
  MappedDispatch extends IMappedDispatch = {}
> {
  mapState?: (state: State) => MappedState;
  mapDispatch?: (dispatch: IDispatch<IAction>) => MappedDispatch;
  children: React.FunctionComponent<{
    state: MappedState;
    dispatch: MappedDispatch;
  }>;
}

declare module "use-simple-state" {
  import React from "react";

  export function SimpleStateProvider<T>(
    props: IProviderProps<T>
  ): React.FunctionComponentElement<React.ProviderProps<IProviderProps<T>>>;

  export function SimpleStateConsumer<T, U, V extends IMappedDispatch>(
    props: IConsumerProps<T, U, V>
  ): React.FunctionComponentElement<
    React.ConsumerProps<IConsumerProps<T, U, V>>
  >;

  export function useSimpleState<
    State = unknown,
    Action = unknown,
    MappedState = State,
    MappedDispatch extends IMappedDispatch = {}
  >(
    mapState?: (state: State) => MappedState,
    mapDispatch?: (dispatch: IDispatch<IAction>) => MappedDispatch
  ): [MappedState, MappedDispatch];
}
