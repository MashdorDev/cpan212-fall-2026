// TODO (you): STEP 11 - the validation middleware. Export a function that takes
// { partial = false } and returns a middleware function. That middleware calls
// validateEventInput(req.body, { partial }) from ../validators/event.js, which is written for you
// and returns { value, errors }. If errors has any keys, throw an HttpError with status 400 and
// the errors object as its details. Otherwise put the cleaned value into req.body and call next().
// You will need to import validateEventInput and HttpError at the top of this file.
export function validateEvent({ partial = false } = {}) {
  return (req, res, next) => next();
}
