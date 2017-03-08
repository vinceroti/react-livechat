import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { FormControl, Well } from 'react-bootstrap';
import es6Promise from 'es6-promise';
import axios from 'axios';
import NameForm from './NameForm';
import MessageForm from './MessageForm';


class App extends React.Component {
  constructor(props) {
    es6Promise.polyfill();
    super(props);
    const name = localStorage.getItem('name');
    this.state = { name: name ? name : 'User', messages: [], typing: [], typingFormatted: '' };
    this.changeParentState = this.changeParentState.bind(this);
    this.mapNewTime = this.mapNewTime.bind(this);
  }

  requestNotification() {
    if (!('Notification' in window)) {
      return;
    }
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }

  spawnNotification(title,body) {
    let options = {
      body: body,
      icon: 'http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac7cdb45b.png'
    };
    new Notification(title,options);
  }

  scrollToBottom() {
    let chat = document.querySelector('.chat');
    let height = chat.scrollHeight;
    chat.scrollTop = height;
  }

  componentDidMount() {
    this.requestNotification();
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
      this.scrollToBottom();
      this.spawnNotification(`${message.name} writes:`,message.body);
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
    if (typing.length === 0) {
      return this.setState({typingFormatted: ''});
    }
    for (let i = 0; i < typing.length; i++){
      nameString += typing[i] + ', ';
    }

    nameString = nameString.slice(0, -2);
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
