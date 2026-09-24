import { CATEGORIES, CONDITIONS } from '../data/tools.js';

// Runs before the POST and PUT routes. When the body is valid, it keeps only the
// five tool fields in req.body and calls next(), so the route runs. When it isn't,
// it answers 400 and the route never runs.
export function validateTool(req, res, next) {
  const body = req.body;

  // No JSON body at all, or JSON that isn't an object, like [1, 2] or "hello".
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return res.status(400).json({ error: { message: 'Request body must be a JSON object' } });
  }

  // Every rule that fails adds a message here, so the client sees all the problems at once.
  const errors = {};

  // name: text, 2 to 60 characters after trimming spaces from both ends.
  // This rule is done for you. Use it as the pattern for the other four.
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (name.length < 2 || name.length > 60) {
    errors.name = 'name must be 2 to 60 characters';
  }

  // TODO (you): STEP 4a. category must be one of CATEGORIES.
  //   CATEGORIES.includes(body.category) is true for a valid category.

  // TODO (you): STEP 4b. condition must be one of CONDITIONS.

  // TODO (you): STEP 4c. available must be the boolean true or false. The string "true" is invalid.
  //   typeof body.available === 'boolean' is true only for a real boolean.

  // TODO (you): STEP 4d. maxLoanDays must be a whole number from 1 to 14.
  //   Number.isInteger(body.maxLoanDays) is false for 2.5 and for "3".

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: { message: 'Validation failed', details: errors } });
  }

  // Only these five fields are passed on, so an "id" or any other extra field in the body is never saved.
  req.body = {
    name,
    category: body.category,
    condition: body.condition,
    available: body.available,
    maxLoanDays: body.maxLoanDays,
  };
  next();
}
