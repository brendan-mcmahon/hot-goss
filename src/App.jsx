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
import VictoryModal from './VictoryModal.jsx'
import FailureModal from './FailureModal.jsx'

function App() {
  const [playerName, setPlayerName] = useState('');
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(0);
  const [pendingMessage, setPendingMessage] = useState(false)
  const [trustUpdated, setTrustUpdated] = useState(false)
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true)
  const [victoryModalOpen, setVictoryModalOpen] = useState(false)
  const [failureModalOpen, setFailureModalOpen] = useState(false)
  const [resetClock, setResetClock] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isInfoPanelCollapsed, setIsInfoPanelCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

    setChats(initialChats);
    setCurrentChatId(initialChats.findIndex(chat => chat.user.BestFriend));
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

    setChats(newChats);

    setPendingMessage(sender === playerName);
  }

  useEffect(() => {
    if (pendingMessage) {
      const getTrustDeltaAsync = async () => {
        const delta = await getTrustDelta(chats[currentChatId]);

        const newChats = [...chats];
        if (newChats[currentChatId].user.Trust !== 100) {
          newChats[currentChatId].user.Trust += parseInt(delta, 10);
          newChats[currentChatId].user.Trust = Math.max(0, Math.min(newChats[currentChatId].user.Trust, 100));
          setChats(newChats);
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

  // if it's mobile, then show if isSideBarCollapsed is false
  // if it's not mobile, always show the sidebar
  const showSidebar = !isMobile || !isSidebarCollapsed;
  const showInfoPanel = !isMobile || !isInfoPanelCollapsed;

  return (
    <>
      <WelcomeModal isOpen={welcomeModalOpen} setIsOpen={setWelcomeModalOpen} initializeGame={initializeGame} />
      <VictoryModal isOpen={victoryModalOpen} setIsOpen={setVictoryModalOpen} openWelcomeModal={() => setWelcomeModalOpen(true)} />
      <FailureModal isOpen={failureModalOpen} setIsOpen={setFailureModalOpen} openWelcomeModal={() => setWelcomeModalOpen(true)} chats={chats} />
      <div id="App">
        {chats.length > 0 &&
          <>
            <Header
              chats={chats}
              currentChatId={currentChatId}
              openVictoryModal={() => setVictoryModalOpen(true)}
              openFailureModal={() => setFailureModalOpen(true)}
              resetSignal={resetClock}
              handleClockReset={handleClockReset}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              isMobile={isMobile}
            />
            <Sidebar
              chats={chats}
              isCollapsed={!showSidebar}
              setIsCollapsed={setIsSidebarCollapsed}
              setCurrentChatId={setCurrentChatId}
              currentChatId={currentChatId}
              isMobile={isMobile}
            />
            <MainContent
              chats={chats}
              currentChatId={currentChatId}
              addMessage={addMessage}
              playerName={playerName}
              setIsInfoPanelCollapsed={setIsInfoPanelCollapsed}
            />
            <InfoPanel
              isCollapsed={!showInfoPanel}
              setIsCollapsed={setIsInfoPanelCollapsed}
              chats={chats}
              currentChatId={currentChatId} />
          </>}
      </div>
    </>
  );
}

export default App;
