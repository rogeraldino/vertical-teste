import { Router } from 'express';
import authRoutes from '../modules/auth/auth.rotes.js';
import userRoutes from '../modules/users/users.routes.js';
import postRoutes from '../modules/posts/posts.routes.js';

const r = Router();
r.use('/auth', authRoutes);
r.use('/users', userRoutes);
r.use('/posts', postRoutes);
export default r;
