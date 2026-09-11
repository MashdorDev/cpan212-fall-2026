// Turns a Mongoose ValidationError into { field: message }, the same "details" shape the API has
// used since Week 3. err.errors has one entry per invalid field.
export function messagesByField(validationError) {
  const messages = {};
  for (const [field, error] of Object.entries(validationError.errors)) {
    // A value of the wrong type, like { "$ne": null } or an array for a text field. Paths with a custom cast
    // message (startsAt, capacity) keep it. Mongoose's own text ("Cast to string failed for value ...")
    // repeats the input back and names the model, so replace it with a short, consistent message.
    const isDefaultCastMessage = error.name === 'CastError' && error.message.startsWith('Cast to');
    messages[field] = isDefaultCastMessage ? `${field} has the wrong type` : error.message;
  }
  return messages;
}
