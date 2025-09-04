// src/modules/posts/posts.controller.ts
import { Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source.js';
import { Post } from '../../domain/entities/Post.js';
import { CreatePostSchema } from '../../domain/dtos/post.dto.js';

export async function getMyPosts(req: Request, res: Response) {
    const repo = AppDataSource.getRepository(Post);
    const list = await repo.find({ where: { userId: req.user!.id }, order: { createdAt: 'DESC' } });
    res.json(list);
}

export async function createPost(req: Request, res: Response) {
    const dto = await CreatePostSchema.parseAsync(req.body);
    const repo = AppDataSource.getRepository(Post);
    const p = repo.create({ ...dto, userId: req.user!.id });
    await repo.save(p);
    res.status(201).json(p);
}

/**
 * GET /posts/all
 * Query params:
 *   page?: number = 1
 *   size?: number = 10 (máx 100)
 *   username?: string (filtro ILIKE)
 * Retorna: { data: Array<{ ...post, username }>, page, size, total }
 */
export async function getAllPosts(req: Request, res: Response) {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const size = Math.min(Math.max(Number(req.query.size ?? 10), 1), 100);
    const username = (req.query.username as string | undefined)?.trim();

    const repo = AppDataSource.getRepository(Post);
    const qb = repo
        .createQueryBuilder('p')
        .innerJoin('p.user', 'u')
        .select([
            'p.id',
            'p.userId',
            'p.title',
            'p.message',
            'p.createdAt',
            'u.id',
            'u.username', // seleciona só o necessário (não traz password)
        ])
        .orderBy('p.createdAt', 'DESC')
        .skip((page - 1) * size)
        .take(size);

    if (username) qb.andWhere('u.username ILIKE :username', { username: `%${username}%` });

    const [rows, total] = await qb.getManyAndCount();

    // modela a resposta incluindo username no nível do post
    const data = rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        title: r.title,
        message: r.message,
        createdAt: r.createdAt,
        username: (r as any).user?.username, // foi selecionado via join
    }));

    res.json({ data, page, size, total });
}
