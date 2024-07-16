import React from 'react';
import Clock from './Clock';
import hamburgerIcon from './assets/hamburger.svg';

const Header = ({
    openGameOverModal,
    resetSignal,
    setIsSidebarCollapsed,
    isMobile
}) => {
    return (
        <header className="header">
            {isMobile && <button id="sidebar-button" className="icon-button" onClick={() => setIsSidebarCollapsed(c => !c)}><img src={hamburgerIcon} /></button>}
            <Clock resetSignal={resetSignal} openFailureModal={() => openGameOverModal("You ran out of time!")} />
        </header>
    );
};

export default Header;