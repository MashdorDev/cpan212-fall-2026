import { Router } from 'express';
import {
  createEventFromForm,
  deleteEventFromForm,
  listEventsPage,
  loginFromForm,
  loginPage,
  logoutFromForm,
  newEventPage,
} from '../controllers/admin.controller.js';
import { requireAdminLogin } from '../middleware/require-auth.js';
import { uploadImage } from '../middleware/upload-image.js';
import { authLimiter } from '../security.js';

// Mounted at /admin in app.js. These routes send HTML pages, not JSON.
export const adminRouter = Router();

adminRouter.get('/login', loginPage);
// The same limiter object as the API login, so both forms share one count of 10 attempts per IP address.
adminRouter.post('/login', authLimiter, loginFromForm);
adminRouter.post('/logout', logoutFromForm);

// Every admin route below this line needs a logged-in user. Routes above it don't.
adminRouter.use(requireAdminLogin);

adminRouter.get('/events', listEventsPage);
adminRouter.get('/events/new', newEventPage);
adminRouter.post('/events', uploadImage, createEventFromForm);
// Deleting changes data, so it is a POST from a form. A GET link could be triggered by a crawler or a prefetch.
adminRouter.post('/events/:id/delete', deleteEventFromForm);
