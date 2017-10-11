import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import tasks from './tasks';
import lastNumber from './lastNumber';
import activeTask from './activeTask';
import timeElapsed from './timeElapsed';
import showModal from './showModal';
import taskName from './taskName';

export default combineReducers({
  routing: routerReducer,
  tasks,
  lastNumber,
  activeTask,
  timeElapsed,
  showModal,
  taskName,
});
