import { Request, Response } from 'express';
import { CreateUserSchema } from '../../domain/dtos/user.dto.js';
import { create } from './users.services.js';
import { softDeleteUser } from './users.services.js';

export async function postUser(req: Request, res: Response) {
    // valida e tipa o body
    const dto = await CreateUserSchema.parseAsync(req.body);

    const out = await create(dto);
    res.status(201).json(out);
}

export async function deleteMe(req: Request, res: Response) {
    await softDeleteUser(req.user!.id);
    res.status(204).end();
}