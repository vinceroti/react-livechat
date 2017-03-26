import React from 'react';
import ReactDOM from 'react-dom';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
  }

  // peerjs() {
  //   var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  //   getUserMedia({video: true, audio: true}, function(stream) {
  //     var call = peer.call('another-peers-id', stream);
  //     call.on('stream', function(remoteStream) {
  //       // Show stream in some video/canvas element.
  //     });
  //   }, function(err) {
  //     console.log('Failed to get local stream' ,err);
  //   });


  //   var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  //   peer.on('call', function(call) {
  //     getUserMedia({video: true, audio: true}, function(stream) {
  //       call.answer(stream); // Answer the call with an A/V stream.
  //       call.on('stream', function(remoteStream) {
  //         // Show stream in some video/canvas element.
  //       });
  //     }, function(err) {
  //       console.log('Failed to get local stream' ,err);
  //     });
  //   });
  // }

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

  render() {

    return (
      <div>
        <input className="video-input" placeholder="Your ID"ref='localId'/>
        <input className="video-input" placeholder="Connection ID" ref='remoteId'/>
        <video ref="localVideo" autoPlay></video>
        <h2>Currently only displays local cam feedback</h2>
      </div>
    );
  }
}

export default MessageForm;
