import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Provide the context to your application
export const AuthProvider = ({ children }) => {
    // State to manage whether the user is on the "Login" or "Register" page
    const [authPage, setAuthPage] = useState('login'); // 'login' is the default state
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [userDetails,setUserDetails]=useState({})
    const toggleAuthPage = () => {
        setAuthPage(prevState => (prevState === 'login' ? 'register' : 'login'));
    };

    return (
        <AuthContext.Provider value={{ authPage,userDetails,setUserDetails,location,setLocation ,setAuthPage, toggleAuthPage }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
