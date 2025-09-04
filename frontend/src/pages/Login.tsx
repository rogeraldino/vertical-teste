import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { apiErrorMessage } from '../utils/errors';

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [username, setU] = useState('');
    const [password, setP] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (user) navigate('/', { replace: true }); }, [user, navigate]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        // validações simples no cliente
        if (username.trim().length < 3) return setErr('Usuário deve ter ao menos 3 caracteres.');
        if (password.length < 3) return setErr('Senha deve ter ao menos 3 caracteres.');

        setErr(null); setLoading(true);
        try {
            await login(username.trim(), password);
            navigate('/', { replace: true });
        } catch (e) {
            setErr(apiErrorMessage(e, 'Não foi possível entrar.'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="center" style={{ minHeight: '100%' }}>
            <form onSubmit={onSubmit} className="glass form-card">
                <h1 style={{ marginTop:0, marginBottom:16 }}>Entrar</h1>

                <div className="field">
                    <label className="label" htmlFor="username">Usuário</label>
                    <input id="username" className="input" placeholder="seu usuário"
                           value={username} onChange={e=>setU(e.target.value)} />
                </div>

                <div className="field">
                    <label className="label" htmlFor="password">Senha</label>
                    <input id="password" className="input" type="password" placeholder="••••••••"
                           value={password} onChange={e=>setP(e.target.value)} />
                </div>

                {err && <p className="error">{err}</p>}

                <div style={{ display:'flex', gap:12, marginTop:16 }}>
                    <button className="btn btn-primary" disabled={loading} type="submit">
                        {loading ? 'Entrando…' : 'Entrar'}
                    </button>
                    <Link to="/register" className="btn btn-ghost" role="button">Criar conta</Link>
                </div>
            </form>
        </div>
    );
}
