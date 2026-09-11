import mongoose from 'mongoose';
import { HttpError } from './http-error.js';

// Loads one document by the id from the URL, or throws a 404.
// A string like "abc" can never be an ObjectId, so it can't match anything: answer 404 without asking
// the database. Without this check, findById("abc") throws a CastError instead.
export async function findByIdOr404(Model, id) {
  const doc = mongoose.isValidObjectId(id) ? await Model.findById(id) : null;
  if (!doc) {
    throw new HttpError(404, `${Model.modelName} not found`);
  }
  return doc;
}
