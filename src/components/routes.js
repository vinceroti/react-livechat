import React from 'react';
import { Route } from 'react-router';
import App from './App';
import Video from './Video';

module.exports = (
  <div>
    <Route path="/" component={App}/>
    <Route path="/video" component={Video}/>
  </div>
);
