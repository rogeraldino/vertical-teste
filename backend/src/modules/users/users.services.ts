// src/modules/users/users.services.ts
import { AppDataSource } from '../../config/data-source.js';
import { User } from '../../domain/entities/User.js';
import { hash } from '../../utils/bcrypt.js';
import type { FindOptionsWhere } from 'typeorm';
import type { CreateUserDTO } from '../../domain/dtos/user.dto.js';
import { UserLogin } from '../../domain/entities/UserLogin.js';
import { Post } from '../../domain/entities/Post.js';

export async function create({ username, password }: CreateUserDTO) {
    const repo = AppDataSource.getRepository(User);

    const where: FindOptionsWhere<User> = { username };
    const taken = !!(await repo.findOneBy({ username })); // simples
    if (taken) {
        const e = new Error('username taken'); (e as any).status = 409; throw e;
    }

    const u = repo.create({ username, password: await hash(password) });
    try {
        await repo.save(u);
    } catch (err: any) {
        if (err?.code === '23505') {
            const e = new Error('username taken'); (e as any).status = 409; throw e;
        }
        throw err;
    }
    return { id: u.id, username: u.username };
}

export async function softDeleteUser(userId: string) {
    return AppDataSource.transaction(async (trx) => {
        // marca deleted_at no usuário
        await trx.getRepository(User).update({id: userId}, {
            deletedAt: new Date(),
            updatedAt: new Date(),
        });

        // limpa sessões (user_logins) e posts do usuário
        await trx.getRepository(UserLogin).delete({userId});
        await trx.getRepository(Post).delete({userId});

        return {ok: true};
    });
}