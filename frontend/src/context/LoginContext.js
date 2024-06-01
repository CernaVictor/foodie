import React, { createContext, useContext, useState } from "react";

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [tkUser] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? JSON.parse(storedToken) : null;
  });
  const [error, setError] = useState("");

  const login = async (userData) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData);
    } else {
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.setItem("user", null);
  };

  return (
    <LoginContext.Provider
      value={{ user, tkUser, login, logout, error, setError }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useAuth = () => useContext(LoginContext);
