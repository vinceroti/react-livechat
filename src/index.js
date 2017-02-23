import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] }
  }

  render() {

    return (
      <div>
        <h1>Hello, world!</h1>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
