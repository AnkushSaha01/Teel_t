import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

// Non-React global variable to allow Axios interceptors to access the token synchronously
let globalAccessToken = null;

export const getAccessToken = () => globalAccessToken;
export const setAccessToken = (token) => {
  globalAccessToken = token;
};

const ContextProvider = ({ children }) => {
  const backURI = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';
  const [data, setData] = useState([]);
  const [accessToken, _setAccessToken] = useState(null);

  // Sync state and synchronous global getter variable
  const updateAccessToken = (token) => {
    _setAccessToken(token);
    setAccessToken(token);
  };

  return (
    <GlobalContext.Provider value={{ data, setData, backURI, accessToken, updateAccessToken }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextProvider;