import React from 'react';
import ReactDOM from 'react-dom';
import { FormControl } from 'react-bootstrap';
import EmojiPicker from 'react-emoji-picker';
import emojiMap from 'react-emoji-picker/lib/emojiMap';

const emojiPickerStyles = {
  position: 'absolute',
  backgroundColor: 'white',
  padding: '.3em .6em',
  border: '1px solid #0074d9',
  borderTop: 'none',
  zIndex: '2'
};

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleMessage = this.handleMessage.bind(this);
    this.state = {emoji: '', showEmojiPicker: false};
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
    this.validateEmoji = this.validateEmoji.bind(this);
    this.updateState = this.updateState.bind(this);
    this.setEmoji = this.setEmoji.bind(this);
    this.emojiPicker = this.emojiPicker.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.toggleEmojiPicker, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.toggleEmojiPicker, false);
  }

  toggleEmojiPicker (e) {
    if(this.refs.emoji.contains(e.target)) {
      this.setState({showEmojiPicker: true});
    } else {
      setTimeout(this.validateEmoji, 10);
      this.setState({showEmojiPicker: false});
    }
  }

  validateEmoji () {
    var that = this;
    let matched = emojiMap.filter(function(emoji) {
      return `:${emoji.name}:` === that.state.emoji;
    });

    if(matched.length === 0) {
      this.setState({emoji: ''});
    }
  }

  updateState(e) {
    this.setState({emoji: e.target.value});
  }

  setEmoji(emoji) {
    this.setState({emoji: emoji});
  }

  // allows selecting first emoji by pressing "Enter" without submitting form
  grabKeyPress(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
    }
  }

  emojiPicker() {
    if(this.state.showEmojiPicker) {
      return (
        <EmojiPicker
          style={emojiPickerStyles} onSelect={this.setEmoji}
          query={this.state.emoji}
        />
      );
    }
  }

  handleMessage(e) {
    let typing = this.props.typing;
    const body = e.target.value;
    const name = this.props.name;
    const time = new Date().toUTCString();

    if (e.keyCode === 13 && body) {
      const message = { time, body, name };
      const messages = [...this.props.messages, message];
      e.target.value = '';
      this.props.changeParentState('messages', messages);
      this.props.changeParentState('typing', this.props.findAndRemove(typing, name) );
    } else if (body) {
      if (!typing.includes(name)){
        typing.push(name);
      }
      this.props.changeParentState('typing', typing);
    } else {
      this.props.changeParentState('typing', this.props.findAndRemove(typing, name));
    }
  }

  render() {
    return (
      <div>
        <FormControl id='message-form' className='input' type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />
        <p ref='emoji'>
          <label htmlFor="emoji">Emoji</label>
          <input name="emoji" id="emoji" value={this.state.emoji} autoComplete="off"
          type={this.state.showEmojiPicker ? "search" : "text"}
          onChange={this.updateState} onKeyDown={this.grabKeyPress}/>
          {this.emojiPicker()}
        </p>
      </div>
    );
  }
}

export default MessageForm;


//   componentDidMount: function() {
//     document.addEventListener('click', this.toggleEmojiPicker, false)
//   },

//   componentWillUnmount: function() {
//     document.removeEventListener('click', this.toggleEmojiPicker, false)
//   },

//   toggleEmojiPicker: function(e) {
//     if(this.refs.emoji.contains(e.target)) {
//       this.setState({showEmojiPicker: true});
//     } else {
//       setTimeout(this.validateEmoji, 10)
//       this.setState({showEmojiPicker: false});
//     }
//   },

//   validateEmoji: function() {
//     var matched = emojiMap.filter(function(emoji) {
//       return `:${emoji.name}:` === this.state.emoji
//     })

//     if(matched.length === 0) {
//       this.setState({emoji: null})
//     }
//   }

//   updateState: function(e) {
//     this.setState({emoji: e.target.value})
//   },

//   setEmoji: function(emoji) {
//     this.setState({emoji: emoji})
//   },

//   // allows selecting first emoji by pressing "Enter" without submitting form
//   grabKeyPress: function(e) {
//     if(e.keyCode === 13) {
//       e.preventDefault()
//     }
//   },

//   emojiPicker: function() {
//     if(this.state.showEmojiPicker) {
//       return (
//         <EmojiPicker
//           style={emojiPickerStyles} onSelect={this.setEmoji}
//           query={this.state.emoji}
//         />
//       )
//     }
//   },

//   render: function() {
//     return (
//       <p ref="emoji">
//         <label htmlFor="emoji">Emoji</label>
//         <input name="emoji" id="emoji" value={this.state.emoji} autoComplete="off"
//           type={this.state.showEmojiPicker ? "search" : "text"}
//           onChange={this.updateState} onKeyDown={this.grabKeyPress}/>
//         {this.emojiPicker()}
//       </p>
//     )
//   }
// })
