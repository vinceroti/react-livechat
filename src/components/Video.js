import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Form, FormControl } from 'react-bootstrap';
import Rnd from 'react-rnd';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { id: '', h3: 'none', call: 'none', disconnectButton: 'none' };
    this.handleCallSubmit = this.handleCallSubmit.bind(this);
    this.handleConnectSubmit = this.handleConnectSubmit.bind(this);
  }

  componentDidMount() {
    var that = this;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    function successCallback(localMediaStream) {
      window.stream = localMediaStream; // stream available to console
      let video = that.refs.localVideo;
      video.src = window.URL.createObjectURL(localMediaStream);
    }

    function errorCallback(error){
      console.log('navigator.getUserMedia error: ', error);
    }

    navigator.getUserMedia({ video: true, audio: true }, successCallback, errorCallback);
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
      call.on('stream', function(stream) {
        let remoteVideo = that.refs.remoteVideo;
        remoteVideo.style.display= 'inline-block';
        remoteVideo.src = window.URL.createObjectURL(stream);
        that.setState({ call: 'none', h3: 'none' });
      });

      call.answer(window.stream);

      if (that.refs.remoteVideo.src === '') {
        that.peer.call(call.peer,
          window.stream);
      } else {
        return;
      }
    });

    this.peer.on('open', function(id) {
      that.setState({ id: id, h3: 'block', call: 'block', disconnectButton: 'inline-block' });
      target.name.parentElement.remove();
    });

  }


  handleCallSubmit(event){
    event.preventDefault();
    const target = event.target;
    const remote = target.connectionName.value;
    if (remote === '') {
      return alert('Both forms must be filled');
    }

    this.peer.call(remote,
      window.stream);
  }

  disconnect(){
    location.reload();
  }

  render() {

    return (
      <div>
        <h3 style={{display: this.state.h3, marginTop: '10px'}}> You're connected as {this.state.id}! </h3>
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
          <div>
            <video ref="localVideo" autoPlay muted></video>
            <video style={{display: 'none'}} ref="remoteVideo" autoPlay></video>
          </div>
        <Button className="top-margin" style={{display: this.state.disconnectButton}} onClick={(this.disconnect)} bsStyle='primary' bsSize='sm'>Disconnect</Button>
      </div>
    );
  }
}

export default MessageForm;
