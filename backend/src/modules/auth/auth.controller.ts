import { Request, Response } from 'express';
import { verifyToken } from '../../utils/jwt.js';
import { login, refresh, logout } from './auth.service.js';
import { LoginSchema, RefreshSchema } from '../../domain/dtos/auth.dto.js';


export async function postLogin(req: Request, res: Response) {
    const { username, password } = await LoginSchema.parseAsync(req.body);
    const pair = await login(username, password);
    res.json(pair);
}

export async function postRefresh(req: Request, res: Response) {
    const { refresh_token } = await RefreshSchema.parseAsync(req.body);
    try {
        const p = verifyToken<{ sub: string; username: string; jti: string; typ?: string }>(refresh_token);
        if (p.typ !== 'refresh') return res.status(401).json({ error: 'Wrong token type' });
        const pair = await refresh(p.jti, p.sub, p.username);
        res.json(pair);
    } catch { res.status(401).json({ error: 'Invalid or expired refresh token' }); }
}

export async function postLogout(req: Request, res: Response) {
    const user = req.user!;
    await logout(user.jti, user.id);
    res.status(204).end();
}
