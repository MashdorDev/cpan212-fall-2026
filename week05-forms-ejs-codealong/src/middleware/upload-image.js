import { randomUUID } from 'node:crypto';
import multer from 'multer';
import { UPLOADS_DIR } from '../utils/uploads.js';
// TODO (you): STEP 10a - import HttpError on the next line.

// TODO (you): STEP 9a - EXTENSIONS, chooseFileName, storage and upload go here.
// TODO (you): STEP 10b - checkFileType goes under chooseFileName.
// TODO (you): STEP 10c - TWO_MB goes above upload, and upload gets limits and fileFilter.

export function uploadImage(req, res, next) {
  // TODO (you): STEP 9b - replace next() with Multer reading the "image" field.
  // TODO (you): STEP 10d - replace this whole function.
  next();
}
