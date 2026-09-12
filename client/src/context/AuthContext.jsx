import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const clearSession = () => {
      localStorage.removeItem("unishop_user");
      setUser(null);
    };
    window.addEventListener("unishop:unauthorized", clearSession);
    const restore = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("unishop_user") || "null");
        if (stored?.token) {
          const profile = await authService.getMe();
          if (active) {
            const verified = { ...profile, token: stored.token };
            localStorage.setItem("unishop_user", JSON.stringify(verified));
            setUser(verified);
          }
        }
      } catch {
        if (active) clearSession();
      } finally {
        if (active) setLoading(false);
      }
    };
    restore();
    return () => { active = false; window.removeEventListener("unishop:unauthorized", clearSession); };
  }, []);

  const updateSession = (data) => {
    localStorage.setItem("unishop_user", JSON.stringify(data));
    setUser(data);
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem("unishop_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem("unishop_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("unishop_user");
    setUser(null);
  };

  const switchAccountType = async (accountType) => {
    const data = await authService.switchAccountType(accountType);
    const updated = { ...user, ...data };
    localStorage.setItem("unishop_user", JSON.stringify(updated));
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, switchAccountType, updateSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
