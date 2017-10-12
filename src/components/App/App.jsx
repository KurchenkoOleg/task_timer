import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { indigo500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Menu from '../Menu/Menu';
import TaskButton from '../TaskButton/TaskButton';
import { formatDateTime, timeDifference } from '../../utils/formatDateTime';
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

    this.handleStartOrStopTask = this.handleStartOrStopTask.bind(this);
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
  }

  handleTaskNameChange(event, newValue) {
    this.props.onSetTaskName(newValue);
  }

  handleStartOrStopTask() {
    const locActiveTask = this.props.activeTask;
    if (locActiveTask) {
      if (this.props.taskName === '') {
        this.props.onModalOpen();
        return;
      }
      locActiveTask.name = this.props.taskName;
      locActiveTask.timeEnd = Date.now().toString();
      this.props.onStopTask(locActiveTask);
      this.props.onSetTaskName('');
      this.stopTimer();
    } else {
      this.props.onStartTask({
        id: Date.now().toString(),
        name: this.props.taskName,
        number: this.props.lastNumber,
        timeStart: Date.now().toString(),
        timeEnd: '',
      });
      this.startTimer();
    }
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

  ComputeChartData() {
    const result = [];

    for (let i = 0; i < 24; i += 1) {
      const locDate = new Date();
      locDate.setHours(i);
      locDate.setMinutes(0);
      locDate.setSeconds(0);
      locDate.setMilliseconds(0);

      const locHourStart = locDate.getTime();
      const locHourEnd = locHourStart + (1000 * 60 * 60);
      let locTime = 0;
      for (let j = 0; j < this.props.tasks.length; j += 1) {
        const task = this.props.tasks[j];

        let locStart = Number(task.timeStart);
        let locEnd = Number(task.timeEnd);
        if ((locStart < locHourEnd) && (locEnd > locHourStart)) {
          if (locStart < locHourStart) locStart = locHourStart;
          if (locEnd > locHourEnd) locEnd = locHourEnd;
          locTime += (locEnd - locStart) / 1000 / 60;
        }
      }
      result.push({ name: i.toString(), time: locTime });
    }

    return result;
  }

  render() {
    const actions = [
      <RaisedButton
        label="Cancel"
        primary={true}
        onClick={this.handleCloseModal}
      />,
    ];
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
          <div className="center circle-slide"><h2 className="taskTime">{(this.props.activeTask) ? this.props.timeElapsed : '00:00:00'}</h2></div>
          <div className="center">
            <RaisedButton className="center buttonStart" onClick={this.handleStartOrStopTask}>{(this.props.activeTask) ? 'Stop' : 'Start'}</RaisedButton>
          </div>
          <Table height="300px">
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>№</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Time Start</TableHeaderColumn>
                <TableHeaderColumn>Time End</TableHeaderColumn>
                <TableHeaderColumn>Time Spent</TableHeaderColumn>
                <TableHeaderColumn />
                <TableHeaderColumn />
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this.props.tasks.map(task => (
                <TableRow key={task.id}>
                  <TableRowColumn>{task.number}</TableRowColumn>
                  <TableRowColumn>{task.name}</TableRowColumn>
                  <TableRowColumn>{formatDateTime(task.timeStart)}</TableRowColumn>
                  <TableRowColumn>{formatDateTime(task.timeEnd)}</TableRowColumn>
                  <TableRowColumn>{
                    timeDifference(task.timeEnd, task.timeStart)}
                  </TableRowColumn>
                  <TableRowColumn>
                    <TaskButton
                      onClick={this.handleTaskInfo}
                      text="Info"
                      task={task}
                    />
                  </TableRowColumn>
                  <TableRowColumn>
                    <TaskButton
                      onClick={this.handleTaskDelete}
                      text="Delete"
                      task={task}
                    />
                  </TableRowColumn>
                </TableRow>))
                }
            </TableBody>
          </Table>
          <ResponsiveContainer width="90%" height={300}>
            <BarChart
              data={this.ComputeChartData()}
              margin={
              {
                top: 70, right: 30, left: 20, bottom: 5,
              }
              }
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Legend />
              <Bar
                dataKey="time"
                fill="#8884d8"
                name="Minutes in this hours"
              />
            </BarChart>
          </ResponsiveContainer>
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

