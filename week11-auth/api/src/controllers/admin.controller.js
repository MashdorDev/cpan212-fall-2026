import bcrypt from 'bcryptjs';
import { checkOrganizer } from '../middleware/require-auth.js';
import { CATEGORIES, Event } from '../models/Event.js';
import { Rsvp } from '../models/Rsvp.js';
import { User } from '../models/User.js';
import { SESSION_COOKIE_NAME } from '../session.js';
import { torontoInputToIso } from '../utils/dates.js';
import { findEventOr404 } from '../utils/find-event.js';
import { endUserSession, startUserSession } from '../utils/session.js';
import { removeUpload } from '../utils/uploads.js';

const FORM_FIELDS = ['title', 'description', 'category', 'location', 'startsAt', 'capacity'];

function renderNewEventForm(res, values, errors, status) {
  res.status(status).render('events-new', { title: 'New event', categories: CATEGORIES, values: values, errors: errors });
}

function renderLoginForm(res, email, error, status) {
  res.status(status).render('login', { title: 'Log in', email: email, error: error });
}

export function loginPage(req, res) {
  renderLoginForm(res, '', null, 200);
}

// The same check as POST /api/auth/login, answered with HTML instead of JSON.
export async function loginFromForm(req, res) {
  let email = '';
  let password = '';
  if (req.body) {
    email = String(req.body.email);
    password = String(req.body.password);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  let matches = false;
  if (user) {
    matches = await bcrypt.compare(password, user.passwordHash);
  }
  if (!matches) {
    return renderLoginForm(res, email, 'Email or password is incorrect', 401);
  }

  await startUserSession(req, user);
  res.redirect(303, '/admin/events');
}

export async function logoutFromForm(req, res) {
  await endUserSession(req);
  res.clearCookie(SESSION_COOKIE_NAME);
  res.redirect(303, '/admin/login');
}

export async function listEventsPage(req, res) {
  const events = await Event.find().sort({ startsAt: 1 });
  res.render('events-index', { title: 'Events', events: events });
}

export function newEventPage(req, res) {
  const values = {};
  for (const field of FORM_FIELDS) {
    values[field] = '';
  }
  renderNewEventForm(res, values, {}, 200);
}

export async function createEventFromForm(req, res) {
  // req.body is undefined when the request was neither a form nor JSON.
  let body = {};
  if (req.body) {
    body = req.body;
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = '/uploads/' + req.file.filename;
  }

  // Form fields always arrive as strings. Mongoose turns "40" into the number 40.
  const event = new Event({
    title: body.title,
    description: body.description,
    category: body.category,
    location: body.location,
    startsAt: torontoInputToIso(body.startsAt),
    capacity: body.capacity,
    imageUrl: imageUrl,
    organizer: req.user._id,
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

    // Show what they typed again, so they only fix the fields with a message.
    const values = {};
    for (const field of FORM_FIELDS) {
      values[field] = '';
      if (body[field] !== undefined) {
        values[field] = body[field];
      }
    }
    return renderNewEventForm(res, values, errors, 400);
  }

  await event.save();
  // Post/redirect/get: 303 See Other makes the browser load the list with a GET.
  // Refreshing that page then reloads the list instead of submitting the form a second time.
  res.redirect(303, '/admin/events');
}

export async function deleteEventFromForm(req, res) {
  const event = await findEventOr404(req.params.id);
  // The list only shows Delete on your own events, but anyone can send this POST by hand, so check here too.
  checkOrganizer(event, req.user);
  await event.deleteOne();
  await Rsvp.deleteMany({ event: event._id });
  await removeUpload(event.imageUrl);
  res.redirect(303, '/admin/events');
}
