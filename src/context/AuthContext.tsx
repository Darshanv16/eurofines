// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

type User = {
  id: number;
  email: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signout: () => void;
  // NEW: selected entity (adgyl | agro | biopharma)
  selectedEntity: string | null;
  setSelectedEntity: (entity: string | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  // selectedEntity persisted in localStorage so UI remembers last chosen entity
  const [selectedEntity, setSelectedEntityState] = useState<string | null>(() => {
    try {
      return localStorage.getItem("selectedEntity");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // If token exists but user not loaded, try to fetch /auth/me
    if (token && !user) {
      (async () => {
        const res = await api.getCurrentUser();
        if (!res.error && res.data) {
          setUser(res.data as User);
          try {
            localStorage.setItem("user", JSON.stringify(res.data));
          } catch {}
        } else {
          // invalid token -> cleanup
          setToken(null);
          setUser(null);
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } catch {}
        }
      })();
    }
  }, []); // run once on mount

  // keep selectedEntity persisted
  useEffect(() => {
    try {
      if (selectedEntity) localStorage.setItem("selectedEntity", selectedEntity);
      else localStorage.removeItem("selectedEntity");
    } catch {}
  }, [selectedEntity]);

  // wrapper to update selectedEntity state
  const setSelectedEntity = (entity: string | null) => {
    setSelectedEntityState(entity);
  };

  const signin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.signin(email, password);

      if (res.error) {
        return { ok: false, error: res.error };
      }

      const payload: any = res.data;

      // Case A: { token, user }
      if (payload && payload.token && payload.user) {
        const t = payload.token as string;
        const u = payload.user as User;
        setToken(t);
        setUser(u);
        try {
          localStorage.setItem("token", t);
          localStorage.setItem("user", JSON.stringify(u));
        } catch {}
        return { ok: true };
      }

      // Case B: top-level user returned (no token)
      if (payload && payload.id) {
        setUser(payload as User);
        try {
          localStorage.setItem("user", JSON.stringify(payload));
        } catch {}
        return { ok: true };
      }

      // Case C: { user: {...}, token?: "..." }
      if (payload && payload.user && payload.user.id) {
        const u = payload.user as User;
        setUser(u);
        try {
          localStorage.setItem("user", JSON.stringify(u));
        } catch {}
        if (payload.token) {
          setToken(payload.token);
          try {
            localStorage.setItem("token", payload.token);
          } catch {}
        }
        return { ok: true };
      }

      return { ok: false, error: "Unexpected response from server" };
    } catch (err: any) {
      return { ok: false, error: err?.message || "Signin failed" };
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    setUser(null);
    setToken(null);
    setSelectedEntity(null);
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("selectedEntity");
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signin,
        signout,
        selectedEntity,
        setSelectedEntity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const useAuthWithAlias = useAuth;
export const useAuthLoginAlias = () => {
  const ctx = useAuth();
  return {
    ...ctx,
    login: ctx.signin, 
  };
};