import http from '../api/http';
import type { TokenPair, User } from '../types/auth';

export const authService = {
    async login(username: string, password: string): Promise<TokenPair> {
        const { data } = await http.post<TokenPair>('/auth/login', { username, password });
        return data;
    },
    async logout(): Promise<void> {
        await http.post('/auth/logout');
    },
    async me(): Promise<User> {
        const { data } = await http.get<User>('/auth/me');
        return data;
    },
};

export const usersService = {
    async deleteMe(): Promise<void> {
        await http.delete('/users/me');
    }
}