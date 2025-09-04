import http from '../api/http';
import type { Post, FeedResponse } from '../types/posts';

export const postsService = {
    // feed global, com username
    async listAll(params?: { page?: number; size?: number; username?: string }): Promise<FeedResponse> {
        const { page = 1, size = 10, username } = params ?? {};
        const q = new URLSearchParams({ page: String(page), size: String(size) });
        if (username) q.set('username', username);
        const { data } = await http.get<FeedResponse>(`/posts/all?${q.toString()}`);
        return data;
    },

    // seus posts (se ainda usar na página de perfil)
    async listMine(): Promise<Post[]> {
        const { data } = await http.get<Post[]>('/posts');
        return data;
    },

    async create(input: { title: string; message: string }) {
        const { data } = await http.post<Post>('/posts', input);
        return data;
    },
};
