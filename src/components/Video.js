import React from 'react';
import ReactDOM from 'react-dom';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var that = this;
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = { video: true };
    function successCallback(localMediaStream) {
      window.stream = localMediaStream; // stream available to console
      let video = that.refs.video;
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    }

    function errorCallback(error){
      console.log('navigator.getUserMedia error: ', error);
    }

    navigator.getUserMedia(constraints, successCallback, errorCallback);
  }

  componentWillUnmount() {
    window.stream.getTracks().forEach(track => track.stop());
  }

  render() {

    return (
      <video ref='video'></video>
    );
  }
}

export default MessageForm;
