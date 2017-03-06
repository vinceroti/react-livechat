import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl } from 'react-bootstrap';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(e) {
    const body = e.target.value;
    const name = this.props.name;
    const time = new Date().toUTCString();

    if (e.keyCode === 13 && body) {
      const message = { time, body, name };
      const messages = [...this.props.messages, message];
      this.props.changeParentState('messages', messages);
      this.props.changeParentState('typing', null );
      e.target.value = '';
    } else if (body) {
      this.props.changeParentState('typing', `${name} is typing...`);
    } else {
      this.props.changeParentState('typing', null);
    }
  }

  render() {
    return (<FormControl className='input' type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />);
  }
}

export default MessageForm;
