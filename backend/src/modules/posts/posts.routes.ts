import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { getMyPosts, createPost, getAllPosts } from './posts.controller.js';

const r = Router();
r.get('/', auth(), getMyPosts);
r.post('/', auth(), createPost);
r.get('/all', auth(), getAllPosts);
export default r;
