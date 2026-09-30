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

// TODO (you): STEP 5 - GET /events runs listEventsPage.
// TODO (you): STEP 6 - GET /events/new runs newEventPage.
// TODO (you): STEP 7 - POST /events runs createEventFromForm. In step 9, uploadImage goes in front of it.
// TODO (you): STEP 11 - POST /events/:id/delete runs deleteEventFromForm.
