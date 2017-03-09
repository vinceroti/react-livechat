import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleName = this.handleName.bind(this);
    this.changeStateAndStorage = this.changeStateAndStorage.bind(this);
  }

  changeStateAndStorage(key, value) {
    this.props.changeParentState(key, value);
    localStorage.setItem(key, value);
  }

  handleName(e) {
    let nameValue =  e.target.value;
    if (e.target.value === 'clearthechat' ) {
      e.target.value = 'User';
      alert('Database cleared; if you refresh you will lose chat.');
      this.changeStateAndStorage('name', 'User');
      axios.delete('/')
        .catch(function (error) {
          console.log(error);
        });
    } else if (nameValue) {
      this.changeStateAndStorage('name', nameValue);
      e = document.querySelector('#message-form');
      e.value = null;
    } else {
      this.changeStateAndStorage('name', 'User');
      e.target.value = 'User';
    }
  }

  render() {
    return (<FormControl defaultValue={this.props.name}className='input' type='text' placeholder='Enter Name' onKeyUp={this.handleName} />);
  }

}

export default NameForm;
