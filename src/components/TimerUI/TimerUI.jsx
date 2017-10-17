// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import RaisedButton from 'material-ui/RaisedButton';
//
// import { timeDifference } from '../../utils/formatDateTime';
//
//
// class TimerUI extends Component {
//   constructor(props) {
//     super(props);
//
//     //this.state = {};
//   }
//
//   componentDidMount() {
//     if (this.props.activeTask) {
//       this.startTimer();
//       this.props.onTimerTick(timeDifference(
//         Date.now().toString(),
//         this.props.activeTask.timeStart,
//       )); // render time immediately
//     }
//   }
//
//   componentWillUnmount() {
//     this.stopTimer();
//     saveState({
//       tasks: this.props.tasks,
//       activeTask: this.props.activeTask,
//       lastNumber: this.props.lastNumber,
//     });
//   }
//
//   handleTaskNameChange(event, newValue) {
//     this.props.onSetTaskName(newValue);
//   }
//
//   handleStopTask() {
//     if (this.props.taskName === '') {
//       this.props.onModalOpen();
//       return;
//     }
//     const locActiveTask = this.props.activeTask;
//     locActiveTask.name = this.props.taskName;
//     locActiveTask.timeEnd = Date.now().toString();
//     this.props.onStopTask(locActiveTask);
//     this.props.onSetTaskName('');
//     this.stopTimer();
//   }
//
//   handleStartTask() {
//     this.props.onStartTask({
//       id: Date.now().toString(),
//       name: this.props.taskName,
//       number: this.props.lastNumber,
//       timeStart: Date.now().toString(),
//       timeEnd: '',
//     });
//     this.startTimer();
//   }
//
//   startTimer() {
//     if (!this.timerID) {
//       this.timerID = setInterval(
//         () => this.props.onTimerTick(timeDifference(
//           Date.now().toString(),
//           this.props.activeTask.timeStart,
//         )),
//         1000,
//       );
//     }
//   }
//
//   stopTimer() {
//     if (this.timerID) {
//       clearInterval(this.timerID);
//       this.timerID = undefined;
//     }
//   }
//
//   render() {
//     return (
//       <div>
//         <div className="center">
//           <TextField
//             floatingLabelText="Name of your task"
//             onChange={this.handleTaskNameChange}
//             value={this.props.taskName}
//           />
//         </div>
//         <div className="center circle-slide">
//           <h2 className="taskTime">{(this.props.activeTask) ? this.props.timeElapsed : '00:00:00'}</h2>
//         </div>
//         <div className="center">
//             this.props.activeTask &&
//             <RaisedButton
//               className="center buttonStart"
//               onClick={this.handleStopTask}
//             >Stop</RaisedButton>
//             !this.props.activeTask &&
//             <RaisedButton
//               className="center buttonStart"
//               onClick={this.handleStartTask}
//             >Start</RaisedButton>
//         </div>
//       </div>
//     );
//   }
// }
//
// TimerUI.propTypes = {
//   activeTask: PropTypes.shape({
//     id: PropTypes.string,
//     name: PropTypes.string,
//     number: PropTypes.number,
//     timeStart: PropTypes.string,
//     timeEnd: PropTypes.string,
//   }),
// };
//
// TimerUI.defaultProps = {
//   activeTask: null,
//   timeElapsed: '',
//   taskName: '',
// };
