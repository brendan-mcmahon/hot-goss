import profilePics from './ProfilePics.jsx'

const ChatPreview = ({ character, currentChatId, setCurrentChatId }) => {
    const className = currentChatId === character.Id ? "selected" : "";

    return (
        <div className={`character ${className}`} onClick={() => setCurrentChatId(character.Id)}>
            <img className="avatar" style={{ backgroundColor: character.Color }} src={profilePics[character.Id]} />
            <div>{character.Name}</div>
        </div>
    );
};

export default ChatPreview;