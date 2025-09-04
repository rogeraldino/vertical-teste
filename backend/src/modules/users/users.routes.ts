// backend/src/modules/users/users.routes.ts
import { Router } from 'express';
import { postUser, deleteMe } from './users.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';

const r = Router();
r.post('/', postUser);
r.delete('/me', auth(), deleteMe);   // 🔒 requer login
export default r;
