import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source.js';
import { Post } from '../../domain/entities/Post.js';

export async function getMyPosts(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Post);
    const list = await repo.find({ where: { userId: req.user!.id }, order: { createdAt: 'DESC' } });
    res.json(list);
}

export async function createPost(req: Request, res: Response) {
    const { title, message } = req.body ?? {};
    if (!title || !message) return res.status(400).json({ error: 'title/message required' });

    const repo = AppDataSource.getRepository(Post);
    const p = repo.create({ title, message, userId: req.user!.id });
    await repo.save(p);
    res.status(201).json(p);
}
