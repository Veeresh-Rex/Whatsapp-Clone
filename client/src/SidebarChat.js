import React from 'react';
import './SideBarchatcss.css';
import { Avatar } from '@material-ui/core';
function SidebarChat() {
  return (
    <div className='sidebar_chats'>
      <Avatar />
      <div className='sidebarChat__info'>
        <h3>Name</h3>
        <p>This is last massage</p>
      </div>
    </div>
  );
}

export default SidebarChat;
