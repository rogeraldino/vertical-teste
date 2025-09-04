import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../api/http';
import { apiErrorMessage } from '../utils/errors';

export default function Register() {
    const navigate = useNavigate();
    const [username, setU] = useState('');
    const [password, setP] = useState('');
    const [confirm, setC] = useState('');

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        // validações client-side
        if (username.trim().length < 3) return setErr('Usuário deve ter ao menos 3 caracteres.');
        if (password.length < 3) return setErr('Senha deve ter ao menos 3 caracteres.');
        if (password !== confirm) return setErr('As senhas não coincidem.');

        setErr(null); setOk(null); setLoading(true);
        try {
            await http.post('/users', { username: username.trim(), password });
            setOk('Conta criada! Redirecionando para o login…');
            setTimeout(() => navigate('/login', { replace: true }), 900);
        } catch (e) {
            setErr(apiErrorMessage(e, 'Não foi possível criar a conta.'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="center" style={{ minHeight: '100%' }}>
            <form onSubmit={onSubmit} className="glass form-card">
                <h1 style={{ marginTop:0, marginBottom:16 }}>Criar conta</h1>

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

                <div className="field">
                    <label className="label" htmlFor="confirm">Repetir senha</label>
                    <input id="confirm" className="input" type="password" placeholder="••••••••"
                           value={confirm} onChange={e=>setC(e.target.value)} />
                </div>

                {ok && <p style={{ color:'#a8f0c6', marginTop:6 }}>{ok}</p>}
                {err && <p className="error">{err}</p>}

                <div style={{ display:'flex', gap:12, marginTop:16 }}>
                    <button className="btn btn-primary" disabled={loading} type="submit">
                        {loading ? 'Criando…' : 'Criar conta'}
                    </button>
                    <Link to="/login" className="btn btn-ghost" role="button">Voltar ao login</Link>
                </div>
            </form>
        </div>
    );
}
