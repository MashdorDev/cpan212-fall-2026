import { Router } from 'express';
import {
  createEventFromForm,
  deleteEventFromForm,
  listEventsPage,
  newEventPage,
} from '../controllers/admin.controller.js';
import { uploadImage } from '../middleware/upload-image.js';

// Mounted at /admin in app.js. These routes send HTML pages, not JSON.
export const adminRouter = Router();

adminRouter.get('/events', listEventsPage);
adminRouter.get('/events/new', newEventPage);
adminRouter.post('/events', uploadImage, createEventFromForm);
// Deleting changes data, so it is a POST from a form. A GET link could be triggered by a crawler or a prefetch.
adminRouter.post('/events/:id/delete', deleteEventFromForm);
