import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { Glyphicon, FormControl, Well, OverlayTrigger, Tooltip } from 'react-bootstrap';
import es6Promise from 'es6-promise';
import axios from 'axios';
import NameForm from './NameForm';
import MessageForm from './MessageForm';
import utils from '../modules/utils';


class Chat extends React.Component {
  constructor(props) {
    es6Promise.polyfill();
    super(props);
    const name = localStorage.getItem('name');
    this.state = { tooltip: 'Disable', audio: true, name: name ? name : 'User', messages: [], typing: [], typingFormatted: '' };
    this.changeParentState = this.changeParentState.bind(this);
    this.handleAudioClick = this.handleAudioClick.bind(this);
  }

  componentDidMount() {
    utils.requestNotification();
    this.socket = io('/');// connected to root of web server
    var self = this;
    axios.get('/index')
      .then(function (response) {
        let dbData = response.data.results;
        utils.sortByTime(dbData);
        utils.mapNewTime(dbData);
        self.setState({ messages: dbData });
      })
      .catch(function (error) {
        console.log(error);
      });
    this.socket.on('message', message => {
      message.time = utils.convertToLocaleTime(message.time);
      this.setState({ messages: [...this.state.messages, message] }) ;//listener for new messages
      if (this.notification) {
        this.notification.close();
      }

      if (document.visibilityState === 'hidden'){
        this.notification = utils.spawnNotification(`${message.name} writes:`, message.body);
      }

      if (this.state.audio === true) {
        new Audio('../../aim.mp3').play();
      }
    });
    this.socket.on('typing', typing => {
      this.setState({ typing: typing }) ;//listener for new messages
      this.typingFormatted(typing);
    });

    this.socket.on('userConnect', message => {
      this.setState({ messages: [...this.state.messages, message] }) ;
    });
  }

  changeParentState(state, value) { //changes state of this app and sends out data via sockets
    if (state === 'messages') {
      let last = value.length - 1;
      this.socket.emit('message', value[last]);
      value[last].time = utils.convertToLocaleTime(value[last].time);
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

  componentDidUpdate(prevProps,prevState){
    if (prevState.messages.length < this.state.messages.length) {
      utils.scrollToBottom(ReactDOM.findDOMNode(this.refs.chat));
    }
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

  handleAudioClick(e) {
    if (e.target.children.length === 0) {
      let className = e.target.className.split(' ');
      if (className[1] === 'glyphicon-volume-up') {
        e.target.className = 'glyphicon glyphicon-volume-off';
        this.setState({tooltip: 'Enable', audio: false});
      } else {
        e.target.className = 'glyphicon glyphicon-volume-up';
        this.setState({tooltip: 'Disable', audio: true});
      }
    }
  }

  render() {
    const messages = this.state.messages.map((message, index) => {
      if (typeof message === 'object') {
        return ( <li className='no-bullets' key={index}>{message.time} - <b>{message.name}: </b>{message.body}</li> );
      } else {
        return ( <li className='no-bullets' key={index}>{message}</li>  );
      }
    });

    const tooltipAudio = (
      <Tooltip id="Tooltip"><strong>{this.state.tooltip}</strong> chat noise.</Tooltip>
    );

    return (
      <main>
        <h4>Name set as: <b>{this.state.name}</b></h4>
        <NameForm name={this.state.name} changeParentState={this.changeParentState}/>
        <div className='button-container'>
          <OverlayTrigger placement="top" overlay={tooltipAudio}>
            <button onClick={this.handleAudioClick} className='invis-button'>
              <Glyphicon glyph="volume-up" />
            </button>
          </OverlayTrigger>
        </div>
        <Well ref='chat' className='chat'>
          <li className='no-bullets'>Welcome {this.state.name}!</li>
          {messages}
        </Well>
        {this.state.typingFormatted}
        <MessageForm findAndRemove={utils.findAndRemove} changeParentState={this.changeParentState}
        typing={this.state.typing} name={this.state.name} messages={this.state.messages}/>
      </main>
    );
  }
}

export default Chat;
