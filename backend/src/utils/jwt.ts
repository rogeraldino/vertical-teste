import jwt, {
    type JwtPayload,
    type Secret,
    type SignOptions,
    type Algorithm,
} from 'jsonwebtoken';
import { ENV } from '../config/env.js';

type JwtBase = { sub: string; username: string; jti: string; typ?: 'access' | 'refresh' };
export type TokenPair = { access_token: string; refresh_token: string };

const ALG: Algorithm = 'HS256';
type Expires = NonNullable<SignOptions['expiresIn']>;

function signWith(payload: object, expiresIn: Expires): string {
    const opts: SignOptions = { algorithm: ALG, expiresIn }; // agora nunca é undefined
    return jwt.sign(payload, ENV.JWT_SECRET as Secret, opts);
}

export function signAccess(payload: Omit<JwtBase, 'typ'>): string {
    return signWith({ ...payload, typ: 'access' }, ENV.JWT_ACCESS_EXPIRES_IN);
}

export function signRefresh(payload: Omit<JwtBase, 'typ'>): string {
    return signWith({ ...payload, typ: 'refresh' }, ENV.JWT_REFRESH_EXPIRES_IN);
}

export function verifyToken<T = any>(token: string): T {
    return jwt.verify(token, ENV.JWT_SECRET as Secret) as unknown as T;
}
