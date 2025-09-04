import { Router } from 'express';
import { postLogin, postRefresh, postLogout } from './auth.controller.js';
import { auth } from '../../middlewares/auth.middleware.js';

const r = Router();
r.post('/login', postLogin);
r.post('/refresh', postRefresh);
r.post('/logout', auth(), postLogout);
export default r;
