import CharacterProfile from './CharacterProfile';
import closeIcon from './assets/close.svg';

const InfoPanel = ({ chats, currentChatId, isCollapsed, setIsCollapsed, openGameOverModal }) => {
    const currentChat = chats[currentChatId];

    return (
        <div id="InfoPanel" className={isCollapsed ? 'collapsed' : ''}>
            <button
                className="toggle-button icon-button transparent"
                onClick={() => setIsCollapsed(!isCollapsed)}
                >
                <img src={closeIcon} />
            </button>
            <CharacterProfile character={currentChat.user} chats={chats} currentChatId={currentChatId} openGameOverModal={openGameOverModal}/>
        </div>
    );
};

export default InfoPanel;