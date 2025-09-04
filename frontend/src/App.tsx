// frontend/src/App.tsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import PostModal from './components/PostModal';
import ProfileMenu from './components/ProfileMenu';

export default function App() {
    const { user } = useAuth();
    const [showPost, setShowPost] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <>
            {/* Perfil (logout / excluir) */}
            <ProfileMenu />

            <main>
                <Outlet context={{ refreshKey }} />
            </main>

            {user && !showPost && (
                <button className="btn btn-primary glass fab-bottom-center"
                        onClick={() => setShowPost(true)}>
                    + Nova Postagem
                </button>
            )}

            {showPost && (
                <PostModal
                    onClose={() => setShowPost(false)}
                    onCreated={() => setRefreshKey(k => k + 1)}
                />
            )}
        </>
    );
}
