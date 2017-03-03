import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleName = this.handleName.bind(this);
  }

  handleName(e) {
    e.persist(); // allows to event cause of async
    let nameValue =  e.target.value;
    var self = this;
    if (e.target.value === 'clearthechat' ) {
      axios.delete('/')
        .then(function () {
          self.props.changeParentState('name', 'User');
          alert('Database cleared; if you refresh you will lose chat.');
          e.target.value = '';
        })
        .catch(function (error) {
          console.log(error);
        });
    } else if (nameValue) {
      this.props.changeParentState('name', nameValue);
    } else {
      this.props.changeParentState('name', 'User');
    }
  }

  render() {
    return (<FormControl className='input' type='text' placeholder='Enter Name' onKeyUp={this.handleName} />);
  }

}

export default NameForm;
