
const initialState = [
];

export default function taskList(state = initialState, action) {
  if (action.type === 'ADD_TASK') {
    return [
      ...state,
      action.payload,
    ];
  } else if (action.type === 'DELETE_TASK') {
    const tasks = state.slice();
    const i = tasks.indexOf(tasks.find(task => task.id === action.payload));
    if (i > -1) {
      tasks.splice(i, 1);
    }
    return tasks;
  }
  return state;
}
