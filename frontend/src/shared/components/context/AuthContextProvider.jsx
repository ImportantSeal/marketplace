import React, { useState, useCallback, useEffect } from "react";
import { AuthContext } from "./auth-context";

let logoutTimer;

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((uid, token, userName, expirationDate, isAdmin = false) => {
    setToken(token);
    setUserId(uid);
    setUserName(userName);
    setAdmin(isAdmin);

    const tokenExpDate =
      expirationDate && (expirationDate instanceof Date || !isNaN(Date.parse(expirationDate)))
        ? new Date(expirationDate)
        : new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        userName: userName,
        expiration: tokenExpDate.toISOString(),
        admin: isAdmin,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserName(null);
    setAdmin(false);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.userName,
        new Date(storedData.expiration),
        storedData.admin
      );
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        userName,
        admin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
