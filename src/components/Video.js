import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup } from 'react-bootstrap';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: 'defaultLocal', remote: 'defaultRemote'  };
  }

  componentDidMount() {
    var peer = new Peer({key: '72su953vnzcqsemi'}); // imported in head of HTML, need to refactor for webpack
    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
    });

    var that = this;
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    function successCallback(localMediaStream) {
      window.stream = localMediaStream; // stream available to console
      let video = that.refs.localVideo;
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    }

    function errorCallback(error){
      console.log('navigator.getUserMedia error: ', error);
    }

    navigator.getUserMedia({ video: true, }, successCallback, errorCallback);
  }

  componentWillUnmount() {
    window.stream.getTracks().forEach(track => track.stop());
  }

  handleSubmit(event){
    event.preventDefault();
    debugger
  }

  render() {

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
            <FormGroup controlId="connection">
              <FormControl className="input" name="name" type="text" placeholder="Your Name"required />
              <FormControl className="input" name="connectionName" type="text" placeholder="Connection Name" required />
            </FormGroup>
            <Button type="submit">
              Connect
            </Button>
          </Form>
        <video ref="localVideo" autoPlay></video>
        <h2>Currently only displays local cam feedback</h2>
      </div>
    );
  }
}

export default MessageForm;
