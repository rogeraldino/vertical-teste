import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from './tokenStorage';
import { authService } from '../services/auth.service';
import type { User } from '../types/auth';

type AuthState = {
    user: User | null;
    login: (u: string, p: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // tenta carregar usuário se houver tokens salvos
    useEffect(() => {
        (async () => {
            if (tokenStorage.access && tokenStorage.refresh) {
                try {
                    const u = await authService.me();
                    setUser(u);
                } catch {
                    tokenStorage.clear();
                    setUser(null);
                }
            }
        })();
    }, []);

    const value = useMemo<AuthState>(() => ({
        user,
        async login(username, password) {
            const pair = await authService.login(username, password);
            tokenStorage.access = pair.access_token;
            tokenStorage.refresh = pair.refresh_token;
            const u = await authService.me();
            setUser(u);
        },
        async logout() {
            try { await authService.logout(); } catch {}
            tokenStorage.clear();
            setUser(null);
        },
    }), [user]);

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
