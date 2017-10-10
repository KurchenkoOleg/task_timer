import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasks from './tasks';
import lastNumber from './lastNumber';
import activeTask from './activeTask';
import timeElapsed from './timeElapsed';
import filterTasks from './filterTasks';
import showModal from './showModal';

export default combineReducers({
  routing: routerReducer,
  tasks,
  lastNumber,
  activeTask,
  timeElapsed,
  filterTasks,
  showModal,
});
