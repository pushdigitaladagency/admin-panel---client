'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, getToken, setToken, clearToken } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const applyMe = useCallback((data) => {
    setUser(data || null);
    setPermissions(data?.permissions || []);
  }, []);

  const refreshMe = useCallback(async () => {
    const res = await api.get('/me');
    applyMe(res.data);
    return res.data;
  }, [applyMe]);

  // Hydrate the session from an existing token on first load.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/me');
        if (active) applyMe(res.data);
      } catch {
        clearToken();
        if (active) applyMe(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [applyMe]);

  const logout = useCallback(
    (redirect = true) => {
      clearToken();
      setUser(null);
      setPermissions([]);
      // Don't redirect if we're already on the login page (avoids a loop when a
      // stale token triggers 'auth:unauthorized' during the initial /me check).
      if (redirect && pathname !== '/login') {
        router.replace('/login');
      }
    },
    [router, pathname]
  );

  // React to 401s surfaced by the API layer (expired / invalid token).
  useEffect(() => {
    const handler = () => logout(true);
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [logout]);

  const login = useCallback(
    async (email, password) => {
      // API quirk: the plaintext password is sent in the `password_hash` field.
      const res = await api.post('/login', { email, password_hash: password }, { auth: false });
      setToken(res.token);
      return refreshMe();
    },
    [refreshMe]
  );

  // Permission check against the flattened "module:action" codes from /me.
  const can = useCallback(
    (moduleCode, action) => permissions.includes(`${moduleCode}:${action}`),
    [permissions]
  );

  const value = {
    user,
    permissions,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshMe,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
