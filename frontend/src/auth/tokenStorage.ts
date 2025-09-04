const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

export const tokenStorage = {
    get access() { return localStorage.getItem(ACCESS); },
    set access(v: string | null) { v ? localStorage.setItem(ACCESS, v) : localStorage.removeItem(ACCESS); },
    get refresh() { return localStorage.getItem(REFRESH); },
    set refresh(v: string | null) { v ? localStorage.setItem(REFRESH, v) : localStorage.removeItem(REFRESH); },
    clear() { this.access = null; this.refresh = null; },
};