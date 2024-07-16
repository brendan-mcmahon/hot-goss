import './App.scss'
import Sidebar from './Sidebar'
import MainContent from './MainContent'
import Header from './Header'
import './text-effects.scss'
import InfoPanel from './InfoPanel'
import initialize from './startup.js'
import { useState, useEffect } from 'react'
import { getTrustDelta, sendMessage } from './openAiApiService'
import WelcomeModal from './WelcomeModal.jsx'
import GameOverModal from './GameOverModal.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentChatId } from './store_slices/CurrentChatSlice.js'
import { setChats, updateTrust } from './store_slices/ChatsSlice.js'

function App() {
  const [playerName, setPlayerName] = useState('');
  const [pendingMessage, setPendingMessage] = useState(false)
  const [trustUpdated, setTrustUpdated] = useState(false)
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true)
  const [gameOverModalOpen, setGameOverModalOpen] = useState(false)
  const [gameOverMessage, setGameOverMessage] = useState('')
  const [resetClock, setResetClock] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isInfoPanelCollapsed, setIsInfoPanelCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const currentChatId = useSelector((state) => state.currentChatId.value);
  const chats = useSelector((state) => state.chats.value);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);


  const handleClockReset = () => setResetClock(prev => !prev);

  const initializeGame = () => {
    const initialChats = initialize();

    setPlayerName(window.localStorage.getItem('name'));

    dispatch(setChats(initialChats));
    dispatch(setCurrentChatId(initialChats.findIndex(chat => chat.user.BestFriend)));
    handleClockReset();
  }

  const addMessage = (message, sender) => {

    const newMessage = {
      id: chats[currentChatId].messages.length + 1,
      text: message,
      sender: sender,
    };

    const newChats = chats.map((chat, index) => {
      if (index === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    });

    dispatch(setChats(newChats));

    setPendingMessage(sender === playerName);
  }

  useEffect(() => {
    if (pendingMessage) {
      const getTrustDeltaAsync = async () => {
        const delta = await getTrustDelta(chats[currentChatId]);

        const newChats = [...chats];
        if (newChats[currentChatId].user.Trust !== 100) {
          dispatch(updateTrust({ chatId: currentChatId, trustDelta: parseInt(delta, 10) }));
        }

        setPendingMessage(false);
        setTrustUpdated(true);
      };
      getTrustDeltaAsync();
    }
  }, [pendingMessage]);

  useEffect(() => {
    if (trustUpdated) {
      sendApiMessage(chats);
      setTrustUpdated(false);
    }
  }, [trustUpdated]);

  const sendApiMessage = async () => {
    try {
      const response = await sendMessage(currentChatId, chats, playerName);
      addMessage(response, chats[currentChatId].user.Name);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const showSidebar = !isMobile || !isSidebarCollapsed;
  const showInfoPanel = !isMobile || !isInfoPanelCollapsed;
  const gameOverModalOpener = (message) => {
    setGameOverMessage(message);
    setGameOverModalOpen(true);
  }

  return (
    <>
      <WelcomeModal isOpen={welcomeModalOpen} setIsOpen={setWelcomeModalOpen} initializeGame={initializeGame} />
      <GameOverModal isOpen={gameOverModalOpen} setIsOpen={setGameOverModalOpen} openWelcomeModal={() => setWelcomeModalOpen(true)} message={gameOverMessage} />
      <div id="App">
        {chats.length > 0 &&
          <>
            <Header
              openGameOverModal={gameOverModalOpener}
              resetSignal={resetClock}
              handleClockReset={handleClockReset}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              isMobile={isMobile}
            />
            <Sidebar
              isCollapsed={!showSidebar}
              setIsCollapsed={setIsSidebarCollapsed}
              currentChatId={currentChatId}
              isMobile={isMobile}
            />
            <MainContent
              currentChatId={currentChatId}
              addMessage={addMessage}
              playerName={playerName}
              setIsInfoPanelCollapsed={setIsInfoPanelCollapsed}
              openGameOverModal={gameOverModalOpener}
            />
            <InfoPanel
              isCollapsed={!showInfoPanel}
              setIsCollapsed={setIsInfoPanelCollapsed}
              currentChatId={currentChatId}
              openGameOverModal={gameOverModalOpener} />
          </>}
      </div>
    </>
  );
}

export default App;
