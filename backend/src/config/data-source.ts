// src/config/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

function env(key: string, fallback?: string): string {
    const v = process.env[key] ?? fallback;
    if (v === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return v;
}

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env('DB_HOST'),
    port: Number(env('DB_PORT', '5432')),
    username: env('DB_USERNAME'),
    password: env('DB_PASSWORD'),
    database: env('DB_NAME'),
    synchronize: false,
    logging: false,
    entities: [
        new URL('../domain/entities/*.ts', import.meta.url).pathname,
        new URL('../domain/entities/*.js', import.meta.url).pathname,
    ],
    migrations: [
        new URL('../database/migrations/*.ts', import.meta.url).pathname,
        new URL('../database/migrations/*.js', import.meta.url).pathname,
    ],
});
