import React, { createContext, useState, useEffect, useContext } from "react";
import { authClient } from "../lib/auth-client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Better Auth session hook
  const { data: sessionData, isPending: sessionPending } = authClient.useSession();

  const syncJWT = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const res = await fetch(`${apiUrl}/api/auth/jwt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include" // Send cookies to the server
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("JWT sync error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionPending) {
      setLoading(true);
    } else if (sessionData) {
      syncJWT();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [sessionData, sessionPending]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message || "Failed to log in");
      }
      
      // Wait a moment for session cookies, then sync JWT
      await new Promise(r => setTimeout(r, 600));
      await syncJWT();
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, photoUrl) => {
    try {
      setLoading(true);
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoUrl || undefined,
      });
      if (error) {
        throw new Error(error.message || "Failed to register");
      }
      
      // Wait a moment for session cookies, then sync JWT
      await new Promise(r => setTimeout(r, 600));
      await syncJWT();
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (err) {
      console.error("Custom logout endpoint failed:", err);
    }

    await authClient.signOut();
    setUser(null);
    setLoading(false);
  };

  const loginWithGoogle = () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const callbackURL = encodeURIComponent(`${window.location.origin}/`);
    window.location.href = `${apiUrl}/api/auth/signin/google?callbackURL=${callbackURL}`;
  };

  // Helper to force reload user profile after premium payment or update
  const refreshUser = async () => {
    await syncJWT();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
