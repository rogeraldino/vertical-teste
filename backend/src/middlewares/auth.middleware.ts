import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export function auth(required = true) {
    return (req: Request, res: Response, next: NextFunction) => {
        const h = req.headers.authorization;
        if (!h) return res.status(401).json({ error: 'Missing Authorization' });
        const [type, token] = h.split(' ');
        if (type !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid Authorization' });

        try {
            const payload = verifyToken<{ sub: string; username: string; jti: string }>(token);
            (req as any).user = { id: payload.sub, username: payload.username, jti: payload.jti };
            next();
        } catch {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}
