import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup } from 'react-bootstrap';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleCallSubmit = this.handleCallSubmit.bind(this);
    this.handleConnectSubmit = this.handleConnectSubmit.bind(this);
  }

  componentDidMount() {
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

  handleConnectSubmit(event){
    event.preventDefault();
    const target = event.target;
    const id = target.name.value;

    if (id === '') {
      return alert('Both forms must be filled');
    }

    this.peer = new Peer(id, {host: 'localhost', port: 3000, path: '/peerjs'}); // imported in head of HTML, need to refactor for webpack

    this.peer.on('open', function(id) {
      console.log('My peer ID is: ' + id + ', You are connected!');
    });

    this.peer.on('call', function(call) {
      // Answer the call, providing our mediaStream
      call.answer(window.stream);
    });

  }

  handleCallSubmit(event){
    event.preventDefault();
    const target = event.target;
    const remote = target.connectionName.value;
    let that = this;
    if (remote === '') {
      return alert('Both forms must be filled');
    }

    var call = this.peer.call(remote,
      window.stream);

    call.on('stream', function(stream) {
      that.refs.remoteVideo.style.display= 'inline-block';
      that.refs.remoteVideo.src = window.URL.createObjectURL(stream);
    });
  }

  render() {

    return (
      <div>
        <Form className="top-margin" onSubmit={this.handleConnectSubmit} inline>
            <FormControl name="name" type="text" placeholder="Your Name" required />
            <Button type="submit">
              Connect
            </Button>
          </Form>
          <Form  onSubmit={this.handleCallSubmit}inline>
            <FormControl  name="connectionName" type="text" placeholder="Connection Name"  required />
            <Button type="submit">
              Call
            </Button>
          </Form>
        <video ref="localVideo" autoPlay></video>
        <video style={{display: 'none'}} ref="remoteVideo" autoPlay></video>
      </div>
    );
  }
}

export default MessageForm;
