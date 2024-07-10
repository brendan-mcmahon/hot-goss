import Modal from './Modal';

const FailureModal = ({ isOpen, setIsOpen, openWelcomeModal, chats }) => {

    const realCulprits = chats.filter(chat => chat.user.Guilty).map(chat => chat.user.Name);

    const playAgain = () => {
        openWelcomeModal();
        setIsOpen(false);
    }

    return (
        <Modal isOpen={isOpen}>
            <div id="Game-Over-Modal">
                <div className="title-wrapper">
                    <h1 className="sweet-title">
                        <span data-text="Hot">Hot</span>
                        <span data-text="Goss">Goss</span>
                    </h1>
                </div>
                <h2>Sorry, you lost.</h2>
                <p>The real culprits were:</p>
                <ul>
                    {realCulprits.map(culprit => <li key={culprit}>{culprit}</li>)}
                </ul>
                <button onClick={playAgain}>Play Again</button>

            </div>
        </Modal>
    );
};

export default FailureModal;