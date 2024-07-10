import Modal from './Modal';

const VictoryModal = ({ isOpen, setIsOpen, openWelcomeModal }) => {

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
                <h2>You won! Congrats, you're not getting arrested!!</h2>
                <button onClick={playAgain}>Play Again</button>

            </div>
        </Modal>
    );
};

export default VictoryModal;