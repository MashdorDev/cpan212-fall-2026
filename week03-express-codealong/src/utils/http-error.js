// TODO (you): STEP 6 - an Error that also carries a status code and optional details, so that a
// controller can throw new HttpError(404, 'Event not found') and the error handler knows which
// status to answer with. Extend Error, take (status, message, details), pass the message to
// super() and save the other two on the object.
export class HttpError extends Error {}
