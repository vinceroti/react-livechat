import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl, FormGroup } from 'react-bootstrap';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: '', h3: 'none', call: 'none' };
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
    const that = this;

    if (id === '') {
      return alert('Both forms must be filled');
    }

    this.peer = new Peer(id, {host: '/', port: location.port, path: '/peerjs'}); // imported in head of HTML, need to refactor for webpack

    this.peer.on('call', function(call) {
      // Answer the call, providing our mediaStream
      call.answer(window.stream);
    });

    this.peer.on('open', function(id) {
      that.setState({ id: id, h3: 'block', call: 'block' });
      target.name.parentElement.style.display = 'none';
    });

  }

  handleCallSubmit(event){
    event.preventDefault();
    const target = event.target;
    const remote = target.connectionName.value;
    const that = this;
    if (remote === '') {
      return alert('Both forms must be filled');
    }

    let call = this.peer.call(remote,
      window.stream);

    call.on('stream', function(stream) {
      that.refs.remoteVideo.style.display= 'inline-block';
      that.refs.remoteVideo.src = window.URL.createObjectURL(stream);
      that.setState({ call: 'none' });
    });
  }

  render() {

    return (
      <div>
        <h3 style={{display: this.state.h3}}> You're connected as {this.state.id}! </h3>
        <Form className="top-margin" onSubmit={this.handleConnectSubmit} inline>
            <FormControl className="video-input" name="name" type="text" placeholder="Your Name" required />
            <Button type="submit">
              Connect
            </Button>
        </Form>
        <Form style={{display: this.state.call }}onSubmit={this.handleCallSubmit}inline>
          <FormControl className="video-input" name="connectionName" type="text" placeholder="Connection Name"  required />
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
