import 'reflect-metadata';
import { AppDataSource } from '../../config/data-source.js';
import { User } from '../../domain/entities/User.js';
import { hash } from '../../utils/bcrypt.js';

(async () => {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(User);

    const username = 'admin';
    const exists = await repo.findOne({ where: { username } });
    if (exists) {
        console.log('Admin já existe');
    } else {
        const u = repo.create({ username, password: await hash('admin') });
        await repo.save(u);
        console.log('Admin criado:', u.id);
    }
    process.exit(0);
})();
