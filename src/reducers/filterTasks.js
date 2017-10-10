const initialState = '';

export default function filterTasks(state = initialState, action) {
  if (action.type === 'FIND_TASK') {
    return action.payload;
  }
  return state;
}
