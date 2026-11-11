import { CATEGORIES, Event } from '../models/Event.js';
import { torontoInputToIso } from '../utils/dates.js';
import { findEventOr404 } from '../utils/find-event.js';
import { removeUpload } from '../utils/uploads.js';

const EMPTY_FORM = { title: '', description: '', category: '', location: '', startsAt: '', capacity: '' };

function renderNewEventForm(res, { values = EMPTY_FORM, errors = {}, status = 200 } = {}) {
  res.status(status).render('events-new', { title: 'New event', categories: CATEGORIES, values, errors });
}

export async function listEventsPage(req, res) {
  const events = await Event.find().sort({ startsAt: 1 });
  res.render('events-index', { title: 'Events', events: events });
}

export function newEventPage(req, res) {
  renderNewEventForm(res);
}

export async function createEventFromForm(req, res) {
  // req.body is undefined when the request was neither a form nor JSON.
  const body = req.body ?? {};
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  // Form fields always arrive as strings. Mongoose turns "40" into the number 40.
  const event = new Event({
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    startsAt: torontoInputToIso(body.startsAt),
    capacity: body.capacity,
    imageUrl: imageUrl,
  });

  // validate() checks the schema rules without saving, so we can show the form again with messages.
  const errors = {};
  try {
    await event.validate();
  } catch (err) {
    for (const field in err.errors) {
      errors[field] = err.errors[field].message;
    }
  }
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
  const event = await findEventOr404(req.params.id);
  await event.deleteOne();
  await removeUpload(event.imageUrl);
  res.redirect(303, '/admin/events');
}
