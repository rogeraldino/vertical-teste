import { randomUUID } from 'node:crypto';
import { AppDataSource } from '../../config/data-source.js';
import { User } from '../../domain/entities/User.js';
import { UserLogin } from '../../domain/entities/UserLogin.js';
import { compare } from '../../utils/bcrypt.js';
import { signAccess, signRefresh, TokenPair } from '../../utils/jwt.js';

export async function login(username: string, password: string): Promise<TokenPair> {
    const userRepo = AppDataSource.getRepository(User);
    const loginRepo = AppDataSource.getRepository(UserLogin);

    const user = await userRepo.findOne({ where: { username } });
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const ok = await compare(password, user.password);
    if (!ok) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const jti = randomUUID();
    const loginRow = loginRepo.create({ id: jti, userId: user.id }); // id gerado na app
    await loginRepo.save(loginRow);

    const payload = { sub: user.id, username: user.username, jti };
    return { access_token: signAccess(payload), refresh_token: signRefresh(payload) };
}

export async function refresh(jti: string, sub: string, username: string): Promise<TokenPair> {
    const loginRepo = AppDataSource.getRepository(UserLogin);

    // Confirma que a sessão existe
    const exists = await loginRepo.findOne({ where: { id: jti, userId: sub } });
    if (!exists) throw Object.assign(new Error('Session not found'), { status: 401 });

    // ROTAÇÃO: cria um novo jti e remove o antigo
    await loginRepo.delete({ id: jti });
    const newJti = randomUUID();
    await loginRepo.save(loginRepo.create({ id: newJti, userId: sub }));

    const payload = { sub, username, jti: newJti };
    return { access_token: signAccess(payload), refresh_token: signRefresh(payload) };
}

export async function logout(jti: string, userId: string) {
    const loginRepo = AppDataSource.getRepository(UserLogin);
    await loginRepo.delete({ id: jti, userId });
}
