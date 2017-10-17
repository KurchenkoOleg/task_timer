import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { indigo500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { saveState } from '../../localStorage';

import { timeDifference } from '../../utils/formatDateTime';

import Grid from '../Grid/Grid';
import Chart from '../Chart/Chart';
import Menu from '../Menu/Menu';
import './App.css';


// This replaces the textColor value on the palette
// and then update the keys for each component that depends on it.
// More on Colors: http://www.material-ui.com/#/customization/colors
const muiTheme = getMuiTheme({
  palette: {
    textColor: indigo500,
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.handleStartTask = this.handleStartTask.bind(this);
    this.handleStopTask = this.handleStopTask.bind(this);
    this.handleTaskInfo = this.handleTaskInfo.bind(this);
    this.handleTaskDelete = this.handleTaskDelete.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleTaskNameChange = this.handleTaskNameChange.bind(this);
  }

  componentDidMount() {
    if (this.props.activeTask) {
      this.startTimer();
      this.props.onTimerTick(timeDifference(
        Date.now().toString(),
        this.props.activeTask.timeStart,
      )); // render time immediately
    }
  }

  componentWillUnmount() {
    this.stopTimer();
    saveState({
      tasks: this.props.tasks,
      activeTask: this.props.activeTask,
      lastNumber: this.props.lastNumber,
    });
  }

  handleTaskNameChange(event, newValue) {
    this.props.onSetTaskName(newValue);
  }

  handleStopTask() {
    if (this.props.taskName === '') {
      this.props.onModalOpen();
      return;
    }
    const locActiveTask = this.props.activeTask;
    locActiveTask.name = this.props.taskName;
    locActiveTask.timeEnd = Date.now().toString();
    this.props.onStopTask(locActiveTask);
    this.props.onSetTaskName('');
    this.stopTimer();
  }

  handleStartTask() {
    this.props.onStartTask({
      id: Date.now().toString(),
      name: this.props.taskName,
      number: this.props.lastNumber,
      timeStart: Date.now().toString(),
      timeEnd: '',
    });
    this.startTimer();
  }

  handleTaskInfo(id) {
    this.props.router.push(`/taskInfo/${id}`);
  }

  handleTaskDelete(id) {
    this.props.onDeleteTask(id);
  }

  startTimer() {
    if (!this.timerID) {
      this.timerID = setInterval(
        () => this.props.onTimerTick(timeDifference(
          Date.now().toString(),
          this.props.activeTask.timeStart,
        )),
        1000,
      );
    }
  }

  stopTimer() {
    if (this.timerID) {
      clearInterval(this.timerID);
      this.timerID = undefined;
    }
  }

  handleCloseModal() {
    this.props.onModalClosed();
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary
        onClick={this.handleCloseModal}
      />,
    ];
    const tasks = this.props.tasks;
    let timerButton;
    if (this.props.activeTask) {
      timerButton = (<RaisedButton
        className="center buttonStart"
        onClick={this.handleStopTask}
      >Stop</RaisedButton>);
    } else {
      timerButton = (<RaisedButton
        className="center buttonStart"
        onClick={this.handleStartTask}
      >Start</RaisedButton>);
    }

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Menu />
          <div className="center">
            <TextField
              floatingLabelText="Name of your task"
              onChange={this.handleTaskNameChange}
              value={this.props.taskName}
            />
          </div>
          <div className="center circle-slide">
            <h2 className="taskTime">{(this.props.activeTask) ? this.props.timeElapsed : '00:00:00'}</h2>
          </div>
          <div className="center">
            {timerButton}
          </div>
          <Grid
            tasks={tasks}
            onTaskInfoClick={this.handleTaskInfo}
            onTaskDeleteClick={this.handleTaskDelete}
          />
          <Chart
            tasks={tasks}
          />
          <Dialog
            title="Empty task name"
            titleClassName="modalTitle"
            actions={actions}
            modal={false}
            open={this.props.showModal}
            onRequestClose={this.handleCloseModal}
          >
          You are trying to close your task without name.
          Please, enter task name and close again.
        </Dialog>
        </div>
      </MuiThemeProvider>);
  }
}

App.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    timeStart: PropTypes.string,
    timeEnd: PropTypes.string,
  })).isRequired,
  activeTask: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    timeStart: PropTypes.string,
    timeEnd: PropTypes.string,
  }),
  timeElapsed: PropTypes.string,
  showModal: PropTypes.bool.isRequired,
  lastNumber: PropTypes.number.isRequired,
  router: PropTypes.object.isRequired,
  onStartTask: PropTypes.func.isRequired,
  onStopTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onTimerTick: PropTypes.func.isRequired,
  onModalOpen: PropTypes.func.isRequired,
  onModalClosed: PropTypes.func.isRequired,
  taskName: PropTypes.string,
  onSetTaskName: PropTypes.func.isRequired,
};

App.defaultProps = {
  activeTask: null,
  timeElapsed: '',
  taskName: '',
};

export default connect(
  (state, ownProps) => ({
    tasks: state.tasks,
    activeTask: state.activeTask,
    timeElapsed: state.timeElapsed,
    showModal: state.showModal,
    lastNumber: state.lastNumber,
    taskName: state.taskName,
    ownProps,
  }),
  dispatch => ({
    onStartTask: (payload) => {
      dispatch({ type: 'START_TASK', payload });
    },
    onStopTask: (payload) => {
      dispatch({ type: 'STOP_TASK', payload });
      dispatch({ type: 'ADD_TASK', payload });
    },
    onDeleteTask: (id) => {
      dispatch({ type: 'DELETE_TASK', payload: id });
    },
    onTimerTick: (payload) => {
      dispatch({ type: 'TIMER_TICK', payload });
    },
    onModalOpen: () => {
      dispatch({ type: 'OPEN_MODAL' });
    },
    onModalClosed: () => {
      dispatch({ type: 'MODAL_IS_CLOSED' });
    },
    onSetTaskName: (payload) => {
      dispatch({ type: 'SET_TASK_NAME', payload });
    },
  }),
)(App);

