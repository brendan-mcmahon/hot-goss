import React from 'react';
import { sendEvidence } from './openAiApiService';
import Clock from './Clock';
import sherlockIcon from './assets/sherlock.svg';
import hamburgerIcon from './assets/hamburger.svg';

const Header = ({
    chats,
    currentChatId,
    openGameOverModal,
    resetSignal,
    setIsSidebarCollapsed,
    isMobile
}) => {

    const disabled =
        chats[currentChatId].messages.length === 0
        || chats[currentChatId].user.BestFriend;

    const submitEvidence = async () => {
        const response = await sendEvidence(chats, currentChatId);
        openGameOverModal(response.message);
    };

    return (
        <header className="header">
            {isMobile && <button id="sidebar-button" className="icon-button" onClick={() => setIsSidebarCollapsed(c => !c)}><img src={hamburgerIcon} /></button>}
            <Clock resetSignal={resetSignal} openFailureModal={() => openGameOverModal("You ran out of time!")} />
            <button id="evidence-button" className="icon-button" disabled={disabled} onClick={submitEvidence}><img src={sherlockIcon} /></button>
        </header>
    );
};

export default Header;