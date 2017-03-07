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
    const name = localStorage.getItem('name');
    this.state = { name: name ? name : 'User', messages: [], typing: [], typingFormatted: '' };
    this.changeParentState = this.changeParentState.bind(this);
    this.mapNewTime = this.mapNewTime.bind(this);
  }

  scrollToBottom() {
    let chat = document.querySelector('.chat');
    let height = chat.scrollHeight;
    chat.scrollTop = height;
  }

  componentDidMount() {
    this.socket = io('/');// connected to root of web server
    var self = this;
    axios.get('/index')
      .then(function (response) {
        let dbData = response.data.results;
        self.mapNewTime(dbData);
        self.setState({ messages: dbData });
        self.scrollToBottom();
      })
      .catch(function (error) {
        console.log(error);
      });
    this.socket.on('message', message => {
      message.time = self.convertToLocaleTime(message.time);
      this.setState({ messages: [...this.state.messages, message] }) ;//listener for new messages
      self.scrollToBottom();
    });
    this.socket.on('typing', typing => {
      this.setState({ typing: typing }) ;//listener for new messages
      this.typingFormatted();
    });
  }

  changeParentState(state, value) { //changes state of this app and sends out data via sockets
    if (state === 'messages') {
      let last = value.length - 1;
      this.socket.emit('message', value[last]);
      value[last].time = this.convertToLocaleTime(value[last].time);
      this.scrollToBottom();
    } else {
      this.socket.emit([state], value);
    }
    console.log(value)
    this.setState({ [state]:  value });
    this.typingFormatted();
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

  typingFormatted(){
    let typing = this.state.typing;
    let nameString = '';
    if (this.state.typing.length === 0) {
      return '';
    }
    for (let i = 0; i < typing.length; i++){
      nameString += typing[i] + ', ';
    }
    this.setState({typingFormatted: `${nameString} is typing...`});
  }

  render() {
    const messages = this.state.messages.map((message, index) => {
      return ( <li className='no-bullets' key={index}>{message.time} - <b>{message.name}: </b>{message.body}</li> );
    });
    return (
      <main>
        <h1><b>Simple Chat</b></h1>
        <h4>Name set as: <b>{this.state.name}</b></h4>
        <Well className='chat'>
          <li ref={(element) => { this.welcomeNote = element;}} className='no-bullets'>Welcome {this.state.name}!</li>
          {messages}
        </Well>
        {this.state.typingFormatted}
        <br/>
        <NameForm name={this.state.name} changeParentState={this.changeParentState}/>
        <MessageForm changeParentState={this.changeParentState}
        typing={this.state.typing} name={this.state.name} messages={this.state.messages}/>
      </main>
    );
  }
}

export default App;
