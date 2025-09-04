import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    return (
        <nav style={{ display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee' }}>
            <Link to="/">Posts</Link>
            <Link to="/new">Novo Post</Link>
            <div style={{ marginLeft:'auto' }}>
                {user ? (
                    <>
                        <span style={{ marginRight: 12 }}>Olá, {user.username}</span>
                        <button onClick={logout}>Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Entrar</Link>
                        <Link to="/register" style={{ marginLeft: 12 }}>Registrar</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
