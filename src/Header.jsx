import React from 'react';
import { sendEvidence } from './openAiApiService';
import Clock from './Clock';
import sherlockIcon from './assets/sherlock.svg';
import caretIcon from './assets/caret.svg';
import hamburgerIcon from './assets/hamburger.svg';

const Header = ({
    chats,
    currentChatId,
    openVictoryModal,
    openFailureModal,
    resetSignal,
    setIsSidebarCollapsed,
    isMobile
}) => {

    const disabled =
        chats[currentChatId].messages.length === 0
        || chats[currentChatId].user.BestFriend;

    const submitEvidence = async () => {
        const response = await sendEvidence(chats, currentChatId);
        if (response === '👍') {
            openVictoryModal();
        } else {
            openFailureModal();
        }
    };

    return (
        <header className="header">
            {isMobile && <button id="sidebar-button" className="icon-button" onClick={() => setIsSidebarCollapsed(c => !c)}><img src={hamburgerIcon} /></button> }
            <Clock resetSignal={resetSignal} openFailureModal={openFailureModal} />
            <button id="evidence-button" className="icon-button" disabled={disabled} onClick={submitEvidence}><img src={sherlockIcon} /></button>
        </header>
    );
};

export default Header;