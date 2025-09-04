// frontend/src/pages/NewPost.tsx
import { useState } from 'react';
import { postsService } from '../services/posts.service';
import { useNavigate } from 'react-router-dom';

export default function NewPost() {
    const [title, setT] = useState('');
    const [message, setM] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const nav = useNavigate();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        try {
            await postsService.create({ title, message });
            nav('/');
        } catch (e: any) {
            setErr(e?.response?.data?.error ?? 'Erro ao criar post');
        }
    }

    return (
        <div className="screen-center">{/* 👈 centraliza a página */}
            <form onSubmit={onSubmit} className="glass form-card form-card--center" style={{ width: 520 }}>
                <h1 style={{ marginTop: 0, marginBottom: 16 }}>Nova Postagem</h1>

                <input className="input" placeholder="título"
                       value={title} onChange={e=>setT(e.target.value)} />

                <textarea className="textarea" placeholder="mensagem"
                          value={message} onChange={e=>setM(e.target.value)} />

                {err && <p className="error">{err}</p>}

                <div style={{ display:'flex', gap:12, marginTop:16 }}>
                    <button className="btn btn-primary" type="submit">Publicar</button>
                    <button className="btn btn-ghost" type="button" onClick={() => nav('/')}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
