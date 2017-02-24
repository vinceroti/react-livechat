import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: 'anon', messages: [] }
  }

  componentDidMount() {
    this.socket = io('/') // connected to root of web server
    this.socket.on('message', message => {
      this.setState({ messages: [message, ...this.state.messages] }) //listener for new messages
    })
  }

  handleName = event => {
    console.log(event)
    if (event.keyCode === 13 && event.target.value ) {
      this.setState({ name: event.target.value })
      event.target.style.display = "none"
    }
  }

  handleMessage = event => {
    const body = event.target.value;
    if (event.keyCode === 13 && body) {
      const message = {
        body,
        from: this.state.name
      }
      this.setState({ messages: [message, ...this.state.messages] })
      this.socket.emit('message', body)
      event.target.value = '';
    }
  }
  // this is a lamba? function allowing to not bind this. This is due to transform class properties module

  render() {
    const messages = this.state.messages.map((message, index) => {
      return <li style={{listStyle: 'none'}} key={index}><b>{message.from}: </b>{message.body}</li>
    })
    return (
      <div>
        <h1>Simple Chat</h1>
        <h4>Name set as: {this.state.name}</h4>
        <input type='text' placeholder='Enter Name' onKeyUp={this.handleName} />
        <br/>
        <input type='text' placeholder='Enter Message' onKeyUp={this.handleMessage} />
        {messages}
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))
