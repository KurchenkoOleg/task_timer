import React from 'react';
import { Link } from 'react-router';
import './Menu.css';

const Menu = function () {
  return (
    <div>
      <Link className="item" to="/">Tasks</Link>
      <Link activeClassName="item" to="/about">About</Link>
    </div>
  );
};

export default Menu;
