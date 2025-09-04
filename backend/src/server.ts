import 'reflect-metadata';
import app from './app.js';
import { AppDataSource } from './config/data-source.js';
import { ENV } from './config/env.js';

(async () => {
    await AppDataSource.initialize();
    app.listen(ENV.PORT, () => {
        console.log(`API on http://localhost:${ENV.PORT}`);
    });
})();
