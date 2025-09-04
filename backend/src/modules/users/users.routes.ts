import { Router } from 'express';
import { postUser } from './users.controller.js';

const r = Router();
r.post('/', postUser);
export default r;
