import { deleteEventById, findEventById, findEvents, insertEvent, updateEventById } from '../data/events.js';
import { CATEGORIES } from '../validators/event.js';
import { HttpError } from '../utils/http-error.js';

// TODO (you): STEP 3 - the list controller. Read category and q from req.query, then answer with
// res.json({ data: findEvents({ category, q }) }). In STEP 6 you add two checks above that line.
export function listEvents(req, res) {
  res.status(501).json({ error: { message: 'Not written yet: listEvents' } });
}

// TODO (you): STEP 9 - one event. The id is in req.params.id. findEventById gives you the event or
// undefined. Nothing found is a 404 (throw an HttpError), found is res.json({ data: event }).
export function getEvent(req, res) {
  res.status(501).json({ error: { message: 'Not written yet: getEvent' } });
}

// TODO (you): STEP 10 - create. insertEvent(req.body) saves the event and returns it with its new id.
// Answer 201 with { data: event }, and set a Location header to /api/events/<the new id>.
export function createEvent(req, res) {
  res.status(501).json({ error: { message: 'Not written yet: createEvent' } });
}

// TODO (you): STEP 12 - update. updateEventById(req.params.id, req.body) returns the changed event,
// or undefined when no event has that id. undefined is a 404, an event is res.json({ data: event }).
export function updateEvent(req, res) {
  res.status(501).json({ error: { message: 'Not written yet: updateEvent' } });
}

// TODO (you): STEP 13 - delete. deleteEventById(req.params.id) returns true or false.
// false is a 404, true is a 204 with no body at all.
export function deleteEvent(req, res) {
  res.status(501).json({ error: { message: 'Not written yet: deleteEvent' } });
}
