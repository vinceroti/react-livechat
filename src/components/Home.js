import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Home extends React.Component {

  render() {
    return(
      <div>
        <nav>
          <NavLink className='nav-button btn btn-sm btn-primary ' to="/chat">
            Chat
          </NavLink>
          <NavLink className='nav-button btn btn-sm btn-primary ' to="/video">
            Video
          </NavLink>
        </nav>
      </div>
    );
  }
}

export default Home;
