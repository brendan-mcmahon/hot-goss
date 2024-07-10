import botIcon from "./assets/bot.svg";

const ChatPreview = ({ character, currentChatId, setCurrentChatId }) => {
    const className = currentChatId === character.Id ? "selected" : "";

    return (
        <div className={`character ${className}`} onClick={() => setCurrentChatId(character.Id)}>
            <img className="avatar" style={{ backgroundColor: character.Color }} src={botIcon} />
            <div>{character.Name}</div>
        </div>
    );
};

export default ChatPreview;