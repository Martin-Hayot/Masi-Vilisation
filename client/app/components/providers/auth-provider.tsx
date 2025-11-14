import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, Navigate } from "react-router";
import api from "~/lib/api";

type LoginArgs = { email: string; password: string };

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (args: LoginArgs) => Promise<any>;
  logout: () => Promise<void>;
  // Optional: allow manual refresh if components need it
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Try to refresh tokens on initial load to determine auth state.
  // The server sets cookies (refresh/access) and returns status. We treat a
  // successful refresh as authenticated.
  async function refresh() {
    setLoading(true);
    try {
      await api.post("/auth/refresh", {});
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // refresh on mount
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login({ email, password }: LoginArgs) {
    const res = await api.post("/auth/login", { email, password });
    // server returns user in body and sets cookies; treat that as authenticated
    setIsAuthenticated(true);
    return res.data;
  }

  async function logout() {
    try {
      await api.post("/auth/logout", {});
    } catch (err) {
      // ignore network errors — still clear client state
    } finally {
      setIsAuthenticated(false);
      // navigate to login page after logout
      try {
        navigate("/login", { replace: true });
      } catch {
        // ignore if navigate not available in some contexts
      }
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    loading,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * RequireAuth
 *
 * Usage:
 *   Wrap any route/component that must only be accessible to authenticated users.
 *
 * Behavior:
 *   - While the provider is checking (loading) it renders null (caller can render
 *     a spinner if desired).
 *   - If not authenticated, redirects to `/login`.
 *   - If authenticated, renders children.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.loading) {
    // You can replace this with a spinner or skeleton screen component.
    return null;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * RedirectIfAuthenticated
 *
 * Usage:
 *   Wrap the login/register pages so authenticated users are redirected to dashboard.
 *
 * Behavior:
 *   - While loading, render null.
 *   - If authenticated, redirect to `/dashboard`.
 *   - Otherwise render children (the login/register UI).
 */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const auth = useAuth();

  if (auth.loading) {
    return null;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default AuthProvider;
