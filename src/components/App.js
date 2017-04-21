import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Router } from 'react-router';
import Chat from './Chat';
import Nav from './Nav';
import Home from './Home';
import Video from './Video';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import '../styles/main.css';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

class App extends React.Component {

  render() {
    return(
      <Router history={history}>
        <div>
          <Nav/>
          <Route exact path="/" component={Home}/>
          <Route path="/chat" component={Chat}/>
          <Route path="/video" component={Video}/>
        </div>
      </Router>
    );
  }
}

export default App;
