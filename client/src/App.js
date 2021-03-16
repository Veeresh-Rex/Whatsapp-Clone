import React, { useEffect } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';
function App() {
  const [messages, setmessages] = React.useState([]);
  useEffect(() => {
    axios.get('/messages/sync').then((res) => {
      //console.log(res.data);
      setmessages(res.data);
    });
  }, []);
  useEffect(() => {
    var pusher = new Pusher('d5deb69fbf831c9a613e', {
      cluster: 'ap2',
    });

    var channel = pusher.subscribe('messages');
    channel.bind('inserted', function (data) {
      // alert(JSON.stringify(data));
      setmessages([...messages, data]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe('messages');
    };
  }, [messages]);
  console.log(messages);
  return (
    <div className='app'>
      <div className='app__body'>
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
