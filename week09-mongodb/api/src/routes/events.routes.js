import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/events.controller.js';
import { checkHoliday } from '../controllers/holidays.controller.js';

// Paths here are relative to where the router is mounted (/api/events in app.js).
// There is no validation middleware any more: the Event schema checks the fields.
export const eventsRouter = Router();

eventsRouter.get('/', listEvents);
eventsRouter.post('/', createEvent);
eventsRouter.get('/:id', getEvent);
eventsRouter.patch('/:id', updateEvent);
eventsRouter.delete('/:id', deleteEvent);
eventsRouter.get('/:id/holiday-check', checkHoliday);
