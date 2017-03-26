import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Home extends React.Component {

  render() {
    return(
      <div>
        <h1 className='title'> Simple Chat </h1>
        <nav>
          <Link to="/chat">
            <Button className='nav-button' bsStyle='primary' bsSize='sm'>Chat
            </Button>
          </Link>
          <Link to="/video">
            <Button bsStyle='primary' className='nav-button' bsSize='sm'>Video</Button>
          </Link>
        </nav>
      </div>
    );
  }
}

export default Home;
