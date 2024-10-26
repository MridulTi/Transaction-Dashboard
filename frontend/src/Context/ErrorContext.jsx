import React, { createContext, useContext, useState } from 'react';
import ErrorModal from '../Components/ErrorModal';
const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState("");
  function triggerError(message){
    setError(message.message);
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, triggerError, closeError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
