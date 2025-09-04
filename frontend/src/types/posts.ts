export type Post = {
    id: string;
    userId: string;
    title: string;
    message: string;
    createdAt: string; // ISO
};

export type FeedItem = Post & { username: string };
export type FeedResponse = {
    data: FeedItem[];
    page: number;
    size: number;
    total: number;
};
