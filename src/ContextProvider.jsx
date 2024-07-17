// MyContextProvider.jsx
import React, { createContext, useState } from 'react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [chats, setChats] = useState([]);

  return (
    <Context.Provider value={{ chats, setChats }}>
      {children}
    </Context.Provider>
  );
};

export default Context;