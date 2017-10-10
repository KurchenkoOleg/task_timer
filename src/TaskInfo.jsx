import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Menu from './Menu';
import { formatDateTime, timeDifference } from './formatDateTime';


const TaskInfo = function (props) {
  if (props.task === undefined) {
    return (
      <div>
        <Menu />
        <div>Task is not found!</div>
        <Link to="/">Return to home</Link>
      </div>
    );
  }
  return (
    <div>
      <Menu />
      <div>Number={props.task.number}</div>
      <div>Name={props.task.name}</div>
      <div>TimeStart={formatDateTime(props.task.timeStart)}</div>
      <div>TimeEnd={formatDateTime(props.task.timeEnd)}</div>
      <div>TimeSpent={timeDifference(props.task.timeEnd, props.task.timeStart)}</div>
      <Link to="/">Return to home</Link>
    </div>
  );
};

TaskInfo.propTypes = {
  task: PropTypes.instanceOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    timeStart: PropTypes.string,
    timeEnd: PropTypes.string,
  })),
};

TaskInfo.defaultProps = {
  task: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  task: state.tasks.find(task => task.id === ownProps.params.id),
});

export default connect(mapStateToProps)(TaskInfo);
