import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/events.controller.js';
import { validateEvent } from '../middleware/validate-event.js';

// Paths here are relative to where the router is mounted (/api/events in app.js).
export const eventsRouter = Router();

eventsRouter.get('/', listEvents);
eventsRouter.post('/', validateEvent(), createEvent);
eventsRouter.get('/:id', getEvent);
eventsRouter.patch('/:id', validateEvent({ partial: true }), updateEvent);
eventsRouter.delete('/:id', deleteEvent);
