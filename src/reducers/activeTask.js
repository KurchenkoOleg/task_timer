const initialState = null;

export default function activeTask(state = initialState, action) {
  if (action.type === 'START_TASK') {
    return action.payload;
  } else if (action.type === 'STOP_TASK') {
    return initialState;
  }
  return state;
}
