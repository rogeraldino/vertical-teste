import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { getMyPosts, createPost } from './posts.controller.js';

const r = Router();
r.get('/', auth(), getMyPosts);
r.post('/', auth(), createPost);
export default r;
