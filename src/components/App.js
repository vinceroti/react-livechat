import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { FormGroup, FormControl, Well } from 'react-bootstrap';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'User', messages: [] };
    this.handleName = this.handleName.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  componentDidMount() {
    this.socket = io('/') ;// connected to root of web server

    this.socket.on('message', message => {
      this.welcomeNote = null;
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
      this.welcomeNote = null;
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
        <h1><b>Simple Chat</b></h1>
        <h4>Name set as: <b>{this.state.name}</b></h4>

        <FormControl className='input' type='text' placeholder='Enter Name' onKeyUp={this.handleName} />
        <FormControl className='input' type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />
        <br/>
        <Well className='chat'>
          {messages}
        </Well>
      </main>
    );
  }
}

export default App;
