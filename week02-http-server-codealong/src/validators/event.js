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

  // TODO (you): STEP 9 - write the capacity rule here, in the gap between the startsAt
  // rule above and the imageUrl rule below. This is the only piece missing from this file:
  // every other field is checked for you, and each rule follows the same if/else shape.
  // Write one `if` that catches every bad value, and an `else` for the good one:
  //   if (!Number.isInteger(body.capacity) || body.capacity < 1 || body.capacity > 1000) {
  // Number.isInteger(x) is true only for a whole number, so it rejects 4.5, and it also
  // rejects "45" with quotes, because that is a string, not a number. The two comparisons
  // after it reject anything outside 1 to 1000. The || means "or".
  // Inside the if, set errors.capacity to the string
  //   'Capacity must be a whole number from 1 to 1000'
  // Inside the else, copy the number across with value.capacity = body.capacity.
  // Only fields you put into `value` are saved, which is why leaving this rule out lets an
  // event save with no capacity at all.

  if (body.imageUrl === undefined || body.imageUrl === null) {
    value.imageUrl = null;
  } else if (typeof body.imageUrl !== 'string' || !/^https?:\/\//.test(body.imageUrl) || body.imageUrl.length > 500) {
    errors.imageUrl = 'Image URL must start with http:// or https://';
  } else {
    value.imageUrl = body.imageUrl;
  }

  return { value, errors };
}
