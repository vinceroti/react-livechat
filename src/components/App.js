import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { FormGroup, FormControl, Well } from 'react-bootstrap';
import axios from 'axios';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'User', messages: [] };
    this.handleName = this.handleName.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
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
    });
  }

  handleName(e) {
    e.persist(); // allows to event cause of async
    let nameValue =  e.target.value;
    var self = this;
    if (e.target.value === 'clearthechat' ) {
      axios.delete('/')
        .then(function (response) {
          self.setState({ messages: [], name: 'User' });
          e.target.value = '';
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (nameValue) {
      this.setState({ name: nameValue });
    } else {
      this.setState({ name: 'User' });
    }
  }

  handleMessage(e) {
    const body = e.target.value;
    const name = this.state.name;
    const time = this.currentTime();
    if (e.keyCode === 13 && body) {
      const message = { time, body, name };
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
      return ( <li className='no-bullets' key={index}>{message.time} - <b>{message.name}: </b>{message.body}</li> );
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
          <li ref={(element) => { this.welcomeNote = element;}} className='no-bullets'>Welcome {this.state.name}!</li>
        </Well>
      </main>
    );
  }
}

export default App;
