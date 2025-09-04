import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source.js';
import { User } from '../../domain/entities/User.js';
import { hash } from '../../utils/bcrypt.js';

export async function postUser(req: Request, res: Response) {
    const { username, password } = req.body ?? {};
    if (!username || !password) return res.status(400).json({ error: 'username/password required' });

    const repo = AppDataSource.getRepository(User);
    const exists = await repo.findOne({ where: { username } });
    if (exists) return res.status(409).json({ error: 'username taken' });

    const u = repo.create({ username, password: await hash(password) });
    await repo.save(u);
    res.status(201).json({ id: u.id, username: u.username });
}
