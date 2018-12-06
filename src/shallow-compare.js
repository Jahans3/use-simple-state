export function shallowCompare (state, nextState) {
  if (
    typeof state !== 'object'
    || state === null
    || typeof nextState !== 'object'
    || nextState === null
  ) {
    return false;
  }

  return Object.entries(nextState).reduce((shouldUpdate, [key, value]) => {
    return state[key] !== value ? true : shouldUpdate;
  }, false);
}