import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/events.controller.js';
import { checkHoliday } from '../controllers/holidays.controller.js';
import { createRsvp, listRsvps } from '../controllers/rsvps.controller.js';
import { requireAuth } from '../middleware/require-auth.js';

// Paths here are relative to where the router is mounted (/api/events in app.js).
// Reading is public. Anything that changes data needs a logged-in user (requireAuth), and the controllers
// check that the user is the event's organizer where it matters.
export const eventsRouter = Router();

eventsRouter.get('/', listEvents);
eventsRouter.post('/', requireAuth, createEvent);
eventsRouter.get('/:id', getEvent);
eventsRouter.patch('/:id', requireAuth, updateEvent);
eventsRouter.delete('/:id', requireAuth, deleteEvent);
eventsRouter.get('/:id/holiday-check', checkHoliday);
eventsRouter.post('/:id/rsvps', requireAuth, createRsvp);
eventsRouter.get('/:id/rsvps', requireAuth, listRsvps);
