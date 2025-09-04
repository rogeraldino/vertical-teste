import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PostsList from '../pages/PostsList';
import NewPost from '../pages/NewPost';

const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },     // 👈 nova rota
    { path: '/', element: <App />, children: [
            { index: true, element: <PostsList /> },
            { path: 'new', element: <NewPost /> },
        ]},
]);

export default function Routes(){ return <RouterProvider router={router} />; }
