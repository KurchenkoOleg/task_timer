export default function lastNumber(state = 1, action) {
  if (action.type === 'START_TASK') {
    return state + 1;
  }
  return state;
}
