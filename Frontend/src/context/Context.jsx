import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

const ContextProvider = ({ children }) => {
  const backURI = 'http://localhost:3000';
  const [data, setData] = useState([]);

  return (
    <GlobalContext.Provider value={{ data, setData, backURI }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;