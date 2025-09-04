import { z } from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(80),
    password: z.string().min(3).max(255),
});
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
