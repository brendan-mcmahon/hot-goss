import { useEffect, useState } from 'react';
import Modal from './Modal';
import { createOpenAiService } from './openAiApiService';

const WelcomeModal = ({ isOpen, setIsOpen, initializeGame }) => {
    const [apiKey, setApiKey] = useState('');
    const [name, setName] = useState('');

    const startGame = () => {
        window.localStorage.setItem('apiKey', apiKey);
        window.localStorage.setItem('name', name);

        createOpenAiService(apiKey);
        initializeGame();
        setIsOpen(false);
    }

    useEffect(() => {
        const storedApiKey = window.localStorage.getItem('apiKey');
        const storedName = window.localStorage.getItem('name');

        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
        if (storedName) {
            setName(storedName);
        }
    }, []);

    return (
        <Modal isOpen={isOpen}>
            <div id="Welcome-Modal">
                <div className="title-wrapper">
                    <h1 className="sweet-title">
                        <span data-text="Hot">Hot</span>
                        <span data-text="Goss">Goss</span>
                    </h1>
                </div>
                <p>It's 4:50 PM on a workday and you just got a message from your work BFF.
                    You're being framed for a white-collar crime you didn't commit.
                    You have just 10 minutes to solve the case using nothing but your company's chat app.
                </p>
                <p>
                    Talk to people, gain their trust, gather information, and get someone to confess.
                    Once you're confident you have the names of all of the culprits in a confession from one of them, hit the "Submit Evidence" button to send it to the investigation team.
                </p>
                <p>
                    Hot Goss is backed by OpenAI's Completion API.
                    Each character you interact with has a unique personality and may or may not have information that can help you.
                    Because of this, you'll need an OpenAI API key to play.
                </p>
                <label>
                    <span>Name:</span>
                    <input value={name} onChange={e => setName(e.target.value)} type="text" />
                </label>
                <label>
                    <span>API Key:</span>
                    <input value={apiKey} onChange={e => setApiKey(e.target.value)} type="text" />
                </label>
                <button onClick={startGame}>Start Game</button>
            </div>
        </Modal>
    );
};

export default WelcomeModal;