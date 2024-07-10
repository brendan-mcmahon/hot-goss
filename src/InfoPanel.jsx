import CharacterProfile from './CharacterProfile';
import closeIcon from './assets/close.svg';

const InfoPanel = ({ chats, currentChatId, isCollapsed, setIsCollapsed }) => {
    const currentChat = chats[currentChatId];

    return (
        <div id="InfoPanel" className={isCollapsed ? 'collapsed' : ''}>
            <button
                className="toggle-button icon-button transparent"
                onClick={() => setIsCollapsed(!isCollapsed)}
                >
                <img src={closeIcon} />
            </button>
            <CharacterProfile character={currentChat.user} />
        </div>
    );
};

export default InfoPanel;