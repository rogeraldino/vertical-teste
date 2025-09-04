// frontend/src/components/ProfileMenu.tsx
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { usersService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenu() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const boxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    if (!user) return null;

    async function onLogout() {
        await logout();
        navigate('/login', { replace: true });
    }

    async function onDelete() {
        if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) return;
        try {
            await usersService.deleteMe();
        } finally {
            await logout();
            navigate('/login', { replace: true });
        }
    }

    return (
        <div ref={boxRef} style={{ position:'fixed', left:24, top:24, zIndex:50 }}>
            <button className="btn glass profile-btn" onClick={() => setOpen(o=>!o)}
                    title={`${user.username}`}>
                {user.username.slice(0,1).toUpperCase()}
            </button>

            {open && (
                <div className="glass" style={{
                    position:'absolute', left:0, top:56, padding:12, borderRadius:12, minWidth:180
                }}>
                    <div style={{ padding:'6px 10px', opacity:.8, fontSize:12, marginBottom:6 }}>
                        {user.username}
                    </div>
                    <button className="btn" style={{ width:'100%', marginBottom:8 }} onClick={onLogout}>
                        Sair
                    </button>
                    <button className="btn" style={{ width:'100%', background:'linear-gradient(180deg, rgba(255,120,120,.28), rgba(255,120,120,.12))', borderColor:'rgba(255,140,140,.45)' }}
                            onClick={onDelete}>
                        Excluir conta
                    </button>
                </div>
            )}
        </div>
    );
}
