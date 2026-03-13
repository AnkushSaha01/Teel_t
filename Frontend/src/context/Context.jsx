import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

const ContextProvider = ({ children }) => {
  const backURI = 'https://teel-twitter-but-better-backend-2.onrender.com';
  const [data, setData] = useState([]);

  return (
    <GlobalContext.Provider value={{ data, setData, backURI }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;