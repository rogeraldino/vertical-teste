import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function LoginModal() {
    const { login } = useAuth();
    const [username, setU] = useState('');
    const [password, setP] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null); setLoading(true);
        try { await login(username, password); }
        catch (e: any) { setErr(e?.response?.data?.error ?? 'Falha no login'); }
        finally { setLoading(false); }
    }

    return (
        <div className="modal-overlay">
            <form onSubmit={onSubmit} className="glass" style={{ width: 420, padding: 24 }}>
                <h2 style={{ marginTop:0, marginBottom:12 }}>Entrar</h2>
                <input className="input" placeholder="username" value={username} onChange={e=>setU(e.target.value)} />
                <input className="input" type="password" placeholder="password" value={password} onChange={e=>setP(e.target.value)} />
                {err && <p style={{ color:'#ffb4c6', margin:'4px 0 0' }}>{err}</p>}
                <div style={{ display:'flex', gap:12, marginTop:16 }}>
                    <button className="btn" disabled={loading} type="submit">{loading? '...' : 'Entrar'}</button>
                </div>
            </form>
        </div>
    );
}
