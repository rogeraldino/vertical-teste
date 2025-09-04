import bcrypt from 'bcrypt';
import { ENV } from '../config/env.js';

export const hash = (plain: string) =>
    bcrypt.hash(plain, ENV.BCRYPT_SALT_ROUNDS);

export const compare = (plain: string, hashed: string) =>
    bcrypt.compare(plain, hashed);
