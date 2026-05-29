import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

const ContextProvider = ({ children }) => {
  const backURI = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';
  const [data, setData] = useState([]);

  return (
    <GlobalContext.Provider value={{ data, setData, backURI }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;