import userIcon from "./assets/user.svg";
import profilePics from './ProfilePics.jsx'

const Message = ({ playerName, message, iconColor, currentChatId}) => {

    const icon = message.sender === playerName ? userIcon : profilePics[currentChatId];
    const senderClass = message.sender === playerName ? 'user' : 'bot';
    const style = { backgroundColor: message.sender === playerName ? 'green' : iconColor };

    return (
        <div className={`message ${senderClass}`}>
            <img className="icon" src={icon} style={style} alt={message.sender} />
            <span className="sender">{message.sender}</span>
            <span className="message-text">{message.text}</span>
        </div>
    );
};

export default Message;