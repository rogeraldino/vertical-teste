import { Request, Response } from 'express';
import { verifyToken } from '../../utils/jwt.js';
import { login, refresh, logout } from './auth.service.js';

export async function postLogin(req: Request, res: Response) {
    const { username, password } = req.body ?? {};
    const pair = await login(username, password);
    res.json(pair);
}

export async function postRefresh(req: Request, res: Response) {
    const { refresh_token } = req.body ?? {};
    if (!refresh_token) return res.status(400).json({ error: 'refresh_token required' });

    try {
        const payload = verifyToken<{ sub: string; username: string; jti: string }>(refresh_token);
        const pair = await refresh(payload.jti, payload.sub, payload.username);
        res.json(pair);
    } catch {
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
}

export async function postLogout(req: Request, res: Response) {
    const user = req.user!;
    await logout(user.jti, user.id);
    res.status(204).end();
}
