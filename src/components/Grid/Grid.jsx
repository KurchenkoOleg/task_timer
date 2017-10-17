import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
} from 'material-ui/Table';
import GridLine from '../GridLine/GridLine';


const Grid = (props) => (
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
      {props.tasks.map(task => (
        <GridLine
          key={task.id}
          task
          onTaskInfoClick={props.onTaskInfoClick}
          onTaskDeleteClick={props.onTaskDeleteClick}
        />
                        ))
                    }
    </TableBody>
  </Table>

    );

// Grid.propTypes = {
//   tasks: PropTypes.ArrayOf(PropTypes.shape({
//     id: PropTypes.string,
//     name: PropTypes.string,
//     number: PropTypes.number,
//     timeStart: PropTypes.string,
//     timeEnd: PropTypes.string,
//   })).isRequired,
//   onTaskInfoClick: PropTypes.func.isRequired,
//   onTaskDeleteClick: PropTypes.func.isRequired,
// };
//
// Grid.defaultProps = {
// };

export default Grid;
