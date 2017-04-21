import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink, IndexLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Nav extends React.Component {

  render() {
    return(
      <nav>
        <NavLink className='nav-button btn btn-sm btn-primary ' to="/chat">
          Chat
        </NavLink>
        <NavLink exact className='nav-button btn btn-sm btn-primary ' to="/">
          Home
        </NavLink>
        <NavLink className='nav-button btn btn-sm btn-primary ' to="/video">
          Video
        </NavLink>
      </nav>
    );
  }
}

export default Nav;
