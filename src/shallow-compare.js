export function shallowCompare (state, nextState) {
  if (
    typeof state !== 'object'
    || state === null
    || typeof nextState !== 'object'
    || nextState === null
  ) {
    return false;
  }

  for (const [key, value] of Object.entries(nextState)) {
    if (value !== state[key]) {
      return false;
    }
  }

  return true;
}