import React, { useContext } from 'react';
import ChatPreview from './ChatPreview';
import closeIcon from './assets/close.svg';
import "./Sidebar.scss";
import GossContext from './ContextProvider.jsx'

const Sidebar = ({  setCurrentChatId, currentChatId, isCollapsed, setIsCollapsed, isMobile }) => {
    const { chats } = useContext(GossContext);
    const users = chats.map(chat => chat.user);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleCharacterSelect = (id) => {
        setCurrentChatId(id);
        setIsCollapsed(true);
    };

    return (
        <div id="Sidebar" className={isCollapsed ? 'collapsed' : ''}>
            {isMobile && <button className="toggle-button icon-button transparent" onClick={toggleSidebar}>
                <img src={closeIcon} />
            </button>}
            <div className="chat-list">
                {users.map(character => (
                    <ChatPreview
                        currentChatId={currentChatId}
                        setCurrentChatId={handleCharacterSelect}
                        key={character.Id}
                        character={character}
                    />
                ))}
            </div>
            <div className="title-wrapper">
                <h1 className="sweet-title">
                    <span data-text="Hot">Hot</span>
                    <span data-text="Goss">Goss</span>
                </h1>
            </div>
        </div>
    );
};

export default Sidebar;