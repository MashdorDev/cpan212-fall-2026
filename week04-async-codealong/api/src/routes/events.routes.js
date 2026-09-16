import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/events.controller.js';
// TODO (you): STEP 1 - on this line, import { checkHoliday } from '../controllers/holidays.controller.js'.
// That file already exists. It answers "not written yet" until you write it in steps 2 and 3.
import { validateEvent } from '../middleware/validate-event.js';

// Paths here are relative to where the router is mounted (/api/events in app.js).
export const eventsRouter = Router();

eventsRouter.get('/', listEvents);
eventsRouter.post('/', validateEvent(), createEvent);
eventsRouter.get('/:id', getEvent);
eventsRouter.patch('/:id', validateEvent({ partial: true }), updateEvent);
eventsRouter.delete('/:id', deleteEvent);
// TODO (you): STEP 1 - add the new route on this line, in the same shape as the five lines above:
// a GET on the path '/:id/holiday-check' that runs checkHoliday.
