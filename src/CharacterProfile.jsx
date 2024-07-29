import React from 'react';
import "./CharacterProfile.scss";
import ProgressBar from './ProgressBar';
import profilePics from './ProfilePics.jsx'
import EvidenceButton from './EvidenceButton';

const CharacterProfile = ({ character, chats, currentChatId, openGameOverModal }) => {
    if (!character) return null;

    return (
        <div id="Character-Profile">
            <div>
                <h1>{character.Name}</h1>
            </div>
            <EvidenceButton chats={chats} currentChatId={currentChatId} openGameOverModal={openGameOverModal} />
            <img className='profile-picture' src={profilePics[currentChatId]} alt={character.Name} />
            <div className="profile-details">
                <h2>{character.Job}</h2>
                {/* <h3>{character.Guilty ? "Guilty" : "Innocent"}</h3> */}
                {/* <h3>{character.BestFriend ? "BFF" : ""}</h3> */}
                <p><strong>Age:</strong> {character.Age}</p>
                <p><strong>Location:</strong> {character.Location}</p>
                <p><strong>Department:</strong> {character.Department} </p>
                <p><strong>Trust:</strong></p>
                <ProgressBar percentage={character.Trust} />
                {/* <p><strong>Rapport:</strong></p>
                <ProgressBar percentage={character.Rapport} />
                <p><strong>Friendliness:</strong></p>
                <ProgressBar percentage={character.Friendliness} /> */}
                {/* <p>Gossip</p>
                <ul style={{overflowY: "auto", maxHeight: "250px"}}>
                    {character.Gossip?.map((gossip, index) => <li key={index}>{gossip}</li>)}
                </ul> */}
            </div>
        </div>
    );
};

export default CharacterProfile;