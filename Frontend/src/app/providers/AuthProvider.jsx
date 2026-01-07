import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

function decodeUser(jwt) {
  try {
    const d = jwtDecode(jwt);
    // expecting: { sub, role, email, name, pictureUrl ... }
    return {
      id: d.sub ? String(d.sub) : null,
      role: d.role || null,
      email: d.email || null,
      name: d.name || d.displayName || null,
      pictureUrl: d.pictureUrl || d.picture || null,
    };
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthed = useMemo(() => !!token, [token]);

  useEffect(() => {
    const t = localStorage.getItem("skillwave_token");
    if (t) {
      const u = decodeUser(t);
      if (u) {
        setToken(t);
        setUser(u);
      } else {
        // invalid token stored
        localStorage.removeItem("skillwave_token");
      }
    }
    setLoading(false);
  }, []);

  const login = (jwt) => {
    localStorage.setItem("skillwave_token", jwt);

    const u = decodeUser(jwt);
    if (!u) {
      localStorage.removeItem("skillwave_token");
      setToken(null);
      setUser(null);
      throw new Error("Invalid token");
    }

    setToken(jwt);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("skillwave_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthed,
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
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}