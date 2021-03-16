import React, { useEffect, useRef } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import './Chat.css';
import { MoreVert, SearchOutlined, AttachFile } from '@material-ui/icons';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import SendIcon from '@material-ui/icons/Send';
import axios from './axios';
const Chat = ({ messages }) => {
  const [isInput, setisInput] = React.useState(false);
  const [Input, setInput] = React.useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };

  useEffect(scrollToBottom, [messages]);
  const sendMessage = async (e) => {
    e.preventDefault();
    var d = new Date();
    var mint = d.getMinutes();
    if (mint <= 9) {
      mint = '0' + mint;
    }
    await axios.post('/messages/new', {
      message: Input,
      name: 'Demo App',
      timestamp: d.getHours() + ':' + mint,
      recieved: true,
    });
    setInput('');
  };
  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar />

        <div className='chat__headerInfo'>
          <h3> Test UI</h3>
          <p>online</p>
        </div>

        <div className='chat__headerRight'>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className='chat__body'>
        {messages.map((message) => (
          <p className={`chat__message ${message.recieved}`}>
            <span className='chat__name'>{message.name}</span> {message.message}
            <span className='chat__timestamp'>{message.timestamp}</span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='chat__footer'>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <IconButton>
          <AttachFile />
        </IconButton>

        <form>
          <input
            type='text'
            value={Input}
            placeholder='Type a message'
            onChange={(e) => {
              setInput(e.target.value);
              setisInput(true);
              console.log(e.target.value);
              if (e.target.value === '') {
                setisInput(false);
              }
            }}
          />
          <button onClick={sendMessage} type='submit'>
            Send a Message
          </button>
        </form>
        {isInput ? (
          <IconButton onClick={sendMessage}>
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton>
            <MicIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Chat;
