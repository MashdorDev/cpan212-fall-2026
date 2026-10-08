import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { UPLOADS_DIR } from '../utils/uploads.js';

// TODO (you): STEP 9 - the EXTENSIONS table and the multer({ storage }) setup go here.
// TODO (you): STEP 10 - import HttpError above, then add limits and fileFilter inside multer({ ... }), under storage.

export function uploadImage(req, res, next) {
  // TODO (you): STEP 9 - replace next() with upload.single('image')(req, res, next).
  // TODO (you): STEP 10 - replace that last argument, next, with a function that turns a too-big file into a 400.
  next();
}
