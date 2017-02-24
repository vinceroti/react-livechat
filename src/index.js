import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import './styles/main.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'anon', messages: [] };
    this.handleName = this.handleName.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount() {
    this.socket = io('/') ;// connected to root of web server
    this.socket.on('message', message => {
      this.setState({ messages: [message, ...this.state.messages] }) ;//listener for new messages
    });
  }

  handleName(e) {
    if (e.keyCode === 13 && e.target.value ) {
      this.setState({ name: e.target.value });
      e.target.value = '';
    }
  }

  handleMessage(e) {
    const body = e.target.value;
    const name = this.state.name;
    if (e.keyCode === 13 && body) {
      const message = { body, name };
      this.setState({ messages: [message, ...this.state.messages] });
      this.socket.emit('message', message);
      e.target.value = '';
    }
  }

  currentTime() {
    let date = new Date().toLocaleTimeString();
    date = date.slice(0,date.length -3);
    return date;
  }

  render() {
    const messages = this.state.messages.map((message, index) => {
      const time = this.currentTime();
      return ( <li className='no-bullets' key={index}>{time} - <b>{message.name}: </b>{message.body}</li> );
    });
    return (
      <main>
        <h1>Simple Chat</h1>
        <h4>Name set as: {this.state.name}</h4>
        <input type='text' placeholder='Enter Name' onKeyUp={this.handleName} />
        <br/>
        <input type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />
        <br/><br/>
        <ul className='chat'>
          {messages}
          <li className='no-bullets'>Welcome {this.state.name}!</li>
        </ul>
      </main>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('root'));
