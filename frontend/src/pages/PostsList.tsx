import { useEffect, useState } from 'react';
import { postsService } from '../services/posts.service';
import type { FeedItem } from '../types/posts';
import PostCard from '../components/PostCard';

export default function PostsList() {
    const [items, setItems] = useState<FeedItem[]>([]);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true); setErr(null);
        try {
            const feed = await postsService.listAll({ page: 1, size: 10 });
            setItems(feed.data);
        } catch (e: any) {
            setErr(e?.response?.data?.error ?? 'Erro ao carregar feed');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    if (loading) return <div className="container"><p>Carregando…</p></div>;
    if (err) return <div className="container"><p style={{ color:'#ffb4c6' }}>{err}</p></div>;

    return (
        <div className="container" style={{ display:'grid', justifyContent:"center" , gap:14 }}>
            {items.map(p => <PostCard key={p.id} post={p} />)}
            {!items.length && <p>Nenhuma postagem ainda.</p>}
        </div>
    );
}
