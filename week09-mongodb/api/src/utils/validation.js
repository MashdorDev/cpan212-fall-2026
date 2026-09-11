// Turns a Mongoose ValidationError into { field: message }, the same "details" shape the API has
// used since Week 3. err.errors has one entry per invalid field.
export function messagesByField(validationError) {
  const messages = {};
  for (const [field, error] of Object.entries(validationError.errors)) {
    messages[field] = error.message;
  }
  return messages;
}
