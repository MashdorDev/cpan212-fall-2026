import { validateEventInput } from '../validators/event.js';
import { HttpError } from '../utils/http-error.js';

// Returns a middleware, so routes can choose the mode: validateEvent() for POST,
// validateEvent({ partial: true }) for PATCH.
export function validateEvent({ partial = false } = {}) {
  return (req, res, next) => {
    const { value, errors } = validateEventInput(req.body, { partial });
    if (Object.keys(errors).length > 0) {
      throw new HttpError(400, 'Validation failed', errors);
    }
    // Controllers only ever see the cleaned fields, never extra ones like "id" or "createdAt".
    req.body = value;
    next();
  };
}
