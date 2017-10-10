const initialState = '00:00:00';

export default function timeElapsed(state = initialState, action) {
  if (action.type === 'TIMER_TICK') {
    return action.payload;
  } else if (action.type === 'START_TASK') {
    return initialState;
  } else if (action.type === 'STOP_TASK') {
    return initialState;
  }
  return state;
}
