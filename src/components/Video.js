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

    var constraints = {audio: true, video: true};
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

  render() {

    return (
      <div>
        <video ref='video'></video>
      </div>
    );
  }
}

export default MessageForm;
