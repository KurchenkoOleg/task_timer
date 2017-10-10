import React from 'react';
import { Link } from 'react-router';
import Menu from './Menu';

const NotFound = function () {
  return (
    <div>
      <Menu />
      <div>
        Page not found. Return to <Link to="/">home</Link>?
      </div>
    </div>
  );
}

export default NotFound;
