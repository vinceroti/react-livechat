import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Video from './components/Video';
import { Route, Router } from 'react-router';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import './styles/main.css';
import createBrowserHistory from 'history/createBrowserHistory';
import routes from './components/routes';

const history = createBrowserHistory();

ReactDOM.render((
  <Router routes={routes} history={history}>
    <div>
      <Route path="/" component={App}/>
      <Route path="/video" component={Video}/>
    </div>
  </Router>), document.getElementById('root'));
