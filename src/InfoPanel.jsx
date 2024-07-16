import CharacterProfile from './CharacterProfile';
import closeIcon from './assets/close.svg';
import { useSelector, useDispatch } from 'react-redux'

const InfoPanel = ({ currentChatId, isCollapsed, setIsCollapsed, openGameOverModal }) => {
    const chats = useSelector((state) => state.chats.value);
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