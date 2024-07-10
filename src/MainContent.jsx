import { useState, useEffect, useRef } from 'react';
import Message from './Message';
import "./Messages.scss";
import botIcon from "./assets/bot.svg";

const MainContent = ({ playerName, chats, currentChatId, addMessage, isMobile, setIsInfoPanelCollapsed }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [currentChat, setCurrentChat] = useState(chats[currentChatId]);
  const messages = currentChat.messages;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log('did this work?', currentChatId);
    setCurrentChat(chats[currentChatId])
  }, [chats, currentChatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (currentMessage.trim()) {
      addMessage(currentMessage, playerName);
      setCurrentMessage('');
    }
  };

  const keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) return;
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="main-content">
      <div className="profile-summary" onClick={() => setIsInfoPanelCollapsed(false)}>
        <h1>{currentChat.user.Name}</h1>
        <img className="icon" src={botIcon} style={{}} alt="" />
      </div>
      <div id="Messages">
        {messages.map((message, index) => (
          <Message key={index} message={message} playerName={playerName} iconColor={currentChat.user.Color} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={keyPressHandler}
        />
        <button disabled={!currentMessage} onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default MainContent;
