import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { FormControl, Well } from 'react-bootstrap';
import axios from 'axios';
import NameForm from './NameForm';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'User', messages: [], userTyping: null };
    this.handleMessage = this.handleMessage.bind(this);
    this.changeName = this.changeName.bind(this);
  }

  componentDidMount() {
    this.socket = io('/');// connected to root of web server
    var self = this;

    axios.get('/index')
      .then(function (response) {
        const dbData = response.data.results.reverse();
        self.setState({ messages: dbData });
      })
      .catch(function (error) {
        console.log(error);
      });

    this.socket.on('message', message => {
      this.setState({ messages: [message, ...this.state.messages] }) ;//listener for new messages

      this.setState({ userTyping: null });
    });

    this.socket.on('userTyping', userTyping => {
      this.setState({ userTyping: `${userTyping} is typing...` }) ;//listener for new messages
    });
  }

  changeName(name){
    this.setState({ name:  name });
  }

  currentTime() {
    let date = new Date().toLocaleTimeString();
    date = date.slice(0,date.length -3);
    return date;
  }

  handleMessage(e) {
    const body = e.target.value;
    const name = this.state.name;
    const time = this.currentTime();

    if (e.keyCode === 13 && body) {
      const message = { time, body, name };
      this.setState({ messages: [message, ...this.state.messages] });
      this.socket.emit('message', message);
      this.setState({ userTyping: null });
      e.target.value = '';
    } else if (body) {
      this.setState({ userTyping: `${this.state.name} is typing...`});
      this.socket.emit('userTyping', this.state.name);
    } else {
      this.setState({ userTyping: null });
    }
  }


  render() {

    const messages = this.state.messages.map((message, index) => {
      return ( <li className='no-bullets' key={index}>{message.time} - <b>{message.name}: </b>{message.body}</li> );
    });
    return (
      <main>
        <h1><b>Simple Chat</b></h1>
        <h4>Name set as: <b>{this.state.name}</b></h4>
        <NameForm changeName={this.changeName}/>
        <FormControl className='input' type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />
        <br/>
        <Well className='chat'>
          {this.state.userTyping}
          {messages}
          <li ref={(element) => { this.welcomeNote = element;}} className='no-bullets'>Welcome {this.state.name}!</li>
        </Well>
      </main>
    );
  }
}

export default App;
