/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import throttle from 'lodash/throttle';

import { loadState, saveState } from './localStorage';

import './index.css';
import App from './App';
import About from './About';
import Task from './TaskInfo';
import NotFound from './NotFound';
import reducer from './reducers';

const persistedState = loadState();
const store = createStore(
  reducer,
  persistedState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

store.subscribe(throttle(() => {
  saveState({
    tasks: store.getState().tasks,
    activeTask: store.getState().activeTask,
    lastNumber: store.getState().lastNumber,
  });
}, 1000));

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} />
      <Route path="/taskInfo/:id" component={Task} />
      <Route path="/about" component={About} />
      <Route path="*" component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('root'),
);
