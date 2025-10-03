// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // adjust path if needed

type User = {
  id: string;
  email: string;
  name?: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  signup: (name: string, email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || null,
        };
        setUser(u);
      } else {
        setUser(null);
      }
    });

    // Check current session on mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u: User = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          name: data.session.user.user_metadata?.full_name || null,
        };
        setUser(u);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Signup
  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw error;

    const newUser: User = {
      id: data.user?.id || "",
      email: data.user?.email || "",
      name: data.user?.user_metadata?.full_name || null,
    };
    setUser(newUser);
    return newUser;
  };

  // Login
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const loggedInUser: User = {
      id: data.user.id,
      email: data.user.email || "",
      name: data.user.user_metadata?.full_name || null,
    };
    setUser(loggedInUser);
    return loggedInUser;
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
