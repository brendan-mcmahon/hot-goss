import botIcon from "./assets/bot.svg";
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentChatId } from './store_slices/CurrentChatSlice.js'

const ChatPreview = ({ character, currentChatId }) => {
  const dispatch = useDispatch();
    const className = currentChatId === character.Id ? "selected" : "";

    return (
        <div className={`character ${className}`} onClick={() => dispatch(setCurrentChatId(character.Id))}>
            <img className="avatar" style={{ backgroundColor: character.Color }} src={botIcon} />
            <div>{character.Name}</div>
        </div>
    );
};

export default ChatPreview;