import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Home extends React.Component {

  render() {
    return(
      <div className="container">
        <h1>React Live Chat</h1>
        <hr/>
        <h3> This is an app I created using ReactJS, React Router, Node, Express, WebRTC, and MongoDB. </h3>
        <h3> Video chat uses WebRTC and a p2p connection to connect and the live chat uses websockets. All chat information is backed up to MongoDB. </h3>
      </div>
    );
  }
}

export default Home;
