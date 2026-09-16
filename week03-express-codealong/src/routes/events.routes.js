import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../controllers/events.controller.js';
import { validateEvent } from '../middleware/validate-event.js';

// Paths here are relative to where the router is mounted (/api/events in app.js).
export const eventsRouter = Router();

// TODO (you): STEP 3 - GET / runs listEvents.
// TODO (you): STEP 10 - POST / runs createEvent. In STEP 11 you add validateEvent() in front of it.
// TODO (you): STEP 9 - GET /:id runs getEvent.
// TODO (you): STEP 12 - PATCH /:id runs validateEvent({ partial: true }), then updateEvent.
// TODO (you): STEP 13 - DELETE /:id runs deleteEvent.
