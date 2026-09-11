import { CATEGORIES, Event } from '../models/Event.js';
import { torontoInputToIso } from '../utils/dates.js';
import { findByIdOr404 } from '../utils/find-by-id.js';
import { removeUpload } from '../utils/uploads.js';
import { messagesByField } from '../utils/validation.js';

const EMPTY_FORM = { title: '', description: '', category: '', location: '', startsAt: '', capacity: '' };

function renderNewEventForm(res, { values = EMPTY_FORM, errors = {}, status = 200 } = {}) {
  res.status(status).render('events-new', { title: 'New event', categories: CATEGORIES, values, errors });
}

export async function listEventsPage(req, res) {
  const events = await Event.find().sort({ startsAt: 1 });
  res.render('events-index', { title: 'Events', events });
}

export function newEventPage(req, res) {
  renderNewEventForm(res);
}

export async function createEventFromForm(req, res) {
  // req.body is undefined when the request was neither a form nor JSON.
  const body = req.body ?? {};
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Form fields always arrive as strings. Mongoose converts "40" to a number and the Toronto time
  // to a Date. An empty field becomes null, which the "required" rules then report.
  const event = new Event({
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    startsAt: torontoInputToIso(body.startsAt),
    capacity: body.capacity,
    imageUrl,
  });

  // validateSync() checks the schema without saving and returns the ValidationError (or undefined).
  const validationError = event.validateSync();
  const errors = validationError ? messagesByField(validationError) : {};
  if (req.uploadError) {
    errors.image = req.uploadError;
  }

  if (Object.keys(errors).length > 0) {
    // The event is not being saved, so don't keep its image either.
    await removeUpload(imageUrl);
    return renderNewEventForm(res, { values: { ...EMPTY_FORM, ...body }, errors, status: 400 });
  }

  await event.save();
  // Post/redirect/get: 303 See Other makes the browser load the list with a GET.
  // Refreshing that page then reloads the list instead of submitting the form a second time.
  res.redirect(303, '/admin/events');
}

export async function deleteEventFromForm(req, res) {
  const event = await findByIdOr404(Event, req.params.id);
  await event.deleteOne();
  await removeUpload(event.imageUrl);
  res.redirect(303, '/admin/events');
}
