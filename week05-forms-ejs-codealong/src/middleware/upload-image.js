import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { UPLOADS_DIR } from '../utils/uploads.js';

// TODO (you): STEP 9 - MAX_IMAGE_BYTES, the EXTENSIONS table and the multer({ storage }) setup go here.
// TODO (you): STEP 10 - add limits and a fileFilter to that setup.

export function uploadImage(req, res, next) {
  // TODO (you): STEP 9 - run Multer for the "image" field. STEP 10 - turn a MulterError into req.uploadError.
  // Until then, requests pass straight through.
  next();
}
