import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl } from 'react-bootstrap';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleMessage = this.handleMessage.bind(this);
  }

  currentTime() {
    let date = new Date().toLocaleTimeString();
    date = date.slice(0,date.length -3);
    return date;
  }

  handleMessage(e) {
    const body = e.target.value;
    const name = this.props.name;
    const time = this.currentTime();

    if (e.keyCode === 13 && body) {
      const message = { time, body, name };
      const messages = [message, ...this.props.messages];
      this.props.changeParentState('messages', messages);
      this.props.changeParentState('userTyping', null );
      e.target.value = '';
    } else if (body) {
      this.props.changeParentState('userTyping', `${name} is typing...`);
    } else {
      this.props.changeParentState('userTyping', null);
    }
  }

  render() {
    return (<FormControl className='input' type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />);
  }
}

export default MessageForm;
