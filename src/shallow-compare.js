export function shallowCompare (state, nextState) {
  if (
    typeof state !== 'object'
    || state === null
    || typeof nextState !== 'object'
    || nextState === null
  ) {
    return true;
  }

  for (const [key, value] of Object.entries(nextState)) {
    if (value !== state[key]) {
      return true;
    }
  }

  return false;
}