import React from 'react';
import { Link } from 'react-router';

const Menu = function () {
  return (
    <div>
      <Link to="/">Tasks</Link>
      <Link to="/about">About</Link>
    </div>
  );
}

export default Menu;
