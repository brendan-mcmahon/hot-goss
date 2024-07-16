import React from 'react';
import { sendEvidence } from './openAiApiService';
import sherlockIcon from './assets/sherlock.svg';

const EvidenceButton = ({
    chats,
    currentChatId,
    openGameOverModal
}) => {

    const disabled =
        chats[currentChatId].messages.length === 0
        || chats[currentChatId].user.BestFriend;

    const submitEvidence = async () => {
        const response = await sendEvidence(chats, currentChatId);
        openGameOverModal(response.message);
    };

    return (<>
        
        <button id="evidence-button" className="icon-button" disabled={disabled} onClick={submitEvidence}><div className='button-content'><img src={sherlockIcon} />Submit Chatlog</div></button>
        </>
    );
};

export default EvidenceButton;