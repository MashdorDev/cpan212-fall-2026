import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/events.controller.js';
import { checkHoliday } from '../controllers/holidays.controller.js';
import { createRsvp, listRsvps } from '../controllers/rsvps.controller.js';
import { requireAuth } from '../middleware/require-auth.js';

// Paths here are relative to where the router is mounted (/api/events in app.js).
// Reading is public. Anything that changes data, or shows attendees' emails, needs a logged-in user.
export const eventsRouter = Router();

// TODO STEP 6a: lock the routes that change events
// requireAuth runs first. It answers 401, or puts the user in req.user and calls the controller.
// Change the post, patch and delete lines below to:
//
//   eventsRouter.post('/', requireAuth, createEvent);
//   eventsRouter.patch('/:id', requireAuth, updateEvent);
//   eventsRouter.delete('/:id', requireAuth, deleteEvent);
//
// Check: run the first curl command in README.md (a POST with no cookie): 401 "Log in to do this".
eventsRouter.get('/', listEvents);
eventsRouter.post('/', createEvent);
eventsRouter.get('/:id', getEvent);
eventsRouter.patch('/:id', updateEvent);
eventsRouter.delete('/:id', deleteEvent);
eventsRouter.get('/:id/holiday-check', checkHoliday);
// TODO STEP 7a: lock the RSVP routes
// Change the two lines below to:
//
//   eventsRouter.post('/:id/rsvps', requireAuth, createRsvp);
//   eventsRouter.get('/:id/rsvps', requireAuth, listRsvps);
//
// Check: nothing yet. Step 7b uses req.user in createRsvp.
eventsRouter.post('/:id/rsvps', createRsvp);
eventsRouter.get('/:id/rsvps', listRsvps);
