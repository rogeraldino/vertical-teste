import { useState } from 'react';
import { postsService } from '../services/posts.service';

export default function PostModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void; }) {
    const [title, setT] = useState('');
    const [message, setM] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null); setLoading(true);
        try {
            await postsService.create({ title, message });
            onCreated();
            onClose();
        } catch (e: any) {
            setErr(e?.response?.data?.error ?? 'Erro ao criar post');
        } finally { setLoading(false); }
    }

    return (
        <div className="modal-overlay">
            <form onSubmit={onSubmit} className="glass" style={{ width: 520, padding: 24 }}>
                <h2 style={{ marginTop:0, marginBottom:12 }}>Nova Postagem</h2>
                <input className="input" placeholder="título" value={title} onChange={e=>setT(e.target.value)} />
                <textarea className="textarea" placeholder="mensagem" value={message} onChange={e=>setM(e.target.value)} />
                {err && <p style={{ color:'#ffb4c6', margin:'4px 0 0' }}>{err}</p>}
                <div style={{ display:'flex', gap:12, marginTop:16 }}>
                    <button className="btn" type="submit" disabled={loading}>{loading? '...' : 'Publicar'}</button>
                    <button className="btn" type="button" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
