import { Router } from 'express';
import { login, logout, me, register } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/require-auth.js';
import { authLimiter } from '../security.js';

// Mounted at /api/auth in app.js.
export const authRouter = Router();

// Only the two routes that check a password or create an account are limited to 10 attempts.
// GET /me runs on every page load of the web app, so limiting it would log people out of the header.
authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, me);
