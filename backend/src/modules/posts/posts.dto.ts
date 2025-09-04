// src/domain/dtos/post.dto.ts
import { z } from 'zod';
export const CreatePostSchema = z.object({
    title: z.string().min(1).max(140),
    message: z.string().min(1),
});
export type CreatePostDTO = z.infer<typeof CreatePostSchema>;
