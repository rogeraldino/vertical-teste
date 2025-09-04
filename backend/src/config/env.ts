import * as dotenv from 'dotenv';
dotenv.config();

import type { SignOptions } from 'jsonwebtoken';
// 👇 remove o undefined do tipo
type Expires = NonNullable<SignOptions['expiresIn']>; // number | StringValue

function env(key: string, fallback?: string): string {
    const v = process.env[key] ?? fallback;
    if (v === undefined) throw new Error(`Missing env: ${key}`);
    return v;
}

// Converte "900" -> 900; aceita "15m", "7d", etc.
function parseExpires(key: string, fallback: string): Expires {
    const raw = process.env[key] ?? fallback;
    const n = Number(raw);
    if (!Number.isNaN(n)) return n as Expires;
    if (/^\d+(ms|s|m|h|d|w|y)$/i.test(raw)) return raw as Expires;
    throw new Error(`Invalid ${key}: use seconds (number) or formats like "15m", "7d".`);
}

export const ENV = {
    PORT: Number(env('PORT', '3000')),
    JWT_SECRET: env('JWT_SECRET'),
    JWT_ACCESS_EXPIRES_IN: parseExpires('JWT_ACCESS_EXPIRES_IN', '15m'),
    JWT_REFRESH_EXPIRES_IN: parseExpires('JWT_REFRESH_EXPIRES_IN', '7d'),
    BCRYPT_SALT_ROUNDS: Number(env('BCRYPT_SALT_ROUNDS', '10')),
};
