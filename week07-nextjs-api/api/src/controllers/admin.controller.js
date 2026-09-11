import { deleteEventById, findEventById, findEvents, insertEvent } from '../data/events.js';
import { CATEGORIES, validateEventInput } from '../validators/event.js';
import { torontoInputToIso } from '../utils/dates.js';
import { removeUpload } from '../utils/uploads.js';
import { HttpError } from '../utils/http-error.js';

const EMPTY_FORM = { title: '', description: '', category: '', location: '', startsAt: '', capacity: '' };

function renderNewEventForm(res, { values = EMPTY_FORM, errors = {}, status = 200 } = {}) {
  res.status(status).render('events-new', { title: 'New event', categories: CATEGORIES, values, errors });
}

export function listEventsPage(req, res) {
  res.render('events-index', { title: 'Events', events: findEvents() });
}

export function newEventPage(req, res) {
  renderNewEventForm(res);
}

export async function createEventFromForm(req, res) {
  // req.body is undefined when the request was neither a form nor JSON.
  const body = req.body ?? {};
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Form fields always arrive as strings. Convert them to the types the validator expects.
  const { value, errors } = validateEventInput({
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    startsAt: torontoInputToIso(body.startsAt),
    capacity: Number(body.capacity),
    imageUrl,
  });
  if (req.uploadError) {
    errors.image = req.uploadError;
  }

  if (Object.keys(errors).length > 0) {
    // The event is not being saved, so don't keep its image either.
    await removeUpload(imageUrl);
    return renderNewEventForm(res, { values: { ...EMPTY_FORM, ...body }, errors, status: 400 });
  }

  insertEvent(value);
  // Post/redirect/get: 303 See Other makes the browser load the list with a GET.
  // Refreshing that page then reloads the list instead of submitting the form a second time.
  res.redirect(303, '/admin/events');
}

export async function deleteEventFromForm(req, res) {
  const event = findEventById(req.params.id);
  if (!event) {
    throw new HttpError(404, 'Event not found');
  }
  deleteEventById(event.id);
  await removeUpload(event.imageUrl);
  res.redirect(303, '/admin/events');
}
