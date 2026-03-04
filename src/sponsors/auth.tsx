import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type SponsorAuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type SponsorAuthContextValue = {
  status: SponsorAuthStatus;
  refreshSession: () => Promise<boolean>;
  login: (password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const SponsorAuthContext = createContext<SponsorAuthContextValue | null>(null);

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  const body = (await response.json().catch(() => ({}))) as T & { error?: string };

  if (!response.ok) {
    const message = (body as { error?: string }).error ?? 'Request failed';
    throw new Error(message);
  }

  return body;
}

export function SponsorAuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SponsorAuthStatus>('loading');

  const refreshSession = useCallback(async () => {
    try {
      const body = await fetchJson<{ authenticated: boolean }>('/api/sponsors/session', {
        method: 'GET',
        headers: undefined
      });
      const nextStatus = body.authenticated ? 'authenticated' : 'unauthenticated';
      setStatus(nextStatus);
      return body.authenticated;
    } catch {
      setStatus('unauthenticated');
      return false;
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (password: string) => {
    try {
      await fetchJson<{ ok: true }>('/api/sponsors/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      setStatus('authenticated');
      return { ok: true };
    } catch (error) {
      setStatus('unauthenticated');
      return { ok: false, error: error instanceof Error ? error.message : 'Invalid password' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchJson<{ ok: true }>('/api/sponsors/logout', {
        method: 'POST',
        body: JSON.stringify({})
      });
    } finally {
      setStatus('unauthenticated');
    }
  }, []);

  const value = useMemo(
    () => ({
      status,
      refreshSession,
      login,
      logout
    }),
    [status, refreshSession, login, logout]
  );

  return <SponsorAuthContext.Provider value={value}>{children}</SponsorAuthContext.Provider>;
}

export function useSponsorAuth() {
  const context = useContext(SponsorAuthContext);
  if (!context) {
    throw new Error('useSponsorAuth must be used inside SponsorAuthProvider');
  }
  return context;
}

export function RequireSponsorAuth({ children }: { children: React.ReactNode }) {
  const { status } = useSponsorAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-zinc-200">
        Checking sponsor access...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/sponsors/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}

export function RedirectIfSponsorAuthed({ children }: { children: React.ReactNode }) {
  const { status } = useSponsorAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-zinc-200">
        Loading...
      </div>
    );
  }

  if (status === 'authenticated') {
    return <Navigate to="/sponsors" replace />;
  }

  return <>{children}</>;
}
