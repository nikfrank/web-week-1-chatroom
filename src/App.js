import React, { useState } from 'react';
import './App.css';

class App extends React.Component {

  state = {
    username: '',
    room: '',
    inRoom: false,
    messages: [],
    newMessage: '',
  }

  setUsername = event=> {
    this.setState({
      username: event.target.value,
    })
  }

  setRoom = event=> {
    this.setState({
      room: event.target.value,
    })
  }

  setNewMessage = event => this.setState({
    newMessage: event.target.value,
  })

  loadMessages = ()=>{
    fetch('/message/'+this.state.room)
      .then(response => response.json())
      .then(messages => this.setState({
        messages: messages.sort((a, b)=> a.time > b.time ? -1 : 1)
      }))
  }

  enterRoom = ()=> {
    if(this.state.username){
      this.setState({ inRoom: true }, this.loadMessages)

      this.polling = setInterval(this.loadMessages, 5000);
    }
  }

  exitRoom = ()=> this.setState({ inRoom: false }, ()=>{
    clearInterval( this.polling );
  })

  send = ()=>{
    fetch('/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: this.state.newMessage,
        author: this.state.username,
        room: this.state.room,
        time: Math.floor(Date.now() / 1000),
      })
    }).then(this.loadMessages)
  }



  render() {
    return (
      <div className={'screen ' + (this.state.inRoom ? 'inRoom' : 'outRoom')}>
        <div className='login-box'>
          <input value={this.state.username} onChange={this.setUsername}/>
          <input value={this.state.room} onChange={this.setRoom}/>
          <button onClick={this.enterRoom}>ENTER ROOM</button>
        </div>

        <div className='chatroom'>
          <button onClick={this.exitRoom}>EXIT</button>
          <div className='message-container'>
            {this.state.messages.map(message => (
              <div key={message.id}
                   className={'message '+(
                     (message.author === this.state.username) ? 'mine' : 'other')}>
                <span>{message.time}</span>
                <span>{message.content}</span>
              </div>
            ))}
          </div>
          <div className='write-message-container'>
            <input value={this.state.newMessage} onChange={this.setNewMessage}/>
            <button onClick={this.send}>SEND</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

//export const OneLiner = ({ combo=useState(0), locked=useState(true) })=> (<div><input value={combo[0]} onChange={e => (combo[1](e.target.value), locked[1](e.target.value !== '1234'))}/>{locked[0] ? 'locked' : 'open'}</div>)
