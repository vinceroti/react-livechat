import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl } from 'react-bootstrap';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleMessage = this.handleMessage.bind(this);
  }

  findAndRemove(){
    let i = this.props.typing.indexOf(this.props.name);
    return this.props.typing.splice(i, 1);
  }

  handleMessage(e) {
    let typing = this.props.typing;
    const body = e.target.value;
    const name = this.props.name;
    const time = new Date().toUTCString();

    if (e.keyCode === 13 && body) {
      const message = { time, body, name };
      const messages = [...this.props.messages, message];
      this.props.changeParentState('messages', messages);
      this.props.changeParentState('typing', this.findAndRemove() );
      e.target.value = '';
    } else if (body) {
      if (!typing.includes(name)){
        typing.push(name);
      }
      this.props.changeParentState('typing', typing);
    } else {
      this.props.changeParentState('typing', this.findAndRemove());
    }
  }

  render() {
    return (<FormControl className='input' type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />);
  }
}

export default MessageForm;
