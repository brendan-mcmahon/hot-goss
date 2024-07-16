import botIcon from "./assets/bot.svg";
import { useSelector } from 'react-redux'
import { setCurrentChatId } from './store_slices/CurrentChatSlice.js'

const ChatPreview = ({ character,  setCurrentChatId }) => {
  const currentChatId = useSelector(state => state.currentChatId.value);
    const className = currentChatId === character.Id ? "selected" : "";

    return (
        <div className={`character ${className}`} onClick={() => setCurrentChatId(character.Id)}>
            <img className="avatar" style={{ backgroundColor: character.Color }} src={botIcon} />
            <div>{character.Name}</div>
        </div>
    );
};

export default ChatPreview;