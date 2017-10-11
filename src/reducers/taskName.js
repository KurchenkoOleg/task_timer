export default function taskName(state = '', action) {
  if (action.type === 'SET_TASK_NAME') {
    return action.payload;
  }
  return state;
}
