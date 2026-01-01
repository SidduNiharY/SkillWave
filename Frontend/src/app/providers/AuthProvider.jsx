import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("skillwave_token");
    if (t) {
      setToken(t);
      setUser({ email: "user@local" }); // later decode JWT
    }
    setLoading(false);
  }, []);

  const login = (jwt) => {
    localStorage.setItem("skillwave_token", jwt);
    setToken(jwt);
    setUser({ email: "user@local" });
  };

  const logout = () => {
    localStorage.removeItem("skillwave_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthed: !!token,
        token,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}