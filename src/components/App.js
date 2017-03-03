import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { FormControl, Well } from 'react-bootstrap';
import axios from 'axios';
import NameForm from './NameForm';
import MessageForm from './MessageForm';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'User', messages: [], userTyping: null };
    this.changeParentState = this.changeParentState.bind(this);
    this.mapNewTime = this.mapNewTime.bind(this);
  }

  componentDidMount() {
    this.socket = io('/');// connected to root of web server
    var self = this;

    axios.get('/index')
      .then(function (response) {
        let dbData = response.data.results.reverse();
        self.mapNewTime(dbData);
        self.setState({ messages: dbData });
      })
      .catch(function (error) {
        console.log(error);
      });

    this.socket.on('message', message => {
      message.time = self.convertToLocaleTime(message.time);
      this.setState({ messages: [message, ...this.state.messages] }) ;//listener for new messages

      this.setState({ userTyping: null });
    });

    this.socket.on('userTyping', userTyping => {
      this.setState({ userTyping: userTyping }) ;//listener for new messages
    });
  }

  changeParentState(state, value) { //changes state of this app and sends out data via sockets
    if (state === 'messages') {
      this.socket.emit('message', value[0]);
      value[0].time = this.convertToLocaleTime(value[0].time);
      this.setState({ [state]:  value });
    } else if (state === 'userTyping') {
      this.socket.emit('userTyping', value);
      this.setState({ [state]:  value });
    }
  }

  mapNewTime(messages) {
    let self = this;
    return messages = messages.map(function(message) {
      return message.time = self.convertToLocaleTime(message.time);
    });
  }

  convertToLocaleTime(date) {
    return new Date(date).toLocaleTimeString();
  }

  render() {
    const messages = this.state.messages.map((message, index) => {
      return ( <li className='no-bullets' key={index}>{message.time} - <b>{message.name}: </b>{message.body}</li> );
    });
    return (
      <main>
        <h1><b>Simple Chat</b></h1>
        <h4>Name set as: <b>{this.state.name}</b></h4>
        <NameForm changeParentState={this.changeParentState}/>
        <MessageForm changeParentState={this.changeParentState} name={this.state.name} messages={this.state.messages}/>
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
