import React from 'react';
import PropTypes from 'prop-types';
import {
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TaskButton from '../TaskButton/TaskButton';
import { formatDateTime, timeDifference } from '../../utils/formatDateTime';


const GridLine = (props) => {
  const task = props.task;

  return (
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
          onClick={props.onTaskInfoClick}
          text="Info"
          task={task}
        />
      </TableRowColumn>
      <TableRowColumn>
        <TaskButton
          onClick={props.onTaskDeleteClick}
          text="Delete"
          task={task}
        />
      </TableRowColumn>
    </TableRow>

  );
};

// GridLine.propTypes = {
//   task: PropTypes.shape({
//     id: PropTypes.string,
//     name: PropTypes.string,
//     number: PropTypes.number,
//     timeStart: PropTypes.string,
//     timeEnd: PropTypes.string,
//   }).isRequired,
//   onTaskInfoClick: PropTypes.func.isRequired,
//   onTaskDeleteClick: PropTypes.func.isRequired,
// };
//
// GridLine.defaultProps = {
// };

export default GridLine;
