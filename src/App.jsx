import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import Menu from './Menu';
import TaskButton from './TaskButton';
import { formatDateTime, timeDifference } from './formatDateTime';


const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

class App extends Component {
  constructor(props) {
    super(props);

    this.handleFindTask = this.handleFindTask.bind(this);
    this.handleStartOrStopTask = this.handleStartOrStopTask.bind(this);
    this.handleTaskInfo = this.handleTaskInfo.bind(this);
    this.handleTaskDelete = this.handleTaskDelete.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    if (this.props.activeTask) {
      this.startTimer();
      this.props.onTimerTick(this.props.activeTask.timeStart); // render time immediately
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  handleStartOrStopTask() {
    const locActiveTask = this.props.activeTask;
    if (locActiveTask) {
      console.log('stopTask', this.taskInput.value);

      if (this.taskInput.value === '') {
        this.props.onModalOpen();
        return;
      }

      locActiveTask.name = this.taskInput.value;
      locActiveTask.timeEnd = Date.now().toString();

      this.props.onStopTask(locActiveTask);
      this.taskInput.value = '';
      this.stopTimer();
    } else {
      console.log('startTask', this.taskInput.value);

      this.props.onStartTask({
        id: Date.now().toString(),
        name: this.taskInput.value,
        number: this.props.lastNumber,
        timeStart: Date.now().toString(),
        timeEnd: '',
      });
      this.startTimer();
    }
  }

  handleFindTask() {
    console.log('handleFindTask', this.searchInput.value);
    this.props.onFindTask(this.searchInput.value);
  }

  handleTaskInfo(id) {
    console.log('handleTaskInfo', id);

    this.props.router.push(`/taskInfo/${id}`);
  }

  handleTaskDelete(id) {
    console.log('handleTaskDelete', id);
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
      console.log('Timer is started');
    }
  }

  stopTimer() {
    if (this.timerID) {
      clearInterval(this.timerID);
      this.timerID = undefined;
      console.log('Timer is stopped');
    }
  }

  handleCloseModal() {
    console.log('modalIsClosed');

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
    return (
      <MuiThemeProvider>
        <div>
          <div>
            <Menu />
            <div>
              <input type="text" ref={(input) => { this.searchInput = input; }} />
              <button onClick={this.handleFindTask}>Find task</button>
            </div>
            <div>
              <input type="text" ref={(input) => { this.taskInput = input; }} />
              <button onClick={this.handleStartOrStopTask}>{(this.props.activeTask) ? 'Stop' : 'Start'}</button>
              <h2>{(this.props.activeTask) ? this.props.timeElapsed : '00:00:00'}</h2>
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
            <BarChart
              width={600}
              height={300}
              data={this.ComputeChartData()}
              margin={
                {
                  top: 5, right: 30, left: 20, bottom: 5,
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
          </div>
          <ReactModal
            isOpen={this.props.showModal}
            contentLabel="Empty task name"
            style={customStyles}
          >
            <h1>Empty task name</h1>
            <p>
              You are trying to close your task without name.
              Please, enter task name and close again.
            </p>
            <RaisedButton onClick={this.handleCloseModal}>Close</RaisedButton>
          </ReactModal>
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
  activeTask: PropTypes.instanceOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    timeStart: PropTypes.string,
    timeEnd: PropTypes.string,
  })),
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
  onFindTask: PropTypes.func.isRequired,
};

App.defaultProps = {
  activeTask: undefined,
  timeElapsed: '',
};

export default connect(
  (state, ownProps) => ({
    tasks: state.tasks.filter(task => task.name.includes(state.filterTasks)),
    activeTask: state.activeTask,
    timeElapsed: state.timeElapsed,
    showModal: state.showModal,
    lastNumber: state.lastNumber,
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
    onFindTask: (name) => {
      dispatch({ type: 'FIND_TASK', payload: name });
    },
    onModalOpen: () => {
      dispatch({ type: 'OPEN_MODAL' });
    },
    onModalClosed: () => {
      dispatch({ type: 'MODAL_IS_CLOSED' });
    },
  }),
)(App);

