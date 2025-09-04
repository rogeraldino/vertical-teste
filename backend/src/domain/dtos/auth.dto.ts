import { z } from 'zod';

export const LoginSchema = z.object({
    username: z.string().min(3).max(80),
    password: z.string().min(3).max(255),
});
export type LoginDTO = z.infer<typeof LoginSchema>;

export const RefreshSchema = z.object({
    refresh_token: z.string().min(10),
});
export type RefreshDTO = z.infer<typeof RefreshSchema>;

export type TokenPairDTO = { access_token: string; refresh_token: string };
