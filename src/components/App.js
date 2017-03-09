import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { FormControl, Well } from 'react-bootstrap';
import es6Promise from 'es6-promise';
import axios from 'axios';
import NameForm from './NameForm';
import MessageForm from './MessageForm';
import utils from '../modules/utils';


class App extends React.Component {
  constructor(props) {
    es6Promise.polyfill();
    super(props);
    const name = localStorage.getItem('name');
    this.state = { name: name ? name : 'User', messages: [], typing: [], typingFormatted: '' };
    this.changeParentState = this.changeParentState.bind(this);
  }

  componentDidMount() {
    utils.requestNotification();
    this.socket = io('/');// connected to root of web server
    var self = this;
    axios.get('/index')
      .then(function (response) {
        let dbData = response.data.results;
        utils.mapNewTime(dbData);
        self.setState({ messages: dbData });
        utils.scrollToBottom('.chat');
      })
      .catch(function (error) {
        console.log(error);
      });
    this.socket.on('message', message => {
      message.time = utils.convertToLocaleTime(message.time);
      this.setState({ messages: [...this.state.messages, message] }) ;//listener for new messages
      utils.scrollToBottom('.chat');
      utils.spawnNotification(`${message.name} writes:`,message.body);
    });
    this.socket.on('typing', typing => {
      this.setState({ typing: typing }) ;//listener for new messages
      this.typingFormatted(typing);
    });
  }

  changeParentState(state, value) { //changes state of this app and sends out data via sockets
    if (state === 'messages') {
      let last = value.length - 1;
      this.socket.emit('message', value[last]);
      value[last].time = utils.convertToLocaleTime(value[last].time);
      utils.scrollToBottom('.chat');
    } else if( state === 'name') {
      let typing = utils.findAndRemove(this.state.typing,this.state.name);
      this.typingFormatted(typing);
      this.socket.emit([state], value);
      this.socket.emit('typing', typing);
    } else {
      this.socket.emit([state], value);
      this.typingFormatted(value);
    }
    this.setState({ [state]:  value });
  }


  typingFormatted(value){
    let typing = value;
    let nameString = '';
    if (!Array.isArray(typing)){
      typing = typing.split(' ');
    }
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
        <MessageForm findAndRemove={utils.findAndRemove} changeParentState={this.changeParentState}
        typing={this.state.typing} name={this.state.name} messages={this.state.messages}/>
      </main>
    );
  }
}

export default App;
