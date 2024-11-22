import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component to wrap around the application
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is logged in based on localStorage token
    const token = localStorage.getItem("chandantoken");
    if (token) {
      setIsLoggedIn(true);
      // Optionally, you can also store user details after fetching them using the token
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("chandantoken", token);
    console.log("User logged in:", localStorage.getItem("chandantoken"));
    localStorage.setItem("chandanuser", JSON.stringify(userData));
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("chandantoken");
    localStorage.removeItem("chandanuser");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use authentication context
export const useAuth = () => useContext(AuthContext);
