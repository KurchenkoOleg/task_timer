import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';


export default class TaskButton extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.task.id);
  }

  render() {
    return (
      <RaisedButton
        onClick={this.handleClick}
      >
        {this.props.text}
      </RaisedButton>
    );
  }
}

TaskButton.propTypes = {
  task: PropTypes.instanceOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    timeStart: PropTypes.string,
    timeEnd: PropTypes.string,
  })).isRequired,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

TaskButton.defaultProps = {
};

