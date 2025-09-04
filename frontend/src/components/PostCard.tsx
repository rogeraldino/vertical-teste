import type { FeedItem } from '../types/posts';

export default function PostCard({ post }: { post: FeedItem }) {
    const dt = new Date(post.createdAt).toLocaleString();
    return (
        <article className="glass" style={{ padding: 16 }}>
            <header style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <div style={{
                    width: 36, height: 36, borderRadius:'50%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.1))',
                    border: '1px solid rgba(255,255,255,.28)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.45), 0 4px 10px rgba(0,0,0,.35)'
                }} />
                <div style={{ lineHeight:1.1 }}>
                    <strong>{post.username}</strong>
                    <div style={{ fontSize:12, opacity:.75 }}>{dt}</div>
                </div>
            </header>
            <h3 style={{ margin:'8px 0 6px' }}>{post.title}</h3>
            <p style={{ margin:0, color:'var(--text-dim)', whiteSpace:'pre-wrap' }}>{post.message}</p>
        </article>
    );
}
