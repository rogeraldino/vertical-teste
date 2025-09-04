import axios, { AxiosError, type AxiosInstance } from 'axios';
import { tokenStorage } from '../auth/tokenStorage';

const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

let refreshPromise: Promise<void> | null = null;

http.interceptors.request.use((config) => {
    const token = tokenStorage.access;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
        const original = error.config as any;
        const status = error.response?.status;

        // se 401 por expiração e ainda não tentamos refazer
        if (status === 401 && !original?._retry && tokenStorage.refresh) {
            original._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                            refresh_token: tokenStorage.refresh,
                        });
                        tokenStorage.access = res.data.access_token;
                        tokenStorage.refresh = res.data.refresh_token;
                    } finally {
                        // libere outros aguardando, mesmo se falhar (vai cair em catch abaixo)
                        const p = refreshPromise; refreshPromise = null; await p;
                    }
                })();
            }

            try {
                await refreshPromise;
                // reenvia a request original com novo access
                original.headers = original.headers || {};
                original.headers.Authorization = `Bearer ${tokenStorage.access}`;
                return http(original);
            } catch {
                tokenStorage.clear();
                // opcional: redirecionar para login via um event global
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default http;
