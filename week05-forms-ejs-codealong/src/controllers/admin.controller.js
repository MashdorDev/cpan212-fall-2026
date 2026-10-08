import { deleteEventById, findEventById, findEvents, insertEvent } from '../data/events.js';
import { CATEGORIES, validateEventInput } from '../validators/event.js';
import { torontoInputToIso } from '../utils/dates.js';
import { removeUpload } from '../utils/uploads.js';
import { HttpError } from '../utils/http-error.js';

// Each function answers "not written yet" until its step. The lesson page prints every function in
// full: replace everything between its braces, the throw included, with the version for your step.

// TODO (you): STEP 6 - EMPTY_FORM and renderNewEventForm go here.

export function listEventsPage(req, res) {
  // TODO (you): STEP 5 - render events-index with a title and every event.
  throw new HttpError(501, 'The events page is not written yet');
}

export function newEventPage(req, res) {
  // TODO (you): STEP 6 - render the empty form.
  throw new HttpError(501, 'The new event page is not written yet');
}

export async function createEventFromForm(req, res) {
  // TODO (you): STEP 7 - validate the form, and show it again with the errors.
  // TODO (you): STEP 8 - save a valid event and redirect with 303.
  // TODO (you): STEP 9f - keep the uploaded image.
  throw new HttpError(501, 'Saving an event from the form is not written yet');
}

export async function deleteEventFromForm(req, res) {
  // TODO (you): STEP 11b - replace this whole function: delete the event and its image, then redirect with 303.
  throw new HttpError(501, 'Deleting from the form is not written yet');
}
