import { Router } from 'express';
import { login, logout, me, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/require-auth.js';

// Mounted at /api/auth in app.js.
export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, me);
