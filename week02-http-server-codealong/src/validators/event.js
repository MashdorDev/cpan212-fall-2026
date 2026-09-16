export const CATEGORIES = ['academic', 'social', 'sports', 'career', 'arts'];

// Checks the fields a client sent and returns { value, errors }.
// value holds cleaned fields (trimmed text, startsAt as a UTC ISO string).
// errors maps each bad field to a message. An empty errors object means the input is valid.
export function validateEventInput(body) {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { value: {}, errors: { body: 'Send a JSON object' } };
  }

  const value = {};
  const errors = {};

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (title.length < 3 || title.length > 100) {
    errors.title = 'Title must be 3 to 100 characters';
  } else {
    value.title = title;
  }

  if (body.description === undefined) {
    value.description = '';
  } else if (typeof body.description !== 'string' || body.description.length > 2000) {
    errors.description = 'Description must be text, 2000 characters or fewer';
  } else {
    value.description = body.description.trim();
  }

  if (!CATEGORIES.includes(body.category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(', ')}`;
  } else {
    value.category = body.category;
  }

  const location = typeof body.location === 'string' ? body.location.trim() : '';
  if (location.length === 0 || location.length > 200) {
    errors.location = 'Location is required, up to 200 characters';
  } else {
    value.location = location;
  }

  // Date.parse accepts many loose formats, so also require the YYYY-MM-DDTHH:MM start of ISO 8601.
  if (
    typeof body.startsAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(body.startsAt) ||
    Number.isNaN(Date.parse(body.startsAt))
  ) {
    errors.startsAt = 'Start time must be an ISO 8601 date and time, for example 2026-10-14T18:00:00-04:00';
  } else {
    value.startsAt = new Date(body.startsAt).toISOString();
  }

  // TODO (you): STEP 9 - the capacity rule. Every other field is already checked for you.
  // Accept only a whole number from 1 to 1000: Number.isInteger first, then the range.
  // When it fails, set errors.capacity to 'Capacity must be a whole number from 1 to 1000'.
  // When it passes, copy the number into value.capacity.
  // "12" (a string) must not be accepted: JSON clients should send a number.

  if (body.imageUrl === undefined || body.imageUrl === null) {
    value.imageUrl = null;
  } else if (typeof body.imageUrl !== 'string' || !/^https?:\/\//.test(body.imageUrl) || body.imageUrl.length > 500) {
    errors.imageUrl = 'Image URL must start with http:// or https://';
  } else {
    value.imageUrl = body.imageUrl;
  }

  return { value, errors };
}
